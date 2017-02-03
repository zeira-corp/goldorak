(function () {
  'use strict';
  angular
    .module('app')
    .constant('DEFAULTS', {
      general: {
        language: 'fr',
        name: 'Goldorak'
      },
      stt: {
        name: 'Microsoft BingSpeech',
        service: 'BingSpeech',
        locale: 'fr-FR'
      },
      tts: {
        name: 'Microsoft BingSpeech',
        service: 'BingSpeech',
        locale: 'fr-FR',
        gender: 'male'
      },
      nlp: {
        name: 'Microsoft Luis',
        service: 'Luis'
      },
      BingSpeech: {
        subscriptionKey: '8fb1a8c7b61a41d4838ddc60d84e6601'
      },
      Luis: {
        subscriptionKey: "ebc99ea1bfe8481d9c01f8145a553187",
        application: {
          name: "snowcamp 2017",
          appId: "56760a0c-fca1-43bc-b4d2-a864b4c04ced"
        }
      }
    });
})();
