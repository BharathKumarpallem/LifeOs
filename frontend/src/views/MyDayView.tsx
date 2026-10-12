import React, { useState, useEffect } from 'react';
import {
  SunMedium,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyDayView: React.FC = () => {
  const {
    tasks,
    events,
    toggleTaskComplete,
    updateTask,
    addTask,
    setCurrentSection
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || (!t.dueDate && t.status !== 'completed'));
  const todayEvents = events.filter(e => e.date === todayStr);

  // Focus Timer State (Pomodoro 25 mins = 1500 secs)
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<string>(todayTasks[0]?.title || 'Deep Work Session');

  // Quick capture input
  const [quickInput, setQuickInput] = useState('');

  // Daily review summary
  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const pendingToday = todayTasks.length - completedToday;

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    addTask({
      title: quickInput.trim(),
      priority: 'medium',
      category: 'work',
      status: 'not_started',
      dueDate: todayStr,
      tags: ['DailyPlan'],
      subtasks: []
    });
    setQuickInput('');
  };

  const handleCarryToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    todayTasks
      .filter(t => t.status !== 'completed')
      .forEach(t => {
        updateTask(t.id, { dueDate: tomorrowStr });
      });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/20 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
            <SunMedium className="w-4 h-4" />
            <span>Smart Daily Planner</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">My Day & Time Blocking</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Optimize your daily energy, time blocks, and deep-focus rhythm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingToday > 0 && (
            <button
              onClick={handleCarryToTomorrow}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Reschedule unfinished tasks to tomorrow"
            >
              Carry Unfinished to Tomorrow →
            </button>
          )}
          <button
            onClick={() => setCurrentSection('ai-assistant')}
            className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20"
          >
            <Sparkles className="w-4 h-4" /> Generate Plan with AI
          </button>
        </div>
      </div>

      {/* Main Grid: Planner & Focus Session */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Time Blocking & Agenda */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Capture Input */}
          <form onSubmit={handleQuickCapture} className="flex gap-2">
            <input
              type="text"
              placeholder="⚡ Quick capture today's responsibility and press Enter..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-semibold text-sm hover:bg-teal-400 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          {/* Structured Agenda Timeline */}
          <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100">Today's Schedule & Commitments</h2>
              <span className="text-xs text-slate-400">
                {todayTasks.length} tasks • {todayEvents.length} calendar events
              </span>
            </div>

            {/* Events timeline block */}
            {todayEvents.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Calendar Blocks
                </span>
                {todayEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{evt.title}</p>
                        <p className="text-[11px] text-slate-400">{evt.location || evt.meetingLink || 'Scheduled'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-300">
                      {evt.startTime} - {evt.endTime}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Task list with time blocks */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                Prioritized Action Items
              </span>
              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No tasks set for today. Use the quick capture box above!
                </div>
              ) : (
                todayTasks.map((task, idx) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors
                        ${isDone
                          ? 'bg-slate-950/40 border-slate-800/40 opacity-50'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors
                            ${isDone
                              ? 'bg-teal-500 border-teal-500 text-slate-950'
                              : 'border-slate-600 hover:border-teal-400 text-transparent'
                            }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-500 font-bold">#{idx + 1}</span>
                            <p className={`text-sm font-semibold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            {task.dueTime && <span>Target: {task.dueTime}</span>}
                            <span>• Est: {task.estimatedDurationMin || 45} mins</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setActiveFocusTask(task.title);
                            setTimerSeconds((task.estimatedDurationMin || 25) * 60);
                            setIsTimerRunning(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-semibold border border-teal-500/30 transition-colors flex items-center gap-1"
                          title="Start timer for this task"
                        >
                          <Play className="w-3 h-3" /> Focus
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Focus Session & Daily Review */}
        <div className="space-y-6">
          {/* Deep Focus Stopwatch / Pomodoro */}
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-teal-400">Deep Focus Session</span>
              <Clock className="w-4 h-4" />
            </div>

            <p className="text-xs text-slate-300 font-medium truncate max-w-full px-2" title={activeFocusTask}>
              Focusing on: <span className="text-teal-400 font-semibold">{activeFocusTask}</span>
            </p>

            {/* Timer Dial */}
            <div className="my-4">
              <span className="text-5xl font-mono font-extrabold text-white tracking-wider">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg
                  ${isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
                  }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTimerRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(1500);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset to 25 mins"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 flex justify-center gap-2">
              <button onClick={() => setTimerSeconds(15 * 60)} className="text-[10px] text-slate-400 hover:text-teal-400 px-2 py-0.5 rounded bg-slate-800">
                15m
              </button>
              <button onClick={() => setTimerSeconds(25 * 60)} className="text-[10px] text-slate-400 hover:text-teal-400 px-2 py-0.5 rounded bg-slate-800">
                25m (Pomodoro)
              </button>
              <button onClick={() => setTimerSeconds(50 * 60)} className="text-[10px] text-slate-400 hover:text-teal-400 px-2 py-0.5 rounded bg-slate-800">
                50m
              </button>
            </div>
          </div>

          {/* Daily Review Card */}
          <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Daily Review & Metric</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Completion rate</span>
                <span className="font-bold text-teal-400">
                  {todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>{completedToday} Completed</span>
                <span>{pendingToday} Remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
