import { getDailyWeather } from "./daily-weather.js";
import { getHourlyForecast } from "./hourly-weather.js";

async function getForecast(cityName) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=a153e9f2c28c497e9e613836230111&q=${cityName}&days=3`,
    { mode: "cors" },
  );
  const weather = await response.json();

  return weather;
}

async function setFields() {
  const forecast = await getForecast("portland");
  const cityHeader = document.getElementById("city-header");
  const currentTemp = document.getElementById("current-temp");
  document
    .getElementById("daily-weather-holder")
    .appendChild(getDailyWeather(forecast["forecast"]));

  cityHeader.textContent = forecast["location"].name;
  currentTemp.textContent = `Current Temperature: ${forecast["current"].temp_f}F`;

  document
    .getElementById("hourly-weather-holder")
    .appendChild(getHourlyForecast(forecast["forecast"]));
}

setFields();
