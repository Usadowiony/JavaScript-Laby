const gameArea = document.getElementById('game-area');
const canvasArea = document.createElement('canvas');
canvasArea.width = 500;
canvasArea.height = 800;
gameArea.appendChild(canvasArea);

const ctx = canvasArea.getContext('2d'); //Context do rysowania na canvasie
let ballX = 470;
let ballY = 30;

function drawBall(){
    ctx.clearRect(0, 0, canvasArea.width, canvasArea.height); // czyść canvas
    ctx.beginPath();
    ctx.arc(ballX, ballY, 30, 0, Math.PI * 2); // Narysuj okrąg
    ctx.fillStyle = 'blue';              // Ustaw kolor
    ctx.fill();                          // Wypełnij okrąg kolorem
    ctx.closePath();
}

window.addEventListener('deviceorientation', (event) =>{
    let tilt = event.beta; // Pobierz wartość beta
    if (tilt < 60) tilt = 60;
    if (tilt > 120) tilt = 120;

    // Przeskaluj tilt (60-120) na ballX (30-470)
    let normalized = (tilt - 60) / (120 - 60); // 0 do 1
    ballX = 30 + normalized * (470 - 30);
    console.log('tilt:', tilt.toFixed(0), 'ballX:', ballX.toFixed(0));

    drawBall();
});