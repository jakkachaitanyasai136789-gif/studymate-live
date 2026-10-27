import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { formatDate, addDays, getSubjectColor } from '../utils/storage';
import {
  CheckCircle2,
  Clock,
  Target,
  Flame,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  BookOpen,
  Award,
  TrendingUp,
} from 'lucide-react';

export const ProgressTrackerPage: React.FC = () => {
  const {
    tasks,
    studyLogs,
    addStudyLog,
    deleteStudyLog,
    weeklyGoal,
    updateWeeklyGoal,
    subjects,
  } = useStudy();

  const today = new Date();
  const todayStr = formatDate(today);

  // Manual study log form state
  const [manualSubject, setManualSubject] = useState(subjects[0] || 'Computer Science');
  const [manualDuration, setManualDuration] = useState('45');
  const [manualNotes, setManualNotes] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState(String(weeklyGoal));

  // Focus Timer / Pomodoro state
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timerSubject, setTimerSubject] = useState(subjects[0] || 'Computer Science');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  // Handle timer countdown
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            // Auto log session if Pomodoro finished
            if (timerMode === 'pomodoro') {
              addStudyLog({
                subject: timerSubject,
                date: todayStr,
                durationMinutes: 25,
                notes: 'Completed 25-minute Pomodoro study focus session',
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerMode, timerSubject, todayStr, addStudyLog]);

  const switchTimerMode = (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === 'pomodoro') setTimeLeft(25 * 60);
    if (timerMode === 'shortBreak') setTimeLeft(5 * 60);
    if (timerMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTimerDisplay = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Metrics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Past 7 days study hours
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, -6 + i);
    const dateString = formatDate(d);
    const logs = studyLogs.filter((l) => l.date === dateString);
    const mins = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
    return {
      date: dateString,
      dayShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: Number((mins / 60).toFixed(1)),
      isToday: dateString === todayStr,
    };
  });

  const weeklyStudyHours = past7Days.reduce((acc, d) => acc + d.hours, 0);
  const weeklyGoalPercentage = Math.min(100, Math.round((weeklyStudyHours / (weeklyGoal || 1)) * 100));

  // Subject-wise study hours breakdown
  const subjectHours = useMemo(() => {
    const map: Record<string, number> = {};
    studyLogs.forEach((log) => {
      map[log.subject] = (map[log.subject] || 0) + log.durationMinutes;
    });
    return Object.entries(map)
      .map(([subject, minutes]) => ({
        subject,
        hours: Number((minutes / 60).toFixed(1)),
        minutes,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [studyLogs]);

  // Subject-wise task breakdown
  const subjectTasks = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    tasks.forEach((task) => {
      if (!map[task.subject]) map[task.subject] = { total: 0, completed: 0 };
      map[task.subject].total += 1;
      if (task.status === 'completed') map[task.subject].completed += 1;
    });
    return Object.entries(map).map(([subject, data]) => ({
      subject,
      ...data,
      rate: Math.round((data.completed / data.total) * 100),
    }));
  }, [tasks]);

  const handleManualLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(manualDuration, 10);
    if (!duration || duration <= 0) return;

    addStudyLog({
      subject: manualSubject,
      date: todayStr,
      durationMinutes: duration,
      notes: manualNotes.trim() || undefined,
    });

    setManualNotes('');
    setManualDuration('45');
  };

  const handleGoalSave = () => {
    const val = Number(newGoalInput);
    if (val > 0 && val <= 168) {
      updateWeeklyGoal(val);
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Progress Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze your study time, monitor weekly goals, and track task completions.
          </p>
        </div>
      </div>

      {/* Top 3 Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full min-w-0">
        {/* Task Completion Rate Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between w-full min-w-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Task Completion Rate
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 mt-1.5 sm:mt-2">
              {taskCompletionRate}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {completedTasks} of {totalTasks} assignments done
            </p>
          </div>
          <div className="w-14 sm:w-16 h-14 sm:h-16 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-500"
                strokeDasharray={`${taskCompletionRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 absolute" />
          </div>
        </div>

        {/* Weekly Study Hours vs Goal */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between w-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Weekly Study Hours
            </span>
            {isEditingGoal ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  className="w-14 px-1.5 py-0.5 text-xs font-mono border rounded"
                  min="1"
                  max="100"
                />
                <button
                  onClick={handleGoalSave}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingGoal(true)}
                className="text-[11px] text-slate-400 hover:text-indigo-600 font-medium"
              >
                Edit ({weeklyGoal}h)
              </button>
            )}
          </div>
          <div className="mt-1.5 sm:mt-2">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-indigo-700">
              {weeklyStudyHours.toFixed(1)}{' '}
              <span className="text-sm font-normal text-slate-500">/ {weeklyGoal} hrs</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full mt-2.5 sm:mt-3 overflow-hidden">
              <div
                style={{ width: `${weeklyGoalPercentage}%` }}
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {weeklyGoalPercentage}% of your {weeklyGoal}h weekly study target
            </p>
          </div>
        </div>

        {/* Total Sessions Logged */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between w-full min-w-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Logged Sessions
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 mt-1.5 sm:mt-2">
              {studyLogs.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {(studyLogs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60).toFixed(1)} all-time hours
            </p>
          </div>
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Grid: Study Focus Timer & Manual Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full max-w-full min-w-0">
        {/* Focus Study Timer / Pomodoro (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs w-full max-w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Study Focus Timer</h3>
                <p className="text-[11px] sm:text-xs text-slate-500">Pomodoro timer with automatic study log sync</p>
              </div>
            </div>

            {/* Mode Selector (3 equal buttons on mobile, fits within 360px) */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-xs w-full sm:w-auto shrink-0">
              <button
                onClick={() => switchTimerMode('pomodoro')}
                className={`px-1.5 sm:px-2.5 py-1 rounded-md font-medium transition-colors text-center truncate ${
                  timerMode === 'pomodoro'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                25m Focus
              </button>
              <button
                onClick={() => switchTimerMode('shortBreak')}
                className={`px-1.5 sm:px-2.5 py-1 rounded-md font-medium transition-colors text-center truncate ${
                  timerMode === 'shortBreak'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5m Break
              </button>
              <button
                onClick={() => switchTimerMode('longBreak')}
                className={`px-1.5 sm:px-2.5 py-1 rounded-md font-medium transition-colors text-center truncate ${
                  timerMode === 'longBreak'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                15m Break
              </button>
            </div>
          </div>

          <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center w-full">
            {/* Subject selector for the timer session */}
            <div className="mb-3 sm:mb-4 flex items-center gap-2 max-w-full">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Studying:</span>
              <select
                value={timerSubject}
                onChange={(e) => setTimerSubject(e.target.value)}
                disabled={isTimerRunning}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate max-w-[200px] sm:max-w-none"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer Digits */}
            <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-mono tabular-nums text-slate-900 tracking-tight my-2">
              {formatTimerDisplay(timeLeft)}
            </div>

            <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs mt-1 px-2">
              {timerMode === 'pomodoro'
                ? 'Stay focused until the timer rings. The 25 minutes will automatically be added to your study progress.'
                : 'Take a breath, stretch, and relax before your next session.'}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-xs transition-all ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isTimerRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-2.5 sm:p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Study Logger (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs w-full max-w-full min-w-0">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Manual Study Log</h3>
              <p className="text-xs text-slate-500">Record offline study or library sessions</p>
            </div>
          </div>

          <form onSubmit={handleManualLogSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Course / Subject
              </label>
              <select
                value={manualSubject}
                onChange={(e) => setManualSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Duration (Minutes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500 shrink-0">mins</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Notes / What was studied (Optional)
              </label>
              <input
                type="text"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="e.g. Chapter 6 review & practice problems"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Add Study Log
            </button>
          </form>
        </div>
      </div>

      {/* Subject-Wise Analytics & Recent Study History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full max-w-full min-w-0">
        {/* Subject-Wise Time Distribution */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs w-full max-w-full min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Subject Time Distribution</h3>
          <p className="text-xs text-slate-500 mb-3 sm:mb-4">Total study hours spent on each course</p>

          {subjectHours.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">No study logs yet</p>
          ) : (
            <div className="space-y-3">
              {subjectHours.map((item) => {
                const maxHours = subjectHours[0]?.hours || 1;
                const percent = Math.min(100, Math.round((item.hours / maxHours) * 100));
                const color = getSubjectColor(item.subject);

                return (
                  <div key={item.subject} className="space-y-1 w-full min-w-0">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-semibold text-slate-800 truncate">{item.subject}</span>
                      <span className="font-mono tabular-nums text-slate-600 shrink-0">
                        {item.hours}h ({item.minutes}m)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-indigo-600 h-full rounded-full transition-all"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Study Activity Log */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs w-full max-w-full min-w-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Study History</h3>
              <p className="text-xs text-slate-500">Activity stream of your latest study sessions</p>
            </div>
            <span className="text-xs font-mono text-slate-500 shrink-0">{studyLogs.length} entries</span>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {studyLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center italic">
                No study sessions recorded yet. Start the Focus Timer or log a session!
              </p>
            ) : (
              studyLogs.slice(0, 10).map((log) => {
                const color = getSubjectColor(log.subject);
                return (
                  <div
                    key={log.id}
                    className="p-2.5 sm:p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2.5 text-xs w-full min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${color.bg} ${color.text} ${color.border} truncate max-w-[150px] sm:max-w-none`}>
                          {log.subject}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{log.date}</span>
                      </div>
                      {log.notes && (
                        <p className="text-slate-600 mt-0.5 line-clamp-1 italic text-[11px] break-words">
                          {log.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 sm:px-2 py-0.5 rounded text-[11px]">
                        +{log.durationMinutes}m
                      </span>
                      <button
                        onClick={() => deleteStudyLog(log.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
