# 🛡️ FallGuard — Motion Intelligence System

> AI-powered fall detection for visually impaired and elderly individuals. Uses your phone's built-in sensors — no wearable required.

---

## What It Does

FallGuard continuously monitors motion using your phone's accelerometer and gyroscope. When a fall is detected, it:

1. Triggers a **10-second countdown overlay** with an alarm
2. Speaks aloud: *"Are you okay?"* and listens for your voice response
3. If no response — sends an **SMS with your GPS location** to your emergency contact via Twilio
4. Logs the event to **Fall History** with a Google Maps link

---

## Features

| Feature | Description |
|---------|-------------|
| 📱 **Live Sensor** | Real-time fall detection via phone accelerometer + gyroscope |
| 🧠 **ML Classification** | Random Forest model — 13 activity types, 1,428 training samples |
| 🔔 **SOS Countdown** | 10s animated overlay with alarm beep and vibration |
| 🎤 **Voice Cancel** | Say *"I am OK"* / *"Haan"* / *"Theek"* to cancel — say *"Help"* to send immediately |
| 📍 **GPS Location** | Google Maps link automatically included in the SMS |
| 📨 **Twilio SMS** | Instant SMS to pre-configured emergency contact |
| 🕐 **Fall History** | Persistent log of all fall events with date, time, confidence, location |
| 🎛️ **Manual Input** | Test predictions by entering sensor values manually |
| ⚡ **Free Hosting** | Backend runs on Google Colab + Cloudflare Tunnel — no server cost |

---

## Repository Structure

```
fallguard/
├── index.html              ← Full frontend (Live Sensor, Manual Input, Fall History)
├── app.py                  ← Flask backend (REST API)
├── FallGuard_Backend.ipynb ← Google Colab notebook (4 cells, ready to run)
├── requirements.txt        ← Python dependencies
├── model.pkl               ← Trained RandomForest model   (add yourself)
├── label_encoder.pkl       ← LabelEncoder                 (add yourself)
└── README.md
```

> `model.pkl` and `label_encoder.pkl` are not committed to git. Add them to `.gitignore` and upload via the Colab notebook.

---

## Quick Start — Google Colab (Recommended, Free)

### Step 1 — Open the notebook

Open `FallGuard_Backend.ipynb` in Google Colab.

### Step 2 — Run Cell 1 (Install packages)

```python
pip install flask flask-cors scikit-learn==1.8.0 joblib pandas twilio -q
```

### Step 3 — Run Cell 2 (Upload model files)

When prompted, upload:
- `model.pkl` — must be at least 100 KB
- `label_encoder.pkl`

### Step 4 — Run Cell 3 (Set Twilio credentials)

```python
TWILIO_SID     = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
TWILIO_TOKEN   = 'your_auth_token'       # from console.twilio.com
TWILIO_FROM    = '+12542744862'           # your Twilio number
EMERGENCY_TO   = '+91XXXXXXXXXX'         # contact to receive SOS SMS
EMERGENCY_NAME = 'Mom'
```

> **Get free Twilio credentials at** [twilio.com/try-twilio](https://www.twilio.com/try-twilio). Verify the `EMERGENCY_TO` number in the Twilio console (required for trial accounts).

### Step 5 — Run Cell 4 (Start backend)

The cell starts Flask and creates a Cloudflare tunnel. Copy the printed URL:

```
BACKEND LIVE!
  Paste into frontend URL field:
  https://xxxx-xxxx-xxxx.trycloudflare.com/api/predict
```

### Step 6 — Open frontend on your phone

1. Push `index.html` to GitHub Pages (or any static host)
2. Open it on your phone browser
3. Paste the Colab tunnel URL into the **Backend URL** field
4. Click **Test** to verify the connection
5. Tap **▶ Start Detection**

> The tunnel URL changes every time you restart Cell 4. Just paste the new one.

---

## Running Locally (Alternative)

```bash
git clone https://github.com/YOUR_USERNAME/fallguard.git
cd fallguard
pip install -r requirements.txt
```

Copy `model.pkl` and `label_encoder.pkl` into the project root, then:

```bash
python app.py
```

Server starts at `http://localhost:5000`. To allow phones on your local network, set `host='0.0.0.0'` in `app.py`, then open `http://YOUR_LOCAL_IP:5000` on your phone.

---

## How Live Detection Works

```
Phone sensors (60Hz)
      ↓
Rolling buffer — 50 samples
      ↓
Every 25 samples (~2.5s) → compute 9 features
      ↓
POST /api/predict → Random Forest model
      ↓
Fall detected + confidence ≥ threshold?
      ↓
triggerSOS() → countdown + voice + GPS + SMS
```

### The 9 Computed Features

| Feature | Description |
|---------|-------------|
| `acc_max` | Peak resultant acceleration magnitude |
| `gyro_max` | Peak resultant gyroscope magnitude |
| `lin_max` | Peak linear acceleration (gravity subtracted) |
| `acc_kurtosis` | Distribution peakedness — high spikes indicate falls |
| `gyro_kurtosis` | Gyroscope distribution peakedness |
| `acc_skewness` | Acceleration distribution asymmetry |
| `gyro_skewness` | Gyroscope distribution asymmetry |
| `post_gyro_max` | Second-half window gyroscope peak (post-fall stillness) |
| `post_lin_max` | Second-half window linear acceleration peak |

---

## SOS System Flow

```
Fall detected (confidence above slider threshold)
        ↓
🚨 Overlay appears — beep alarm + phone vibrates
        ↓
🎤 Phone speaks: "Are you okay?"
        ↓
Mic listens continuously throughout countdown
        ↓
┌─────────────────────┬────────────────────────────┐
│ Voice: "I am OK"    │ Voice: "Help" / "Madad"    │
│ → Cancel SOS        │ → Send SMS immediately     │
└─────────────────────┴────────────────────────────┘
        ↓ (no response)
10-second countdown reaches zero
        ↓
📍 GPS location fetched
        ↓
📨 Twilio SMS sent:
   "FALL ALERT! Forward Fall detected with 92% confidence
    at 14:32:05. Please check on Mom immediately!
    Location: https://maps.google.com/?q=28.6139,77.2090"
```

### Voice Commands

| Say | Action |
|-----|--------|
| *"I am OK"* / *"Okay"* / *"Fine"* | Cancel SOS |
| *"Haan"* / *"Theek"* / *"Safe"* | Cancel SOS |
| *"Help"* / *"Send"* / *"Emergency"* | Send SOS immediately |
| *"Madad"* / *"Hurt"* / *"Pain"* | Send SOS immediately |

---

## Activity Labels

| Code | Activity | Category |
|------|----------|----------|
| FOL | Forward Fall | 🔴 fall |
| FKL | Fall Kneel | 🔴 fall |
| SDL | Sideways Fall | 🔴 fall |
| BSC | Back Fall | 🔴 fall |
| STU | Stumble | 🟡 stumble |
| WAL | Walking | 🟢 normal |
| JOG | Jogging | 🟢 normal |
| STD | Standing | 🟢 normal |
| STN | Standing Still | 🟢 normal |
| JUM | Jumping | 🟢 normal |
| CSI | Chair Sit-In | 🟢 normal |
| CSO | Chair Sit-Out | 🟢 normal |
| SCH | Sit Chair | 🟢 normal |

---

## API Reference

### `POST /api/predict`

Single prediction from sensor features.

**Request:**
```json
{
  "acc_max": 26.04, "gyro_max": 7.31, "lin_max": 11.13,
  "acc_kurtosis": 20.38, "gyro_kurtosis": 2.78,
  "acc_skewness": 3.89, "gyro_skewness": 1.59,
  "post_gyro_max": 7.09, "post_lin_max": 10.79
}
```

**Response:**
```json
{
  "label": "FOL", "name": "Forward Fall",
  "category": "fall", "confidence": 87.5,
  "top5": [{"label": "FOL", "name": "Forward Fall", "prob": 87.5}, ...]
}
```

### `POST /api/sos`

Triggers Twilio SMS to emergency contact.

**Request:**
```json
{
  "label": "FOL", "confidence": 87.5,
  "gps_text": "Lat: 28.613900, Lon: 77.209000",
  "gps_link": "https://maps.google.com/?q=28.6139,77.209"
}
```

**Response:**
```json
{ "sent": true, "sid": "SMxxxxxxxxxxxx" }
```

---

## SOS Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Contact name | Mom | Name shown in SMS sent confirmation |
| Min confidence | 80% | Slider (50–95%) — minimum confidence to trigger SOS |
| Countdown | 10 sec | Seconds before SMS auto-sends if no voice response |

---

## Fall History

Every SOS-triggering fall is automatically saved to browser `localStorage`:

- Fall code + activity name
- Date and time
- Confidence % from the model
- GPS coordinates as a clickable Google Maps link
- **SOS SENT** badge if SMS was dispatched

Up to 100 events stored. Use **Clear All** to wipe the log.

---

## Requirements

```
flask
flask-cors
scikit-learn==1.8.0
joblib
pandas
twilio
```

---

## .gitignore

```
model.pkl
label_encoder.pkl
Train.csv
__pycache__/
*.pyc
.env
venv/
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Sensors | DeviceMotionEvent API |
| Voice | Web Speech API (SpeechSynthesis + SpeechRecognition) |
| Location | Geolocation API |
| ML Model | scikit-learn RandomForestClassifier (200 trees) |
| Backend | Python Flask + Flask-CORS |
| SMS | Twilio REST API |
| Backend hosting | Google Colab + Cloudflare Tunnel (free) |
| Frontend hosting | GitHub Pages (free) |

---

## Troubleshooting

**Backend URL test fails**
Re-run Cell 4 in Colab — the tunnel URL changes each session. Paste the new URL and click Test.

**No sensor data on phone**
Must open on a real mobile device. iOS 13+ requires HTTPS — use GitHub Pages, not `file://`.

**SMS not sending**
Verify `EMERGENCY_TO` in Twilio console (trial accounts require verified numbers). Regenerate Auth Token if it was ever exposed publicly.

**Model prediction errors**
Ensure `model.pkl` was trained with `scikit-learn==1.8.0`. Re-upload via Cell 2 if you see EOF errors.

---

*Built at IIIT Manipur — protecting lives with AI.*
