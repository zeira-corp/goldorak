 (function () {
   'use strict';
   angular
     .module('app')
     .factory('Bot', Bot);

   Bot.$inject = ['$rootScope', 'Hears', 'Brain', 'Replies'];

   function Bot($rootScope, Hears, Brain, Replies) {
     var service = {
       startListening: startListening,
       isListening: isListening,
       stopListening: stopListening,
       converse: converse
     };

     function startListening() {
       Hears.startListening();
     }

     function isListening() {
       return Hears.isListening();
     }

     function stopListening() {
       return Hears.stopListening().then(function (utterance) {
         $rootScope.$emit('bot:listened', utterance);
         return utterance;
       });
     }

     function getIntent(text) {
       return Brain.predict(text);
     }

     function reply(intent) {
       return Replies.reply(intent);
     }

     function converse(expression) {
       return getIntent(expression).then(reply);
     }

     return service;
   }
 })();
