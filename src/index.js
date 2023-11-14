import { createDailyWeather } from "./daily-weather.js";
import { createHourlyForecast, closeHourlyForecast } from "./hourly-weather.js";
import { createCurrentWeatherDetails } from "./current-weather-details.js";
import { setBannerFromForecast } from "./banner-image.js";

const content = document.getElementById("content");
const loadingContainer = document.getElementById("loading-container");

async function getForecast(cityName) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=a153e9f2c28c497e9e613836230111&q=${cityName}&days=3`,
    { mode: "cors" },
  );
  const weather = await response.json();

  return weather;
}

export async function setContent(cityName) {
  let currentForecast = undefined;
  content.style.display = "none";
  loadingContainer.style.display = "flex";
  getForecast(cityName).then((result) => {
    currentForecast = result;
    setBannerFromForecast(currentForecast["current"]).then(() => {
      setFields(currentForecast);
    });
  });
}

function setFields(currentForecast) {
  const cityHeader = document.getElementById("city-header");
  document.getElementById("current-time-date").textContent =
    setCurrentTime(currentForecast);

  cityHeader.textContent = currentForecast["location"].name;

  const currentWeatherDetails = document.getElementById(
    "current-weather-details-container",
  );

  currentWeatherDetails.replaceChildren();
  currentWeatherDetails.appendChild(
    createCurrentWeatherDetails(currentForecast),
  );

  setDailyHourlyButtons(currentForecast);

  content.style.display = "block";
  loadingContainer.style.display = "none";
}

function setDailyHourlyButtons(forecast) {
  const dailyButton = document.getElementById("daily-button");
  const hourlyButton = document.getElementById("hourly-button");

  const dailyForecast = createDailyWeather(forecast["forecast"]);
  dailyButton.style.backgroundColor = "#F5E8C7";

  document
    .getElementById("daily-hourly-forecast-container")
    .replaceChildren(dailyForecast);

  dailyButton.addEventListener("click", () => {
    closeHourlyForecast();

    document
      .getElementById("daily-hourly-forecast-container")
      .replaceChildren(dailyForecast);

    dailyButton.style.backgroundColor = "#F5E8C7";
    hourlyButton.style.backgroundColor = "#F5F7F8";
  });

  hourlyButton.addEventListener("click", () => {
    const hourlyForecast = createHourlyForecast(forecast);

    document
      .getElementById("daily-hourly-forecast-container")
      .replaceChildren(hourlyForecast);

    hourlyButton.style.backgroundColor = "#F5E8C7";
    dailyButton.style.backgroundColor = "#F5F7F8";
  });
}

function setCurrentTime(forecast) {
  return new Date(forecast["location"].localtime).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

setContent("sioux falls");
