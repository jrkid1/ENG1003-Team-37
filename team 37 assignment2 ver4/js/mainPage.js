loadLocations() 

console.log(locationWeatherCache.length())

function viewLocation(locationName)
{ 
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationName); 
    // Automatically load the view location page after user clicked the "Add location" button
    location.href = 'viewlocation.html';
  
}
//load local storage stuff LocationArray=LocationWeatherCache.initialiseFromPDO
var currentTime = new Date()
{
	var dateInfo = ""
	var monthInfo = ""
	var yearInfo = ""
    
dateInfo=currentTime.getDate("en-AU")
monthInfo=currentTime.getMonth("en-AU")
yearInfo=currentTime.getFullYear("en-AU")

// Satisfying the date format, adding a zero in front of a single digit number
if (dateInfo<10)
    {
        dateInfo='0'+dateInfo
        
    }
    if (monthInfo<10)
    {
        monthInfo='0'+monthInfo
        
    }
}

//output the selected date in the required format
SelectedDate = yearInfo+"-"+monthInfo+"-"+ dateInfo;
stringDate=String(SelectedDate);

//Generate the main page list using a for loop
for (i=0;i<locationWeatherCache.length();i++)
        {
            var locationObject = locationWeatherCache.locationAtIndex(i);
            var nickname = locationObject.name;
            var list=' <li class="mdl-list__item mdl-list__item--two-line" onclick="viewLocation('+i+');"><span class="mdl-list__item-primary-content"> <img class="mdl-list__item-icon" id="icon'+i+'" src="images/loading.gif" class="list-avatar" /><span>'+nickname+'</span><span id="weather'+i+'" class="mdl-list__item-sub-title">loading</span></span></li>';
            document.getElementById('locationList').innerHTML+=list;
        }
                  
//LocationWeatherCache.length
    for (i=0;i<locationWeatherCache.length();i++)
        {
            console.log("executing loop at index: " + i + " for the date of: " + stringDate)
            console.log(locationWeatherCache.locationAtIndex(i))
            achieveWeatherInfo(i,stringDate)
        }

//replacing loading image
 function showIcon(i,image)
        {
            console.log(i+image+'Image function is working');
            return "images/"+image+'.PNG' ;//change loading.gif to object property in forecast api called icon
        }


// Calling this function will achieve the weather information for the location stored. Format of date: 2016-05-29
function achieveWeatherInfo(index,date)
{
    locationWeatherCache.achieveWeatherInfoAtIndexForDate(index,date,showWeatherMainPage);
}

//This function will update the values stored every time new weather data is added
function showWeatherMainPage(index, object) 
            { 
            
        var locationObject = locationWeatherCache.locationAtIndex(index) // this provides a simplified location object.
                
             var   index = index //making sure everything goes accordingly
             var    nickname = locationObject.name; //obtain the name saved in the locationObject
             var   latitude= locationObject.latitude; //use the saved latitude
             var    longitude = locationObject.longitude; //use the saved longitude
                
            //Use the stored weather information and will output on the list on main page
             var    summary = object.weatherSummary;
             var    minimumTemperature = object.minimumTemperature;
             var    maximumTemperature = object.maximumTemperature;
             var     humidity = object.humidity;
             var     windSpeed = object.windSpeed;
             var icon = object.icon;
             console.log(icon)
          
             //output some simplified info of the weather such as max and min temperature
              document.getElementById('weather'+index).innerHTML="Minimum:"+minimumTemperature+" "+"Maximum:"+maximumTemperature 
            document.getElementById('icon'+index).src= showIcon(index,icon) 
           
            }
