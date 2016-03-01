


  console.log(speed);
  console.log(cords);

               var map;
               var marker;
               var startPos = [62.550045646, 12.050345356];
               var speed = 50; //km/h should be read from db
               var delay = 100;
               var panDelay = 10000;   //how often the screen sould recenter
               var target = 0;
               var km_h = speedArray[target];
               var infowindow;
               var first;
               var secound;
               var i;
               //thanks to Padre Mucho a jsfiddler with style for helping out with the anim
               /**
                * animateCar - makes the car/marker move across the map
                *
                * @param  {marker.google.maps} symbol for marker the car
                * @param  {array} coords 2d-array with coordinates
                * @param  {int} km_h   the speed of the marker
                */
               function animateCar(marker, coords, km_h){
                 target = 0;
                 km_h = speedArray[target];
                 coords.push([startPos[0], startPos[1]]);
                 console.log(coords);
                 function goTo(){
                   var lat = marker.position.lat();
                   var lng = marker.position.lng();
                   var step = (km_h * 1000 * delay) / 3600000
                   updateInfo();
                   var dest = new google.maps.LatLng(coords[target][0], coords[target][1]);
                   var distance = google.maps.geometry.spherical.computeDistanceBetween(
                     dest, marker.position); //in meters
                     var numStep = distance / step;
                      i = 0;
                     var deltaLat = (coords[target][0] - lat) / numStep;
                     var deltaLng = (coords[target][1] - lng) / numStep;
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
                         if (target == coords.length){
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
               /**
                * centerView - makes the marker the center of the
                */
               function centerView(){
                 setTimeout(centerView, panDelay)
                 map.panTo(marker.getPosition());
               }

              // -- Depricated -- does not work anymore(here for reference)
               function restartAnimation(){
                 console.log("tried to restart animation")
                 startPos = [62.550045646, 12.050345356];
                 speed = 50; //km/h should be read from db
                 delay = 100;
                 panDelay = 10000;   //how often the screen sould recenter
                 target = 0;
                 i=0;
                 km_h = speedArray[target]
                 clearTimeout(first);
                 clearTimeout(secound);
                 first = null;
                 secound = null;
                 animateCar(marker, cords, speed)
                }

               centerView()
               function updateInfo(){
                 console.log(km_h)
                 infowindow.close();
                 infowindow.setContent("<h3>" + "OLED" + "</h3>" + "<p>Speed: " + speedArray[target] + " <br>Description: "+ "Nan - superhack" + "</p>");
                 infowindow.open(map, marker);
                 //infowindow.open(map, marker);
               }
                 /**
                  * initMap - initialize google map
                  *
                  * @return {type}  description
                  */
                 function initMap() {
                   google.maps.event.addDomListener(window, "load", initialize);
                   function initialize(){
                    map = new google.maps.Map(document.getElementById('map'), {
                     center: {lat: 62.5500, lng: 12.050},
                     zoom: 16,
                     mapTypeId: google.maps.MapTypeId.ROADMAP
                   });
                   console.log(startPos[0] + startPos[1])
                   marker = new google.maps.Marker({
                     position: new google.maps.LatLng(startPos[0], startPos[1]),
                     map: map
                   });
                   infowindow = new google.maps.InfoWindow();

                 infowindow.setContent("<h3>" + "OLED" + "</h3>" + "<p>Speed: " + km_h + " <br>Description: "+ "Nan - superhack" + "</p>");
                 infowindow.open(map, marker);
                   google.maps.event.addListenerOnce(map, 'idle', function() {
                     console.log(cords);
                     console.log(speedArray);
                     animateCar(marker, cords, speed)
                   });
                   google.maps.event.addListenerOnce(map, 'idle', function() {
                    google.maps.event.trigger(map, 'resize');
                  });
        //infoWindow.open(map);
      }}


      function myFunction() {
          location.reload();
      }
