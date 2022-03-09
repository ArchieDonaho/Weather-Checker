var displayEl = document.querySelector("#display-data")
var currentWeatheEl = document.querySelector;

var iconEl = document.querySelector("#icon");
var conditionsEl = document.querySelector("#conditions");


var displayCurrentWeather = function(current){
    console.log(current);

    var icon = "http://openweathermap.org/img/wn/" + current.weather[0].icon + "@2x.png"

    $("#current-weather").text("Today's Forecast");
    $("#date").text( "date is: ");
    $("#temp").text("current temp is: " + current.temp + "°F"); 
    $("#humidity").text("humidity today is: " + current.humidity + "%");
    $("#wind").text("wind speeds today are: " + current.wind_speed + "mph");
    $("#uv").text("UV index: " + current.uvi);

    conditionsEl.textContent = "";
    
    var img = document.createElement("img");
    img.src = icon;
    conditionsEl.appendChild(img);
    
}

var displayForecast = function(daily){
    console.log(daily);

    //remove any old content in teh forecast section
    $("#forecast").text("");

    //loop through the array and generate the forecast
    $.each(daily, function(index, item){
        if(index === 5){return false};
        //create card
        $("<div>")
            .attr("id", "day-" + index)
            .addClass("card col-2")
            .appendTo($("#forecast"));

        //create each div to display the forecast, then append to the card
        $("<div>")
            .text("Day " + (index + 1))
            .addClass("")
            .appendTo("#day-" + index);

            $("<div>")
            .text("Temperature: " + daily[index].temp.day + "°F")
            .addClass("")
            .appendTo("#day-" + index);

            $("<div>")
            .text("Wind Speed: " + daily[index].wind_speed + "mph")
            .addClass("")
            .appendTo("#day-" + index);

            $("<div>")
            .text("Humidity: " + daily[index].humidity + "%")
            .addClass("")
            .appendTo("#day-" + index);

            $("<img>")
            .addClass("")
            .attr("src", "http://openweathermap.org/img/wn/" + daily[index].weather[0].icon + "@2x.png")
            .appendTo("#day-" + index);
    })
}

var getWeather = function(lat, lon){
    var weather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=d841e4eacb5f75656f4463661995ba03";

    fetch(weather).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);

                displayCurrentWeather(data.current);
                displayForecast(data.daily);
           })
        } else {
            alert("Something Went Wrong, Please Try Again")
        }
    })
}


var getLocation = function(city){

    var location = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=d841e4eacb5f75656f4463661995ba03";

    fetch(location).then(function(response){
        //if we get a 2XX status code
        if(response.ok){
            response.json().then(function(data){
                if(data[0] == undefined){
                    alert("Please Enter a Valid Vity")
                } else {
                    console.log(data[0].lat, data[0].lon);
                    getWeather(data[0].lat, data[0].lon);
                }
            })
        } else {
            alert("Please Try Again")
        }
    })
}


$("#form").on("submit", function(event){
    event.preventDefault();
    //
    var city = $("#city").val().trim();
    console.log(city);
    getLocation(city);
})
