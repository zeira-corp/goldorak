(function () {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$log', '$translate', 'hotkeys', 'BingSpeech', 'Microphone', 'locale'];

  function HomeController($scope, $log, $translate, hotkeys, BingSpeech, Microphone, locale) {
    var vm = this;

    vm.toggleRecording = toggleRecording;
    vm.isRecording = isRecording;
    vm.submit = submit;
    vm.messages = [];

    hotkeys.add({
      combo: 'ctrl+space',
      description: $translate.instant('home.hotkey'),
      callback: toggleRecording
    });

    vm.messages.push({
      user: "goldorak",
      timestamp: new Date().getTime(),
      content: 'home.welcome'
    });

    function submit() {
      if (vm.text) {
        process(vm.text);
        vm.text = "";
      }
    }

    function process(text) {
      vm.messages.push({
        user: "me",
        timestamp: new Date().getTime(),
        content: text
      }, {
        user: "goldorak",
        timestamp: new Date().getTime(),
        content: 'home.parrot',
        values: {
          message: text
        }
      });
      if (text === "Goldorak") {
        vm.messages.push({
          user: "goldorak",
          timestamp: new Date().getTime(),
          content: "Go!"
        });
      }
    }

    function toggleRecording() {
      (!isRecording()) ? startRecording() : stopRecording();
    }

    function startRecording() {
      Microphone.startRecording();
    }

    function isRecording() {
      return Microphone.isRecording();
    }

    function stopRecording() {
      Microphone.stopRecording()
        .then(function (audio) {
          BingSpeech
            .recognize(audio, locale)
            .then(process)
            .catch(function (error) {
              $log.error(error);
              vm.messages.push({
                user: "goldorak",
                timestamp: new Date().getTime(),
                content: 'home.stt.failed'
              });
            });
        });
    }
  }
})();
