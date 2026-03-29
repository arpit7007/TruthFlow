from pydantic import BaseModel
from typing import List, Optional

class Evidence(BaseModel):
    file_name: str
    type: str
    linked_event: Optional[str]

class Event(BaseModel):
    description: str
    time: Optional[str]
    location: Optional[str]
    people: List[str]
    evidence: List[str]

class Report(BaseModel):
    summary: str
    timeline: List[Event]
    people: List[str]
    locations: List[str]
    evidence: List[Evidence]
    notes: Optional[str]