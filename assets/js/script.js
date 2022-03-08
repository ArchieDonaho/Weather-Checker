
var getWeather = function(lat, lon){
    var weather = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=d841e4eacb5f75656f4463661995ba03";

    fetch(weather).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}


var getLocation = function(){

    var location = "https://api.openweathermap.org/geo/1.0/direct?q=cibolo,Texas&appid=d841e4eacb5f75656f4463661995ba03";

    fetch(location).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data[0].lat, data[0].lon);
                getWeather(data[0].lat, data[0].lon);
            })
        }
    })
}

getLocation();
