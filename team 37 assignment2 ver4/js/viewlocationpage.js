loadLocations(); //To check if there is any location that has already been saved before

//Get the data from the local storage
var locations = localStorage.getItem('weatherApp-selectedLocation');
var locationList = JSON.parse(locations)
var thirtydays;
var locationObject = locationWeatherCache.locationAtIndex(locationList);
var latitude = locationObject.latitude;
var longitude = locationObject.longitude;
var nickname = locationObject.name;
document.getElementById("headerBarTitle").innerHTML = nickname;

//console.log(locationObject)

//Shows the weather of the current date
giveWeather(29);


//  The function is to remove the location when called 
function removeLocation(){
    locationWeatherCache.removeLocationAtIndex(locationList);
}


// initialize the Google Map
function initializeMap(){
    var mapSection = document.getElementById('map');
    var map = new google.maps.Map(mapSection, 
    {
    center: {lat: latitude, lng: longitude},  // set the map centre
    zoom: 16
    });
// mark the location
            var marker = new google.maps.Marker({
            map: map,
                
            position: {lat:latitude, lng:longitude},
            title: "Location"
            });
    var infowindow = new google.maps.InfoWindow({
                            content:nickname
                        })
                        infowindow.open(map,marker)
                        map.setZoom(13);
}


// get weather information
function weatherData(index, data){
    
// display summary
    summary = data.weatherSummary;
    document.getElementById("summary").innerHTML = summary;
    
// round, convert and display min temperature
    minimumTemp = Math.round(data.minimumTemperature, 3) + '&deg;C';
    document.getElementById("minTemp").innerHTML = minimumTemp;
    
// round, convert and display max temperature
    maximumTemp = Math.round(data.maximumTemperature, 3) + '&deg;C';
    maximumTemp = Math.round(data.maximumTemperature, 3) + '&deg;C';
    document.getElementById("maxTemp").innerHTML = maximumTemp;
    
// round and display humidity
    humidity = Math.round(data.humidity * 100) + '%';
    document.getElementById("humidity").innerHTML = humidity;
    
// round, convert and dispaly wind spped
    windSpeed = Math.round(data.windSpeed, 3) + ' km/hr';
    document.getElementById("windSpeed").innerHTML = windSpeed;
}
 
// display the forecast at the date was selected by slider 
function giveWeather(value){        
            var date = new Date()
            var viewday = 29  - value;
            date.setDate(date.getDate() - viewday); 
            thirtydays = date.simpleDateString();  
            document.getElementById("message").innerHTML = thirtydays;
            locationWeatherCache.achieveWeatherInfoAtIndexForDate(locationList,thirtydays,weatherData);
}