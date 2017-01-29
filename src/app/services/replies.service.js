(function () {
  'use strict';

  angular
    .module('app')
    .factory('Replies', Replies);

  Replies.$inject = ['$injector'];

  function Replies($injector) {
    var service = {
      useReplies: useReplies,
      reply: reply
    };

    var $replies = $injector.get('Snowcamp2017Replies');

    function useReplies(replies) {
      $replies = replies;
    }

    function reply(intent) {
      return $replies.reply(intent);
    }

    return service;
  }
})();
