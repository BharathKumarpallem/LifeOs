import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { QuickAddModal } from './components/modals/QuickAddModal';

// All 15 Module Views
import { OverviewView } from './views/OverviewView';
import { MyDayView } from './views/MyDayView';
import { TasksView } from './views/TasksView';
import { CalendarView } from './views/CalendarView';
import { RemindersView } from './views/RemindersView';
import { BillsView } from './views/BillsView';
import { DocumentsView } from './views/DocumentsView';
import { GoalsHabitsView } from './views/GoalsHabitsView';
import { LearningView } from './views/LearningView';
import { CareerView } from './views/CareerView';
import { FamilyView } from './views/FamilyView';
import { AiAssistantView } from './views/AiAssistantView';
import { AutomationsView } from './views/AutomationsView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { currentSection } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Sticky Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'overview' && <OverviewView />}
          {currentSection === 'my-day' && <MyDayView />}
          {currentSection === 'tasks' && <TasksView />}
          {currentSection === 'calendar' && <CalendarView />}
          {currentSection === 'reminders' && <RemindersView />}
          {currentSection === 'bills' && <BillsView />}
          {currentSection === 'documents' && <DocumentsView />}
          {currentSection === 'goals-habits' && <GoalsHabitsView />}
          {currentSection === 'learning' && <LearningView />}
          {currentSection === 'career' && <CareerView />}
          {currentSection === 'family' && <FamilyView />}
          {currentSection === 'ai-assistant' && <AiAssistantView />}
          {currentSection === 'automations' && <AutomationsView />}
          {currentSection === 'notifications' && <NotificationsView />}
          {currentSection === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <QuickAddModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
