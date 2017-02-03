(function() {
  'use strict';
  angular
    .module('app')
    .provider('Luis', LuisProvider);

  LuisProvider.$inject = [];

  function LuisProvider() {
    this.$get = Luis;

    var $luisApiUrl = 'https://westus.api.cognitive.microsoft.com/luis/v1.0/prog/apps';
    this.setLuisApiUrl = function (luisApiUrl) {
      $luisApiUrl = luisApiUrl;
    };

    Luis.$inject = ['$http', '$log', '$rootScope'];

    function Luis($http, $log, $rootScope) {
      var service = {
        useSubscriptionKey: useSubscriptionKey,
        useApplication: useApplication,
        getApplication: getApplication,
        getApplications: getApplications,
        predict: predict
      };

      var $subscriptionKey;
      var $application;

      function useSubscriptionKey(subscriptionKey) {
        $subscriptionKey = subscriptionKey;
      }

      function useApplication(application) {
        $application = application;
      }

      function getApplication() {
        return $application;
      }

      function getApplications() {
        if (!$subscriptionKey) {
          throw new Error('You must set the subscriptionKey first');
        }
        return $http.get($luisApiUrl, {
          headers: {
            'Ocp-Apim-Subscription-Key': $subscriptionKey
          }
        }).then(function (response) {
          var data = response.data;
          return data.map(function (application) {
            return {
              name: application.Name,
              appId: application.ID
            };
          });
        });
      }

      function predict(utterance) {
        if (!$subscriptionKey) {
          throw new Error('You must set the subscriptionKey first');
        }
        if (!$application) {
          throw new Error("You must define at least one Luis application");
        }
        $rootScope.$emit('luis:predict', {
          application: $application,
          utterance: utterance
        });
        var predictEndpoint = $luisApiUrl + "/" + $application.appId + "/predict";
        var data = [];
        data.push(utterance);
        return $http.post(predictEndpoint, data, {
          headers: {
            'Ocp-Apim-Subscription-Key': $subscriptionKey
          }
        }).then(function(response) {
          return getIntent(getJsonData(response));
        });
      }

      function getJsonData(response) {
        if (response && response.status === 200) {
          return response.data[0];
        }
        throw new Error("Natural Language Understanding failed");
      }

      function descOrder(a, b) {
        return b.score - a.score;
      }

      function getIntent(intentResponse) {
        var intent = intentResponse.IntentsResults.sort(descOrder)[0].Name;
        var expression = intentResponse.utteranceText;
        var entities = intentResponse.EntitiesResults.map(function (entity) {
          return {
            name: entity.name,
            word: entity.word,
            indeces: {
              start: entity.indeces.startToken,
              end: entity.indeces.endToken
            }
          };
        });

        var response = {
          application: $application,
          expression: expression,
          intent: intent,
          entities: entities
        };

        $rootScope.$emit('luis:getIntent', response);
        return response;
      }

      return service;
    }
  }
})();
