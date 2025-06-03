const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const ballsCountInput = document.getElementById('balls-count');
const distanceInput = document.getElementById('distance');

let balls = [];
let animationId = null;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createBalls(count) {
    const balls = [];
    for (let i = 0; i < count; i++) {
        balls.push({
            x: random(20, canvas.width - 20),
            y: random(20, canvas.height - 20),
            vx: random(-2, 2),
            vy: random(-2, 2),
            r: 8
        });
    }
    return balls;
}

function drawBallsAndLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const Y = Number(distanceInput.value);

    // Linie
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

    // Kulki
    for (const ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#1976d2";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();
    }
}

function updateBalls() {
    for (const ball of balls) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Odbicia od ścian
        if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
        if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.vy *= -1;
        // Korekta pozycji po odbiciu
        ball.x = Math.max(ball.r, Math.min(canvas.width - ball.r, ball.x));
        ball.y = Math.max(ball.r, Math.min(canvas.height - ball.r, ball.y));
    }
}

function animate() {
    updateBalls();
    drawBallsAndLines();
    animationId = requestAnimationFrame(animate);
}

function start() {
    balls = createBalls(Number(ballsCountInput.value));
    if (animationId) cancelAnimationFrame(animationId);
    animate();
}

function reset() {
    if (animationId) cancelAnimationFrame(animationId);
    balls = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);

// Domyślny start
start();
