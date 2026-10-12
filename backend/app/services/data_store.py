import os
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from ..models.schemas import (
    UserProfile, Task, CalendarEvent, Reminder, Bill, DocumentItem,
    Goal, Habit, LearningItem, CareerApplication, FamilyGroup,
    AutomationRule, ApprovalRequest, NotificationItem, AuditEvent,
    AiChatMessage, PaymentRecord, Subtask, GoalMilestone, StudyPlanItem,
    FamilyMember, SharedShoppingItem
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
DB_FILE = os.path.join(DATA_DIR, "lifeos_db.json")

def relative_date(offset_days: int) -> str:
    d = datetime.now() + timedelta(days=offset_days)
    return d.strftime("%Y-%m-%d")

class DataStore:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        self.user: UserProfile = self._init_user()
        self.tasks: List[Task] = []
        self.events: List[CalendarEvent] = []
        self.reminders: List[Reminder] = []
        self.bills: List[Bill] = []
        self.documents: List[DocumentItem] = []
        self.goals: List[Goal] = []
        self.habits: List[Habit] = []
        self.learning: List[LearningItem] = []
        self.career: List[CareerApplication] = []
        self.family: FamilyGroup = self._init_family()
        self.automations: List[AutomationRule] = []
        self.approvals: List[ApprovalRequest] = []
        self.notifications: List[NotificationItem] = []
        self.audit_logs: List[AuditEvent] = []
        self.ai_messages: List[AiChatMessage] = []
        
        self.load_from_disk()

    def _init_user(self) -> UserProfile:
        return UserProfile(
            id="usr-demo-01",
            name="Alex Mercer",
            email="alex.mercer@example.com",
            avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            timeZone="America/New_York (UTC-5)",
            preferredLanguage="English (US)",
            dateFormat="YYYY-MM-DD",
            theme="dark",
            onboardingCompleted=True,
            aiProvider="mock_intelligent",
            apiKeyConfigured=False
        )

    def _init_family(self) -> FamilyGroup:
        return FamilyGroup(
            id="fam-01",
            name="Mercer Household",
            members=[
                FamilyMember(id="mem-1", name="Alex Mercer", email="alex.mercer@example.com", role="ADMIN"),
                FamilyMember(id="mem-2", name="Elena Vance", email="elena.vance@example.com", role="MEMBER"),
                FamilyMember(id="mem-3", name="Leo Vance", email="leo.vance@example.com", role="CHILD")
            ],
            sharedShoppingList=[
                SharedShoppingItem(id="shop-1", name="Organic Oat Milk", quantity="2 cartons", completed=False, addedBy="Elena Vance"),
                SharedShoppingItem(id="shop-2", name="Greek Yogurt", quantity="1 tub", completed=True, addedBy="Alex Mercer"),
                SharedShoppingItem(id="shop-3", name="Whole Grain Bread", quantity="1 loaf", completed=False, addedBy="Alex Mercer")
            ]
        )

    def _seed_defaults(self):
        today = relative_date(0)
        yesterday = relative_date(-1)
        tomorrow = relative_date(1)
        in_3_days = relative_date(3)
        in_7_days = relative_date(7)

        # 1. Tasks
        self.tasks = [
            Task(
                id="tsk-101",
                title="Prepare Quarterly Financial Review Slides",
                description="Summarize income, expenses, and investment allocations for Q3.",
                dueDate=today,
                dueTime="15:00",
                priority="critical",
                category="work",
                status="in_progress",
                estimatedDurationMin=90,
                tags=["Quarterly", "Presentation", "Finance"],
                subtasks=[
                    Subtask(id="st-1", title="Export transaction sheet", completed=True),
                    Subtask(id="st-2", title="Draft executive summary slide", completed=True),
                    Subtask(id="st-3", title="Review variance analysis", completed=False)
                ]
            ),
            Task(
                id="tsk-102",
                title="Annual Dental Checkup & Hygiene",
                description="Appointment with Dr. Aris at Midtown Dental Suite.",
                dueDate=today,
                dueTime="11:30",
                priority="high",
                category="health",
                status="not_started",
                estimatedDurationMin=60,
                tags=["Health", "Dental"],
                subtasks=[Subtask(id="st-4", title="Bring insurance card", completed=False)]
            ),
            Task(
                id="tsk-103",
                title="Renew Passport Verification Documents",
                description="Scan birth certificate and notarized ID copy for consulate dispatch.",
                dueDate=yesterday, # Overdue
                dueTime="18:00",
                priority="high",
                category="personal",
                status="not_started",
                estimatedDurationMin=45,
                tags=["Urgent", "Legal", "Travel"],
                subtasks=[
                    Subtask(id="st-5", title="Locate original document in vault", completed=True),
                    Subtask(id="st-6", title="Upload scanned PDF to consular portal", completed=False)
                ]
            ),
            Task(
                id="tsk-104",
                title="System Design Architecture Review",
                description="Evaluate microservices vs modular monolith scaling trade-offs.",
                dueDate=tomorrow,
                dueTime="10:00",
                priority="medium",
                category="work",
                status="not_started",
                estimatedDurationMin=45,
                tags=["Architecture", "Engineering"],
                subtasks=[]
            )
        ]

        # 2. Events
        self.events = [
            CalendarEvent(
                id="evt-201",
                title="Strategic Product Roadmap Sync",
                description="Quarterly alignment with platform leadership.",
                date=today,
                startTime="14:00",
                endTime="15:00",
                timeZone="EST",
                location="Virtual",
                isOnlineMeeting=True,
                meetingLink="https://meet.google.com/xyz-life-sync",
                category="professional",
                relatedContacts=["Sarah Chen", "David Kim"]
            ),
            CalendarEvent(
                id="evt-202",
                title="Dental Clinic Appointment",
                description="Annual checkup and cleaning with Dr. Aris.",
                date=today,
                startTime="11:30",
                endTime="12:30",
                timeZone="EST",
                location="450 Lexington Ave, Suite 400",
                isOnlineMeeting=False,
                category="medical"
            ),
            CalendarEvent(
                id="evt-203",
                title="Family Dinner & Weekend Planning",
                description="Dinner with Elena and kids.",
                date=tomorrow,
                startTime="19:00",
                endTime="20:30",
                timeZone="EST",
                location="Home",
                category="family"
            )
        ]

        # 3. Reminders
        self.reminders = [
            Reminder(
                id="rem-301",
                title="Submit Flexible Spending Account (FSA) Claims",
                notes="Attach pharmacy and dental receipts.",
                dueDate=today,
                dueTime="17:00",
                priority="high",
                category="Finance",
                isCompleted=False
            ),
            Reminder(
                id="rem-302",
                title="Hydration & 5-minute Mobility Stretch",
                notes="Take a screen break.",
                dueDate=today,
                dueTime="14:30",
                priority="low",
                category="Health",
                isCompleted=True
            ),
            Reminder(
                id="rem-303",
                title="Pay Home Fiber Internet Statement",
                notes="Autopay verification.",
                dueDate=in_3_days,
                dueTime="09:00",
                priority="medium",
                category="Bills",
                isCompleted=False
            )
        ]

        # 4. Bills
        self.bills = [
            Bill(
                id="bil-401",
                name="Gigabit Fiber Internet",
                category="utilities",
                amount=79.99,
                currency="USD",
                dueDate=in_3_days,
                recurringInterval="monthly",
                paymentStatus="UNPAID",
                reminderDaysBefore=3,
                payee="Verizon Fios",
                notes="Account #84920-FIBER"
            ),
            Bill(
                id="bil-402",
                name="Metropolitan Electric & Grid",
                category="utilities",
                amount=142.50,
                currency="USD",
                dueDate=yesterday,
                recurringInterval="monthly",
                paymentStatus="OVERDUE",
                reminderDaysBefore=5,
                payee="ConEd Metro",
                notes="Summer cooling cycle variance."
            ),
            Bill(
                id="bil-403",
                name="Health & Dental Insurance Premium",
                category="insurance",
                amount=385.00,
                currency="USD",
                dueDate=in_7_days,
                recurringInterval="monthly",
                paymentStatus="UNPAID",
                reminderDaysBefore=7,
                payee="Aetna Global Choice"
            ),
            Bill(
                id="bil-404",
                name="Cloud Storage & Hosting Subscription",
                category="subscription",
                amount=29.00,
                currency="USD",
                dueDate=relative_date(-15),
                recurringInterval="monthly",
                paymentStatus="PAID",
                reminderDaysBefore=3,
                payee="Vercel Pro",
                paidDate=relative_date(-14),
                paymentHistory=[
                    PaymentRecord(date=relative_date(-14), amount=29.00, confirmationRef="REC-948194")
                ]
            )
        ]

        # 5. Documents
        self.documents = [
            DocumentItem(
                id="doc-501",
                title="Comprehensive Health Insurance Policy",
                description="Summary of benefits, in-network copays, and dental coverage.",
                category="insurance",
                tags=["Health", "Insurance", "Dental"],
                issueDate="2026-01-01",
                expiryDate="2026-12-31",
                fileSizeKb=480,
                fileType="application/pdf",
                isPrivate=True,
                aiExtractedSummary="Policy #POL-88492-H. Zero deductible for in-network preventive dental and primary doctor checkups."
            ),
            DocumentItem(
                id="doc-502",
                title="Apartment Residential Lease Agreement",
                description="Fixed-term lease contract for 742 Evergreen Terrace.",
                category="personal",
                tags=["Housing", "Lease", "Legal"],
                issueDate="2025-09-01",
                expiryDate=relative_date(45),
                fileSizeKb=1250,
                fileType="application/pdf",
                isPrivate=True,
                aiExtractedSummary="Renewal notice required 60 days prior to expiry. Security deposit held in escrow."
            ),
            DocumentItem(
                id="doc-503",
                title="Certified Passport & ID Scan",
                description="Encrypted digital passport archive for visa applications.",
                category="identity",
                tags=["Passport", "Identity", "Travel"],
                issueDate="2021-06-15",
                expiryDate="2031-06-15",
                fileSizeKb=920,
                fileType="application/pdf",
                isPrivate=True,
                aiExtractedSummary="Passport document valid through 2031. High-resolution biometrics verified."
            )
        ]

        # 6. Goals & Habits
        self.goals = [
            Goal(
                id="gol-601",
                title="Transition to Principal Systems Architect",
                description="Master distributed systems, consensus protocols, and lead cross-org architectural initiatives.",
                category="career",
                startDate=relative_date(-90),
                targetDate=relative_date(180),
                progressPercent=65,
                status="IN_PROGRESS",
                milestones=[
                    GoalMilestone(id="ms-1", title="Complete Distributed Systems MIT 6.824 Curriculum", completed=True, dueDate=relative_date(-20)),
                    GoalMilestone(id="ms-2", title="Publish Tech RFC on High-Throughput Event Streaming", completed=True, dueDate=relative_date(-5)),
                    GoalMilestone(id="ms-3", title="Lead architectural review across 3 core product pods", completed=False, dueDate=relative_date(45)),
                    GoalMilestone(id="ms-4", title="Complete 10 high-level mock system design evaluations", completed=False, dueDate=relative_date(90))
                ]
            ),
            Goal(
                id="gol-602",
                title="Complete Half-Marathon (Under 1h 50m)",
                description="Follow structured 16-week endurance training block.",
                category="health",
                startDate=relative_date(-45),
                targetDate=relative_date(60),
                progressPercent=50,
                status="IN_PROGRESS",
                milestones=[
                    GoalMilestone(id="ms-5", title="Achieve consistent 10K distance under 50 minutes", completed=True),
                    GoalMilestone(id="ms-6", title="Complete 15K weekend long run with proper pacing", completed=False),
                    GoalMilestone(id="ms-7", title="Final race day execution", completed=False)
                ]
            )
        ]

        self.habits = [
            Habit(
                id="hab-701",
                title="Morning Mindfulness & Breathwork (10 min)",
                category="Mindfulness",
                frequency="daily",
                targetDaysPerWeek=7,
                currentStreak=12,
                bestStreak=28,
                checkins=[relative_date(-i) for i in range(1, 6)] + [today],
                isPaused=False
            ),
            Habit(
                id="hab-702",
                title="Deep Work Focus Session (90 min uninterrupted)",
                category="Productivity",
                frequency="daily",
                targetDaysPerWeek=5,
                currentStreak=4,
                bestStreak=19,
                checkins=[relative_date(-i) for i in range(1, 4)] + [today],
                isPaused=False
            ),
            Habit(
                id="hab-703",
                title="Evening Reading (Non-screen, 30 min)",
                category="Personal Growth",
                frequency="daily",
                targetDaysPerWeek=7,
                currentStreak=8,
                bestStreak=14,
                checkins=[relative_date(-i) for i in range(1, 8)],
                isPaused=False
            )
        ]

        # 7. Learning
        self.learning = [
            LearningItem(
                id="lrn-801",
                title="Advanced Distributed Systems & Consensus",
                category="Computer Science",
                provider="Self-Paced / Academic Papers",
                progressPercent=70,
                notes="Focusing on Raft leader election, Byzantine Fault Tolerance, and Vector Clocks.",
                resources=[
                    {"title": "Raft Consensus Paper", "url": "https://raft.github.io"},
                    {"title": "Designing Data-Intensive Applications", "url": "https://dataintensive.net"}
                ],
                studyPlan=[
                    StudyPlanItem(id="sp-1", topic="Review Raft Log Replication Invariants", durationMin=60, scheduledDate=today, completed=False),
                    StudyPlanItem(id="sp-2", topic="Vector Clocks vs Hybrid Logical Clocks", durationMin=45, scheduledDate=tomorrow, completed=False),
                    StudyPlanItem(id="sp-3", topic="Paxos Consensus Under Asynchronous Network Partitions", durationMin=90, scheduledDate=in_3_days, completed=False)
                ],
                completed=False
            )
        ]

        # 8. Career
        self.career = [
            CareerApplication(
                id="car-901",
                company="CloudScale Technologies",
                role="Staff Infrastructure Architect",
                jobPostingUrl="https://cloudscale.io/careers/staff-arch",
                salaryExpectation="$220,000 - $250,000 + Equity",
                applicationDate=relative_date(-12),
                status="INTERVIEWING",
                contactName="Marcus Brody (VP Engineering)",
                contactEmail="marcus.brody@cloudscale.io",
                interviewDate=relative_date(2),
                interviewNotes="System design and scalability deep dive. Prepare latency SLA numbers and caching topology.",
                followUpDate=relative_date(4),
                notes="Top choice. Strong engineering culture and global edge infrastructure challenge."
            ),
            CareerApplication(
                id="car-902",
                company="Apex AI Systems",
                role="Principal Solutions Engineer",
                jobPostingUrl="https://apexai.dev/careers/principal",
                salaryExpectation="$210,000 - $240,000",
                applicationDate=relative_date(-20),
                status="OFFER",
                contactName="Elena Rostova",
                contactEmail="elena.r@apexai.dev",
                notes="Offer received. Under review. 15-day decision window expiring next week."
            )
        ]

        # 9. Automations
        self.automations = [
            AutomationRule(
                id="aut-1001",
                name="Upcoming Bill Deadline Alert",
                description="Triggers a high-priority reminder and notification 3 days prior to any unpaid bill due date.",
                trigger="When bill is due within 72 hours",
                condition="Bill.paymentStatus == 'UNPAID'",
                proposedAction="Create in-app reminder + push notification badge",
                requiresApproval=False,
                isEnabled=True,
                lastRun=relative_date(0) + " 08:00:00",
                executionCount=14,
                status="SUCCESS"
            ),
            AutomationRule(
                id="aut-1002",
                name="Weekly Schedule Synthesis & Time Blocking",
                description="Analyzes tasks due next week, clusters them by category, and proposes 90-minute focus blocks on calendar.",
                trigger="Every Sunday at 18:00",
                condition="Unscheduled high-priority tasks > 0",
                proposedAction="Generate proposed calendar focus sessions for user approval",
                requiresApproval=True,
                isEnabled=True,
                lastRun=relative_date(-1) + " 18:00:00",
                executionCount=6,
                status="WAITING_APPROVAL"
            ),
            AutomationRule(
                id="aut-1003",
                name="Document Vault Expiration Watchdog",
                description="Scans documents for expiry dates within 30 days and logs a renewal task.",
                trigger="Daily at midnight",
                condition="Document.expiryDate - Today <= 30 days",
                proposedAction="Create high-priority Renewal Task in Task Workspace",
                requiresApproval=False,
                isEnabled=True,
                lastRun=relative_date(0) + " 00:00:00",
                executionCount=22,
                status="SUCCESS"
            )
        ]

        # 10. Approvals
        self.approvals = [
            ApprovalRequest(
                id="appr-1101",
                title="Authorize CloudScale Interview Calendar Sync",
                description="LifeOS automation engine proposes adding the upcoming interview to external calendar.",
                actionType="EXTERNAL_SYNC",
                riskLevel="EXTERNAL",
                serviceAffected="Google Calendar API",
                isReversible=True,
                payloadSummary="Event: Staff Architect Interview with Marcus Brody on " + relative_date(2) + " at 14:00.",
                status="PENDING",
                requestedAt=relative_date(0) + " 07:30:00"
            ),
            ApprovalRequest(
                id="appr-1102",
                title="Verify ConEd Electric Overdue Bill Settlement",
                description="Acknowledge payment of overdue $142.50 utility statement.",
                actionType="SENSITIVE_FINANCIAL",
                riskLevel="SENSITIVE_FINANCIAL",
                serviceAffected="Financial Obligation Vault",
                isReversible=False,
                payloadSummary="Bill: ConEd Electric ($142.50). Status will change from OVERDUE to PAID.",
                status="PENDING",
                requestedAt=relative_date(0) + " 08:15:00"
            )
        ]

        # 11. Notifications
        self.notifications = [
            NotificationItem(
                id="notif-1201",
                title="Immediate Attention: Overdue Utility Bill",
                message="Metropolitan Electric bill of $142.50 was due yesterday. Please verify settlement.",
                type="BILL",
                read=False,
                actionSection="bills"
            ),
            NotificationItem(
                id="notif-1202",
                title="Approval Required: Interview Calendar Sync",
                message="CloudScale technical interview requires your authorization before external calendar sync.",
                type="APPROVAL",
                read=False,
                actionSection="automations"
            ),
            NotificationItem(
                id="notif-1203",
                title="Upcoming Focus Session",
                message="Scheduled: Deep Work (90 min) starting in 30 minutes.",
                type="TASK",
                read=True,
                actionSection="my-day"
            )
        ]

        # 12. Audit Logs
        self.audit_logs = [
            AuditEvent(
                id="aud-1301",
                actor="Alex Mercer",
                action="UPDATE_TASK",
                resource="Task: Prepare Quarterly Financial Review Slides",
                riskLevel="LOW",
                status="COMPLETED",
                details="Updated subtask 'Draft executive summary slide' to completed."
            ),
            AuditEvent(
                id="aud-1302",
                actor="Automation Engine",
                action="TRIGGER_ALERT",
                resource="Bill: Metropolitan Electric & Grid",
                riskLevel="MEDIUM",
                status="COMPLETED",
                details="Flagged statement as OVERDUE and sent high-priority notification."
            ),
            AuditEvent(
                id="aud-1303",
                actor="System AI",
                action="SYNTHESIZE_DAILY_BRIEFING",
                resource="Daily Planner View",
                riskLevel="LOW",
                status="COMPLETED",
                details="Synthesized schedule based on 4 active tasks and 3 calendar appointments."
            )
        ]

        # 13. AI Messages
        self.ai_messages = [
            AiChatMessage(
                id="msg-1",
                sender="assistant",
                content="Hello Alex! I'm your LifeOS AI assistant. I have reviewed your agenda: you have 2 tasks due today, 1 overdue passport renewal task, and an upcoming interview with CloudScale in 2 days. How would you like to plan your time?"
            )
        ]

    def save_to_disk(self):
        try:
            data = {
                "user": self.user.model_dump(),
                "tasks": [t.model_dump() for t in self.tasks],
                "events": [e.model_dump() for e in self.events],
                "reminders": [r.model_dump() for r in self.reminders],
                "bills": [b.model_dump() for b in self.bills],
                "documents": [d.model_dump() for d in self.documents],
                "goals": [g.model_dump() for g in self.goals],
                "habits": [h.model_dump() for h in self.habits],
                "learning": [l.model_dump() for l in self.learning],
                "career": [c.model_dump() for c in self.career],
                "family": self.family.model_dump(),
                "automations": [a.model_dump() for a in self.automations],
                "approvals": [ap.model_dump() for ap in self.approvals],
                "notifications": [n.model_dump() for n in self.notifications],
                "audit_logs": [al.model_dump() for al in self.audit_logs],
                "ai_messages": [m.model_dump() for m in self.ai_messages]
            }
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error persisting to disk: {e}")

    def load_from_disk(self):
        if not os.path.exists(DB_FILE):
            self._seed_defaults()
            self.save_to_disk()
            return

        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)

            self.user = UserProfile(**data.get("user", self._init_user().model_dump()))
            self.tasks = [Task(**t) for t in data.get("tasks", [])]
            self.events = [CalendarEvent(**e) for e in data.get("events", [])]
            self.reminders = [Reminder(**r) for r in data.get("reminders", [])]
            self.bills = [Bill(**b) for b in data.get("bills", [])]
            self.documents = [DocumentItem(**d) for d in data.get("documents", [])]
            self.goals = [Goal(**g) for g in data.get("goals", [])]
            self.habits = [Habit(**h) for h in data.get("habits", [])]
            self.learning = [LearningItem(**l) for l in data.get("learning", [])]
            self.career = [CareerApplication(**c) for c in data.get("career", [])]
            self.family = FamilyGroup(**data.get("family", self._init_family().model_dump()))
            self.automations = [AutomationRule(**a) for a in data.get("automations", [])]
            self.approvals = [ApprovalRequest(**ap) for ap in data.get("approvals", [])]
            self.notifications = [NotificationItem(**n) for n in data.get("notifications", [])]
            self.audit_logs = [AuditEvent(**al) for al in data.get("audit_logs", [])]
            self.ai_messages = [AiChatMessage(**m) for m in data.get("ai_messages", [])]
        except Exception as e:
            print(f"Failed loading DB file, re-seeding: {e}")
            self._seed_defaults()
            self.save_to_disk()

    def reset_demo(self):
        self._seed_defaults()
        self.save_to_disk()

store = DataStore()
