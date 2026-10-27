import React, { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { Task, Priority } from '../types';
import { getSubjectColor, formatDate } from '../utils/storage';
import {
  CheckSquare,
  Square,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'completed';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    deleteTask,
    openTaskModal,
    subjects,
  } = useStudy();

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  const todayStr = formatDate(new Date());

  // Filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'pending' && task.status !== 'pending') return false;
        if (statusFilter === 'completed' && task.status !== 'completed') return false;

        // Subject filter
        if (selectedSubject !== 'all' && task.subject !== selectedSubject) return false;

        // Priority filter
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchSubject = task.subject.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSubject) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          // Incompleted first, then sort by due date
          const dateDiff = a.dueDate.localeCompare(b.dueDate);
          if (dateDiff !== 0) return dateDiff;
          return (a.dueTime || '').localeCompare(b.dueTime || '');
        }
        if (sortBy === 'priority') {
          const weight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, statusFilter, selectedSubject, selectedPriority, searchQuery, sortBy]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

  const getDueBadge = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) {
      return { text: 'Completed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    const todayNum = new Date(todayStr).getTime();
    const targetNum = new Date(dueDate).getTime();
    const diffDays = Math.round((targetNum - todayNum) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold' };
    }
    if (diffDays === 0) {
      return { text: 'Due today', color: 'text-amber-700 bg-amber-50 border-amber-200 font-semibold' };
    }
    if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    }
    return { text: `Due ${dueDate}`, color: 'text-slate-600 bg-slate-50 border-slate-200' };
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Page Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Tasks & Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your homework, project milestones, and exam preparation items.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Control Bar: Status Tabs, Search, and Filters */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs space-y-3 w-full max-w-full min-w-0">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full min-w-0">
          {/* Segmented Filter Buttons: All, Pending, Completed (equal width on mobile) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 min-w-0 truncate ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>All</span>
              <span className="font-mono tabular-nums text-[10px] sm:text-[11px] text-slate-500">
                ({counts.all})
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 min-w-0 truncate ${
                statusFilter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending</span>
              <span className="font-mono tabular-nums text-[10px] sm:text-[11px] text-amber-600 font-semibold">
                ({counts.pending})
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 min-w-0 truncate ${
                statusFilter === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Done</span>
              <span className="font-mono tabular-nums text-[10px] sm:text-[11px] text-emerald-600 font-semibold">
                ({counts.completed})
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 w-full max-w-full lg:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, or notes..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Secondary Filter dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs w-full min-w-0">
          {/* Subject Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 w-full min-w-0">
            <span className="text-slate-500 font-medium shrink-0">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 w-full min-w-0">
            <span className="text-slate-500 font-medium shrink-0">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 w-full min-w-0">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="dueDate">Due Date (Earliest)</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery || selectedSubject !== 'all' || selectedPriority !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search keywords to find what you are looking for.'
                : 'You have not added any tasks yet. Create one now to stay ahead of your coursework!'}
            </p>
            <button
              onClick={() => openTaskModal()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const subjectColor = getSubjectColor(task.subject);
              const dueInfo = getDueBadge(task.dueDate, isCompleted);

              return (
                <div
                  key={task.id}
                  className={`p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors w-full min-w-0 ${
                    isCompleted ? 'bg-slate-50/40 opacity-75' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-2.5 sm:gap-3.5 flex-1 min-w-0 w-full">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 text-transparent hover:border-indigo-600 hover:text-indigo-600'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-1 min-w-0 flex-1 w-full">
                      {/* Meta badges: Subject, Priority, Due Date */}
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold border ${subjectColor.bg} ${subjectColor.text} ${subjectColor.border} truncate max-w-[170px] sm:max-w-none`}
                        >
                          {task.subject}
                        </span>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] border font-mono ${dueInfo.color}`}>
                          {dueInfo.text}
                          {task.dueTime ? ` · ${task.dueTime}` : ''}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold border capitalize ${
                            task.priority === 'high'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : task.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-xs sm:text-base font-semibold leading-snug break-words ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Description */}
                      {task.description && (
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-2xl break-words">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end gap-1.5 sm:gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
                    <button
                      onClick={() => openTaskModal(task)}
                      className="p-1.5 sm:p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="sm:hidden text-xs">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete task "${task.title}"?`)) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="sm:hidden text-xs text-rose-600">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
