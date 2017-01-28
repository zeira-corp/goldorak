(function () {
  'use strict';
  angular
    .module('app')
    .provider('Brain', BrainProvider);

  BrainProvider.$inject = [];

  function BrainProvider() {
    this.$get = Brain;
    var $nlu;
    this.setNaturalLanguageUnderstanding = function (nlu) {
      $nlu = nlu;
    };

    Brain.$inject = ['$injector', '$log', '$rootScope'];

    function Brain($injector, $log, $rootScope) {
      var service = {
        predict: predict
      };

      var NaturalLanguageUnderstanding;
      if ($nlu) {
        $log.debug('Natural Language Understanding Engine: ' + $nlu);
        NaturalLanguageUnderstanding = $injector.get($nlu);
      } else {
        throw new Error('You must define a NaturalLanguageUnderstanding engine');
      }

      function predict(text) {
        $rootScope.$emit('brain:onProcess', {
          nlu: $nlu,
          text: text
        });
        return NaturalLanguageUnderstanding.predict(text);
      }

      return service;
    }
  }
})();
