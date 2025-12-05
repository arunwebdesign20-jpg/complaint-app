import React from 'react';
import { ViewState } from '../types';

interface StartScreenProps {
  onNavigate: (view: ViewState) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
          SeaCollege Voice
        </h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          A seamless bridge between students and faculty. Report issues, track resolutions, and improve our campus together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8">
        
        {/* Student Button */}
        <button
          onClick={() => onNavigate('STUDENT')}
          className="group relative flex flex-col items-center p-8 bg-white border-2 border-blue-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Student</h2>
          <p className="text-gray-500 mt-2 text-center">Submit complaints and feedback instantly.</p>
        </button>

        {/* Teacher Button */}
        <button
          onClick={() => onNavigate('TEACHER')}
          className="group relative flex flex-col items-center p-8 bg-white border-2 border-teal-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Teacher</h2>
          <p className="text-gray-500 mt-2 text-center">Review submissions and resolve issues.</p>
        </button>

      </div>
    </div>
  );
};

export default StartScreen;
