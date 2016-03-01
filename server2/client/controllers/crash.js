angular.module('MyApp')
  .controller('CrashCtrl', function($scope, $http, $auth, $alert, $cookies) {

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

   $scope.reloadPage = function(){window.location.reload();}

   $scope.reloadRoute = function() {
     console.log("tried to reload");
     // $state.reload();
     $cookies.put('initTab', '3');
     $scope.reload();
   }

   // -- Depricated --
   $scope.restartAnim = function() {
     // restartAnimation();
   }

  })

  //.controller('NvdController',
  .controller('NvdController', function($scope){
      $scope.options = {
       chart: {
           type: 'lineChart',
           height: 450,
           margin : {
               top: 20,
               right: 20,
               bottom: 40,
               left: 55
           },
           x: function(d){ return d.x; },
           y: function(d){ return d.y; },
           useInteractiveGuideline: true,
           dispatch: {
               stateChange: function(e){ console.log("stateChange"); },
               changeState: function(e){ console.log("changeState"); },
               tooltipShow: function(e){ console.log("tooltipShow"); },
               tooltipHide: function(e){ console.log("tooltipHide"); }
           },
           xAxis: {
               axisLabel: 'Time (ms)'
           },
           yAxis: {
               axisLabel: 'Speed (km/h)',
               tickFormat: function(d){
                   return d3.format('.02f')(d);
               },
               axisLabelDistance: -10
           },
           callback: function(chart){
               console.log("!!! lineChart callback !!!");
           }
       },
       title: {
           enable: true,
           text: 'Speed before the accident'
       },
       subtitle: {
           enable: true,
           text: 'Detailed speed graph before the accident.',
           css: {
               'text-align': 'center',
               'margin': '10px 13px 0px 7px'
           }
       },
       caption: {
           enable: true,
           html: '<b>Figure 1.</b> This show the speed of the vehicle right before the accident.',
           css: {
               'text-align': 'justify',
               'margin': '10px 13px 0px 7px'
           }
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
})
