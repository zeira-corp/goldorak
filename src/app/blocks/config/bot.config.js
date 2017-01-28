(function () {
  'use strict';

  angular
    .module('app')
    .config(BotConfig);

  BotConfig.$inject = ['HearsProvider', 'BrainProvider'];

  function BotConfig(HearsProvider, BrainProvider) {
    HearsProvider.setSpeechToText('BingSpeech');
    HearsProvider.setDefaultLocale('fr-FR');
    BrainProvider.setNaturalLanguageUnderstanding('Luis');
  }
})();
