angular.module('MyApp')
  .controller('CrashCtrl', function($scope, $http, $auth, $alert, $cookies, $state, Account, $interval, Note, $timeout, $mdDialog, $mdMedia , $window, uiGmapGoogleMapApi) {

    //      NOTES
    // ----------------------------------------
    var originatorEv;

    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };


    $scope.toggleNotifications = function() {
      $scope.notificationsEnabled = !this.notificationsEnabled;
    };

    $scope.editNote = function(ev, item) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
            .title('Recompose your note')
            .textContent('Edit your note on the accident')
            .placeholder('no it was realy just a lie')
            .ariaLabel('note edit')
            .targetEvent(ev)
            .ok('Okay!')
            .cancel('No nothing new');
      $mdDialog.show(confirm).then(function(result) {
        //user wanted to change
        console.log("EDIT!")
        //$scope.status = 'You decided to name your dog ' + result + '.';
      }, function() {
        //$scope.status = 'You didn\'t name your dog.';
      });
    };

    $scope.showConfirm = function(ev, item) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Would you like to delete this note?')
            .textContent('Remember when it is removed it is never comming back.')
            .ariaLabel('Still sure?')
            .targetEvent(ev)
            .ok('Please do it!')
            .cancel('No no never');
      $mdDialog.show(confirm).then(function() {
        console.log("yes remove the message");
        $scope.deleteNote(item);
        $scope.notes_for.splice($scope.notes_for.indexOf(item), 1);
        $scope.status = 'You decided to get rid of your debt.';
      }, function() {
        $scope.status = 'You decided to keep your debt.';
      });
    };

    console.log("test");

    $scope.notes_for = [];
    $scope.noteData = {};

    $scope.refreshNotes =function(){
      Note.getNote()
       .then(function(response) {
         console.log(response);
         //$scope.noteData = response.data;
         $scope.notes_for = [];
         $scope.noteData = {};
         for (var i=0;i<response.data.length;i++){
             $scope.notes_for.push(response.data[i])
         }
         //$scope.$$phase || $scope.$apply();
         //$scope.$apply();   //$digest already in progress uhhh...
         $timeout(function() {
           $scope.$apply();
         });
         console.log($scope.notes_for);
       })
       .catch(function(response) {
         showAlert('Could not load note data..')
       })
     }
     $scope.refreshNotes();

    $scope.deleteNote = function(noteData) {
      //var noteData = $scope.noteData.note;

      console.log(noteData);
      Note.deleteNote(noteData)
      .then(function(response) {
        showAlert('Note has been deleted', 4);
        $timeout(function() {
          $scope.$apply();
        });
      }) .catch(function(response) {
        console.log(response);
        showAlert('Something went wrong! Please try again.', 4);
      });
    };

    $scope.getPerson = function(pnumber) {
      if (pnumber==$scope.personalData._id){
        return $scope.personalData.email
      } else {
        console.log("error")
      }
    }

    $scope.getTimeMongo = function(_id){
      timestamp = _id.toString().substring(0,8);
      return (new Date( parseInt( timestamp, 16 ) * 1000 )).toDateString();
    }

     //console.log(crash.notes);

     // How to add a note to a spesific crash
     $scope.updateNote = function(noteData) {
       //var noteData = $scope.noteData.note;
       var noteData = {
         txt: noteData.txt
       };
       console.log(noteData);
       Note.updateNote(noteData)
       .then(function(response) {
         showAlert('Note has been added', 4);

         $scope.noteData = {};
         $scope.refreshNotes();
         console.log($scope.notes_for);
       }) .catch(function(response) {
         console.log(response);
         showAlert('Something went wrong! Please try again.', 4);
       })
     };


     //      END - NOTES
     // ----------------------------------------
     // ----------------------------------------




      $scope.map_coordinates = cords;

      $scope.map = {
            center: {latitude: $scope.map_coordinates[0][0],longitude: $scope.map_coordinates[0][1]},
            zoom: 11,
            markers: [{
              id: '123',
              latitude: $scope.map_coordinates[0][0],
              longitude: $scope.map_coordinates[0][1]
            }]
        };

    /*$scope.k = 1;
    $interval(function() {
      if ($scope.k < $scope.map_coordinates.length) {
        $scope.map.markers[0].latitude = $scope.map_coordinates[$scope.k][0];
        $scope.map.markers[0].longitude = $scope.map_coordinates[$scope.k][1];
        $scope.k += 1;
      }
    }, 5000);
    */
    //        MAP
    // *******************

      uiGmapGoogleMapApi.then(function(maps) {

        $scope.updateInfo = function(){
          //console.log("!");
        }


        $scope.animateCar = function(marker, cords, km_h){
          var target = 1;
          var km_h = speedArray[target];
          var delay = 100;
          //cords.push([startPos[0], startPos[1]]);
          console.log(cords);
          $scope.goTo = function(){
            //var lat = marker.position.lat();
            //var lng = marker.position.lng();
            var lat = $scope.map.markers[0].latitude;
            var lng = $scope.map.markers[0].longitude;
            console.log(lat);
            console.log(lng);



            var step = (km_h * 1000 * delay) / 3600000
            $scope.updateInfo();
            var dest = new google.maps.LatLng(cords[target][0], cords[target][1]);
            var start = new google.maps.LatLng(cords[target-1][0], cords[target-1][1]);
            var distance = google.maps.geometry.spherical.computeDistanceBetween(
              dest, start); //in meters
              var numStep = distance / step;
              var i = 0;
              var deltaLat = (cords[target][0] - lat) / numStep;
              var deltaLng = (cords[target][1] - lng) / numStep;
              $scope.moveMarker = function(){
                lat += deltaLat;
                lng += deltaLng;
                i += step;
                if (i<distance){
                  //marker.setPosition(new google.maps.LatLng(lat, lng));
                  $scope.map.markers[0].latitude = lat;
                  $scope.map.markers[0].longitude = lng;

                  first = $interval($scope.moveMarker, delay, 1); //setTimeout(moveMarker, delay);
                }
                else{
                  //$scope.map.markers[0].setPosition(dest);
                  $scope.map.markers[0].latitude = cords[target][0];
                  $scope.map.markers[0].longitude = cords[target][1];
                  target += 1;
                  km_h = speedArray[target];
                  //updateInfo();
                  if (target == cords.length){
                    target = 0;
                    km_h = speedArray[0];
                    $scope.updateInfo();
                  }
                  secound = $interval($scope.goTo, delay , 1);//setTimeout(goTo, delay);
                }
              }
              $scope.moveMarker();
          }
          $scope.goTo();
        }

        $scope.animateCar($scope.map.markers[0], cords, 50)


        var start = new google.maps.LatLng(cords[0][0], cords[0][1]);
        var dest = new google.maps.LatLng(cords[1][0], cords[1][1]);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(
          start, dest); //in meters
          console.log(distance);
   });




/*
    $scope.updateInfo = function(){
      console.log.("!")
    }

    $scope.animateCar = function(marker, cords, km_h){
      var target = 0;
      var km_h = speedArray[target];
      var delay = 100;
      //cords.push([startPos[0], startPos[1]]);
      console.log(cords);
      $scope.goTo = function(){
        var lat = marker.position.lat();
        var lng = marker.position.lng();
        var step = (km_h * 1000 * delay) / 3600000
        $scope.updateInfo();
        var dest = new google.maps.LatLng(cords[target][0], cords[target][1]);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(
          dest, marker.position); //in meters
          var numStep = distance / step;
           i = 0;
          var deltaLat = (cords[target][0] - lat) / numStep;
          var deltaLng = (cords[target][1] - lng) / numStep;
          function moveMarker(){
            lat += deltaLat;
            lng += deltaLng;
            i += step;
            if (i<distance){
              marker.setPosition(new google.maps.LatLng(lat, lng));
              first = setTimeout(moveMarker, delay);
            }
            else{
              marker.setPosition(dest);
              target+=1;
              km_h = speedArray[target];
              //updateInfo();
              if (target == cords.length){
                target = 0;
                km_h = speedArray[0];
                updateInfo();
              }
              secound = setTimeout(goTo, delay);
            }
          }
          moveMarker();
      }
      goTo();
    }





*/


//      END - MAP
// *********************




    $scope.options1 = {
            chart: {
                type: 'pieChart',
                height: 225,
                width: '100%',
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 5,
                        left: 5
                    }
                }
            }
        };

        $scope.data1 = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ];
        $scope.options2 = {
                    chart: {
                        type: 'pieChart',
                        height: 225,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: true,
                        duration: 500,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        legend: {
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 5,
                                left: 5
                            }
                        }
                    }
                };

                $scope.data2 = [
                    {
                        key: "One",
                        y: 5
                    },
                    {
                        key: "Two",
                        y: 2
                    },
                    {
                        key: "Three",
                        y: 9
                    },
                    {
                        key: "Four",
                        y: 7
                    },
                    {
                        key: "Five",
                        y: 4
                    },
                    {
                        key: "Six",
                        y: 3
                    },
                    {
                        key: "Seven",
                        y: 5
                    }
                ];
    $scope.personalData = {};

    Account.getProfile()
    .then(function(response) {
      console.log(response);
      $scope.personalData = response.data;
    })
    .catch(function(response) {
      showAlert('Could not load personal data..')
    })


    this.tab = 1
    if ($cookies.get('initTab') != null){
      this.tab = parseInt($cookies.get('initTab'));
    }

    $scope.setTab = function(newValue){
     $cookies.put('initTab', newValue.toString());
     this.tab = newValue;
     console.log(newValue)
    };

   $scope.isSet = function(tabName){
     if (this.tab === tabName){
       return true;
     }
     else{
        return false;
     }

   };



   $scope.updateOwner = function() {
     var data = {
       first_name: $scope.personalData.first_name,
       last_name: $scope.personalData.last_name,
       social_security_number: $scope.personalData.social_security_number,
       address: $scope.personalData.address,
       postal_code: $scope.personalData.postal_code,
       phone_number: $scope.personalData.phone_number,
       email: $scope.personalData.email
     };

     Account.updateOwner(data)
     .then(function(response) {
       showAlert('Personal information updated!', 4);
     }) .catch(function(response) {
       console.log(response);
       showAlert('Something went wrong! Please try again.', 4);
     })
   };

   $scope.change_state = function(state) {
     var current = 'crash.' + state;
     $state.go(current)
   }

   // -- Depricated --
   $scope.restartAnimation = function() {
     $scope.k = 0;
     var newPoint = {
       latitude: $scope.map_coordinates[$scope.k][0],
       longitude: $scope.map_coordinates[$scope.k][1]
     };
     $scope.map.marker = newPoint;
   }

   function showAlert(content, duration) {
     $alert({
       content: content,
       animation: 'fadeZoomFadeDown',
       type: 'material',
       duration: duration
     });
   }

   $scope.options = {
    chart: {
        type: 'lineChart',
        height: 450,
        width: '95%',
        margin : {
            top: 20,
            right: 20,
            bottom: 40,
            left: 55
        },
        x: function(d){ return d.x; },
        y: function(d){ return d.y; },
        useInteractiveGuideline: true,
        xAxis: {
            axisLabel: 'Time (ms)'
        },
        yAxis: {
            axisLabel: 'Speed (km/h)',
            tickFormat: function(d){
                return d3.format('.02f')(d);
            },
            axisLabelDistance: -10
        }
    },
    title: {
        enable: true,
        text: 'Speed before the accident'
    }
};

//var speedArray = <%- JSON.stringify(speed) %>
$scope.data = sinAndCos();

/*Random Data Generator */
function sinAndCos() {
    var speedChart = [];
    //Data is represented as an array of {x,y} pairs.
    for (var i = 0; i < speedArray.length; i++) {
        speedChart.push({x: i, y: speedArray[i]});
    }

    //Line chart data should be sent as an array of series objects.
    return [
        {
            values: speedChart,      //values - represents the array of {x,y} data points
            key: 'Speed', //key  - the name of the series.
            color: '#ff7f0e'  //color - optional: choose your own line color.
        }
    ];
};



 });
