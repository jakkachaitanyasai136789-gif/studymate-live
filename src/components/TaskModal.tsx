import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { Priority } from '../types';
import { formatDate } from '../utils/storage';
import { X, CheckSquare, Calendar, Clock, AlertCircle } from 'lucide-react';

export const TaskModal: React.FC = () => {
  const { isTaskModalOpen, closeTaskModal, editingTask, addTask, updateTask, subjects } = useStudy();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; subject?: string; dueDate?: string }>({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      if (subjects.includes(editingTask.subject)) {
        setSubject(editingTask.subject);
        setCustomSubject('');
      } else {
        setSubject('__custom__');
        setCustomSubject(editingTask.subject);
      }
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '');
      setPriority(editingTask.priority);
      setDescription(editingTask.description || '');
    } else {
      setTitle('');
      setSubject(subjects[0] || 'Computer Science');
      setCustomSubject('');
      setDueDate(formatDate(new Date()));
      setDueTime('17:00');
      setPriority('medium');
      setDescription('');
    }
    setErrors({});
  }, [editingTask, isTaskModalOpen, subjects]);

  if (!isTaskModalOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; subject?: string; dueDate?: string } = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    const finalSubject = subject === '__custom__' ? customSubject.trim() : subject.trim();
    if (!finalSubject) newErrors.subject = 'Please choose or enter a subject';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalSubject = subject === '__custom__' ? customSubject.trim() : subject.trim();

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        subject: finalSubject,
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        description: description.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        subject: finalSubject,
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        status: 'pending',
        description: description.trim() || undefined,
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={closeTaskModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 min-w-0">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Binary Search Tree in C++"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-rose-500 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

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
                placeholder="Enter custom subject name"
                className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            )}
            {errors.subject && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.subject}</p>
            )}
          </div>

          {/* Dates & Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                    errors.dueDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.dueDate && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Due Time (Optional)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-1.5 sm:px-3 rounded-xl text-xs font-semibold capitalize border transition-all truncate text-center ${
                      isSelected
                        ? p === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                          : p === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p}</span>
                    <span className="hidden sm:inline"> Priority</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key requirements, textbook page numbers, lab rubric, or instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
