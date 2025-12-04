import React, { useState, useEffect } from 'react';
import { Teacher, Complaint } from '../types';
import { registerTeacher, verifyTeacher, getComplaints, updateComplaintStatus } from '../services/storageService';
import { analyzeComplaint } from '../services/geminiService';

interface TeacherModuleProps {
  onBack: () => void;
}

const TeacherModule: React.FC<TeacherModuleProps> = ({ onBack }) => {
  const [user, setUser] = useState<Teacher | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ [key: string]: { summary: string; priority: string; advice: string } }>({});

  useEffect(() => {
    if (user) {
      refreshComplaints();
    }
  }, [user]);

  const refreshComplaints = () => {
    const all = getComplaints();
    // Filter only pending complaints for the main list
    setComplaints(all.filter((c) => c.status === 'pending'));
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isLogin) {
      const teacher = verifyTeacher(authForm.email, authForm.password);
      if (teacher) {
        setUser(teacher);
      } else {
        setAuthError('Invalid credentials. Please try again.');
      }
    } else {
      // Registration Logic
      if (!authForm.email.toLowerCase().includes('seacollege')) {
        setAuthError('Email must contain "seacollege" to register as faculty.');
        return;
      }
      const newTeacher: Teacher = { ...authForm };
      if (registerTeacher(newTeacher)) {
        setUser(newTeacher);
      } else {
        setAuthError('User already exists. Please login.');
      }
    }
  };

  const handleSolve = (id: string, studentName: string) => {
    updateComplaintStatus(id, 'solved');
    refreshComplaints();
    setShowNotification(`Notification sent: Complaint by ${studentName} resolved.`);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleAnalyze = async (complaint: Complaint) => {
    setAnalyzingId(complaint.id);
    const result = await analyzeComplaint(complaint);
    if (result) {
        setAnalysisResult(prev => ({ ...prev, [complaint.id]: result }));
    }
    setAnalyzingId(null);
  };

  // --- Render: Auth Screen ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <button
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-500 hover:text-teal-600 flex items-center"
        >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
        </button>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-700">{isLogin ? 'Teacher Login' : 'Teacher Registration'}</h2>
            <p className="text-gray-500 text-sm mt-2">Access the SeaCollege Faculty Dashboard</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                placeholder="name@seacollege.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              />
            </div>

            {authError && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{authError}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition shadow-md"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "First time here?" : "Already registered?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setAuthError(''); }}
              className="text-teal-600 font-semibold hover:underline"
            >
              {isLogin ? 'Create an account' : 'Login now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render: Dashboard ---
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-teal-100 p-2 rounded-lg">
               <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Faculty Dashboard</h1>
              <p className="text-xs text-gray-500">Welcome, {user.name}</p>
            </div>
          </div>
          <button
            onClick={() => setUser(null)}
            className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 border border-red-100 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce-in z-50">
          <div className="flex items-center">
             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             {showNotification}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          Pending Complaints
          <span className="ml-3 px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">{complaints.length}</span>
        </h2>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Pending Complaints</h3>
            <p className="text-gray-500">All caught up! Have a great day.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{complaint.studentName}</h3>
                      <p className="text-sm text-gray-500">{complaint.branch} • Sem {complaint.semester}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full uppercase tracking-wide">
                      {complaint.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
                  </div>

                  {complaint.photoDataUrl && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Attachment</p>
                      <img
                        src={complaint.photoDataUrl}
                        alt="Proof"
                        className="h-40 w-auto object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90"
                        onClick={() => window.open(complaint.photoDataUrl)}
                      />
                    </div>
                  )}

                    {/* AI Analysis Section */}
                    <div className="mb-4">
                        {analysisResult[complaint.id] ? (
                             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm animate-fade-in">
                                <div className="flex items-center gap-2 mb-2">
                                     <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v2.163l.365.176A7.002 7.002 0 0 1 18 11.5c0 .324-.025.645-.074.96l-.082.392 2.062.993a1 1 0 0 1 .15 1.76l-.15.086-2.063.993.083.392c.049.315.074.636.074.96a7.002 7.002 0 0 1-4.635 6.16l-.365.177V22a1 1 0 0 1-2 0v-2.163l-.365-.176A7.002 7.002 0 0 1 6 12.5c0-.324.025-.645.074-.96l.082-.392-2.062-.993a1 1 0 0 1-.15-1.76l.15-.086 2.063-.993-.083-.392A7.002 7.002 0 0 1 11 5.163V3a1 1 0 0 1 1-1Zm0 5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/></svg>
                                     <span className="font-bold text-indigo-700">AI Insight</span>
                                </div>
                                <p className="mb-1"><span className="font-semibold">Summary:</span> {analysisResult[complaint.id].summary}</p>
                                <p className="mb-1"><span className="font-semibold">Priority:</span> <span className={`font-bold ${analysisResult[complaint.id].priority === 'High' ? 'text-red-600' : 'text-gray-700'}`}>{analysisResult[complaint.id].priority}</span></p>
                                <p><span className="font-semibold">Advice:</span> {analysisResult[complaint.id].advice}</p>
                             </div>
                        ) : (
                            <button
                                onClick={() => handleAnalyze(complaint)}
                                disabled={analyzingId === complaint.id}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                            >
                                {analyzingId === complaint.id ? (
                                    <>
                                        <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        Get AI Analysis
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleSolve(complaint.id, complaint.studentName)}
                      className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Mark as Solved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherModule;
