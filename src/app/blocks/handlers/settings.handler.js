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
      var general = settings.general || DEFAULTS.general;
      var stt = settings.stt || DEFAULTS.stt;
      var tts = settings.tts || DEFAULTS.tts;
      var nlp = settings.nlp || DEFAULTS.nlp;
      var Luis = settings.Luis || DEFAULTS.Luis;
      var BingSpeech = settings.BingSpeech || DEFAULTS.BingSpeech;
      Bot.useName(general.name);
      LanguageService.changeLanguage(general.language);
      Hears.useLocale(stt.locale);
      Hears.useSpeechToText(stt.service);
      Mouth.useLocale(tts.locale);
      Mouth.useGender(tts.gender);
      Mouth.useTextToSpeech(tts.service);
      Brain.useNaturalLanguageProcessor(nlp.service);
      Luis.useSubscriptionKey(Luis.subscriptionKey);
      Luis.useApplication(Luis.application);
      BingSpeech.useSubscriptionKey(BingSpeech.subscriptionKey);
    }
  }
})();
