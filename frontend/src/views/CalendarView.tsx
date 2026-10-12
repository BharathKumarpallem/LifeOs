import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Video,
  AlertTriangle,
  Calendar as CalendarIcon,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';

export const CalendarView: React.FC = () => {
  const { events, deleteEvent, openQuickAdd } = useApp();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Generate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Check conflicts between events on same date & overlapping time
  const getEventConflicts = (event: CalendarEvent) => {
    return events.filter(e =>
      e.id !== event.id &&
      e.date === event.date &&
      e.startTime < event.endTime &&
      e.endTime > event.startTime
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-indigo-400" /> Integrated Calendar & Appointments
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage personal, medical, professional, and family schedules with conflict detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button onClick={handlePrevMonth} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-200">
              {months[currentMonth]} {currentYear}
            </span>
            <button onClick={handleNextMonth} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openQuickAdd('event')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          <span>External Sync: Google Calendar & Outlook OAuth connectors ready in Settings.</span>
        </div>
        <span className="text-[11px] text-teal-400 font-semibold">Local Storage Active</span>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl p-4 sm:p-6 bg-slate-900/80 border border-slate-800 shadow-xl overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[600px] mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2 min-w-[600px]">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 rounded-xl bg-slate-950/30 border border-slate-800/30 opacity-30" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedDay = dayNum.toString().padStart(2, '0');
            const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
            const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={`day-${dayNum}`}
                className={`min-h-[105px] p-2 rounded-xl border flex flex-col justify-between transition-colors
                  ${isToday
                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-inner'
                    : 'bg-slate-800/20 border-slate-800/60 hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </div>

                {/* Event list snippet in cell */}
                <div className="space-y-1 my-1 overflow-y-auto max-h-[75px]">
                  {dayEvents.map(evt => {
                    const conflicts = getEventConflicts(evt);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`px-1.5 py-1 rounded text-[10px] font-semibold truncate cursor-pointer transition-colors
                          ${conflicts.length > 0
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'
                          }`}
                        title={`${evt.title} (${evt.startTime} - ${evt.endTime})`}
                      >
                        {evt.startTime} {evt.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-400">
                  {selectedEvent.category} Appointment
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedEvent.title}</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {selectedEvent.description && (
              <p className="text-xs text-slate-300">{selectedEvent.description}</p>
            )}

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{selectedEvent.date} • {selectedEvent.startTime} - {selectedEvent.endTime} ({selectedEvent.timeZone})</span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.meetingLink && (
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-teal-400" />
                  <a href={selectedEvent.meetingLink} target="_blank" rel="noreferrer" className="text-teal-400 underline">
                    {selectedEvent.meetingLink}
                  </a>
                </div>
              )}
            </div>

            {/* Conflict Warning */}
            {getEventConflicts(selectedEvent).length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Conflict detected: Overlaps with {getEventConflicts(selectedEvent).map(c => c.title).join(', ')}</span>
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => {
                  deleteEvent(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Event
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
