import { getDailyWeather } from "./daily-weather.js";

async function getCurrentWeather(cityName) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=a153e9f2c28c497e9e613836230111&q=${cityName}`,
    { mode: "cors" },
  );
  const weather = await response.json();

  return weather;
}

async function getForecast(cityName) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=a153e9f2c28c497e9e613836230111&q=${cityName}&days=3`,
    { mode: "cors" },
  );
  const weather = await response.json();
  console.log(weather);
  return weather;
}

async function setFields() {
  const cityHeader = document.getElementById("city-header");
  const currentTemp = document.getElementById("current-temp");
  const currentWeather = await getCurrentWeather("portland");
  document
    .getElementById("daily-weather-holder")
    .appendChild(getDailyWeather(await getForecast("portland")));

  cityHeader.textContent = currentWeather["location"].name;
  currentTemp.textContent = `Current Temperature: ${currentWeather["current"].temp_f}F`;
}

setFields();
getForecast("portland");
