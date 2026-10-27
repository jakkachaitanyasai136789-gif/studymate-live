import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { Note } from '../types';
import { X, BookOpen, Tag, Pin, AlertCircle } from 'lucide-react';

export const NoteModal: React.FC = () => {
  const {
    isNoteModalOpen,
    closeNoteModal,
    editingNote,
    addNote,
    updateNote,
    subjects,
  } = useStudy();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; subject?: string; content?: string }>({});

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      if (subjects.includes(editingNote.subject)) {
        setSubject(editingNote.subject);
        setCustomSubject('');
      } else {
        setSubject('__custom__');
        setCustomSubject(editingNote.subject);
      }
      setContent(editingNote.content);
      setTagsInput(editingNote.tags ? editingNote.tags.join(', ') : '');
      setIsPinned(editingNote.isPinned);
    } else {
      setTitle('');
      setSubject(subjects[0] || 'Computer Science');
      setCustomSubject('');
      setContent('');
      setTagsInput('');
      setIsPinned(false);
    }
    setErrors({});
  }, [editingNote, isNoteModalOpen, subjects]);

  if (!isNoteModalOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; subject?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = 'Note title is required';
    const finalSubject = subject === '__custom__' ? customSubject.trim() : subject.trim();
    if (!finalSubject) newErrors.subject = 'Please choose or enter a subject';
    if (!content.trim()) newErrors.content = 'Note content cannot be empty';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalSubject = subject === '__custom__' ? customSubject.trim() : subject.trim();
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingNote) {
      updateNote({
        ...editingNote,
        title: title.trim(),
        subject: finalSubject,
        content: content.trim(),
        tags: tagsArray,
        isPinned,
      });
    } else {
      addNote({
        title: title.trim(),
        subject: finalSubject,
        content: content.trim(),
        tags: tagsArray,
        isPinned,
      });
    }

    closeNoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate">
              {editingNote ? 'Edit Study Note' : 'Create Study Note'}
            </h2>
          </div>
          <button
            onClick={closeNoteModal}
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
              Note Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Graph Traversal Algorithms: BFS vs DFS"
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

          {/* Subject & Pin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
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
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.subject}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <Pin className={`w-3.5 h-3.5 ${isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <span>Pin to top</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags (Comma separated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Algorithms, Exam-Prep, Formulas"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Note Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Supports headers (#, ##), bullet points (-), and bold</span>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your study notes, summary, definitions, key formulas, or questions for professor..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                errors.content ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {errors.content && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={closeNoteModal}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors"
            >
              {editingNote ? 'Save Changes' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
