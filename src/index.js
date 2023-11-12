import { createDailyWeather } from "./daily-weather.js";
import { createHourlyForecast, closeHourlyForecast } from "./hourly-weather.js";
import { createCurrentWeatherDetails } from "./current-weather-details.js";

async function getForecast(cityName) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=a153e9f2c28c497e9e613836230111&q=${cityName}&days=3`,
    { mode: "cors" },
  );
  const weather = await response.json();

  return weather;
}

const cityForm = document.getElementById("city-form");
const submitForm = document.getElementById("submit-form");
cityForm.value = "";

submitForm.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("submit form");
  if (cityForm.value.length > 0) {
    const name = await findCity(cityForm.value);

    if (name.length > 0) {
      setFields(name);
      cityForm.value = "";
    }
  }
});

// From an attempt of the city name, this will search it and return the first value
async function findCity(cityNameAttempt) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=a153e9f2c28c497e9e613836230111&q=${cityNameAttempt}`,
    { mode: "cors" },
  );
  const cities = await response.json();

  return cities[0].name;
}

async function setFields(cityName) {
  const forecast = await getForecast(cityName);
  console.log(forecast);
  const cityHeader = document.getElementById("city-header");
  document.getElementById("current-time-date").textContent =
    setCurrentTime(forecast);
  // document
  //   .getElementById("daily-weather-holder")
  //   .appendChild(createDailyWeather(forecast["forecast"]));

  cityHeader.textContent = forecast["location"].name;
  // currentTemp.textContent = `Current Temperature: ${forecast["current"].temp_f}F`;

  // document
  //   .getElementById("hourly-weather-holder")
  //   .appendChild(createHourlyForecast(forecast["forecast"]));

  const currentWeatherDetails = document.getElementById(
    "current-weather-details-container",
  );

  currentWeatherDetails.replaceChildren();
  currentWeatherDetails.appendChild(createCurrentWeatherDetails(forecast));

  setDailyHourlyButtons(forecast);
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

setFields("sioux falls");
