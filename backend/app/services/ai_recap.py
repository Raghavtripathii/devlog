# services/ai_recap.py
from google import genai
from app.config import settings


def generate_weekly_recap(username: str, sessions: list) -> str:
    """
    Reads the week's sessions and asks Gemini to write a short motivating recap.
    If no API key is set, returns a simple fallback summary instead of crashing.
    """
    if not settings.gemini_api_key:
        total = sum(s["hours"] for s in sessions)
        return f"You logged {total} hours across {len(sessions)} sessions this week. Keep it up!"

    if not sessions:
        return "No sessions logged this week. Start coding and check back next week!"

    session_lines = "\n".join(
        f"- {s['language']} for {s['hours']}h: {s['what_i_built']} (mood: {s['mood']}/5)"
        for s in sessions
    )
    total_hours = sum(s["hours"] for s in sessions)

    prompt = f"""
You are a supportive senior developer giving a weekly recap to {username}.
They logged {total_hours} hours this week across {len(sessions)} sessions:
{session_lines}
Write a 3-4 sentence personal recap. Be genuine and specific to what they built.
Mention their most-used language. End with one concrete piece of encouragement.
Don't use bullet points. Write like you're talking to a friend.
"""

    client = genai.Client(api_key=settings.gemini_api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )
    return response.text.strip()