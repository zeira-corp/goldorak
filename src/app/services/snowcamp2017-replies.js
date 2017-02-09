(function() {
  'use strict';

  angular
    .module('app')
    .factory('Snowcamp2017Replies', Snowcamp2017Replies);

  Snowcamp2017Replies.$inject = ['$log', '$q'];

  function Snowcamp2017Replies($log, $q) {
    var service = {
      reply: reply
    };

    function reply(request) {
//      $log.debug(request);
      if (request.intent === 'Greetings') {
        return answer(request, 'talk.greetings', {});
      }
      if (request.intent === 'GetSlides') {
        return answer(request, 'talk.GetSlides', {});
      }
      return answer(request, 'talk.none', {expression: request.expression});
    }

    function answer(request, reply, data) {
      var deferred = $q.defer();
      deferred.resolve({
        status: 'success',
        reply: reply,
        data: data,
        request: request
      });
      return deferred.promise;
    }

    return service;
  }
})();
