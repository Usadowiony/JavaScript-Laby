const gameArea = document.getElementById('game-area');

const canvasArea = document.createElement('canvas');
canvasArea.width = 500;
canvasArea.height = 800;
gameArea.appendChild(canvasArea); // dodaj canvas do DOM

// Pobierz kontekst rysowania 2D
const ctx = canvasArea.getContext('2d');

let ballX = 470;
let ballY = 770;
let tilt = 90; // Pochylenie urządzenia w stopniach, gdzie 90 to środek
let ballSpeedY = 2; // prędkość spadania kulki

// Funkcja rysująca kulkę na canvasie
function drawBall(){
    ctx.clearRect(0, 0, canvasArea.width, canvasArea.height); // czyść cały canvas
    ctx.beginPath();
    ctx.arc(ballX, ballY, 30, 0, Math.PI * 2); // rysuj okrąg o promieniu 30 w pozycji (ballX, ballY)
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

// Funkcja animująca ruch kulki
function animate() {
    // Przeskaluj tilt (60-120) na ballX (30-470)
    let normalized = (tilt - 60) / (120 - 60);
    ballX = 30 + normalized * (470 - 30);

    // Spadanie kulki
    ballY += ballSpeedY;
    if (ballY > 770) {
        ballY = -30; // resetuj kulkę na górę
        // (opcjonalnie) ballX = ...; // tu możesz losować nową pozycję X
    }

    drawBall();
    requestAnimationFrame(animate); // poproś o kolejną klatkę animacji
}

// Nasłuchuj zmian orientacji urządzenia
window.addEventListener('deviceorientation', (event) => {
    tilt = event.beta; // pobierz wartość beta
    // Ogranicz tilt do zakresu 60-120 stopni
    if (tilt < 60) tilt = 60;
    if (tilt > 120) tilt = 120;
    // Wyświetl wartości w konsoli (do debugowania)
    console.log('tilt:', tilt.toFixed(0), 'ballX:', ballX.toFixed(0));
});

animate(); // Rozpocznij animację