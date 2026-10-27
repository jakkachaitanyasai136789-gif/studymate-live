import { Task, TimetableSession, StudyLog, Note, DayOfWeek } from '../types';

const STORAGE_KEYS = {
  TASKS: 'studymate_tasks_v1',
  TIMETABLE: 'studymate_timetable_v1',
  STUDY_LOGS: 'studymate_study_logs_v1',
  NOTES: 'studymate_notes_v1',
  WEEKLY_GOAL: 'studymate_weekly_goal_v1',
};

// Helper to format date YYYY-MM-DD
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function getDayOfWeekName(date: Date): DayOfWeek {
  const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...
  if (dayIndex === 0) return 'Sunday';
  return DAYS_OF_WEEK[dayIndex - 1];
}

export const PRESET_SUBJECTS = [
  'Computer Science',
  'Data Structures & Algorithms',
  'Calculus II',
  'Physics: Electromagnetism',
  'Web Engineering',
  'Database Management',
  'Technical Writing',
];

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'Computer Science': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: '#6366f1' },
  'Data Structures & Algorithms': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', accent: '#8b5cf6' },
  'Calculus II': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: '#3b82f6' },
  'Physics: Electromagnetism': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', accent: '#06b6d4' },
  'Web Engineering': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: '#a855f7' },
  'Database Management': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: '#10b981' },
  'Technical Writing': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: '#f59e0b' },
};

export function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    accent: '#64748b',
  };
}

export function generateInitialData() {
  const today = new Date();
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(addDays(today, 1));
  const in3DaysStr = formatDate(addDays(today, 3));
  const in5DaysStr = formatDate(addDays(today, 5));
  const yesterdayStr = formatDate(addDays(today, -1));
  const twoDaysAgoStr = formatDate(addDays(today, -2));
  const todayDayName = getDayOfWeekName(today);

  const initialTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Complete Binary Search Tree Implementation',
      subject: 'Data Structures & Algorithms',
      dueDate: todayStr,
      dueTime: '18:00',
      priority: 'high',
      status: 'pending',
      description: 'Implement insertion, deletion, and level-order traversal with test unit cases.',
      createdAt: twoDaysAgoStr,
    },
    {
      id: 'task-2',
      title: 'Calculus Problem Set 6: Multiple Integrals',
      subject: 'Calculus II',
      dueDate: tomorrowStr,
      dueTime: '23:59',
      priority: 'high',
      status: 'pending',
      description: 'Questions 14 through 28 on polar coordinates and spherical transformations.',
      createdAt: twoDaysAgoStr,
    },
    {
      id: 'task-3',
      title: 'Maxwell Equations & Gauss Law Lab Report',
      subject: 'Physics: Electromagnetism',
      dueDate: in3DaysStr,
      dueTime: '17:00',
      priority: 'medium',
      status: 'pending',
      description: 'Analyze experimental capacitance data and write error discussion section.',
      createdAt: twoDaysAgoStr,
    },
    {
      id: 'task-4',
      title: 'SQL Normalization & 3NF Schema Draft',
      subject: 'Database Management',
      dueDate: in5DaysStr,
      dueTime: '20:00',
      priority: 'low',
      status: 'pending',
      description: 'Prepare relational schema ER diagram and justify Boyce-Codd normal forms.',
      createdAt: twoDaysAgoStr,
    },
    {
      id: 'task-5',
      title: 'Review Responsive Flexbox & Grid Patterns',
      subject: 'Web Engineering',
      dueDate: yesterdayStr,
      dueTime: '15:00',
      priority: 'medium',
      status: 'completed',
      description: 'Checked layout reflow and mobile breakpoint styling.',
      createdAt: addDays(today, -4).toISOString(),
      completedAt: yesterdayStr,
    },
    {
      id: 'task-6',
      title: 'Technical Resume & Peer Review Draft',
      subject: 'Technical Writing',
      dueDate: twoDaysAgoStr,
      dueTime: '12:00',
      priority: 'low',
      status: 'completed',
      description: 'Completed peer editing and submitted feedback in canvas.',
      createdAt: addDays(today, -5).toISOString(),
      completedAt: twoDaysAgoStr,
    },
  ];

  const initialTimetable: TimetableSession[] = [
    {
      id: 'tt-1',
      subject: 'Data Structures & Algorithms',
      dayOfWeek: todayDayName,
      startTime: '09:00',
      durationMinutes: 90,
      location: 'Science Complex Hall 204',
      notes: 'Graph theory algorithms & adjacency matrices',
      color: '#8b5cf6',
    },
    {
      id: 'tt-2',
      subject: 'Calculus II',
      dayOfWeek: todayDayName,
      startTime: '13:30',
      durationMinutes: 60,
      location: 'Math Building 310',
      notes: 'Review session on integration tricks',
      color: '#3b82f6',
    },
    {
      id: 'tt-3',
      subject: 'Computer Science',
      dayOfWeek: 'Monday',
      startTime: '10:00',
      durationMinutes: 90,
      location: 'Tech Lab 102',
      notes: 'Operating systems process scheduling',
      color: '#6366f1',
    },
    {
      id: 'tt-4',
      subject: 'Physics: Electromagnetism',
      dayOfWeek: 'Tuesday',
      startTime: '11:00',
      durationMinutes: 90,
      location: 'Physics Lab West',
      notes: 'Magnetic induction experiments',
      color: '#06b6d4',
    },
    {
      id: 'tt-5',
      subject: 'Web Engineering',
      dayOfWeek: 'Wednesday',
      startTime: '14:00',
      durationMinutes: 120,
      location: 'Computer Lab 4',
      notes: 'Full-stack application architecture',
      color: '#a855f7',
    },
    {
      id: 'tt-6',
      subject: 'Database Management',
      dayOfWeek: 'Thursday',
      startTime: '15:00',
      durationMinutes: 90,
      location: 'Auditorium C',
      notes: 'ACID transactions & indexing strategies',
      color: '#10b981',
    },
    {
      id: 'tt-7',
      subject: 'Technical Writing',
      dayOfWeek: 'Friday',
      startTime: '10:30',
      durationMinutes: 60,
      location: 'Humanities Wing 112',
      notes: 'Research paper citation workshop',
      color: '#f59e0b',
    },
  ];

  // Initial study logs over the last 7 days so charts and statistics look populated and authentic
  const initialStudyLogs: StudyLog[] = [
    {
      id: 'log-1',
      subject: 'Data Structures & Algorithms',
      date: todayStr,
      durationMinutes: 90,
      notes: 'Implemented AVL tree balancing rotations',
      timestamp: Date.now() - 3600000 * 2,
    },
    {
      id: 'log-2',
      subject: 'Calculus II',
      date: todayStr,
      durationMinutes: 60,
      notes: 'Solved 10 practice problems on triple integrals',
      timestamp: Date.now() - 3600000 * 5,
    },
    {
      id: 'log-3',
      subject: 'Computer Science',
      date: yesterdayStr,
      durationMinutes: 120,
      notes: 'Thread synchronization and mutex locks in C++',
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'log-4',
      subject: 'Physics: Electromagnetism',
      date: yesterdayStr,
      durationMinutes: 75,
      notes: 'Faraday Law numerical exercises',
      timestamp: Date.now() - 86400000 * 1.2,
    },
    {
      id: 'log-5',
      subject: 'Web Engineering',
      date: twoDaysAgoStr,
      durationMinutes: 150,
      notes: 'State management and responsive design patterns',
      timestamp: Date.now() - 86400000 * 2,
    },
    {
      id: 'log-6',
      subject: 'Database Management',
      date: formatDate(addDays(today, -3)),
      durationMinutes: 90,
      notes: 'Query optimization and B-Tree indexes',
      timestamp: Date.now() - 86400000 * 3,
    },
    {
      id: 'log-7',
      subject: 'Calculus II',
      date: formatDate(addDays(today, -4)),
      durationMinutes: 105,
      notes: 'Surface integrals and divergence theorem',
      timestamp: Date.now() - 86400000 * 4,
    },
    {
      id: 'log-8',
      subject: 'Data Structures & Algorithms',
      date: formatDate(addDays(today, -5)),
      durationMinutes: 80,
      notes: 'Dijkstra and A* shortest path algorithms',
      timestamp: Date.now() - 86400000 * 5,
    },
  ];

  const initialNotes: Note[] = [
    {
      id: 'note-1',
      title: 'Graph Traversal Algorithms: BFS vs DFS',
      subject: 'Data Structures & Algorithms',
      content: `### Breadth-First Search (BFS)
- **Data Structure**: Queue (FIFO)
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Best For**: Shortest path in unweighted graphs, level-by-level processing.

### Depth-First Search (DFS)
- **Data Structure**: Stack (LIFO) or Recursion call stack
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) maximum recursion depth
- **Best For**: Topological sorting, detecting cycles, path finding in mazes.

*Key Insight*: In directed acyclic graphs (DAG), DFS post-order traversal reversed gives a valid topological ordering.`,
      isPinned: true,
      tags: ['Algorithms', 'Graphs', 'Exam-Prep'],
      createdAt: twoDaysAgoStr,
      updatedAt: twoDaysAgoStr,
    },
    {
      id: 'note-2',
      title: 'Calculus II: Key Integration Strategies & Polar Jacobians',
      subject: 'Calculus II',
      content: `### Integration by Parts
Formula: ∫ u dv = u v - ∫ v du
- LIATE rule for choosing u:
  1. Logarithmic functions
  2. Inverse trigonometric
  3. Algebraic
  4. Trigonometric
  5. Exponential

### Double Integrals in Polar Coordinates
- dx dy = r dr dθ (Never forget the Jacobian factor 'r'!)
- Circle of radius R centered at origin: x² + y² = r²
- Limits: r from 0 to R, θ from 0 to 2π.`,
      isPinned: true,
      tags: ['Calculus', 'Math', 'Formulas'],
      createdAt: addDays(today, -3).toISOString(),
      updatedAt: addDays(today, -1).toISOString(),
    },
    {
      id: 'note-3',
      title: 'Database Normalization: 1NF to BCNF Summary',
      subject: 'Database Management',
      content: `1. **1NF**: Atomic attributes, no repeating groups.
2. **2NF**: In 1NF and no partial dependencies on candidate keys.
3. **3NF**: In 2NF and no transitive functional dependencies (X → Y, Y is prime or X is superkey).
4. **BCNF**: For every functional dependency X → Y, X must be a superkey.

Lossless Join Property test: R1 ∩ R2 must be a superkey of R1 or R2.`,
      isPinned: false,
      tags: ['Databases', 'SQL', 'Theory'],
      createdAt: addDays(today, -4).toISOString(),
      updatedAt: addDays(today, -4).toISOString(),
    },
    {
      id: 'note-4',
      title: 'Maxwell Equations Differential & Integral Forms',
      subject: 'Physics: Electromagnetism',
      content: `1. **Gauss's Law**: ∇ · E = ρ / ε₀ (Electric flux through closed surface)
2. **Gauss's Law for Magnetism**: ∇ · B = 0 (No magnetic monopoles)
3. **Faraday's Law of Induction**: ∇ × E = -∂B / ∂t
4. **Ampère's Law with Maxwell Addition**: ∇ × B = μ₀(J + ε₀ ∂E / ∂t)

Remember the displacement current term (ε₀ ∂E / ∂t) predicted electromagnetic wave propagation!`,
      isPinned: false,
      tags: ['Physics', 'Electromagnetism', 'Formulas'],
      createdAt: addDays(today, -5).toISOString(),
      updatedAt: addDays(today, -5).toISOString(),
    },
  ];

  return {
    tasks: initialTasks,
    timetable: initialTimetable,
    studyLogs: initialStudyLogs,
    notes: initialNotes,
    weeklyGoal: 20, // 20 hours target per week
  };
}

export function loadStoredData() {
  try {
    const rawTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const rawTimetable = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    const rawLogs = localStorage.getItem(STORAGE_KEYS.STUDY_LOGS);
    const rawNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
    const rawGoal = localStorage.getItem(STORAGE_KEYS.WEEKLY_GOAL);

    if (!rawTasks && !rawTimetable && !rawNotes) {
      const initial = generateInitialData();
      saveStoredData(initial.tasks, initial.timetable, initial.studyLogs, initial.notes, initial.weeklyGoal);
      return initial;
    }

    return {
      tasks: rawTasks ? JSON.parse(rawTasks) : [],
      timetable: rawTimetable ? JSON.parse(rawTimetable) : [],
      studyLogs: rawLogs ? JSON.parse(rawLogs) : [],
      notes: rawNotes ? JSON.parse(rawNotes) : [],
      weeklyGoal: rawGoal ? Number(rawGoal) : 20,
    };
  } catch (err) {
    console.error('Error loading stored StudyMate data:', err);
    return generateInitialData();
  }
}

export function saveStoredData(
  tasks: Task[],
  timetable: TimetableSession[],
  studyLogs: StudyLog[],
  notes: Note[],
  weeklyGoal: number
) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
    localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(studyLogs));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    localStorage.setItem(STORAGE_KEYS.WEEKLY_GOAL, String(weeklyGoal));
  } catch (err) {
    console.error('Error saving StudyMate data:', err);
  }
}
