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

import {
  INITIAL_USER,
  INITIAL_TASKS,
  INITIAL_EVENTS,
  INITIAL_REMINDERS,
  INITIAL_BILLS,
  INITIAL_DOCUMENTS,
  INITIAL_GOALS,
  INITIAL_HABITS,
  INITIAL_LEARNING,
  INITIAL_CAREER,
  INITIAL_FAMILY,
  INITIAL_AUTOMATIONS,
  INITIAL_APPROVALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_AI_MESSAGES
} from './demoData';

const STORAGE_PREFIX = 'lifeos_v1_';

export interface LifeOSState {
  user: UserProfile;
  tasks: Task[];
  events: CalendarEvent[];
  reminders: Reminder[];
  bills: Bill[];
  documents: DocumentItem[];
  goals: Goal[];
  habits: Habit[];
  learning: LearningItem[];
  career: CareerApplication[];
  family: FamilyGroup;
  automations: AutomationRule[];
  approvals: ApprovalRequest[];
  notifications: NotificationItem[];
  auditLogs: AuditEvent[];
  aiMessages: AiChatMessage[];
}

export const loadLifeOSState = (): LifeOSState => {
  try {
    const rawUser = localStorage.getItem(STORAGE_PREFIX + 'user');
    if (!rawUser) {
      // First run: initialize with demo data
      return resetToDemoState();
    }

    return {
      user: JSON.parse(rawUser),
      tasks: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'tasks') || '[]'),
      events: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'events') || '[]'),
      reminders: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'reminders') || '[]'),
      bills: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'bills') || '[]'),
      documents: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'documents') || '[]'),
      goals: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'goals') || '[]'),
      habits: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'habits') || '[]'),
      learning: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'learning') || '[]'),
      career: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'career') || '[]'),
      family: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'family') || JSON.stringify(INITIAL_FAMILY)),
      automations: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'automations') || '[]'),
      approvals: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'approvals') || '[]'),
      notifications: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'notifications') || '[]'),
      auditLogs: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'auditLogs') || '[]'),
      aiMessages: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'aiMessages') || JSON.stringify(INITIAL_AI_MESSAGES))
    };
  } catch (error) {
    console.error('Failed to load state from localStorage, falling back to demo state:', error);
    return resetToDemoState();
  }
};

export const saveLifeOSState = (state: Partial<LifeOSState>) => {
  try {
    if (state.user) localStorage.setItem(STORAGE_PREFIX + 'user', JSON.stringify(state.user));
    if (state.tasks) localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(state.tasks));
    if (state.events) localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(state.events));
    if (state.reminders) localStorage.setItem(STORAGE_PREFIX + 'reminders', JSON.stringify(state.reminders));
    if (state.bills) localStorage.setItem(STORAGE_PREFIX + 'bills', JSON.stringify(state.bills));
    if (state.documents) localStorage.setItem(STORAGE_PREFIX + 'documents', JSON.stringify(state.documents));
    if (state.goals) localStorage.setItem(STORAGE_PREFIX + 'goals', JSON.stringify(state.goals));
    if (state.habits) localStorage.setItem(STORAGE_PREFIX + 'habits', JSON.stringify(state.habits));
    if (state.learning) localStorage.setItem(STORAGE_PREFIX + 'learning', JSON.stringify(state.learning));
    if (state.career) localStorage.setItem(STORAGE_PREFIX + 'career', JSON.stringify(state.career));
    if (state.family) localStorage.setItem(STORAGE_PREFIX + 'family', JSON.stringify(state.family));
    if (state.automations) localStorage.setItem(STORAGE_PREFIX + 'automations', JSON.stringify(state.automations));
    if (state.approvals) localStorage.setItem(STORAGE_PREFIX + 'approvals', JSON.stringify(state.approvals));
    if (state.notifications) localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(state.notifications));
    if (state.auditLogs) localStorage.setItem(STORAGE_PREFIX + 'auditLogs', JSON.stringify(state.auditLogs));
    if (state.aiMessages) localStorage.setItem(STORAGE_PREFIX + 'aiMessages', JSON.stringify(state.aiMessages));
  } catch (e) {
    console.error('Error saving state to localStorage', e);
  }
};

export const resetToDemoState = (): LifeOSState => {
  const demo: LifeOSState = {
    user: INITIAL_USER,
    tasks: INITIAL_TASKS,
    events: INITIAL_EVENTS,
    reminders: INITIAL_REMINDERS,
    bills: INITIAL_BILLS,
    documents: INITIAL_DOCUMENTS,
    goals: INITIAL_GOALS,
    habits: INITIAL_HABITS,
    learning: INITIAL_LEARNING,
    career: INITIAL_CAREER,
    family: INITIAL_FAMILY,
    automations: INITIAL_AUTOMATIONS,
    approvals: INITIAL_APPROVALS,
    notifications: INITIAL_NOTIFICATIONS,
    auditLogs: INITIAL_AUDIT_LOGS,
    aiMessages: INITIAL_AI_MESSAGES
  };

  saveLifeOSState(demo);
  return demo;
};

export const exportAllDataAsJson = (): string => {
  const current = loadLifeOSState();
  return JSON.stringify(current, null, 2);
};

export const exportTasksAsCsv = (): string => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'tasks') || '[]') as Task[];
  const headers = ['ID', 'Title', 'Priority', 'Status', 'Category', 'DueDate', 'DueTime', 'EstimatedDurationMin'];
  const rows = tasks.map(t => [
    t.id,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.priority,
    t.status,
    t.category,
    t.dueDate || '',
    t.dueTime || '',
    t.estimatedDurationMin || 0
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};
