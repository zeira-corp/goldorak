(function () {
  'use strict';

  angular
    .module('app')
    .factory('settingssHandler', settingssHandler);

  settingssHandler.$inject = ['$rootScope', 'Hears', 'LanguageService', 'Luis'];

  function settingssHandler($rootScope, Hears, LanguageService, Luis) {
    return {
      initialize: initialize
    };

    function initialize() {
      var settingsSavedSuccess = $rootScope.$on('settings:saved', function (event, settings) {
        Hears.useLocale(settings.stt.locale);
        LanguageService.changeLanguage(settings.stt.locale);
        Luis.useApplication(settings.nlu.application);
      });

      $rootScope.$on('$destroy', function () {
        if (angular.isDefined(settingsSavedSuccess) && settingsSavedSuccess !== null) {
          settingsSavedSuccess();
        }
      });
    }
  }
})();
