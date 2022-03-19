//create the search history array
var searchHistory = [];

//use the timezone to generate a date at that location
var timeZone = function(timezone){
    //obtain the user's timezone. guess(true) will ensure that the cached timezone will be ignored and overwritten with the new value.
    var myTimeZone = moment.tz.guess(true);

    //obtain the data for the user's current date/time
    var myTime = moment.tz((moment().format()), myTimeZone);

    //obtain the target location's date/time
    var theirTime = myTime.clone().tz(timezone);

    //return the date/time
    return theirTime;
}

//loads the search history upon page load/when a new search term is created
var loadHistory = function(){
    searchHistory =  JSON.parse(localStorage.getItem("history"));

    //if there is no history saved, generate a new array
    if(!searchHistory){
        searchHistory = [];
    }

    //remove the current list
    $("#search-history")
        .text("")
        .addClass("mb-4");

    // for each index in the array...
    $.each(searchHistory, function(index, item) {
        //generate the search history list
        $("<button>")
            .text(item)
            .addClass("col-5 col-lg-10 my-2 py-1 mx-auto btn btn-secondary shadow")
            .appendTo($("#search-history"))
    })
}

//saves the search history upon making a new search term
var saveHistory = function(city){
    //save the city into the history bar, if the city isn't present. If it is already present, move it to the top of the list
    if(!searchHistory.includes(city)){
        searchHistory.unshift(city);
    } else {
        var index = searchHistory.indexOf(city);
        searchHistory.splice(index, 1);
        searchHistory.unshift(city);
    }

    //if the search history is too long, then delete the last item
    if(searchHistory.length > 10){
        searchHistory.pop();
    }

    //save the search history as a JSON string
    localStorage.setItem("history", JSON.stringify(searchHistory));
    console.log("accessed save");

    //then load it and display onto the webpage
    loadHistory();
}

//displays the current weather data
var displayCurrentWeather = function(current, timezone, city){
    console.log(current);
    //obtain the target's time zone
    var theirTime = timeZone(timezone);

    //link for the condition icon
    var icon = "http://openweathermap.org/img/wn/" + current.weather[0].icon + "@2x.png"

    //generate the weather data
    $("#current-weather").text(city + "'s Weather")
        .removeClass("p-3")
        .addClass("col-6");
    $("#date").text(theirTime.format("dddd, MMMM Do YYYY, h:mm a"))
        .addClass("mb-2");
    $("#temp").text(Math.trunc(current.temp) + "°F")
        .addClass("text-bold");
    $("#humidity").text("Humidity: " + current.humidity + "%")
        .addClass("mt-1");
    $("#wind").text("Wind speeds: " + current.wind_speed + "mph")
        .addClass("");
    $("#uv").html("UV index:<span id=uv-color> " + current.uvi + "</span>")
        .addClass("");

    //set the uv span color based on the uv index
    if(current.uvi > 11){
        $("#uv-color").addClass("text-purple font-weight-bold");
    } else if(current.uvi > 7){
        $("#uv-color").addClass("text-red font-weight-bold");
    } else if(current.uvi > 5){
        $("#uv-color").addClass("text-orange font-weight-bold");
    } else if(current.uvi > 2){
        $("#uv-color").addClass("text-yellow font-weight-bold");
    } else {
        $("#uv-color").addClass("text-green font-weight-bold");
    }

    //clear the condition image
    $("#icon").text("");
    
    //create and display the condition image element
    var conditionImg = document.querySelector("#icon");
    conditionImg.src = icon;
    conditionImg.classList.add("h-100");
}

//displays the future weather data
var displayForecast = function(daily, timezone){
    //get the date of the target location
    var theirTime = timeZone(timezone);

    //remove any old content in the forecast section
    $("#forecast").text("");

    //loop through the array and generate the forecast
    $.each(daily, function(index, item){
        //only create 5 cards
        if(index === 5){return false};

        //create card
        $("<div>")
            .attr("id", "day-" + index)
            .addClass("card card-style d-flex flex-row flex-lg-column border-dark")
            .appendTo($("#forecast"));
            
        //create card header
        $("<div>")
            .text(theirTime.add(1, 'd').format("dddd, MMMM Do, YYYY"))
            .addClass("card-header text-center align-middle ")
            .appendTo("#day-" + index);

        //create card body
        $("<div>")
            .attr("id", "card-body-" + index)
            .addClass("card-body col-5 col-lg-12")
            .appendTo("#day-" + index);

        //create card body to hold the condition image
        $("<div>")
            .attr("id", "card-image-" + index)
            .addClass("card-body col-5 col-lg-12")
            .appendTo("#day-" + index);

        //create each div to display the forecast, then append to the card body
        $("<div>")
            .text("Temperature: " + Math.trunc(daily[index].temp.day) + "°F")
            .addClass("card-text my-2")
            .appendTo("#card-body-" + index);

        $("<div>")
            .text("Wind Speed: " + Math.trunc(daily[index].wind_speed) + "mph")
            .addClass("card-text my-2")
            .appendTo("#card-body-" + index);

        $("<div>")
            .text("Humidity: " + daily[index].humidity + "%")
            .addClass("card-text my-2")
            .appendTo("#card-body-" + index);

            //create condition image and append to the card image body
        $("<img>")
            .addClass("img-fluid")
            .attr("src", "http://openweathermap.org/img/wn/" + daily[index].weather[0].icon + "@2x.png")
            .appendTo("#card-image-" + index);
    })
}

//obtains the weather data using the latitude and longitude
var getWeather = function(lat, lon, city){
    //api link that contains the weather data
    var weather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=d841e4eacb5f75656f4463661995ba03";

    fetch(weather).then(function(response){
        //if we get a 2XX status code
        if(response.ok){
            response.json().then(function(data){
                //display the current weather and the forecasted weather
                displayCurrentWeather(data.current, data.timezone, city);
                displayForecast(data.daily, data.timezone);
           })
        } else {
            alert("Something Went Wrong, Please Try Again");
        }
    })
}

//obtains the target's latitude and longitude using the name of the city
var getLocation = function(city){
    //api link that contains the city's data
    var location = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=d841e4eacb5f75656f4463661995ba03";

    fetch(location).then(function(response){
        //if we get a 2XX status code
        if(response.ok){
            response.json().then(function(data){
                if(data[0] == undefined){
                    alert("Please Enter a Valid Vity")
                } else {
                    //use the value of the city name they provided since it already has the proper capitalization
                    city = data[0].name;

                    //send the geodata to obtain the weather data
                    getWeather(data[0].lat, data[0].lon, city);

                    //save the array to the search History
                    saveHistory(city);
                }
            })
        } else {
            alert("Please Try Again")
        }
    })
}

//generate the search history list
loadHistory();

//when the submit button is clicked in the form
$("#form").on("submit", function(event){
    event.preventDefault();
    //obtain the city from the input field
    var city = $("#city").val().trim();

    //get the geodata from the city
    getLocation(city);

    // delete the text from the input box
    $("#city").val("");
})

//when a search history button is clicked
$("#search-history").on("click", "button", function(event){
    //obtain the text within the button
    var city = $(this).text().trim();

    //display the weather information using the text obtained
    getLocation(city);
})


