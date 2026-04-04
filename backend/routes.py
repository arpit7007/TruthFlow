from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional

from ai_service.llm import call_llm
from ai_service.prompt import (
    build_prompt,
    build_single_question_prompt,
    build_refine_incremental_prompt,
    build_chatbot_system_prompt
)
from ai_service.parser import extract_json
from ai_service.utils import normalize_output

router = APIRouter()




@router.post("/generate-report")
async def generate_report(
#added fallback behaviour to use conversation history as testimony if explicit text is not provided, to make it easier for victims to share their story without needing to write a formal testimony upfront
    text: str = Form(...),
    files: Optional[List[UploadFile]] = File(None)  # ✅ MULTIPLE FILES
):
    """
    Generate the final legal report from user input.
    text, conversation_history, and files are all optional.
    """
    try:
        # ✅ Handle files safely
        file_names = []
        if files:
            for file in files:
                if file and file.filename:
                    file_names.append(file.filename)

        print(text)

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
        
@router.post("/chat")
async def chat_with_bot(
    message: str = Form(...),
    conversation_history: str = Form(default="")
):
    """
    Conversational endpoint for chatbot interaction.
    Uses the chatbot system prompt to have natural dialogue with user.
    Tracks conversation history and implements comfort checks every 5 questions.
    Returns natural language response, not JSON.
    """
    try:
        system_prompt = build_chatbot_system_prompt()
        
        # Count questions in conversation history to check if we need comfort check
        # A simple heuristic: count "bot" messages to estimate question count
        question_count = conversation_history.count("Assistant:") if conversation_history else 0
        
        # Build context with conversation history
        if conversation_history:
            full_prompt = f"{system_prompt}\n\n--- Conversation History ---\n{conversation_history}\n\nUser: {message}\n\nAssistant:"
        else:
            full_prompt = f"{system_prompt}\n\nUser: {message}\n\nAssistant:"
        
        # Call LLM
        raw_output = call_llm(full_prompt)

        return {
            "success": True,
            "message": raw_output,
            "question_count": question_count + 1
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
        
        
