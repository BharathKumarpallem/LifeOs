import React from 'react';
import {
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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentSection,
    setCurrentSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    tasks,
    notifications,
    approvals,
    bills
  } = useApp();

  // Dynamic counts for badges
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;
  const unpaidBillsCount = bills.filter(b => b.paymentStatus !== 'PAID').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-day', label: 'My Day', icon: SunMedium },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount, badgeColor: 'bg-teal-500/20 text-teal-400 border border-teal-500/30' },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'reminders', label: 'Reminders', icon: BellRing },
    { id: 'bills', label: 'Bills & Deadlines', icon: CreditCard, badge: unpaidBillsCount > 0 ? unpaidBillsCount : undefined, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'documents', label: 'Documents', icon: FolderLock },
    { id: 'goals-habits', label: 'Goals & Habits', icon: Flame },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
    { id: 'career', label: 'Work & Career', icon: Briefcase },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
    { id: 'automations', label: 'Automations', icon: Zap, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'notifications', label: 'Notifications', icon: Inbox, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined, badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r transition-all duration-300 z-30 select-none
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        bg-slate-900/90 dark:bg-slate-950/95 border-slate-800/80 backdrop-blur-xl`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/70">
        <div
          onClick={() => setCurrentSection('overview')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Compass className="w-5 h-5 text-white animate-pulse" />
          </div>
          {!isSidebarCollapsed && (
            <div className="leading-tight transition-opacity duration-200">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-400 via-indigo-300 to-white bg-clip-text text-transparent">
                LifeOS
              </span>
              <span className="block text-[10px] text-teal-400/80 font-medium tracking-wider uppercase">
                Intelligent OS
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                ${isActive
                  ? 'bg-gradient-to-r from-teal-500/15 to-indigo-500/10 text-teal-400 border border-teal-500/30 shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }
              `}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />

              {!isSidebarCollapsed && (
                <span className="flex-1 text-left truncate">
                  {item.label}
                </span>
              )}

              {/* Badges */}
              {!isSidebarCollapsed && item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}

              {/* Collapsed dot badge indicator */}
              {isSidebarCollapsed && item.badge !== undefined && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Security & System indicator footer */}
      <div className="p-3 border-t border-slate-800/70">
        {!isSidebarCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="truncate">
              <p className="font-semibold text-slate-200">Local-First Vault</p>
              <p className="text-[10px] text-slate-400">Zero-Knowledge Private</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Local-First Private Vault Active">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
