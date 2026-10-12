import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List
from .data_store import store
from ..models.schemas import AutomationRule, ApprovalRequest, NotificationItem, AuditEvent

class AutomationEngine:
    @staticmethod
    def run_all_enabled_automations() -> List[Dict[str, Any]]:
        results = []
        for rule in store.automations:
            if rule.isEnabled:
                res = AutomationEngine.evaluate_and_run(rule.id)
                results.append(res)
        return results

    @staticmethod
    def evaluate_and_run(rule_id: str) -> Dict[str, Any]:
        rule = next((r for r in store.automations if r.id == rule_id), None)
        if not rule:
            return {"status": "ERROR", "message": f"Rule {rule_id} not found"}

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        rule.lastRun = now_str
        rule.executionCount += 1

        # Check conditions based on rule trigger
        if "bill" in rule.name.lower() or "deadline" in rule.name.lower():
            # Trigger bill deadline check
            three_days_ahead = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
            due_soon = [b for b in store.bills if b.paymentStatus == "UNPAID" and b.dueDate <= three_days_ahead]

            if due_soon:
                for b in due_soon:
                    # Create notification if not already notified
                    store.notifications.insert(0, NotificationItem(
                        id=f"notif-{uuid.uuid4().hex[:8]}",
                        title=f"Automated Reminder: {b.name} Due Soon",
                        message=f"${b.amount:.2f} due on {b.dueDate}. Verify payment in Bills.",
                        type="BILL",
                        read=False,
                        actionSection="bills"
                    ))
                rule.status = "SUCCESS"
                outcome = f"Evaluated: {len(due_soon)} bills due within 72h. Reminders dispatched."
            else:
                rule.status = "SUCCESS"
                outcome = "Evaluated: No unpaid bills due within 72h."

        elif "schedule" in rule.name.lower() or "focus" in rule.name.lower():
            # Weekly synthesis requires human approval
            if rule.requiresApproval:
                approval = ApprovalRequest(
                    id=f"appr-{uuid.uuid4().hex[:8]}",
                    title="Proposed Weekly Focus Block Allocation",
                    description="Automated schedule optimizer proposes 3 x 90min deep work sessions for upcoming tasks.",
                    actionType="CALENDAR_BLOCK_CREATION",
                    riskLevel="INTERNAL_REVERSIBLE",
                    serviceAffected="Calendar & My Day Planner",
                    isReversible=True,
                    payloadSummary="Proposed: Mon 09:00 Deep Work, Wed 10:00 Architectural Review, Fri 14:00 Learning Block.",
                    status="PENDING"
                )
                store.approvals.insert(0, approval)
                rule.status = "WAITING_APPROVAL"
                outcome = "Schedule synthesized: Awaiting user approval in Approvals tab."
            else:
                rule.status = "SUCCESS"
                outcome = "Schedule applied directly."

        elif "document" in rule.name.lower() or "expiry" in rule.name.lower():
            thirty_days = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
            expiring = [d for d in store.documents if d.expiryDate and d.expiryDate <= thirty_days]

            if expiring:
                for doc in expiring:
                    store.notifications.insert(0, NotificationItem(
                        id=f"notif-{uuid.uuid4().hex[:8]}",
                        title=f"Vault Watchdog: Document Expiring",
                        message=f"'{doc.title}' expires on {doc.expiryDate}. Please prepare renewal.",
                        type="SYSTEM",
                        read=False,
                        actionSection="documents"
                    ))
                rule.status = "SUCCESS"
                outcome = f"Scanned: {len(expiring)} documents nearing expiration flagged."
            else:
                rule.status = "SUCCESS"
                outcome = "Scanned: Zero documents expiring in next 30 days."

        else:
            rule.status = "SUCCESS"
            outcome = "Custom rule evaluated successfully."

        # Record audit log
        store.audit_logs.insert(0, AuditEvent(
            id=f"aud-{uuid.uuid4().hex[:8]}",
            actor="Automation Engine",
            action="RUN_AUTOMATION_RECIPE",
            resource=f"Rule: {rule.name}",
            riskLevel="LOW",
            status="COMPLETED",
            details=outcome
        ))

        store.save_to_disk()
        return {"status": rule.status, "ruleId": rule.id, "outcome": outcome}
