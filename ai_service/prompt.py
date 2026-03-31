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
- Use "survivor" instead of "I" or "witness"
- timeline.evidence must be array of file names only
- evidence section contains detailed objects
- linked_event must be descriptive text, not number
- do not return empty strings, use null instead
- Do NOT skip any detail
- Map files to relevant events
- Return ONLY valid JSON

Testimony:
{text}

Files:
{file_text}
"""