import csv
import os
from database import SessionLocal, engine, Base
from models import Incident
from datetime import datetime, timedelta
import random

Base.metadata.create_all(bind=engine)

CSV_PATH = os.path.join(os.path.dirname(__file__), "../data/incidents_seed.csv")

db = SessionLocal()

existing = db.query(Incident).count()
if existing > 5:
    print(f"Already have {existing} incidents, skipping CSV seed.")
    db.close()
    exit()

with open(CSV_PATH, newline="") as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        incident = Incident(
            lat=float(row["lat"]),
            lng=float(row["lng"]),
            threat_type=row["threat_type"],
            confidence=float(row["weight"]),
            status="resolved",
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            audio_transcript="",
        )
        db.add(incident)

db.commit()
db.close()
print("CSV incidents seeded.")