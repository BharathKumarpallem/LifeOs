import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Clock,
  Tag,
  LayoutList,
  Kanban,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, TaskStatus } from '../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    deleteTask,
    toggleSubtask,
    openQuickAdd
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (selectedStatus === 'active' && task.status === 'completed') return false;
    if (selectedStatus === 'completed' && task.status !== 'completed') return false;
    return true;
  });

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'not_started', label: 'To Do', color: 'border-slate-700' },
    { id: 'in_progress', label: 'In Progress', color: 'border-teal-500/50' },
    { id: 'completed', label: 'Completed', color: 'border-emerald-500/50' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-teal-400" /> Tasks & Responsibilities
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Full lifecycle task tracking, subtask checklists, and priority matrices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* List vs Board Toggle */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors
                ${viewMode === 'list' ? 'bg-teal-500/20 text-teal-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutList className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors
                ${viewMode === 'board' ? 'bg-teal-500/20 text-teal-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Kanban className="w-4 h-4" /> Board
            </button>
          </div>

          <button
            onClick={() => openQuickAdd('task')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="learning">Learning</option>
            <option value="family">Family</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="completed">Completed Only</option>
          </select>
        </div>
      </div>

      {/* Content Rendering: List vs Board */}
      {viewMode === 'list' ? (
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No tasks match your filters. Try clearing the search or category filters.
            </div>
          ) : (
            filteredTasks.map(task => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3
                    ${isDone
                      ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                    }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                        ${isDone
                          ? 'bg-teal-500 border-teal-500 text-slate-950'
                          : 'border-slate-600 hover:border-teal-400 text-transparent'
                        }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                        {task.dueDate && (
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" /> Due: {task.dueDate} {task.dueTime || ''}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 capitalize font-medium">
                          {task.category}
                        </span>
                        {task.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-0.5 text-slate-500">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>

                      {/* Subtasks checklist */}
                      {task.subtasks.length > 0 && (
                        <div className="pt-2 pl-1 space-y-1">
                          {task.subtasks.map(st => (
                            <div
                              key={st.id}
                              onClick={() => toggleSubtask(task.id, st.id)}
                              className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200"
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${st.completed ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-slate-600'}`}>
                                {st.completed && '✓'}
                              </div>
                              <span className={st.completed ? 'line-through opacity-70' : ''}>{st.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Priority Badge */}
                  <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase
                      ${task.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                        task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                        task.priority === 'medium' ? 'bg-teal-500/20 text-teal-400' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                      {task.priority}
                    </span>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Board / Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800 flex flex-col space-y-3">
                <div className={`pb-2 border-b ${col.color} flex items-center justify-between`}>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-200">{col.label}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-400 font-semibold">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh]">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-slate-600 text-xs">No tasks in this lane</div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200 line-clamp-2">{task.title}</p>
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-[10px]
                              ${task.status === 'completed' ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-slate-600'}`}
                          >
                            {task.status === 'completed' && '✓'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>Due: {task.dueDate || 'N/A'}</span>
                          <span className="uppercase font-bold text-teal-400">{task.priority}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
