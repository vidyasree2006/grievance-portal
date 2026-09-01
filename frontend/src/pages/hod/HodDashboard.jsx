import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { logout } from '../../store/authSlice';
import api from '../../api/axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  under_review: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusIcons = {
  pending: '🕐',
  under_review: '🔍',
  in_progress: '⚙️',
  resolved: '✅',
  closed: '🔒',
};

const priorityColors = {
  low: 'bg-green-50 text-green-600',
  medium: 'bg-yellow-50 text-yellow-600',
  high: 'bg-red-50 text-red-600',
};

function HodDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['hod-grievances'],
    queryFn: async () => {
      const res = await api.get('/grievances');
      return res.data.data;
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filtered = data?.filter(g => {
    const matchStatus = filter === 'all' || g.status === filter;
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.student?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: 'Total', value: data?.length || 0, icon: '📋', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: data?.filter(g => g.status === 'pending').length || 0, icon: '🕐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'In Progress', value: data?.filter(g => g.status === 'in_progress').length || 0, icon: '⚙️', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Resolved', value: data?.filter(g => g.status === 'resolved').length || 0, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #f0fdf4 100%)' }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Navbar */}
      <nav className="border-b border-blue-100 px-6 py-4 sticky top-0 z-10"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-800">GrievancePortal</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">HOD</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.department} · HOD</p>
            </div>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8" style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
          <h1 className="text-2xl font-bold text-gray-800">
            Department Grievances 👨‍🏫
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {user?.department} Department · Manage and resolve student grievances
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animation: `fadeSlideUp 0.4s ease forwards ${i * 0.1}s`, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`${stat.bg} rounded-lg px-2 py-0.5`}>
                  <span className={`text-xs font-semibold ${stat.color}`}>{stat.label}</span>
                </div>
              </div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-6"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.3s', opacity: 0 }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by title or student name..."
            className="flex-1 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'under_review', 'in_progress', 'resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {f.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Grievance list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                </div>
                <div className="h-4 w-3/4 bg-gray-100 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : filtered?.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 font-semibold text-lg">No grievances found</p>
            <p className="text-gray-400 text-sm mt-1">Try changing the filter or search term</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered?.map((g, i) => (
              <div
                key={g._id}
                onClick={() => navigate(`/grievance/${g._id}`)}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-200 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 group"
                style={{ animation: `fadeSlideUp 0.4s ease forwards ${i * 0.05}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusColors[g.status]}`}>
                        {statusIcons[g.status]} {g.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityColors[g.priority]}`}>
                        {g.priority === 'high' ? '🔴' : g.priority === 'medium' ? '🟡' : '🟢'} {g.priority}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {g.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {g.title}
                    </h3>
                    {/* Student info */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">
                          {g.student?.name?.charAt(0)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {g.student?.name} · {g.student?.rollNumber} · {g.student?.department}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">
                      {new Date(g.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })}
                    </p>
                    <div className="mt-3 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center ml-auto group-hover:bg-blue-600 transition-colors">
                      <span className="text-blue-500 group-hover:text-white text-sm transition-colors">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HodDashboard;