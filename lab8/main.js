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

getWeather('Warszawa').then(data => {
    console.log(data);
});