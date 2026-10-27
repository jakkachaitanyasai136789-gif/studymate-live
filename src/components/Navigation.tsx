import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  LineChart,
  BookOpen,
  Plus,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Menu,
  X,
  Clock,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    tasks,
    openTaskModal,
    openSessionModal,
    resetToSampleData,
    clearAllData,
  } = useStudy();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDataOptions, setShowDataOptions] = useState(false);

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'timetable', label: 'Study Timetable', icon: CalendarDays },
    { id: 'progress', label: 'Progress Tracker', icon: LineChart },
    { id: 'notes', label: 'Study Notes', icon: BookOpen },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible lg:flex) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight leading-none block">
                StudyMate
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-tight">
                Smart Student Planner
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-4 border-b border-slate-100 space-y-2">
          <button
            onClick={() => openTaskModal()}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm shadow-indigo-100"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
          <button
            onClick={() => openSessionModal()}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Schedule Session</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 pt-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-700 font-semibold'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom utility controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="relative">
            <button
              onClick={() => setShowDataOptions(!showDataOptions)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Manage Data</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">v1.0</span>
            </button>

            {showDataOptions && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white rounded-xl shadow-lg border border-slate-200 text-xs space-y-1 z-30">
                <button
                  onClick={() => {
                    resetToSampleData();
                    setShowDataOptions(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>Reset Sample College Data</span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all tasks, notes, and timetable entries?')) {
                      clearAllData();
                      setShowDataOptions(false);
                    }
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200/90 px-3.5 h-14 flex items-center justify-between w-full max-w-full min-w-0 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-900 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                StudyMate
              </span>
              <span className="text-[10px] text-slate-400">·</span>
              <span className="text-[11px] font-semibold text-indigo-600 capitalize truncate">
                {activeTab}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 leading-none block mt-0.5">
              College Planner
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => openTaskModal()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-xs font-semibold shadow-xs"
            title="Add Task"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Task</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end w-full max-w-full">
          <div className="bg-white rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto space-y-3 w-full max-w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Planner Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  openTaskModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
              <button
                onClick={() => {
                  openSessionModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-100"
              >
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>New Session</span>
              </button>
            </div>

            <div className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => {
                  resetToSampleData();
                  setMobileMenuOpen(false);
                }}
                className="text-indigo-600 font-medium hover:underline"
              >
                Reset Sample Data
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Clear all tasks and notes?')) {
                    clearAllData();
                    setMobileMenuOpen(false);
                  }
                }}
                className="text-rose-600 font-medium hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (5 tabs, perfect fit for 360px-430px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around w-full max-w-full min-w-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const shortLabels: Record<ActiveTab, string> = {
            dashboard: 'Overview',
            tasks: 'Tasks',
            timetable: 'Timetable',
            progress: 'Progress',
            notes: 'Notes',
          };
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 min-w-0 transition-colors relative ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-4.5 h-4.5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5 tracking-tight truncate max-w-full leading-none">
                {shortLabels[item.id]}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
