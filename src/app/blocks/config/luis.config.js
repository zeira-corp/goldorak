(function () {
  'use strict';

  angular
    .module('app')
    .config(LuisConfig);

  LuisConfig.$inject = ['LuisProvider', 'LUIS_APPLICATIONS'];

  function LuisConfig(LuisProvider, LUIS_APPLICATIONS) {
    LuisProvider.setDefaultApplication(LUIS_APPLICATIONS[0]);
  }
})();
