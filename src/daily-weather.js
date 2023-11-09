class DailyWeather {
  constructor(title, condition, conditionCode, high, low) {
    this.title = title;
    this.condition = condition;
    this.conditionCode = conditionCode;
    this.high = high;
    this.low = low;
  }
}

export function createDailyWeather(forecast) {
  try {
    const threeDayDaily = setThreeDayDaily(forecast);
    const dailyWeatherElement = document.createElement("div");
    dailyWeatherElement.classList.add("space-around");
    threeDayDaily.forEach((day) => {
      const dayElement = setDayElement(
        day.title,
        day.conditionCode,
        day.high,
        day.low,
      );
      dailyWeatherElement.appendChild(dayElement);
    });

    return dailyWeatherElement;
  } catch (err) {
    console.error(err);
    const errorText = document.createElement("p");
    errorText.textContent = "Failed to load daily forecast";
    return errorText;
  }
}

function setDayElement(title, conditionCode, high, low) {
  const dayElement = document.createElement("div");

  const titleText = document.createElement("h2");
  titleText.classList.add("daily-weather-title");
  titleText.textContent = title;

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
  const tempContainer = document.createElement("div");
  const highTemp = document.createElement("h2");
  highTemp.textContent = `${high}°`;
  const lowTemp = document.createElement("h2");
  lowTemp.textContent = `${low}°`;
  tempContainer.replaceChildren(highTemp, lowTemp);

  conditionContainer.replaceChildren(icon, tempContainer);

  dayElement.replaceChildren(titleText, conditionContainer);

  return dayElement;
}

function setThreeDayDaily(forecast) {
  const daily = [];

  let title = "";
  for (let i = 0; i < forecast.forecastday.length; i++) {
    try {
      title = setTitle(i, new Date(forecast.forecastday[i].date));
    } catch (err) {
      title = err;
    }

    const condition = forecast.forecastday[i].day.condition.text;
    const conditionCode = forecast.forecastday[i].day.condition.code;
    const highTemp = forecast.forecastday[i].day.maxtemp_f;
    const lowTemp = forecast.forecastday[i].day.mintemp_f;

    const dailyWeather = new DailyWeather(
      title,
      condition,
      conditionCode,
      Math.floor(highTemp),
      Math.floor(lowTemp),
    );

    daily.push(dailyWeather);
  }

  return daily;
}

function setTitle(index, date) {
  let title = "";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  switch (index) {
    case 0:
      title = "Today";
      break;

    case 1:
      title = "Tomorrow";
      break;

    case 2:
      title = days[date.getUTCDay()];
      break;

    default:
      throw "Incorrect Index";
  }

  return title;
}
