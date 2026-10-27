import React from 'react';
import { useStudy } from '../context/StudyContext';
import { Plus, Clock, Sparkles } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { activeTab, openTaskModal, openSessionModal } = useStudy();

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'tasks':
        return 'Task & Assignment Tracker';
      case 'timetable':
        return 'Weekly Study Timetable';
      case 'progress':
        return 'Academic Progress & Analytics';
      case 'notes':
        return 'Study Notes & Summaries';
      default:
        return 'Planner';
    }
  };

  return (
    <header className="hidden lg:flex h-16 bg-white border-b border-slate-200/80 px-8 items-center justify-between shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] w-full">
      {/* Breadcrumb Area */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <span className="hidden sm:inline">StudyMate</span>
        <span className="hidden sm:inline text-slate-300">/</span>
        <span className="text-slate-900 font-bold text-sm tracking-tight">
          {getBreadcrumbTitle()}
        </span>
      </div>

      {/* Right Primary Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => openSessionModal()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors whitespace-nowrap shrink-0"
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>New Session</span>
        </button>

        <button
          onClick={() => openTaskModal()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
