# Weather-Checker

retrieve weather conditions:
<!-- https://openweathermap.org/api/one-call-api -->

convert location to coordinates using direct geocoding:
<!-- https://openweathermap.org/api/geocoding-api -->

test:
<!-- https://api.openweathermap.org/geo/1.0/direct?q=Cibolo,Texas,78108&appid=d841e4eacb5f75656f4463661995ba03 -->

q: City name, state code (only for the US) and country code divided by comma. Please use ISO 3166 country codes.

appid: Your unique API key (you can always find it on your account page under the "API key" tab)

limit: Number of the locations in the API response (up to 5 results can be returned in the API response)


city
-current conditions 
    -date
    -icon for weather conditions
    -temperature
    -humidity
    -wind speed
    -UV index
        -color to show favorable, moderate, or severe
        -1,2: low, greed
        -3,4,5: moderate, yellow
        -6,7: high, orange
        -8,9,10: very high, red
        -11+: extreme, purple

-future weather conditions-
    -5 day forecast-
        -date
        -icon for weather conditions
        -temperature
        -wind speed
        -humidity
