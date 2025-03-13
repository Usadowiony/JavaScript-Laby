const channel1 = []

const clapSound = document.querySelector('#clap')
const hihatSound = document.querySelector('#hihat')
const kickSound = document.querySelector('#kick')

const sounds = {
    a: clapSound,
    s: hihatSound,
    d: kickSound
}

document.addEventListener('keypress', (event) =>{
    channel1.push(
        {
            key: event.key,
            time: Date.now()
        }
    )

    play(sounds[event.key]);
    console.log(channel1)
})
function play(sound){
    sound.currentTime = 0;
    sound.play();
}