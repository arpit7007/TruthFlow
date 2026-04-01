
from fastapi import APIRouter, UploadFile, File, Form
from typing import List

# from ai_service.llm import call_llm
# from ai_service.prompt import build_prompt
# from ai_service.parser import extract_json

router = APIRouter()

@router.post("/generate-report")
async def generate_report(
    text: str = Form(...),
    files: List[UploadFile] = File(default=[])
):

    return {
    "success": "true",
    "data": {
        "summary": "null",
        "timeline": [
            {
                "event": "Felt someone was following",
                "description": "survivor felt like someone was following them while walking home from coaching classes",
                "time": "late evening (around 8 or 9 PM)",
                "location": "street near house",
                "people": [
                    "unknown person"
                ],
                "evidence": [
                    "injury_photo.jpg"
                ]
            },
            {
                "event": "Physical struggle and injury",
                "description": "survivor felt scared and experienced physical struggle, resulting in arm injury",
                "time": "null",
                "location": "narrow lane close to house",
                "people": [
                    "unknown person"
                ],
                "evidence": []
            },
            {
                "event": "Left the scene and went home",
                "description": "survivor managed to leave the area and returned home in pain",
                "time": "null",
                "location": "home",
                "people": [],
                "evidence": []
            },
            {
                "event": "Visited City Hospital",
                "description": "survivor was taken to City Hospital by parents for treatment of arm injury",
                "time": "null",
                "location": "City Hospital",
                "people": [
                    "parents",
                    "doctor"
                ],
                "evidence": [
                    "hospital_report.pdf"
                ]
            }
        ],
        "people": [
            {
                "name": "unknown person"
            },
            {
                "name": "survivor"
            }
        ],
        "locations": [
            {
                "name": "street near house"
            },
            {
                "name": "narrow lane close to house"
            },
            {
                "name": "home"
            },
            {
                "name": "City Hospital"
            }
        ],
        "evidence": [
            {
                "file_name": "injury_photo.jpg",
                "type": "null",
                "linked_event": "Felt someone was following"
            },
            {
                "file_name": "hospital_report.pdf",
                "type": "null",
                "linked_event": "Visited City Hospital"
            }
        ],
        "notes": [
            "Some details are still blurry, but these are the things I remember."
        ]
    }
}