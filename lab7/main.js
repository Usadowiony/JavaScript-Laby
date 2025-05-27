//event.alpha – obrót wokół osi Z (0–360°)
//event.beta – obrót wokół osi X (–180° do 180°)
//event.gamma – obrót wokół osi Y (–90° do 90°)
window.addEventListener('deviceorientation', function(event) {
    // event.alpha, event.beta, event.gamma
    console.log('alpha:', event.alpha, 'beta:', event.beta, 'gamma:', event.gamma);
});

const gameArea = document.getElementById('game-area');
const hole = document.getElementById('hole');
const startBtn = document.getElementById('start-btn');
const timerDiv = document.getElementById('timer');
const scoreDiv = document.getElementById('score');
const hitsSpan = document.getElementById('hits');
const timeSpan = document.getElementById('time');

let ball = null;
let ballInterval = null;
let score = 0;
let gameActive = false;
let timer = 60;
let timerInterval = null;

function startGame() {
    score = 0;
    timer = 60;
    hitsSpan.textContent = score;
    timeSpan.textContent = timer;
    startBtn.style.display = 'none';
    timerDiv.style.display = 'block';
    scoreDiv.style.display = 'block';
    gameActive = true;
    spawnBall();
    timerInterval = setInterval(() => {
        timer--;
        timeSpan.textContent = timer;
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    clearInterval(ballInterval);
    if (ball) ball.remove();
    startBtn.style.display = 'block';
    timerDiv.style.display = 'none';
    scoreDiv.style.display = 'none';
    alert('Koniec gry! Wynik: ' + score);
}

function spawnBall() {
    if (ball) ball.remove();
    ball = document.createElement('div');
    ball.className = 'ball';
    // Losowa pozycja X w granicach gameArea
    const areaRect = gameArea.getBoundingClientRect();
    const ballSize = 30;
    const minX = 0;
    const maxX = areaRect.width - ballSize;
    const x = Math.random() * maxX;
    ball.style.left = x + 'px';
    ball.style.top = '0px';
    ball.style.width = ballSize + 'px';
    ball.style.height = ballSize + 'px';
    ball.style.position = 'absolute';
    ball.style.background = '#2196f3';
    ball.style.borderRadius = '50%';
    gameArea.appendChild(ball);

    let y = 0;
    clearInterval(ballInterval);
    ballInterval = setInterval(() => {
        if (!gameActive) return;
        y += 4; // prędkość spadania
        ball.style.top = y + 'px';

        // Sprawdź kolizję z dziurą
        const ballRect = ball.getBoundingClientRect();
        const holeRect = hole.getBoundingClientRect();

        // Proste sprawdzenie kolizji (środek kulki w dziurze)
        const ballCenterX = ballRect.left + ballRect.width / 2;
        const ballCenterY = ballRect.top + ballRect.height / 2;
        if (
            ballCenterX > holeRect.left &&
            ballCenterX < holeRect.right &&
            ballCenterY > holeRect.top &&
            ballCenterY < holeRect.bottom
        ) {
            score++;
            hitsSpan.textContent = score;
            spawnBall();
        }

        // Jeśli kulka spadnie poza pole gry
        if (y > areaRect.height) {
            spawnBall();
        }
    }, 16);
}

startBtn.addEventListener('click', startGame);