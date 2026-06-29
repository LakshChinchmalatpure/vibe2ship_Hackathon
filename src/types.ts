export type PriorityLevel = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskCategory = 'Work' | 'Study' | 'Personal' | 'Health' | 'Finance' | 'Other';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  duration?: number; // Estimated duration in minutes
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  duration: number; // Duration in minutes
  priority: PriorityLevel;
  aiPriorityExplanation?: string; // AI generated explanation of priority
  status: TaskStatus;
  category: TaskCategory;
  subtasks: Subtask[];
  scheduledTime?: string; // Optional recommended scheduled time, e.g. "09:00 - 10:30"
  tags?: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  topic: string;
  cards: Flashcard[];
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  history: string[]; // Dates (YYYY-MM-DD) when completed
  category: string;
}

export interface NotepadEntry {
  id: string;
  title: string;
  content: string;
  lastUpdated: string; // Date string
  tags?: string[];
}

export interface ProductivityInsight {
  id: string;
  type: 'tip' | 'alert' | 'recommendation';
  title: string;
  content: string;
  timestamp: string;
}

export interface PomodoroSettings {
  workTime: number; // in minutes
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}
