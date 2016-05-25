
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
Date.prototype.forecastDateString = function() {
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
    var temporaryMemory = {index : "",
                          forecastObjectName : ""}; // creating a variable for "this.getWeatherAtIndexForDate" to communicate to "this.weatherResponse" instructions on where to place the weather data object. This object will be cleared each time it is used. If you guys can think of a more efficient way of doing this, I'd love to heat it. - Lachlan

    // Public methods:
    
    // Returns the number of locations stored in the cache.
    //
    this.length = function() 
    {
        return (locations.length);
    };
    
    // Returns the location object for a given index.
    // Indexes begin at zero.
    //
    this.locationAtIndex = function(index) 
    {
        if (locations[index] == undefined || locations[index] == null)
            {console.log("ERROR: Tried to access nonexistent location object")
            return} //Stopping the function from doing something if the argument index is invalid. Hopefully this might limit some of the wierd errors that may arise. -Lachlan
        else
        //var objectAtIndex = locations[index]; //this includes all of the weather data, which is probably not what's required. -Lachlan
        var simplifiedObject = {name: locations[index].name,
                               latitude: locations[index].latitude,
                               longitude: locations[index].longitude};
        return (simplifiedObject); //returning location object without the weather data. -Lachlan
    };

    // Given a latitude, longitude and nickname, this method saves a 
    // new location into the cache.  It will have an empty 'forecasts'
    // property.  Returns the index of the added location.
    //
    this.addLocation = function(latitude, longitude, nickname) //-Lachlan
    {
        var index = locations.length; //This will be the index of the location once it is stored.
        
        var forecastObject = {}; //This object will contain all the saved forecast data
        
        if (indexForLocation(latitude, longitude) != -1) //This checks if the location already exists in memory. An example of which would be if the user simply wished to update the nickname without having to download all of the weather data again. A result of -1 indicates that the location is original -Lachlan
            {
                var currentIndex = indexForLocation(latitude, longitude);
                locations[currentIndex].name = nickname;
                return currentIndex;
            }
        
        var newLocation = { name: nickname,
                          latitude: latitude,
                          longitude: longitude,
                          forecasts: forecastObject}; 
        
        locations.push(newLocation); // adding the object to the locations array.
        saveLocations();//calling the function to update the localstorage.
        return index;
        
    };

    // Removes the saved location at the given index.
    // 
    this.removeLocationAtIndex = function(index)
    {
         if (locations[index] == undefined || locations[index] == null)
            {console.log("ERROR: Tried to access nonexistent location object")
            return} //Stopping the function from doing something if the argument index is invalid. Hopefully this might limit some of the wierd errors that may arise. -Lachlan
        
        var index = index;
        locations.splice(index, 1);
        saveLocations();//calling the function to update the localstorage.
        
    }

    // This method is used by JSON.stringify() to serialise this class.
    // Note that the callbacks attribute is only meaningful while there 
    // are active web service requests and so doesn't need to be saved.
    //
    this.toJSON = function() {
        
        var cacheJSON = JSON.stringify(locations)
        return cacheJSON;
        
    };

    // Given a public-data-only version of the class (such as from
    // local storage), this method will initialise the current
    // instance to match that version.
    //
    this.initialiseFromPDO = function(locationWeatherCachePDO) {
        locations = []; //asuming the argument of this function has already been parsed back into the locations array, with appropriate objects. Ensuring that locations is blank. - Lachlan
        
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
    this.getWeatherAtIndexForDate = function(index, date, callback) {
        // key = https://api.forecast.io/forecast/539dab1a2312fd2684edf641dbbff55e/,latitude,longitude,time ([YYYY]-[MM]-[DD]T[HH]:[MM]:[SS]) ?units=si
        // forecast object named in format of "[lat],[lng],[date]" which corresponds to "locations[index].latitude + locations[index].longitude + date"
        // API call that works(for my own refference)-Lachlan: https://api.forecast.io/forecast/e26bd5936b0460d61bb5586aacd1b9d3/46.0617697,12.078846800000065,2013-05-06T12:00:00?units=si
        

                if (locations[index] == undefined || locations[index] == null)
            {console.log("ERROR: Tried to access nonexistent location object")
            return} //Stopping the function from doing something if the argument index is invalid. Hopefully this might limit some of the wierd errors that may arise. -Lachlan
        
        var forecastObjectName = locations[index].latitude + "," + locations[index].longitude + "," + date // This should result in a string which corresponds to the weather object's name. -Lachlan
                
        if (locations[index].forecasts.hasOwnProperty(forecastObjectName) == true) // check to see that weather data exists in the cache, this passes if it does.
            {
                //console.log(forecastObjectName)
               // console.log(locations[index].forecasts)
                //console.log(locations[index].forecasts[forecastObjectName]);
                callback(index, locations[index].forecasts[forecastObjectName]); //This passes the weather object at the given date to the callback function specified doesn't work without square braces for some reason. -Lachlan
            }
        else
        {
            callbacks.forecastObjectName = callback; // storing the name of the function to be called -Lachlan
            var apiKey = "https://api.forecast.io/forecast/e26bd5936b0460d61bb5586aacd1b9d3/"+ locations[index].latitude + "," + locations[index].longitude + "," + date + "T12:00:00?units=si" + "&callback=locationWeatherCache.weatherResponse"; // this constructs the string to be passed to the API. - Lachlan
            temporaryMemory.index = index;
            temporaryMemory.forecastObjectName = forecastObjectName; // These two lines update the temporary memory object with the information required by "this.weatherResponse" - Lachlan
            
            // The following 3 lines call the API; if anyone has a more elegant way of doing this, I'd love to hear it! - Lachlan
            var script = document.createElement('script'); 
            script.src = apiKey;
            document.body.appendChild(script);
        }

    };
    
    // This is a callback function passed to forecast.io API calls.
    // This will be called via JSONP when the API call is loaded.
    //
    // This should invoke the recorded callback function for that
    // weather request.
    //
    this.weatherResponse = function(response) {
        var index = temporaryMemory.index;
        var forecastObjectName =temporaryMemory.forecastObjectName;
        
        //console.log(index);
        //console.log(forecastObjectName)
        locations[index].forecasts[forecastObjectName] = {} // Creating the weather object about to be populated. Needs the square braces, or else it just creates the one object called "forecastObjectName" regardless of what is actually stored in the variable. -Lachlan.
       
        //console.log(locations[index].forecasts);
       // console.log(locations[index].forecasts[forecastObjectName]);
        
        var objectPath = locations[index].forecasts[forecastObjectName] // just defining this now to make the following process neater. Once again, doesn't work without the square braces. -Lachlan
        var apiPath = response.daily.data[0]
        
        //The following either updates or populates the weather forecast object for the specified date and location. -Lachlan
        objectPath.weatherSummary = apiPath.summary; 
        objectPath.minimumTemperature = apiPath.temperatureMin;
        objectPath.maximumTemperature = apiPath.temperatureMax;
        objectPath.humidity = apiPath.humidity;
        objectPath.windSpeed = apiPath.windSpeed;
        
        var functionToCall = callbacks.forecastObjectName
        
        saveLocations();//calling the function to update the localstorage.
        
        functionToCall(index, locations[index].forecasts[forecastObjectName]); //This should pass the weather object at the given date to the callback function specified by the call to "this.getWeatherAtIndexForDate".
        console.log(locations[index].forecasts)
        temporaryMemory.index = ""; //Clearing the temporary memory now that we're done using it. This part is critical to the whole process. -Lachlan
        temporaryMemory.forecastObjectName = "";
    };

    // Private methods:
    
    // Given a latitude and longitude, this method looks through all
    // the stored locations and returns the index of the location with
    // matching latitude and longitude if one exists, otherwise it
    // returns -1.
    //
    function indexForLocation(latitude, longitude)
    {
        for(var i = 0; i < locations.length; i++)
            {
                if(locations[i].latitude === latitude && locations[i].longitude === longitude)
                {
                    return i
                }
            }
        return -1
    }
}


// Restore the singleton locationWeatherCache from Local Storage.
//
function loadLocations()
{
    locationWeatherCache = new LocationWeatherCache; // creating the instance of the cache, asuming it has not been done already - Lachlan
    if(localStorage.getItem(APP_PREFIX) != null && localStorage.getItem(APP_PREFIX) != undefined)
    {
    var cacheJSON = localStorage.getItem(APP_PREFIX);
    var cachePDO = JSON.parse(cacheJSON);
    locationWeatherCache.initialiseFromPDO(cachePDO);
    }
    
}

// Save the singleton locationWeatherCache to Local Storage.
//
function saveLocations()
{
    
    localStorage.setItem(APP_PREFIX, locationWeatherCache.toJSON());
}