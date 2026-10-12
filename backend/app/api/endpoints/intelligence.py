import uuid
import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Response
from ...models.schemas import (
    AiChatRequest, AiChatResponse, AutomationRule, ApprovalRequest,
    ApprovalDecisionRequest, NotificationItem, AuditEvent
)
from ...services.ai_service import AIService
from ...services.automation_engine import AutomationEngine
from ...services.data_store import store

router = APIRouter(tags=["Intelligence, Automations & Auditing"])

# ==================== 1. AI ASSISTANT ====================
@router.post("/ai/chat", response_model=AiChatResponse)
async def chat_with_assistant(req: AiChatRequest):
    return await AIService.process_chat(req.prompt, req.provider)

# ==================== 2. AUTOMATIONS & RECIPES ====================
@router.get("/automations", response_model=List[AutomationRule])
def get_automations():
    return store.automations

@router.post("/automations/{rule_id}/toggle", response_model=AutomationRule)
def toggle_automation_rule(rule_id: str):
    rule = next((r for r in store.automations if r.id == rule_id), None)
    if not rule:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    rule.isEnabled = not rule.isEnabled
    store.save_to_disk()
    return rule

@router.post("/automations/{rule_id}/run")
def trigger_automation_now(rule_id: str):
    result = AutomationEngine.evaluate_and_run(rule_id)
    return result

# ==================== 3. HUMAN APPROVAL GATES ====================
@router.get("/approvals", response_model=List[ApprovalRequest])
def get_approvals():
    return store.approvals

@router.post("/approvals/{approval_id}/decision", response_model=ApprovalRequest)
def decide_approval(approval_id: str, decision: ApprovalDecisionRequest):
    appr = next((a for a in store.approvals if a.id == approval_id), None)
    if not appr:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    appr.status = "APPROVED" if decision.approved else "REJECTED"
    appr.decidedAt = now_str
    appr.decisionComments = decision.comments
    
    # Audit log entry
    store.audit_logs.insert(0, AuditEvent(
        id=f"aud-{uuid.uuid4().hex[:8]}",
        actor=store.user.name,
        action=f"APPROVAL_{appr.status}",
        resource=f"Gate: {appr.title}",
        riskLevel=appr.riskLevel,
        status="COMPLETED",
        details=f"Decision recorded: {appr.status}. Notes: {decision.comments or 'None'}"
    ))
    
    store.save_to_disk()
    return appr

# ==================== 4. NOTIFICATIONS ====================
@router.get("/notifications", response_model=List[NotificationItem])
def get_notifications():
    return store.notifications

@router.post("/notifications/{notif_id}/read", response_model=NotificationItem)
def mark_notification_read(notif_id: str):
    notif = next((n for n in store.notifications if n.id == notif_id), None)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.read = True
    store.save_to_disk()
    return notif

@router.delete("/notifications")
def clear_all_notifications():
    store.notifications.clear()
    store.save_to_disk()
    return {"status": "SUCCESS", "message": "All notifications cleared."}

# ==================== 5. AUDIT LOGS ====================
@router.get("/audit/logs", response_model=List[AuditEvent])
def get_audit_logs():
    return store.audit_logs

# ==================== 6. DATA EXPORT & PORTABILITY ====================
@router.get("/export/json")
def export_backup_json():
    data = {
        "user": store.user.model_dump(),
        "tasks": [t.model_dump() for t in store.tasks],
        "events": [e.model_dump() for e in store.events],
        "reminders": [r.model_dump() for r in store.reminders],
        "bills": [b.model_dump() for b in store.bills],
        "documents": [d.model_dump() for d in store.documents],
        "goals": [g.model_dump() for g in store.goals],
        "habits": [h.model_dump() for h in store.habits],
        "learning": [l.model_dump() for l in store.learning],
        "career": [c.model_dump() for c in store.career],
        "family": store.family.model_dump(),
        "automations": [a.model_dump() for a in store.automations],
        "approvals": [ap.model_dump() for ap in store.approvals],
        "notifications": [n.model_dump() for n in store.notifications],
        "audit_logs": [al.model_dump() for al in store.audit_logs]
    }
    json_str = json.dumps(data, indent=2)
    return Response(content=json_str, media_type="application/json")

@router.get("/export/csv")
def export_tasks_csv():
    headers = ["ID", "Title", "Priority", "Status", "Category", "DueDate", "DueTime", "EstimatedDurationMin"]
    rows = [",".join(headers)]
    for t in store.tasks:
        safe_title = f'"{t.title.replace(chr(34), chr(34)+chr(34))}"'
        rows.append(f"{t.id},{safe_title},{t.priority},{t.status},{t.category},{t.dueDate or ''},{t.dueTime or ''},{t.estimatedDurationMin or 0}")
    csv_str = "\n".join(rows)
    return Response(content=csv_str, media_type="text/csv")
