from pydantic import BaseModel
from typing import Optional

class SOSTriggerRequest(BaseModel):
    lat: float
    lng: float
    trigger_type: str

class SOSTriggerResponse(BaseModel):
    incident_id: int
    status: str
    message: str