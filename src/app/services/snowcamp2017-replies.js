(function () {
  'use strict';

  angular
    .module('app')
    .factory('Snowcamp2017Replies', Snowcamp2017Replies);

  Snowcamp2017Replies.$inject = [];

  function Snowcamp2017Replies() {
    var service = {
      reply: reply
    };

    function reply(intent) {
      return "Snowcamp: " + JSON.stringify(intent);
    }

    return service;
  }
})();
