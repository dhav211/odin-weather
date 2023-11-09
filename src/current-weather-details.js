export function createCurrentWeatherDetails(currentForecast) {
  const container = document.createElement("div");
  container.classList.add("padded-container");
  container.appendChild(setCurrentWether(currentForecast));
  container.appendChild(setCurrentWeatherDetails(currentForecast));

  return container;
}

function setCurrentWether(currentForecast) {
  const container = document.createElement("div");
  container.classList.add("flex-centered");

  const tempContainer = document.createElement("div");
  tempContainer.classList.add("inline-centered");

  const icon = document.createElement("img");
  fetch("src/conditions.json")
    .then((r) => r.json())
    .then(
      (conditions) =>
        (icon.src = `./images/icons/${
          conditions[currentForecast["current"].condition.code].icon
        }.svg`),
    );
  icon.classList.add("small-icon");
  tempContainer.appendChild(icon);

  const temp = document.createElement("h2");
  temp.style.marginBottom = "0px";
  temp.textContent = `${Math.floor(currentForecast["current"].temp_f)}°`;
  tempContainer.appendChild(temp);

  const conditionText = document.createElement("h2");
  conditionText.style.marginTop = "0px";
  conditionText.textContent = currentForecast["current"].condition.text;

  container.replaceChildren(tempContainer, conditionText);

  return container;
}

function setCurrentWeatherDetails(currentForecast) {
  const container = document.createElement("div");
  container.classList.add("inline-centered");
  container.classList.add("flex-wrap");

  const leftSide = document.createElement("div");
  leftSide.classList.add("detail-container");
  leftSide.classList.add("flex-left-aligned");
  container.appendChild(leftSide);

  const humidityContainer = createWeatherDetail(
    "water-percent",
    `${currentForecast["current"].humidity}%`,
    "Humidity",
  );
  const windContainer = createWeatherDetail(
    "weather-windy",
    `${Math.round(currentForecast["current"].wind_mph)}MPH`,
    "Wind Speed",
  );
  const visibility = createWeatherDetail(
    "eye-outline",
    `${currentForecast["current"].vis_miles}mi`,
    "Visibility",
  );
  leftSide.replaceChildren(humidityContainer, windContainer, visibility);

  const rightSide = document.createElement("div");
  rightSide.classList.add("detail-container");
  rightSide.classList.add("flex-right-aligned");
  container.appendChild(rightSide);

  const rainChanceContainer = createWeatherDetail(
    "cloud-percent-outline",
    `${currentForecast["forecast"].forecastday[0].day.daily_chance_of_rain}%`,
    "Rain Chance",
  );
  const maxTempContainer = createWeatherDetail(
    "thermometer-chevron-up",
    `${Math.round(currentForecast["forecast"].forecastday[0].day.maxtemp_f)}°`,
    "High temperature",
  );
  const minTempContainer = createWeatherDetail(
    "thermometer-chevron-down",
    `${Math.round(currentForecast["forecast"].forecastday[0].day.mintemp_f)}°`,
    "Low temperature",
  );

  // Holder is to insure all elements line up to the left regardles of how big they grow. Only required on right side because
  // elements do align at the end and when elements are different sizes, they get staggered. Holder prevents that stagger
  const holder = document.createElement("div");
  holder.replaceChildren(
    rainChanceContainer,
    maxTempContainer,
    minTempContainer,
  );
  rightSide.appendChild(holder);

  return container;
}

function createWeatherDetail(iconName, value, hoverText) {
  const container = document.createElement("div");
  container.classList.add("weather-detail");
  const icon = document.createElement("img");
  icon.src = `./images/icons/${iconName}.svg`;
  icon.alt = hoverText;
  icon.classList.add("small-icon");
  const amount = document.createElement("h2");
  amount.textContent = value;
  container.replaceChildren(icon, amount);

  return container;
}
