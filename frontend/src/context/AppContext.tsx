import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  NavSection,
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
  loadLifeOSState,
  saveLifeOSState,
  resetToDemoState,
  LifeOSState
} from '../services/storage';
import { api } from '../services/api';

interface AppContextType {
  // Navigation
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddType: 'task' | 'event' | 'reminder' | 'bill' | 'goal' | 'document';
  openQuickAdd: (type?: 'task' | 'event' | 'reminder' | 'bill' | 'goal' | 'document') => void;

  // User & Settings
  user: UserProfile;
  updateUser: (profile: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  resetAllDemoData: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Calendar
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
  snoozeReminder: (id: string, minutes: number) => void;
  deleteReminder: (id: string) => void;

  // Bills
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id' | 'paymentHistory'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  markBillPaid: (id: string, confirmationRef?: string) => void;
  deleteBill: (id: string) => void;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  simulateAiScan: (docId: string) => void;

  // Goals & Habits
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'progressPercent'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'checkins'>) => void;
  toggleHabitToday: (id: string) => void;
  deleteHabit: (id: string) => void;

  // Learning
  learning: LearningItem[];
  addLearning: (item: Omit<LearningItem, 'id' | 'progressPercent' | 'completed'>) => void;
  updateLearning: (id: string, updates: Partial<LearningItem>) => void;
  toggleStudyPlanItem: (learningId: string, planItemId: string) => void;
  deleteLearning: (id: string) => void;

  // Career
  career: CareerApplication[];
  addCareer: (app: Omit<CareerApplication, 'id'>) => void;
  updateCareer: (id: string, updates: Partial<CareerApplication>) => void;
  deleteCareer: (id: string) => void;

  // Family
  family: FamilyGroup;
  addFamilyMember: (member: { name: string; email: string; role: 'ADMIN' | 'MEMBER' | 'CHILD' }) => void;
  addShoppingItem: (name: string, quantity?: string) => void;
  toggleShoppingItem: (id: string) => void;
  deleteShoppingItem: (id: string) => void;

  // Automations
  automations: AutomationRule[];
  toggleAutomation: (id: string) => void;
  addAutomation: (rule: Omit<AutomationRule, 'id' | 'executionCount' | 'status'>) => void;
  runAutomationNow: (id: string) => void;

  // Approvals
  approvals: ApprovalRequest[];
  respondApproval: (id: string, decision: 'APPROVED' | 'REJECTED', comments?: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Audit Logs
  auditLogs: AuditEvent[];
  logAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;

  // AI Assistant
  aiMessages: AiChatMessage[];
  sendAiMessage: (content: string) => Promise<void>;
  isAiThinking: boolean;

  // Visual celebration
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LifeOSState>(loadLifeOSState);
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [quickAddType, setQuickAddType] = useState<'task' | 'event' | 'reminder' | 'bill' | 'goal' | 'document'>('task');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Sync state changes to storage
  useEffect(() => {
    saveLifeOSState(state);
  }, [state]);

  // Initial bi-directional hydration from FastAPI backend
  useEffect(() => {
    const hydrateFromBackend = async () => {
      try {
        const isHealthy = await api.checkHealth();
        if (!isHealthy) return;

        const [
          remoteTasks,
          remoteEvents,
          remoteReminders,
          remoteBills,
          remoteDocs,
          remoteGoals,
          remoteHabits,
          remoteLearning,
          remoteCareer,
          remoteFamily,
          remoteAutomations,
          remoteApprovals,
          remoteNotifications
        ] = await Promise.all([
          api.getTasks(),
          api.getEvents(),
          api.getReminders(),
          api.getBills(),
          api.getDocuments(),
          api.getGoals(),
          api.getHabits(),
          api.getLearning(),
          api.getCareer(),
          api.getFamily(),
          api.getAutomations(),
          api.getApprovals(),
          api.getNotifications()
        ]);

        setState(prev => ({
          ...prev,
          tasks: remoteTasks && remoteTasks.length > 0 ? remoteTasks : prev.tasks,
          events: remoteEvents && remoteEvents.length > 0 ? remoteEvents : prev.events,
          reminders: remoteReminders && remoteReminders.length > 0 ? remoteReminders : prev.reminders,
          bills: remoteBills && remoteBills.length > 0 ? remoteBills : prev.bills,
          documents: remoteDocs && remoteDocs.length > 0 ? remoteDocs : prev.documents,
          goals: remoteGoals && remoteGoals.length > 0 ? remoteGoals : prev.goals,
          habits: remoteHabits && remoteHabits.length > 0 ? remoteHabits : prev.habits,
          learning: remoteLearning && remoteLearning.length > 0 ? remoteLearning : prev.learning,
          career: remoteCareer && remoteCareer.length > 0 ? remoteCareer : prev.career,
          family: remoteFamily ? remoteFamily : prev.family,
          automations: remoteAutomations && remoteAutomations.length > 0 ? remoteAutomations : prev.automations,
          approvals: remoteApprovals && remoteApprovals.length > 0 ? remoteApprovals : prev.approvals,
          notifications: remoteNotifications && remoteNotifications.length > 0 ? remoteNotifications : prev.notifications
        }));
      } catch (err) {
        console.warn('FastAPI backend sync skipped, operating in local-first mode:', err);
      }
    };

    hydrateFromBackend();
  }, []);

  // Apply dark / light theme class to html root
  useEffect(() => {
    const root = document.documentElement;
    if (state.user.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [state.user.theme]);

  // Confetti celebration
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#14b8a6', '#6366f1', '#f59e0b', '#ec4899']
      });
    } catch {
      // safe fallback
    }
  };

  const openQuickAdd = (type: 'task' | 'event' | 'reminder' | 'bill' | 'goal' | 'document' = 'task') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  // User Profile
  const updateUser = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...updates }
    }));
    logAuditEvent({
      actor: state.user.name,
      action: 'UPDATE_PROFILE',
      resource: 'User Profile & Settings',
      riskLevel: 'LOW',
      status: 'COMPLETED',
      details: 'Updated user preferences'
    });
  };

  const toggleTheme = () => {
    const newTheme = state.user.theme === 'dark' ? 'light' : 'dark';
    updateUser({ theme: newTheme });
  };

  const resetAllDemoData = () => {
    const fresh = resetToDemoState();
    setState(fresh);
    addNotification({
      title: 'Demo Data Reset',
      message: 'LifeOS has been reset to the default curated demo records.',
      type: 'SYSTEM',
      actionSection: 'overview'
    });
  };

  // Audit Logger
  const logAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newLog: AuditEvent = {
      ...event,
      id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setState(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs]
    }));
  };

  // Notifications
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now(),
      read: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setState(prev => ({
      ...prev,
      notifications: [item, ...prev.notifications]
    }));
  };

  const markNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const clearAllNotifications = () => {
    setState(prev => ({ ...prev, notifications: [] }));
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'tsk-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
    // Async background sync to FastAPI backend
    api.createTask(newTask).catch(e => console.warn('Backend sync failed:', e));
    logAuditEvent({
      actor: state.user.name,
      action: 'CREATE_TASK',
      resource: newTask.title,
      riskLevel: 'LOW',
      status: 'COMPLETED'
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    }));
    // Async background sync to FastAPI backend
    api.updateTask(id, updates).catch(e => console.warn('Backend sync failed:', e));
  };

  const deleteTask = (id: string) => {
    const item = state.tasks.find(t => t.id === id);
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
    // Async background sync to FastAPI backend
    api.deleteTask(id).catch(e => console.warn('Backend sync failed:', e));
    logAuditEvent({
      actor: state.user.name,
      action: 'DELETE_TASK',
      resource: item?.title || id,
      riskLevel: 'LOW',
      status: 'COMPLETED'
    });
  };

  const toggleTaskComplete = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    const isNowCompleted = task.status !== 'completed';
    const newStatus = isNowCompleted ? 'completed' : 'not_started';
    updateTask(id, { status: newStatus });
    // Async background sync to FastAPI backend
    api.toggleTask(id).catch(e => console.warn('Backend sync failed:', e));

    if (isNowCompleted) {
      triggerConfetti();
      addNotification({
        title: 'Task Completed! 🎯',
        message: `"${task.title}" was marked as completed.`,
        type: 'TASK',
        actionSection: 'tasks'
      });
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
      })
    }));
    // Async background sync to FastAPI backend
    api.toggleSubtask(taskId, subtaskId).catch(e => console.warn('Backend sync failed:', e));
  };

  // Calendar Events
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'evt-' + Date.now()
    };
    setState(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
    // Async background sync to FastAPI backend
    api.createEvent(newEvent).catch(e => console.warn('Backend sync failed:', e));
    logAuditEvent({
      actor: state.user.name,
      action: 'CREATE_EVENT',
      resource: newEvent.title,
      riskLevel: 'LOW',
      status: 'COMPLETED'
    });
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const deleteEvent = (id: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id)
    }));
    // Async background sync to FastAPI backend
    api.deleteEvent(id).catch(e => console.warn('Backend sync failed:', e));
  };

  // Reminders
  const addReminder = (remData: Omit<Reminder, 'id'>) => {
    const newRem: Reminder = {
      ...remData,
      id: 'rem-' + Date.now()
    };
    setState(prev => ({
      ...prev,
      reminders: [newRem, ...prev.reminders]
    }));
    // Async background sync to FastAPI backend
    api.createReminder(newRem).catch(e => console.warn('Backend sync failed:', e));
  };

  const toggleReminder = (id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r)
    }));
    // Async background sync to FastAPI backend
    api.toggleReminder(id).catch(e => console.warn('Backend sync failed:', e));
  };

  const snoozeReminder = (id: string, minutes: number) => {
    const d = new Date(Date.now() + minutes * 60000);
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, snoozedUntil: d.toISOString() } : r)
    }));
    // Async background sync to FastAPI backend
    api.snoozeReminder(id, minutes).catch(e => console.warn('Backend sync failed:', e));
    addNotification({
      title: 'Reminder Snoozed',
      message: `Snoozed for ${minutes} minutes.`,
      type: 'SYSTEM',
      actionSection: 'reminders'
    });
  };

  const deleteReminder = (id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
    // Async background sync to FastAPI backend
    api.deleteReminder(id).catch(e => console.warn('Backend sync failed:', e));
  };

  // Bills
  const addBill = (billData: Omit<Bill, 'id' | 'paymentHistory'>) => {
    const newBill: Bill = {
      ...billData,
      id: 'bil-' + Date.now(),
      paymentHistory: []
    };
    setState(prev => ({
      ...prev,
      bills: [newBill, ...prev.bills]
    }));
    // Async background sync to FastAPI backend
    api.createBill(newBill).catch(e => console.warn('Backend sync failed:', e));
    logAuditEvent({
      actor: state.user.name,
      action: 'ADD_BILL',
      resource: `${newBill.name} ($${newBill.amount})`,
      riskLevel: 'LOW',
      status: 'COMPLETED'
    });
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setState(prev => ({
      ...prev,
      bills: prev.bills.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const markBillPaid = (id: string, confirmationRef?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      bills: prev.bills.map(b => {
        if (b.id !== id) return b;
        return {
          ...b,
          paymentStatus: 'PAID',
          paidDate: today,
          paymentHistory: [
            { date: today, amount: b.amount, confirmationRef: confirmationRef || 'MANUAL-CONFIRM-' + Math.floor(Math.random() * 89999 + 10000) },
            ...b.paymentHistory
          ]
        };
      })
    }));
    // Async background sync to FastAPI backend
    api.payBill(id, confirmationRef).catch(e => console.warn('Backend sync failed:', e));
    triggerConfetti();
    logAuditEvent({
      actor: state.user.name,
      action: 'MARK_BILL_PAID',
      resource: `Bill ID ${id}`,
      riskLevel: 'INTERNAL_REVERSIBLE',
      status: 'COMPLETED',
      details: `User manually confirmed payment with ref ${confirmationRef || 'MANUAL'}`
    });
  };

  const deleteBill = (id: string) => {
    setState(prev => ({
      ...prev,
      bills: prev.bills.filter(b => b.id !== id)
    }));
    // Async background sync to FastAPI backend
    api.deleteBill(id).catch(e => console.warn('Backend sync failed:', e));
  };

  // Documents
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: 'doc-' + Date.now(),
      uploadedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
    logAuditEvent({
      actor: state.user.name,
      action: 'UPLOAD_DOCUMENT',
      resource: newDoc.title,
      riskLevel: 'LOW',
      status: 'COMPLETED'
    });
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
  };

  const deleteDocument = (id: string) => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
    logAuditEvent({
      actor: state.user.name,
      action: 'DELETE_DOCUMENT',
      resource: `Doc ID ${id}`,
      riskLevel: 'LOW',
      status: 'COMPLETED'
    });
  };

  const simulateAiScan = (docId: string) => {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) return;
    const summaries = [
      `AI Verified: High-fidelity document verified. Contains official watermark and legal validity through ${doc.expiryDate || '2027'}.`,
      `Extracted Key Terms: Verified issuer signature, reference code #DOC-${Math.floor(Math.random() * 89999 + 10000)}, compliance status: PASSED.`
    ];
    const generated = summaries[Math.floor(Math.random() * summaries.length)];
    updateDocument(docId, { aiExtractedSummary: generated });
    addNotification({
      title: 'AI Document Scan Complete 📄',
      message: `Extracted key metadata for "${doc.title}".`,
      type: 'SYSTEM',
      actionSection: 'documents'
    });
  };

  // Goals
  const addGoal = (goalData: Omit<Goal, 'id' | 'progressPercent'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: 'gol-' + Date.now(),
      progressPercent: 0
    };
    setState(prev => ({
      ...prev,
      goals: [newGoal, ...prev.goals]
    }));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : g.progressPercent;
        const status = progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
        return {
          ...g,
          milestones: updatedMilestones,
          progressPercent: progress,
          status
        };
      })
    }));
    triggerConfetti();
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  // Habits
  const addHabit = (habitData: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'checkins'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'hab-' + Date.now(),
      currentStreak: 0,
      bestStreak: 0,
      checkins: []
    };
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }));
  };

  const toggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== id) return h;
        const hasCheckedIn = h.checkins.includes(today);
        let updatedCheckins: string[];
        let streak = h.currentStreak;

        if (hasCheckedIn) {
          updatedCheckins = h.checkins.filter(d => d !== today);
          streak = Math.max(0, streak - 1);
        } else {
          updatedCheckins = [today, ...h.checkins];
          streak = streak + 1;
        }

        const bestStreak = Math.max(h.bestStreak, streak);
        return {
          ...h,
          checkins: updatedCheckins,
          currentStreak: streak,
          bestStreak
        };
      })
    }));
    triggerConfetti();
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
  };

  // Learning
  const addLearning = (itemData: Omit<LearningItem, 'id' | 'progressPercent' | 'completed'>) => {
    const newItem: LearningItem = {
      ...itemData,
      id: 'lrn-' + Date.now(),
      progressPercent: 0,
      completed: false
    };
    setState(prev => ({
      ...prev,
      learning: [newItem, ...prev.learning]
    }));
  };

  const updateLearning = (id: string, updates: Partial<LearningItem>) => {
    setState(prev => ({
      ...prev,
      learning: prev.learning.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const toggleStudyPlanItem = (learningId: string, planItemId: string) => {
    setState(prev => ({
      ...prev,
      learning: prev.learning.map(l => {
        if (l.id !== learningId) return l;
        const updatedPlan = l.studyPlan.map(sp => sp.id === planItemId ? { ...sp, completed: !sp.completed } : sp);
        const comp = updatedPlan.filter(sp => sp.completed).length;
        const progress = updatedPlan.length > 0 ? Math.round((comp / updatedPlan.length) * 100) : l.progressPercent;
        return {
          ...l,
          studyPlan: updatedPlan,
          progressPercent: progress,
          completed: progress === 100
        };
      })
    }));
  };

  const deleteLearning = (id: string) => {
    setState(prev => ({
      ...prev,
      learning: prev.learning.filter(l => l.id !== id)
    }));
  };

  // Career
  const addCareer = (appData: Omit<CareerApplication, 'id'>) => {
    const newApp: CareerApplication = {
      ...appData,
      id: 'car-' + Date.now()
    };
    setState(prev => ({
      ...prev,
      career: [newApp, ...prev.career]
    }));
  };

  const updateCareer = (id: string, updates: Partial<CareerApplication>) => {
    setState(prev => ({
      ...prev,
      career: prev.career.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteCareer = (id: string) => {
    setState(prev => ({
      ...prev,
      career: prev.career.filter(c => c.id !== id)
    }));
  };

  // Family
  const addFamilyMember = (member: { name: string; email: string; role: 'ADMIN' | 'MEMBER' | 'CHILD' }) => {
    const newMem = {
      ...member,
      id: 'mem-' + Date.now(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    setState(prev => ({
      ...prev,
      family: {
        ...prev.family,
        members: [...prev.family.members, newMem]
      }
    }));
    addNotification({
      title: 'Family Member Invited',
      message: `Invitation generated for ${member.name} (${member.email}).`,
      type: 'FAMILY',
      actionSection: 'family'
    });
  };

  const addShoppingItem = (name: string, quantity?: string) => {
    const newItem = {
      id: 'shp-' + Date.now(),
      name,
      quantity,
      completed: false,
      addedBy: state.user.name
    };
    setState(prev => ({
      ...prev,
      family: {
        ...prev.family,
        sharedShoppingList: [newItem, ...prev.family.sharedShoppingList]
      }
    }));
  };

  const toggleShoppingItem = (id: string) => {
    setState(prev => ({
      ...prev,
      family: {
        ...prev.family,
        sharedShoppingList: prev.family.sharedShoppingList.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
      }
    }));
  };

  const deleteShoppingItem = (id: string) => {
    setState(prev => ({
      ...prev,
      family: {
        ...prev.family,
        sharedShoppingList: prev.family.sharedShoppingList.filter(item => item.id !== id)
      }
    }));
  };

  // Automations
  const toggleAutomation = (id: string) => {
    setState(prev => ({
      ...prev,
      automations: prev.automations.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a)
    }));
  };

  const addAutomation = (ruleData: Omit<AutomationRule, 'id' | 'executionCount' | 'status'>) => {
    const newRule: AutomationRule = {
      ...ruleData,
      id: 'aut-' + Date.now(),
      executionCount: 0,
      status: 'IDLE'
    };
    setState(prev => ({
      ...prev,
      automations: [newRule, ...prev.automations]
    }));
  };

  const runAutomationNow = (id: string) => {
    const rule = state.automations.find(a => a.id === id);
    if (!rule) return;

    setState(prev => ({
      ...prev,
      automations: prev.automations.map(a => a.id === id ? {
        ...a,
        executionCount: a.executionCount + 1,
        lastRun: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: a.requiresApproval ? 'WAITING_APPROVAL' : 'SUCCESS'
      } : a)
    }));

    if (rule.requiresApproval) {
      const newAppr: ApprovalRequest = {
        id: 'appr-' + Date.now(),
        title: `Automation: ${rule.name}`,
        description: rule.proposedAction,
        actionType: 'AUTOMATION_EXECUTION',
        riskLevel: 'INTERNAL_REVERSIBLE',
        serviceAffected: 'LifeOS Internal',
        isReversible: true,
        payloadSummary: rule.condition,
        status: 'PENDING',
        requestedAt: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        approvals: [newAppr, ...prev.approvals]
      }));
      addNotification({
        title: 'Action Requires Approval 🛡️',
        message: `Automation "${rule.name}" proposed an action requiring user sign-off.`,
        type: 'APPROVAL',
        actionSection: 'automations'
      });
    } else {
      addNotification({
        title: 'Automation Executed ✨',
        message: `Rule "${rule.name}" triggered and ran successfully.`,
        type: 'SYSTEM',
        actionSection: 'automations'
      });
    }

    logAuditEvent({
      actor: 'Automation Engine',
      action: `RUN_AUTOMATION: ${rule.name}`,
      resource: rule.proposedAction,
      riskLevel: rule.requiresApproval ? 'MEDIUM' : 'LOW',
      status: rule.requiresApproval ? 'PROPOSED' : 'COMPLETED'
    });
  };

  // Approvals
  const respondApproval = (id: string, decision: 'APPROVED' | 'REJECTED', comments?: string) => {
    setState(prev => ({
      ...prev,
      approvals: prev.approvals.map(a => a.id === id ? {
        ...a,
        status: decision,
        decidedAt: new Date().toISOString(),
        decisionComments: comments
      } : a)
    }));

    logAuditEvent({
      actor: state.user.name,
      action: `APPROVAL_${decision}`,
      resource: `Approval ID ${id}`,
      riskLevel: 'MEDIUM',
      status: decision === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      details: comments || 'Decided by user'
    });

    addNotification({
      title: `Action ${decision === 'APPROVED' ? 'Approved ✅' : 'Rejected ❌'}`,
      message: `The pending request was ${decision.toLowerCase()}.`,
      type: 'APPROVAL',
      actionSection: 'automations'
    });
  };

  // AI Assistant Chat Handler
  const sendAiMessage = async (content: string) => {
    const userMsg: AiChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setState(prev => ({
      ...prev,
      aiMessages: [...prev.aiMessages, userMsg]
    }));

    setIsAiThinking(true);

    try {
      // First attempt to call the FastAPI backend AI service proxy
      const backendRes = await api.sendAiChat(content, state.user.aiProvider);
      if (backendRes && backendRes.message) {
        setState(prev => ({
          ...prev,
          aiMessages: [...prev.aiMessages, backendRes.message]
        }));
        setIsAiThinking(false);
        return;
      }
    } catch (e) {
      console.warn('Backend AI service unreachable, using local intelligent engine fallback:', e);
    }

    // Realistic intelligent response synthesis fallback based on active data
    setTimeout(() => {
      let reply = '';
      const lower = content.toLowerCase();

      if (lower.includes('plan my day') || lower.includes('daily plan')) {
        const todayTasks = state.tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && t.status !== 'completed');
        reply = `### ☀️ Proposed Smart Daily Plan for Today\n\nBased on your active commitments and energy curves, here is your prioritized schedule:\n\n1. **08:30 - 09:00**: Morning Habit (Meditation & Hydration)\n2. **09:30 - 11:00**: 🎯 **Deep Focus**: Finish Quarterly Financial Review Slides (${todayTasks.length > 0 ? todayTasks[0].title : 'High Priority Work'})\n3. **11:30 - 12:30**: 📅 Dental Appointment with Dr. Aris (Midtown)\n4. **14:00 - 15:00**: 💼 System Design Sync with Principal Team\n5. **16:00 - 17:00**: 📚 30-min Technical Reading & Raft Review\n\n*Would you like me to time-block this directly into your **My Day** workspace?*`;
      } else if (lower.includes('bill') || lower.includes('deadline')) {
        const unpaid = state.bills.filter(b => b.paymentStatus !== 'PAID');
        const total = unpaid.reduce((acc, curr) => acc + curr.amount, 0);
        reply = `### 💳 Upcoming Financial Obligations\n\nYou currently have **${unpaid.length} bills pending** for a total of **$${total.toFixed(2)}**:\n\n` +
          unpaid.map(b => `- **${b.name}**: $${b.amount.toFixed(2)} due on ${b.dueDate} (${b.paymentStatus === 'OVERDUE' ? '🚨 OVERDUE' : 'Due Soon'})`).join('\n') +
          `\n\n*Tip: You can mark any bill as paid with 1 click in the Bills & Deadlines view without entering banking credentials.*`;
      } else if (lower.includes('interview') || lower.includes('career') || lower.includes('cloudscale')) {
        reply = `### 🎯 Staff Infrastructure Architect Interview Prep\n\nHere are targeted preparation areas for your upcoming CloudScale Technologies round:\n\n- **1. Multi-Region Resiliency**: Disaster recovery scenarios, Active-Active database replication tradeoffs, and Global Anycast BGP routing.\n- **2. Cost & Scale Optimization**: Auto-scaling pod topology vs spot-instance fault tolerance.\n- **3. Behavioral Leadership**: Mentoring senior engineers, navigating cross-team architectural disagreements.\n\n*All relevant notes are saved in your **Work & Career** module.*`;
      } else if (lower.includes('document') || lower.includes('passport')) {
        const expiring = state.documents.filter(d => d.expiryDate);
        reply = `### 📂 Document Vault Status\n\nI checked your vault records:\n- 🚨 **Passport Scan (Biometric)** is expiring in 45 days. An approval gate is currently waiting to schedule your consular renewal submission.\n- 📄 Residential lease is securely filed until 2027.\n\nAll documents are encrypted with private local-first zero-knowledge controls.`;
      } else if (lower.includes('break') && (lower.includes('goal') || lower.includes('down'))) {
        reply = `### 🚀 Actionable Goal Breakdown\n\nI can break down your active goals into weekly sub-actions:\n- **Milestone 1**: Review top 5 distributed consensus design patterns (3 hrs this week)\n- **Milestone 2**: Conduct 1 timed mock interview with peer feedback\n- **Milestone 3**: Review negotiation leverage benchmarks\n\nShall I add these as prioritized tasks to your Tasks board?`;
      } else {
        reply = `I analyzed your request against your LifeOS data. Everything is synchronized across **${state.tasks.length} tasks**, **${state.bills.length} bills**, **${state.events.length} appointments**, and **${state.habits.length} habits**.\n\nYou can ask me specific actions such as:\n- *"Plan my day around high priority tasks"*\n- *"What bills are due this month?"*\n- *"Summarize documents expiring soon"*\n- *"Help me prepare for my upcoming interview"*`;
      }

      const botMsg: AiChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setState(prev => ({
        ...prev,
        aiMessages: [...prev.aiMessages, botMsg]
      }));

      setIsAiThinking(false);
    }, 700);
  };

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSearchOpen,
        setIsSearchOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddType,
        openQuickAdd,
        user: state.user,
        updateUser,
        toggleTheme,
        resetAllDemoData,
        tasks: state.tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleSubtask,
        events: state.events,
        addEvent,
        updateEvent,
        deleteEvent,
        reminders: state.reminders,
        addReminder,
        toggleReminder,
        snoozeReminder,
        deleteReminder,
        bills: state.bills,
        addBill,
        updateBill,
        markBillPaid,
        deleteBill,
        documents: state.documents,
        addDocument,
        updateDocument,
        deleteDocument,
        simulateAiScan,
        goals: state.goals,
        addGoal,
        updateGoal,
        toggleMilestone,
        deleteGoal,
        habits: state.habits,
        addHabit,
        toggleHabitToday,
        deleteHabit,
        learning: state.learning,
        addLearning,
        updateLearning,
        toggleStudyPlanItem,
        deleteLearning,
        career: state.career,
        addCareer,
        updateCareer,
        deleteCareer,
        family: state.family,
        addFamilyMember,
        addShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        automations: state.automations,
        toggleAutomation,
        addAutomation,
        runAutomationNow,
        approvals: state.approvals,
        respondApproval,
        notifications: state.notifications,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        auditLogs: state.auditLogs,
        logAuditEvent,
        aiMessages: state.aiMessages,
        sendAiMessage,
        isAiThinking,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
