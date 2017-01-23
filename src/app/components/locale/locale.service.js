(function () {
  'use strict';
  angular
    .module('app')
    .factory('LocaleService', LocaleService);

  LocaleService.$inject = ['LOCALES'];

  function LocaleService(LOCALES) {
    var service = {
      getAll: getAll
    };

    function getAll() {
      return LOCALES;
    }

    return service;
  }
})();
