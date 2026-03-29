from fastapi import APIRouter, UploadFile, File, Form
from typing import List

from ai_service.llm import call_llm
from ai_service.prompt import build_prompt
from ai_service.parser import extract_json

router = APIRouter()

@router.post("/generate-report")
async def generate_report(
    text: str = Form(...),
    files: List[UploadFile] = File(default=[])
):
    file_names = [file.filename for file in files]

    prompt = build_prompt(text, file_names)

    raw_output = call_llm(prompt)

    data = extract_json(raw_output)

    if not data:
        return {"error": "Invalid LLM output"}

    return data