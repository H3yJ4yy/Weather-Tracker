var cityInput = document.querySelector(".cityInput");
var searchBtn = document.querySelector(".searchBtn");
var currentWeather = document.querySelector(".currentWeather");
var weatherCards = document.querySelector(".weatherCards");
var previousSearchesDiv = document.querySelector(".previousSearches");

var APIkey = "04783e0f85194e2d59f907621a7cc742";

function createWeatherCard(cityName, weatherItem, index) {
  if (index === 0) {
    return (
      '<div class="weatherDetails">' +
      "<h2>" +
      cityName +
      " (" +
      weatherItem.dt_txt.split(" ")[0] +
      ")</h2>" +
      "<h4>Temperature: " +
      weatherItem.main.temp +
      " °F</h4>" +
      "<h4>Wind: " +
      weatherItem.wind.speed +
      " MPH</h4>" +
      "<h4>Humidity: " +
      weatherItem.main.humidity +
      " %</h4>" +
      "</div>" +
      '<div class="weatherIcon">' +
      '<img src = "https://openweathermap.org/img/wn/' +
      weatherItem.weather[0].icon +
      '@4x.png" alt="weather-icon">' +
      "</div>"
    );
  } else {
    return (
      '<li class="card">' +
      "<h3>" +
      weatherItem.dt_txt.split(" ")[0] +
      "</h3>" +
      '<img src = "https://openweathermap.org/img/wn/' +
      weatherItem.weather[0].icon +
      '@2x.png" alt="weather-icon">' +
      "<h4>Temp: " +
      weatherItem.main.temp +
      " °F</h4>" +
      "<h4>Wind: " +
      weatherItem.wind.speed +
      " MPH</h4>" +
      "<h4>Humidity: " +
      weatherItem.main.humidity +
      " %</h4>" +
      "</li>"
    );
  }
}

function getWeatherDetails(cityName, lat, lon) {
  var WEATHER_API_URL =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIkey +
    "&units=imperial";
  fetch(WEATHER_API_URL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var singleForecastDay = [];
      var fiveDaysForecast = data.list.filter(function (forecast) {
        var forecastDate = new Date(forecast.dt_txt).getDate();
        if (!singleForecastDay.includes(forecastDate)) {
          return singleForecastDay.push(forecastDate);
        }
      });
      console.log(data.list);
      cityInput.value = "";
      weatherCards.innerHTML = "";
      currentWeather.innerHTML = "";

      fiveDaysForecast.forEach(function (weatherItem, index) {
        if (index === 0) {
          currentWeather.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherCards.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(function () {
      alert(
        "Sorry, it seems we are experiencing some issues looking for the weather forecast!"
      );
    });
}

function getCityCoordinates() {
  var cityName = cityInput.value.trim();
  if (!cityName) return;
  saveSearch(cityName);
  previousSearches()
  var GEOCODING_API_URL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=" +
    APIkey +
    "&units=imperial";

  fetch(GEOCODING_API_URL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data.length)
        return alert("Sorry! It seems " + cityName + " does not exist!");
      var name = data[0].name;
      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeatherDetails(name, lat, lon);
    })
    .catch(function () {
      alert("Sorry! It seems we can't find those coordinates!");
    });
}
function saveSearch(city) {
  var saveCities = localStorage.getItem("searchHistory");
  if (saveCities) {
    var saveCityArray = JSON.parse(saveCities);
    var newSaveCityArray = [city, ...saveCityArray];
    localStorage.setItem("searchHistory", JSON.stringify(newSaveCityArray));
  } else {
    localStorage.setItem("searchHistory", JSON.stringify([city]));
  }
}

function previousSearches() {
  var searchHistory = localStorage.getItem("searchHistory");

  if (searchHistory) {
    previousSearchesDiv.innerHTML=""
    var searchHistoryArray = JSON.parse(searchHistory);
    console.log(searchHistoryArray)
  }
  return;
}
previousSearches()
searchBtn.addEventListener("click", getCityCoordinates);

cityInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    getCityCoordinates();
  }
});
