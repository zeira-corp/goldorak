(function () {
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
      vm.messages.push({
        user: "goldorak",
        timestamp: new Date().getTime(),
        content: 'home.welcome'
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

      Bot.converse(request).then(function (response) {
//        $log.info('Info ' + angular.toJson(response));
        vm.messages.push({
          user: "goldorak",
          timestamp: new Date().getTime(),
          content: response.reply,
          values: response.data
        });
      }).catch(function (error) {
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
