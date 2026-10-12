import React from 'react';
import {
  X,
  LayoutDashboard,
  SunMedium,
  CheckSquare,
  CalendarDays,
  BellRing,
  CreditCard,
  FolderLock,
  Flame,
  GraduationCap,
  Briefcase,
  Users,
  Sparkles,
  Zap,
  Inbox,
  Settings,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

export const MobileNav: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentSection, setCurrentSection } = useApp();

  if (!isOpen) return null;

  const navItems = [
    { id: 'overview' as NavSection, label: 'Overview', icon: LayoutDashboard },
    { id: 'my-day' as NavSection, label: 'My Day', icon: SunMedium },
    { id: 'tasks' as NavSection, label: 'Tasks', icon: CheckSquare },
    { id: 'calendar' as NavSection, label: 'Calendar', icon: CalendarDays },
    { id: 'reminders' as NavSection, label: 'Reminders', icon: BellRing },
    { id: 'bills' as NavSection, label: 'Bills & Deadlines', icon: CreditCard },
    { id: 'documents' as NavSection, label: 'Documents', icon: FolderLock },
    { id: 'goals-habits' as NavSection, label: 'Goals & Habits', icon: Flame },
    { id: 'learning' as NavSection, label: 'Learning', icon: GraduationCap },
    { id: 'career' as NavSection, label: 'Work & Career', icon: Briefcase },
    { id: 'family' as NavSection, label: 'Family', icon: Users },
    { id: 'ai-assistant' as NavSection, label: 'AI Assistant', icon: Sparkles },
    { id: 'automations' as NavSection, label: 'Automations', icon: Zap },
    { id: 'notifications' as NavSection, label: 'Notifications', icon: Inbox },
    { id: 'settings' as NavSection, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-slate-950 border-r border-slate-800 flex flex-col h-full z-10 p-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              LifeOS
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
