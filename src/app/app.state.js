(function () {
  'use strict';

  angular
    .module('app')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('app', {
      abstract: true,
      template: '<ui-view class="fill"/>',
      resolve: {
        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
          $translatePartialLoader.addPart('global');
          return $translate.refresh();
        }]
      }
    });
  }
})();
