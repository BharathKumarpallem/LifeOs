import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from ...models.schemas import (
    Task, TaskCreate, TaskUpdate, CalendarEvent, CalendarEventCreate,
    Reminder, ReminderCreate, Bill, BillCreate, BillPayRequest,
    DocumentItem, DocumentCreate, PaymentRecord, AuditEvent
)
from ...services.data_store import store

router = APIRouter(tags=["Core Life Management"])

# ==================== 1. TASKS ====================
@router.get("/tasks", response_model=List[Task])
def get_tasks(category: Optional[str] = None, priority: Optional[str] = None):
    results = store.tasks
    if category and category != "all":
        results = [t for t in results if t.category == category]
    if priority and priority != "all":
        results = [t for t in results if t.priority == priority]
    return results

@router.post("/tasks", response_model=Task)
def create_task(data: TaskCreate):
    new_task = Task(
        id=f"tsk-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.tasks.insert(0, new_task)
    store.audit_logs.insert(0, AuditEvent(
        id=f"aud-{uuid.uuid4().hex[:8]}",
        action="CREATE_TASK",
        resource=f"Task: {new_task.title}",
        status="COMPLETED"
    ))
    store.save_to_disk()
    return new_task

@router.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, updates: TaskUpdate):
    task = next((t for t in store.tasks if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        if hasattr(task, key) and value is not None:
            setattr(task, key, value)
    task.updatedAt = datetime.utcnow().isoformat()
    store.save_to_disk()
    return task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    idx = next((i for i, t in enumerate(store.tasks) if t.id == task_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Task not found")
    removed = store.tasks.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": task_id, "title": removed.title}

@router.post("/tasks/{task_id}/toggle", response_model=Task)
def toggle_task(task_id: str):
    task = next((t for t in store.tasks if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = "not_started" if task.status == "completed" else "completed"
    task.updatedAt = datetime.utcnow().isoformat()
    store.save_to_disk()
    return task

@router.post("/tasks/{task_id}/subtasks/{subtask_id}/toggle", response_model=Task)
def toggle_subtask(task_id: str, subtask_id: str):
    task = next((t for t in store.tasks if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    sub = next((s for s in task.subtasks if s.id == subtask_id), None)
    if not sub:
        raise HTTPException(status_code=404, detail="Subtask not found")
    sub.completed = not sub.completed
    task.updatedAt = datetime.utcnow().isoformat()
    store.save_to_disk()
    return task

# ==================== 2. CALENDAR ====================
@router.get("/calendar/events", response_model=List[CalendarEvent])
def get_events():
    return store.events

@router.post("/calendar/events", response_model=CalendarEvent)
def create_event(data: CalendarEventCreate):
    # Overlap conflict detection
    conflicts = [
        e for e in store.events
        if e.date == data.date and e.startTime < data.endTime and e.endTime > data.startTime
    ]
    new_event = CalendarEvent(
        id=f"evt-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.events.append(new_event)
    store.save_to_disk()
    return new_event

@router.delete("/calendar/events/{event_id}")
def delete_event(event_id: str):
    idx = next((i for i, e in enumerate(store.events) if e.id == event_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Event not found")
    store.events.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": event_id}

# ==================== 3. REMINDERS ====================
@router.get("/reminders", response_model=List[Reminder])
def get_reminders():
    return store.reminders

@router.post("/reminders", response_model=Reminder)
def create_reminder(data: ReminderCreate):
    new_rem = Reminder(
        id=f"rem-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.reminders.insert(0, new_rem)
    store.save_to_disk()
    return new_rem

@router.post("/reminders/{rem_id}/toggle", response_model=Reminder)
def toggle_reminder(rem_id: str):
    rem = next((r for r in store.reminders if r.id == rem_id), None)
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    rem.isCompleted = not rem.isCompleted
    store.save_to_disk()
    return rem

@router.post("/reminders/{rem_id}/snooze", response_model=Reminder)
def snooze_reminder(rem_id: str, minutes: int = Query(default=15)):
    rem = next((r for r in store.reminders if r.id == rem_id), None)
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    snooze_time = datetime.now() + timedelta(minutes=minutes)
    rem.snoozedUntil = snooze_time.strftime("%Y-%m-%d %H:%M")
    store.save_to_disk()
    return rem

@router.delete("/reminders/{rem_id}")
def delete_reminder(rem_id: str):
    idx = next((i for i, r in enumerate(store.reminders) if r.id == rem_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    store.reminders.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": rem_id}

# ==================== 4. BILLS ====================
@router.get("/bills", response_model=List[Bill])
def get_bills():
    return store.bills

@router.post("/bills", response_model=Bill)
def create_bill(data: BillCreate):
    new_bill = Bill(
        id=f"bil-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.bills.append(new_bill)
    store.save_to_disk()
    return new_bill

@router.post("/bills/{bill_id}/pay", response_model=Bill)
def pay_bill(bill_id: str, payload: BillPayRequest):
    bill = next((b for b in store.bills if b.id == bill_id), None)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    now_str = datetime.now().strftime("%Y-%m-%d")
    bill.paymentStatus = "PAID"
    bill.paidDate = now_str
    bill.paymentHistory.append(PaymentRecord(
        date=now_str,
        amount=bill.amount,
        confirmationRef=payload.confirmationRef or f"REC-{uuid.uuid4().hex[:6].upper()}"
    ))
    store.audit_logs.insert(0, AuditEvent(
        id=f"aud-{uuid.uuid4().hex[:8]}",
        action="CONFIRM_BILL_PAYMENT",
        resource=f"Bill: {bill.name} (${bill.amount:.2f})",
        riskLevel="SENSITIVE_FINANCIAL",
        status="COMPLETED"
    ))
    store.save_to_disk()
    return bill

@router.delete("/bills/{bill_id}")
def delete_bill(bill_id: str):
    idx = next((i for i, b in enumerate(store.bills) if b.id == bill_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Bill not found")
    store.bills.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": bill_id}

# ==================== 5. DOCUMENTS ====================
@router.get("/documents", response_model=List[DocumentItem])
def get_documents():
    return store.documents

@router.post("/documents", response_model=DocumentItem)
def create_document(data: DocumentCreate):
    new_doc = DocumentItem(
        id=f"doc-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.documents.insert(0, new_doc)
    store.save_to_disk()
    return new_doc

@router.delete("/documents/{doc_id}")
def delete_document(doc_id: str):
    idx = next((i for i, d in enumerate(store.documents) if d.id == doc_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Document not found")
    store.documents.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": doc_id}

@router.get("/documents/{doc_id}/download-url")
def get_document_download_url(doc_id: str):
    doc = next((d for d in store.documents if d.id == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    # Generate simulated time-limited signed URL with 15-minute token
    token = uuid.uuid4().hex
    expiry = (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    return {
        "documentId": doc.id,
        "title": doc.title,
        "signedDownloadUrl": f"https://vault.lifeos.internal/download/{doc.id}?token={token}&expires={expiry}",
        "expiresAt": expiry
    }

@router.post("/documents/{doc_id}/scan", response_model=DocumentItem)
def simulate_ai_doc_scan(doc_id: str):
    doc = next((d for d in store.documents if d.id == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.aiExtractedSummary = f"AI Vault Scan Verified: Document '{doc.title}' classified under {doc.category}. Expiry: {doc.expiryDate or 'Not Specified'}. Validated integrity hash."
    store.save_to_disk()
    return doc
