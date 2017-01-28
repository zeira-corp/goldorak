(function () {
  'use strict';
  angular
    .module('app')
    .factory('Settings', Settings);

  Settings.$inject = ['$localStorage', '$log', '$rootScope'];

  function Settings($localStorage, $log, $rootScope) {
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
      $localStorage.settings = settings;
      $rootScope.$emit('settings:saved', settings);
    }

    function load() {
      return $localStorage.settings;
    }

    return service;
  }
})();
