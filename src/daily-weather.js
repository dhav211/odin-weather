class DailyWeather {
  constructor(title, condition, conditionCode, high, low) {
    this.title = title;
    this.condition = condition;
    this.conditionCode = conditionCode;
    this.high = high;
    this.low = low;
  }
}

export function getDailyWeather(forecast) {
  try {
    const threeDayDaily = setThreeDayDaily(forecast);
    const dailyWeatherElement = document.createElement("div");
    dailyWeatherElement.classList.add("inline-spaced");
    threeDayDaily.forEach((day) => {
      const dayElement = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = day.title;

      const condition = document.createElement("p");
      condition.textContent = day.condition;

      const high = document.createElement("p");
      high.textContent = day.high;

      const low = document.createElement("p");
      low.textContent = day.low;

      dayElement.replaceChildren(title, condition, high, low);
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
