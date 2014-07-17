angular.module('starter.services', [])

.factory('Geolocation', function($q) {
  return {
    getCurrentLocation: function() {
      var q = $q.defer(), errorObj;

      // See https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md#navigatorgeolocationgetcurrentposition
      navigator.geolocation.getCurrentPosition(function(location) {
        q.resolve(location);
      }, function(error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorObj = {
              title: 'Permission Denied',
              message: 'The application does not have the required permissions to retrieve the current location.'
            };
            break;
          case error.POSITION_UNAVAILABLE:
            errorObj = {
              title: 'Position Unavailable',
              message: 'The application is unable to retrieve the current location.'
            };
            break;
          case error.TIMEOUT:
            errorObj = {
              title: 'Timed out',
              message: 'The application was unable to retrieve the current location in a timely manner.'
            };
            break;
          default:
            errorObj = {
              title: 'Unknown error',
              message: 'The application simply failed to retrieve the current location.'
            };
        }

        q.reject(errorObj);
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
