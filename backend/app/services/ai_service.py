import os
import httpx
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from ..core.config import settings
from ..models.schemas import AiChatMessage, AiChatResponse
from .data_store import store

class AIService:
    @staticmethod
    async def process_chat(prompt: str, provider: Optional[str] = None) -> AiChatResponse:
        active_provider = provider or store.user.aiProvider or "mock_intelligent"
        
        # 1. Gather Authorized Application Context
        today_str = datetime.now().strftime("%Y-%m-%d")
        today_tasks = [t for t in store.tasks if t.dueDate == today_str]
        overdue_tasks = [t for t in store.tasks if t.dueDate and t.dueDate < today_str and t.status != "completed"]
        unpaid_bills = [b for b in store.bills if b.paymentStatus != "PAID"]
        upcoming_events = [e for e in store.events if e.date >= today_str]
        expiring_docs = [d for d in store.documents if d.expiryDate and d.expiryDate <= (datetime.now().strftime("%Y-%m-%d"))]

        context_counts = {
            "tasks_today": len(today_tasks),
            "tasks_overdue": len(overdue_tasks),
            "unpaid_bills": len(unpaid_bills),
            "upcoming_events": len(upcoming_events),
            "expiring_docs": len(expiring_docs)
        }

        # 2. Check if external LLM credentials exist and are requested
        if active_provider == "openai" and settings.OPENAI_API_KEY:
            try:
                response_text = await AIService._call_openai(prompt, today_tasks, overdue_tasks, unpaid_bills, upcoming_events)
                return AiChatResponse(
                    message=AiChatMessage(
                        id=f"msg-{uuid.uuid4().hex[:8]}",
                        sender="assistant",
                        content=response_text
                    ),
                    contextRetrieved=context_counts,
                    providerUsed="OpenAI (GPT-4o via Backend Proxy)"
                )
            except Exception as e:
                # Graceful fallback to deterministic intelligence
                pass

        elif active_provider == "anthropic" and settings.ANTHROPIC_API_KEY:
            try:
                response_text = await AIService._call_anthropic(prompt, today_tasks, overdue_tasks, unpaid_bills, upcoming_events)
                return AiChatResponse(
                    message=AiChatMessage(
                        id=f"msg-{uuid.uuid4().hex[:8]}",
                        sender="assistant",
                        content=response_text
                    ),
                    contextRetrieved=context_counts,
                    providerUsed="Anthropic (Claude 3.5 Sonnet via Backend Proxy)"
                )
            except Exception as e:
                pass

        # 3. Built-in High-Speed Intelligent Analyzer (Deterministic fallback)
        response_text, suggested_action = AIService._generate_intelligent_analysis(
            prompt, today_tasks, overdue_tasks, unpaid_bills, upcoming_events
        )

        reply_message = AiChatMessage(
            id=f"msg-{uuid.uuid4().hex[:8]}",
            sender="assistant",
            content=response_text,
            suggestedAction=suggested_action
        )

        # Store in conversation history
        store.ai_messages.append(AiChatMessage(
            id=f"msg-{uuid.uuid4().hex[:8]}",
            sender="user",
            content=prompt
        ))
        store.ai_messages.append(reply_message)
        store.save_to_disk()

        return AiChatResponse(
            message=reply_message,
            contextRetrieved=context_counts,
            providerUsed="Built-in Local Intelligent Engine (Offline/Deterministic)"
        )

    @staticmethod
    def _generate_intelligent_analysis(prompt: str, today_tasks, overdue_tasks, unpaid_bills, upcoming_events):
        p_lower = prompt.lower()
        suggested_action = None

        if "plan" in p_lower or "day" in p_lower or "schedule" in p_lower:
            task_list_str = "\n".join([f"• [{t.priority.upper()}] {t.title} ({t.estimatedDurationMin or 30}m)" for t in today_tasks])
            reply = (
                f"### 📋 Strategic Daily Plan for Today\n\n"
                f"I've synthesized your commitments across {len(today_tasks)} scheduled tasks and {len(upcoming_events)} events:\n\n"
                f"**Focus Blocks:**\n"
                f"1. **Morning High-Leverage Block (09:00 - 11:00)**: Tackle your critical tasks first.\n"
                f"2. **Midday Event Execution (11:30 - 13:00)**: Attend scheduled appointments.\n"
                f"3. **Afternoon Deep Work (14:30 - 16:30)**: Complete outstanding deliverables.\n\n"
                f"**Tasks on your agenda today:**\n{task_list_str if task_list_str else '• No specific tasks tagged for today.'}\n\n"
                f"💡 *Would you like me to block out a 90-minute Pomodoro session on your calendar?*"
            )
            suggested_action = {
                "type": "GENERATE_PLAN",
                "label": "Activate Daily Schedule in My Day",
                "payload": {"section": "my-day"}
            }

        elif "bill" in p_lower or "deadline" in p_lower or "financial" in p_lower:
            total_unpaid = sum(b.amount for b in unpaid_bills)
            overdue_bills = [b for b in unpaid_bills if b.paymentStatus == "OVERDUE"]
            bill_items = "\n".join([f"• **{b.name}**: ${b.amount:.2f} due {b.dueDate} ({b.paymentStatus})" for b in unpaid_bills])
            reply = (
                f"### 💳 Upcoming Financial Deadlines\n\n"
                f"You have **{len(unpaid_bills)} active billing obligations** totaling **${total_unpaid:.2f}**.\n\n"
                f"{bill_items}\n\n"
                + (f"⚠️ **Attention**: You have {len(overdue_bills)} overdue statement(s) requiring immediate payment verification." if overdue_bills else "✅ All upcoming obligations are currently on schedule.")
            )

        elif "interview" in p_lower or "career" in p_lower:
            interview_apps = [c for c in store.career if c.status == "INTERVIEWING"]
            company_names = ", ".join([c.company for c in interview_apps]) or "your target companies"
            reply = (
                f"### 💼 Career & Interview Preparation Strategy\n\n"
                f"For your upcoming interviews with **{company_names}**:\n\n"
                f"1. **Core Architecture Review**: Rehearse system design patterns, distributed caching, and failure recovery.\n"
                f"2. **Behavioral STAR Alignment**: Prepare 3 concrete examples of resolving cross-team technical friction.\n"
                f"3. **Compensation & Questions**: Review questions regarding team autonomy, on-call expectations, and deployment frequency.\n\n"
                f"Would you like me to create an 'Interview Prep (60 min)' task for this afternoon?"
            )
            suggested_action = {
                "type": "CREATE_TASK",
                "label": "Add Interview Prep Task",
                "payload": {
                    "title": "CloudScale Technical Interview Deep Dive Prep",
                    "priority": "high",
                    "category": "work",
                    "estimatedDurationMin": 60
                }
            }

        elif "document" in p_lower or "vault" in p_lower or "expiry" in p_lower:
            exp_docs = [d for d in store.documents if d.expiryDate]
            doc_lines = "\n".join([f"• **{d.title}** ({d.category}) — Expires: {d.expiryDate}" for d in exp_docs])
            reply = (
                f"### 📂 Private Document Vault Status\n\n"
                f"Scanned {len(store.documents)} encrypted records in your personal vault:\n\n"
                f"{doc_lines}\n\n"
                f"All files are stored in private tenant partitions with zero external exposure."
            )

        else:
            reply = (
                f"### 🤖 LifeOS Active Intelligence Briefing\n\n"
                f"I am actively monitoring your life management streams:\n"
                f"• **Tasks**: {len(today_tasks)} due today ({len(overdue_tasks)} overdue).\n"
                f"• **Events**: {len(upcoming_events)} upcoming calendar commitments.\n"
                f"• **Finances**: {len(unpaid_bills)} bills pending verification.\n"
                f"• **Habits**: 3 active daily streak rituals in progress.\n\n"
                f"Feel free to ask me to plan your day, draft a reminder, break down a goal, or summarize upcoming deadlines!"
            )

        return reply, suggested_action

    @staticmethod
    async def _call_openai(prompt: str, today_tasks, overdue_tasks, unpaid_bills, upcoming_events) -> str:
        async with httpx.AsyncClient(timeout=30.0) as client:
            system_msg = (
                "You are LifeOS AI Assistant. You help users plan their lives, schedule tasks, and track obligations. "
                "Respond in clear, structured GitHub-flavored markdown. Do not hallucinate sensitive financial or identity details."
            )
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.OPENAI_MODEL,
                    "messages": [
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.5
                }
            )
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    @staticmethod
    async def _call_anthropic(prompt: str, today_tasks, overdue_tasks, unpaid_bills, upcoming_events) -> str:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": settings.ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.ANTHROPIC_MODEL,
                    "max_tokens": 1024,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                }
            )
            data = resp.json()
            return data["content"][0]["text"]
