loadLocations();

var map;
var locationResultObject =[];
var geocoder;

//initialize the map shown on the app

function initMap() {
    var geocoder = new google.maps.Geocoder();
    var mapProp = {
        center: new google.maps.LatLng(-25.2744, 133.7751),
        zoom: 3,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);
    
    
    //code for current location
    //can find the current location
    //cannot add the current location into location list
   /*
    var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
var addCurrentLocation = document.getElementById('addNicknameField').value; 
     var currentLocation = ""
currentLocation = locationResultObject[0].formatted_address; 
           var locationCacheIndex = locationWeatherCache.addLocation(latitude, longitude, nickname);
           */
}


      this.codeAddress = function() 
        {
            initMap();
          //Define geocoder once more, it wasn't working without the following line for some reason - Sol
          var geocoder= new google.maps.Geocoder();
            var address = document.getElementById('address').value;
             geocoder.geocode( {'address': address}, function(results, status){
                    if (status == google.maps.GeocoderStatus.OK){
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({ 
                            map: map,
                            position: results[0].geometry.location
                            });
                        var infowindow = new google.maps.InfoWindow({
                            content:results[0].formatted_address
                        })
                        infowindow.open(map,marker)
                        map.panTo(results[0].geometry.location)
                        map.setZoom(13);
                    } 
    
                 //activate the add location button, triggering the saveLocation function
                 document.getElementById('addLocationBtn').addEventListener('click', function() 
                    {
                        addLocation(results)
                    });
                    
                })  

        }

//Function used to save the input location                                                         
function addLocation(locationResultObject) //
 {       
     //save the lat and lng of the first result
     var latitude = locationResultObject[0].geometry.location.lat();
     var longitude = locationResultObject[0].geometry.location.lng();
    
     var addNickname = document.getElementById('addNicknameField').value; 
     var nickname = ""
     
     //Check if the user has put a nickname in the "addNicknameField", it will use the nickname that the user entered
            if(addNickname != "" || addNickname != null || addNickname != undefined)  
        {
            nickname = document.getElementById('addNicknameField').value;
            var locationCacheIndex = locationWeatherCache.addLocation(latitude, longitude, nickname);
        }
            console.log(locationResultObject);

     
  
          nickname = locationResultObject[0].formatted_address; 
           var locationCacheIndex = locationWeatherCache.addLocation(latitude, longitude, nickname);
  
     
     //Direct the user back to the main page
      location.href = 'index.html'; 
 }