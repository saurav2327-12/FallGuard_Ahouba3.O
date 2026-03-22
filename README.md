# FallGuard AI | Intelligent Fall Detection for the Visually Impaired

### The Problem
Visually impaired individuals face a significantly higher risk of falls due to environmental barriers. Delayed assistance after a fall can lead to severe medical complications. Current solutions are often expensive, specialized hardware—we are making safety accessible via the smartphone already in their pocket.

### The Solution
**SafeStep** is a smartphone-based lifeline that leverages built-in **IMU (Inertial Measurement Unit)** sensors—accelerometer and gyroscope—to monitor movement patterns in real-time.

#### Key Features:
* **Intelligent Detection:** Uses a 3-phase algorithm (Free-fall -> Impact -> Inactivity) to minimize false alarms.
* **Accessibility First:** Designed for eyes-free use with **Haptic (vibration) alerts** and **Text-to-Speech (TTS)** voice prompts.
* **Automated SOS:** If a fall is confirmed and the user doesn't respond, the app automatically sends a GPS-tagged SOS to emergency contacts.
* **Low Friction:** Requires minimal user interaction once set up.

### Technical Stack
* **Web Prototype:** HTML5, Tailwind CSS, JavaScript (Web Speech API)
* **Mobile Framework:** [Flutter / React Native - Specify yours]
* **Sensors:** Accelerometer & Gyroscope (via IMU API)
* **Deployment:** GitHub Pages

### The Algorithm Logic
The system monitors total acceleration magnitude:
$$A_{total} = \sqrt{a_x^2 + a_y^2 + a_z^2}$$
1. **Free-fall:** $A_{total}$ drops below $0.5g$.
2. **Impact:** $A_{total}$ spikes above $3.0g$.
3. **Inactivity:** Gyroscope monitors for 10 seconds of no movement before triggering SOS.

---
*Created for [CODE RONIN 2026] by Team [IMPACT INNOVATORS]*
