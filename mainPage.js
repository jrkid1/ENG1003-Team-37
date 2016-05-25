// Code for the main app page (locations list).

// This is sample code to demonstrate navigation.
// You need not use it for final app.

function viewLocation(locationName)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationName); 
    // And load the view location page.
    location.href = 'viewlocation.html';
}

    for (i=0;i<4;i++)
        {
getlist()
loadlist()
        }


function getlist()
{
var summary='rain'+i
var nickname='index'+i
var title='Place'

        
            var list=' <li class="mdl-list__item mdl-list__item--two-line" onclick="viewLocation(0);"><span class="mdl-list__item-primary-content"> <img class="mdl-list__item-icon" id="icon0" src="images/loading.png" class="list-avatar" /><span>'+nickname+'</span><span id="weather'+i+'" class="mdl-spinner mdl-js-spinner is-active"></span></span></li>'
             var weather='hi'+i
           var string=String(list)         
        
     document.getElementById('locationList').innerHTML+=string 
}

function loadlist()
{
var summary='rain'+i
var nickname='index'+i
var title='Place'

        
            var list=' <li class="mdl-list__item mdl-list__item--two-line" onclick="viewLocation(0);"><span class="mdl-list__item-primary-content"> <img class="mdl-list__item-icon" id="icon0" src="images/loading.png" class="list-avatar" /><span>'+nickname+'</span><span id="weather'+i+'" class="mdl-list__item-sub-title">'+summary+'</span></span></li>'
             var weather='hi'+i
           var string=String(list)         
        
     document.getElementById('locationList').innerHTML+=string 
}



