from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Incident
import os
import json

router = APIRouter(prefix="/api/admin", tags=["admin"])

THREAT_WEIGHT = {
    "physical_assault": 1.0,
    "domestic_situation": 0.8,
    "stalking": 0.6,
    "medical_emergency": 0.4,
    "unknown": 0.3,
    "pending": 0.2,
}


@router.get("/heatmap")
def get_heatmap(db: Session = Depends(get_db)):
    incidents = db.query(Incident).all()
    points = [
        {
            "lat": inc.lat,
            "lng": inc.lng,
            "weight": inc.confidence or THREAT_WEIGHT.get(inc.threat_type, 0.5),
            "threat_type": inc.threat_type,
        }
        for inc in incidents
        if inc.lat and inc.lng
    ]
    stats = {
        "total": len(incidents),
        "active": sum(1 for i in incidents if i.status == "active"),
        "resolved": sum(1 for i in incidents if i.status == "resolved"),
        "by_threat": {},
    }
    for inc in incidents:
        stats["by_threat"][inc.threat_type] = stats["by_threat"].get(inc.threat_type, 0) + 1

    return {"points": points, "stats": stats}


@router.post("/incidents/{incident_id}/checkin")
def checkin(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return {"error": "Not found"}
    incident.status = "resolved"
    db.commit()
    return {
        "message": "Check-in recorded. Stay safe.",
        "resources": [
            {"name": "KZ Crisis Hotline", "phone": "150"},
            {"name": "Domestic Violence Helpline", "phone": "8-800-080-84-80"},
            {"name": "Emergency Services", "phone": "112"},
        ],
    }

CRISIS_CENTERS_PATH = os.path.join(os.path.dirname(__file__), "../data/kz_crisis_centers.json")

@router.get("/crisis-centers")
def get_crisis_centers():
    import json, os
    path = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "kz_crisis_centers.json"))
    with open(path, encoding="utf-8") as f:
        centers = json.load(f)
    return {"centers": centers}