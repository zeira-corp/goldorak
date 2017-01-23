(function () {
  'use strict';

  angular
    .module('app')
    .factory('LanguageService', LanguageService);

  LanguageService.$inject = ['$q', '$translate', 'LANGUAGES', 'tmhDynamicLocale'];

  function LanguageService($q, $translate, LANGUAGES, tmhDynamicLocale) {
    var service = {
      getAll: getAll,
      getCurrent: getCurrent,
      changeLanguage: changeLanguage
    };

    return service;

    function getAll() {
      return LANGUAGES;
    }

    function getCurrent() {
      var deferred = $q.defer();
      var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
      deferred.resolve(language);
      return deferred.promise;
    }

    function changeLanguage(locale) {
      var languageKey = locale.slice(0, 2);
      if (languageKey) {
        $translate.use(languageKey);
        tmhDynamicLocale.set(languageKey);
      }
    }
  }
})();
