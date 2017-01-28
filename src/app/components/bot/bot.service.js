 (function () {
   'use strict';
   angular
     .module('app')
     .factory('Bot', Bot);

   Bot.$inject = ['$rootScope', 'Hears', 'Brain'];

   function Bot($rootScope, Hears, Brain) {
     var service = {
       startListening: startListening,
       isListening: isListening,
       stopListening: stopListening,
       getIntent: getIntent
     };

     function startListening() {
       Hears.startListening();
     }

     function isListening() {
       return Hears.isListening();
     }

     function stopListening() {
       return Hears.stopListening().then(function (utterance) {
         $rootScope.$emit('bot::listened', utterance);
         return utterance;
       });
     }

     function getIntent(text) {
       return Brain.predict(text);
     }

     return service;
   }
 })();
