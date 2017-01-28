(function () {
  'use strict';

  angular
    .module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$log', '$state', 'Settings', 'locales', 'luisApplications'];

  function SettingsController($log, $state, Settings, locales, luisApplications) {
    var vm = this;
    vm.save = save;
    vm.settings = Settings.load();
    vm.locales = locales;
    vm.luisApplciations = luisApplications;

    function save() {
      Settings.save(vm.settings);
      $state.go('home');
    }
  }
})();
