(function() {
  'use strict';
  angular
    .module('app')
    .provider('BingSpeech', BingSpeechProvider);

  BingSpeechProvider.$inject = [];

  function BingSpeechProvider() {
    //Inspired by https://github.com/palmerabollo/bingspeech-api-client
    this.$get = BingSpeech;

    var $defaultSubscriptionKey;
    var $BingSpeechApiUrl = 'https://speech.platform.bing.com';
    var $issueTokenUrl = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken';

    var $smmlTemplate = "<speak version=\"1.0\" xml:lang=\"%LOCALE%\"> <voice name=\"%FONT%\" xml:lang=\"%LOCALE%\" xml:gender=\"%GENDER%\">%TEXT%</voice></speak>";

    var $voices = {
      'ar-EG female': 'Microsoft Server Speech Text to Speech Voice (ar-EG, Hoda)',
      'de-DE female': 'Microsoft Server Speech Text to Speech Voice (de-DE, Hedda)',
      'de-DE male': 'Microsoft Server Speech Text to Speech Voice (de-DE, Stefan, Apollo)',
      'en-AU female': 'Microsoft Server Speech Text to Speech Voice (en-AU, Catherine)',
      'en-CA female': 'Microsoft Server Speech Text to Speech Voice (en-CA, Linda)',
      'en-GB female': 'Microsoft Server Speech Text to Speech Voice (en-GB, Susan, Apollo)',
      'en-GB male': 'Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)',
      'en-IN male': 'Microsoft Server Speech Text to Speech Voice (en-IN, Ravi, Apollo)',
      'en-US female': 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)',
      'en-US male': 'Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)',
      'es-ES female': 'Microsoft Server Speech Text to Speech Voice (es-ES, Laura, Apollo)',
      'es-ES male': 'Microsoft Server Speech Text to Speech Voice (es-ES, Pablo, Apollo)',
      'es-MX male': 'Microsoft Server Speech Text to Speech Voice (es-MX, Raul, Apollo)',
      'fr-CA female': 'Microsoft Server Speech Text to Speech Voice (fr-CA, Caroline)',
      'fr-FR female': 'Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)',
      'fr-FR male': 'Microsoft Server Speech Text to Speech Voice (fr-FR, Paul, Apollo)',
      'it-IT male': 'Microsoft Server Speech Text to Speech Voice (it-IT, Cosimo, Apollo)',
      'ja-JP female': 'Microsoft Server Speech Text to Speech Voice (ja-JP, Ayumi, Apollo)',
      'ja-JP male': 'Microsoft Server Speech Text to Speech Voice (ja-JP, Ichiro, Apollo)',
      'pt-BR male': 'Microsoft Server Speech Text to Speech Voice (pt-BR, Daniel, Apollo)',
      'ru-RU female': 'Microsoft Server Speech Text to Speech Voice (ru-RU, Irina, Apollo)',
      'ru-RU male': 'Microsoft Server Speech Text to Speech Voice (ru-RU, Pavel, Apollo)',
      'zh-CN female': 'Microsoft Server Speech Text to Speech Voice (zh-CN, Yaoyao, Apollo)',
      'zh-CN male': 'Microsoft Server Speech Text to Speech Voice (zh-CN, Kangkang, Apollo)',
      'zh-HK female': 'Microsoft Server Speech Text to Speech Voice (zh-HK, Tracy, Apollo)',
      'zh-HK male': 'Microsoft Server Speech Text to Speech Voice (zh-HK, Danny, Apollo)',
      'zh-TW female': 'Microsoft Server Speech Text to Speech Voice (zh-TW, Yating, Apollo)',
      'zh-TW male': 'Microsoft Server Speech Text to Speech Voice (zh-TW, Zhiwei, Apollo)'
    };

    this.useDefaultSubscriptionKey = function(defaultSubscriptionKey) {
      $defaultSubscriptionKey = defaultSubscriptionKey;
    };

    BingSpeech.$inject = ['$log', '$http', '$localStorage', '$q', 'uuid4'];

    function BingSpeech($log, $http, $localStorage, $q, uuid4) {
      var service = {
        recognize: recognize,
        synthesize: synthesize,
        useSubscriptionKey: useSubscriptionKey
      };

      var $subscriptionKey;

      function useSubscriptionKey(subscriptionKey) {
        $subscriptionKey = subscriptionKey;
      }

      function recognize(audio, locale) {
        if (!$subscriptionKey) {
          throw new Error('You must set the subscriptionKey first');
        }
        $log.debug("Recognizing audio with locale: " + locale);
        return getToken($subscriptionKey).then(function(token) {
            return $http.post($BingSpeechApiUrl + '/recognize', audio, {
              params: {
                'version': '3.0',
                'requestid': uuid4.generate(),
                'appID': 'D4D52672-91D7-4C74-8AD8-42B1D98141A5', // magic value as per MS docs,
                'format': 'json',
                'locale': locale,
                'device.os': '0_0',
                'scenarios': 'ulm',
                'instanceid': uuid4.generate()
              },
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'audio/wav; samplerate=44100'
              }
            });
          })
          .then(function(response) {
            return getSpeechResponse(getJsonData(response));
          });
      }

      function synthesize(text, locale, gender) {
        if (!$subscriptionKey) {
          throw new Error('You must set the subscriptionKey first');
        }
        var font = $voices[locale + " " + gender];
        $log.debug("Synthetizing text \"" + text + "\" with locale: " + locale + ", gender: " + gender + " and font: " + font);
        var ssml = $smmlTemplate
          .replace(/%LOCALE%/gi, locale)
          .replace(/%GENDER%/gi, gender)
          .replace(/%FONT%/gi, font)
          .replace(/%TEXT%/gi, text);
        return getToken($subscriptionKey).then(function (token) {
          return $http.post($BingSpeechApiUrl + '/synthesize', ssml, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'audio/basic',
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/ssml+xml',
              'X-Microsoft-OutputFormat': 'riff-8khz-8bit-mono-mulaw',
              'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
              'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960'
            }
          });
        });
      }

      function getJsonData(response) {
        if (response) {
          return response.data;
        }
        throw new Error("Bing Speech recognition's reponse is empty");
      }

      function getSpeechResponse(speechResponse) {
        if (speechResponse.header.status === "success") {
          var text = speechResponse.header.lexical;
          $log.debug('Here: ' + text);
          return text.charAt(0).toUpperCase() + text.slice(1);
        }
        throw new Error("Speech recognition failed");
      }

      function getToken(subscriptionKey) {
        var deferred = $q.defer();
        var token = $localStorage.authenticationToken;
        var tokenExpirationDate = $localStorage.tokenExpirationDate;

        if (token && tokenExpirationDate > Date.now()) {
          deferred.resolve(token);
        } else {
          $http.post($issueTokenUrl, {}, {
            headers: {
              'Ocp-Apim-Subscription-Key': subscriptionKey
            }
          }).then(function(response) {
            token = response.data;
            storeToken(token);
            deferred.resolve(token);
          }).catch(function(error) {
            $log.error("Unable to authenticate the request with subscription key: " + subscriptionKey);
            deferred.reject(error);
          });
        }
        return deferred.promise;
      }

      function storeToken(token) {
        $localStorage.authenticationToken = token;
        //      Refresh access token every 9 minutes
        $localStorage.tokenExpirationDate = Date.now() + 9 * 60 * 1000;
      }

      return service;
    }
  }
})();
