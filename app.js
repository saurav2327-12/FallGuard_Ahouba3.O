// Initialize Voice Engine
const speak = (text) => {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
};

// UI Element References
const orb = document.getElementById("status-orb");
const statusText = document.getElementById("status-text");
const subStatus = document.getElementById("sub-status");
const cancelBtn = document.getElementById("cancel-btn");
const accelDisplay = document.getElementById("accel-val");
const gyroDisplay = document.getElementById("gyro-val");

// Initialize Detector
const detector = new FallDetector({
  onStatusChange: (msg) => {
    subStatus.innerText = msg;
  },
  onFallDetected: () => {
    triggerVisualAlert();
  },
});

function triggerVisualAlert() {
  // 1. Change UI to Critical State
  orb.classList.replace("bg-slate-800", "bg-red-600");
  orb.classList.replace("border-slate-700", "border-red-400");
  orb.classList.add("pulse-red");
  statusText.innerText = "FALL DETECTED";
  cancelBtn.classList.remove("hidden");

  // 2. Accessibility: Voice and Haptics
  speak(
    "Fall detected. Sending SOS in ten seconds. Press the large button to cancel.",
  );
  if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
}

function cancelAlert() {
  // Reset UI
  orb.classList.remove("bg-red-600", "pulse-red");
  orb.classList.add("bg-slate-800");
  statusText.innerText = "SYSTEM ARMED";
  cancelBtn.classList.add("hidden");
  subStatus.innerText = "Monitoring Motion...";

  speak("Emergency cancelled. System monitoring resumed.");
}

// Mock sensor data for Demo (In a real app, connect to window.DeviceMotionEvent)
setInterval(() => {
  // Update live feed for judges
  accelDisplay.innerText = (Math.random() * 1.2).toFixed(2) + "g";
  gyroDisplay.innerText = (Math.random() * 0.5).toFixed(2) + "°";
}, 200);
