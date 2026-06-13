from sqlalchemy.orm import Session
from models import TrustedContact, Incident, LocationPoint
from datetime import datetime

notification_log = []

def log_location(incident_id: int, lat: float, lng: float, db: Session):
    point = LocationPoint(
        incident_id=incident_id,
        lat=lat,
        lng=lng,
        timestamp=datetime.utcnow(),
    )
    db.add(point)
    db.commit()
    return point


def notify_contacts(incident: Incident, db: Session) -> list:
    contacts = db.query(TrustedContact).all()
    notifications = []
    for contact in contacts:
        msg = f"SMS sent to {contact.name} ({contact.phone}): SOS at {incident.lat},{incident.lng}"
        print(f"[MOCK] {msg}")
        notification_log.append({"type": "sms", "message": msg, "timestamp": str(datetime.utcnow())})
        notifications.append({"contact": contact.name, "phone": contact.phone, "status": "sent"})
    return notifications


def notify_emergency_services(incident: Incident) -> dict:
    msg = f"112 brief submitted — incident #{incident.id}, threat: {incident.threat_type}, location: {incident.lat},{incident.lng}"
    print(f"[MOCK] {msg}")
    notification_log.append({"type": "112", "message": msg, "timestamp": str(datetime.utcnow())})
    return {"service": "112", "status": "notified", "incident_id": incident.id}


def get_notification_log():
    return notification_log