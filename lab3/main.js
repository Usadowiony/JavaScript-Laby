const drumButtons = document.querySelectorAll('.drum-pad button');
const channelsContainer = document.getElementById('channels-container');
const playAllBtn = document.getElementById('play-all');
const stopAllBtn = document.getElementById('stop-all');

// Dźwięki dostępne na padach
const keyToSound = {
    a: 'clap',
    s: 'kick',
    d: 'hihat'
};
const audioElements = {
    clap: document.getElementById('clap'),
    kick: document.getElementById('kick'),
    hihat: document.getElementById('hihat')
};

// Kanały: każdy to tablica eventów {sound, time}
const channels = [[], [], [], []];
let activeChannel = null;
let recordingStart = 0;
let playTimeouts = [[], [], [], []];

function playSound(sound) {
    const audio = audioElements[sound];
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

function renderChannels() {
    channelsContainer.innerHTML = '';
    channels.forEach((_, i) => {
        const div = document.createElement('div');
        div.className = 'channel' + (activeChannel === i ? ' active' : '');
        div.innerHTML = `Kanał ${i+1} <button class="record-btn">${activeChannel === i ? 'Stop' : 'Nagraj'}</button> <button class="play-btn">Odtwórz</button> <button class="clear-btn">Wyczyść</button>`;
        const [rec, play, clear] = div.querySelectorAll('button');
        rec.onclick = () => toggleRecord(i);
        play.onclick = () => playChannel(i);
        clear.onclick = () => clearChannel(i);
        channelsContainer.appendChild(div);
    });
}

function toggleRecord(idx) {
    if (activeChannel === idx) {
        activeChannel = null;
    } else {
        activeChannel = idx;
        recordingStart = Date.now();
        channels[idx].length = 0;
    }
    renderChannels();
}

function playChannel(idx) {
    stopChannel(idx);
    channels[idx].forEach(event => {
        const t = setTimeout(() => playSound(event.sound), event.time);
        playTimeouts[idx].push(t);
    });
}

function stopChannel(idx) {
    playTimeouts[idx].forEach(t => clearTimeout(t));
    playTimeouts[idx] = [];
}

function clearChannel(idx) {
    channels[idx].length = 0;
    stopChannel(idx);
}

// Obsługa padów (kliknięcie)
drumButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        if (!keyToSound[key]) return;
        playSound(keyToSound[key]);
        if (activeChannel !== null) {
            channels[activeChannel].push({
                sound: keyToSound[key],
                time: Date.now() - recordingStart
            });
        }
    });
});

// Obsługa klawiatury
document.addEventListener('keydown', e => {
    if (e.repeat) return;
    const sound = keyToSound[e.key];
    if (!sound) return;
    playSound(sound);
    drumButtons.forEach(btn => {
        if (btn.getAttribute('data-key') === e.key) btn.classList.add('active');
    });
    if (activeChannel !== null) {
        channels[activeChannel].push({
            sound,
            time: Date.now() - recordingStart
        });
    }
});
document.addEventListener('keyup', e => {
    drumButtons.forEach(btn => {
        if (btn.getAttribute('data-key') === e.key) btn.classList.remove('active');
    });
});

playAllBtn.onclick = () => channels.forEach((_, i) => playChannel(i));
stopAllBtn.onclick = () => channels.forEach((_, i) => stopChannel(i));

renderChannels();