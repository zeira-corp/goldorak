(function () {
  'use strict';

  angular
    .module('app')

    /*
     Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
     They are written in English to avoid character encoding issues (not a perfect solution)
     */
    .constant('LOCALES', [
      "de-DE",
      "es-ES",
      "en-GB",
      "en-US",
      "fr-FR",
      "it-IT",
      "zh-CN",
      "zh-TW",
      "ja-JP",
      "en-IN",
      "pt-BR",
      "ko-KR",
      "fr-CA",
      "en-AU",
      "zh-HK",
      "ar-EG",
      "fi-FI",
      "vpt-PT",
      "en-NZ",
      "pl-PL",
      "en-CA",
      "ru-RU",
      "da-DK",
      "nl-NL",
      "ca-ES",
      "nb-NO",
      "es-MX",
      "sv-SE"
    ]);
})();
