const apiKey = 'a11c28eb6e2942e4b17145844241710';
const weatherForm = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const weatherIcon = document.getElementById('weather-icon');
const tempElement = document.querySelector('.temp-value');
const timeLocationElement = document.querySelector('.time-location-value');
const conditionElement = document.querySelector('.condition-value');
const searchButton = document.querySelector('button');
const suggestionsList = document.getElementById('suggestions');

function loadDefaultWeather() {
    const defaultLocation = 'Mumbai';
    locationInput.value = defaultLocation;
    fetchWeather(defaultLocation);
}

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const location = locationInput.value.trim();
    if (location) {
        searchButton.disabled = true;
        resetWeatherUI();
        fetchWeather(location).finally(() => {
            searchButton.disabled = false;
        });
    }
});

locationInput.addEventListener('input', async () => {
    const query = locationInput.value.trim();
    if (query) {
        const suggestions = await fetchSuggestions(query);
        displaySuggestions(suggestions);
    } else {
        clearSuggestions();
    }
});

async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

function displaySuggestions(suggestions) {
    clearSuggestions();
    suggestionsList.classList.add('show');
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion.name;
        li.addEventListener('click', () => {
            locationInput.value = suggestion.name;
            clearSuggestions();
            fetchWeather(suggestion.name);
        });
        suggestionsList.appendChild(li);
    });
}

function clearSuggestions() {
    suggestionsList.innerHTML = '';
    suggestionsList.classList.remove('show');
}

async function fetchWeather(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
        const data = await response.json();
        if (data.error) {
            alert(data.error.message);
            resetWeatherUI();
        } else {
            updateWeatherUI(data);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
        resetWeatherUI();
    }
}

async function fetchForecast(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`);
        const data = await response.json();
        if (data.error) {
            alert(data.error.message);
        } else {
            displayForecast(data);
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
        alert('Failed to fetch forecast data. Please try again later.');
    }
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecasts
    data.forecast.forecastday.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <h3>${new Date(day.date).toLocaleDateString()}</h3>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</p>
            <p>${day.day.condition.text}</p>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

function updateWeatherUI(data) {
    updateWeatherIcon(data.current.condition.icon);
    updateTemperature(data.current.temp_c);
    updateLocation(data.location.name);
    updateCondition(data.current.condition.text);
    updateDateTime();
    updateDayTime(); // Call to update daytime
}

function updateWeatherIcon(iconUrl) {
    weatherIcon.src = `https:${iconUrl}`;
}

function updateTemperature(temp) {
    tempElement.textContent = `${temp}°C`;
}

function updateLocation(locationName) {
    timeLocationElement.textContent = locationName;
}

function updateCondition(conditionText) {
    conditionElement.textContent = conditionText;
}

function updateDateTime() {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    const formattedDateTime = now.toLocaleString('en-US', options);
    timeLocationElement.textContent += ` - ${formattedDateTime}`;
}

function updateDayTime() {
    const hour = new Date().getHours();
    let dayTime;
    if (hour >= 5 && hour < 12) {
        dayTime = 'Morning';
    } else if (hour >= 12 && hour < 17) {
        dayTime = 'Afternoon';
    } else if (hour >= 17 && hour < 21) {
        dayTime = 'Evening';
    } else {
        dayTime = 'Night';
    }
    const dayTimeElement = document.querySelector('.day-time-value');
    dayTimeElement.textContent = `It'zzzz ${dayTime}`;
}

function resetWeatherUI() {
    weatherIcon.src = '';
    tempElement.textContent = '';
    timeLocationElement.textContent = '';
    conditionElement.textContent = '';
    document.querySelector('.day-time-value').textContent = '';
    document.querySelector('.forecast-container').innerHTML = ''; // Clear forecast
}

loadDefaultWeather();
setInterval(updateDateTime, 60000);
