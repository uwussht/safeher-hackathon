import json
import io
import os
import shutil

from services.groq_client import client
from pydub import AudioSegment

# --- FFmpeg setup (portable) ---
# Try to find ffmpeg on PATH first; fall back to a hardcoded path if needed.
FFMPEG_PATH = shutil.which("ffmpeg")

if not FFMPEG_PATH:
    # Fallback for local dev on this machine only — adjust or remove as needed.
    fallback = r"C:\Users\Админис\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"
    if os.path.exists(fallback):
        FFMPEG_PATH = fallback

if FFMPEG_PATH:
    AudioSegment.converter = FFMPEG_PATH
    AudioSegment.ffmpeg = FFMPEG_PATH
    os.environ["PATH"] += os.pathsep + os.path.dirname(FFMPEG_PATH)
    print(f"[classifier] Using ffmpeg at: {FFMPEG_PATH}")
else:
    print("[classifier] WARNING: ffmpeg not found on PATH and no fallback exists!")


THREAT_TYPES = [
    "physical_assault",
    "stalking",
    "medical_emergency",
    "domestic_situation",
    "unknown"
]


def classify_transcript(transcript: str) -> dict:
    prompt = f"""You are an emergency safety AI. Analyze this transcript and return JSON only.

Transcript: "{transcript}"

Return exactly this JSON structure, nothing else:
{{
  "threat_type": "physical_assault | stalking | medical_emergency | domestic_situation | unknown",
  "confidence": 0.95,
  "responders": ["trusted_contacts", "city_emergency", "crisis_center"],
  "brief": "one-sentence incident summary"
}}

Rules:
- threat_type must be one of: {', '.join(THREAT_TYPES)}
- confidence is 0.0 to 1.0
- responders: always include trusted_contacts
- add city_emergency if physical threat
- add crisis_center if domestic/stalking
- brief: one sentence, factual, no names
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
    )

    text = response.choices[0].message.content.strip()

    # Strip markdown code fences if the model wraps the JSON
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].strip()

    try:
        result = json.loads(text)

        if result.get("threat_type") not in THREAT_TYPES:
            result["threat_type"] = "unknown"

        result.setdefault("responders", ["trusted_contacts"])
        result.setdefault("brief", "Emergency situation detected.")

        return result

    except Exception as e:
        print(f"[classifier] JSON parse error: {e}")
        print(f"[classifier] Raw model output: {text!r}")

        return {
            "threat_type": "unknown",
            "confidence": 0.5,
            "responders": ["trusted_contacts"],
            "brief": "Unable to classify. Manual review needed.",
        }


def convert_to_wav(audio_bytes: bytes) -> bytes:
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))

        wav_buffer = io.BytesIO()
        audio.export(wav_buffer, format="wav")
        wav_buffer.seek(0)

        converted = wav_buffer.read()
        print(f"[classifier] Converted to WAV: {len(converted)} bytes")

        return converted

    except Exception as e:
        print(f"[classifier] WAV conversion failed: {e}")
        return None


def classify_audio(audio_bytes: bytes) -> dict:
    print(f"[classifier] Audio received: {len(audio_bytes)} bytes")

    # Fix known off-by-one corruption: extra 0x1a prepended before EBML header
    if audio_bytes[:5].hex() == "1a1a45dfa3":
        print("[classifier] Detected extra leading byte — stripping it")
        audio_bytes = audio_bytes[1:]

    if len(audio_bytes) == 0:
        return {
            "threat_type": "unknown",
            "confidence": 0.0,
            "responders": ["trusted_contacts"],
            "brief": "No audio data received.",
            "transcript": "",
        }

    # --- Try original WEBM ---
    try:
        print("[classifier] Trying original WEBM...")

        transcription = client.audio.transcriptions.create(
            file=("audio.webm", io.BytesIO(audio_bytes), "audio/webm"),
            model="whisper-large-v3",
            response_format="text",
        )

        transcript = (
            transcription
            if isinstance(transcription, str)
            else transcription.text
        ).strip()

        print(f"[classifier] Transcript: {transcript}")

        if transcript:
            result = classify_transcript(transcript)
            result["transcript"] = transcript
            return result

    except Exception as e:
        print(f"[classifier] Original WEBM failed: {e}")

    # --- Fallback: convert to WAV ---
    wav_bytes = convert_to_wav(audio_bytes)

    if wav_bytes:
        try:
            print("[classifier] Trying WAV...")

            transcription = client.audio.transcriptions.create(
                file=("audio.wav", io.BytesIO(wav_bytes), "audio/wav"),
                model="whisper-large-v3",
                response_format="text",
            )

            transcript = (
                transcription
                if isinstance(transcription, str)
                else transcription.text
            ).strip()

            print(f"[classifier] Transcript: {transcript}")

            if transcript:
                result = classify_transcript(transcript)
                result["transcript"] = transcript
                return result

            return {
                "threat_type": "unknown",
                "confidence": 0.3,
                "responders": ["trusted_contacts"],
                "brief": "No speech detected in audio.",
                "transcript": "",
            }

        except Exception as e:
            print(f"[classifier] WAV failed: {e}")

    return {
        "threat_type": "unknown",
        "confidence": 0.0,
        "responders": ["trusted_contacts"],
        "brief": "Audio could not be processed.",
        "transcript": "",
    }