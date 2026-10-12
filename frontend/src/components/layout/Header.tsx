import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Menu,
  RotateCcw,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  CreditCard,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC<{ onOpenMobileMenu: () => void }> = ({ onOpenMobileMenu }) => {
  const {
    user,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setCurrentSection,
    setIsSearchOpen,
    openQuickAdd,
    toggleTheme,
    resetAllDemoData
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isQuickAddMenuOpen, setIsQuickAddMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setIsQuickAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xl z-20 sticky top-0">
      {/* Left: Mobile Menu Trigger & Global Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-sm transition-all w-48 sm:w-72 md:w-80 group shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
          <span className="flex-1 text-left truncate text-xs sm:text-sm">Search tasks, bills, docs...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-700 rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setIsQuickAddMenuOpen(!isQuickAddMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Add</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {isQuickAddMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => { openQuickAdd('task'); setIsQuickAddMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <CheckSquare className="w-4 h-4 text-teal-400" /> New Task
              </button>
              <button
                onClick={() => { openQuickAdd('event'); setIsQuickAddMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Calendar className="w-4 h-4 text-indigo-400" /> New Appointment
              </button>
              <button
                onClick={() => { openQuickAdd('reminder'); setIsQuickAddMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Bell className="w-4 h-4 text-sky-400" /> New Reminder
              </button>
              <button
                onClick={() => { openQuickAdd('bill'); setIsQuickAddMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <CreditCard className="w-4 h-4 text-amber-400" /> New Bill
              </button>
              <button
                onClick={() => { openQuickAdd('goal'); setIsQuickAddMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Sparkles className="w-4 h-4 text-rose-400" /> New Goal / Habit
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={`Switch to ${user.theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {user.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notification Bell with unread counter */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-200">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-teal-400 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications right now. You are all caught up!
                  </div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.actionSection) setCurrentSection(n.actionSection);
                        setIsNotifOpen(false);
                      }}
                      className={`p-3 text-xs cursor-pointer transition-colors flex items-start gap-2.5 hover:bg-slate-800/60 ${n.read ? 'opacity-60' : 'bg-slate-800/20'}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {n.type === 'BILL' ? (
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                        ) : n.type === 'APPROVAL' ? (
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 truncate">{n.title}</p>
                        <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-800 bg-slate-950/60 text-center">
                <button
                  onClick={() => { setCurrentSection('notifications'); setIsNotifOpen(false); }}
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium"
                >
                  View all in Notification Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-teal-500/30"
            />
            <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
              {user.name}
            </span>
            <ChevronDown className="hidden lg:inline w-3 h-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-semibold bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                  Demo Workspace Active
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setCurrentSection('settings'); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <User className="w-4 h-4 text-slate-400" /> Profile & Account
                </button>
                <button
                  onClick={() => { setCurrentSection('settings'); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" /> Preferences & Keys
                </button>
                <button
                  onClick={() => { resetAllDemoData(); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-400 hover:bg-amber-500/10"
                >
                  <RotateCcw className="w-4 h-4" /> Reset Demo Data
                </button>
              </div>

              <div className="border-t border-slate-800 pt-1">
                <button
                  onClick={() => { resetAllDemoData(); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <LogOut className="w-4 h-4" /> Sign Out (Reset Session)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
