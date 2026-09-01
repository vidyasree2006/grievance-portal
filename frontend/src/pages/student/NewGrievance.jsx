import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function NewGrievance() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const category = watch('category');
  const priority = watch('priority');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await api.post('/grievances', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'academics', label: '📚 Academics', desc: 'Curriculum, faculty, classes' },
    { value: 'hostel', label: '🏠 Hostel', desc: 'Accommodation, facilities' },
    { value: 'exam', label: '📝 Exam', desc: 'Results, malpractice, halls' },
    { value: 'facilities', label: '🏫 Facilities', desc: 'Labs, library, sports' },
    { value: 'other', label: '📌 Other', desc: 'Anything else' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'border-green-300 bg-green-50 text-green-700', dot: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'border-yellow-300 bg-yellow-50 text-yellow-700', dot: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'border-red-300 bg-red-50 text-red-700', dot: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #f0fdf4 100%)' }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navbar */}
      <nav className="border-b border-blue-100 px-6 py-4 sticky top-0 z-10"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-800">GrievancePortal</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-800 transition flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8" style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
          <h1 className="text-2xl font-bold text-gray-800">Raise a Grievance</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in the details below — we'll make sure it reaches the right person</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.1s', opacity: 0 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Grievance Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              placeholder="e.g. WiFi not working in Block B hostel"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.2s', opacity: 0 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    category === cat.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <input
                    {...register('category', { required: 'Category is required' })}
                    type="radio"
                    value={cat.value}
                    className="hidden"
                  />
                  <span className="text-lg mb-1">{cat.label.split(' ')[0]}</span>
                  <span className="text-xs font-semibold text-gray-700">{cat.label.split(' ')[1]}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{cat.desc}</span>
                </label>
              ))}
            </div>
            {errors.category && <p className="text-red-500 text-xs mt-2">{errors.category.message}</p>}
          </div>

          {/* Priority */}
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.3s', opacity: 0 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {priorities.map((p) => (
                <label
                  key={p.value}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    priority === p.value ? p.color : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    {...register('priority', { required: 'Priority is required' })}
                    type="radio"
                    value={p.value}
                    className="hidden"
                  />
                  <div className={`w-2.5 h-2.5 rounded-full ${p.dot}`}></div>
                  <span className="text-sm font-semibold text-gray-700">{p.label}</span>
                </label>
              ))}
            </div>
            {errors.priority && <p className="text-red-500 text-xs mt-2">{errors.priority.message}</p>}
          </div>

          {/* Description */}
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.4s', opacity: 0 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters' } })}
              rows={5}
              placeholder="Describe your grievance in detail. Include when it started, how it affects you, and any steps already taken..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>}
          </div>

          {/* Submit */}
          <div
            className="flex gap-3"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.5s', opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewGrievance;