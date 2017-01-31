(function() {
  'use strict';
  angular
    .module('app')
    .factory('Hears', Hears);

  Hears.$inject = ['$injector', '$log', '$rootScope', 'Microphone'];

  function Hears($injector, $log, $rootScope, Microphone) {

    var service = {
      startListening: startListening,
      isListening: Microphone.isRecording,
      stopListening: stopListening,
      locale: locale,
      useLocale: useLocale,
      useSpeechToText: useSpeechToText
    };

    var $locale;
    var $stt;

    function useLocale(locale) {
      $locale = locale;
      $log.debug('Speech To Text Locale: ' + $locale);
    }

    function useSpeechToText(stt) {
      $stt = stt;
      $log.debug('Speech To Text Engine: ' + $stt);
    }

    function locale() {
      return $locale;
    }

    function getSTTInstance() {
      if ($stt) {
        return $injector.get($stt);
      }
      throw new Error('You must define a SpeechToText engine');
    }

    function startListening() {
      Microphone.startRecording();
      $rootScope.$emit('hears:onStartListening', {
        sst: $stt,
        locale: $locale
      });
    }

    function stopListening() {
      $rootScope.$emit('hears:onStopListening', {
        sst: $stt,
        locale: $locale
      });
      return Microphone
        .stopRecording()
        .then(recognize);
    }

    function recognize(audio) {
      var SpeechToText = getSTTInstance();
      $rootScope.$emit('hears:onRecognize', {
        sst: $stt,
        locale: $locale,
        audio: audio
      });
      return SpeechToText.recognize(audio, $locale);
    }

    return service;
  }
})();
