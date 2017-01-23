(function () {
  'use strict';
  angular
    .module('app')
    .factory('Settings', Settings);

  Settings.$inject = ['$log', '$q', '$localStorage', 'LanguageService'];

  function Settings($log, $q, $localStorage, LanguageService) {
    var service = {
      save: save,
      load: load
    };

    var defaults = {
      stt: {
        locale: 'en-US'
      }
    };

    var settings = load();
    if (!settings) {
      save(defaults);
    }

    function save(settings) {
      settings = Object.assign({}, defaults, settings);
      LanguageService.changeLanguage(settings.stt.locale);
      $localStorage.settings = settings;
    }

    function load() {
      return $localStorage.settings;
    }

    return service;
  }
})();
