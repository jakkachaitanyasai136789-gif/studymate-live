import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Task,
  TimetableSession,
  StudyLog,
  Note,
  ActiveTab,
  ToastMessage,
} from '../types';
import {
  loadStoredData,
  saveStoredData,
  generateInitialData,
  formatDate,
  PRESET_SUBJECTS,
} from '../utils/storage';

interface StudyContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  timetable: TimetableSession[];
  addSession: (session: Omit<TimetableSession, 'id'>) => void;
  updateSession: (session: TimetableSession) => void;
  deleteSession: (id: string) => void;
  logSessionStudied: (session: TimetableSession, durationMinutes?: number) => void;

  studyLogs: StudyLog[];
  addStudyLog: (log: Omit<StudyLog, 'id' | 'timestamp'>) => void;
  deleteStudyLog: (id: string) => void;
  weeklyGoal: number;
  updateWeeklyGoal: (hours: number) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  subjects: string[];
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  resetToSampleData: () => void;
  clearAllData: () => void;

  // Global modals
  isTaskModalOpen: boolean;
  openTaskModal: (task?: Task) => void;
  closeTaskModal: () => void;
  editingTask: Task | null;

  isSessionModalOpen: boolean;
  openSessionModal: (session?: TimetableSession) => void;
  closeSessionModal: () => void;
  editingSession: TimetableSession | null;

  isNoteModalOpen: boolean;
  openNoteModal: (note?: Note) => void;
  closeNoteModal: () => void;
  editingNote: Note | null;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(() => loadStoredData(), []);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [timetable, setTimetable] = useState<TimetableSession[]>(initial.timetable);
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(initial.studyLogs);
  const [notes, setNotes] = useState<Note[]>(initial.notes);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(initial.weeklyGoal);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TimetableSession | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Sync to local storage whenever core state changes
  useEffect(() => {
    saveStoredData(tasks, timetable, studyLogs, notes, weeklyGoal);
  }, [tasks, timetable, studyLogs, notes, weeklyGoal]);

  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Extract distinct subjects from tasks, timetable, notes, and presets
  const subjects = useMemo(() => {
    const set = new Set<string>(PRESET_SUBJECTS);
    tasks.forEach((t) => t.subject && set.add(t.subject));
    timetable.forEach((s) => s.subject && set.add(s.subject));
    notes.forEach((n) => n.subject && set.add(n.subject));
    return Array.from(set).sort();
  }, [tasks, timetable, notes]);

  // Task Handlers
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: formatDate(new Date()),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added successfully', `"${newTask.title}" added to your tasks list.`, 'success');
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    showToast('Task updated', `"${updatedTask.title}" has been updated.`, 'info');
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed', target ? `"${target.title}" was removed.` : undefined, 'info');
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          const nextCompletedAt = nextStatus === 'completed' ? formatDate(new Date()) : undefined;
          if (nextStatus === 'completed') {
            showToast('Task completed!', `Great job finishing "${t.title}".`, 'success');
          } else {
            showToast('Task marked as pending', `"${t.title}" reopened.`, 'info');
          }
          return {
            ...t,
            status: nextStatus,
            completedAt: nextCompletedAt,
          };
        }
        return t;
      })
    );
  };

  // Timetable Handlers
  const addSession = (sessionData: Omit<TimetableSession, 'id'>) => {
    const newSession: TimetableSession = {
      ...sessionData,
      id: 'tt-' + Date.now(),
    };
    setTimetable((prev) => [...prev, newSession]);
    showToast('Session scheduled', `${newSession.subject} on ${newSession.dayOfWeek} at ${newSession.startTime}.`, 'success');
  };

  const updateSession = (updatedSession: TimetableSession) => {
    setTimetable((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    showToast('Session updated', `${updatedSession.subject} timetable updated.`, 'info');
  };

  const deleteSession = (id: string) => {
    const target = timetable.find((s) => s.id === id);
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    showToast('Session deleted', target ? `${target.subject} session removed.` : undefined, 'info');
  };

  const logSessionStudied = (session: TimetableSession, durationMinutes?: number) => {
    const duration = durationMinutes || session.durationMinutes;
    const todayStr = formatDate(new Date());
    const newLog: StudyLog = {
      id: 'log-' + Date.now(),
      subject: session.subject,
      date: todayStr,
      durationMinutes: duration,
      notes: `Studied scheduled session: ${session.notes || session.subject}`,
      timestamp: Date.now(),
    };
    setStudyLogs((prev) => [newLog, ...prev]);
    showToast(
      'Study time recorded!',
      `Logged ${duration} min of ${session.subject} to today's progress!`,
      'success'
    );
  };

  // Study Log Handlers
  const addStudyLog = (logData: Omit<StudyLog, 'id' | 'timestamp'>) => {
    const newLog: StudyLog = {
      ...logData,
      id: 'log-' + Date.now(),
      timestamp: Date.now(),
    };
    setStudyLogs((prev) => [newLog, ...prev]);
    showToast(
      'Study time logged',
      `Added ${newLog.durationMinutes} minutes for ${newLog.subject}.`,
      'success'
    );
  };

  const deleteStudyLog = (id: string) => {
    setStudyLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Study log removed', undefined, 'info');
  };

  const updateWeeklyGoal = (hours: number) => {
    if (hours > 0 && hours <= 168) {
      setWeeklyGoal(hours);
      showToast('Weekly goal updated', `New target set to ${hours} hours/week.`, 'success');
    }
  };

  // Note Handlers
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const nowStr = formatDate(new Date());
    const newNote: Note = {
      ...noteData,
      id: 'note-' + Date.now(),
      createdAt: nowStr,
      updatedAt: nowStr,
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast('Note created', `"${newNote.title}" saved.`, 'success');
  };

  const updateNote = (updatedNote: Note) => {
    const nowStr = formatDate(new Date());
    const updated: Note = {
      ...updatedNote,
      updatedAt: nowStr,
    };
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    showToast('Note updated', `"${updated.title}" saved.`, 'info');
  };

  const deleteNote = (id: string) => {
    const target = notes.find((n) => n.id === id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted', target ? `"${target.title}" was removed.` : undefined, 'info');
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextPinned = !n.isPinned;
          showToast(nextPinned ? 'Note pinned' : 'Note unpinned', `"${n.title}"`, 'info');
          return { ...n, isPinned: nextPinned };
        }
        return n;
      })
    );
  };

  // Sample data reset & clear
  const resetToSampleData = () => {
    const initialData = generateInitialData();
    setTasks(initialData.tasks);
    setTimetable(initialData.timetable);
    setStudyLogs(initialData.studyLogs);
    setNotes(initialData.notes);
    setWeeklyGoal(initialData.weeklyGoal);
    showToast('Reset completed', 'Sample courses, tasks, timetable and notes restored.', 'success');
  };

  const clearAllData = () => {
    setTasks([]);
    setTimetable([]);
    setStudyLogs([]);
    setNotes([]);
    showToast('All data cleared', 'Planner is ready for your fresh semester.', 'info');
  };

  // Modal openers
  const openTaskModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const openSessionModal = (session?: TimetableSession) => {
    setEditingSession(session || null);
    setIsSessionModalOpen(true);
  };

  const closeSessionModal = () => {
    setIsSessionModalOpen(false);
    setEditingSession(null);
  };

  const openNoteModal = (note?: Note) => {
    setEditingNote(note || null);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  return (
    <StudyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        timetable,
        addSession,
        updateSession,
        deleteSession,
        logSessionStudied,
        studyLogs,
        addStudyLog,
        deleteStudyLog,
        weeklyGoal,
        updateWeeklyGoal,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        subjects,
        toasts,
        showToast,
        dismissToast,
        resetToSampleData,
        clearAllData,
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
        editingTask,
        isSessionModalOpen,
        openSessionModal,
        closeSessionModal,
        editingSession,
        isNoteModalOpen,
        openNoteModal,
        closeNoteModal,
        editingNote,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export function useStudy(): StudyContextType {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
