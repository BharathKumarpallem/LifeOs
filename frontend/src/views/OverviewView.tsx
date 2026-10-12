import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  CreditCard,
  Flame,
  ArrowRight,
  Plus,
  Clock,
  Compass,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OverviewView: React.FC = () => {
  const {
    user,
    tasks,
    events,
    bills,
    goals,
    habits,
    documents,
    toggleTaskComplete,
    toggleHabitToday,
    markBillPaid,
    setCurrentSection,
    openQuickAdd
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculations
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'completed');
  const upcomingEvents = events.filter(e => e.date >= todayStr).slice(0, 3);
  const pendingBills = bills.filter(b => b.paymentStatus !== 'PAID');
  const activeHabits = habits.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Greeting & Daily Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold tracking-wider uppercase">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>{currentDateFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, <span className="bg-gradient-to-r from-teal-400 to-indigo-300 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              You have <span className="text-teal-400 font-semibold">{todayTasks.length} tasks scheduled today</span> and{' '}
              {overdueTasks.length > 0 ? (
                <span className="text-rose-400 font-semibold">{overdueTasks.length} requiring immediate attention.</span>
              ) : (
                <span className="text-emerald-400 font-semibold">zero overdue responsibilities.</span>
              )}
            </p>
          </div>

          {/* Quick Action cluster */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openQuickAdd('task')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
            <button
              onClick={() => openQuickAdd('bill')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm transition-all"
            >
              <CreditCard className="w-4 h-4 text-amber-400" /> Log Bill
            </button>
            <button
              onClick={() => setCurrentSection('ai-assistant')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-500/30 text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" /> Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* AI Daily Synthesis Card */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-teal-950/30 via-slate-900 to-indigo-950/30 border border-teal-500/20 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI Daily Strategic Briefing</h2>
              <button
                onClick={() => setCurrentSection('my-day')}
                className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
              >
                Open Smart Planner <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Prioritize the <strong>Quarterly Financial Review Slides</strong> before your 11:30 AM dental appointment. Your <strong>MetroFiber Internet bill ($79.99)</strong> is due in 3 days, and your Passport requires a scan submission for renewal. Keep up your 14-day meditation streak!
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Tasks & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's & Overdue Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Warning Panel (if any) */}
          {overdueTasks.length > 0 && (
            <div className="rounded-2xl p-4 bg-rose-950/20 border border-rose-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Action Needed: Overdue Items ({overdueTasks.length})</span>
                </div>
                <button
                  onClick={() => setCurrentSection('tasks')}
                  className="text-xs text-rose-300 hover:underline"
                >
                  View all in Tasks →
                </button>
              </div>
              <div className="space-y-2">
                {overdueTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-center justify-between gap-3 hover:border-rose-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="w-5 h-5 rounded-md border border-rose-500/40 flex items-center justify-center hover:bg-rose-500/20 text-transparent hover:text-rose-400"
                        title="Mark Complete"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-200 truncate">{task.title}</p>
                        <p className="text-[11px] text-rose-400 font-medium">Was due {task.dueDate}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase flex-shrink-0">
                      Overdue
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Tasks */}
          <div className="rounded-2xl p-5 bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <h2 className="text-base font-bold text-slate-100">Today's Priorities</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length} Done
                </span>
              </div>
              <button
                onClick={() => setCurrentSection('tasks')}
                className="text-xs text-teal-400 hover:underline flex items-center gap-1"
              >
                Task Board <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No tasks scheduled for today. Enjoy your day or add a new task!
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map(task => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3
                        ${isDone
                          ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0
                            ${isDone
                              ? 'bg-teal-500 border-teal-500 text-slate-950'
                              : 'border-slate-600 hover:border-teal-400 text-transparent'
                            }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            {task.dueTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" /> {task.dueTime}
                              </span>
                            )}
                            <span className="capitalize text-slate-500">• {task.category}</span>
                            {task.subtasks.length > 0 && (
                              <span className="text-slate-500">
                                • {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase flex-shrink-0
                        ${task.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                          task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                          task.priority === 'medium' ? 'bg-teal-500/20 text-teal-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                        {task.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Habit Trackers */}
          <div className="rounded-2xl p-5 bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <h2 className="text-base font-bold text-slate-100">Daily Habit Check-in</h2>
              </div>
              <button
                onClick={() => setCurrentSection('goals-habits')}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                All Habits <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeHabits.map(habit => {
                const checkedToday = habit.checkins.includes(todayStr);
                return (
                  <div
                    key={habit.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{habit.title}</p>
                      <p className="text-[11px] text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                        <Flame className="w-3 h-3 text-amber-400" /> {habit.currentStreak} day streak
                      </p>
                    </div>
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                        ${checkedToday
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
                        }`}
                    >
                      {checkedToday ? 'Done ✓' : 'Check in'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Appointments & Upcoming Bills */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="rounded-2xl p-5 bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-bold text-slate-100">Upcoming Schedule</h2>
              </div>
              <button
                onClick={() => setCurrentSection('calendar')}
                className="text-xs text-indigo-400 hover:underline"
              >
                Calendar →
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No upcoming events.</p>
              ) : (
                upcomingEvents.map(evt => (
                  <div key={evt.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <p className="text-xs font-bold text-slate-100">{evt.title}</p>
                    <p className="text-[11px] text-indigo-400 font-medium mt-0.5">
                      {evt.date === todayStr ? 'Today' : evt.date} • {evt.startTime} - {evt.endTime}
                    </p>
                    {evt.location && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{evt.location}</p>
                    )}
                    {evt.meetingLink && (
                      <a
                        href={evt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-1 text-[11px] text-teal-400 hover:underline"
                      >
                        Join video link →
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Bills & Deadlines */}
          <div className="rounded-2xl p-5 bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-slate-100">Bills & Deadlines</h2>
              </div>
              <button
                onClick={() => setCurrentSection('bills')}
                className="text-xs text-amber-400 hover:underline"
              >
                View all →
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingBills.slice(0, 3).map(bill => (
                <div key={bill.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-200 truncate">{bill.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Due {bill.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">${bill.amount.toFixed(2)}</p>
                    <button
                      onClick={() => markBillPaid(bill.id)}
                      className="text-[10px] text-teal-400 hover:underline mt-0.5 block"
                    >
                      Mark Paid ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Progress Ring */}
          <div className="rounded-2xl p-5 bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-200">Yearly Goals Progress</h2>
              <button
                onClick={() => setCurrentSection('goals-habits')}
                className="text-xs text-teal-400 hover:underline"
              >
                Details →
              </button>
            </div>
            <div className="space-y-3">
              {goals.slice(0, 2).map(g => (
                <div key={g.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300 truncate max-w-[180px]">{g.title}</span>
                    <span className="font-bold text-teal-400">{g.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${g.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
