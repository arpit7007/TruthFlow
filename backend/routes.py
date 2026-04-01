from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional

from ai_service.llm import call_llm
from ai_service.prompt import (
    build_prompt,
    build_single_question_prompt,
    build_refine_incremental_prompt
)
from ai_service.parser import extract_json
from ai_service.utils import normalize_output

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
        data = normalize_output(data)

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# enhance report
@router.post("/next-question")
async def next_question(
    text: str = Form(...),
    report: str = Form(...),
    previous_qa: str = Form(default="")
):
    try:
        prompt = build_single_question_prompt(text, report, previous_qa)

        raw_output = call_llm(prompt)
        data = extract_json(raw_output)

        if not data:
            return {
                "success": False,
                "error": "Failed to generate question",
                "raw": raw_output
            }

        return {
            "success": True,
            "question": data.get("question", "")
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    
@router.post("/refine-incremental")
async def refine_incremental(
    text: str = Form(...),
    report: str = Form(...),
    previous_qa: str = Form(...)
):
    try:
        prompt = build_refine_incremental_prompt(text, report, previous_qa)

        raw_output = call_llm(prompt)
        data = extract_json(raw_output)

        if not data:
            return {
                "success": False,
                "error": "Failed to refine report",
                "raw": raw_output
            }

        data = normalize_output(data)

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }