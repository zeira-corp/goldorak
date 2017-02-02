(function() {
  'use strict';
  angular
    .module('app')
    .factory('Mouth', Mouth);

  Mouth.$inject = ['$injector', '$log', '$rootScope'];

  function Mouth($injector, $log, $rootScope) {

    var service = {
      synthesize: synthesize,
      useLocale: useLocale,
      useGender: useGender,
      useTextToSpeech: useTextToSpeech
    };

    var $locale;
    var $gender;
    var $tts;

    function useLocale(locale) {
      $locale = locale;
      $log.debug('Text To Speech Locale: ' + $locale);
    }

    function useGender(gender) {
      $gender = gender;
      $log.debug('Text To Speech Gender: ' + $gender);
    }

    function useTextToSpeech(tts) {
      $tts = tts;
      $log.debug('Text To Speech Engine: ' + $tts);
    }

    function locale() {
      return $locale;
    }

    function getTTSInstance() {
      if ($tts) {
        return $injector.get($tts);
      }
      throw new Error('You must define a TextToSpeech engine');
    }

    function synthesize(text) {
      var TextToSpeech = getTTSInstance();
      $rootScope.$emit('hears:onSynthesize', {
        tts: $tts,
        locale: $locale,
        gender: $gender,
        text: text
      });
      return TextToSpeech.synthesize(text, $locale, $gender);
    }

    return service;
  }
})();
