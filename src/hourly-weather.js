/*
This ultimately creates and returns the element for the 24 hour weather forecast. It consists of each hour element that shows the time,
condition icon, and temperature. It also is responsive with not only css grid/flexbox but also listens in for window resizing and will
rebuild itself when window is small or big enough.
*/

class HourlyWeather {
  constructor(hour, condition, conditionCode, temperature) {
    this.hour = hour;
    this.condition = condition;
    this.conditionCode = conditionCode;
    this.temperature = temperature;
  }
}

class HourlyWeatherContainer {
  #mainContainer = document.createElement("div");

  constructor(numberOfHours, numberOfNavigationCircles) {
    this.hoursContainer = document.createElement("div");
    this.navigationCircleContainer = document.createElement("div");
    this.element = this.setElement();
    this.numberOfHours = numberOfHours;
    this.numberOfNavigationCircles = numberOfNavigationCircles;
    this.currentHighlightedNavigationCircle = 0;
  }

  setHoursContainer(newHoursContainer) {
    this.#mainContainer.replaceChild(newHoursContainer, this.hoursContainer);
    this.hoursContainer = newHoursContainer;
  }

  setNavigationCircleContainer(newNavigationCircleContainer) {
    this.#mainContainer.replaceChild(
      newNavigationCircleContainer,
      this.navigationCircleContainer,
    );
    this.navigationCircleContainer = newNavigationCircleContainer;
  }

  setElement() {
    const initialContainer = document.createElement("div");
    initialContainer.id = "hourly-forecast-container";

    const leftArrow = document.createElement("img");
    leftArrow.src = "./images/icons/chevron-left.svg";
    leftArrow.classList.add("arrow");
    leftArrow.classList.add(
      window.innerWidth > 420 ? "small-icon" : "smaller-icon",
    );
    leftArrow.addEventListener("click", () =>
      arrowOnClick(
        hourlyWeatherContainer.currentHighlightedNavigationCircle - 1 < 0
          ? hourlyWeatherContainer.numberOfNavigationCircles - 1
          : hourlyWeatherContainer.currentHighlightedNavigationCircle - 1,
      ),
    );

    this.#mainContainer.appendChild(this.hoursContainer);
    this.#mainContainer.appendChild(this.navigationCircleContainer);

    const rightArrow = document.createElement("img");
    rightArrow.src = "./images/icons/chevron-right.svg";
    rightArrow.classList.add("arrow");
    rightArrow.classList.add(
      window.innerWidth > 420 ? "small-icon" : "smaller-icon",
    );
    rightArrow.addEventListener("click", () =>
      arrowOnClick(
        hourlyWeatherContainer.currentHighlightedNavigationCircle + 1 ===
          hourlyWeatherContainer.numberOfNavigationCircles
          ? 0
          : hourlyWeatherContainer.currentHighlightedNavigationCircle + 1,
      ),
    );

    initialContainer.replaceChildren(
      leftArrow,
      this.#mainContainer,
      rightArrow,
    );

    return initialContainer;
  }
}

let forecast;
let hourlyWeatherContainer;
let isOpen = false;

export function closeHourlyForecast() {
  isOpen = false;
}

export function createHourlyForecast(currentForecast) {
  try {
    forecast = currentForecast;
    isOpen = true;
    hourlyWeatherContainer = setInitalHourlyWeatherContainer();

    setWeatherHours(0);
    setNavigationCircles();

    return hourlyWeatherContainer.element;
  } catch (err) {
    console.error(err);
    const errorText = document.createElement("p");
    errorText.textContent = "Failed to get hourly forecast";
    return errorText;
  }
}

function setInitalHourlyWeatherContainer() {
  let numberOfHours = 0;
  let numberOfNavigationCircles = 0;

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

  return new HourlyWeatherContainer(numberOfHours, numberOfNavigationCircles);
}

function setWeatherHours(startingHour) {
  const hourlyForecast = setHourlyForecast(forecast);
  const hours = document.createElement("div");
  hours.classList.add("forecast-container");

  // THis is a failsafe for not letting our array access go out of bounds which is possible on resize
  if (hourlyWeatherContainer.numberOfHours + startingHour > 24) {
    hourlyWeatherContainer.currentHighlightedNavigationCircle--;
    startingHour -= hourlyWeatherContainer.numberOfHours;
  }

  for (let i = 0; i < hourlyWeatherContainer.numberOfHours; i++) {
    const hourElement = setHourElement(
      hourlyForecast[i + startingHour].hour,
      hourlyForecast[i + startingHour].conditionCode,
      hourlyForecast[i + startingHour].temperature,
    );

    hours.appendChild(hourElement);
  }

  hourlyWeatherContainer.setHoursContainer(hours);
}

function setNavigationCircles() {
  const navigationCircles = document.createElement("div");
  navigationCircles.classList.add("navigation-circles");

  for (let i = 0; i < hourlyWeatherContainer.numberOfNavigationCircles; i++) {
    const navigationCircle = document.createElement("div");
    navigationCircle.classList.add("navigation-circle");
    navigationCircles.appendChild(navigationCircle);

    navigationCircle.addEventListener("click", () => {
      const circles = hourlyWeatherContainer.navigationCircleContainer.children;
      circles[
        hourlyWeatherContainer.currentHighlightedNavigationCircle
      ].style.backgroundColor = "#F5F7F8"; // Previously highlight circle will turn white
      circles[i].style.backgroundColor = "#F5E8C7"; // Clicked circle will turn yellow
      hourlyWeatherContainer.currentHighlightedNavigationCircle = i;
      setWeatherHours(i * hourlyWeatherContainer.numberOfHours);
    });

    if (i === hourlyWeatherContainer.currentHighlightedNavigationCircle) {
      navigationCircle.style.backgroundColor = "#F5E8C7";
    }
  }

  hourlyWeatherContainer.setNavigationCircleContainer(navigationCircles);
}

function arrowOnClick(newCurrentHighlightedNavigationCircle) {
  // Set the previously highlighted circle back to white
  const navigationCircles =
    hourlyWeatherContainer.navigationCircleContainer.children;
  navigationCircles[
    hourlyWeatherContainer.currentHighlightedNavigationCircle
  ].style.backgroundColor = "#F5F7F8";
  hourlyWeatherContainer.currentHighlightedNavigationCircle =
    newCurrentHighlightedNavigationCircle;

  setWeatherHours(
    hourlyWeatherContainer.currentHighlightedNavigationCircle *
      hourlyWeatherContainer.numberOfHours,
  );

  // The currently highlighted circle to yellowish
  navigationCircles[
    hourlyWeatherContainer.currentHighlightedNavigationCircle
  ].style.backgroundColor = "#F5E8C7";
}

// sets the individual weather element. This consists of an hour, condition icon and temperature elements
function setHourElement(hour, conditionCode, temperature) {
  const hourElement = document.createElement("div");

  const hourText = document.createElement(
    window.innerWidth > 420 ? "h2" : "h3",
  );
  hourText.textContent = hour;

  const conditionContainer = document.createElement("div");
  conditionContainer.classList.add("daily-weather-condition-container");
  const icon = document.createElement("img");

  icon.classList.add(window.innerWidth > 420 ? "small-icon" : "smaller-icon");

  fetch("src/conditions.json")
    .then((r) => r.json())
    .then(
      (conditions) =>
        (icon.src = `./images/icons/${conditions[conditionCode].icon}.svg`),
    );
  const temperatureText = document.createElement(
    window.innerWidth > 420 ? "h2" : "h3",
  );
  temperatureText.textContent = `${temperature}°`;
  conditionContainer.replaceChildren(icon, temperatureText);

  hourElement.replaceChildren(hourText, conditionContainer);

  return hourElement;
}

// Since arrows aren't rebuild on resize, this hack changes the class list if it needs to resize
function changeArrowClassOnResize() {
  if (window.innerWidth > 420) {
    const arrows = document.getElementsByClassName("arrow");
    arrows.forEach((arrow) => {
      if (arrow.classList.contains("smaller-icon"))
        arrow.classList.remove("smaller-icon");

      if (!arrow.classList.contains("small-icon")) {
        arrow.classList.add("small-icon");
      }
    });
  } else {
    if (arrow.classList.contains("small-icon"))
      arrow.classList.remove("small-icon");

    if (!arrow.classList.contains("smaller-icon"))
      arrow.classList.add("smaller-icon");
  }
}

// sets the data for the hourly weather elements grabbed from the weather api for given location
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
  if (!isOpen) return;

  if (window.innerWidth >= 1000 && hourlyWeatherContainer.numberOfHours !== 8) {
    setForRebuildOnResize(8, 3);
  } else if (
    window.innerWidth < 1000 &&
    window.innerWidth >= 700 &&
    hourlyWeatherContainer.numberOfHours !== 6
  ) {
    setForRebuildOnResize(6, 4);
  } else if (
    window.innerWidth < 700 &&
    window.innerWidth >= 500 &&
    hourlyWeatherContainer.numberOfHours !== 4
  ) {
    setForRebuildOnResize(4, 6);
  } else if (
    window.innerWidth < 500 &&
    hourlyWeatherContainer.numberOfHours !== 3
  ) {
    setForRebuildOnResize(3, 8);
  }
});

function setForRebuildOnResize(hours, circles) {
  changeArrowClassOnResize();

  hourlyWeatherContainer.currentHighlightedNavigationCircle = Math.round(
    (hourlyWeatherContainer.numberOfHours *
      hourlyWeatherContainer.currentHighlightedNavigationCircle) /
      hours,
  );
  hourlyWeatherContainer.numberOfHours = hours;
  hourlyWeatherContainer.numberOfNavigationCircles = circles;

  setWeatherHours(
    hourlyWeatherContainer.currentHighlightedNavigationCircle *
      hourlyWeatherContainer.numberOfHours,
  );
  setNavigationCircles();
}
