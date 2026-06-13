from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.groq_client import client
import json
import os

def _load_legal_resources():
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "kz_legal_resources.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

LEGAL_RESOURCES = _load_legal_resources()

def _format_legal_for_prompt(resources):
    lines = []
    for r in resources:
        phone_part = f" | Phone: {r['phone']}" if r.get("phone") else ""
        lines.append(f"- [{r['type']}/{r['topic']}/{r['city']}] {r['name']}: {r['description']}{phone_part}")
    return "\n".join(lines)

def _load_crisis_centers():
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "kz_crisis_centers.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

CRISIS_CENTERS = _load_crisis_centers()

def _format_centers_for_prompt(centers):
    lines = []
    for c in centers:
        lines.append(f"- {c['name']} ({c['city']}) | Phone: {c['phone']}")
    return "\n".join(lines)

router = APIRouter(prefix="/api/chat", tags=["chat"])

RESOURCE_SYSTEM_PROMPT = f"""You are SafeHer, a women's safety resource assistant for Kazakhstan.

You have access to this list of crisis centers for reference:
{_format_centers_for_prompt(CRISIS_CENTERS)}

You also have access to this list of legal resources and law summaries:
{_format_legal_for_prompt(LEGAL_RESOURCES)}

Guidelines:
- Only recommend a specific center or legal resource if the user clearly needs one — e.g. they ask about their rights, harassment, divorce, domestic violence, or a hotline.
- If the user's message is vague (e.g. "I would like to report a concern" with no details), first ask what kind of concern it is or what city they're in, rather than immediately giving info.
- For general questions, greetings, or follow-ups that don't require a referral, respond naturally without mentioning any resource.
- Never repeat the same recommendation if you already gave it earlier in the conversation, unless the user asks again.
- When citing law summaries, paraphrase in plain language — don't quote legal text verbatim.
- When discussing domestic violence law, note that the legal framework changed in late 2025 (the standalone domestic violence law was merged into a broader crime prevention law), but protections like protective orders and criminal penalties for assault still exist.
- If asked for specifics beyond what's in the resource list, recommend the user consult a crisis center or legal aid organization directly, as laws and procedures may continue to evolve.
- Keep answers under 5 sentences.
- If the user mentions a specific city, only recommend centers/resources relevant to that city (or national ones).
- Never ask the user to unlock their phone, speak aloud, or do anything that could draw attention to them if they're in danger.
- Never ask for personal details (name, exact address, etc.).
- Respond in Russian, Kazakh, or English depending on the user's message language."""

EMERGENCY_SYSTEM_PROMPT = """You are SafeHer emergency assistant. The user is in active danger and typing silently.
Give only short, actionable instructions.
Never ask them to speak, make noise, unlock their phone, or draw attention to themselves.
Prioritize: stay safe, confirm location, signal for help discreetly."""


class ChatRequest(BaseModel):
    message: str
    mode: str = "resources"
    incident_id: Optional[int] = None
    history: list = []

@router.post("")
def chat(payload: ChatRequest):
    system_prompt = EMERGENCY_SYSTEM_PROMPT if payload.mode == "emergency" else RESOURCE_SYSTEM_PROMPT

    messages = [{"role": "system", "content": system_prompt}]
    for h in payload.history[-6:]:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": payload.message})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.4,
        max_tokens=200,
    )

    return {"reply": response.choices[0].message.content.strip()}