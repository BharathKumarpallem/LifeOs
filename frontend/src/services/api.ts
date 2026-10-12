import {
  Task, CalendarEvent, Reminder, Bill, DocumentItem, Goal, Habit,
  LearningItem, CareerApplication, FamilyGroup, AutomationRule,
  ApprovalRequest, NotificationItem, AuditEvent, UserProfile, AiChatMessage
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function safeFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      console.warn(`API call ${endpoint} returned status ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    // Backend offline or network failure — graceful degradation
    return null;
  }
}

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch('http://localhost:8000/health');
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth / Profile
  getProfile: () => safeFetch<UserProfile>('/auth/me'),
  updateProfile: (updates: Partial<UserProfile>) =>
    safeFetch<UserProfile>('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),
  resetDemo: () => safeFetch<{ status: string }>('/auth/reset-demo', { method: 'POST' }),

  // Tasks
  getTasks: () => safeFetch<Task[]>('/tasks'),
  createTask: (task: any) =>
    safeFetch<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id: string, updates: Partial<Task>) =>
    safeFetch<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteTask: (id: string) =>
    safeFetch<{ status: string }>(`/tasks/${id}`, { method: 'DELETE' }),
  toggleTask: (id: string) =>
    safeFetch<Task>(`/tasks/${id}/toggle`, { method: 'POST' }),
  toggleSubtask: (taskId: string, subtaskId: string) =>
    safeFetch<Task>(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`, { method: 'POST' }),

  // Calendar
  getEvents: () => safeFetch<CalendarEvent[]>('/calendar/events'),
  createEvent: (event: any) =>
    safeFetch<CalendarEvent>('/calendar/events', { method: 'POST', body: JSON.stringify(event) }),
  deleteEvent: (id: string) =>
    safeFetch<{ status: string }>(`/calendar/events/${id}`, { method: 'DELETE' }),

  // Reminders
  getReminders: () => safeFetch<Reminder[]>('/reminders'),
  createReminder: (reminder: any) =>
    safeFetch<Reminder>('/reminders', { method: 'POST', body: JSON.stringify(reminder) }),
  toggleReminder: (id: string) =>
    safeFetch<Reminder>(`/reminders/${id}/toggle`, { method: 'POST' }),
  snoozeReminder: (id: string, minutes: number) =>
    safeFetch<Reminder>(`/reminders/${id}/snooze?minutes=${minutes}`, { method: 'POST' }),
  deleteReminder: (id: string) =>
    safeFetch<{ status: string }>(`/reminders/${id}`, { method: 'DELETE' }),

  // Bills
  getBills: () => safeFetch<Bill[]>('/bills'),
  createBill: (bill: any) =>
    safeFetch<Bill>('/bills', { method: 'POST', body: JSON.stringify(bill) }),
  payBill: (id: string, confirmationRef?: string) =>
    safeFetch<Bill>(`/bills/${id}/pay`, { method: 'POST', body: JSON.stringify({ confirmationRef }) }),
  deleteBill: (id: string) =>
    safeFetch<{ status: string }>(`/bills/${id}`, { method: 'DELETE' }),

  // Documents
  getDocuments: () => safeFetch<DocumentItem[]>('/documents'),
  createDocument: (doc: any) =>
    safeFetch<DocumentItem>('/documents', { method: 'POST', body: JSON.stringify(doc) }),
  deleteDocument: (id: string) =>
    safeFetch<{ status: string }>(`/documents/${id}`, { method: 'DELETE' }),
  scanDocument: (id: string) =>
    safeFetch<DocumentItem>(`/documents/${id}/scan`, { method: 'POST' }),

  // Goals & Habits
  getGoals: () => safeFetch<Goal[]>('/goals'),
  createGoal: (goal: any) =>
    safeFetch<Goal>('/goals', { method: 'POST', body: JSON.stringify(goal) }),
  toggleMilestone: (goalId: string, milestoneId: string) =>
    safeFetch<Goal>(`/goals/${goalId}/milestones/${milestoneId}/toggle`, { method: 'POST' }),
  deleteGoal: (id: string) =>
    safeFetch<{ status: string }>(`/goals/${id}`, { method: 'DELETE' }),

  getHabits: () => safeFetch<Habit[]>('/habits'),
  createHabit: (habit: any) =>
    safeFetch<Habit>('/habits', { method: 'POST', body: JSON.stringify(habit) }),
  toggleHabitToday: (id: string) =>
    safeFetch<Habit>(`/habits/${id}/checkin`, { method: 'POST' }),
  deleteHabit: (id: string) =>
    safeFetch<{ status: string }>(`/habits/${id}`, { method: 'DELETE' }),

  // Learning
  getLearning: () => safeFetch<LearningItem[]>('/learning'),
  createLearning: (item: any) =>
    safeFetch<LearningItem>('/learning', { method: 'POST', body: JSON.stringify(item) }),
  toggleStudyPlan: (learningId: string, planId: string) =>
    safeFetch<LearningItem>(`/learning/${learningId}/study-plan/${planId}/toggle`, { method: 'POST' }),
  deleteLearning: (id: string) =>
    safeFetch<{ status: string }>(`/learning/${id}`, { method: 'DELETE' }),

  // Career
  getCareer: () => safeFetch<CareerApplication[]>('/career'),
  createCareer: (career: any) =>
    safeFetch<CareerApplication>('/career', { method: 'POST', body: JSON.stringify(career) }),
  deleteCareer: (id: string) =>
    safeFetch<{ status: string }>(`/career/${id}`, { method: 'DELETE' }),

  // Family
  getFamily: () => safeFetch<FamilyGroup>('/family'),
  inviteFamilyMember: (member: any) =>
    safeFetch<any>('/family/members', { method: 'POST', body: JSON.stringify(member) }),
  addShoppingItem: (item: any) =>
    safeFetch<any>('/family/shopping', { method: 'POST', body: JSON.stringify(item) }),
  toggleShoppingItem: (id: string) =>
    safeFetch<any>(`/family/shopping/${id}/toggle`, { method: 'POST' }),
  deleteShoppingItem: (id: string) =>
    safeFetch<{ status: string }>(`/family/shopping/${id}`, { method: 'DELETE' }),

  // AI Assistant Chat
  sendAiChat: (prompt: string, provider?: string) =>
    safeFetch<{ message: AiChatMessage; contextRetrieved: any; providerUsed: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, provider })
    }),

  // Automations & Approvals
  getAutomations: () => safeFetch<AutomationRule[]>('/automations'),
  toggleAutomation: (id: string) =>
    safeFetch<AutomationRule>(`/automations/${id}/toggle`, { method: 'POST' }),
  runAutomation: (id: string) =>
    safeFetch<any>(`/automations/${id}/run`, { method: 'POST' }),

  getApprovals: () => safeFetch<ApprovalRequest[]>('/approvals'),
  decideApproval: (id: string, approved: boolean, comments?: string) =>
    safeFetch<ApprovalRequest>(`/approvals/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ approved, comments })
    }),

  // Notifications & Audit
  getNotifications: () => safeFetch<NotificationItem[]>('/notifications'),
  markNotificationRead: (id: string) =>
    safeFetch<NotificationItem>(`/notifications/${id}/read`, { method: 'POST' }),
  clearNotifications: () =>
    safeFetch<{ status: string }>('/notifications', { method: 'DELETE' }),

  getAuditLogs: () => safeFetch<AuditEvent[]>('/audit/logs')
};
