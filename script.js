const audio = new Audio();
let playlist = [];
let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;

// English songs with original names (Safe links)
const onlineSongs = [
    { title: "SoundHelix Song 1", artist: "Helix Artist", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "https://picsum.photos/300/300?random=1" },
    { title: "SoundHelix Song 2", artist: "Helix Artist", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "https://picsum.photos/300/300?random=2" },
    { title: "SoundHelix Song 3", artist: "Helix Artist", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "https://picsum.photos/300/300?random=3" }
];

window.onload = () => {
    loadOnlineSongs();
    setupControls();
    setupKeyboard();
};

function loadOnlineSongs() {
    const grid = document.getElementById('onlineGrid');
    onlineSongs.forEach(song => {
        const idx = playlist.length;
        playlist.push(song);
        grid.appendChild(createCard(song, idx));
    });
}

document.getElementById('fileInput').onchange = (e) => {
    const files = e.target.files;
    const grid = document.getElementById('offlineGrid');
    if (files.length > 0) grid.innerHTML = "";

    Array.from(files).forEach(file => {
        const url = URL.createObjectURL(file);
        const song = { title: file.name.replace(".mp3",""), artist: "Local File", src: url, cover: "https://picsum.photos/300/300?random=" + Math.random() };
        const idx = playlist.length;
        playlist.push(song);
        grid.appendChild(createCard(song, idx));
    });
};

function createCard(song, index) {
    const div = document.createElement('div');
    div.className = 'song-card';
    div.innerHTML = `<img src="${song.cover}"><div class="title">${song.title}</div><div class="artist">${song.artist}</div>`;
    div.onclick = () => playSong(index);
    return div;
}

function playSong(index) {
    currentIndex = index;
    const song = playlist[currentIndex];
    audio.src = song.src;
    audio.play();
    document.getElementById('currTrackTitle').innerText = song.title;
    document.getElementById('currTrackArtist').innerText = song.artist;
    document.getElementById('currTrackImg').src = song.cover;
    document.getElementById('mainPlayBtn').className = 'fas fa-pause';
}

function setupControls() {
    const playBtn = document.getElementById('mainPlayBtn');
    const seek = document.getElementById('seekSlider');
    const vol = document.getElementById('volumeSlider');

    playBtn.onclick = togglePlay;
    document.getElementById('nextBtn').onclick = playNext;
    document.getElementById('prevBtn').onclick = () => {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        playSong(currentIndex);
    };

    audio.ontimeupdate = () => {
        seek.value = (audio.currentTime / audio.duration) * 100 || 0;
        document.getElementById('currentTime').innerText = formatTime(audio.currentTime);
        document.getElementById('durationTime').innerText = formatTime(audio.duration || 0);
    };

    seek.oninput = () => audio.currentTime = (seek.value / 100) * audio.duration;
    vol.oninput = () => audio.volume = vol.value / 100;
    
    audio.onended = () => isRepeat ? playSong(currentIndex) : playNext();

    document.getElementById('shuffleBtn').onclick = function() { isShuffle = !isShuffle; this.classList.toggle('active-green'); };
    document.getElementById('repeatBtn').onclick = function() { isRepeat = !isRepeat; this.classList.toggle('active-green'); };
}

function togglePlay() {
    if (audio.paused) { audio.play(); document.getElementById('mainPlayBtn').className = 'fas fa-pause'; }
    else { audio.pause(); document.getElementById('mainPlayBtn').className = 'fas fa-play'; }
}

function playNext() {
    currentIndex = isShuffle ? Math.floor(Math.random() * playlist.length) : (currentIndex + 1) % playlist.length;
    playSong(currentIndex);
}

function setupKeyboard() {
    window.onkeydown = (e) => {
        if(e.code === "Space") { e.preventDefault(); togglePlay(); }
    };
}

function formatTime(s) {
    let m = Math.floor(s / 60); let sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0'+sec : sec}`;
}

document.getElementById('searchInput').oninput = function() {
    let term = this.value.toLowerCase();
    document.querySelectorAll('.song-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? "block" : "none";
    });
};