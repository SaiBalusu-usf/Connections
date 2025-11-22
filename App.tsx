import React, { useState, useEffect } from 'react';
import { UserMode } from './types';
import { GraduationCap, Briefcase, ArrowLeft, Linkedin, Moon, Sun } from 'lucide-react';
import StudentView from './components/StudentView';
import ProfessionalView from './components/ProfessionalView';
import LiveBackground from './components/LiveBackground';

const App: React.FC = () => {
  const [mode, setMode] = useState<UserMode>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (mode) {
      case 'student':
        return <StudentView />;
      case 'professional':
        return <ProfessionalView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-700">
            <div className="text-center mb-12 relative z-10">
              <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">Connections</h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                The intelligent way to manage your network, track applications, and build your LinkedIn presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 relative z-10">
              <button
                onClick={() => setMode('student')}
                className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-brand-400 dark:hover:border-brand-500 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Student</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Track job applications, organize internships, and generate entry-level content.
                </p>
                <div className="absolute bottom-4 text-brand-600 dark:text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  Get Started &rarr;
                </div>
              </button>

              <button
                onClick={() => setMode('professional')}
                className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Professional</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Manage network connections, leads, and create thought leadership content.
                </p>
                <div className="absolute bottom-4 text-purple-600 dark:text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  Get Started &rarr;
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300">
      <LiveBackground theme={isDarkMode ? 'dark' : 'light'} />
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {mode !== 'home' && (
              <button 
                onClick={() => setMode('home')}
                className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMode('home')}>
              <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 p-1.5 rounded-lg shadow-md">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Connections</span>
            </div>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-300"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] overflow-hidden relative z-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;