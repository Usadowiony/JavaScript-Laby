import { getWeather } from './weatherApi.js';
import { renderCities } from './renderCities.js';

const searchBtn = document.querySelector('#search-btn');
const weatherIcon = document.querySelector('#weather-icon');
const cityName = document.querySelector('#city-name');
const temperature = document.querySelector('#temperature');
const humidity = document.querySelector('#humidity');
const errorMessage = document.getElementById('error-message');
const saveBtn = document.getElementById('save-btn');
const cityInput = document.querySelector('#city-input');

const citiesFromStorage = localStorage.getItem('cities');
let savedCities = citiesFromStorage ? JSON.parse(citiesFromStorage) : [];

function updateCitiesList() {
    renderCities(
        savedCities,
        (idx) => { // onDelete
            savedCities.splice(idx, 1);
            localStorage.setItem('cities', JSON.stringify(savedCities));
            updateCitiesList();
        },
        (city) => { // onSelect
            cityInput.value = city;
            searchBtn.click();
        }
    );
}

// --- Eventy ---

searchBtn.addEventListener('click', () => {
    errorMessage.textContent = "";
    getWeather(cityInput.value)
    .then(data => {
        if(data && data.weather && data.weather[0]){
            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = data.weather[0].description;
            cityName.textContent = data.name;
            temperature.textContent = `Temperatura: ${data.main.temp}°C`;
            humidity.textContent = `Wilgotność: ${data.main.humidity}%`;
        }
    })
    .catch(error => {
            errorMessage.textContent = error.message;
        });
})

saveBtn.addEventListener('click', () => {
    errorMessage.textContent = "";
    getWeather(cityInput.value)
        .then(data => {
            if (data && data.weather && data.weather[0]) {
                const city = data.name;
                // Sprawdź, czy już jest na liście i czy nie przekroczono limitu
                if (!savedCities.includes(city) && savedCities.length < 10) {
                    savedCities.push(city);
                    localStorage.setItem('cities', JSON.stringify(savedCities));
                    errorMessage.textContent = "Dodano: " + city;
                    updateCitiesList();
                } else if (savedCities.includes(city)) {
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
});

updateCitiesList();