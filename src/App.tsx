/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import TaskView from './components/TaskView';
import CalendarView from './components/CalendarView';
import HabitsView from './components/HabitsView';
import InsightsView from './components/InsightsView';
import ExecutionAgent from './components/ExecutionAgent';
import ProjectBlueprintView from './components/ProjectBlueprintView';
import { 
  Sparkles, Layers, CheckSquare, Award, Flame, Calendar, Clock, Bot, 
  HelpCircle, Volume2, Info, RefreshCw, Eye, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function DashboardContent() {
  const { tasks, habits, completedPomodoros, insights, error } = useApp();
  const [activeTab, setActiveTab] = useState<'blueprint' | 'calendar' | 'habits' | 'insights' | 'agent' | 'docs'>('blueprint');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const totalStreak = habits.reduce((acc, curr) => acc + curr.streak, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blueprint': return <TaskView />;
      case 'calendar': return <CalendarView />;
      case 'habits': return <HabitsView />;
      case 'insights': return <InsightsView />;
      case 'agent': return <ExecutionAgent />;
      case 'docs': return <ProjectBlueprintView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900 relative" id="main-app-blueprint">
      {/* Premium Light Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-40 z-0" />

      {/* Top Banner Navigation bar */}
      <header className="relative border-b border-slate-200 bg-white/80 backdrop-blur-md z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/10 rounded-2xl flex items-center justify-center shadow-xs">
              <Sparkles className="w-5.5 h-5.5 text-indigo-650 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 font-display">
                COMPANION AI
                <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-normal uppercase">
                  V3.5 Elite
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Strategic Executive Assistance Protocol</p>
            </div>
          </div>

          {/* System Date Time & Stats Summary */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentTime || "00:00:00"} UTC</span>
            </div>

            <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] font-mono font-bold text-amber-700 flex items-center gap-1.5 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Streak Ledger: {totalStreak}d</span>
            </div>

            <div className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-150 rounded-xl text-[11px] font-mono font-bold text-indigo-750 flex items-center gap-1.5 shadow-xs">
              <Bot className="w-3.5 h-3.5 text-indigo-650" />
              <span>Planner Nodes: {tasks.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 flex flex-col gap-6">
        {/* Core Quick KPI Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-dashboard-grid">
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 bg-white border border-slate-200/85 rounded-2xl flex items-center gap-3 shadow-xs hover:border-slate-350 transition duration-300"
          >
            <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl border border-indigo-100">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Unfinished Tasks</p>
              <h3 className="text-xl font-black text-slate-900 font-mono">{pendingTasksCount}</h3>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 bg-white border border-slate-200/85 rounded-2xl flex items-center gap-3 shadow-xs hover:border-slate-350 transition duration-300"
          >
            <div className="p-2.5 bg-emerald-50 text-emerald-650 rounded-xl border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Completed Tasks</p>
              <h3 className="text-xl font-black text-slate-900 font-mono">{completedTasksCount}</h3>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 bg-white border border-slate-200/85 rounded-2xl flex items-center gap-3 shadow-xs hover:border-slate-350 transition duration-300"
          >
            <div className="p-2.5 bg-amber-50 text-amber-650 rounded-xl border border-amber-100">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Habit Streaks</p>
              <h3 className="text-xl font-black text-slate-900 font-mono">{habits.length}</h3>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 bg-white border border-slate-200/85 rounded-2xl flex items-center gap-3 shadow-xs hover:border-slate-350 transition duration-300"
          >
            <div className="p-2.5 bg-violet-50 text-violet-650 rounded-xl border border-violet-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Calendar Days</p>
              <h3 className="text-xl font-black text-slate-900 font-mono">{tasks.length > 0 ? new Set(tasks.map(t => t.dueDate)).size : 0}</h3>
            </div>
          </motion.div>
        </section>

        {/* Tab Viewport Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-1 pb-1 scrollbar-none shrink-0" id="tabs-navigation-panel">
          <button
            id="tab-btn-blueprint"
            onClick={() => setActiveTab('blueprint')}
            className={`px-4 py-3 text-xs font-bold transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'blueprint' 
                ? 'text-indigo-650 border-b-2 border-indigo-650 font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Focus & Priorities
          </button>

          <button
            id="tab-btn-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-3 text-xs font-bold transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'calendar' 
                ? 'text-indigo-650 border-b-2 border-indigo-650 font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Calendar Integration
          </button>

          <button
            id="tab-btn-habits"
            onClick={() => setActiveTab('habits')}
            className={`px-4 py-3 text-xs font-bold transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'habits' 
                ? 'text-indigo-650 border-b-2 border-indigo-650 font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Goal & Habit Tracking
          </button>

          <button
            id="tab-btn-insights"
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-3 text-xs font-bold transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'insights' 
                ? 'text-indigo-650 border-b-2 border-indigo-650 font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Productivity Recommendations
          </button>

          <button
            id="tab-btn-agent"
            onClick={() => setActiveTab('agent')}
            className={`px-4 py-3 text-xs font-bold transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'agent' 
                ? 'text-indigo-650 border-b-2 border-indigo-650 font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Autonomous Planning & Voice
          </button>

          <button
            id="tab-btn-docs"
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-3 text-xs font-bold transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'docs' 
                ? 'text-indigo-650 border-b-2 border-indigo-650 font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Project Blueprint & Playbook
          </button>
        </div>

        {/* Dynamic Viewport Canvas */}
        <section className="flex-1 min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Footer workspace credentials */}
      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">© 2026 Companion AI workspace. Optimized for professional strategic excellence.</p>
          <div className="flex gap-4 text-[10px] text-slate-500 font-bold tracking-wider uppercase">
            <span className="hover:text-indigo-650 cursor-pointer transition">Protocol Status: Optimal</span>
            <span className="text-slate-300">|</span>
            <span className="hover:text-indigo-650 cursor-pointer transition">Gemini-3.5 Core Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
