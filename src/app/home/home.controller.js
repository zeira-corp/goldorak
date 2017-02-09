(function() {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$scope', '$log', '$translate', '$q', 'hotkeys', 'Bot'];

  function HomeController($rootScope, $scope, $log, $translate, $q, hotkeys, Bot) {
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

    //welcomeMessage();

    function welcomeMessage() {
      addBotMessage('home.welcome', {
        name: Bot.name()
      });
    }

    function addBotMessage(message, values) {
      $log.debug('message: ' + message);
      getBotTranslated(message, values)
        .then(getBotAudioUrl)
        .then(function (audioUrl) {
          vm.messages.push({
            user: Bot.name(),
            timestamp: new Date().getTime(),
            content: message,
            values: values,
            audio: audioUrl,
            image: 'bot'
          });
        });
    }

    function addUserMessage(message) {
      vm.messages.push({
        user: "me",
        timestamp: new Date().getTime(),
        content: message,
        image: 'me'
      });
    }

    function toggleRecording() {
      if (Bot.isListening()) {
        Bot.stopListening().then(process).catch(handleRecordingError);
      } else {
        Bot.startListening();
      }
    }

    function process(request) {
      addUserMessage(request);

      Bot.converse(request)
        .then(handleBotResponse)
        .catch(handleConversationError);
    }

    function getBotTranslated(message, values) {
      return $translate("speech." + message, values);
    }

    function getBotAudioUrl(text) {
      var deferred = $q.defer();
      Bot.speak(text).then(function(audio) {
        var blob = new Blob([audio.data], {
          type: "audio/basic"
        });
        deferred.resolve(URL.createObjectURL(blob));
      });
      return deferred.promise;
    }

    function handleBotResponse(response) {
      addBotMessage(response.reply, response.data);
    }

    function handleRecordingError(error) {
      addBotMessage('home.stt.failed', {});
    }

    function handleConversationError(error) {
      addBotMessage(error.reply, error.data);
    }

    function submit() {
      if (vm.text) {
        process(vm.text);
      }
      vm.text = "";
    }
  }
})();
