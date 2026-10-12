import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Calendar,
  Bell,
  CreditCard,
  Flame,
  FolderLock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority } from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddType,
    addTask,
    addEvent,
    addReminder,
    addBill,
    addGoal,
    addDocument,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'task' | 'event' | 'reminder' | 'bill' | 'goal' | 'document'>(quickAddType);

  // Sync default tab when modal opens
  useEffect(() => {
    setActiveTab(quickAddType);
  }, [quickAddType]);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskDueTime, setTaskDueTime] = useState('12:00');
  const [taskCategory, setTaskCategory] = useState<'personal' | 'work' | 'health' | 'finance' | 'learning' | 'family'>('work');
  const [taskTags, setTaskTags] = useState('');

  // Event states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventStartTime, setEventStartTime] = useState('10:00');
  const [eventEndTime, setEventEndTime] = useState('11:00');
  const [eventLocation, setEventLocation] = useState('');
  const [eventMeetingLink, setEventMeetingLink] = useState('');
  const [eventCategory, setEventCategory] = useState<'personal' | 'medical' | 'education' | 'professional' | 'family'>('professional');

  // Reminder states
  const [remTitle, setRemTitle] = useState('');
  const [remDueDate, setRemDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [remDueTime, setRemDueTime] = useState('09:00');

  // Bill states
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [billCategory, setBillCategory] = useState<'utilities' | 'housing' | 'subscription' | 'insurance' | 'tax' | 'credit' | 'other'>('utilities');
  const [billPayee, setBillPayee] = useState('');

  // Goal states
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalCategory, setGoalCategory] = useState<'health' | 'career' | 'financial' | 'personal' | 'education'>('career');

  // Document states
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'identity' | 'education' | 'employment' | 'bills' | 'medical' | 'insurance' | 'personal' | 'other'>('personal');

  if (!isQuickAddOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      priority: taskPriority,
      category: taskCategory,
      status: 'not_started',
      dueDate: taskDueDate,
      dueTime: taskDueTime,
      tags: taskTags ? taskTags.split(',').map(s => s.trim()).filter(Boolean) : ['QuickCapture'],
      subtasks: []
    });
    setTaskTitle('');
    setIsQuickAddOpen(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    addEvent({
      title: eventTitle.trim(),
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      timeZone: user.timeZone.split(' ')[0],
      location: eventLocation || undefined,
      isOnlineMeeting: Boolean(eventMeetingLink),
      meetingLink: eventMeetingLink || undefined,
      category: eventCategory
    });
    setEventTitle('');
    setIsQuickAddOpen(false);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle.trim()) return;
    addReminder({
      title: remTitle.trim(),
      dueDate: remDueDate,
      dueTime: remDueTime,
      recurrence: 'none',
      priority: 'medium',
      category: 'General',
      isCompleted: false
    });
    setRemTitle('');
    setIsQuickAddOpen(false);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billName.trim() || !billAmount) return;
    addBill({
      name: billName.trim(),
      amount: parseFloat(billAmount) || 0,
      currency: 'USD',
      dueDate: billDueDate,
      category: billCategory,
      recurringInterval: 'monthly',
      paymentStatus: 'UNPAID',
      reminderDaysBefore: 3,
      payee: billPayee.trim() || undefined
    });
    setBillName('');
    setBillAmount('');
    setIsQuickAddOpen(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: goalTargetDate || new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      status: 'NOT_STARTED',
      milestones: [
        { id: 'm-' + Date.now(), title: 'Define key objective requirements', completed: false }
      ],
      relatedTaskIds: []
    });
    setGoalTitle('');
    setIsQuickAddOpen(false);
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    addDocument({
      title: docTitle.trim(),
      category: docCategory,
      tags: ['Uploaded', docCategory],
      fileSizeKb: Math.floor(Math.random() * 2000 + 400),
      fileType: 'application/pdf',
      isPrivate: true,
      aiExtractedSummary: 'Document securely placed in local-first encrypted vault storage.'
    });
    setDocTitle('');
    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <span className="font-bold text-base text-slate-100">Quick Create Action</span>
          <button onClick={() => setIsQuickAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-2 overflow-x-auto">
          {[
            { id: 'task', label: 'Task', icon: CheckSquare },
            { id: 'event', label: 'Event', icon: Calendar },
            { id: 'reminder', label: 'Reminder', icon: Bell },
            { id: 'bill', label: 'Bill', icon: CreditCard },
            { id: 'goal', label: 'Goal', icon: Flame },
            { id: 'document', label: 'Doc', icon: FolderLock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap
                  ${isActive
                    ? 'border-teal-500 text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Form */}
        <div className="p-5">
          {activeTab === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare presentation slides"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="learning">Learning</option>
                    <option value="family">Family</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Review, Urgent, Client"
                  value={taskTags}
                  onChange={(e) => setTaskTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-teal-500/20"
              >
                Create Task
              </button>
            </form>
          )}

          {activeTab === 'event' && (
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dental appointment or Team sync"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="professional">Professional</option>
                  <option value="medical">Medical</option>
                  <option value="personal">Personal</option>
                  <option value="education">Education</option>
                  <option value="family">Family</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location or Meeting Link</label>
                <input
                  type="text"
                  placeholder="https://meet.jit.si/... or Suite 402"
                  value={eventMeetingLink || eventLocation}
                  onChange={(e) => {
                    if (e.target.value.startsWith('http')) {
                      setEventMeetingLink(e.target.value);
                      setEventLocation('');
                    } else {
                      setEventLocation(e.target.value);
                      setEventMeetingLink('');
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
              >
                Schedule Event
              </button>
            </form>
          )}

          {activeTab === 'reminder' && (
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reminder Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Take vitamins or call insurance agent"
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={remDueDate}
                    onChange={(e) => setRemDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={remDueTime}
                    onChange={(e) => setRemDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/20"
              >
                Set Reminder
              </button>
            </form>
          )}

          {activeTab === 'bill' && (
            <form onSubmit={handleCreateBill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fiber Internet, Apartment Rent"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="79.99"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={billCategory}
                    onChange={(e) => setBillCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="utilities">Utilities</option>
                    <option value="housing">Housing / Rent</option>
                    <option value="subscription">Subscription</option>
                    <option value="insurance">Insurance</option>
                    <option value="credit">Credit / Loan</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payee Name</label>
                  <input
                    type="text"
                    placeholder="e.g. MetroFiber LLC"
                    value={billPayee}
                    onChange={(e) => setBillPayee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
              >
                Track Bill
              </button>
            </form>
          )}

          {activeTab === 'goal' && (
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Run a half marathon or Save $25,000"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
                  >
                    <option value="career">Career</option>
                    <option value="health">Health & Fitness</option>
                    <option value="financial">Financial</option>
                    <option value="personal">Personal</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/20"
              >
                Create Goal
              </button>
            </form>
          )}

          {activeTab === 'document' && (
            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Passport scan or Lease Agreement"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="identity">Identity & Passport</option>
                  <option value="personal">Personal / Tenancy</option>
                  <option value="education">Education & Certificates</option>
                  <option value="medical">Medical & Health</option>
                  <option value="bills">Bills & Invoices</option>
                  <option value="insurance">Insurance Policy</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/20"
              >
                Store in Vault
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
