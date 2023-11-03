# Weather Tracker

## Description
This Weather Tracker application allows users to see the weather outlook for multiple cities allowing the user to plan trips accordingly. The user will start by typing the name of a city followed by clicking the search button. once clicked, the user will be presented with the name of the city as well as the conditions, temperature, humidity, and wind speed of both the current weather and the preceding 5-day forecast.

## Sample Code

```javascript
var getWeatherDetails = (cityName, lat, lon) => {
    var WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`
    fetch (WEATHER_API_URL).then(res => res.json()).then(data =>{
        // console.log(data);

        var singleForecastDay = [];
        var fiveDaysForecast = data.list.filter(forecast => {
            var forecastDate = new Date(forecast.dt_txt).getDate();
            if(!singleForecastDay.includes(forecastDate)) {
                return singleForecastDay.push(forecastDate);
            }
        });
```

## Screenshot
![Weather-Tracker](https://github.com/H3yJ4yy/Weather-Tracker/assets/143395836/c0b147c5-0387-405e-a22e-9a14233962c6)


## Link

[Weather Tracker]()
