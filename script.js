document.addEventListener('DOMContentLoaded', function () {
    const cityForm = document.getElementById('cityForm');
    const fetchButton = document.getElementById('fetchWeatherButton');
    const toggleButton = document.getElementById('toggleTemperature');

    // Event listener for fetching weather data
    if (fetchButton) {
        fetchButton.addEventListener('click', fetchWeatherData);
    }

    // Event listener for temperature toggle
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTemperature);
    }

    // Load data when navigating to different pages
    const page = document.body.className;
    if (page.includes('temperature-page')) {
        displayTemperature();
    } else if (page.includes('humidity-page')) {
        displayHumidity();
    } else if (page.includes('uvindex-page')) {
        displayUVIndex();
    } else if (page.includes('windspeed-page')) {
        displayWindSpeed();
    }
});

// **Fetch weather data and store in localStorage**
function fetchWeatherData() {
    const cityName = document.getElementById('city').value.trim();
    if (!cityName) {
        alert("Please enter a city name.");
        return;
    }

    fetch('weather.json')
        .then(response => response.json())
        .then(data => {
            const cityData = data.find(city => city.cityName.toLowerCase() === cityName.toLowerCase());
            if (cityData) {
                localStorage.setItem('weatherData', JSON.stringify(cityData));
                alert(`Weather data fetched successfully for ${cityName}.`);
            } else {
                alert('City not found.');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// **Retrieve stored weather data**
function getStoredWeatherData() {
    return JSON.parse(localStorage.getItem('weatherData')) || null;
}

// Function to update the fill color of an SVG element
function updateSVGFill(elementId, color) {
    const svgElement = document.getElementById(elementId);
    if (!svgElement) {
        console.warn(`Element with ID ${elementId} not found.`);
        return; // Stop execution if element is missing
    }

    const shape = svgElement.querySelector('path, circle, rect');
    if (!shape) {
        console.warn(`No shape found inside ${elementId} SVG.`);
        return;
    }

    shape.setAttribute('fill', color);
}



// **Update all icons dynamically based on weather conditions**
// **Update Weather Icons Only if Elements Exist**
function updateWeatherIcons(cityData) {
    if (!cityData) return;

    if (document.getElementById('mercury')) {
        updateSVGFill('mercury', cityData.temperatureCelsius > 20 ? 'yellow' : 'blue');
    }
    if (document.getElementById('drop')) {
        updateSVGFill('drop', cityData.humidity > 0.5 ? 'blue' : 'lightblue');
    }
    if (document.getElementById('sun')) {
        updateSVGFill('sun', cityData.uvIndex > 5 ? 'red' : 'yellow');
    }
    if (document.getElementById('gust')) {
        updateSVGFill('gust', parseInt(cityData.windSpeed) > 20 ? 'black' : 'lightgray');
    }
}


// **Display Temperature & Scale Thermometer**
function displayTemperature() {
    const cityData = getStoredWeatherData();
    if (!cityData) return;

    document.getElementById('temperature').textContent = `${cityData.temperatureCelsius}°C`;

    const mercury = document.getElementById('mercury');
    if (mercury) {
        const temp = cityData.temperatureCelsius;
        let height = Math.max(10, Math.min(100, (temp / 40) * 100)); // Scale height
        mercury.setAttribute('height', `${height}%`);
        mercury.setAttribute('y', `${100 - height}%`); // Move mercury up
        mercury.setAttribute('fill', temp > 20 ? 'yellow' : 'blue'); // Change color
    }
}


// **Display Humidity**
function displayHumidity() {
    const cityData = getStoredWeatherData();
    if (!cityData) return;

    document.getElementById('humidity').textContent = `${Math.round(cityData.humidity * 100)}%`;
    updateWeatherIcons(cityData);
}

// **Display UV Index**
function displayUVIndex() {
    const cityData = getStoredWeatherData();
    if (!cityData) return;

    document.getElementById('uvIndex').textContent = cityData.uvIndex;
    updateWeatherIcons(cityData);
}

// **Display Wind Speed**
function displayWindSpeed() {
    const cityData = getStoredWeatherData();
    if (!cityData) return;

    document.getElementById('windSpeed').textContent = cityData.windSpeed;
    updateWeatherIcons(cityData);
}

// **Toggle Temperature between Celsius and Fahrenheit**
function toggleTemperature() {
    const tempElement = document.getElementById('temperature');
    if (!tempElement) return;

    let currentTemp = parseFloat(tempElement.textContent);
    const isCelsius = tempElement.textContent.includes('°C');

    if (isCelsius) {
        currentTemp = (currentTemp * 9/5) + 32;
        tempElement.textContent = `${currentTemp.toFixed(1)}°F`;
    } else {
        currentTemp = (currentTemp - 32) * 5/9;
        tempElement.textContent = `${currentTemp.toFixed(1)}°C`;
    }
}

// **Ensure all functions are accessible globally**
window.fetchWeatherData = fetchWeatherData;
window.displayTemperature = displayTemperature;
window.displayHumidity = displayHumidity;
window.displayUVIndex = displayUVIndex;
window.displayWindSpeed = displayWindSpeed;
window.toggleTemperature = toggleTemperature;
