angular.module('MyApp')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      },
      updatePassword: function(profileData) {
        return $http.post('/api/me', profileData);
      },
      updateOwner: function(data) {
        return $http.post('/api/update_owner', data)
      }
    };
  });
