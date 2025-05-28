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

let savedCities = [];

function updateCitiesList() {
    renderCities(savedCities, (idx) => {
        savedCities.splice(idx, 1);
        updateCitiesList();
    });
}

// --- Eventy ---

searchBtn.addEventListener('click', () => {
    errorMessage.textContent = ""; // czyść poprzedni błąd
    //tu bedzie zapisana lokazlicaja jako wartosc do wyszukania api (zastapimy cityInput.value)
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
    errorMessage.textContent = ""; // czyść poprzedni błąd
    getWeather(cityInput.value)
        .then(data => {
            if (data && data.weather && data.weather[0]) {
                const city = data.name;
                // Sprawdź, czy już jest na liście i czy nie przekroczono limitu
                if (!savedCities.includes(city) && savedCities.length < 10) {
                    savedCities.push(city);
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