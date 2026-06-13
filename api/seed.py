from database import SessionLocal, engine, Base
from models import TrustedContact

Base.metadata.create_all(bind=engine)

contacts = [
    TrustedContact(name="Aizat Bekova",    phone="+77001112233", email="aizat@example.com"),
    TrustedContact(name="Dana Seitkali",   phone="+77002223344", email="dana@example.com"),
    TrustedContact(name="Kamila Nurova",   phone="+77003334455", email="kamila@example.com"),
    TrustedContact(name="Saltanat Akhmet", phone="+77004445566", email="saltanat@example.com"),
    TrustedContact(name="Zarina Ospanova", phone="+77005556677", email="zarina@example.com"),
]

db = SessionLocal()
db.add_all(contacts)
db.commit()
db.close()
print("Seeded 5 trusted contacts.")