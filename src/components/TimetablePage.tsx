import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { TimetableSession, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../utils/storage';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  CheckCircle,
  Filter,
  Check,
} from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const {
    timetable,
    deleteSession,
    openSessionModal,
    logSessionStudied,
    subjects,
  } = useStudy();

  const [activeDay, setActiveDay] = useState<DayOfWeek | 'all'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSessions = timetable
    .filter((s) => {
      if (activeDay !== 'all' && s.dayOfWeek !== activeDay) return false;
      if (subjectFilter !== 'all' && s.subject !== subjectFilter) return false;
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Group by day of week for weekly grid
  const sessionsByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = timetable
      .filter((s) => s.dayOfWeek === day && (subjectFilter === 'all' || s.subject === subjectFilter))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<DayOfWeek, TimetableSession[]>);

  const totalSessionsCount = timetable.length;
  const totalWeeklyMinutes = timetable.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Study Timetable & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly class calendar, lecture schedules, and focused study blocks.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => openSessionModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Session</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full min-w-0">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between w-full min-w-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Scheduled Blocks
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {totalSessionsCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between w-full min-w-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Weekly Scheduled Time
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {(totalWeeklyMinutes / 60).toFixed(1)} <span className="text-xs font-normal text-slate-500">hours</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between w-full min-w-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Courses
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 mt-1">
              {new Set(timetable.map((s) => s.subject)).size}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs space-y-3 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full min-w-0">
          {/* Day of Week Tabs (smooth horizontal scroll on small screens) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveDay('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeDay === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Whole Week
            </button>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeDay === day
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium shrink-0">Course:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Timetable View */}
      {activeDay === 'all' ? (
        /* Weekly Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map((day) => {
            const daySessions = sessionsByDay[day];
            return (
              <div
                key={day}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
              >
                {/* Day Header */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 tracking-tight">{day}</span>
                  <span className="text-[11px] font-mono tabular-nums text-slate-500">
                    {daySessions.length}
                  </span>
                </div>

                {/* Day sessions */}
                <div className="p-2.5 flex-1 space-y-2 min-h-[160px]">
                  {daySessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-3 text-center text-slate-400">
                      <span className="text-xs italic">No sessions</span>
                      <button
                        onClick={() => openSessionModal()}
                        className="mt-2 text-[11px] text-indigo-600 font-semibold hover:underline"
                      >
                        + Add
                      </button>
                    </div>
                  ) : (
                    daySessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-indigo-300 transition-all group"
                      >
                        {/* Time & Duration */}
                        <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1">
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-600" />
                            {session.startTime}
                          </span>
                          <span className="text-[11px]">{session.durationMinutes}m</span>
                        </div>

                        {/* Subject */}
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {session.subject}
                        </h4>

                        {/* Location */}
                        {session.location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                            <span className="truncate">{session.location}</span>
                          </div>
                        )}

                        {/* Notes */}
                        {session.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                            {session.notes}
                          </p>
                        )}

                        {/* Session Actions */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => logSessionStudied(session)}
                            className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
                            title="Log session to today's study progress"
                          >
                            Mark Done
                          </button>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => openSessionModal(session)}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              title="Edit session"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${session.subject} session?`)) {
                                  deleteSession(session.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Delete session"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Day Focused View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-6 w-full max-w-full min-w-0">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{activeDay}'s Schedule</h3>
              <p className="text-xs text-slate-500">
                {filteredSessions.length} session{filteredSessions.length === 1 ? '' : 's'} scheduled
              </p>
            </div>
            <button
              onClick={() => openSessionModal()}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0"
            >
              + Add Session
            </button>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No sessions scheduled for {activeDay}</p>
              <p className="text-xs text-slate-500 mt-1">Plan your lectures, revision time, or lab sessions.</p>
              <button
                onClick={() => openSessionModal()}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Schedule Session
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: session.color || '#6366f1' }}
                      />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{session.subject}</h4>
                      <span className="text-[11px] sm:text-xs font-mono text-slate-500">
                        {session.startTime} · {session.durationMinutes}m
                      </span>
                    </div>
                    {session.location && (
                      <p className="text-xs text-slate-600 flex items-center gap-1 pl-4.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{session.location}</span>
                      </p>
                    )}
                    {session.notes && (
                      <p className="text-[11px] sm:text-xs text-slate-500 italic pl-4.5 line-clamp-2">{session.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 sm:gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      onClick={() => logSessionStudied(session)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                    >
                      Log as Studied
                    </button>
                    <button
                      onClick={() => openSessionModal(session)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${session.subject} session?`)) {
                          deleteSession(session.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
