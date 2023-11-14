/*
The banner image will be selected at random from unsplash, although its random it does have some rules to it.
It takes the weather apis condition code and converts it to a more focused enum value.
This and along with if its night or night is the basis for the search result.
Also window with is a factor on search results, anything over 500 will be in landscape mode, under 500 and the picture will be portrait
*/

const banner = document.getElementById("banner");

export async function setBannerFromForecast(forecast) {
  try {
    const bannerWeatherCondition = setBannerWeatherCondition(
      forecast.condition.code,
    );

    banner.src = await fetchBannerImage(
      bannerWeatherCondition,
      forecast.is_day,
    );
  } catch (err) {
    // unsplash api ran out of it's 50 free request allownace, just set a local image
    console.error(err);
    banner.src = setSavedImage(forecast);
  }
}

async function fetchBannerImage(bannerWeatherCondition, isDay) {
  const response = await fetch(
    `https://api.unsplash.com/photos/random/?client_id=dBZHbluZG3nIMy4iaionr00RNqj5iW3khpdgbBAY-G8&query=${setQuery(
      bannerWeatherCondition,
      isDay,
    )}&orientation=${setOrientation()}`,
    { mode: "cors", headers: { "Access-Control-Allow-Origin": "*" } },
  );

  const json = await response.json();

  return json.urls.regular;
}

const BannerWeatherConditions = {
  Sunny: 0,
  Cloudy: 1,
  Fog: 2,
  Rain: 3,
  Snow: 4,
  Thunder: 5,
};

function setQuery(bannerWeatherCondition, isDay) {
  let query = "";

  switch (bannerWeatherCondition) {
    case BannerWeatherConditions.Sunny:
      if (isDay) {
        query = "sunny day";
      } else {
        query = "clear night";
      }
      break;
    case BannerWeatherConditions.Cloudy:
      if (isDay) {
        query = "cloudy day";
      } else {
        query = "cloudy night";
      }
      break;

    case BannerWeatherConditions.Fog:
      if (isDay) {
        query = "foggy day";
      } else {
        query = "foggy night";
      }
      break;
    case BannerWeatherConditions.Rain:
      if (isDay) {
        query = "rainy day";
      } else {
        query = "rainy night";
      }
      break;
    case BannerWeatherConditions.Snow:
      if (isDay) {
        query = "snowy day";
      } else {
        query = "snowy night";
      }
      break;
    case BannerWeatherConditions.Sunny:
      query = "thunder";
      break;
  }

  return query;
}

function setOrientation() {
  let orientation = "";

  if (window.innerWidth > 500) {
    orientation = "landscape";
  } else {
    orientation = "portrait";
  }

  return orientation;
}

function setSavedImage(forecast) {
  const bannerWeatherCondition = setBannerWeatherCondition(
    forecast.condition.code,
  );
  let savedImageName = setQuery(
    bannerWeatherCondition,
    forecast.is_day,
  ).replace(" ", "_");
  if (window.innerWidth > 500) {
    savedImageName += "_landscape";
  } else {
    savedImageName += "_portrait";
  }
  return `./images/photos/${savedImageName}.jpg`;
}

// Probably a better way to go about this, but this will simplify the four digition code into a simpler code to get a weather based picture
function setBannerWeatherCondition(conditionCode) {
  let bannerWeatherCondition = 0;
  switch (conditionCode) {
    case 1000:
      bannerWeatherCondition = BannerWeatherConditions.Sunny;
      break;
    case 1003:
      bannerWeatherCondition = BannerWeatherConditions.Sunny;
      break;
    case 1006:
      bannerWeatherCondition = BannerWeatherConditions.Cloudy;
      break;
    case 1009:
      bannerWeatherCondition = BannerWeatherConditions.Cloudy;
      break;
    case 1030:
      bannerWeatherCondition = BannerWeatherConditions.Fog;
      break;
    case 1063:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1066:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1069:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1072:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1087:
      bannerWeatherCondition = BannerWeatherConditions.Cloudy;
      break;
    case 1114:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1117:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1135:
      bannerWeatherCondition = BannerWeatherConditions.Fog;
      break;
    case 1147:
      bannerWeatherCondition = BannerWeatherConditions.Fog;
      break;
    case 1150:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1153:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1168:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1171:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1180:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1183:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1186:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1189:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1192:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1195:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1198:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1201:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1204:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1207:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1210:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1213:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1216:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1219:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1222:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1225:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1237:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1240:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1243:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1246:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1249:
      bannerWeatherCondition = BannerWeatherConditions.Rain;
      break;
    case 1252:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1255:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1258:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1261:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1264:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1273:
      bannerWeatherCondition = BannerWeatherConditions.Thunder;
      break;
    case 1276:
      bannerWeatherCondition = BannerWeatherConditions.Thunder;
      break;
    case 1279:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
    case 1282:
      bannerWeatherCondition = BannerWeatherConditions.Snow;
      break;
  }

  return bannerWeatherCondition;
}
