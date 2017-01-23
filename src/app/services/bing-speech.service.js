(function () {
  'use strict';
  angular
    .module('app')
    .factory('BingSpeech', BingSpeech);

  BingSpeech.$inject = ['$log', 'uuid4', '$q', '$http', '$localStorage', 'BING_SPEECH_SUBSCRIPTION_KEY'];

  function BingSpeech($log, uuid4, $q, $http, $localStorage, BING_SPEECH_SUBSCRIPTION_KEY) {
    var service = {
      recognize: recognize
    };

    function recognize(audio, locale) {
      $log.debug("Recognizing audio with locale: " + locale);
      return getToken(BING_SPEECH_SUBSCRIPTION_KEY).then(function (token) {
        return $http.post('https://speech.platform.bing.com/recognize', audio, {
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
        return getSpeechResponse(toJson(response));
      })
      .catch(function (error) {
        throw error;
      });
    }

    function toJson(response) {
      if (response) {
        return response.data;
      }
      throw new Error("Bing Speech recognition's reponse is empty");
    }

    function getSpeechResponse(speechResponse) {
      if (speechResponse.header.status === "success") {
        var text = speechResponse.header.lexical;
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
        $http.post('https://api.cognitive.microsoft.com/sts/v1.0/issueToken', {}, {
          headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
          }
        }).then(function (response) {
          token = response.data;
          storeToken(token);
          deferred.resolve(token);
        }).catch(function (error) {
          $log.error("Unable to authenticate the request with subscription key: " + BING_SPEECH_SUBSCRIPTION_KEY);
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
})();
