(function() {
  'use strict';
  angular
    .module('app')
    .factory('Settings', Settings);

  Settings.$inject = ['$localStorage', '$log', '$rootScope', 'DEFAULTS'];

  function Settings($localStorage, $log, $rootScope, DEFAULTS) {
    var service = {
      save: save,
      load: load,
      reset: reset
    };

    var defaults = DEFAULTS;

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

    function reset() {
      save(DEFAULTS);
    }

    return service;
  }
})();
