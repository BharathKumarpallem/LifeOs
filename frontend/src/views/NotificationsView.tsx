import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  AlertCircle,
  Bell,
  Trash2,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setCurrentSection
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !n.read;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-sky-400" /> In-App Notification Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time triggers, follow-ups, bill warnings, and system announcements.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All Notifications
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {['ALL', 'UNREAD', 'BILL', 'TASK', 'CALENDAR', 'APPROVAL', 'HABIT'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg transition-colors
              ${filterType === type
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No notifications in this filter category.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors
                ${item.read
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-70'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-1 flex-shrink-0">
                  {item.type === 'BILL' ? (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  ) : item.type === 'APPROVAL' ? (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-100 truncate">{item.title}</p>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-400 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{item.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono block pt-1">{item.timestamp}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                {item.actionSection && (
                  <button
                    onClick={() => {
                      markNotificationRead(item.id);
                      setCurrentSection(item.actionSection!);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-semibold border border-teal-500/30 flex items-center gap-1 transition-colors"
                  >
                    Take Action <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {!item.read && (
                  <button
                    onClick={() => markNotificationRead(item.id)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
