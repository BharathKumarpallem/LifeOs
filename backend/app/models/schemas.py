from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

# Common / Base
class HealthCheckResponse(BaseModel):
    status: str
    version: str
    timestamp: str

# 1. User & Profile
class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    avatarUrl: Optional[str] = None
    timeZone: str = "America/New_York (UTC-5)"
    preferredLanguage: str = "English (US)"
    dateFormat: str = "YYYY-MM-DD"
    theme: str = "dark"
    onboardingCompleted: bool = True
    enabledModules: List[str] = [
        "overview", "my-day", "tasks", "calendar", "reminders",
        "bills", "documents", "goals-habits", "learning", "career",
        "family", "ai-assistant", "automations", "notifications", "settings"
    ]
    aiProvider: str = "mock_intelligent"
    apiKeyConfigured: bool = False

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    timeZone: Optional[str] = None
    preferredLanguage: Optional[str] = None
    dateFormat: Optional[str] = None
    theme: Optional[str] = None
    aiProvider: Optional[str] = None

# 2. Tasks & Subtasks
class Subtask(BaseModel):
    id: str
    title: str
    completed: bool = False

class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    dueDate: Optional[str] = None
    dueTime: Optional[str] = None
    priority: str = "medium" # low, medium, high, critical
    category: str = "work" # personal, work, health, finance, learning, family
    status: str = "not_started" # not_started, in_progress, completed, archived
    estimatedDurationMin: Optional[int] = 30
    tags: List[str] = Field(default_factory=list)
    subtasks: List[Subtask] = Field(default_factory=list)
    recurringSchedule: Optional[str] = "none" # none, daily, weekly, monthly
    reminderTime: Optional[str] = None
    relatedDocumentId: Optional[str] = None
    relatedGoalId: Optional[str] = None
    familyAssigneeId: Optional[str] = None
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    dueDate: Optional[str] = None
    dueTime: Optional[str] = None
    priority: str = "medium"
    category: str = "work"
    status: str = "not_started"
    estimatedDurationMin: Optional[int] = 30
    tags: List[str] = Field(default_factory=list)
    subtasks: List[Subtask] = Field(default_factory=list)
    recurringSchedule: Optional[str] = "none"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    dueDate: Optional[str] = None
    dueTime: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    estimatedDurationMin: Optional[int] = None
    tags: Optional[List[str]] = None
    subtasks: Optional[List[Subtask]] = None
    recurringSchedule: Optional[str] = None

# 3. Calendar & Appointments
class CalendarEvent(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    date: str # YYYY-MM-DD
    startTime: str # HH:mm
    endTime: str # HH:mm
    timeZone: str = "EST"
    location: Optional[str] = None
    isOnlineMeeting: bool = False
    meetingLink: Optional[str] = None
    category: str = "professional" # personal, medical, education, professional, family
    relatedContacts: List[str] = Field(default_factory=list)
    reminderMinutesBefore: int = 30
    isRecurring: bool = False
    recurrenceRule: Optional[str] = None

class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: str
    startTime: str
    endTime: str
    timeZone: str = "EST"
    location: Optional[str] = None
    isOnlineMeeting: bool = False
    meetingLink: Optional[str] = None
    category: str = "professional"
    reminderMinutesBefore: int = 30

# 4. Reminders
class Reminder(BaseModel):
    id: str
    title: str
    notes: Optional[str] = None
    dueDate: str # YYYY-MM-DD
    dueTime: str = "09:00"
    recurrence: str = "none" # none, daily, weekly, monthly
    priority: str = "medium"
    category: str = "General"
    isCompleted: bool = False
    snoozedUntil: Optional[str] = None

class ReminderCreate(BaseModel):
    title: str
    notes: Optional[str] = None
    dueDate: str
    dueTime: str = "09:00"
    recurrence: str = "none"
    priority: str = "medium"
    category: str = "General"

# 5. Bills & Obligations
class PaymentRecord(BaseModel):
    date: str
    amount: float
    confirmationRef: Optional[str] = None

class Bill(BaseModel):
    id: str
    name: str
    category: str = "utilities"
    amount: float
    currency: str = "USD"
    dueDate: str # YYYY-MM-DD
    recurringInterval: str = "monthly"
    paymentStatus: str = "UNPAID" # UNPAID, PAID, OVERDUE
    reminderDaysBefore: int = 3
    payee: Optional[str] = None
    notes: Optional[str] = None
    paidDate: Optional[str] = None
    paymentHistory: List[PaymentRecord] = Field(default_factory=list)

class BillCreate(BaseModel):
    name: str
    category: str = "utilities"
    amount: float
    currency: str = "USD"
    dueDate: str
    recurringInterval: str = "monthly"
    reminderDaysBefore: int = 3
    payee: Optional[str] = None
    notes: Optional[str] = None

class BillPayRequest(BaseModel):
    confirmationRef: Optional[str] = None

# 6. Documents Vault
class DocumentItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: str = "personal"
    tags: List[str] = Field(default_factory=list)
    issueDate: Optional[str] = None
    expiryDate: Optional[str] = None
    fileSizeKb: int = 0
    fileType: str = "application/pdf"
    fileUrl: Optional[str] = None
    isPrivate: bool = True
    aiExtractedSummary: Optional[str] = None
    uploadedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class DocumentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "personal"
    tags: List[str] = Field(default_factory=list)
    issueDate: Optional[str] = None
    expiryDate: Optional[str] = None
    fileSizeKb: int = 250
    fileType: str = "application/pdf"
    isPrivate: bool = True

# 7. Goals & Habits
class GoalMilestone(BaseModel):
    id: str
    title: str
    completed: bool = False
    dueDate: Optional[str] = None

class Goal(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: str = "career"
    startDate: str
    targetDate: str
    milestones: List[GoalMilestone] = Field(default_factory=list)
    progressPercent: int = 0
    status: str = "IN_PROGRESS" # NOT_STARTED, IN_PROGRESS, COMPLETED
    notes: Optional[str] = None
    relatedTaskIds: List[str] = Field(default_factory=list)

class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "career"
    startDate: Optional[str] = None
    targetDate: str
    milestones: List[GoalMilestone] = Field(default_factory=list)

class Habit(BaseModel):
    id: str
    title: str
    category: str = "Mindfulness"
    frequency: str = "daily"
    targetDaysPerWeek: int = 7
    currentStreak: int = 0
    bestStreak: int = 0
    checkins: List[str] = Field(default_factory=list) # YYYY-MM-DD
    isPaused: bool = False
    reminderTime: Optional[str] = None

class HabitCreate(BaseModel):
    title: str
    category: str = "Mindfulness"
    frequency: str = "daily"
    targetDaysPerWeek: int = 7

# 8. Learning
class StudyPlanItem(BaseModel):
    id: str
    topic: str
    durationMin: int = 45
    scheduledDate: str
    completed: bool = False

class LearningItem(BaseModel):
    id: str
    title: str
    category: str = "Computer Science"
    provider: Optional[str] = None
    progressPercent: int = 0
    notes: Optional[str] = None
    resources: List[Dict[str, str]] = Field(default_factory=list)
    studyPlan: List[StudyPlanItem] = Field(default_factory=list)
    completed: bool = False

class LearningCreate(BaseModel):
    title: str
    category: str = "Computer Science"
    provider: Optional[str] = None
    notes: Optional[str] = None
    resources: List[Dict[str, str]] = Field(default_factory=list)
    studyPlan: List[StudyPlanItem] = Field(default_factory=list)

# 9. Career
class CareerApplication(BaseModel):
    id: str
    company: str
    role: str
    jobPostingUrl: Optional[str] = None
    salaryExpectation: Optional[str] = None
    applicationDate: str
    status: str = "APPLIED" # SAVED, PLANNED, APPLIED, INTERVIEWING, OFFER, REJECTED, WITHDRAWN
    contactName: Optional[str] = None
    contactEmail: Optional[str] = None
    interviewDate: Optional[str] = None
    interviewNotes: Optional[str] = None
    followUpDate: Optional[str] = None
    notes: Optional[str] = None
    resumeDocId: Optional[str] = None

class CareerCreate(BaseModel):
    company: str
    role: str
    jobPostingUrl: Optional[str] = None
    salaryExpectation: Optional[str] = None
    applicationDate: Optional[str] = None
    status: str = "APPLIED"
    contactName: Optional[str] = None
    interviewDate: Optional[str] = None
    notes: Optional[str] = None

# 10. Family
class FamilyMember(BaseModel):
    id: str
    name: str
    email: str
    role: str = "MEMBER" # ADMIN, MEMBER, CHILD
    avatar: Optional[str] = None

class SharedShoppingItem(BaseModel):
    id: str
    name: str
    quantity: Optional[str] = None
    completed: bool = False
    addedBy: str = "Alex Morgan"

class FamilyGroup(BaseModel):
    id: str
    name: str
    members: List[FamilyMember] = Field(default_factory=list)
    sharedShoppingList: List[SharedShoppingItem] = Field(default_factory=list)

class FamilyInviteCreate(BaseModel):
    name: str
    email: str
    role: str = "MEMBER"

class ShoppingItemCreate(BaseModel):
    name: str
    quantity: Optional[str] = None

# 11. Automations & Approvals
class AutomationRule(BaseModel):
    id: str
    name: str
    description: str
    trigger: str
    condition: str
    proposedAction: str
    requiresApproval: bool = False
    isEnabled: bool = True
    lastRun: Optional[str] = None
    executionCount: int = 0
    status: str = "IDLE" # IDLE, SUCCESS, WAITING_APPROVAL, FAILED
    errorLog: Optional[str] = None

class ApprovalRequest(BaseModel):
    id: str
    title: str
    description: str
    actionType: str
    riskLevel: str # READ_ONLY, INTERNAL_REVERSIBLE, EXTERNAL, SENSITIVE_FINANCIAL
    serviceAffected: str
    isReversible: bool = True
    payloadSummary: str
    status: str = "PENDING" # PENDING, APPROVED, REJECTED
    requestedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    decidedAt: Optional[str] = None
    decisionComments: Optional[str] = None

class ApprovalDecisionRequest(BaseModel):
    approved: bool
    comments: Optional[str] = None

# 12. Notifications & Audit
class NotificationItem(BaseModel):
    id: str
    title: str
    message: str
    type: str = "SYSTEM" # TASK, BILL, CALENDAR, HABIT, SYSTEM, APPROVAL, FAMILY
    read: bool = False
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    actionSection: Optional[str] = None

class AuditEvent(BaseModel):
    id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    actor: str = "Alex Morgan"
    action: str
    resource: str
    riskLevel: str = "LOW"
    status: str = "COMPLETED" # PROPOSED, APPROVED, REJECTED, COMPLETED, FAILED
    details: Optional[str] = None

# 13. AI Assistant
class AiChatMessage(BaseModel):
    id: str
    sender: str # user, assistant, system
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    suggestedAction: Optional[Dict[str, Any]] = None

class AiChatRequest(BaseModel):
    prompt: str
    conversationId: Optional[str] = None
    provider: Optional[str] = None # mock_intelligent, openai, anthropic
    includeContext: bool = True

class AiChatResponse(BaseModel):
    message: AiChatMessage
    contextRetrieved: Dict[str, int]
    providerUsed: str
