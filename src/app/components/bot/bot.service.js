 (function() {
   'use strict';
   angular
     .module('app')
     .factory('Bot', Bot);

   Bot.$inject = ['$log', '$rootScope', 'Hears', 'Brain', 'Replies', 'Mouth'];

   function Bot($log, $rootScope, Hears, Brain, Replies, Mouth) {
     var service = {
       startListening: startListening,
       isListening: isListening,
       stopListening: stopListening,
       converse: converse,
       speak: speak,
       name: name,
       useName: useName
     };

     var $name;

     function name() {
       return $name;
     }

     function useName(name) {
       $name = name;
     }

     function startListening() {
       Hears.startListening();
     }

     function isListening() {
       return Hears.isListening();
     }

     function stopListening() {
        $log.debug('There ');
       return Hears.stopListening().then(function(utterance) {
         $log.debug('Here ' + utterance);
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

     function speak(text) {
       return Mouth.synthesize(text);
     }

     return service;
   }
 })();
