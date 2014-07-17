angular.module('starter.controllers', [])

.controller('LocationCtrl', function($scope, currentLocation) {
  $scope.location = currentLocation;
})
