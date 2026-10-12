import {
  Task,
  CalendarEvent,
  Reminder,
  Bill,
  DocumentItem,
  Goal,
  Habit,
  LearningItem,
  CareerApplication,
  FamilyGroup,
  AutomationRule,
  ApprovalRequest,
  NotificationItem,
  AuditEvent,
  UserProfile,
  AiChatMessage
} from '../types';

// Helper to format ISO date relative to today
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_USER: UserProfile = {
  id: 'usr-demo-01',
  name: 'Alex Mercer',
  email: 'alex.mercer@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  timeZone: 'America/New_York (UTC-5)',
  preferredLanguage: 'English (US)',
  dateFormat: 'YYYY-MM-DD',
  theme: 'dark',
  onboardingCompleted: true,
  enabledModules: ['overview', 'my-day', 'tasks', 'calendar', 'reminders', 'bills', 'documents', 'goals-habits', 'learning', 'career', 'family', 'ai-assistant', 'automations', 'notifications', 'settings'],
  aiProvider: 'mock_intelligent',
  apiKeyConfigured: false
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-101',
    title: 'Prepare Quarterly Financial Review Slides',
    description: 'Summarize income, expenses, and investment allocations for Q3.',
    dueDate: getRelativeDate(0), // Today
    dueTime: '15:00',
    priority: 'critical',
    category: 'work',
    status: 'in_progress',
    estimatedDurationMin: 90,
    tags: ['Quarterly', 'Presentation', 'Finance'],
    subtasks: [
      { id: 'st-1', title: 'Export transaction sheet', completed: true },
      { id: 'st-2', title: 'Draft executive summary slide', completed: true },
      { id: 'st-3', title: 'Review variance analysis', completed: false }
    ],
    recurringSchedule: 'none',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tsk-102',
    title: 'Annual Dental Checkup & Hygiene',
    description: 'Appointment with Dr. Aris at Midtown Dental Suite.',
    dueDate: getRelativeDate(0), // Today
    dueTime: '11:30',
    priority: 'high',
    category: 'health',
    status: 'not_started',
    estimatedDurationMin: 60,
    tags: ['Health', 'Dental'],
    subtasks: [
      { id: 'st-4', title: 'Bring insurance card', completed: false }
    ],
    recurringSchedule: 'none',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tsk-103',
    title: 'Renew Passport Verification Documents',
    description: 'Scan birth certificate and notarized ID copy for consulate dispatch.',
    dueDate: getRelativeDate(-1), // Overdue!
    dueTime: '18:00',
    priority: 'high',
    category: 'personal',
    status: 'not_started',
    estimatedDurationMin: 45,
    tags: ['Urgent', 'Legal', 'Travel'],
    subtasks: [
      { id: 'st-5', title: 'Locate original document in vault', completed: true },
      { id: 'st-6', title: 'Upload scanned PDF to consular portal', completed: false }
    ],
    recurringSchedule: 'none',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tsk-104',
    title: 'Complete System Architecture Module 4',
    description: 'Finish distributed consensus and Raft algorithm review notes.',
    dueDate: getRelativeDate(1), // Tomorrow
    dueTime: '20:00',
    priority: 'medium',
    category: 'learning',
    status: 'not_started',
    estimatedDurationMin: 75,
    tags: ['Study', 'DistributedSystems'],
    subtasks: [],
    recurringSchedule: 'weekly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tsk-105',
    title: 'Family Grocery & Pantry Restock',
    description: 'Weekly organic produce and pantry staples run.',
    dueDate: getRelativeDate(2),
    dueTime: '10:00',
    priority: 'low',
    category: 'family',
    status: 'not_started',
    estimatedDurationMin: 60,
    tags: ['Home', 'Errands'],
    subtasks: [
      { id: 'st-7', title: 'Check refrigerator inventory', completed: true },
      { id: 'st-8', title: 'Pick up bakery fresh sourdough', completed: false }
    ],
    recurringSchedule: 'weekly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tsk-106',
    title: 'Review Cloud Infrastructure Bill',
    description: 'Audit development clusters and terminate idle test nodes.',
    dueDate: getRelativeDate(-3),
    dueTime: '14:00',
    priority: 'medium',
    category: 'finance',
    status: 'completed',
    estimatedDurationMin: 30,
    tags: ['DevOps', 'Savings'],
    subtasks: [],
    recurringSchedule: 'monthly',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-201',
    title: 'Dental Appointment - Dr. Aris',
    description: 'Routine cleaning and checkup at Suite 402 Midtown.',
    date: getRelativeDate(0),
    startTime: '11:30',
    endTime: '12:30',
    timeZone: 'EST',
    location: 'Midtown Dental Suite, 402 5th Ave',
    isOnlineMeeting: false,
    category: 'medical',
    reminderMinutesBefore: 60,
    isRecurring: false
  },
  {
    id: 'evt-202',
    title: 'System Design Sync with Principal Team',
    description: 'Review microservices latency telemetry and caching strategy.',
    date: getRelativeDate(0),
    startTime: '14:00',
    endTime: '15:00',
    timeZone: 'EST',
    isOnlineMeeting: true,
    meetingLink: 'https://meet.lifeos.internal/sys-design-sync',
    category: 'professional',
    relatedContacts: ['Sarah Chen', 'Marcus Vance'],
    reminderMinutesBefore: 15,
    isRecurring: true,
    recurrenceRule: 'weekly'
  },
  {
    id: 'evt-203',
    title: 'Career Mentorship Catchup with Elena',
    description: 'Discuss staff engineer interview prep and compensation benchmarks.',
    date: getRelativeDate(2),
    startTime: '16:00',
    endTime: '16:45',
    timeZone: 'EST',
    isOnlineMeeting: true,
    meetingLink: 'https://meet.lifeos.internal/elena-catchup',
    category: 'professional',
    reminderMinutesBefore: 30,
    isRecurring: false
  },
  {
    id: 'evt-204',
    title: 'Family Weekend Hiking & Picnic',
    description: 'Bear Mountain scenic trail hike and lunch with family.',
    date: getRelativeDate(5),
    startTime: '09:00',
    endTime: '14:00',
    timeZone: 'EST',
    location: 'Bear Mountain State Park',
    category: 'family',
    isRecurring: false
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-301',
    title: 'Take Vitamin D3 and Omega-3 supplement',
    notes: 'With breakfast and glass of water.',
    dueDate: getRelativeDate(0),
    dueTime: '08:30',
    recurrence: 'daily',
    priority: 'low',
    category: 'Health',
    isCompleted: true
  },
  {
    id: 'rem-302',
    title: 'Confirm Interview Confirmation Email for CloudScale role',
    notes: 'Reply to recruiter Maya confirming Thursday 2 PM slot.',
    dueDate: getRelativeDate(0),
    dueTime: '13:00',
    recurrence: 'none',
    priority: 'high',
    category: 'Career',
    isCompleted: false
  },
  {
    id: 'rem-303',
    title: 'Water Balcony Herbs & Fiddle Leaf Fig',
    notes: 'Check soil moisture before watering.',
    dueDate: getRelativeDate(1),
    dueTime: '18:00',
    recurrence: 'weekly',
    priority: 'medium',
    category: 'Home',
    isCompleted: false
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bil-401',
    name: 'Metropolitan High-Speed Fiber Internet',
    category: 'utilities',
    amount: 79.99,
    currency: 'USD',
    dueDate: getRelativeDate(3),
    recurringInterval: 'monthly',
    paymentStatus: 'UNPAID',
    reminderDaysBefore: 3,
    payee: 'MetroFiber Corp',
    notes: 'Account #9482-1049. Autopay reminder pending review.',
    paymentHistory: [
      { date: getRelativeDate(-28), amount: 79.99, confirmationRef: 'TXN-984392' },
      { date: getRelativeDate(-58), amount: 79.99, confirmationRef: 'TXN-837190' }
    ]
  },
  {
    id: 'bil-402',
    name: 'Residential Apartment Rent & HOA',
    category: 'housing',
    amount: 2150.00,
    currency: 'USD',
    dueDate: getRelativeDate(5),
    recurringInterval: 'monthly',
    paymentStatus: 'UNPAID',
    reminderDaysBefore: 5,
    payee: 'Skyline Properties LLC',
    notes: 'Include monthly designated parking bay charge.',
    paymentHistory: [
      { date: getRelativeDate(-25), amount: 2150.00, confirmationRef: 'ACH-48201' }
    ]
  },
  {
    id: 'bil-403',
    name: 'Cloud Infrastructure & AI API Services',
    category: 'subscription',
    amount: 42.50,
    currency: 'USD',
    dueDate: getRelativeDate(-2), // Overdue
    recurringInterval: 'monthly',
    paymentStatus: 'OVERDUE',
    reminderDaysBefore: 2,
    payee: 'CloudPlatform Services',
    notes: 'Development server billing for personal projects.',
    paymentHistory: []
  },
  {
    id: 'bil-404',
    name: 'Comprehensive Health & Dental Insurance',
    category: 'insurance',
    amount: 320.00,
    currency: 'USD',
    dueDate: getRelativeDate(-10),
    recurringInterval: 'monthly',
    paymentStatus: 'PAID',
    reminderDaysBefore: 7,
    payee: 'Horizon Health Alliance',
    paidDate: getRelativeDate(-10),
    paymentHistory: [
      { date: getRelativeDate(-10), amount: 320.00, confirmationRef: 'INS-202610-A' }
    ]
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-501',
    title: 'International Travel Passport Scan (Biometric)',
    description: 'Clear color scan of photo page and official endorsement visas.',
    category: 'identity',
    tags: ['Identity', 'Travel', 'Official'],
    issueDate: '2017-05-12',
    expiryDate: getRelativeDate(45), // Expiring soon warning!
    fileSizeKb: 1420,
    fileType: 'application/pdf',
    fileUrl: '/mock-vault/passport-biometric.pdf',
    isPrivate: true,
    aiExtractedSummary: 'Passport Document #P849201. Issue date May 2017, Expiry in 45 days. Needs renewal before upcoming international travel.',
    uploadedAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 'doc-502',
    title: 'Residential Lease Agreement 2026-2027',
    description: 'Signed tenancy contract with Skyline Properties including parking annex.',
    category: 'personal',
    tags: ['Housing', 'Legal', 'Contract'],
    issueDate: '2026-01-01',
    expiryDate: '2027-01-01',
    fileSizeKb: 3100,
    fileType: 'application/pdf',
    isPrivate: true,
    aiExtractedSummary: 'Standard 12-month lease. Monthly rent $2,150. Requires 60-day notice for non-renewal.',
    uploadedAt: new Date(Date.now() - 86400000 * 60).toISOString()
  },
  {
    id: 'doc-503',
    title: 'Master of Science in Computer Engineering Diploma',
    description: 'Official university accredited degree certificate and transcript.',
    category: 'education',
    tags: ['Education', 'Degree', 'Credentials'],
    issueDate: '2022-06-15',
    fileSizeKb: 2450,
    fileType: 'application/pdf',
    isPrivate: true,
    aiExtractedSummary: 'Accredited M.S. Degree in Computer Engineering with Honors (GPA 3.92). Verified institutional seal.',
    uploadedAt: new Date(Date.now() - 86400000 * 120).toISOString()
  },
  {
    id: 'doc-504',
    title: 'Executive Health Assessment & Blood Panel',
    description: 'Annual comprehensive health check laboratory diagnostics report.',
    category: 'medical',
    tags: ['Medical', 'Health', 'Diagnostics'],
    issueDate: getRelativeDate(-40),
    fileSizeKb: 890,
    fileType: 'application/pdf',
    isPrivate: true,
    aiExtractedSummary: 'All vital cardiovascular and metabolic markers within optimal ranges. Vitamin D slightly low, supplement advised.',
    uploadedAt: new Date(Date.now() - 86400000 * 40).toISOString()
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'gol-601',
    title: 'Achieve Staff Software Engineer Promotion or Offer',
    description: 'Transition into engineering leadership with high-impact systems architecture and mentorship.',
    category: 'career',
    startDate: '2026-01-15',
    targetDate: '2026-12-31',
    progressPercent: 65,
    status: 'IN_PROGRESS',
    notes: 'Actively interviewing and completing high-scale distributed systems certifications.',
    milestones: [
      { id: 'm-1', title: 'Complete 30 Senior/Staff Mock System Design Interviews', completed: true },
      { id: 'm-2', title: 'Publish technical deep-dive on fault-tolerant event streaming', completed: true },
      { id: 'm-3', title: 'Complete interview rounds at top 3 target tech firms', completed: false, dueDate: getRelativeDate(20) },
      { id: 'm-4', title: 'Negotiate and sign target tier-1 offer package', completed: false, dueDate: getRelativeDate(45) }
    ],
    relatedTaskIds: ['tsk-101', 'tsk-104']
  },
  {
    id: 'gol-602',
    title: 'Build $50,000 Liquid Emergency Reserve Fund',
    description: 'Secure 12 months of high-yield liquid reserves for peace of mind and resilience.',
    category: 'financial',
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    progressPercent: 82,
    status: 'IN_PROGRESS',
    notes: 'Currently at $41,200 deposited in 5.1% APY treasury-backed account.',
    milestones: [
      { id: 'm-5', title: 'Reach $25,000 milestone', completed: true },
      { id: 'm-6', title: 'Reach $40,000 milestone', completed: true },
      { id: 'm-7', title: 'Reach final $50,000 safety cushion', completed: false, dueDate: getRelativeDate(60) }
    ],
    relatedTaskIds: []
  },
  {
    id: 'gol-603',
    title: 'Run a Half Marathon in under 1 hr 50 mins',
    description: 'Systematic endurance training, weekly tempo runs, and metabolic conditioning.',
    category: 'health',
    startDate: '2026-03-01',
    targetDate: '2026-11-15',
    progressPercent: 70,
    status: 'IN_PROGRESS',
    notes: 'Pacing current 10k tempo at 4:55/km. Longest distance achieved: 16 km.',
    milestones: [
      { id: 'm-8', title: 'Run continuous 10k under 50 mins', completed: true },
      { id: 'm-9', title: 'Complete 18k trial road run', completed: false, dueDate: getRelativeDate(14) },
      { id: 'm-10', title: 'Official race day finish', completed: false, dueDate: getRelativeDate(35) }
    ],
    relatedTaskIds: []
  }
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'hab-701',
    title: 'Morning Deep Meditation & Breathwork',
    category: 'Mindfulness',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 14,
    bestStreak: 32,
    checkins: [
      getRelativeDate(0),
      getRelativeDate(-1),
      getRelativeDate(-2),
      getRelativeDate(-3),
      getRelativeDate(-4),
      getRelativeDate(-5),
      getRelativeDate(-6)
    ],
    isPaused: false,
    reminderTime: '07:00'
  },
  {
    id: 'hab-702',
    title: '30-Minute Focused Technical Reading',
    category: 'Learning',
    frequency: 'daily',
    targetDaysPerWeek: 5,
    currentStreak: 6,
    bestStreak: 21,
    checkins: [
      getRelativeDate(-1),
      getRelativeDate(-2),
      getRelativeDate(-3),
      getRelativeDate(-4),
      getRelativeDate(-5),
      getRelativeDate(-6)
    ],
    isPaused: false,
    reminderTime: '21:30'
  },
  {
    id: 'hab-703',
    title: 'Strength Training / Aerobic Cardio (45m)',
    category: 'Fitness',
    frequency: 'daily',
    targetDaysPerWeek: 5,
    currentStreak: 4,
    bestStreak: 19,
    checkins: [
      getRelativeDate(0),
      getRelativeDate(-1),
      getRelativeDate(-2),
      getRelativeDate(-3)
    ],
    isPaused: false,
    reminderTime: '17:30'
  },
  {
    id: 'hab-704',
    title: 'Drink 2.5 Liters of Clean Water',
    category: 'Health',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 9,
    bestStreak: 25,
    checkins: [
      getRelativeDate(0),
      getRelativeDate(-1),
      getRelativeDate(-2),
      getRelativeDate(-3),
      getRelativeDate(-4)
    ],
    isPaused: false
  }
];

export const INITIAL_LEARNING: LearningItem[] = [
  {
    id: 'lrn-801',
    title: 'Advanced Distributed Systems & Consensus Protocols',
    category: 'Computer Science',
    provider: 'MIT Open Learning & Distributed Systems Lab',
    progressPercent: 72,
    notes: 'Focus on Paxos, Raft, Byzantine fault tolerance, and eventual consistency trade-offs.',
    resources: [
      { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net' },
      { title: 'The Raft Consensus Paper', url: 'https://raft.github.io' }
    ],
    examDate: getRelativeDate(18),
    studyPlan: [
      { id: 'sp-1', topic: 'Raft Leader Election and Log Compaction', durationMin: 60, scheduledDate: getRelativeDate(1), completed: false },
      { id: 'sp-2', topic: 'Vector Clocks and Conflict Resolution in Dynamo', durationMin: 45, scheduledDate: getRelativeDate(3), completed: false },
      { id: 'sp-3', topic: 'Two-Phase Commit vs Sagas in Distributed Transactions', durationMin: 60, scheduledDate: getRelativeDate(5), completed: false }
    ],
    completed: false
  },
  {
    id: 'lrn-802',
    title: 'Conversational AI & LLM Systems Engineering',
    category: 'Artificial Intelligence',
    provider: 'DeepLearning.AI & Stanford Online',
    progressPercent: 88,
    notes: 'Autonomous multi-agent architectures, RAG pipelines, and evaluation metrics.',
    resources: [
      { title: 'LangChain & LlamaIndex Official Guides', url: 'https://docs.langchain.com' }
    ],
    studyPlan: [
      { id: 'sp-4', topic: 'Advanced Context Windows & Function Calling Guardrails', durationMin: 45, scheduledDate: getRelativeDate(-2), completed: true },
      { id: 'sp-5', topic: 'RAG Hybrid Search & Dense Embedding Retrieval', durationMin: 60, scheduledDate: getRelativeDate(2), completed: false }
    ],
    completed: false
  }
];

export const INITIAL_CAREER: CareerApplication[] = [
  {
    id: 'car-901',
    company: 'CloudScale Technologies',
    role: 'Staff Infrastructure Architect',
    jobPostingUrl: 'https://cloudscale.internal/careers/staff-infra',
    salaryExpectation: '$240,000 - $275,000 + Equity',
    applicationDate: getRelativeDate(-14),
    status: 'INTERVIEWING',
    contactName: 'Maya Patel (Director of Talent)',
    contactEmail: 'maya.patel@cloudscale.internal',
    interviewDate: getRelativeDate(3),
    interviewNotes: 'System Architecture round focusing on multi-region Kubernetes routing and resilience.',
    followUpDate: getRelativeDate(4),
    notes: 'Strong culture match. Passed technical screening with high rating.'
  },
  {
    id: 'car-902',
    company: 'Vanguard AI Labs',
    role: 'Lead AI Systems Engineer',
    jobPostingUrl: 'https://vanguardai.internal/jobs/lead-systems',
    salaryExpectation: '$230,000 - $260,000',
    applicationDate: getRelativeDate(-21),
    status: 'OFFER',
    contactName: 'James Chen (VP Engineering)',
    contactEmail: 'jchen@vanguardai.internal',
    interviewDate: getRelativeDate(-5),
    interviewNotes: 'Final executive offer call completed. Received formal offer letter for review.',
    followUpDate: getRelativeDate(2),
    notes: 'Offer package includes $245k base + $80k annual equity grants. Decision deadline in 10 days.'
  },
  {
    id: 'car-903',
    company: 'FinPulse Systems',
    role: 'Principal Backend Engineer',
    salaryExpectation: '$225,000 + Bonus',
    applicationDate: getRelativeDate(-28),
    status: 'APPLIED',
    contactName: 'Sarah Jenkins',
    notes: 'Submitted via employee referral from previous colleague.'
  }
];

export const INITIAL_FAMILY: FamilyGroup = {
  id: 'fam-1001',
  name: 'The Mercer Family',
  members: [
    {
      id: 'mem-1',
      name: 'Alex Mercer (You)',
      email: 'alex.mercer@example.com',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'mem-2',
      name: 'Clara Mercer',
      email: 'clara.mercer@example.com',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'mem-3',
      name: 'Leo Mercer',
      email: 'leo.mercer@example.com',
      role: 'CHILD',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ],
  sharedShoppingList: [
    { id: 'shp-1', name: 'Organic Whole Milk & Oat Milk', quantity: '2 Gallons', completed: false, addedBy: 'Clara Mercer' },
    { id: 'shp-2', name: 'Artisan Sourdough & Honey', quantity: '1 Loaf', completed: true, addedBy: 'Alex Mercer' },
    { id: 'shp-3', name: 'Greek Yogurt & Fresh Blueberries', quantity: '3 Tubs', completed: false, addedBy: 'Alex Mercer' },
    { id: 'shp-4', name: 'Eco-Friendly Laundry Detergent', quantity: '1 Bottle', completed: false, addedBy: 'Clara Mercer' }
  ]
};

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'aut-1101',
    name: 'Bill Due 3-Day Proactive Reminder',
    description: 'When an unpaid bill is due within 72 hours, create a high-priority notification and action reminder.',
    trigger: 'Event: Bill Due Date in 3 Days',
    condition: 'Bill Status == UNPAID',
    proposedAction: 'Generate In-App Notification & Schedule Calendar Alert',
    requiresApproval: false,
    isEnabled: true,
    lastRun: getRelativeDate(-1) + ' 09:00:00',
    executionCount: 14,
    status: 'SUCCESS'
  },
  {
    id: 'aut-1102',
    name: 'Document Expiration 60-Day Safety Gate',
    description: 'Alert user when official ID or legal document is approaching expiration within 60 days.',
    trigger: 'Cron: Daily at 08:00 AM',
    condition: 'Document Expiry <= Today + 60 days',
    proposedAction: 'Flag Document in Vault & Create Passport/ID Renewal Task',
    requiresApproval: true,
    isEnabled: true,
    lastRun: getRelativeDate(0) + ' 08:00:00',
    executionCount: 3,
    status: 'WAITING_APPROVAL'
  },
  {
    id: 'aut-1103',
    name: 'Smart Daily Plan Morning Synthesis',
    description: 'Every morning at 06:45 AM, synthesize priority tasks, calendar events, and habits into a structured agenda.',
    trigger: 'Cron: Daily at 06:45 AM',
    condition: 'User Preferences: AI Daily Planner Enabled',
    proposedAction: 'Compile My Day Agenda & Notify on Device',
    requiresApproval: false,
    isEnabled: true,
    lastRun: getRelativeDate(0) + ' 06:45:00',
    executionCount: 42,
    status: 'SUCCESS'
  }
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr-1201',
    title: 'Auto-Generate Passport Renewal Application Task',
    description: 'Automation triggered because Biometric Passport expires in 45 days. Proposed action creates a task with subtasks and flags document.',
    actionType: 'CREATE_TASK_AND_FLAG_DOCUMENT',
    riskLevel: 'INTERNAL_REVERSIBLE',
    serviceAffected: 'LifeOS Vault & Task Manager',
    isReversible: true,
    payloadSummary: 'Task: "Renew International Biometric Passport before Nov 2026"',
    status: 'PENDING',
    requestedAt: getRelativeDate(0) + 'T08:00:15Z'
  },
  {
    id: 'appr-1202',
    title: 'Synchronize Interview Slot with External Calendar',
    description: 'Assistant proposed linking upcoming Staff Architect interview to external Google Calendar via OAuth API.',
    actionType: 'EXTERNAL_CALENDAR_WRITE',
    riskLevel: 'EXTERNAL',
    serviceAffected: 'Google Calendar API',
    isReversible: true,
    payloadSummary: 'Sync Event: "Staff Infrastructure Architect Interview with CloudScale" on ' + getRelativeDate(3) + ' at 14:00',
    status: 'PENDING',
    requestedAt: getRelativeDate(-1) + 'T16:22:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1301',
    title: 'Bill Due Soon: MetroFiber Internet',
    message: 'Your monthly internet bill of $79.99 is due in 3 days on ' + getRelativeDate(3) + '.',
    type: 'BILL',
    read: false,
    timestamp: getRelativeDate(0) + ' 09:15',
    actionSection: 'bills'
  },
  {
    id: 'notif-1302',
    title: 'Action Approval Required',
    message: 'Document safety gate triggered for Passport renewal task creation.',
    type: 'APPROVAL',
    read: false,
    timestamp: getRelativeDate(0) + ' 08:00',
    actionSection: 'automations'
  },
  {
    id: 'notif-1303',
    title: 'Appointment in 2 Hours',
    message: 'Dental Checkup with Dr. Aris scheduled for 11:30 AM today.',
    type: 'CALENDAR',
    read: true,
    timestamp: getRelativeDate(0) + ' 07:00',
    actionSection: 'calendar'
  },
  {
    id: 'notif-1304',
    title: 'Streak Milestone Achieved! 🔥',
    message: 'Congratulations! You reached a 14-day streak on Morning Deep Meditation.',
    type: 'HABIT',
    read: true,
    timestamp: getRelativeDate(-1) + ' 20:00',
    actionSection: 'goals-habits'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-1401',
    timestamp: getRelativeDate(0) + ' 08:00:15',
    actor: 'Automation Engine',
    action: 'RULE_TRIGGER: Document Expiration 60-Day Safety Gate',
    resource: 'doc-501 (Passport Scan)',
    riskLevel: 'INTERNAL_REVERSIBLE',
    status: 'PROPOSED',
    details: 'Created Approval Request #appr-1201 awaiting user consent.'
  },
  {
    id: 'aud-1402',
    timestamp: getRelativeDate(0) + ' 06:45:00',
    actor: 'LifeOS Daily Planner AI',
    action: 'SYNTHESIZE_DAILY_AGENDA',
    resource: 'My Day Workspace',
    riskLevel: 'READ_ONLY',
    status: 'COMPLETED',
    details: 'Generated prioritized timeline for 4 today commitments.'
  },
  {
    id: 'aud-1403',
    timestamp: getRelativeDate(-1) + ' 18:30:10',
    actor: 'Alex Mercer',
    action: 'UPDATE_TASK_STATUS',
    resource: 'tsk-106 (Review Cloud Infrastructure Bill)',
    riskLevel: 'INTERNAL_REVERSIBLE',
    status: 'COMPLETED',
    details: 'Changed status to COMPLETED.'
  }
];

export const INITIAL_AI_MESSAGES: AiChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    content: "👋 Hello Alex! I am **LifeOS Assistant**, your proactive personal intelligence system.\n\nHere is your quick summary for today:\n- ⚡ **2 high-priority tasks** due today (Financial Review Slides & Dental checkup)\n- 🚨 **1 overdue task**: Passport document scanning\n- 💳 **Upcoming bill**: MetroFiber Internet ($79.99 in 3 days)\n- 🔥 **Meditation streak**: 14 days active\n\nHow can I help you right now? You can ask me to **plan your day**, **break down a goal**, or **prepare for your CloudScale interview**.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];
