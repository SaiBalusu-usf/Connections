import React, { useState } from 'react';
import { UserMode } from './types';
import { GraduationCap, Briefcase, ArrowLeft, Linkedin, Github } from 'lucide-react';
import StudentView from './components/StudentView';
import ProfessionalView from './components/ProfessionalView';

const App: React.FC = () => {
  const [mode, setMode] = useState<UserMode>('home');

  const renderContent = () => {
    switch (mode) {
      case 'student':
        return <StudentView />;
      case 'professional':
        return <ProfessionalView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-700">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Connections</h1>
              <p className="text-xl text-slate-500 max-w-md mx-auto">
                The intelligent way to manage your network, track applications, and build your LinkedIn presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
              <button
                onClick={() => setMode('student')}
                className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Student</h2>
                <p className="text-slate-500">
                  Track job applications, organize internships, and generate entry-level content.
                </p>
                <div className="absolute bottom-4 text-brand-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Get Started &rarr;
                </div>
              </button>

              <button
                onClick={() => setMode('professional')}
                className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-400 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Professional</h2>
                <p className="text-slate-500">
                  Manage network connections, leads, and create thought leadership content.
                </p>
                <div className="absolute bottom-4 text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Get Started &rarr;
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {mode !== 'home' && (
              <button 
                onClick={() => setMode('home')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-1.5 rounded-lg">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Connections</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {mode !== 'home' && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                ${mode === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                {mode} View
              </span>
            )}
            <a href="#" className="text-slate-400 hover:text-slate-600">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
