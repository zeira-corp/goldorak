(function () {
  'use strict';

  angular
    .module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$log', '$state', 'Settings', 'locales'];

  function SettingsController($log, $state, Settings, locales) {
    var vm = this;
    vm.save = save;
    vm.settings = Settings.load();
    vm.locales = locales;

    function save() {
      Settings.save(vm.settings);
      $state.go('home');
    }
  }
})();
