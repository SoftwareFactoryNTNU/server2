angular.module('MyApp')
  .factory('Note', function($http) {
    return {
      getNote: function() {
        return $http.get('/api/note');
      },
      updateNote: function(noteData) {
        return $http.post('/api/update_note', noteData)
      }
    };
  });
