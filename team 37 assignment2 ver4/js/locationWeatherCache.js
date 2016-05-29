// Returns a date in the format "YYYY-MM-DD".
Date.prototype.simpleDateString = function() {
    function pad(value)
    {
        return ("0" + value).slice(-2);
    }
    var dateString = this.getFullYear() + "-" + 
            pad(this.getMonth() + 1, 2) + '-' + 
            pad(this.getDate(), 2);
    
    return dateString;
}
// Date format required by forecast.io API.
// We always represent a date with a time of midday,
// so our choice of day isn't susceptible to time zone errors.
Date.prototype.thirtydaysString = function() {
    return this.simpleDateString() + "T12:00:00";
}
// Code for LocationWeatherCache class and other shared code.
// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "weatherApp";
function LocationWeatherCache()
{
    // Private attributes:
    var locations = [];
    var callbacks = {};
            
    // Returns the number of locations stored in the cache.
    this.length = function() 
    {
        return (locations.length);
    };
    
    // Returns the location object for a given index.
    // Indexes begin at zero.
    
    this.locationAtIndex = function(index) 
    {
        if (locations[index] == undefined || locations[index] == null)
            {
                console.log("ERROR: This location index does not exist!");
                return;
            } 
        //To tell that something wrong with the locationindex,check the code again

        var weatherLocaionInfoObject = {name: locations[index].name,
                               latitude: locations[index].latitude,
                               longitude: locations[index].longitude};
        return (weatherLocaionInfoObject);
        //just return the location's lat,lng,nickname 
        //in order to send the location info to api to get the weather info of the location
    };
    // Given a latitude, longitude and nickname, this method saves a 
    // new location into the cache.  It will have an empty 'forecasts'
    // property.  Returns the index of the added location.
    //
    this.addLocation = function(latitude, longitude, nickname) 
    {
        var index = locations.length; 
        
        var weatherInfoObject = {};
        //an object to store weather information
        if (locationIndex(latitude, longitude) != -1) 
        //if locationIndex == -1, this location is already exist.
        //otherwiae, this location is not exist, user can add this location

            {
                var locationIndexCurrently = locationIndex(latitude, longitude);
                locations[locationIndexCurrently].name = nickname;
                return locationIndexCurrently;
                //can add a nickname to a location that is already exist
            }
        
        var newLocation = { name: nickname,
                          latitude: latitude,
                          longitude: longitude,
                          forecasts: weatherInfoObject}; 
        
        locations.push(newLocation); 
        // add a new location to the locations array.
        saveLocations();
        //save the new location into local storage.
        return index;
    };
    
    // Removes the saved location at the given index.
    this.removeLocationAtIndex = function(index)
    {
         if (locations[index] == undefined || locations[index] == null)
            {
                console.log("ERROR: This location is not exist!");
                return;
                //To tell that something wrong with the locationindex,check the code again
            } 
        
        var index = index;
        locations.splice(index, 1);
        saveLocations();
        //after remove the location, call this function again to remove the location from local storage
    }
    // This method is used by JSON.stringify() to serialise this class.
    // Note that the callbacks attribute is only meaningful while there 
    // are active web service requests and so doesn't need to be saved.
    //
    this.toJSON = function() 
    {        
        var storedJSON = JSON.stringify(locations)
        return storedJSON;        
    };
    // Given a public-data-only version of the class (such as from
    // local storage), this method will initialise the current
    // instance to match that version.
    //
    this.initialiseFromPDO = function(locationWeatherCachePDO) 
    {
        locations = [];      
        for (var i = 0; i < locationWeatherCachePDO.length; i++)
            {
                locations.push(locationWeatherCachePDO[i]);
            }
    };
    // Request weather for the location at the given index for the
    // specified date.  'date' should be JavaScript Date instance.
    //
    // This method doesn't return anything, but rather calls the 
    // callback function when the weather object is available. This
    // might be immediately or after some indeterminate amount of time.
    // The callback function should have two parameters.  The first
    // will be the index of the location and the second will be the 
    // weather object for that location.
    // 
    this.achieveWeatherInfoAtIndexForDate = function(index, date, callback) {
        // apikey = https://api.forecast.io/forecast/d9837b174d1dba6c6245fbd1b3a5ac20/,latitude,longitude,time ([YYYY]-[MM]-[DD]Time[HH]:[MM]:[SS]) ?units=si
        //ensure use SI units
       
        if (locations[index] == undefined || locations[index] == null )
            {
                console.log("ERROR: This location is not exist!");
                return
                //To check if index is ok or not
            } 
        
        var weatherInfoObjectName = locations[index].latitude + "," + locations[index].longitude + "," + date 
//update the information of the location in order to get information back from api of weather
//in format of [lat],[lng],date
        if (locations[index].forecasts.hasOwnProperty(weatherInfoObjectName) == true)
            //to see if the location exist or not
            //if exist, can get the weather info
            {
                callback(index, locations[index].forecasts[weatherInfoObjectName]); 
                //callback function if existing
            }
        else 
         {   
            callbacks.weatherInfoObjectName = callback; 
            var apiKey = "https://api.forecast.io/forecast/d9837b174d1dba6c6245fbd1b3a5ac20/"+ locations[index].latitude + "," + locations[index].longitude + "," + date + "T12:00:00?units=si&callback=locationWeatherCache.weatherResponse"; 
             //be careful of the format of the apiket
                        
            var script = document.createElement('script'); 
            script.src = apiKey;
            document.body.appendChild(script);
             //To call the api to get the weather information
         }
    };
    
    // This is a callback function passed to forecast.io API calls.
    // This will be called via JSONP when the API call is loaded.
    //
    // This should invoke the recorded callback function for that
    // weather request.
    //
    this.weatherResponse = function(response) {
  
        var timestamp = response.daily.data[0].time;
        var date = timeConverter(timestamp);
        //convert the unix time into the time we use
        var latitude = response.latitude;
        var longitude = response.longitude;
        var index = locationIndex(latitude, longitude);
        var weatherInfoObjectName = latitude + "," + longitude + "," + date; 
        locations[index].forecasts[weatherInfoObjectName] = {} 
        //an object for weather info, etc. summary,maxtemp,mintemp,humidity,windspeed       
        var weatherForecast = locations[index].forecasts[weatherInfoObjectName] 
        var apiData = response.daily.data[0]
        
        //get and update the weathe info from api
        weatherForecast.weatherSummary = apiData.summary; 
        weatherForecast.minimumTemperature = apiData.temperatureMin;
        weatherForecast.maximumTemperature = apiData.temperatureMax;
        weatherForecast.humidity = apiData.humidity;
        weatherForecast.windSpeed = apiData.windSpeed;
        weatherForecast.icon = apiData.icon;
        
        var functionToCall = callbacks.weatherInfoObjectName
                        
        saveLocations();
        
        
        functionToCall(index, locations[index].forecasts[weatherInfoObjectName]); 
        //link with callback function with "this.achieveWeatherInfoAtIndexForDate"
    };
    // Private methods:
    
    // Given a latitude and longitude, this method looks through all
    // the stored locations and returns the index of the location with
    // matching latitude and longitude if one exists, otherwise it
    // returns -1.
    //
    function locationIndex(latitude, longitude)
    {
        for(var i = 0; i < locations.length; i++)
            {
                if(locations[i].latitude === latitude && locations[i].longitude === longitude)
                {
                    return i
                }
            }
        return -1
        //check if the location exist or not
        //if not exist,return -1
    }
}

// Restore the singleton locationWeatherCache from Local Storage.
//
function loadLocations()
{
    locationWeatherCache = new LocationWeatherCache; 
    if(localStorage.getItem(APP_PREFIX) != null || localStorage.getItem(APP_PREFIX) != undefined)
    {
    var storedJSON = localStorage.getItem(APP_PREFIX);
    var cachePDO = JSON.parse(storedJSON);
    locationWeatherCache.initialiseFromPDO(cachePDO);
    }
    
}
// Save the singleton locationWeatherCache to Local Storage.
//
function saveLocations()
{
    
    localStorage.setItem(APP_PREFIX, locationWeatherCache.toJSON());
}
//convert the unix time into our time
function timeConverter(UNIX_timestamp){
  var unixTime = new Date(UNIX_timestamp * 1000);
  var months = [1,2,3,4,5,6,7,8,9,10,11,12];
  var year = unixTime.getFullYear();
  var month = months[unixTime.getMonth()];
  var date = unixTime.getDate();
  
  var time = year + "-" + month + "-" + date
  return time;
}