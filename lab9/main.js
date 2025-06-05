const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const ballsCountInput = document.getElementById('balls-count');
const distanceInput = document.getElementById('distance');

let balls = []; // tablica obiektów reprezentujących kulki
let animationId = null; // identyfikator animacji (requestAnimationFrame)

// Funkcja pomocnicza: losowa liczba z przedziału [min, max)
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Tworzy tablicę kulek z losowymi pozycjami i prędkościami
function createBalls(count) {
    const balls = [];
    for (let i = 0; i < count; i++) {
        balls.push({
            x: random(20, canvas.width - 20), // losowa pozycja X
            y: random(20, canvas.height - 20), // losowa pozycja Y
            vx: random(-2, 2), // losowa prędkość X
            vy: random(-2, 2), // losowa prędkość Y
            r: 8 // promień kulki
        });
    }
    return balls;
}

// Rysuje wszystkie kulki oraz linie między nimi jeśli są wystarczająco blisko
function drawBallsAndLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // czyści canvas
    const Y = Number(distanceInput.value); // maksymalna odległość do rysowania linii

    // Rysowanie linii między kulkami, jeśli są bliżej niż Y
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < Y) {
                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.strokeStyle = "#aaa";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    // Rysowanie wszystkich kulek
    for (const ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#1976d2";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();
    }
}

// Aktualizuje pozycje wszystkich kulek i odbija je od ścian
function updateBalls() {
    for (const ball of balls) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Odbicia od ścian poziomych
        if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
        // Odbicia od ścian pionowych
        if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.vy *= -1;
        // Korekta pozycji po odbiciu (żeby nie "wyszły" poza canvas)
        ball.x = Math.max(ball.r, Math.min(canvas.width - ball.r, ball.x));
        ball.y = Math.max(ball.r, Math.min(canvas.height - ball.r, ball.y));
    }
}

// Główna pętla animacji: aktualizuje i rysuje scenę, wywołuje się rekurencyjnie
function animate() {
    updateBalls();
    drawBallsAndLines();
    animationId = requestAnimationFrame(animate);
}

// Rozpoczyna animację z nową liczbą kulek
function start() {
    balls = createBalls(Number(ballsCountInput.value)); // generuje nowe kulki
    if (animationId) cancelAnimationFrame(animationId); // zatrzymuje poprzednią animację jeśli była
    animate(); // startuje animację
}

// Resetuje animację i czyści canvas
function reset() {
    if (animationId) cancelAnimationFrame(animationId); // zatrzymuje animację
    balls = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height); // czyści canvas
}

// Obsługa kliknięć przycisków
startBtn.addEventListener('click', start); // start animacji
resetBtn.addEventListener('click', reset); // reset animacji

// Automatyczny start po załadowaniu strony
start();
