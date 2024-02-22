let audio = document.getElementById("myAudio");
let progressBar = document.getElementById("progressBar");
let progress = document.getElementById("progress");
let currentTimeSpan = document.getElementById("currentTime");
let totalTime = document.getElementById("songTime");
const nameMuic = document.getElementById("music-name");
const nameSing = document.getElementById("nameSinger");
const img = document.getElementById("avatar");
const audioElement = document.getElementById("myAudio");
const pausePlay = document.getElementById("pauseMusic")
const displayPlay = document.getElementById("displayPlay")
const like = document.getElementById("like")

function toggleAudio(url, name, nameSinger, avatar) {
    nameSing.innerHTML = nameSinger;
    nameMuic.innerHTML = name;
    img.src = avatar;

    audioElement.src = url;
    console.log(url)
    img.style.display = 'block'

    if (audioElement.paused) {
        audioElement.play();
        pausePlay.style.display = 'block'
        displayPlay.style.display = 'none'
    } else {
        audioElement.pause();
    }

}
function updateLike(likes) {
    like.innerHTML = likes;
}

function pause() {
    audioElement.pause();
    pausePlay.style.display = 'none'
    displayPlay.style.display = 'block'
}

function playMusic() {
    if (audioElement.paused) {
        audioElement.play();
        pausePlay.style.display = 'block'
        displayPlay.style.display = 'none'
    }
}

function seek(event) {
    let rect = progressBar.getBoundingClientRect();
    let totalWidth = rect.width;
    let clickX = event.clientX - rect.left;
    let percentage = (clickX / totalWidth);
    let seekTime = percentage * audio.duration;
    audio.currentTime = seekTime;
}
function updateProgress() {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const percentage = (currentTime / duration) * 100;
    progress.style.width = percentage + '%';
}

audio.addEventListener("timeupdate", function () {
    let currentTime = audio.currentTime;
    let duration = audio.duration;
    let totalMinutes = Math.floor(duration / 60);
    let totalSeconds = Math.floor(duration % 60);
    let minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    currentTimeSpan.style.display = 'block';
    currentTimeSpan.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    if (!isNaN(totalMinutes) && !isNaN(totalSeconds)) {
        totalTime.style.display = 'block';
        totalTime.textContent = totalMinutes + ":" + (totalSeconds < 10 ? "0" : "") + totalSeconds;
        updateProgress()
    } else {
        totalTime.style.display = 'none';
    }

});
