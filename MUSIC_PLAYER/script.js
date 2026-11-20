const songs = [
  {
    title: "HEAVENLY JUMPSTYLE",
    artist: "Jumpstyle Mix",
    src: "./audio/HEAVENLY JUMPSTYLE.m4a",
    cover: "./PICS/image1.png",
  },
  {
    title: "FUNK UNIVERSO (Slowed)",
    artist: "Irokz",
    src: "./audio/Irokz - FUNK UNIVERSO (Slowed).mp3",
    cover: "./PICS/image2.png",
  },
  {
    title: "Kalyani",
    artist: "ARJN, Shreya Ghoshal",
    src: "./audio/Kalyani ARJN, Shreya Ghoshal (pagalall.com).m4a",
    cover: "./PICS/image3.png",
  },
  {
    title: "Dai Dai",
    artist: "Shakira, Burna Boy",
    src: "./audio/Shakira, Burna Boy - Dai Dai (Audio).m4a",
    cover: "./PICS/image4.png",
  },
];

const audio = document.getElementById("audioPlayer");
const coverImg = document.getElementById("coverImg");
const albumArt = document.querySelector(".album-art");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const totalDurationEl = document.getElementById("totalDuration");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const volumeSlider = document.getElementById("volumeSlider");
const autoplayCheckbox = document.getElementById("autoplayCheckbox");
const playlistList = document.getElementById("playlistList");

let currentSongIndex = 0;
let isPlaying = false;

// Format seconds into M:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Load song details
function loadSong(index) {
  const song = songs[index];
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  coverImg.src = song.cover;
  audio.src = song.src;
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  totalDurationEl.textContent = "0:00";
  updatePlaylistHighlight();
}

// Play & Pause functions
function playSong() {
  isPlaying = true;
  audio.play();
  playPauseBtn.innerHTML = "&#10074;&#10074;"; // Pause icon
  albumArt.classList.add("playing");
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playPauseBtn.innerHTML = "&#9654;"; // Play icon
  albumArt.classList.remove("playing");
}

playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// Previous & Next Track
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Update Progress Bar & Time Stamps
audio.addEventListener("loadedmetadata", () => {
  totalDurationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// Seek when user drags progress bar
progressBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

// Volume Control
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// Autoplay when song ends
audio.addEventListener("ended", () => {
  if (autoplayCheckbox.checked) {
    nextSong();
  } else {
    pauseSong();
    progressBar.value = 0;
  }
});

// Build Interactive Playlist
function renderPlaylist() {
  playlistList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${index + 1}. ${song.title}</span><small>${song.artist}</small>`;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playSong();
    });
    playlistList.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const items = playlistList.querySelectorAll("li");
  items.forEach((item, idx) => {
    item.classList.toggle("active", idx === currentSongIndex);
  });
}

// Initialize Player
audio.volume = volumeSlider.value;
renderPlaylist();
loadSong(currentSongIndex);
