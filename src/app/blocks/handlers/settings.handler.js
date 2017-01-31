(function () {
  'use strict';

  angular
    .module('app')
    .factory('settingssHandler', settingssHandler);

  settingssHandler.$inject = ['$rootScope', 'Settings', 'Hears', 'Brain', 'LanguageService', 'Luis', 'BingSpeech'];

  function settingssHandler($rootScope, Settings, Hears, Brain, LanguageService, Luis, BingSpeech) {
    return {
      initialize: initialize
    };

    function initialize() {
      update(Settings.load());

      var settingsSavedSuccess = $rootScope.$on('settings:saved', function (event, settings) {
        update(settings);
      });

      $rootScope.$on('$destroy', function () {
        if (angular.isDefined(settingsSavedSuccess) && settingsSavedSuccess !== null) {
          settingsSavedSuccess();
        }
      });
    }

    function update(settings) {
      LanguageService.changeLanguage(settings.general.language);
      Hears.useLocale(settings.stt.locale);
      Hears.useSpeechToText(settings.stt.service);
      Brain.useNaturalLanguageProcessor(settings.nlp.service);
      Luis.useSubscriptionKey(settings.Luis.subscriptionKey);
      Luis.useApplication(settings.Luis.application);
      BingSpeech.useSubscriptionKey(settings.BingSpeech.subscriptionKey);
    }
  }
})();
