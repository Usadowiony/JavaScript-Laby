const gameArea = document.getElementById('game-area');
const canvasArea = document.createElement('canvas');
canvasArea.width = 600;
canvasArea.height = 1000;
gameArea.appendChild(canvasArea); // poprawiona literówka

const ctx = canvasArea.getContext('2d');

ctx.beginPath();
ctx.arc(30, 30, 30, 0, Math.PI * 2); // Narysuj okrąg
ctx.fillStyle = 'blue';              // Ustaw kolor
ctx.fill();                          // Wypełnij okrąg kolorem
ctx.closePath();

window.addEventListener('deviceorientation', (event) =>{
    let alphaValue = event.alpha.toFixed(0); // Pobierz wartość alpha i zaokrąglij do pełnych stopni
    console.log(alphaValue)
});