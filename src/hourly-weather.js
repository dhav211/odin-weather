class HourlyWeather {
  constructor(hour, condition, conditionCode, temperature) {
    this.hour = hour;
    this.condition = condition;
    this.conditionCode = conditionCode;
    this.temperature = temperature;
  }
}

let forecast;
let hourlyWeatherElement;
let numberOfHours = 0;
let numberOfNavigationCircles = 0;
let currentHighlightedNavigationCircle = 0;

export function createHourlyForecast(currentForecast) {
  try {
    forecast = currentForecast;
    hourlyWeatherElement = document.createElement("div");

    if (window.innerWidth >= 1000) {
      numberOfHours = 8;
      numberOfNavigationCircles = 3;
    } else if (window.innerWidth < 1000 && window.innerWidth >= 700) {
      numberOfHours = 6;
      numberOfNavigationCircles = 4;
    } else if (window.innerWidth < 700 && window.innerWidth >= 500) {
      numberOfHours = 4;
      numberOfNavigationCircles = 6;
    } else if (window.innerWidth < 500) {
      numberOfHours = 3;
      numberOfNavigationCircles = 8;
    }

    buildHourlyWeatherElement(0);

    return hourlyWeatherElement;
  } catch (err) {
    console.error(err);
    const errorText = document.createElement("p");
    errorText.textContent = "Failed to get hourly forecast";
    return errorText;
  }
}

// TODO use css grid to divide the hourly weather element in three parts. two parts which are about 48-64px for the arrows on each end
//  then the middle section can be auto sized

function buildHourlyWeatherElement(index) {
  hourlyWeatherElement.replaceChildren();

  setWeatherHours(index * numberOfHours);
  setNavigationCircles();
}

function setWeatherHours(startingHour) {
  const hourlyForecast = setHourlyForecast(forecast);
  const hours = document.createElement("div");
  hours.classList.add("forecast-container");
  hourlyWeatherElement.appendChild(hours);

  const leftArrow = document.createElement("img");
  leftArrow.src = "./images/icons/chevron-left.svg";
  leftArrow.classList.add("small-icon");
  leftArrow.addEventListener("click", () => {
    currentHighlightedNavigationCircle =
      currentHighlightedNavigationCircle - 1 < 0
        ? numberOfNavigationCircles - 1
        : currentHighlightedNavigationCircle - 1;

    buildHourlyWeatherElement(currentHighlightedNavigationCircle);
  });

  const rightArrow = document.createElement("img");
  rightArrow.src = "./images/icons/chevron-right.svg";
  rightArrow.classList.add("small-icon");
  rightArrow.addEventListener("click", () => {
    currentHighlightedNavigationCircle =
      currentHighlightedNavigationCircle + 1 === numberOfNavigationCircles
        ? 0
        : currentHighlightedNavigationCircle + 1;

    buildHourlyWeatherElement(currentHighlightedNavigationCircle);
  });

  hours.appendChild(leftArrow);

  if (numberOfHours + startingHour > 24) {
    console.log("hey stop!!");
    currentHighlightedNavigationCircle--;
    startingHour -= numberOfHours;
  }

  for (let i = 0; i < numberOfHours; i++) {
    const hourElement = setHourElement(
      hourlyForecast[i + startingHour].hour,
      hourlyForecast[i + startingHour].conditionCode,
      hourlyForecast[i + startingHour].temperature,
    );

    hours.appendChild(hourElement);
  }

  hours.appendChild(rightArrow);
}

function setNavigationCircles() {
  const navigationCircles = document.createElement("div");
  navigationCircles.classList.add("navigation-circles");

  for (let i = 0; i < numberOfNavigationCircles; i++) {
    const navigationCircle = document.createElement("div");
    navigationCircle.classList.add("navigation-circle");
    navigationCircles.appendChild(navigationCircle);
    navigationCircle.addEventListener("click", () => {
      currentHighlightedNavigationCircle = i;
      buildHourlyWeatherElement(i);
    });

    if (i === currentHighlightedNavigationCircle) {
      navigationCircle.style.backgroundColor = "#F5E8C7";
    }
  }

  hourlyWeatherElement.appendChild(navigationCircles);
}

function setHourElement(hour, conditionCode, temperature) {
  const hourElement = document.createElement("div");

  const hourText = document.createElement("h2");
  hourText.textContent = hour;

  const conditionContainer = document.createElement("div");
  conditionContainer.classList.add("daily-weather-condition-container");
  const icon = document.createElement("img");
  icon.classList.add("small-icon");
  fetch("src/conditions.json")
    .then((r) => r.json())
    .then(
      (conditions) =>
        (icon.src = `./images/icons/${conditions[conditionCode].icon}.svg`),
    );
  const temperatureText = document.createElement("h2");
  temperatureText.textContent = `${temperature}°`;
  conditionContainer.replaceChildren(icon, temperatureText);

  hourElement.replaceChildren(hourText, conditionContainer);

  return hourElement;
}

function setHourlyForecast() {
  const hourly = [];

  const forecastDate = new Date(forecast["location"].localtime);
  const currentHour = forecastDate.getHours();

  const todaysHours =
    forecast["forecast"].forecastday[0].hour.slice(currentHour);
  const tomorrowsHours = forecast["forecast"].forecastday[1].hour.slice(
    0,
    currentHour,
  );
  const combinedHours = [].concat(todaysHours, tomorrowsHours);

  combinedHours.forEach((hour) =>
    hourly.push(
      new HourlyWeather(
        setHour(new Date(hour.time)),
        hour.condition.text,
        hour.condition.code,
        Math.floor(hour.temp_f),
      ),
    ),
  );

  return hourly;
}

function setHour(date) {
  const time = date.getHours();
  let hour = "";

  if (time == 0) {
    hour = `12AM`;
  } else if (time >= 1 && time <= 11) {
    hour = `${time}AM`;
  } else if (time == 12) {
    hour = `12PM`;
  } else if (time >= 13 && time <= 23) {
    hour = `${time - 12}PM`;
  }

  return hour;
}

// Trigger a rebuild of the hourly weather element
addEventListener("resize", () => {
  if (window.innerWidth >= 1000 && numberOfHours !== 8) {
    setForRebuildOnResize(8, 3);
  } else if (
    window.innerWidth < 1000 &&
    window.innerWidth >= 700 &&
    numberOfHours !== 6
  ) {
    setForRebuildOnResize(6, 4);
  } else if (
    window.innerWidth < 700 &&
    window.innerWidth >= 500 &&
    numberOfHours !== 4
  ) {
    setForRebuildOnResize(4, 6);
  } else if (window.innerWidth < 500 && numberOfHours !== 3) {
    setForRebuildOnResize(3, 8);
  }
});

function setForRebuildOnResize(hours, circles) {
  currentHighlightedNavigationCircle = Math.round(
    (numberOfHours * currentHighlightedNavigationCircle) / hours,
  );
  numberOfHours = hours;
  numberOfNavigationCircles = circles;
  buildHourlyWeatherElement(currentHighlightedNavigationCircle);
}
