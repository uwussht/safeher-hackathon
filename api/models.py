from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    threat_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    audio_transcript = Column(Text, nullable=True)

    location_points = relationship("LocationPoint", back_populates="incident")


class TrustedContact(Base):
    __tablename__ = "trusted_contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)


class LocationPoint(Base):
    __tablename__ = "location_points"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    incident = relationship("Incident", back_populates="location_points")