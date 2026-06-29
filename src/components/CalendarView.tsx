import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, CalendarRange, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'task' | 'custom';
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

export default function CalendarView() {
  const { tasks, updateTask } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'unsynced' | 'synced'>('unsynced');
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([
    {
      id: 'custom-1',
      title: 'Weekly Team Sync-up Meeting',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'custom',
      category: 'Work'
    }
  ]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('14:00');
  const [newEventCategory, setNewEventCategory] = useState('Work');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSyncCalendar = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('synced');
    }, 2000);
  };

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: 'custom_' + Math.random().toString(36).substring(2, 9),
      title: newEventTitle,
      date: selectedDate,
      time: newEventTime,
      type: 'custom',
      category: newEventCategory
    };

    setCustomEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  };

  // Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get first day of month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Combine tasks and custom events
  const getAllEventsForDate = (dateStr: string): CalendarEvent[] => {
    const taskEvents: CalendarEvent[] = tasks
      .filter(t => t.dueDate === dateStr)
      .map(t => ({
        id: t.id,
        title: t.title,
        date: t.dueDate,
        time: t.dueTime,
        type: 'task',
        category: t.category,
        priority: t.priority
      }));

    const customEvs = customEvents.filter(e => e.date === dateStr);
    return [...taskEvents, ...customEvs].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  // Create grid arrays
  const daysGrid = [];
  // Padding cells for previous month
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  // Month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    daysGrid.push({
      dayNum: i,
      dateString: dString
    });
  }

  const selectedDateEvents = getAllEventsForDate(selectedDate);

  const getPriorityBadgeClass = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-rose-500/10 text-rose-700 border border-rose-200';
      case 'medium': return 'bg-amber-500/10 text-amber-700 border border-amber-200';
      case 'low': return 'bg-emerald-500/10 text-emerald-700 border border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Work': return 'bg-indigo-500';
      case 'Study': return 'bg-violet-500';
      case 'Personal': return 'bg-fuchsia-500';
      case 'Health': return 'bg-teal-500';
      case 'Finance': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="calendar-view-panel">
      {/* Calendar Grid - 8 Columns */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col h-fit">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <CalendarRange className="w-5.5 h-5.5 text-indigo-650" />
              Calendar Workspace
            </h2>
            <p className="text-xs text-slate-500 font-medium">Harmonize tasks and agenda on a unified visual matrix.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
              <button 
                onClick={handlePrevMonth} 
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-slate-800 px-2 select-none min-w-[100px] text-center font-mono">
                {monthNames[month]} {year}
              </span>
              <button 
                onClick={handleNextMonth} 
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleSyncCalendar}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                syncStatus === 'synced'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : syncStatus === 'synced' ? 'Synced with Cloud' : 'Sync Calendar'}
            </button>
          </div>
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {daysGrid.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/50 rounded-xl border border-dashed border-slate-100" />;
            }

            const events = getAllEventsForDate(day.dateString);
            const isSelected = selectedDate === day.dateString;
            const isToday = new Date().toISOString().split('T')[0] === day.dateString;

            return (
              <button
                key={day.dateString}
                onClick={() => setSelectedDate(day.dateString)}
                className={`aspect-square p-2 border rounded-xl flex flex-col justify-between items-start transition cursor-pointer group text-left relative ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-50 bg-indigo-50/20'
                    : 'border-slate-200/90 bg-white hover:border-slate-350 hover:bg-slate-50/40'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-xs font-bold font-mono ${
                    isToday
                      ? 'bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-black shadow-xs'
                      : isSelected 
                        ? 'text-indigo-700 font-extrabold'
                        : 'text-slate-750'
                  }`}>
                    {day.dayNum}
                  </span>
                  {events.length > 0 && (
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200/80 px-1 rounded-md">
                      {events.length}
                    </span>
                  )}
                </div>

                {/* Micro Event Indicators */}
                <div className="flex gap-0.5 mt-auto flex-wrap max-w-full overflow-hidden">
                  {events.slice(0, 3).map((ev, eIdx) => (
                    <div 
                      key={ev.id} 
                      className={`h-1.5 w-1.5 rounded-full ${getCategoryColor(ev.category)}`}
                      title={ev.title}
                    />
                  ))}
                  {events.length > 3 && (
                    <div className="text-[7px] text-slate-400 font-bold leading-none font-mono">+</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Agenda sidebar - 4 Columns */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        {/* Sync Status Info card */}
        {syncStatus === 'synced' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl flex items-center gap-3 shadow-xs"
          >
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800">Cloud Sync Complete</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Google Calendar & Exchange linked.</p>
            </div>
          </motion.div>
        )}

        {/* Selected Day Agenda */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-150">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Agenda Protocol</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">{selectedDate}</p>
              </div>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
              >
                + Add Event
              </button>
            </div>

            {/* Event insertion form */}
            <AnimatePresence>
              {showEventForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddCustomEvent}
                  className="space-y-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl overflow-hidden"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Event Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design review call"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Time</label>
                      <input
                        type="time"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Sphere</label>
                      <select
                        value={newEventCategory}
                        onChange={(e) => setNewEventCategory(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                      >
                        <option value="Work">Work</option>
                        <option value="Study">Study</option>
                        <option value="Personal">Personal</option>
                        <option value="Health">Health</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowEventForm(false)}
                      className="px-2.5 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-indigo-650 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Save Event
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Event List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="inline-flex p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold italic">No events or items scheduled.</p>
                </div>
              ) : (
                selectedDateEvents.map(ev => (
                  <div 
                    key={ev.id}
                    className="flex justify-between items-start p-3 bg-white border border-slate-150 rounded-xl hover:border-slate-300 transition duration-200 relative group"
                  >
                    <div className="flex gap-2.5">
                      <div className={`w-1 rounded-full ${getCategoryColor(ev.category)}`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2">{ev.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-slate-450 font-bold bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {ev.time || "All Day"}
                          </span>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{ev.type} • {ev.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {ev.priority && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${getPriorityBadgeClass(ev.priority)}`}>
                          {ev.priority}
                        </span>
                      )}
                      
                      {ev.type === 'custom' && (
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-[9px] text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-4 mt-4 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[10px] text-indigo-900 leading-normal font-semibold">
              <strong>Smart Recommendation:</strong> Link and synchronise with third-party providers (Google Calendar, Outlook) for real-time proactive context monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
