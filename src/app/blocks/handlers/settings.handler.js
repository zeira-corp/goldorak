(function() {
  'use strict';

  angular
    .module('app')
    .factory('settingssHandler', settingssHandler);

  settingssHandler.$inject = ['$rootScope', 'Settings', 'Bot', 'Hears', 'Brain', 'Mouth', 'LanguageService', 'Luis', 'BingSpeech', 'DEFAULTS'];

  function settingssHandler($rootScope, Settings, Bot, Hears, Brain, Mouth, LanguageService, Luis, BingSpeech, DEFAULTS) {
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
      Bot.useName(settings.general.name || DEFAULTS.general.name);
      LanguageService.changeLanguage(settings.general.language || DEFAULTS.general.language);
      Hears.useLocale(settings.stt.locale || DEFAULTS.stt.locale);
      Hears.useSpeechToText(settings.stt.service || DEFAULTS.stt.service);
      Mouth.useLocale(settings.tts.locale || DEFAULTS.tts.locale);
      Mouth.useGender(settings.tts.gender || DEFAULTS.tss.gender);
      Mouth.useTextToSpeech(settings.tts.service || DEFAULTS.tts.service);
      Brain.useNaturalLanguageProcessor(settings.nlp.service || DEFAULTS.nlp.service);
      Luis.useSubscriptionKey(settings.Luis.subscriptionKey || DEFAULTS.Luis.subscriptionKey);
      Luis.useApplication(settings.Luis.application || DEFAULTS.Luis.application);
      BingSpeech.useSubscriptionKey(settings.BingSpeech.subscriptionKey || DEFAULTS.BingSpeech.subscriptionKey);
    }
  }
})();
