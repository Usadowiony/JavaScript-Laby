// Drumkit Application

// DOM Elements
const drumButtons = document.querySelectorAll('.drum-pad button');
const channelsContainer = document.getElementById('channels-container');
const addChannelBtn = document.getElementById('add-channel');
const removeChannelBtn = document.getElementById('remove-channel');
const metronomeToggle = document.getElementById('metronome-toggle');
const metronomeBpm = document.getElementById('metronome-bpm');
const looperToggle = document.getElementById('looper-toggle');
const loopLength = document.getElementById('loop-length');
const playAllBtn = document.getElementById('play-all');
const stopAllBtn = document.getElementById('stop-all');

// Audio elements
const audioElements = {
    clap: document.getElementById('clap'),
    hihat: document.getElementById('hihat'),
    kick: document.getElementById('kick'),
    snare: document.getElementById('snare'),
    tom: document.getElementById('tom'),
    boom: document.getElementById('boom'),
    tick: document.getElementById('tick')
};

// Application state
let channels = [];
let activeChannel = null;
let isRecording = false;
let isPlaying = false;
let isLooping = false;
let isMetronomeActive = false;
let metronomeInterval = null;
let loopInterval = null;
let startTime = 0;
let loopDuration = 4; // seconds

// Initialize with 4 channels
for (let i = 0; i < 4; i++) {
    addChannel();
}

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyUp);
addChannelBtn.addEventListener('click', addChannel);
removeChannelBtn.addEventListener('click', removeChannel);
metronomeToggle.addEventListener('change', toggleMetronome);
metronomeBpm.addEventListener('change', updateMetronomeBpm);
looperToggle.addEventListener('change', toggleLooper);
loopLength.addEventListener('change', updateLoopLength);
playAllBtn.addEventListener('click', playAllChannels);
stopAllBtn.addEventListener('click', stopAllChannels);

// Functions
function handleKeyPress(event) {
    // Prevent default behavior for drum keys
    if (['a', 's', 'd', 'f', 'g', 'h'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        
        // Find the button with this key
        const button = document.querySelector(`.drum-pad button[data-key="${event.key.toLowerCase()}"]`);
        if (button) {
            button.classList.add('active');
            
            // Get the sound name from the button
            const soundName = button.getAttribute('data-sound');
            
            // Play the sound
            playSound(soundName);
            
            // Record the sound if recording is active
            if (isRecording && activeChannel !== null) {
                recordSound(soundName);
            }
        }
    }
}

function handleKeyUp(event) {
    // Remove active class from buttons
    if (['a', 's', 'd', 'f', 'g', 'h'].includes(event.key.toLowerCase())) {
        const button = document.querySelector(`.drum-pad button[data-key="${event.key.toLowerCase()}"]`);
        if (button) {
            button.classList.remove('active');
        }
    }
}

function playSound(soundName) {
    const sound = audioElements[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
}

function addChannel() {
    const channelId = channels.length;
    const channel = {
        id: channelId,
        name: `Channel ${channelId + 1}`,
        events: [],
        isPlaying: false,
        isMuted: false
    };
    
    channels.push(channel);
    createChannelUI(channel);
}

function removeChannel() {
    if (channels.length > 1) {
        const channel = channels.pop();
        const channelElement = document.getElementById(`channel-${channel.id}`);
        if (channelElement) {
            channelElement.remove();
        }
    }
}

function createChannelUI(channel) {
    const channelElement = document.createElement('div');
    channelElement.className = 'channel';
    channelElement.id = `channel-${channel.id}`;
    
    channelElement.innerHTML = `
        <span>${channel.name}</span>
        <div class="channel-controls">
            <button class="record-btn" data-channel-id="${channel.id}">Record</button>
            <button class="play-btn" data-channel-id="${channel.id}">Play</button>
            <button class="stop-btn" data-channel-id="${channel.id}">Stop</button>
            <button class="mute-btn" data-channel-id="${channel.id}">Mute</button>
            <button class="clear-btn" data-channel-id="${channel.id}">Clear</button>
        </div>
    `;
    
    channelsContainer.appendChild(channelElement);
    
    // Add event listeners to channel buttons
    const recordBtn = channelElement.querySelector('.record-btn');
    const playBtn = channelElement.querySelector('.play-btn');
    const stopBtn = channelElement.querySelector('.stop-btn');
    const muteBtn = channelElement.querySelector('.mute-btn');
    const clearBtn = channelElement.querySelector('.clear-btn');
    
    recordBtn.addEventListener('click', () => toggleRecording(channel.id));
    playBtn.addEventListener('click', () => playChannel(channel.id));
    stopBtn.addEventListener('click', () => stopChannel(channel.id));
    muteBtn.addEventListener('click', () => toggleMute(channel.id));
    clearBtn.addEventListener('click', () => clearChannel(channel.id));
}

function toggleRecording(channelId) {
    if (isRecording && activeChannel === channelId) {
        // Stop recording
        isRecording = false;
        activeChannel = null;
        document.querySelector(`.record-btn[data-channel-id="${channelId}"]`).textContent = 'Record';
        document.getElementById(`channel-${channelId}`).classList.remove('active');
    } else {
        // Stop any other recording first
        if (isRecording) {
            const oldChannel = document.querySelector(`.record-btn[data-channel-id="${activeChannel}"]`);
            if (oldChannel) {
                oldChannel.textContent = 'Record';
                document.getElementById(`channel-${activeChannel}`).classList.remove('active');
            }
        }
        
        // Start recording on this channel
        isRecording = true;
        activeChannel = channelId;
        startTime = Date.now();
        document.querySelector(`.record-btn[data-channel-id="${channelId}"]`).textContent = 'Stop';
        document.getElementById(`channel-${channelId}`).classList.add('active');
    }
}

function recordSound(soundName) {
    const channel = channels.find(c => c.id === activeChannel);
    if (channel) {
        const timestamp = Date.now() - startTime;
        channel.events.push({
            sound: soundName,
            time: timestamp
        });
    }
}

function playChannel(channelId) {
    const channel = channels.find(c => c.id === channelId);
    if (channel && !channel.isMuted) {
        channel.isPlaying = true;
        
        // Sort events by time
        const sortedEvents = [...channel.events].sort((a, b) => a.time - b.time);
        
        // Play each event at the correct time
        sortedEvents.forEach(event => {
            setTimeout(() => {
                if (channel.isPlaying) {
                    playSound(event.sound);
                }
            }, event.time);
        });
        
        // If looping is enabled, schedule the next play
        if (isLooping) {
            setTimeout(() => {
                if (channel.isPlaying) {
                    playChannel(channelId);
                }
            }, loopDuration * 1000);
        }
    }
}

function stopChannel(channelId) {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
        channel.isPlaying = false;
    }
}

function toggleMute(channelId) {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
        channel.isMuted = !channel.isMuted;
        const muteBtn = document.querySelector(`.mute-btn[data-channel-id="${channelId}"]`);
        muteBtn.textContent = channel.isMuted ? 'Unmute' : 'Mute';
    }
}

function clearChannel(channelId) {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
        channel.events = [];
        stopChannel(channelId);
    }
}

function playAllChannels() {
    if (!isPlaying) {
        isPlaying = true;
        startTime = Date.now();
        
        // Play all unmuted channels
        channels.forEach(channel => {
            if (!channel.isMuted) {
                playChannel(channel.id);
            }
        });
        
        // Start metronome if enabled
        if (isMetronomeActive) {
            startMetronome();
        }
    }
}

function stopAllChannels() {
    isPlaying = false;
    
    // Stop all channels
    channels.forEach(channel => {
        stopChannel(channel.id);
    });
    
    // Stop metronome
    stopMetronome();
}

function toggleMetronome() {
    isMetronomeActive = metronomeToggle.checked;
    
    if (isMetronomeActive && isPlaying) {
        startMetronome();
    } else {
        stopMetronome();
    }
}

function updateMetronomeBpm() {
    const bpm = parseInt(metronomeBpm.value);
    if (isMetronomeActive && isPlaying) {
        stopMetronome();
        startMetronome();
    }
}

function startMetronome() {
    const bpm = parseInt(metronomeBpm.value);
    const interval = (60 / bpm) * 1000; // Convert BPM to milliseconds
    
    // Play tick sound immediately
    playSound('tick');
    
    // Set interval for subsequent ticks
    metronomeInterval = setInterval(() => {
        if (isPlaying && isMetronomeActive) {
            playSound('tick');
        }
    }, interval);
}

function stopMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    }
}

function toggleLooper() {
    isLooping = looperToggle.checked;
}

function updateLoopLength() {
    loopDuration = parseInt(loopLength.value);
}