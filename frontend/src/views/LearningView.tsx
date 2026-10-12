import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LearningView: React.FC = () => {
  const {
    learning,
    toggleStudyPlanItem,
    addLearning,
    deleteLearning,
    setCurrentSection
  } = useApp();

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    addLearning({
      title: newCourseTitle.trim(),
      category: newCourseCategory || 'General Studies',
      notes: 'Initial notes and learning roadmap.',
      resources: [],
      studyPlan: [
        { id: 'sp-' + Date.now(), topic: 'Introduction & Core Foundations', durationMin: 45, scheduledDate: new Date().toISOString().split('T')[0], completed: false }
      ]
    });
    setNewCourseTitle('');
    setNewCourseCategory('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-teal-400" /> Learning, Education & Skills
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Systematic study plans, curriculum milestones, and AI study-schedule generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSection('ai-assistant')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4" /> AI Study Plan Generator
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {isAddOpen && (
        <form onSubmit={handleAddCourse} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Add Learning Track</span>
            <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Track / Course Title (e.g. Distributed Systems)"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
            />
            <input
              type="text"
              placeholder="Category (e.g. Computer Science, AI)"
              value={newCourseCategory}
              onChange={(e) => setNewCourseCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
          >
            Save Subject Track
          </button>
        </form>
      )}

      {/* Course Cards Grid */}
      <div className="space-y-6">
        {learning.map(item => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-teal-500/20 text-teal-400">
                    {item.category}
                  </span>
                  {item.provider && (
                    <span className="text-xs text-slate-400">• {item.provider}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-bold text-teal-400">{item.progressPercent}%</span>
                  <span className="text-[10px] text-slate-500 block">Progress</span>
                </div>
                <button
                  onClick={() => deleteLearning(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>

            {item.notes && (
              <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                {item.notes}
              </p>
            )}

            {/* Study Plan Timeline */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Study Sessions & Schedule ({item.studyPlan.filter(sp => sp.completed).length}/{item.studyPlan.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {item.studyPlan.map(session => (
                  <div
                    key={session.id}
                    onClick={() => toggleStudyPlanItem(item.id, session.id)}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${session.completed ? 'bg-teal-500 border-teal-500 text-slate-950 font-bold' : 'border-slate-600'}`}>
                        {session.completed && '✓'}
                      </div>
                      <span className={`truncate ${session.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {session.topic}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex-shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {session.durationMin}m
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources list */}
            {item.resources.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
                {item.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-teal-400 hover:underline"
                  >
                    <BookOpen className="w-3 h-3" /> {res.title} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
