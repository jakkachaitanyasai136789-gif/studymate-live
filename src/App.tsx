import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navigation } from './components/Navigation';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { TasksPage } from './components/TasksPage';
import { TimetablePage } from './components/TimetablePage';
import { ProgressTrackerPage } from './components/ProgressTrackerPage';
import { NotesPage } from './components/NotesPage';
import { TaskModal } from './components/TaskModal';
import { SessionModal } from './components/SessionModal';
import { NoteModal } from './components/NoteModal';
import { ToastContainer } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useStudy();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'progress':
        return <ProgressTrackerPage />;
      case 'notes':
        return <NotesPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full max-w-full min-w-0 bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Navigation (Sidebar on Desktop, Header & Bottom Bar on Mobile) */}
      <Navigation />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full h-full overflow-hidden">
        {/* Top Header Bar (Desktop only) */}
        <TopNav />

        {/* Scrollable Content Container (with padding bottom on mobile for thumb bar) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full max-w-full min-w-0">
          <div className="max-w-7xl mx-auto w-full max-w-full min-w-0">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <TaskModal />
      <SessionModal />
      <NoteModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
}
