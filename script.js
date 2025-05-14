const open = document.querySelector("#open");
const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const fullScreen = document.querySelector("#fullScreen");

const fileInput = document.querySelector("#fileInput");
const main = document.querySelector("#screen");
const main_logo = document.querySelector("#main_logo");
const toast = document.querySelector(".toast");

const footer_timeline = document.querySelector(".footer_timeline");
const current_time = document.querySelector(".current_time");
const time_slider = document.querySelector(".time_slider");
const total_time = document.querySelector(".total_time");
const slider = document.querySelector("#slider");

const playPause = document.querySelector("#playPause");
const backBtn = document.querySelector("#backBtn");
const stopBtn = document.querySelector("#stopBtn");
const forwardBtn = document.querySelector("#forwardBtn");
const fullScreenBtn = document.querySelector("#fullScreenBtn");


// === File Upload ===
const videoInputHandler = () => {
  fileInput.click();
};

const videoHandler = (event) => {
  const existingVideo = main.querySelector("video");
  if (existingVideo) existingVideo.remove();

  let files;
  
  if (event.target && event.target.files) {
    files = event.target.files;
  } else if (event.dataTransfer && event.dataTransfer.files) {
    files = event.dataTransfer.files;
  } else {
    return;
  }

  const video = files[0];
  if (!video) return;
  
  const videoURL = URL.createObjectURL(video);

  const videoElement = document.createElement("video");
  videoElement.setAttribute("src", videoURL);
  videoElement.setAttribute("class", "video");
  videoElement.controls = false;
  videoElement.autoplay = true;
  videoElement.muted = false;

  videoElement.volume = 0.5;

  if (main_logo) main_logo.remove();
  main.appendChild(videoElement);
};

open.addEventListener("click", videoInputHandler);
fileInput.addEventListener("change", videoHandler);

// === Speed Handlers ===
const speedUpHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    if (video.playbackRate < 2) {
      video.playbackRate += 0.25;
    }
    if (video.playbackRate >= 2) {
      video.playbackRate = 2;
      showToast("Speed Max");
    } else {
      showToast("Speed " + video.playbackRate.toFixed(2) + "x");
    }
  }
};

const speedDownHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    if (video.playbackRate > 0.25) {
      video.playbackRate -= 0.25;
    }
    if (video.playbackRate <= 0.25) {
      video.playbackRate = 0.25;
      showToast("Speed Min");
    } else {
      showToast("Speed " + video.playbackRate.toFixed(2) + "x");
    }
  }
};

// === Volume Handlers ===
const volumeUpHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    video.volume = Math.min(1, video.volume + 0.1);
    if (video.volume === 1) {
      showToast("Volume Max");
    } else {
      showToast("Volume " + Math.round(video.volume * 100) + "%");
    }
  }
};

const volumeDownHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    video.volume = Math.max(0, video.volume - 0.1);
    if (video.volume === 0) {
      showToast("Volume Min");
    } else {
      showToast("Volume " + Math.round(video.volume * 100) + "%");
    }
  }
};

speedUp.addEventListener("click", speedUpHandler);
speedDown.addEventListener("click", speedDownHandler);
volumeUp.addEventListener("click", volumeUpHandler);
volumeDown.addEventListener("click", volumeDownHandler);

// === Fullscreen Handler ===
const fullScreenHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
    showToast("Entered Full Screen");
  }
};

fullScreen.addEventListener("click", fullScreenHandler);

// === Toast Display ===
function showToast(message) {
  toast.innerHTML = message;
  setTimeout(() => {
    toast.innerHTML = "";
    toast.style.textAlign= "right";
    toast.style.fontSize= "25px";
  }, 1000);
}

// === Keyboard Shortcuts ===
document.addEventListener("keydown", (event) => {
  const video = main.querySelector("video");
  if (!video) return;

  switch (event.key) {
    case "ArrowRight":
      speedUpHandler();
      break;
    case "ArrowLeft":
      speedDownHandler();
      break;
    case "ArrowUp":
      volumeUpHandler();
      break;
    case "ArrowDown":
      volumeDownHandler();
      break;
    case " ":
      playPauseHandler();
      break;
    default:
      break;
  }
});

// === Drag and Drop ===
const dragOverHandler = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

const dropHandler = (event) => {
  event.preventDefault();
  event.stopPropagation();
  videoHandler(event);
};

main.addEventListener("drop", dropHandler);
main.addEventListener("dragover", dragOverHandler);

// === Timeline Handlers ===

const seekHandler = (event) => {
  const video = main.querySelector("video");
  if (video) {
    const percentage = event.target.value;
    const duration = video.duration;
    video.currentTime = (percentage / 100) * duration;
  } else {
    const percentage = "";
    const duration = 0;
  }
};

const updateTimeline = () => {
  const video = main.querySelector("video");
  
  if (video && video.duration) {
    const currentTime = video.currentTime;
    const duration = video.duration;
    const percentage = (currentTime / duration) * 100;

    slider.value = percentage;
    current_time.textContent = formatTime(currentTime);
    total_time.textContent = formatTime(duration);
  } else {
    slider.value = 0;
    current_time.textContent = "00:00:00";
    total_time.textContent = "00:00:00";
  }
};

const formatTime = (time) => {
  const date = new Date(time * 1000);
  return date.toISOString().substr(11, 8);
};

slider.addEventListener("input", seekHandler);
setInterval(updateTimeline, 500);

// === Buttons Handlers ===

const playPauseHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    if (video.paused) {
      video.play();
      playPause.innerHTML = '<i class="fas fa-pause"></i>';
      showToast("Playing");
    } else {
      video.pause();
      playPause.innerHTML = '<i class="fas fa-play"></i>';
      showToast("Paused");
    }
  }
};

const backBtnHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    toast.style.textAlign= "left";
    toast.style.fontSize= "15px";
    video.currentTime = Math.max(0, video.currentTime - 5);
    showToast("Rewinded 5 seconds");
  }
};

const forwardBtnHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    toast.style.textAlign= "left";
    toast.style.fontSize= "15px";
    video.currentTime = Math.min(video.duration, video.currentTime + 5);
    showToast("Forwarded 5 seconds");
  }
};

const stopBtnHandler = () => {
  const video = main.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
    playPause.innerHTML = '<i class="fas fa-play"></i>';
    showToast("Stopped");
  }
};

const fullScreenBtnHandler = () => {
  fullScreenHandler();
  showToast("Entered Full Screen");
};

playPause.addEventListener("click", playPauseHandler);
backBtn.addEventListener("click", backBtnHandler);
forwardBtn.addEventListener("click", forwardBtnHandler);
stopBtn.addEventListener("click", stopBtnHandler);
fullScreenBtn.addEventListener("click", fullScreenBtnHandler);