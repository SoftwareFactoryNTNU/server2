angular.module('MyApp')
  .controller('CrashCtrl', function($scope, $http, $auth, $alert, $cookies, $state, Account, $interval, mySocket) {

    console.log('Running');
    mySocket.emit('connection', function() {
      console.log('LOG ERROR');
    });
    $scope.got_data = false;
    mySocket.on("got_data", function(data) {
      $scope.got_data = true;
    })


    $scope.map_coordinates = [];
      $http.post('/api/get_data_from_crash').success(function(response) {
        console.log(response.data);
        if (response.data.length > 0) {
              $scope.map_coordinates = response.data;
        }
      }).catch(function(err) {
        console.log(err);
      });

      $scope.map = {
            center : { latitude: 40.9, longitude: -73.964027 },
            zoom: 11,
            markers : [{
              id: '123',
              latitude: 40.9,
              longitude: -73.964027
            }]
        };



    $scope.k = 0;
    $interval(function() {
      if ($scope.k < $scope.map_coordinates.length) {
        $scope.map.markers[0].latitude = $scope.map_coordinates[$scope.k].latitude;
        $scope.map.markers[0].longitude = $scope.map_coordinates[$scope.k].longditude;
        $scope.k += 1;
      }
    }, 2000);

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
                        y: .5
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

    $scope.load_new_data = function() {
      console.log('loading new data');
      $http.post('/api/get_data_from_crash').success(function(response) {
        $scope.got_data = false;
        if (response.data.length > 0) {
            $scope.map_coordinates = response.data;
        }
      }).catch(function(err) {
        console.log(err);
      });
      $scope.got_data = false;
    }

    this.tab = 1
    if ($cookies.get('initTab') != null){
      this.tab = parseInt($cookies.get('initTab'));
    }

    this.setTab = function(newValue){
      $cookies.put('initTab', newValue.toString());
     this.tab = newValue;
    };

   this.isSet = function(tabName){
     return this.tab === tabName;
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
     $scope.map.markers[0].latitude = $scope.map_coordinates[0].latitude;
     $scope.map.markers[0].longitude = $scope.map_coordinates[0].longditude;
     console.log($scope.map_coordinates[0].latitude);
     console.log($scope.map_coordinates[0].longditude);
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
//$scope.data = sinAndCos();

/*Random Data Generator
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
*/

 });
