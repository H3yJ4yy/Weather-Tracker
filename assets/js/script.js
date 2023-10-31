var cityInput = document.querySelector(".cityInput");
var searchBtn = document.querySelector(".searchBtn");
var currentWeather = document.querySelector(".currentWeather")
var weatherCards = document.querySelector(".weatherCards")
var historyList = document.querySelector(".historyList");

var APIkey = '04783e0f85194e2d59f907621a7cc742'

var createWeatherCard = (cityName, weatherItem, index) => { 
    if (index === 0) { // current weather
        return `<div class="weatherDetails">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${weatherItem.main.temp} °F</h4>
                    <h4>Wind:${weatherItem.wind.speed} MPH</h4>
                    <h4>Hummidity:${weatherItem.main.humidity} %</h4>
                </div>
                <div class="weatherIcon"> 
                    <img src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                </div>`;
    }else{ //5 day forecast
        return `<li class="card"> 
                    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <img src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>Temp: ${weatherItem.main.temp} °F</h4>
                    <h4>Wind:${weatherItem.wind.speed} MPH</h4>
                    <h4>Hummidity:${weatherItem.main.humidity} %</h4>
                </li>`
    }
}

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

        cityInput.value = "";
        weatherCards.innerHTML = "";
        currentWeather.innerHTML = "";


        console.log(fiveDaysForecast)
        fiveDaysForecast.forEach((weatherItem, index )=> {
            if(index === 0){
                currentWeather.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else{
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(()=>{
        alert('Sorry, seems we are expecting some issues looking sor the weather forecast!');

    });
}

var getCityCoordinates = () => {
    var cityName = cityInput.value.trim();// get entered city name & removes extra spaces
    if(!cityName) return;
    var GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIkey}&units=imperial`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length)return alert(`Sorry! Seems ${cityName} does not exist!`);
        var { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() =>{
        alert("Sorry! Seems we cant find those coordinates!");
    });
}

searchBtn.addEventListener("click", getCityCoordinates);


cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());