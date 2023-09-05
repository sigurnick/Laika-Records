var app = angular.module("sampleApp", ["firebase"]);

app.controller("SampleCtrl", function($scope, $firebaseObject) {
  var ref = firebase.database().ref();
  // download the data into a local object
  $scope.data = $firebaseObject(ref);
  // putting a console.log here won't work, see below
});


window.addEventListener('phx:page-loading-stop', (event) => {
  // trigger flowbite events
  window.document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));
});
