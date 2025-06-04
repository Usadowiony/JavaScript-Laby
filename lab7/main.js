const gameArea = document.getElementById('game-area');
const canvasArea = document.createElement('canvas');
canvasArea.width = 600;
canvasArea.height = 1000;
gameArea.appendChild(canvasArea); // poprawiona literówka

const ctx = canvasArea.getContext('2d');

ctx.beginPath();
ctx.arc(100, 100, 30, 0, Math.PI * 2); // Narysuj okrąg
ctx.fillStyle = 'blue';              // Ustaw kolor
ctx.fill();                          // Wypełnij okrąg kolorem
ctx.closePath();