const drumButtons = document.querySelectorAll('.drum-pad button');
const channelsContainer = document.getElementById('channels-container');
const playAllBtn = document.getElementById('play-all');
const stopAllBtn = document.getElementById('stop-all');

// --- Mapowanie klawiszy na dźwięki i referencje do audio ---
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

// --- Stan aplikacji: kanały, nagrywanie, timeouty ---
const channels = [[], [], [], []]; // 4 kanały, każdy to tablica eventów {sound, time}
let activeChannel = null;
let recordingStart = 0;
let playTimeouts = [[], [], [], []]; // timeouty do odtwarzania na kanałach

// --- Odtwarzanie dźwięku ---
function playSound(sound) {
    const audio = audioElements[sound];
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

// --- Renderowanie UI kanałów i podpinanie obsługi przycisków ---
function renderChannels() {
    channelsContainer.innerHTML = '';
    channels.forEach((_, i) => {
        const div = document.createElement('div');
        // Jeśli ten kanał jest aktualnie nagrywany, dodaj klasę 'active'
        if (activeChannel === i) {
            div.className = 'channel active';
        } else {
            div.className = 'channel';
        }
        div.innerHTML =
            'Kanał ' + (i + 1) +
            ' <button class="record-btn">' + (activeChannel === i ? 'Stop' : 'Nagraj') + '</button>' +
            ' <button class="play-btn">Odtwórz</button>' +
            ' <button class="clear-btn">Wyczyść</button>';

        const buttons = div.querySelectorAll('button');
        const rec = buttons[0];
        const play = buttons[1];
        const clear = buttons[2];

        // Podpinamy obsługę kliknięć do każdego przycisku
        rec.onclick = () => toggleRecord(i);
        play.onclick = () => playChannel(i);
        clear.onclick = () => clearChannel(i);

        // Dodajemy gotowy div kanału do kontenera na stronie
        channelsContainer.appendChild(div);
    });
}

// --- Rozpoczęcie lub zakończenie nagrywania na kanale ---
function toggleRecord(idx) {
    if (activeChannel === idx) {
        activeChannel = null;
    } else {
        // Start nagrywania na wybranym kanale
        activeChannel = idx;
        recordingStart = Date.now();
        channels[idx].length = 0; // czyść poprzednie nagranie
    }
    renderChannels(); // odśwież UI
}

// --- Odtwarzanie nagrania z kanału ---
function playChannel(idx) {
    stopChannel(idx); // zatrzymaj ewentualne wcześniejsze odtwarzanie
    channels[idx].forEach(event => {
        // Odtwarzaj dźwięk po odpowiednim czasie od startu
        const t = setTimeout(() => playSound(event.sound), event.time);
        playTimeouts[idx].push(t);  // zapisz timeout do tablicy
    });
}

// --- Zatrzymanie odtwarzania na kanale ---
function stopChannel(idx) {
    playTimeouts[idx].forEach(t => clearTimeout(t));
    playTimeouts[idx] = [];
}

// --- Wyczyść nagranie z kanału i zatrzymaj odtwarzanie ---
function clearChannel(idx) {
    channels[idx].length = 0;
    stopChannel(idx);
}

// --- Obsługa kliknięć padów ---
drumButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        if (!keyToSound[key]) return;
        playSound(keyToSound[key]);
        // Jeśli nagrywam, zapisz dźwięk i czas od startu
        if (activeChannel !== null) {
            channels[activeChannel].push({
                sound: keyToSound[key],
                time: Date.now() - recordingStart
            });
        }
    });
});

// --- Obsługa klawiatury ---
document.addEventListener('keydown', e => {
    if (e.repeat) return; // ignoruj trzymanie klawisza
    const sound = keyToSound[e.key];
    if (!sound) return;
    playSound(sound);
    // Podświetl aktywny pad
    drumButtons.forEach(btn => {
        if (btn.getAttribute('data-key') === e.key) btn.classList.add('active');
    });
    // Jeśli nagrywam, zapisz dźwięk i czas od startu
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

// --- Obsługa przycisków Play All i Stop All ---
playAllBtn.onclick = () => channels.forEach((_, i) => playChannel(i));
stopAllBtn.onclick = () => channels.forEach((_, i) => stopChannel(i));

// --- Inicjalizacja UI kanałów na starcie ---
renderChannels();