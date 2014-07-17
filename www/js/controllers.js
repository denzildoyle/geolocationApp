angular.module('starter.controllers', [])

.controller('LocationCtrl', function($scope, $ionicLoading, $ionicPopup, $state, Geolocation) {
  $ionicLoading.show({
    template: 'Loading...'
  });

  Geolocation.getCurrentLocation().then(function(location) {
    $scope.location = location;
  }, function(error) {
    $ionicPopup.alert({
      title: error.title,
      template: error.message
    }).then(function() {
      $state.go('home');
    });
  })['finally'](function() {
    $ionicLoading.hide();
  });
})
