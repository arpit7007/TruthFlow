def build_prompt(text, files):
    file_text = "\n".join([f"{i+1}. {f}" for i, f in enumerate(files)])

    return f"""
You are a strict JSON generator.

Return ONLY valid JSON matching EXACTLY this schema:

{{
  "summary": "string or null",
  "timeline": [
    {{
      "event": "string",
      "description": "string",
      "time": "string or null",
      "location": "string",
      "people": ["string"],
      "evidence": ["string"]
    }}
  ],
  "people": [
    {{
      "name": "string",
      "role": "string or null"
    }}
  ],
  "locations": [
    {{
      "location": "string",
      "relevant_event": "string"
    }}
  ],
  "evidence": [
    {{
      "file_name": "string",
      "type": "string or null",
      "linked_event": "string"
    }}
  ],
  "notes": "string or null"
}}

STRICT RULES:
- Return ONLY JSON
- No explanation
- No missing fields

IMPORTANT:
- Use "Survivor" instead of "I" or "witness"
- timeline.evidence must be array of file names only
- evidence section contains detailed objects
- linked_event must be descriptive text, not number
- do not return empty strings, use null instead
- Do NOT skip any detail
- Map files to relevant events

Testimony:
{text}

Files:
{file_text}
"""

def build_single_question_prompt(text, current_report, previous_qa=""):
    return f"""
You are an intelligent legal assistant.

Your task is to ask ONE next best question to improve the report.

RULES:
- Ask ONLY ONE question
- Do NOT repeat previous questions
- Focus on missing or unclear details
- Keep question simple and relevant
- If no more questions needed, return: "DONE"

Previous Q&A:
{previous_qa}

Testimony:
{text}

Current Report:
{current_report}

Return ONLY JSON:

{{
  "question": "your question here"
}}
"""

def build_refine_incremental_prompt(text, current_report, previous_qa):
    return f"""
You are a strict JSON generator.

Update the EXISTING structured report.

Return ONLY valid JSON matching EXACTLY this schema:

{{
  "summary": "string or null",
  "timeline": [
    {{
      "event": "string",
      "description": "string",
      "time": "string or null",
      "location": "string",
      "people": ["string"],
      "evidence": ["string"]
    }}
  ],
  "people": [
    {{
      "name": "string",
      "role": "string or null"
    }}
  ],
  "locations": [
    {{
      "location": "string",
      "relevant_event": "string"
    }}
  ],
  "evidence": [
    {{
      "file_name": "string",
      "type": "string or null",
      "linked_event": "string"
    }}
  ],
  "notes": "string or null"
}}

STRICT RULES:
- DO NOT change structure
- DO NOT remove fields
- Only update values
- Preserve existing data
- Merge new answers into report

Current Report:
{current_report}

New Q&A:
{previous_qa}

Original Testimony:
{text}
"""