(function () {
  'use strict';
  angular
    .module('app')
    .factory('Microphone', Microphone);

  Microphone.$inject = ['$log', '$q', '$window'];

  function Microphone($log, $q, $window) {
    var service = {
      startRecording: startRecording,
      stopRecording: stopRecording,
      isRecording: isRecording
    };

    $window.navigator.getUserMedia = $window.navigator.getUserMedia || $window.navigator.webkitGetUserMedia || $window.navigator.mozGetUserMedia;

    function getAudioPermission() {
      var deferred = $q.defer();
      $window.navigator.getUserMedia({
        audio: true
      }, function (stream) {
        deferred.resolve(stream);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    var recording = false;
    var recorder;

    function startRecording() {
      getAudioPermission()
        .then(function (stream) {
          recorder = new RecordRTC(stream, {
            type: 'audio',
            numberOfAudioChannels: 1
          });
          recorder.startRecording();
          recording = true;
        }).catch(function (error) {
          $log.error(error);
        });
    }

    function stopRecording() {
      var deferred = $q.defer();
      recorder.stopRecording(function () {
        recording = false;
        deferred.resolve(recorder.getBlob());
      });
      return deferred.promise;
    }

    function isRecording() {
      return recording;
    }

    return service;
  }
})();
