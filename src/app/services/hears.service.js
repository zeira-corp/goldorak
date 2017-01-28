(function () {
  'use strict';
  angular
    .module('app')
    .provider('Hears', HearsProvider);

  HearsProvider.$inject = [];

  function HearsProvider() {
    this.$get = Hears;
    var $sst;
    var $defaultLocale = 'en-US';

    this.setSpeechToText = function (sst) {
      $sst = sst;
    };

    this.setDefaultLocale = function (defaultLocale) {
      $defaultLocale = defaultLocale;
    };

    Hears.$inject = ['$injector', '$log', '$rootScope', 'Microphone'];

    function Hears($injector, $log, $rootScope, Microphone) {
      var service = {
        startListening: startListening,
        isListening: Microphone.isRecording,
        stopListening: stopListening,
        locale: locale,
        useLocale: useLocale
      };

      var $locale;
      var SpeechToText;

      function useLocale(locale) {
        $locale = locale;
      }

      function locale() {
        return $locale;
      }

      useLocale($defaultLocale);

      if ($sst) {
        $log.debug('Speech To Text Engine: ' + $sst);
        SpeechToText = $injector.get($sst);
      } else {
        throw new Error('You must define a SpeechToText engine');
      }

      function startListening() {
        Microphone.startRecording();
        $rootScope.$emit('hears:onStartListening', {
          sst: $sst,
          locale: $locale
        });
      }

      function stopListening() {
        $rootScope.$emit('hears:onStopListening', {
          sst: $sst,
          locale: $locale
        });
        return Microphone
        .stopRecording()
        .then(recognize);
      }

      function recognize(audio) {
        $rootScope.$emit('hears:onRecognize', {
          sst: $sst,
          locale: $locale,
          audio: audio
        });
        return SpeechToText.recognize(audio, $locale);
      }

      return service;
    }
  }
})();
