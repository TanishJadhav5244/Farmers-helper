const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const savePdfButton = document.querySelector(".save-pdf-btn");

const API_KEY = "4067ebad8ace4cacac9134438242510";

const createWeatherCard = (cityName, weatherItem, index) => {
    const isCurrentWeather = index === 0;
    const weatherDetails = `
        <div class="${isCurrentWeather ? 'details' : 'card'}">
            ${isCurrentWeather ? `<h2>${cityName} (${weatherItem.date})</h2>` : `<h3>${weatherItem.date}</h3>`}
            <img src="${weatherItem.day.condition.icon}" alt="weather-icon">
            <h6>Temp: ${weatherItem.day.avgtemp_c}°C</h6>
            <h6>Wind: ${weatherItem.day.maxwind_kph} kph</h6>
            <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
            ${isCurrentWeather ? `<h6>${weatherItem.day.condition.text}</h6>` : ''}
        </div>
    `;
    return weatherDetails;
};

const getWeatherDetails = async (cityName) => {
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=3`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const weatherData = data.forecast.forecastday;
        const currentWeather = weatherData[0];

        currentWeatherDiv.innerHTML = createWeatherCard(cityName, currentWeather, 0);

        weatherCardsDiv.innerHTML = weatherData.slice(1).map((weatherItem, index) =>
            createWeatherCard(cityName, weatherItem, index + 1)
        ).join('');
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Could not fetch weather data. Please try again.");
    }
};

const getWeatherByLocation = async (latitude, longitude) => {
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=3`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const cityName = data.location.name;
        getWeatherDetails(cityName);
    } catch (error) {
        console.error("Error fetching weather data by location:", error);
        alert("Could not fetch weather data based on your location. Please try again.");
    }
};

searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherDetails(cityName);
    } else {
        alert("Please enter a city name.");
    }
});

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByLocation(latitude, longitude);
            },
            error => {
                alert("Could not retrieve location. Please ensure location services are enabled.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
