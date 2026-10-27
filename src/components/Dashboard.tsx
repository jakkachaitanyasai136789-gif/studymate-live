import React from 'react';
import { useStudy } from '../context/StudyContext';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CalendarDays,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Flame,
  Target,
  BookOpen,
} from 'lucide-react';
import {
  formatDate,
  addDays,
  getDayOfWeekName,
  getSubjectColor,
  DAYS_OF_WEEK,
} from '../utils/storage';

export const Dashboard: React.FC = () => {
  const {
    tasks,
    timetable,
    studyLogs,
    weeklyGoal,
    toggleTaskComplete,
    openTaskModal,
    openSessionModal,
    setActiveTab,
    logSessionStudied,
  } = useStudy();

  const today = new Date();
  const todayStr = formatDate(today);
  const currentDayName = getDayOfWeekName(today);

  // Statistics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const highPriorityPendingCount = pendingTasks.filter((t) => t.priority === 'high').length;

  // Study hours today
  const todayLogs = studyLogs.filter((l) => l.date === todayStr);
  const todayMinutes = todayLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const todayHours = (todayMinutes / 60).toFixed(1);

  // Weekly study hours (past 7 days including today)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, -6 + i);
    const dateString = formatDate(d);
    const dayName = getDayOfWeekName(d);
    const logsForDay = studyLogs.filter((l) => l.date === dateString);
    const mins = logsForDay.reduce((acc, l) => acc + l.durationMinutes, 0);
    return {
      date: dateString,
      dayShort: dayName.substring(0, 3),
      dayFull: dayName,
      hours: Number((mins / 60).toFixed(1)),
      isToday: dateString === todayStr,
    };
  });

  const totalWeeklyHours = past7Days.reduce((acc, d) => acc + d.hours, 0);
  const maxChartHours = Math.max(6, ...past7Days.map((d) => d.hours));

  // Today's timetable sessions
  const todaySessions = timetable
    .filter((s) => s.dayOfWeek === currentDayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Upcoming deadlines (pending tasks sorted by due date)
  const upcomingDeadlines = [...pendingTasks]
    .sort((a, b) => {
      const dateDiff = a.dueDate.localeCompare(b.dueDate);
      if (dateDiff !== 0) return dateDiff;
      return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
    })
    .slice(0, 5);

  const getDueBadge = (dueDate: string) => {
    const todayNum = new Date(todayStr).getTime();
    const targetNum = new Date(dueDate).getTime();
    const diffDays = Math.round((targetNum - todayNum) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-rose-600 bg-rose-50 border-rose-200' };
    }
    if (diffDays === 0) {
      return { text: 'Due today', color: 'text-amber-700 bg-amber-50 border-amber-200 font-semibold' };
    }
    if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    }
    return { text: `In ${diffDays} days`, color: 'text-slate-600 bg-slate-50 border-slate-200' };
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Welcome & Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-md relative overflow-hidden w-full max-w-full min-w-0">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
          <div className="max-w-xl min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-indigo-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-1.5 sm:mb-2 flex-wrap">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>
                {today.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>·</span>
              <span>Semester Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Welcome to StudyMate
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your smart academic hub. Organize assignments, stay ahead of exam deadlines, track your weekly study hours, and keep notes handy.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
            <button
              onClick={() => openTaskModal()}
              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">Add Task</span>
            </button>
            <button
              onClick={() => openSessionModal()}
              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold rounded-xl transition-all w-full sm:w-auto"
            >
              <Clock className="w-4 h-4 text-indigo-300 shrink-0" />
              <span className="truncate">Create Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-full min-w-0">
        {/* Total Tasks */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between w-full min-w-0">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalTasksCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {completedTasksCount} completed · {pendingTasks.length} pending
            </p>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {completedTasksCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {totalTasksCount > 0
                ? `${Math.round((completedTasksCount / totalTasksCount) * 100)}% overall completion`
                : 'No tasks created yet'}
            </p>
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Assignments</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {pendingTasks.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {highPriorityPendingCount > 0 ? (
                <span className="text-rose-600 font-semibold">{highPriorityPendingCount} high priority</span>
              ) : (
                'All regular priority'
              )}
            </p>
          </div>
        </div>

        {/* Today's Study Hours */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Study Hours</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-700">
              {todayHours} <span className="text-sm font-normal text-slate-500">hrs</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {todayLogs.length} session{todayLogs.length === 1 ? '' : 's'} recorded today
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Chart & Upcoming Deadlines / Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full max-w-full min-w-0">
        {/* Left Column (7 cols): Weekly Progress Chart & Upcoming Deadlines */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
          {/* Weekly Study Progress Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs w-full max-w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Weekly Study Progress</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily logged study hours over the past 7 days
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                <span className="text-xs font-semibold text-slate-700">
                  <span className="font-mono tabular-nums text-indigo-600 font-bold">{totalWeeklyHours.toFixed(1)}</span> / {weeklyGoal}h Target
                </span>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 shrink-0"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="pt-4 sm:pt-6 w-full max-w-full min-w-0 overflow-hidden">
              <div className="h-40 sm:h-44 flex items-end justify-between gap-1 sm:gap-3 px-0.5 sm:px-2 w-full max-w-full min-w-0">
                {past7Days.map((day) => {
                  const heightPercent = Math.max(10, Math.min(100, (day.hours / maxChartHours) * 100));
                  return (
                    <div key={day.date} className="flex-1 min-w-0 flex flex-col items-center gap-1.5 group">
                      {/* Hover Tooltip / Value */}
                      <span className="text-[10px] sm:text-[11px] font-mono tabular-nums text-slate-600 group-hover:text-indigo-600 font-semibold transition-colors">
                        {day.hours > 0 ? `${day.hours}h` : '0h'}
                      </span>
                      {/* Bar */}
                      <div className="w-full max-w-[34px] sm:max-w-[42px] h-28 sm:h-32 bg-slate-100 rounded-t-lg relative flex items-end overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            day.isToday
                              ? 'bg-gradient-to-t from-indigo-700 to-indigo-500 shadow-xs'
                              : 'bg-gradient-to-t from-slate-400 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-400'
                          }`}
                        />
                      </div>
                      {/* Day Label */}
                      <span
                        className={`text-[10px] sm:text-xs font-medium leading-none ${
                          day.isToday
                            ? 'text-indigo-700 font-bold underline decoration-indigo-400 underline-offset-4'
                            : 'text-slate-500'
                        }`}
                      >
                        {day.dayShort}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart footer meta */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Today's active hours</span>
                </div>
                <span>Target: {(weeklyGoal / 7).toFixed(1)} hrs/day</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs w-full max-w-full min-w-0">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Upcoming Deadlines</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assignments and coursework due soon
                </p>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 shrink-0"
              >
                <span>View all ({pendingTasks.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {upcomingDeadlines.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-slate-700">No pending assignments!</p>
                  <p className="text-xs text-slate-500 mt-0.5">You're all caught up on your deadlines.</p>
                  <button
                    onClick={() => openTaskModal()}
                    className="mt-3 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    + Add New Task
                  </button>
                </div>
              ) : (
                upcomingDeadlines.map((task) => {
                  const dueInfo = getDueBadge(task.dueDate);
                  const color = getSubjectColor(task.subject);
                  return (
                    <div
                      key={task.id}
                      className="py-2.5 sm:py-3 flex items-start gap-2.5 sm:gap-3 hover:bg-slate-50/80 p-1.5 sm:p-2 rounded-xl transition-colors w-full min-w-0"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-1 w-5 h-5 rounded-md border border-slate-300 hover:border-indigo-600 flex items-center justify-center text-transparent hover:text-indigo-600 transition-colors shrink-0"
                        title="Mark as completed"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                          <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md border ${color.bg} ${color.text} ${color.border} truncate max-w-[160px] sm:max-w-none`}>
                            {task.subject}
                          </span>
                          <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md border font-mono ${dueInfo.color}`}>
                            {dueInfo.text}
                          </span>
                          {task.priority === 'high' && (
                            <span className="text-[10px] sm:text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md font-semibold">
                              High Priority
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 mt-1 line-clamp-2 break-words">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Today's Schedule & Quick Actions */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs w-full max-w-full min-w-0">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Today's Schedule</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentDayName} study classes & sessions
                </p>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 shrink-0"
              >
                <span>Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
              {todaySessions.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No sessions scheduled today</p>
                  <p className="text-xs text-slate-500 mt-0.5">Enjoy your free time or schedule a study block.</p>
                  <button
                    onClick={() => openSessionModal()}
                    className="mt-3 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    + Schedule Session
                  </button>
                </div>
              ) : (
                todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all w-full min-w-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: session.color || '#6366f1' }}
                          />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {session.subject}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] sm:text-xs text-slate-600 font-mono flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            {session.startTime} ({session.durationMinutes}m)
                          </span>
                          {session.location && (
                            <span className="text-slate-500 truncate max-w-[150px]">
                              · {session.location}
                            </span>
                          )}
                        </div>
                        {session.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">
                            {session.notes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => logSessionStudied(session)}
                        className="self-start sm:self-auto px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors shrink-0"
                        title="Add session duration to today's study progress"
                      >
                        Log as Done
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Academic Quick Focus & Notes teaser */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-3 sm:space-y-4 w-full max-w-full min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Quick Tools</h3>
            
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full min-w-0">
              <button
                onClick={() => setActiveTab('progress')}
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left flex flex-col justify-between min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">Focus Timer</span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 truncate block">Pomodoro 25m</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left flex flex-col justify-between min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">Study Notes</span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 truncate block">Cheat sheets</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

