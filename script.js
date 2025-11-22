const apiKey = "c8c87d16c23f99a749c8f2b8104aec32";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const unitToggle = document.getElementById("unit-toggle");

let currentTempC = null;

async function getWeather() {
  const city = cityInput.value;
  if (!city) {
    alert("Veuillez entrer une ville !");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ville non trouvée !");
    const data = await response.json();

    currentTempC = data.main.temp;

    displayWeather(data);
    changeBackground(data.weather[0].main);
  } catch (error) {
    weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    document.body.style.background = "linear-gradient(to right, #a1c4fd, #c2e9fb)";
  }
}

function displayWeather(data) {
  const temp = unitToggle.checked ? cToF(currentTempC) : currentTempC;
  const unit = unitToggle.checked ? "°F" : "°C";

  weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡️ Température : ${temp} ${unit}</p>
    <p>💨 Vent : ${data.wind.speed} m/s</p>
    <p>☁️ Météo : ${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icone météo">
  `;
}

function cToF(c) {
  return (c * 9/5 + 32).toFixed(1);
}

function changeBackground(weather) {
  switch(weather.toLowerCase()) {
    case "clear":
      document.body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
      break;
    case "clouds":
      document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
      break;
    case "rain":
    case "drizzle":
      document.body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
      break;
    case "thunderstorm":
      document.body.style.background = "linear-gradient(to right, #141E30, #243B55)";
      break;
    case "snow":
      document.body.style.background = "linear-gradient(to right, #e6dada, #274046)";
      break;
    default:
      document.body.style.background = "linear-gradient(to right, #a1c4fd, #c2e9fb)";
  }
}

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", e => { if(e.key === "Enter") getWeather(); });
unitToggle.addEventListener("change", () => {
  if(currentTempC !== null) displayWeather({weather: [{main: "clear"}], name: cityInput.value, sys: {country: ""}, wind: {speed: 0}});
});
