angular.module('MyApp')
.controller('NoteCtrl', function($scope, $http, $auth, $alert, Note) {
  console.log("hello");


   function showAlert(content, duration) {
     $alert({
       content: content,
       animation: 'fadeZoomFadeDown',
       type: 'material',
       duration: duration
     });
   }

});
