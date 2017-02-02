(function() {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$scope', '$log', '$translate', 'hotkeys', 'Bot'];

  function HomeController($rootScope, $scope, $log, $translate, hotkeys, Bot) {
    var vm = this;

    vm.toggleRecording = toggleRecording;
    vm.isRecording = Bot.isListening;
    vm.submit = submit;
    vm.messages = [];

    hotkeys.add({
      combo: 'ctrl+space',
      description: $translate.instant('home.hotkey'),
      callback: vm.toggleRecording
    });

    welcomeMessage();

    function welcomeMessage() {
      buildMessage('goldorak', 'home.welcome', {});
    }

    function buildMessage(user, message, values) {
      $translate("speech." + message).then(function(text) {
        Bot.speak(text).then(function(audio) {
          var blob = new Blob([audio.data], {
            type: "audio/basic"
          });
          var tts = URL.createObjectURL(blob);
          vm.messages.push({
            user: user,
            timestamp: new Date().getTime(),
            content: message,
            values: values,
            audio: tts
          });
        });
      });
    }

    function toggleRecording() {
      if (Bot.isListening()) {
        Bot.stopListening().then(process).catch(handleError);
      } else {
        Bot.startListening();
      }
    }

    function process(request) {
      vm.messages.push({
        user: "me",
        timestamp: new Date().getTime(),
        content: request
      });

      Bot.converse(request).then(function(response) {
        //        $log.info('Info ' + angular.toJson(response));
        buildMessage("goldorak", response.reply, response.data);
      }).catch(function(error) {
        //        $log.error('Error ' + angular.toJson(error));
        vm.messages.push({
          user: "goldorak",
          timestamp: new Date().getTime(),
          content: error.reply,
          values: error.data
        });
      });
    }

    function handleError(error) {
      //      $log.error('Error ' + angular.toJson(error));
      vm.messages.push({
        user: "goldorak",
        timestamp: new Date().getTime(),
        content: 'home.stt.failed'
      });
    }

    function submit() {
      if (vm.text) {
        process(vm.text);
      }
      vm.text = "";
    }
  }
})();
