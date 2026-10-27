export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TimetableSession {
  id: string;
  subject: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm (24-hour)
  durationMinutes: number; // e.g. 45, 60, 90, 120
  location?: string;
  notes?: string;
  color?: string; // Tailwind color key or hex
}

export interface StudyLog {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  notes?: string;
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'timetable' | 'progress' | 'notes';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'error' | 'warning';
}
