(function () {
  'use strict';
  angular
    .module('app')
    .factory('Brain', Brain);

  Brain.$inject = ['$injector', '$log', '$rootScope'];

  function Brain($injector, $log, $rootScope) {
    var service = {
      predict: predict,
      useNaturalLanguageProcessor: useNaturalLanguageProcessor
    };

    var $nlp;

    function useNaturalLanguageProcessor(nlp) {
      $nlp = nlp;
      $log.debug('Natural Language Processor Engine: ' + $nlp);
    }

    function getNLPInstance() {
      if ($nlp) {
        return $injector.get($nlp);
      }
      throw new Error('You must define a NaturalLanguageProcessor engine');
    }

    function predict(text) {
      var NaturalLanguageProcessor = getNLPInstance();
      $rootScope.$emit('brain:onProcess', {
        nlp: $nlp,
        text: text
      });
      return NaturalLanguageProcessor.predict(text);
    }

    return service;
  }
})();
