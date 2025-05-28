const searchBtn = document.querySelector('#search-btn');
const weatherIcon = document.querySelector('#weather-icon');
const errorMessage = document.getElementById('error-message');

function getWeather(city) {
    const apiKey = '5a5f4b7ff8003dfe76f9c9448a301526';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nie znaleziono miasta lub błąd sieci!');
            }
            return response.json();
        })
}

searchBtn.addEventListener('click', () => {
    errorMessage.textContent = ""; // czyść poprzedni błąd
    const cityInput = document.querySelector('#city-input');
    //tu bedzie zapisana lokazlicaja jako wartosc do wyszukania api (zastapimy cityInput.value)
    getWeather(cityInput.value)
    .then(data => {
        if(data && data.weather && data.weather[0]){
            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = data.weather[0].description;
        }
    })
    .catch(error => {
            errorMessage.textContent = error.message;
        });
})