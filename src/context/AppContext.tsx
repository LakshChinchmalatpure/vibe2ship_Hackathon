import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Habit, NotepadEntry, FlashcardSet, ProductivityInsight, PriorityLevel, TaskStatus, TaskCategory, Subtask } from '../types';

interface AppContextType {
  tasks: Task[];
  habits: Habit[];
  notes: NotepadEntry[];
  flashcardSets: FlashcardSet[];
  insights: ProductivityInsight[];
  completedPomodoros: number;
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
  
  // Tasks Actions
  addTask: (task: Omit<Task, 'id' | 'subtasks'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  deconstructTask: (id: string) => Promise<void>;
  prioritizeAllTasks: () => Promise<void>;
  
  // Habits Actions
  addHabit: (title: string, frequency: 'daily' | 'weekly', category: string) => void;
  toggleHabitDate: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  
  // Notes Actions
  addNote: (title: string, content: string, tags?: string[]) => void;
  updateNote: (id: string, updates: Partial<NotepadEntry>) => void;
  deleteNote: (id: string) => void;
  
  // Flashcards Actions
  addFlashcardSet: (title: string, topic: string, cards: any[]) => void;
  generateFlashcardsAI: (topic: string) => Promise<void>;
  deleteFlashcardSet: (id: string) => void;
  
  // Pomodoro
  incrementPomodoros: () => void;
  
  // Insights
  refreshInsights: () => Promise<void>;
  setError: (err: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [notes, setNotes] = useState<NotepadEntry[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('companion_tasks');
      const storedHabits = localStorage.getItem('companion_habits');
      const storedNotes = localStorage.getItem('companion_notes');
      const storedSets = localStorage.getItem('companion_flashcards');
      const storedInsights = localStorage.getItem('companion_insights');
      const storedPomodoros = localStorage.getItem('companion_pomodoros');

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      else {
        // Seed default high-fidelity demo tasks
        const demoTasks: Task[] = [
          {
            id: 'demo-1',
            title: 'Analyze Q3 Financial Models',
            description: 'Inspect the newly delivered financial sheets and verify compliance ratios.',
            dueDate: new Date().toISOString().split('T')[0],
            dueTime: '17:00',
            duration: 90,
            priority: 'high',
            aiPriorityExplanation: 'Strategic task linked to core financial compliance. Advised to complete in early peak energy state.',
            status: 'pending',
            category: 'Work',
            subtasks: [
              { id: 's1', title: 'Parse spreadsheet raw rows', completed: true },
              { id: 's2', title: 'Extract ratio variables', completed: false },
              { id: 's3', title: 'Draft the compliance overview', completed: false }
            ],
            scheduledTime: '10:00 - 11:30'
          },
          {
            id: 'demo-2',
            title: 'Review System Design Best Practices',
            description: 'Learn modern horizontal scaling and caching patterns.',
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
            dueTime: '14:00',
            duration: 60,
            priority: 'medium',
            aiPriorityExplanation: 'Crucial educational growth task. Highly recommended to break down using study flashcards.',
            status: 'pending',
            category: 'Study',
            subtasks: [],
            scheduledTime: '15:00 - 16:00'
          }
        ];
        setTasks(demoTasks);
      }

      if (storedHabits) setHabits(JSON.parse(storedHabits));
      else {
        const demoHabits: Habit[] = [
          { id: 'h1', title: 'Morning Deep Work Block', frequency: 'daily', streak: 4, history: [], category: 'Work' },
          { id: 'h2', title: 'Hydrate 3 Liters', frequency: 'daily', streak: 12, history: [], category: 'Health' },
          { id: 'h3', title: 'Read 10 Pages', frequency: 'daily', streak: 2, history: [], category: 'Study' }
        ];
        setHabits(demoHabits);
      }

      if (storedNotes) setNotes(JSON.parse(storedNotes));
      else {
        setNotes([
          {
            id: 'n1',
            title: 'System Design Patterns Notes',
            content: '# Scalability Checklist\n- Avoid single point of failure (SPOF)\n- Implement robust read replicas for PostgreSQL database\n- Introduce Redis layer for heavy lookups\n- Leverage CDNs for static resources',
            lastUpdated: new Date().toLocaleString()
          }
        ]);
      }

      if (storedSets) setFlashcardSets(JSON.parse(storedSets));
      else {
        setFlashcardSets([
          {
            id: 'f1',
            title: 'System Architecture Essentials',
            topic: 'System Design',
            cards: [
              { id: 'c1', question: 'What is CAP Theorem?', answer: 'It states that a distributed system can deliver at most two of three guarantees: Consistency, Availability, and Partition Tolerance.' },
              { id: 'c2', question: 'What is Horizontal vs Vertical Scaling?', answer: 'Vertical scaling means adding more power (CPU, RAM) to an existing server, while Horizontal scaling means adding more servers to your pool of resources.' },
              { id: 'c3', question: 'What is a CDN (Content Delivery Network)?', answer: 'A geographically distributed group of servers that cache static assets close to end users to reduce latency.' }
            ]
          }
        ]);
      }

      if (storedInsights) setInsights(JSON.parse(storedInsights));
      else {
        setInsights([
          {
            id: 'i1',
            type: 'tip',
            title: 'Peak Energy Focus',
            content: 'Research shows complex cognitive tasks like financial modelling are 30% more efficient if done before 12:00 PM.',
            timestamp: new Date().toLocaleTimeString()
          },
          {
            id: 'i2',
            type: 'alert',
            title: 'Deadline Horizon',
            content: 'Your task "Analyze Q3 Financial Models" is due today. We recommend prioritizing it immediately.',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }

      if (storedPomodoros) setCompletedPomodoros(parseInt(storedPomodoros));
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
  }, []);

  // Save changes to localStorage when state modifies
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('companion_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (habits.length > 0) localStorage.setItem('companion_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    if (notes.length > 0) localStorage.setItem('companion_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (flashcardSets.length > 0) localStorage.setItem('companion_flashcards', JSON.stringify(flashcardSets));
  }, [flashcardSets]);

  useEffect(() => {
    if (insights.length > 0) localStorage.setItem('companion_insights', JSON.stringify(insights));
  }, [insights]);

  useEffect(() => {
    localStorage.setItem('companion_pomodoros', completedPomodoros.toString());
  }, [completedPomodoros]);

  // Tasks actions
  const addTask = (taskInput: Omit<Task, 'id' | 'subtasks'>) => {
    const newTask: Task = {
      ...taskInput,
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      subtasks: []
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // AI Task Deconstruction Action
  const deconstructTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const response = await fetch('/api/deconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to deconstruct task');
      }

      const rawSubtasks = await response.json();
      const formattedSubtasks: Subtask[] = rawSubtasks.map((st: any, idx: number) => ({
        id: `sub_${id}_${idx}_${Math.random().toString(36).substr(2, 5)}`,
        title: st.title,
        completed: false,
        duration: st.duration
      }));

      updateTask(id, { subtasks: formattedSubtasks });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred during AI deconstruction');
    } finally {
      setLoading(false);
    }
  };

  // AI Task Prioritization
  const prioritizeAllTasks = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, habits })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to prioritize tasks');
      }

      const prioritizationData = await response.json();
      
      setTasks(prev => prev.map(task => {
        const priorityMatch = prioritizationData.find((p: any) => p.id === task.id);
        if (priorityMatch) {
          return {
            ...task,
            priority: priorityMatch.priority as PriorityLevel,
            aiPriorityExplanation: priorityMatch.aiPriorityExplanation,
            scheduledTime: priorityMatch.scheduledTime
          };
        }
        return task;
      }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred during AI prioritization');
    } finally {
      setLoading(false);
    }
  };

  // Habits actions
  const addHabit = (title: string, frequency: 'daily' | 'weekly', category: string) => {
    const newHabit: Habit = {
      id: 'habit_' + Math.random().toString(36).substr(2, 9),
      title,
      frequency,
      streak: 0,
      history: [],
      category
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabitDate = (id: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const index = habit.history.indexOf(date);
        let updatedHistory = [...habit.history];
        let newStreak = habit.streak;

        if (index > -1) {
          updatedHistory.splice(index, 1);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          updatedHistory.push(date);
          newStreak += 1;
        }

        return {
          ...habit,
          history: updatedHistory,
          streak: newStreak
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Notes Actions
  const addNote = (title: string, content: string, tags?: string[]) => {
    const newNote: NotepadEntry = {
      id: 'note_' + Math.random().toString(36).substr(2, 9),
      title,
      content,
      lastUpdated: new Date().toLocaleString(),
      tags
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<NotepadEntry>) => {
    setNotes(prev => prev.map(note => note.id === id ? {
      ...note,
      ...updates,
      lastUpdated: new Date().toLocaleString()
    } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Flashcards Actions
  const addFlashcardSet = (title: string, topic: string, cards: any[]) => {
    const newSet: FlashcardSet = {
      id: 'set_' + Math.random().toString(36).substr(2, 9),
      title,
      topic,
      cards: cards.map((c, idx) => ({ id: `card_${idx}_${Math.random()}`, ...c }))
    };
    setFlashcardSets(prev => [newSet, ...prev]);
  };

  const generateFlashcardsAI = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate flashcards');
      }

      const cards = await response.json();
      addFlashcardSet(`${topic} Mastery`, topic, cards);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred generating flashcards');
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcardSet = (id: string) => {
    setFlashcardSets(prev => prev.filter(s => s.id !== id));
  };

  // Pomodoro
  const incrementPomodoros = () => {
    setCompletedPomodoros(prev => prev + 1);
  };

  // Recommendations and insights
  const refreshInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, habits, completedPomodoros })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate insights');
      }

      const parsedInsights = await response.json();
      const updatedInsights: ProductivityInsight[] = parsedInsights.map((insight: any, index: number) => ({
        id: `ins_${index}_${Date.now()}`,
        type: insight.type,
        title: insight.title,
        content: insight.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      setInsights(updatedInsights);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred loading daily recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      tasks, habits, notes, flashcardSets, insights, completedPomodoros, loading, error, selectedTaskId,
      addTask, updateTask, deleteTask, deconstructTask, prioritizeAllTasks,
      addHabit, toggleHabitDate, deleteHabit,
      addNote, updateNote, deleteNote,
      addFlashcardSet, generateFlashcardsAI, deleteFlashcardSet,
      incrementPomodoros, refreshInsights, setError
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
