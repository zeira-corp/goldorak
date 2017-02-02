(function () {
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
      var config = {
        general: settings.general || DEFAULTS.general,
        stt: settings.stt || DEFAULTS.stt,
        tts: settings.tts || DEFAULTS.tts,
        nlp: settings.nlp || DEFAULTS.nlp,
        Luis: settings.Luis || DEFAULTS.Luis,
        BingSpeech: settings.BingSpeech || DEFAULTS.BingSpeech
      };
      Bot.useName(config.general.name);
      LanguageService.changeLanguage(config.general.language);
      Hears.useLocale(config.stt.locale);
      Hears.useSpeechToText(config.stt.service);
      Mouth.useLocale(config.tts.locale);
      Mouth.useGender(config.tts.gender);
      Mouth.useTextToSpeech(config.tts.service);
      Brain.useNaturalLanguageProcessor(config.nlp.service);
      Luis.useSubscriptionKey(config.Luis.subscriptionKey);
      Luis.useApplication(config.Luis.application);
      BingSpeech.useSubscriptionKey(config.BingSpeech.subscriptionKey);
    }
  }
})();
