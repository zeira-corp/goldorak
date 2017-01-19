(function () {
  'use strict';

  angular
    .module('app')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider
      .state('settings', {
        parent: 'app',
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm'
          // ,
          // resolve: {
          //     translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
          //         $translatePartialLoader.addPart('dashboard');
          //         $translatePartialLoader.addPart('global');
          //         return $translate.refresh();
          //     }]
          // }
      });
  }
})();
