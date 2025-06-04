const gameArea = document.getElementById('game-area');


const scoreBar = document.getElementById('score');
const hitsSpan = document.getElementById('hits');
const timerBar = document.getElementById('timer');
const timeSpan = document.getElementById('time');

const canvasArea = document.createElement('canvas');
canvasArea.width = 500;
canvasArea.height = 800;
gameArea.appendChild(canvasArea); // dodaj canvas do DOM

// Pobierz kontekst rysowania 2D
const ctx = canvasArea.getContext('2d');

let holeX = (canvasArea.width - 100) / 2; // domyślnie wyśrodkowana dziura
let ballX = 470;
let ballY = 770;
let tilt = 90; // Pochylenie urządzenia w stopniach, gdzie 90 to środek
let ballSpeedY = 2; // prędkość spadania kulki

let score = 0;
let timeLeft = 60;
let gameActive = false;
let timerInterval;

function startGame() {
    score = 0;
    timeLeft = 60;
    ballY = -30;
    scoreBar.style.display = 'block';
    timerBar.style.display = 'block';
    hitsSpan.textContent = score;
    timeSpan.textContent = timeLeft;
    gameActive = true;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameActive = false;
        }
    }, 1000);
}

// Funkcja rysująca kulkę na canvasie
function drawBall(){
    ctx.beginPath();
    ctx.arc(ballX, ballY, 30, 0, Math.PI * 2); // rysuj okrąg o promieniu 30 w pozycji (ballX, ballY)
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

// Funkcja rysująca dziure na canvasie
function drawHole(){
    ctx.fillStyle = '#111'; // najpierw ustaw kolor
    ctx.fillRect(holeX, 740, 100, 20); // potem rysuj prostokąt
}

// Funkcja animująca ruch kulki
function animate() {
    ctx.clearRect(0, 0, canvasArea.width, canvasArea.height); // czyść cały canvas na początku
    // Przeskaluj tilt (60-120) na ballX (30-470)
    let normalized = (tilt - 60) / (120 - 60);
    ballX = 30 + normalized * (470 - 30);

    if (gameActive) {
        // Spadanie kulki
        ballY += ballSpeedY;
        if (isBallInHole()) {
            score++;
            hitsSpan.textContent = score; // aktualizuj wynik
            // Resetuj kulkę i dziurę
            ballY = -30;
            holeX = Math.random() * (canvasArea.width - 100);
        } else if (ballY > 770) { // jeśli kulka nie trafiła do dziury resetuj pozycje
            ballY = -30;
            holeX = Math.random() * (canvasArea.width - 100);
        }
    }

    drawHole();
    drawBall();
    requestAnimationFrame(animate); // poproś o kolejną klatkę animacji
}

// Funkcja sprawdzająca kolizję kulki z dziurą
function isBallInHole() {
    // Sprawdzamy, czy środek kulki znajduje się w obrębie prostokąta dziury
    return (
        ballY + 30 >= 740 && // dolna krawędź dziury
        ballY - 30 <= 760 && // górna krawędź dziury (740+20)
        ballX + 30 >= holeX && // prawa krawędź dziury
        ballX - 30 <= holeX + 100 // lewa krawędź dziury
    );
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
// Na start ukryj score i timer
scoreBar.style.display = 'none';
timerBar.style.display = 'none';

// Obsługa przycisku start
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', startGame);