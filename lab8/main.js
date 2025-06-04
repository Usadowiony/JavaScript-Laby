import { getWeather } from './weatherApi.js'; // pobieranie danych pogodowych z API
import { renderCities } from './renderCities.js'; // renderowanie listy zapisanych miast
import { loadCities, saveCities } from './storage.js'; // obsługa localStorage dla miast

const searchBtn = document.querySelector('#search-btn');
const weatherIcon = document.querySelector('#weather-icon');
const cityName = document.querySelector('#city-name');
const temperature = document.querySelector('#temperature');
const humidity = document.querySelector('#humidity');
const errorMessage = document.getElementById('error-message');
const saveBtn = document.getElementById('save-btn');
const cityInput = document.querySelector('#city-input');

let savedCities = loadCities(); // lista zapisanych miast w localStorage

// Wyświetla dane pogodowe w UI na podstawie odpowiedzi z API
function showWeather(data) {
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    cityName.textContent = data.name;
    temperature.textContent = `Temperatura: ${data.main.temp}°C`;
    humidity.textContent = `Wilgotność: ${data.main.humidity}%`;
}

// Obsługuje wyszukiwanie pogody dla podanego miasta
function handleSearch(city) {
    errorMessage.textContent = "";
    getWeather(city)
        .then(data => {
            if (data && data.weather && data.weather[0]) {
                showWeather(data); // wyświetl dane pogodowe
            } else {
                errorMessage.textContent = "Nie znaleziono takiego miasta!";
            }
        })
        .catch(error => {
            errorMessage.textContent = error.message;
        });
}

// Obsługuje dodawanie miasta do listy zapisanych miast
function handleSave(city) {
    errorMessage.textContent = "";
    getWeather(city)
        .then(data => {
            if (data && data.weather && data.weather[0]) {
                const cityNameFromApi = data.name;
                // Dodaj miasto jeśli nie ma go na liście i nie przekroczono limitu
                if (!savedCities.includes(cityNameFromApi) && savedCities.length < 10) {
                    savedCities.push(cityNameFromApi);
                    saveCities(savedCities); // zapisz do localStorage
                    errorMessage.textContent = "Dodano: " + cityNameFromApi;
                    updateCitiesList(); // odśwież listę
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

// Renderuje listę zapisanych miast i podłącza obsługę przycisków (usuń, wybierz)
function updateCitiesList() {
    renderCities(
        savedCities,
        (idx) => {
            // Usuwanie miasta z listy
            savedCities.splice(idx, 1);
            saveCities(savedCities);
            updateCitiesList();
        },
        (city) => {
            // Wybór miasta z listy (wstaw do inputa i pobierz pogodę)
            cityInput.value = city;
            handleSearch(city);
        }
    );
}

searchBtn.addEventListener('click', () => {
    handleSearch(cityInput.value); // szukaj po kliknięciu
});

saveBtn.addEventListener('click', () => {
    handleSave(cityInput.value); // zapisz po kliknięciu
});

// Inicjalizacja listy miast przy starcie aplikacji
updateCitiesList();