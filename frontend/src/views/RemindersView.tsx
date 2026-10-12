import React, { useState } from 'react';
import {
  BellRing,
  Plus,
  CheckCircle2,
  Clock,
  RotateCcw,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RemindersView: React.FC = () => {
  const {
    reminders,
    toggleReminder,
    snoozeReminder,
    deleteReminder,
    openQuickAdd
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BellRing className="w-6 h-6 text-sky-400" /> Reminders & Time Triggers
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Reliable time-based reminders, recurrence schedules, and snooze controls.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('reminder')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> New Reminder
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors
            ${activeTab === 'pending'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          Active Reminders ({pendingReminders.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors
            ${activeTab === 'completed'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          Completed ({completedReminders.length})
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3">
        {(activeTab === 'pending' ? pendingReminders : completedReminders).length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            {activeTab === 'pending' ? 'No active reminders. Great job!' : 'No completed reminders yet.'}
          </div>
        ) : (
          (activeTab === 'pending' ? pendingReminders : completedReminders).map(rem => (
            <div
              key={rem.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors
                ${rem.isCompleted
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                    ${rem.isCompleted
                      ? 'bg-sky-400 border-sky-400 text-slate-950'
                      : 'border-slate-600 hover:border-sky-400 text-transparent'
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div className="space-y-0.5 min-w-0">
                  <p className={`text-sm font-semibold truncate ${rem.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {rem.title}
                  </p>
                  {rem.notes && (
                    <p className="text-xs text-slate-400">{rem.notes}</p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Clock className="w-3 h-3" /> {rem.dueDate} at {rem.dueTime}
                    </span>
                    {rem.recurrence !== 'none' && (
                      <span className="capitalize text-sky-400">• Recurs {rem.recurrence}</span>
                    )}
                    {rem.snoozedUntil && (
                      <span className="text-amber-400 font-semibold">• Snoozed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!rem.isCompleted && (
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px]">
                    <button
                      onClick={() => snoozeReminder(rem.id, 15)}
                      className="px-2 py-0.5 rounded text-slate-400 hover:text-teal-400 hover:bg-slate-800"
                    >
                      +15m
                    </button>
                    <button
                      onClick={() => snoozeReminder(rem.id, 60)}
                      className="px-2 py-0.5 rounded text-slate-400 hover:text-teal-400 hover:bg-slate-800"
                    >
                      +1h
                    </button>
                  </div>
                )}

                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
