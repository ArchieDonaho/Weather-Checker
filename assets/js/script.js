//create the search history array
var searchHistory = [];

var loadHistory = function(){
    searchHistory =  JSON.parse(localStorage.getItem("history"));

    //if there is no history saved, generate a new array
    if(!searchHistory){
        searchHistory = [];
    }

    //remove the current list
    $("#search-history").text("");

    // for each index in the array...
    $.each(searchHistory, function(index, item) {
        //generate the search history list
        $("<button>")
            .text(item)
            .addClass("col-10 my-2 py-1 mx-auto")
            .appendTo($("#search-history"))
    })
}

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

var displayCurrentWeather = function(current){
    console.log(current);

    var icon = "http://openweathermap.org/img/wn/" + current.weather[0].icon + "@2x.png"

    $("#current-weather").text("Today's Forecast");
    $("#date").text(moment().format("dddd, MMMM Do YYYY"));
    $("#temp").text("current temp is: " + current.temp + "°F"); 
    $("#humidity").text("humidity today is: " + current.humidity + "%");
    $("#wind").text("wind speeds today are: " + current.wind_speed + "mph");
    $("#uv").text("UV index: " + current.uvi);

    //clear the condition image
    $("#icon").text("");
    
    //create and display the condition element
    var img = document.createElement("img");
    img.src = icon;
    $("#icon").append(img);
    
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
            .text(moment().add((index + 1), 'd').format("dddd, MMMM Do YYYY"))
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

                    //send the geodata to obtain the weather data
                    getWeather(data[0].lat, data[0].lon);

                    //use the value of the city name they provided since it already has the proper capitalization
                    city = data[0].name;

                    //save the array
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

    console.log(city);

    //get the geodata from the city
    getLocation(city);

    // delete the text from the input box
    $("#city").val("");
})

//then a search history button is clicked
$("#search-history").on("click", "button", function(event){
    //obtain the text within the button
    var city = $(this).text().trim();

    //display the weather information once the button is clicked
    getLocation(city);
})
