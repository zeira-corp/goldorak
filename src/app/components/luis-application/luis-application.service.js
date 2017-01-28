(function () {
  'use strict';

  angular
    .module('app')
    .factory('LuisApplicationService', LuisApplicationService);

  LuisApplicationService.$inject = ['Luis', 'LUIS_APPLICATIONS'];

  function LuisApplicationService(Luis, LUIS_APPLICATIONS) {
    var service = {
      getAll: getAll,
      getCurrent: getCurrent,
      useApplication: useApplication
    };

    return service;

    function getAll() {
      return LUIS_APPLICATIONS;
    }

    function getCurrent() {
      return Luis.getApplication();
    }

    function useApplication(application) {
      Luis.useApplication(application);
    }
  }
})();
