(function () {
  'use strict';
  angular
    .module('app')
    .factory('Luis', Luis);

  Luis.$inject = ['$log', '$q', '$http', 'LUIS_SUBSCRIPTION_KEY', 'LUIS_APP_ID'];

  function Luis($log, $q, $http, LUIS_SUBSCRIPTION_KEY, LUIS_APP_ID) {
    var service = {
      predict: predict
    };

    var LUIS_API = 'https://westus.api.cognitive.microsoft.com/luis/v1.0/prog/apps/' + LUIS_APP_ID;

    function predict(ulterance) {
      var data = [];
      data.push(ulterance);
      return $http.post(LUIS_API + "/predict", data, {
        headers: {
          'Ocp-Apim-Subscription-Key': LUIS_SUBSCRIPTION_KEY
        }
      });
    }

    return service;
  }
})();
