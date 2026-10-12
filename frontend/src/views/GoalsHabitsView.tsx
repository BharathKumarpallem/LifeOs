import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trash2,
  Award,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GoalsHabitsView: React.FC = () => {
  const {
    goals,
    habits,
    toggleMilestone,
    deleteGoal,
    toggleHabitToday,
    deleteHabit,
    openQuickAdd
  } = useApp();

  const [activeTab, setActiveTab] = useState<'goals' | 'habits'>('goals');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper for last 7 days list
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-rose-500" /> Goals, Milestones & Daily Habits
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Break long-term aspirations into verifiable milestones and cultivate daily consistency.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd(activeTab === 'goals' ? 'goal' : 'task')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> {activeTab === 'goals' ? 'New Goal' : 'New Habit'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('goals')}
          className={`pb-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors
            ${activeTab === 'goals'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          <Target className="w-4 h-4" /> Strategic Goals ({goals.length})
        </button>
        <button
          onClick={() => setActiveTab('habits')}
          className={`pb-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors
            ${activeTab === 'habits'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          <Flame className="w-4 h-4" /> Habit Streaks ({habits.length})
        </button>
      </div>

      {/* View Content */}
      {activeTab === 'goals' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-500 text-sm">
              No goals registered yet. Click "New Goal" to establish your first objective!
            </div>
          ) : (
            goals.map(goal => (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/20 text-rose-400">
                      {goal.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{goal.title}</h3>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {goal.description && (
                  <p className="text-xs text-slate-400">{goal.description}</p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="text-teal-400 font-bold">{goal.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestones checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Key Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                  </span>
                  <div className="space-y-1.5">
                    {goal.milestones.map(m => (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(goal.id, m.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer text-xs transition-colors"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0
                            ${m.completed
                              ? 'bg-teal-500 border-teal-500 text-slate-950 font-bold'
                              : 'border-slate-600 text-transparent'
                            }`}
                        >
                          {m.completed && '✓'}
                        </div>
                        <span className={`truncate ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Target Date: {goal.targetDate}</span>
                  <span className="capitalize font-semibold text-slate-400">{goal.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Habits Tab */
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="space-y-3">
            {habits.map(habit => {
              const checkedToday = habit.checkins.includes(todayStr);
              return (
                <div
                  key={habit.id}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100 truncate">{habit.title}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                        {habit.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> {habit.currentStreak} Day Streak
                      </span>
                      <span className="text-slate-500">
                        • Best: {habit.bestStreak} days
                      </span>
                    </div>
                  </div>

                  {/* 7-Day Visual History & Check-in Button */}
                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="flex items-center gap-1.5">
                      {last7Days.map(date => {
                        const checked = habit.checkins.includes(date);
                        const isToday = date === todayStr;
                        return (
                          <div
                            key={date}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all
                              ${checked
                                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                                : 'bg-slate-900 border border-slate-700 text-slate-600'
                              }
                              ${isToday ? 'ring-2 ring-teal-400/50' : ''}`}
                            title={`${date}: ${checked ? 'Completed' : 'Missed'}`}
                          >
                            {checked ? '✓' : ''}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md
                        ${checkedToday
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90'
                        }`}
                    >
                      {checkedToday ? 'Done Today ✓' : 'Check In Today'}
                    </button>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
