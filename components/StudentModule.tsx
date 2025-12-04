import React, { useState } from 'react';
import { Branch, Complaint } from '../types';
import { saveComplaint } from '../services/storageService';

interface StudentModuleProps {
  onBack: () => void;
}

const StudentModule: React.FC<StudentModuleProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    branch: Branch.CSE,
    semester: 1,
    description: '',
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const branches = Object.values(Branch);
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      if (file.size > 2000000) { // 2MB limit check
          alert("File is too large. Please upload an image smaller than 2MB.");
          return;
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newComplaint: Complaint = {
      id: crypto.randomUUID(),
      studentName: formData.name,
      branch: formData.branch,
      semester: formData.semester,
      description: formData.description,
      photoDataUrl: photo || undefined,
      status: 'pending',
      timestamp: Date.now(),
    };

    // Simulate network delay
    setTimeout(() => {
      saveComplaint(newComplaint);
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Complaint Submitted!</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for reaching out. Your complaint has been forwarded to the faculty dashboard.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-500 hover:text-blue-600 transition"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Submit a Complaint</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Engineering Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value as Branch })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Complaint Description</label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Describe your issue in detail..."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attach Photo (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition cursor-pointer relative">
              <div className="space-y-1 text-center">
                {photo ? (
                  <div className="relative">
                    <img src={photo} alt="Preview" className="mx-auto h-48 object-contain rounded" />
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setPhoto(null); }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentModule;
