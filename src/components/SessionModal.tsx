import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../utils/storage';
import { X, Calendar, Clock, MapPin, AlignLeft, AlertCircle } from 'lucide-react';

const DURATION_PRESETS = [30, 45, 60, 90, 120, 180];

const ACCENT_COLORS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
];

export const SessionModal: React.FC = () => {
  const {
    isSessionModalOpen,
    closeSessionModal,
    editingSession,
    addSession,
    updateSession,
    subjects,
  } = useStudy();

  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [errors, setErrors] = useState<{ subject?: string; startTime?: string }>({});

  useEffect(() => {
    if (editingSession) {
      if (subjects.includes(editingSession.subject)) {
        setSubject(editingSession.subject);
        setCustomSubject('');
      } else {
        setSubject('__custom__');
        setCustomSubject(editingSession.subject);
      }
      setDayOfWeek(editingSession.dayOfWeek);
      setStartTime(editingSession.startTime);
      setDurationMinutes(editingSession.durationMinutes);
      setLocation(editingSession.location || '');
      setNotes(editingSession.notes || '');
      setColor(editingSession.color || '#6366f1');
    } else {
      setSubject(subjects[0] || 'Computer Science');
      setCustomSubject('');
      setDayOfWeek('Monday');
      setStartTime('10:00');
      setDurationMinutes(60);
      setLocation('');
      setNotes('');
      setColor('#6366f1');
    }
    setErrors({});
  }, [editingSession, isSessionModalOpen, subjects]);

  if (!isSessionModalOpen) return null;

  const validate = () => {
    const newErrors: { subject?: string; startTime?: string } = {};
    const finalSubject = subject === '__custom__' ? customSubject.trim() : subject.trim();
    if (!finalSubject) newErrors.subject = 'Please choose or enter a subject';
    if (!startTime) newErrors.startTime = 'Start time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalSubject = subject === '__custom__' ? customSubject.trim() : subject.trim();

    if (editingSession) {
      updateSession({
        ...editingSession,
        subject: finalSubject,
        dayOfWeek,
        startTime,
        durationMinutes: Number(durationMinutes) || 60,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        color,
      });
    } else {
      addSession({
        subject: finalSubject,
        dayOfWeek,
        startTime,
        durationMinutes: Number(durationMinutes) || 60,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        color,
      });
    }

    closeSessionModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate">
              {editingSession ? 'Edit Timetable Session' : 'Schedule Study Session'}
            </h2>
          </div>
          <button
            onClick={closeSessionModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 min-w-0">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject / Course <span className="text-rose-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="__custom__">+ Add Custom Subject...</option>
            </select>

            {subject === '__custom__' && (
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter custom course name"
                className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            )}
            {errors.subject && (
              <p className="flex items-center gap-1 text-xs text-rose-500 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Day of Week
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = dayOfWeek === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setDayOfWeek(day)}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              {errors.startTime && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Duration (Minutes)
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {DURATION_PRESETS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                      durationMinutes === mins
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Classroom
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Library, Room 302"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Card Color Theme
              </label>
              <div className="flex items-center gap-2 pt-1">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      color === c.value ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Topic / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Study Topic & Preparation Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bring formula sheet and review textbook Chapter 4"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={closeSessionModal}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors"
            >
              {editingSession ? 'Save Session' : 'Add to Timetable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
