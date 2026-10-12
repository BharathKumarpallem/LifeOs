export type NavSection =
  | 'overview'
  | 'my-day'
  | 'tasks'
  | 'calendar'
  | 'reminders'
  | 'bills'
  | 'documents'
  | 'goals-habits'
  | 'learning'
  | 'career'
  | 'family'
  | 'ai-assistant'
  | 'automations'
  | 'notifications'
  | 'settings';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'archived';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  category: 'personal' | 'work' | 'health' | 'finance' | 'learning' | 'family';
  status: TaskStatus;
  estimatedDurationMin?: number;
  tags: string[];
  subtasks: Subtask[];
  recurringSchedule?: 'none' | 'daily' | 'weekly' | 'monthly';
  reminderTime?: string;
  relatedDocumentId?: string;
  relatedGoalId?: string;
  familyAssigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timeZone: string;
  location?: string;
  isOnlineMeeting?: boolean;
  meetingLink?: string;
  category: 'personal' | 'medical' | 'education' | 'professional' | 'family';
  relatedContacts?: string[];
  reminderMinutesBefore?: number;
  isRecurring?: boolean;
  recurrenceRule?: 'daily' | 'weekly' | 'monthly';
}

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  priority: Priority;
  category: string;
  isCompleted: boolean;
  snoozedUntil?: string;
  relatedModule?: string;
  relatedEntityId?: string;
}

export interface Bill {
  id: string;
  name: string;
  category: 'utilities' | 'housing' | 'subscription' | 'insurance' | 'tax' | 'credit' | 'other';
  amount: number;
  currency: string;
  dueDate: string; // YYYY-MM-DD
  recurringInterval: 'none' | 'monthly' | 'quarterly' | 'yearly';
  paymentStatus: 'UNPAID' | 'PAID' | 'OVERDUE';
  reminderDaysBefore: number;
  payee?: string;
  notes?: string;
  paidDate?: string;
  paymentHistory: { date: string; amount: number; confirmationRef?: string }[];
}

export interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  category: 'identity' | 'education' | 'employment' | 'bills' | 'medical' | 'insurance' | 'personal' | 'other';
  tags: string[];
  issueDate?: string;
  expiryDate?: string;
  fileSizeKb: number;
  fileType: string;
  fileUrl?: string;
  isPrivate: boolean;
  aiExtractedSummary?: string;
  relatedTaskId?: string;
  relatedAppointmentId?: string;
  uploadedAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'health' | 'career' | 'financial' | 'personal' | 'education';
  startDate: string;
  targetDate: string;
  milestones: GoalMilestone[];
  progressPercent: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string;
  relatedTaskIds: string[];
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek: number;
  currentStreak: number;
  bestStreak: number;
  checkins: string[]; // List of YYYY-MM-DD
  isPaused: boolean;
  reminderTime?: string;
}

export interface StudyPlanItem {
  id: string;
  topic: string;
  durationMin: number;
  scheduledDate: string;
  completed: boolean;
}

export interface LearningItem {
  id: string;
  title: string;
  category: string;
  provider?: string;
  progressPercent: number;
  notes?: string;
  resources: { title: string; url: string }[];
  examDate?: string;
  assignmentDeadline?: string;
  studyPlan: StudyPlanItem[];
  completed: boolean;
}

export type ApplicationStatus = 'SAVED' | 'PLANNED' | 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';

export interface CareerApplication {
  id: string;
  company: string;
  role: string;
  jobPostingUrl?: string;
  salaryExpectation?: string;
  applicationDate: string;
  status: ApplicationStatus;
  contactName?: string;
  contactEmail?: string;
  interviewDate?: string;
  interviewNotes?: string;
  followUpDate?: string;
  notes?: string;
  resumeDocId?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'CHILD';
  avatar?: string;
}

export interface SharedShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  completed: boolean;
  addedBy: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  sharedShoppingList: SharedShoppingItem[];
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  condition: string;
  proposedAction: string;
  requiresApproval: boolean;
  isEnabled: boolean;
  lastRun?: string;
  executionCount: number;
  status: 'IDLE' | 'SUCCESS' | 'WAITING_APPROVAL' | 'FAILED';
  errorLog?: string;
}

export type ApprovalRiskLevel = 'READ_ONLY' | 'INTERNAL_REVERSIBLE' | 'EXTERNAL' | 'SENSITIVE_FINANCIAL';

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  actionType: string;
  riskLevel: ApprovalRiskLevel;
  serviceAffected: string;
  isReversible: boolean;
  payloadSummary: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  decidedAt?: string;
  decisionComments?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'TASK' | 'BILL' | 'CALENDAR' | 'HABIT' | 'SYSTEM' | 'APPROVAL' | 'FAMILY';
  read: boolean;
  timestamp: string;
  actionSection?: NavSection;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  riskLevel: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'FAILED';
  details?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  timeZone: string;
  preferredLanguage: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  theme: 'dark' | 'light';
  onboardingCompleted: boolean;
  enabledModules: string[];
  aiProvider: 'mock_intelligent' | 'openai' | 'anthropic';
  apiKeyConfigured: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'CREATE_TASK' | 'ADD_BILL' | 'SCHEDULE_EVENT' | 'SET_REMINDER' | 'GENERATE_PLAN';
    payload: any;
    label: string;
  };
}
