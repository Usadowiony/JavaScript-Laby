import { getWeather } from './weatherApi.js';
import { renderCities } from './renderCities.js';
import { loadCities, saveCities } from './storage.js';

const searchBtn = document.querySelector('#search-btn');
const weatherIcon = document.querySelector('#weather-icon');
const cityName = document.querySelector('#city-name');
const temperature = document.querySelector('#temperature');
const humidity = document.querySelector('#humidity');
const errorMessage = document.getElementById('error-message');
const saveBtn = document.getElementById('save-btn');
const cityInput = document.querySelector('#city-input');

let savedCities = loadCities();

function showWeather(data) {
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    cityName.textContent = data.name;
    temperature.textContent = `Temperatura: ${data.main.temp}°C`;
    humidity.textContent = `Wilgotność: ${data.main.humidity}%`;
}

function handleSearch(city) {
    errorMessage.textContent = "";
    getWeather(city)
        .then(data => {
            if (data && data.weather && data.weather[0]) {
                showWeather(data);
            } else {
                errorMessage.textContent = "Nie znaleziono takiego miasta!";
            }
        })
        .catch(error => {
            errorMessage.textContent = error.message;
        });
}

function handleSave(city) {
    errorMessage.textContent = "";
    getWeather(city)
        .then(data => {
            if (data && data.weather && data.weather[0]) {
                const cityNameFromApi = data.name;
                if (!savedCities.includes(cityNameFromApi) && savedCities.length < 10) {
                    savedCities.push(cityNameFromApi);
                    saveCities(savedCities);
                    errorMessage.textContent = "Dodano: " + cityNameFromApi;
                    updateCitiesList();
                } else if (savedCities.includes(cityNameFromApi)) {
                    errorMessage.textContent = "To miasto już jest na liście!";
                } else {
                    errorMessage.textContent = "Możesz zapisać maksymalnie 10 miast!";
                }
            } else {
                errorMessage.textContent = "Nie znaleziono takiego miasta!";
            }
        })
        .catch(error => {
            errorMessage.textContent = error.message;
        });
}

function updateCitiesList() {
    renderCities(
        savedCities,
        (idx) => {
            savedCities.splice(idx, 1);
            saveCities(savedCities);
            updateCitiesList();
        },
        (city) => {
            cityInput.value = city;
            handleSearch(city);
        }
    );
}

// --- Eventy ---

searchBtn.addEventListener('click', () => {
    handleSearch(cityInput.value);
});

saveBtn.addEventListener('click', () => {
    handleSave(cityInput.value);
});

// Inicjalizacja listy na starcie
updateCitiesList();