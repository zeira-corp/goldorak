(function () {
  'use strict';
  angular
    .module('app')
    .provider('Luis', LuisProvider);

  LuisProvider.$inject = [];

  function LuisProvider() {
    this.$get = Luis;

    var $luisApiUrl = 'https://westus.api.cognitive.microsoft.com/luis/v1.0/prog/apps/';
    var $defaultApplication;

    this.setLuisApiUrl = function (luisApiUrl) {
      $luisApiUrl = luisApiUrl;
    };

    this.setDefaultApplication = function (defaultApplication) {
      $defaultApplication = defaultApplication;
    };

    Luis.$inject = ['$http', '$log', '$rootScope'];

    function Luis($http, $log, $rootScope) {
      var service = {
        useApplication: useApplication,
        getApplication: getApplication,
        predict: predict
      };

      var $application;

      function useApplication(application) {
        $application = application;
      }

      function getApplication() {
        return $application;
      }

      if (!$application && $defaultApplication) {
        useApplication($defaultApplication);
      } else {
        throw new Error("You must define at least one Luis application");
      }

      function predict(utterance) {
        $rootScope.$emit('luis:predict', {
          application: $application,
          utterance: utterance
        });
        var predictEndpoint = $luisApiUrl + $application.appId + "/predict";
        var data = [];
        data.push(utterance);
        return $http.post(predictEndpoint, data, {
          headers: {
            'Ocp-Apim-Subscription-Key': $application.subscriptionKey
          }
        }).then(function (response) {
          return getIntent(getJsonData(response));
        });
      }

      function getJsonData(response) {
        if (response && response.status === 200) {
          return response.data[0];
        }
        throw new Error("Natural Language Understanding failed");
      }

      function getIntent(intentResponse) {
        var intent = {
          application: $application,
          intent: intentResponse.IntentsResults[0].Name,
          entities: intentResponse.EntitiesResults
        };
        $rootScope.$emit('luis:getIntent', intent);
        return intent;
      }

      return service;
    }
  }
})();
