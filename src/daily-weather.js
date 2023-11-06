/*
This will display 3 days of weather. each day consists of the title of the day, the condition, the high, and the low.
The first title will be Today, then Tomorrow, and finally the third will be the actual day of the week
right now the elements will be a h3 for the day of the week then p for the conditions
each day will be wrapped in a div, which all three will be displayed inline

Today    Tommorrow    Tuesday
Sunny    Sunny        Rainy
54       58           48
44       43           40

The day of week name will be established by creating a javascript date object then getting the day, which returns a number 0-6, then we can 
get the name of the week by array dayNames = ["sunday", "monday".....]
*/

class DailyWeather {
  constructor(title, condition, high, low) {
    this.title = title;
    this.condition = condition;
    this.high = high;
    this.low = low;
  }
}

export function getDailyWeather(forecast) {
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
}

function setThreeDayDaily(forecast) {
  const daily = [];

  let title = "";
  for (let i = 0; i < forecast["forecast"].forecastday.length; i++) {
    try {
      title = setTitle(i, new Date(forecast["forecast"].forecastday[i].date));
    } catch (err) {
      title = err;
    }

    const condition = forecast["forecast"].forecastday[i].day.condition.text;
    const highTemp = forecast["forecast"].forecastday[i].day.maxtemp_f;
    const lowTemp = forecast["forecast"].forecastday[i].day.mintemp_f;

    const dailyWeather = new DailyWeather(
      title,
      condition,
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
