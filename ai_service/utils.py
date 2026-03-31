def normalize_output(data):
    if not data:
        return None

    # Fix summary
    data["summary"] = data.get("summary") or None

    # Fix timeline
    for event in data.get("timeline", []):
        event["time"] = event.get("time") or None

        # Ensure evidence is list of strings
        if isinstance(event.get("evidence"), list):
            event["evidence"] = [
                e["file_name"] if isinstance(e, dict) else e
                for e in event["evidence"]
            ]

    # Fix people
    for person in data.get("people", []):
        if isinstance(person, dict):
            person["role"] = person.get("role") or None

    # Fix evidence
    for ev in data.get("evidence", []):
        ev["type"] = ev.get("type") or None
        ev["linked_event"] = ev.get("linked_event") or None

    # Fix notes
    data["notes"] = data.get("notes") or None

    return data