class FallDetector {
  constructor(callbacks) {
    this.onFallDetected = callbacks.onFallDetected;
    this.onStatusChange = callbacks.onStatusChange;

    // Threshold constants (Tweak these during testing!)
    this.LOW_G_THRESHOLD = 5.0; // Near weightlessness (Free fall)
    this.HIGH_G_THRESHOLD = 25.0; // High impact (The hit)
    this.STASIS_THRESHOLD = 0.5; // Minimal rotation (User is still)

    this.isMonitoring = false;
    this.potentialFallActive = false;
  }

  // 1. Calculate Magnitude: Math.sqrt(x^2 + y^2 + z^2)
  getMagnitude(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
  }

  // 2. Main Processing Logic
  processSensorData(accel, gyro) {
    const aMag = this.getMagnitude(accel.x, accel.y, accel.z);
    const gMag = this.getMagnitude(gyro.x, gyro.y, gyro.z);

    // STAGE 1: Detect Impact
    // If we see a massive spike in acceleration
    if (aMag > this.HIGH_G_THRESHOLD && !this.potentialFallActive) {
      this.handlePotentialFall(aMag, gMag);
    }
  }

  handlePotentialFall(accelMag, gyroMag) {
    this.potentialFallActive = true;
    this.onStatusChange("Impact Detected! Analyzing posture...");

    // STAGE 2: The "Lying Still" Check (Gyroscope)
    // We wait 2 seconds to see if the user moves or remains stationary
    setTimeout(() => {
      // Re-check sensor values after the 'bounce'
      // If gyro magnitude is very low, they aren't moving/getting up
      if (gyroMag < this.STASIS_THRESHOLD) {
        this.confirmFall();
      } else {
        this.onStatusChange("Movement detected. False alarm cleared.");
        this.potentialFallActive = false;
      }
    }, 2000);
  }

  confirmFall() {
    this.onFallDetected();
    this.potentialFallActive = false;
  }
}

// --- Implementation Example for your Script ---

const detector = new FallDetector({
  onFallDetected: () => {
    console.log("🚨 FALL CONFIRMED! Triggering SOS...");
    // Call your TTS and GPS functions here
    speak("Emergency detected. Sending location to contacts.");
  },
  onStatusChange: (msg) => {
    document.getElementById("status-box").innerText = msg;
  },
});

// Assuming you have a sensor stream (like in React Native or Web API)
// sensors.combined.subscribe(({ accelerometer, gyroscope }) => {
//    detector.processSensorData(accelerometer, gyroscope);
// });
