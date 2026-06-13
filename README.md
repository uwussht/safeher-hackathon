# SafeHer

**Track: City Safety & Social Services (Track 3)**

Calling 112 in an emergency takes 15+ seconds. Unlock your phone, open the dialer, dial, wait for pickup - and in situations involving stalking, domestic violence, or assault, making a call at all is often impossible without drawing attention. SafeHer reduces that to one tap from the home screen.

---

## What it does

SafeHer is a Progressive web application for women's safety in Kazakhstan. Press the SOS button and three things happen simultaneously: your GPS coordinates are captured, a short audio clip starts recording in the background, and an incident is created in the system. The audio goes to Groq Whisper for transcription, then to LLaMA 70B which classifies the threat — physical assault, stalking, medical emergency, domestic situation — and returns which responders to route to. All of this happens in under 5 seconds without the user needing to speak or unlock anything.

During an active SOS the user gets a live map showing their location and the nearest crisis centers, plus a silent chat window where they can type to the AI assistant. Responses are short and actionable and never ask the user to speak or make noise.

Outside of emergencies, the Resources tab has a chatbot that answers questions about crisis centers, harassment reporting, and legal rights across Kazakhstan. It responds in Russian, Kazakh, or English depending on what the user writes, and its answers reference real crisis center names and phone numbers from our local dataset — not generic advice.

The Admin tab shows an anonymized incident heatmap for city planners and safety coordinators, built from seeded incident data rendered as a Leaflet heat layer.

---

## The AI layer

The core pipeline is: MediaRecorder captures 5–10 seconds of audio after SOS is pressed → POST to `/api/sos/classify-audio` → Groq Whisper produces a transcript → LLaMA 70B returns structured JSON with threat type, confidence score, a one-sentence incident brief, and a list of recommended responders. That output drives what the user sees on screen — the threat badge, the responder list, the pre-filled 112 brief.

The resource chatbot uses the same LLaMA model but with a different system prompt that has the full KZ crisis center dataset injected into it. So when someone asks "where can I go in Atyrau right now" the AI responds with an actual center name, phone number, and hours — not a suggestion to search online.

---

## Data

`data/kz_crisis_centers.json` contains real crisis center data for cities across Kazakhstan including Almaty, Astana, Atyrau, Shymkent, and Karaganda — names, types, phone numbers, and operating hours compiled from public government and NGO sources. This powers both the map markers and the chatbot's answers.

`data/kz_legal_resources.json` contains legal resources and rights information for women across Kazakhstan — used by the Resources chatbot to answer questions about harassment reporting, legal protections, and how to access support services.

`data/incidents_seed.csv` is an anonymized dataset of incident points used to populate the admin heatmap. All personal identifiers have been removed.

---

## Stack

FastAPI backend, React + Vite frontend with vite-plugin-pwa, react-leaflet with OpenStreetMap tiles, PostgreSQL via SQLAlchemy, Groq for both Whisper transcription and LLaMA inference.

---

## Running it

Start the database:
```bash
docker run -d --name safeher-db -e POSTGRES_PASSWORD=safeher -e POSTGRES_DB=safeher -p 5432:5432 postgres:16
```

Backend:
```bash
cd api
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> API available at: http://localhost:8000  
> Interactive API docs at: http://localhost:8000/docs

Frontend:
```bash
cd pwa
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
npm install && npm run dev
```
> App available at: http://localhost:5173  
> Admin dashboard at: http://localhost:5173/admin

## Environment Variables

The `.env` file is not included in this repo for security reasons.  
Create your own `api/.env` file with the following:

```bash
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/safeher
VITE_API_URL=http://localhost:8000
```

Get a free Groq API key at **https://console.groq.com** → sign up → API Keys → Create API Key. 
Paste it as the value for `GROQ_API_KEY`.

---

## What's mocked

- SMS notifications to trusted contacts are mocked as an in-app log — the notification object is real, the SMS delivery is simulated. 
- The 112 integration produces a pre-filled brief that would be submitted to emergency services in a production version. 
- Everything else — GPS, audio recording, Whisper transcription, LLaMA classification, the crisis center data, and the chatbot - is real and working.

## Project structure

```
safeher/
├── api/
│   ├── routers/
│   │   ├── sos.py          # trigger, classify-audio, coordinate
│   │   ├── chat.py         # resource + emergency chat
│   │   └── admin.py        # heatmap + stats
│   └── services/
│       ├── groq_client.py
│       ├── classifier.py   # Whisper → LLM pipeline
│       └── coordinator.py  # contact + 112 notification
├── pwa/src/
│   ├── hooks/
│   │   ├── useGeolocation.js     # live GPS tracking
│   │   ├── useShakeDetector.js   # shake-to-trigger SOS
│   │   └── useVoiceKeyword.js    # keyword voice detection
│   ├── pages/
│   │   ├── Home.jsx              # SOS trigger
│   │   ├── ActiveSOS.jsx         # live map + silent chat
│   │   ├── Resources.jsx         # chatbot + crisis center cards
│   │   ├── Profile.jsx           # user profile & trusted contacts
│   │   ├── Admin.jsx             # heatmap dashboard
│   │   ├── Overview.jsx          # admin overview & key metrics
│   │   ├── ActivityLogs.jsx      # incident history & audit trail
│   │   ├── AdvancedIntel.jsx     # threat analytics & patterns
│   │   └── SystemConfig.jsx      # system settings & configuration
│   ├── services/
│   │   └── api.js                # API client & endpoint helpers
│   └── components/
│       ├── MapView.jsx
│       └── ChatPanel.jsx
└── data/
    ├── kz_crisis_centers.json
    ├── kz_legal_resources.json
    └── incidents_seed.csv
```

---

Built by NovaCode · Track 3: City Safety & Social Services