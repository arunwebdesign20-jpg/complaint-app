import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import StudentModule from './components/StudentModule';
import TeacherModule from './components/TeacherModule';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('START');

  // Debug log (helps you see if component is rendering)
  console.log("Rendering App, view:", currentView);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      <main className="container mx-auto py-8">
        {currentView === 'START' && (
          <StartScreen onNavigate={setCurrentView} />
        )}

        {currentView === 'STUDENT' && (
          <StudentModule onBack={() => setCurrentView('START')} />
        )}

        {currentView === 'TEACHER' && (
          <TeacherModule onBack={() => setCurrentView('START')} />
        )}
      </main>

      {/* Footer only on Start screen */}
      {currentView === 'START' && (
        <footer className="fixed bottom-0 w-full text-center py-4 text-gray-400 text-sm">
          © {new Date().getFullYear()} SeaCollege • Campus Complaint Portal
        </footer>
      )}
    </div>
  );
};

export default App;
