(function () {
  'use strict';

  angular
    .module('app')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('app', {
      abstract: true,
      template: '<ui-view/>'
    });
  }
})();
