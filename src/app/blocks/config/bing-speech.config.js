(function () {
  'use strict';

  angular
    .module('app')
    .config(BingSpeechConfig);

  BingSpeechConfig.$inject = ['BingSpeechProvider', 'BING_SPEECH_SUBSCRIPTION_KEY'];

  function BingSpeechConfig(BingSpeechProvider, BING_SPEECH_SUBSCRIPTION_KEY) {
    BingSpeechProvider.setSubscriptionKey(BING_SPEECH_SUBSCRIPTION_KEY);
  }
})();
