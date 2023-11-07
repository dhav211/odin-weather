/*
This is similar to the daily weather but here we are doing a 24 hour span instead of 3 days.
Here we will get the utc hour of todays date, save this as variable as currentHour
get remainingHours by 24 - current hour.
now we get into todays forcast, we will slice the starting from currenthour to the end of array.
if remainingHours is greater than 0 then we will have to slice tomorrows hours from start to remainingHours.
now create a new array called hourly, use the concat method to concatinate both of the arrays we created.
lets go thru each entry in that array and create an hourly weather object which consists of the condition and the temp

at this point we can create the div which has a class of inline-spaced, then apend all 24 hourly weather elements
which are two stacked p, one with coniditon and the other with temp
*/

class HourlyWeather {
  constructor(hour, condition, conditionCode, temperature) {
    this.hour = hour;
    this.condition = condition;
    this.conditionCode = conditionCode;
    this.temperature = temperature;
  }
}

export function getHourlyForecast(forecast) {
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
