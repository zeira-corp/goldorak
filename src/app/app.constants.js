(function () {
  'use strict';
  angular
    .module('app')
    .constant('DEFAULTS', {
      general: {
        language: 'fr'
      },
      stt: {
        name: 'Microsoft BingSpeech',
        service: 'BingSpeech',
        locale: 'fr-FR'
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
          name: "Conference",
          appId: "496aaf6a-10e6-48fa-8b17-15658ddabde2"
        }
      }
    });
})();
