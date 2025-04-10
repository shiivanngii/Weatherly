const apiKey = "c29f3fb2fc5e7892a1c59858a268fd2f";
const searchInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const hourlyContainer = document.getElementById("hourlyForecast");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feels = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) getWeatherData(city);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== "200") throw new Error("City not found");

    const current = data.list[0];
    cityName.textContent = data.city.name;
    temperature.textContent = `${Math.round(current.main.temp)}°C`;
    description.textContent = current.weather[0].description;

    humidity.textContent = `${current.main.humidity}%`;
    wind.textContent = `${current.wind.speed} kmph`;
    feels.textContent = `${current.main.feels_like}°C`;
    pressure.textContent = `${current.main.pressure} hPa`;
    visibility.textContent = `${current.visibility || 10000} m`;

    updateHourlyForecast(data.list);
    updateBackground(current.weather[0].main.toLowerCase());
  } catch (err) {
    alert("City not found. Please try again.");
    console.error("Weather fetch error:", err);
  }
}

function updateHourlyForecast(hourlyData) {
  hourlyContainer.innerHTML = "";

  hourlyData.slice(0, 8).forEach((hour) => {
    const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const icon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
    const temp = `${Math.round(hour.main.temp)}°C`;

    const card = document.createElement("div");
    card.className = "hourly-card";
    card.innerHTML = `
      <p>${time}</p>
      <img src="${icon}" alt="icon" />
      <p>${temp}</p>
    `;

    hourlyContainer.appendChild(card);
  });
}

function getIcon(condition, isDay) {
  if (condition.includes("cloud")) return "clouds.png";
  if (condition.includes("rain")) return "heavy-rain.png";
  if (condition.includes("clear")) return isDay ? "partly-cloudy.png" : "night.png";
  if (condition.includes("snow")) return "snow.png";
  if (condition.includes("mist") || condition.includes("fog")) return "mist.png";
  return "default.png";
}



function updateBackground(condition) {
  const body = document.body;
  body.className = ""; // Reset all
  if (condition.includes("clear")) body.classList.add("clear");
  else if (condition.includes("rain") || condition.includes("drizzle")) body.classList.add("rainy");
  else if (condition.includes("thunder")) body.classList.add("thunder");
  else if (condition.includes("snow")) body.classList.add("snow");
  else if (condition.includes("cloud")) body.classList.add("clouds");
  else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) body.classList.add("mist");
  else body.classList.add("default-bg");
}
