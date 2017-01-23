(function () {
  'use strict';

  angular
    .module('app')
    .config(localStorageConfig);

  localStorageConfig.$inject = ['$localStorageProvider', '$sessionStorageProvider'];

  function localStorageConfig($localStorageProvider, $sessionStorageProvider) {
    $localStorageProvider.setKeyPrefix('goldorak-');
    $sessionStorageProvider.setKeyPrefix('goldorak-');
  }
})();
