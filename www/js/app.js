// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.run(function($rootScope, $log, $state, $ionicLoading) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, error) {
    if (toState.name === 'location.index') {
      $ionicLoading.show({
        template: 'Loading...'
      });
    }
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {
    if (toState.name === 'location.index') {
      $ionicLoading.hide();
    }
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    var config;

    if (toState.name === 'location.index') {
      $ionicLoading.hide();

      $log.error(error);

      config = $state.get('location.error');

      switch (error.code) {
        case error.PERMISSION_DENIED:
          config.error = {
            title: 'Permission Denied',
            message: 'The application does not have the required permissions to retrieve the current location.'
          };
          break;
        case error.POSITION_UNAVAILABLE:
          config.error = {
            title: 'Position Unavailable',
            message: 'The application is unable to retrieve the current location.'
          };
          break;
        case error.TIMEOUT:
          config.error = {
            title: 'Timed out',
            message: 'The application was unable to retrieve the current location in a timely manner.'
          };
          break;
        default:
          config.error = {
            title: 'Unknown error',
            message: 'The application simply failed to retrieve the current location.'
          };
      }

      config.error.returnState = $state.current.name;

      $state.go('location.error');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html'
  })

  .state('location', {
    abstract: true,
    url: '/location',
    template: '<ion-nav-view/>'
  })

  .state('location.index', {
    url: '/index',
    controller: 'LocationCtrl',
    templateUrl: 'templates/location.index.html',
    resolve: {
      currentLocation: function($q) {
        var q = $q.defer();

        // See https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md#navigatorgeolocationgetcurrentposition
        navigator.geolocation.getCurrentPosition(function(position) {
          q.resolve(position);
        }, function(error) {
          q.reject(error);
        }, {
          // geoLocationOptions
          // See https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md#geolocationoptions
          maximumAge: 5000,
          timeout: 10000,
          enableHighAccuracy: true
        });

        return q.promise;
      }
    }
  })

  .state('location.error', {
    url: '/error',
    resolve: {
      error: function() {
        return this.error;
      }
    },
    onEnter: function($ionicPopup, $state, error) {
      $ionicPopup.alert({
        title: error.title,
        template: error.message
      }).then(function() {
        $state.go(error.returnState);
      });
    }
  })

  $urlRouterProvider.otherwise('/');
})
