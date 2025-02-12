const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const input = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const APIKey = 'fb791c8c27eb0637cbe3f6c9ebe03198';

function fetchWeatherByCity(city) {
    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(displayWeather)
        .catch(() => {
            showError();
        });
}

function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then((json) => {
            displayWeather(json);

            input.value = json.name || 'Unknown location';
        })
        .catch(() => {
            showError();
        });
}

function displayWeather(json) {
    if (json.cod === '404') {
        showError();
        return;
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    switch (json.weather[0].main) {
        case 'Clear':
            image.src = 'image/clear.png';
            break;

        case 'Rain':
            image.src = 'image/rain.png';
            break;

        case 'Snow':
            image.src = 'image/snow.png';
            break;

        case 'Clouds':
            image.src = 'image/cloud.png';
            break;

        case 'Haze':
            image.src = 'image/mist.png';
            break;

        default:
            image.src = '';
    }

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '590px';
}

function showError() {
    container.style.height = '400px';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');
}

search.addEventListener('click', () => {
    const city = input.value;
    fetchWeatherByCity(city);
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = input.value;
        fetchWeatherByCity(city);
    }
});

const locationButton = document.createElement('button');
locationButton.textContent = 'GPS';
locationButton.style.marginTop = '5px';
document.querySelector('.search-box').appendChild(locationButton);

locationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});
