(function () {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$log', '$translate', 'BingSpeech', 'Microphone', 'locale'];

  function HomeController($scope, $log, $translate, BingSpeech, Microphone, locale) {
    var vm = this;

    vm.startRecording = startRecording;
    vm.stopRecording = stopRecording;
    vm.isRecording = isRecording;
    vm.submit = submit;
    vm.messages = [];

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
