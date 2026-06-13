from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Incident, LocationPoint
from schemas import SOSTriggerRequest, SOSTriggerResponse
from services.classifier import classify_audio, classify_transcript
from services.coordinator import notify_contacts, notify_emergency_services, log_location, get_notification_log
from pydantic import BaseModel

router = APIRouter(prefix="/api/sos", tags=["sos"])


class CoordinateRequest(BaseModel):
    incident_id: int
    lat: float
    lng: float


class LocationRequest(BaseModel):
    incident_id: int
    lat: float
    lng: float


@router.post("/trigger", response_model=SOSTriggerResponse)
def trigger_sos(payload: SOSTriggerRequest, db: Session = Depends(get_db)):
    incident = Incident(
        threat_type="pending",
        confidence=0.0,
        lat=payload.lat,
        lng=payload.lng,
        status="active",
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    notify_contacts(incident, db)
    notify_emergency_services(incident)
    return SOSTriggerResponse(
        incident_id=incident.id,
        status="active",
        message="SOS received. Notifying contacts.",
    )


@router.post("/classify-audio")
async def classify_audio_endpoint(
    incident_id: int = Form(...),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    audio_bytes = await audio.read()
    if len(audio_bytes) < 500:
        raise HTTPException(status_code=400, detail="Audio too short")
    result = classify_audio(audio_bytes)
    incident.threat_type = result["threat_type"]
    incident.confidence = result.get("confidence", 0.5)
    incident.audio_transcript = result.get("transcript", "")
    db.commit()
    return {
        "incident_id": incident_id,
        "threat_type": result["threat_type"],
        "confidence": result["confidence"],
        "responders": result["responders"],
        "brief": result["brief"],
        "transcript": result.get("transcript", ""),
    }


@router.post("/coordinate")
def coordinate(payload: CoordinateRequest, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == payload.incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    log_location(payload.incident_id, payload.lat, payload.lng, db)
    return {
        "incident_id": payload.incident_id,
        "status": "updated",
        "notifications": get_notification_log()[-5:],
    }


@router.post("/location")
def update_location(payload: LocationRequest, db: Session = Depends(get_db)):
    log_location(payload.incident_id, payload.lat, payload.lng, db)
    return {"status": "logged"}


@router.get("/notifications")
def get_notifications():
    return {"notifications": get_notification_log()}