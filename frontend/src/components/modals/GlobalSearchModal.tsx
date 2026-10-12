import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  CheckSquare,
  Calendar,
  CreditCard,
  FolderLock,
  Flame,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  section: NavSection;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
}

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setCurrentSection,
    tasks,
    events,
    bills,
    documents,
    goals,
    career
  } = useApp();

  const [query, setQuery] = useState('');

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const list: SearchResult[] = [];

    // Search tasks
    tasks.forEach(t => {
      if (t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) {
        list.push({
          id: t.id,
          title: t.title,
          subtitle: `Priority: ${t.priority.toUpperCase()} • Due: ${t.dueDate || 'No date'}`,
          section: 'tasks',
          icon: CheckSquare,
          badge: 'Task',
          badgeColor: 'bg-teal-500/20 text-teal-400'
        });
      }
    });

    // Search events
    events.forEach(e => {
      if (e.title.toLowerCase().includes(q) || (e.description && e.description.toLowerCase().includes(q))) {
        list.push({
          id: e.id,
          title: e.title,
          subtitle: `${e.date} at ${e.startTime} - ${e.endTime}`,
          section: 'calendar',
          icon: Calendar,
          badge: 'Event',
          badgeColor: 'bg-indigo-500/20 text-indigo-400'
        });
      }
    });

    // Search bills
    bills.forEach(b => {
      if (b.name.toLowerCase().includes(q) || (b.payee && b.payee.toLowerCase().includes(q))) {
        list.push({
          id: b.id,
          title: b.name,
          subtitle: `$${b.amount.toFixed(2)} due on ${b.dueDate} (${b.paymentStatus})`,
          section: 'bills',
          icon: CreditCard,
          badge: 'Bill',
          badgeColor: 'bg-amber-500/20 text-amber-400'
        });
      }
    });

    // Search documents
    documents.forEach(d => {
      if (d.title.toLowerCase().includes(q) || (d.tags && d.tags.some(tag => tag.toLowerCase().includes(q)))) {
        list.push({
          id: d.id,
          title: d.title,
          subtitle: `Category: ${d.category} • Expiry: ${d.expiryDate || 'N/A'}`,
          section: 'documents',
          icon: FolderLock,
          badge: 'Doc Vault',
          badgeColor: 'bg-purple-500/20 text-purple-400'
        });
      }
    });

    // Search goals
    goals.forEach(g => {
      if (g.title.toLowerCase().includes(q)) {
        list.push({
          id: g.id,
          title: g.title,
          subtitle: `Progress: ${g.progressPercent}% • Target: ${g.targetDate}`,
          section: 'goals-habits',
          icon: Flame,
          badge: 'Goal',
          badgeColor: 'bg-rose-500/20 text-rose-400'
        });
      }
    });

    // Search career
    career.forEach(c => {
      if (c.company.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)) {
        list.push({
          id: c.id,
          title: `${c.role} at ${c.company}`,
          subtitle: `Status: ${c.status} • Contact: ${c.contactName || 'N/A'}`,
          section: 'career',
          icon: Briefcase,
          badge: 'Career',
          badgeColor: 'bg-sky-500/20 text-sky-400'
        });
      }
    });

    return list;
  }, [query, tasks, events, bills, documents, goals, career]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <Search className="w-5 h-5 text-teal-400" />
          <input
            type="text"
            placeholder="Type to search tasks, bills, appointments, documents, career records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs text-slate-400 bg-slate-800 rounded-md hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/40">
          {query.trim() === '' ? (
            <div className="py-12 px-6 text-center text-slate-500 text-sm">
              <p>Type keywords to search across your whole LifeOS knowledge base.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-2.5 py-1 text-xs bg-slate-800/70 text-slate-400 rounded-lg cursor-pointer hover:text-teal-400" onClick={() => setQuery('Review')}>
                  Review
                </span>
                <span className="px-2.5 py-1 text-xs bg-slate-800/70 text-slate-400 rounded-lg cursor-pointer hover:text-teal-400" onClick={() => setQuery('Passport')}>
                  Passport
                </span>
                <span className="px-2.5 py-1 text-xs bg-slate-800/70 text-slate-400 rounded-lg cursor-pointer hover:text-teal-400" onClick={() => setQuery('Internet')}>
                  Internet Bill
                </span>
                <span className="px-2.5 py-1 text-xs bg-slate-800/70 text-slate-400 rounded-lg cursor-pointer hover:text-teal-400" onClick={() => setQuery('CloudScale')}>
                  CloudScale
                </span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 px-6 text-center text-slate-500 text-sm">
              No matching records found for "{query}".
            </div>
          ) : (
            results.map((res) => {
              const Icon = res.icon;
              return (
                <div
                  key={res.id}
                  onClick={() => {
                    setCurrentSection(res.section);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4 text-slate-300 group-hover:text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 truncate group-hover:text-teal-300">
                          {res.title}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${res.badgeColor}`}>
                          {res.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{res.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors flex-shrink-0 ml-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-500 flex justify-between items-center">
          <span>Search spans 15 LifeOS modules</span>
          <span>Click result to jump directly</span>
        </div>
      </div>
    </div>
  );
};
