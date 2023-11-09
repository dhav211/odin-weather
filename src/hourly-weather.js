class HourlyWeather {
  constructor(hour, condition, conditionCode, temperature) {
    this.hour = hour;
    this.condition = condition;
    this.conditionCode = conditionCode;
    this.temperature = temperature;
  }
}

export function createHourlyForecast(forecast) {
  try {
    const hourlyForecast = setHourlyForecast(forecast);
    const hourlyWeatherElement = document.createElement("div");
    hourlyWeatherElement.classList.add("inline-spaced");

    hourlyForecast.forEach((hourly) => {
      const hourElement = document.createElement("div");

      const time = document.createElement("p");
      time.textContent = hourly.hour;

      const condition = document.createElement("p");
      condition.textContent = hourly.condition;

      const temp = document.createElement("p");
      temp.textContent = hourly.temperature;

      hourElement.replaceChildren(time, condition, temp);
      hourlyWeatherElement.appendChild(hourElement);
    });

    return hourlyWeatherElement;
  } catch (err) {
    console.error(err);
    const errorText = document.createElement("p");
    errorText.textContent = "Failed to get hourly forecast";
    return errorText;
  }
}

function setHourlyForecast(forecast) {
  const hourly = [];

  const todaysDate = new Date();
  const currentHour = todaysDate.getHours();

  const todaysHours = forecast.forecastday[0].hour.slice(currentHour);
  const tomorrowsHours = forecast.forecastday[1].hour.slice(0, currentHour);
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
