import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskCategory, PriorityLevel, Subtask } from '../types';
import { 
  Sparkles, CheckCircle, Clock, Calendar, AlertCircle, Trash2, 
  Plus, ChevronDown, ChevronUp, RefreshCw, Layers, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TaskView() {
  const { 
    tasks, addTask, updateTask, deleteTask, deconstructTask, prioritizeAllTasks, loading, error 
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('12:00');
  const [duration, setDuration] = useState(30);
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  
  const [isAdding, setIsAdding] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      dueDate,
      dueTime,
      duration,
      category,
      priority,
      status: 'pending'
    });

    setTitle('');
    setDescription('');
    setDuration(30);
    setIsAdding(false);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string, currentVal: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !currentVal } : st
    );

    updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const handleToggleTaskStatus = (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateTask(taskId, { status: nextStatus });
  };

  const getPriorityColor = (level: PriorityLevel) => {
    switch (level) {
      case 'high': return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  const getCategoryIconColor = (cat: TaskCategory) => {
    switch (cat) {
      case 'Work': return 'text-indigo-650 bg-indigo-50 border border-indigo-100';
      case 'Study': return 'text-violet-650 bg-violet-50 border border-violet-100';
      case 'Personal': return 'text-fuchsia-650 bg-fuchsia-50 border border-fuchsia-100';
      case 'Health': return 'text-teal-650 bg-teal-50 border border-teal-100';
      case 'Finance': return 'text-amber-650 bg-amber-50 border border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border border-slate-100';
    }
  };

  return (
    <div className="space-y-6" id="task-view-container">
      {/* Header & Prioritize Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 font-display">Focus Blueprint</h2>
          <p className="text-xs text-slate-500 font-medium">Intelligently organized priorities and execution roads.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-toggle-add-task"
            onClick={() => setIsAdding(!isAdding)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition duration-200 shadow-sm hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          
          <button
            id="btn-ai-prioritize"
            onClick={prioritizeAllTasks}
            disabled={loading || tasks.length === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            {loading ? 'Optimizing...' : 'AI Prioritize'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-rose-800">Execution Blocked</p>
            <p className="text-xs text-rose-600/90 mt-1 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Task Creation Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            id="add-task-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="p-5 bg-white border border-slate-250/90 rounded-2xl space-y-4 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master React 19 concurrent features"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition font-medium"
                />
              </div>

              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description / Scope</label>
                <textarea
                  placeholder="Provide context, links, or specific parameters for AI planner"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition min-h-[80px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition font-medium"
                >
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="p-12 border border-dashed border-slate-300 rounded-2xl text-center space-y-3 bg-white/50">
            <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-slate-800 text-sm font-semibold">Your schedule is clean.</p>
            <p className="text-xs text-slate-500">Create a task and tap AI Prioritize to build your smart blueprint.</p>
          </div>
        ) : (
          tasks.map(task => {
            const isExpanded = expandedTaskId === task.id;
            const completedSubtasksCount = task.subtasks.filter(st => st.completed).length;
            const progressPct = task.subtasks.length > 0 
              ? Math.round((completedSubtasksCount / task.subtasks.length) * 100) 
              : task.status === 'completed' ? 100 : 0;

            return (
              <motion.div
                key={task.id}
                layout
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  task.status === 'completed' 
                    ? 'bg-slate-100/75 border-slate-200 opacity-80' 
                    : isExpanded 
                      ? 'bg-white border-indigo-300 shadow-md ring-1 ring-indigo-50' 
                      : 'bg-white border-slate-200/95 hover:border-slate-350 hover:shadow-xs'
                }`}
              >
                {/* Header Row */}
                <div 
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      id={`btn-complete-task-${task.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTaskStatus(task.id, task.status);
                      }}
                      className="text-slate-400 hover:text-indigo-600 transition shrink-0 cursor-pointer"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5.5 h-5.5 text-indigo-600" />
                      ) : (
                        <div className="w-5.5 h-5.5 rounded-full border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h3 className={`text-sm font-bold tracking-tight text-slate-800 transition-all ${task.status === 'completed' ? 'line-through text-slate-450' : ''}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${getCategoryIconColor(task.category)}`}>
                          {task.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full uppercase font-black text-[8px] tracking-wide ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          {task.duration}m
                        </span>
                        {task.scheduledTime && (
                          <span className="bg-indigo-50 text-indigo-650 border border-indigo-150 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-semibold">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                            {task.scheduledTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.subtasks.length > 0 && (
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                        {completedSubtasksCount}/{task.subtasks.length}
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>

                {/* Progress bar */}
                {task.subtasks.length > 0 && (
                  <div className="h-[2px] bg-slate-100 w-full">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-500" 
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                )}

                {/* Expanded Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t border-slate-150 bg-slate-50/50"
                    >
                      <div className="p-4 space-y-4 text-xs">
                        {task.description && (
                          <div className="space-y-1">
                            <span className="font-bold text-slate-500">Task Scope</span>
                            <p className="text-slate-700 leading-relaxed text-xs bg-white p-3 rounded-xl border border-slate-200">{task.description}</p>
                          </div>
                        )}

                        {/* AI priority explanation */}
                        {task.aiPriorityExplanation && (
                          <div className="p-3.5 bg-violet-50/80 border border-violet-100 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 text-violet-700 font-bold text-[11px]">
                              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                              AI Strategic Planning Insight
                            </div>
                            <p className="text-slate-700 text-xs leading-relaxed font-medium">{task.aiPriorityExplanation}</p>
                          </div>
                        )}

                        {/* Subtasks Section */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-500">Subtask Execution Road</span>
                            {task.subtasks.length === 0 && (
                              <button
                                id={`btn-ai-deconstruct-${task.id}`}
                                onClick={() => deconstructTask(task.id)}
                                disabled={loading}
                                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
                              >
                                <Layers className="w-3 h-3" />
                                {loading ? 'Deconstructing...' : 'AI Deconstruct Goal'}
                              </button>
                            )}
                          </div>

                          {task.subtasks.length > 0 ? (
                            <div className="space-y-1.5 mt-2 bg-white border border-slate-200 p-2.5 rounded-xl shadow-xs">
                              {task.subtasks.map(st => (
                                <div 
                                  key={st.id} 
                                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group transition"
                                >
                                  <button
                                    id={`btn-toggle-subtask-${st.id}`}
                                    onClick={() => handleToggleSubtask(task.id, st.id, st.completed)}
                                    className="flex items-center gap-2.5 text-slate-700 text-left cursor-pointer"
                                  >
                                    {st.completed ? (
                                      <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-400 shrink-0 hover:text-indigo-600 transition" />
                                    )}
                                    <span className={`text-xs font-semibold ${st.completed ? 'line-through text-slate-450' : ''}`}>
                                      {st.title}
                                    </span>
                                  </button>
                                  {st.duration && (
                                    <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0">
                                      {st.duration} min
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 italic font-medium">No structured steps yet. Run AI Deconstruct to break down complex goals autonomously.</p>
                          )}
                        </div>

                        {/* Task Actions Footer */}
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60">
                          <span className="text-[10px] text-slate-400 font-mono font-bold">ID: {task.id}</span>
                          <button
                            id={`btn-delete-task-${task.id}`}
                            onClick={() => deleteTask(task.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Task
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
