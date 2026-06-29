import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Check, Flame, Trash2, ShieldCheck, Trophy, Sparkles, PlusCircle, MinusCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Goal {
  id: string;
  title: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  targetDate: string;
  status: 'in_progress' | 'completed' | 'expired';
}

export default function HabitsView() {
  const { habits, addHabit, toggleHabitDate, deleteHabit } = useApp();
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [category, setCategory] = useState('Study');

  // Goals State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Work');
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalUnit, setGoalUnit] = useState('times');
  const [goalDate, setGoalDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days from now

  const today = new Date().toISOString().split('T')[0];

  // Load goals from local storage
  useEffect(() => {
    const storedGoals = localStorage.getItem('companion_goals');
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch (e) {
        console.error("Failed to parse goals", e);
      }
    } else {
      // Seed default goals
      const seedGoals: Goal[] = [
        {
          id: 'goal-1',
          title: 'Finish Advanced System Design Book',
          category: 'Study',
          currentValue: 4,
          targetValue: 12,
          unit: 'chapters',
          targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'in_progress'
        },
        {
          id: 'goal-2',
          title: 'Morning Mindfulness Routine',
          category: 'Personal',
          currentValue: 15,
          targetValue: 20,
          unit: 'sessions',
          targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'in_progress'
        }
      ];
      setGoals(seedGoals);
      localStorage.setItem('companion_goals', JSON.stringify(seedGoals));
    }
  }, []);

  // Save goals
  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('companion_goals', JSON.stringify(updatedGoals));
  };

  const handleHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHabit(title, frequency, category);
    setTitle('');
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || goalTarget <= 0) return;

    const newGoal: Goal = {
      id: 'goal_' + Math.random().toString(36).substring(2, 9),
      title: goalTitle,
      category: goalCategory,
      currentValue: 0,
      targetValue: goalTarget,
      unit: goalUnit,
      targetDate: goalDate,
      status: 'in_progress'
    };

    const updated = [newGoal, ...goals];
    saveGoals(updated);
    setGoalTitle('');
    setGoalUnit('times');
  };

  const handleIncrementGoal = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const newVal = Math.min(g.targetValue, g.currentValue + 1);
        const completed = newVal >= g.targetValue;
        return {
          ...g,
          currentValue: newVal,
          status: (completed ? 'completed' : 'in_progress') as 'in_progress' | 'completed'
        };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleDecrementGoal = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const newVal = Math.max(0, g.currentValue - 1);
        return {
          ...g,
          currentValue: newVal,
          status: 'in_progress' as 'in_progress'
        };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
  };

  const isCompletedToday = (habit: any) => {
    return habit.history.includes(today);
  };

  // Generate last 5 days
  const getLastFiveDays = () => {
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate()
      });
    }
    return days;
  };

  const trackingDays = getLastFiveDays();

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Work': return 'text-indigo-600 bg-indigo-50 border border-indigo-100';
      case 'Study': return 'text-violet-600 bg-violet-50 border border-violet-100';
      case 'Personal': return 'text-fuchsia-600 bg-fuchsia-50 border border-fuchsia-100';
      case 'Health': return 'text-teal-600 bg-teal-50 border border-teal-100';
      default: return 'text-slate-600 bg-slate-50 border border-slate-100';
    }
  };

  const getCategoryProgressBg = (cat: string) => {
    switch (cat) {
      case 'Work': return 'bg-indigo-600';
      case 'Study': return 'bg-violet-600';
      case 'Personal': return 'bg-fuchsia-600';
      case 'Health': return 'bg-teal-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="habits-goals-view">
      {/* LEFT COLUMN: Habit Creation & Listing (6 Columns) */}
      <div className="xl:col-span-6 space-y-6">
        {/* Habit Creation Form */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 font-display">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              Configure Habit Anchor
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Build non-negotiable streaks of execution.</p>
          </div>

          <form onSubmit={handleHabitSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Habit Action Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Code 45 Minutes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interval</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Focus Sphere</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
                >
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Health">Health</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Anchor Habit
            </button>
          </form>
        </div>

        {/* Habit Integrity Ledger */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 font-display">
              <ShieldCheck className="w-5 h-5 text-indigo-650" />
              Habit Integrity Ledger
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Daily checkpoints to secure consistent focus.</p>
          </div>

          {habits.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/45">
              <p className="text-xs text-slate-400 font-semibold italic">No habit parameters configured yet.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {habits.map(habit => {
                const completedToday = isCompletedToday(habit);

                return (
                  <div 
                    key={habit.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/40 border border-slate-200 rounded-xl gap-4 hover:border-slate-350 hover:shadow-xs transition duration-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        id={`btn-complete-habit-today-${habit.id}`}
                        onClick={() => toggleHabitDate(habit.id, today)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer shrink-0 ${
                          completedToday 
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                            : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-400'
                        }`}
                        title="Mark done today"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-tight">
                          <span className="truncate">{habit.title}</span>
                          {habit.streak > 0 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                              <Flame className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                              {habit.streak}d
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wide ${getCategoryColor(habit.category)}`}>
                            {habit.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold capitalize">{habit.frequency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0">
                      <div className="flex items-center gap-1">
                        {trackingDays.map(day => {
                          const done = habit.history.includes(day.dateStr);
                          const isToday = day.dateStr === today;
                          return (
                            <button
                              id={`btn-toggle-habit-day-${habit.id}-${day.dateStr}`}
                              key={day.dateStr}
                              onClick={() => toggleHabitDate(habit.id, day.dateStr)}
                              className={`flex flex-col items-center justify-center w-7 py-0.5 rounded-md border text-[8px] font-bold transition cursor-pointer ${
                                done 
                                  ? 'bg-indigo-650 border-indigo-500 text-white font-black shadow-xs' 
                                  : isToday 
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                              }`}
                              title={day.dateStr}
                            >
                              <span>{day.dayName}</span>
                              <span className="font-bold font-mono mt-0.5 leading-none">{day.dayNum}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        id={`btn-delete-habit-${habit.id}`}
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg transition cursor-pointer"
                        title="Delete Habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Goal Tracking (6 Columns) */}
      <div className="xl:col-span-6 space-y-6">
        {/* Goal Creation Form */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 font-display">
              <Trophy className="w-5 h-5 text-indigo-650 fill-indigo-50/20" />
              Declare Strategic Goal
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Define mid-term deliverables with quantifiable targets.</p>
          </div>

          <form onSubmit={handleGoalSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Strategic Objective</label>
              <input
                type="text"
                required
                placeholder="e.g. Master Advanced Algorithms"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Date</label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
                />
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Value</label>
                <input
                  type="number"
                  min="1"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
                />
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit</label>
                <input
                  type="text"
                  placeholder="chapters"
                  value={goalUnit}
                  onChange={(e) => setGoalUnit(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sphere</label>
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-semibold"
              >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              Declare Goal
            </button>
          </form>
        </div>

        {/* Goals Progress Dashboard */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 font-display">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/10 animate-pulse" />
              Objectives Progress
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Real-time completion quotients for declared objectives.</p>
          </div>

          {goals.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/45">
              <p className="text-xs text-slate-400 font-semibold italic">No strategic goals declared yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map(goal => {
                const percentage = Math.round((goal.currentValue / goal.targetValue) * 100);
                const isCompleted = goal.status === 'completed';

                return (
                  <div 
                    key={goal.id}
                    className="p-4 bg-slate-50/40 border border-slate-200 rounded-xl hover:border-slate-350 transition duration-200 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold text-slate-800 flex items-center gap-1.5 ${isCompleted ? 'line-through text-slate-450' : ''}`}>
                          <span className="truncate">{goal.title}</span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Sparkles className="w-2.5 h-2.5" />
                              Achieved
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wide ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold font-mono">Target: {goal.targetDate}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition hover:bg-rose-50 border border-transparent hover:border-rose-100 cursor-pointer"
                        title="Remove Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Progress Bar & Value Adjusters */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 font-mono">
                        <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                        <span className={isCompleted ? 'text-emerald-600 font-extrabold' : ''}>{percentage}%</span>
                      </div>

                      <div className="h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : getCategoryProgressBg(goal.category)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex justify-end items-center gap-1.5 pt-1">
                        <span className="text-[9px] text-slate-400 font-bold font-mono mr-auto">Adjust progress:</span>
                        <button
                          onClick={() => handleDecrementGoal(goal.id)}
                          disabled={goal.currentValue === 0}
                          className="p-1 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 hover:border-slate-300 rounded-lg transition disabled:opacity-40 cursor-pointer shadow-xs"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleIncrementGoal(goal.id)}
                          disabled={isCompleted}
                          className="p-1 bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 hover:border-slate-350 rounded-lg transition disabled:opacity-40 cursor-pointer shadow-xs"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
