(function () {
  'use strict';
  angular
    .module('app')
    .provider('BingSpeech', BingSpeechProvider);

  BingSpeechProvider.$inject = [];

  function BingSpeechProvider() {
    this.$get = BingSpeech;

    var $defaultSubscriptionKey;
    var $BingSpeechApiUrl = 'https://speech.platform.bing.com';
    var $issueTokenUrl = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken';

    this.useDefaultSubscriptionKey = function (defaultSubscriptionKey) {
      $defaultSubscriptionKey = defaultSubscriptionKey;
    };

    BingSpeech.$inject = ['$log', '$http', '$localStorage', '$q', 'uuid4'];

    function BingSpeech($log, $http, $localStorage, $q, uuid4) {
      var service = {
        recognize: recognize,
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
        return getToken($subscriptionKey).then(function (token) {
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
        .then(function (response) {
          return getSpeechResponse(getJsonData(response));
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
          }).then(function (response) {
            token = response.data;
            storeToken(token);
            deferred.resolve(token);
          }).catch(function (error) {
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
