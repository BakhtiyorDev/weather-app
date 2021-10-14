const weather = document.getElementById("weather");
weatherTemp = document.getElementById("weather-temp");
weatherCity = document.getElementById("weather-city");
weatherTime = document.getElementById("weather-time");
weatherType = document.getElementById("weather-type");
weatherVisibility = document.getElementById("weather-visibility");
weatherWind = document.getElementById("weather-wind");
weatherIcon = document.getElementById("weather-icon");
weatherState = document.getElementById("weather-state");
weatherHumidity = document.getElementById("weather-humidity");
cities = Array.from(document.querySelectorAll(".weather__city"));
inputValue = document.getElementById("searchCity");
weatherBars = document.getElementById("weatherBars");
weatherInfo = document.getElementById("weatherInfo");

const openBars = () => {
  weatherBars.addEventListener("click", () => {
    weatherInfo.classList.toggle("open-bars");
    weatherInfo.style.transition = "0.7s";
  });
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

async function getPosition(position) {
  const { coords } = position;
  const dataWeather = await fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${coords.latitude}&lon=${coords.longitude}&key=b76af2a3bf634f20a975d49c84a3f3c6`
  );

  const { data } = await dataWeather.json();
  let { city_name } = data[0];
  fetchData(city_name);
}

const fetchData = (cityName) => {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=a2eddc246f4149b7a06182255211009&q=${cityName}&aqi=no`
  )
    .then((res) => res.json())
    .then((data) => {
      const dataCurrent = data.current;
      const dataLocation = data.location;
      const { temp_c, humidity, vis_km, wind_kph } = dataCurrent;
      const { text } = dataCurrent.condition;
      const { localtime, name } = dataLocation;

      weatherTime.innerHTML = localtime;
      weatherTemp.innerHTML = Math.round(temp_c);
      weatherCity.innerHTML = name;
      weatherVisibility.innerHTML = `${vis_km} km`;
      weatherWind.innerHTML = `${wind_kph} km/h`;
      weatherState.innerHTML = text;
      weatherHumidity.innerHTML = `${humidity} %`;
      getNightTime(localtime, text);
      updateWeatherState(text);
    });
};

const searchCity = () => {
  document
    .getElementById("weather__search--form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      fetchData(inputValue.value);
      inputValue.value = "";
    });
};

const getNightTime = (time) => {
  const timeSlice = time.slice(10, 13);
  if (timeSlice < 05) {
    weatherIcon.src = "img/night.svg";
    weather.style.backgroundImage = `url('img/night.jpg')`;
  }
};

const showCloudyState = () => {
  weatherIcon.src = "img/cloudy.svg";
  weather.style.backgroundImage = "url('img/cloudy.jpg')";
};

const updateWeatherState = (state) => {
  if (state === "Sunny" || state === "Clear") {
    weatherIcon.src = "img/sunny.svg";
    weather.style.backgroundImage = `url('img/sunny.jpg')`;
  } else if (state === "Partly cloudy") {
    weatherIcon.src = "img/partly-cloudy.svg";
    weather.style.backgroundImage = `url('img/partly-cloudy.jpg')`;
  } else if (state.toUpperCase().includes("CLOUD") || state === "Overcast") {
    showCloudyState();
  } else if (state === "Smoke" || state === "Mist") {
    showCloudyState();
  } else if (state.toUpperCase().includes("FOG")) {
    weatherIcon.style.width = "44px";
    weatherIcon.src = "img/foggyIcon.png";
    weather.style.backgroundImage = "url('img/foggy.jpg')";
  } else if (state.toUpperCase().includes("RAIN")) {
    weatherState.innerHTML = "Rainy";
    weatherIcon.src = "img/rainy.svg";
    weather.style.backgroundImage = "url('img/rainy.jpg')";
  } else if (state === "Windy") {
    weatherIcon.style.width = "40px";
    weatherIcon.src = "img/windy.png";
    weather.style.backgroundImage = "url('img/windy.jpg')";
  } else if (state.toUpperCase().includes("SNOW")) {
    weatherIcon.style.width = "44px";
    weatherIcon.src = "img/snowy.png";
    weather.style.backgroundImage = "url('img/windy.jpg')";
  }
};

const attachListeners = (city) => {
  city.forEach((el) =>
    el.addEventListener("click", () => fetchData(el.dataset.value))
  );
};

const getRoundNumber = () => {};

const init = () => (
  attachListeners(cities), getLocation(), searchCity(), openBars()
);

init();
