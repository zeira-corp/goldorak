(function() {
  'use strict';

  angular
    .module('app')
    .factory('Snowcamp2017Replies', Snowcamp2017Replies);

  Snowcamp2017Replies.$inject = ['$log', '$q', 'SNOWCAMP_2017'];

  function Snowcamp2017Replies($log, $q, SNOWCAMP_2017) {
    var service = {
      reply: reply
    };

    var options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name",
        "description"
      ]
    };
    var fuse = new Fuse(SNOWCAMP_2017, options);

    function reply(request) {
//      $log.debug('Request: ' + angular.toJson(request));
      if (request.intent === 'GetTalkSchedule') {
        return findTalk(request, 'talk.schedule');
      }
      if (request.intent === 'GetTalkRoom') {
        return findTalk(request, 'talk.room');
      }
      if (request.intent === 'GetTalkSpeakers') {
        return findTalk(request, 'talk.speakers');
      }
      return none(request);
    }

    function findTalk(request, reply) {
      var deferred = $q.defer();
      if (request.entities.length === 0) {
        deferred.reject({
          status: 'error',
          reply: 'talk.error.no-talk-identified',
          data: {
            expression: request.expression
          },
          request: request
        });
        return deferred.promise;
      }

      var words = request.entities[0].word;
      var talk = fuse.search(words)[0];
      deferred.resolve({
        status: 'success',
        reply: reply,
        data: {
          talk: talk
        },
        request: request
      });
      return deferred.promise;
    }

    function none(request) {
      var deferred = $q.defer();
      deferred.resolve({
        status: 'success',
        reply: 'talk.none',
        data: {
          expression: request.expression
        },
        request: request
      });
      return deferred.promise;
    }

    return service;
  }
})();
