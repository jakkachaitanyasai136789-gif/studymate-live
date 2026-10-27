import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { Note } from '../types';
import { getSubjectColor } from '../utils/storage';
import {
  BookOpen,
  Plus,
  Search,
  Pin,
  Edit2,
  Trash2,
  Copy,
  Check,
  Tag,
  Calendar,
  X,
  FileText,
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const {
    notes,
    deleteNote,
    togglePinNote,
    openNoteModal,
    subjects,
    showToast,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [readingNote, setReadingNote] = useState<Note | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        if (selectedSubject !== 'all' && note.subject !== selectedSubject) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(q);
          const matchContent = note.content.toLowerCase().includes(q);
          const matchTags = note.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchContent && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned notes always first, then latest updated
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [notes, selectedSubject, searchQuery]);

  const handleCopyNote = (note: Note) => {
    const text = `${note.title}\nSubject: ${note.subject}\n\n${note.content}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    showToast('Copied to clipboard', `Note "${note.title}" copied.`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Study Notes & Summaries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize lecture cheat sheets, key formulas, revision summaries, and course notes.
          </p>
        </div>

        <button
          onClick={() => openNoteModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search & Subject Filter Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 w-full max-w-full min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search note titles, formulas, or tags..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
          >
            <option value="all">All Courses ({notes.length})</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No notes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery || selectedSubject !== 'all'
              ? 'No study notes matched your search query or subject filter.'
              : 'Keep all your exam formulas, lecture takeaways, and problem sets organized here.'}
          </p>
          <button
            onClick={() => openNoteModal()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0">
          {filteredNotes.map((note) => {
            const subjectColor = getSubjectColor(note.subject);
            const isCopied = copiedId === note.id;

            return (
              <div
                key={note.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-4 sm:p-5 hover:shadow-xs min-w-0 ${
                  note.isPinned
                    ? 'border-indigo-200 shadow-xs ring-1 ring-indigo-100'
                    : 'border-slate-200/80'
                }`}
              >
                <div className="min-w-0">
                  {/* Top Bar inside card: Subject & Pin */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border truncate max-w-[180px] ${subjectColor.bg} ${subjectColor.text} ${subjectColor.border}`}
                    >
                      {note.subject}
                    </span>

                    <button
                      onClick={() => togglePinNote(note.id)}
                      className={`p-1 rounded-md transition-colors shrink-0 ${
                        note.isPinned
                          ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                          : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                      }`}
                      title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setReadingNote(note)}
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-snug line-clamp-2 break-words"
                  >
                    {note.title}
                  </h3>

                  {/* Preview content */}
                  <p
                    onClick={() => setReadingNote(note)}
                    className="text-xs text-slate-600 mt-2 line-clamp-3 sm:line-clamp-4 leading-relaxed font-sans cursor-pointer whitespace-pre-line break-words"
                  >
                    {note.content}
                  </p>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded break-all"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom card footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-mono">{note.updatedAt}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyNote(note)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                      title="Copy note text"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => openNoteModal(note)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit note"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete note "${note.title}"?`)) {
                          deleteNote(note.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Note Reader Modal */}
      {readingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md border bg-indigo-50 text-indigo-700 border-indigo-200 shrink-0">
                  {readingNote.subject}
                </span>
                <span className="text-xs text-slate-500 font-mono truncate">
                  Updated {readingNote.updatedAt}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopyNote(readingNote)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                  title="Copy full text"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const toEdit = readingNote;
                    setReadingNote(null);
                    openNoteModal(toEdit);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                  title="Edit note"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReadingNote(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Reader Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 break-words">{readingNote.title}</h2>

              {readingNote.tags && readingNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {readingNote.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md break-all"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans border-t border-slate-100 pt-3 sm:pt-4 break-words">
                {readingNote.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="truncate">StudyMate Notes</span>
              <button
                onClick={() => setReadingNote(null)}
                className="px-3.5 sm:px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
