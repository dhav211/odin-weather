/*
User will be able to type in a city and search it to get weather forecast.
Once user starts typing into search box it will request the weather api to find cities with what user has typed
If it returns results then there is a suggestion box that will pop up with given results from api
User can click on a suggestion to show weather forecast for that city
*/

import { setContent } from "./index.js";

const cityForm = document.getElementById("city-form");
const submitForm = document.getElementById("submit-form");
cityForm.value = "";
let isSuggestionBoxOpen = false;

submitForm.addEventListener("click", async (e) => {
  e.preventDefault();
  if (cityForm.value.length > 0) {
    const cities = await findCities(
      cityForm.value.length > 0 ? cityForm.value : "d",
    );

    if (cities.length > 0) {
      setCity(cities[0].url);
    }
  }
});

cityForm.addEventListener("input", async () => {
  const cities = await findCities(
    cityForm.value.length > 0 ? cityForm.value : "d",
  );

  if (!isSuggestionBoxOpen && cities.length > 0) {
    isSuggestionBoxOpen = true;

    const suggestionBox = createSuggestionBox();

    const cityList = document.createElement("ul");
    suggestionBox.appendChild(cityList);

    fillCityList(cityList, cities);
    document.getElementById("city-search-form").appendChild(suggestionBox);
  } else if (isSuggestionBoxOpen && cities.length > 0) {
    const cityList = document
      .getElementById("suggestion-box")
      .querySelector("ul");
    cityList.replaceChildren();
    fillCityList(cityList, cities);
  } else if (isSuggestionBoxOpen && cities.length === 0) {
    closeSuggestionBox();
  }
});

cityForm.addEventListener("focusout", () => {
  setTimeout(closeSuggestionBox, 200);
});

cityForm.addEventListener("focusin", () => {});

// From an attempt of the city name, this will search it and return the first value
async function findCities(cityNameAttempt) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=a153e9f2c28c497e9e613836230111&q=${cityNameAttempt}`,
    { mode: "cors", headers: { "Access-Control-Allow-Origin": "*" } },
  );
  const cities = await response.json();

  return cities;
}

function createSuggestionBox() {
  const suggestionBox = document.createElement("div");
  suggestionBox.id = "suggestion-box";
  suggestionBox.style.width = `${cityForm.clientWidth}px`;

  return suggestionBox;
}

function fillCityList(cityList, cities) {
  cities.forEach((city) => {
    const citySelector = document.createElement("li");
    citySelector.classList.add("city-name");
    if (city.country === "United States of America") {
      citySelector.textContent = `${city.name}, ${city.region}`;
    } else {
      citySelector.textContent = `${city.name}, ${city.country}`;
    }

    citySelector.addEventListener("click", () => setCity(city.url));

    cityList.appendChild(citySelector);
  });
}

function setCity(cityUrl) {
  setContent(cityUrl);
  cityForm.value = "";
  closeSuggestionBox();
}

function closeSuggestionBox() {
  const suggestionBox = document.getElementById("suggestion-box");

  if (suggestionBox !== null) {
    isSuggestionBoxOpen = false;
    document.getElementById("city-search-form").removeChild(suggestionBox);
  }
}
