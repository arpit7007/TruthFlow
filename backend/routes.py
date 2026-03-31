from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional

from ai_service.llm import call_llm
from ai_service.prompt import build_prompt
from ai_service.parser import extract_json

router = APIRouter()


@router.post("/generate-report")
async def generate_report(
    text: str = Form(...),
    files: Optional[List[UploadFile]] = File(None)  # ✅ MULTIPLE FILES
):
    try:
        # ✅ Handle files safely
        file_names = []
        if files:
            for file in files:
                if file and file.filename:
                    file_names.append(file.filename)

        # ✅ Build prompt
        prompt = build_prompt(text, file_names)

        # ✅ Call LLM
        raw_output = call_llm(prompt)

        # ✅ Extract JSON
        data = extract_json(raw_output)

        if not data:
            return {
                "success": False,
                "error": "Invalid LLM output",
                "raw": raw_output  # helpful for debugging
            }

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }