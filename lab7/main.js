//event.alpha – obrót wokół osi Z (0–360°)
//event.beta – obrót wokół osi X (–180° do 180°)
//event.gamma – obrót wokół osi Y (–90° do 90°)
window.addEventListener('deviceorientation', function(event) {
    // event.alpha, event.beta, event.gamma
    console.log('alpha:', event.alpha, 'beta:', event.beta, 'gamma:', event.gamma);
});