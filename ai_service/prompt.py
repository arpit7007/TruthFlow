def build_prompt(text, files):
    file_text = "\n".join([f"{i+1}. {f}" for i, f in enumerate(files)])

    return f"""
You are a legal assistant AI.

Convert the testimony into structured JSON.

Fields:
- summary
- timeline (events with description, time, location, people, evidence)
- people
- locations
- evidence (file_name, type, linked_event)
- notes

IMPORTANT:
- Do NOT skip any detail
- Map files to relevant events
- Return ONLY valid JSON

Testimony:
{text}

Files:
{file_text}
"""