import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { logout } from '../../store/authSlice';
import api from '../../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#6b7280'];

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    }
  });

  const { data: grievances } = useQuery({
    queryKey: ['admin-grievances'],
    queryFn: async () => {
      const res = await api.get('/grievances');
      return res.data.data;
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const categoryData = stats?.byCategory?.map(c => ({
    name: c._id,
    count: c.count
  })) || [];

  const statusData = [
    { name: 'Pending', value: stats?.pending || 0 },
    { name: 'In Progress', value: stats?.inProgress || 0 },
    { name: 'Resolved', value: stats?.resolved || 0 },
  ];

  const statCards = [
    { label: 'Total Grievances', value: stats?.totalGrievances || 0, icon: '📋', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: stats?.pending || 0, icon: '🕐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: '⚙️', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Resolved', value: stats?.resolved || 0, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Students', value: stats?.totalUsers || 0, icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-800">GrievancePortal</span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition"
            >
              👥 Manage Users
            </button>
            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8" style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard 🛡️</h1>
          <p className="text-gray-400 text-sm mt-1">Complete overview of all grievances across the institution</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animation: `fadeSlideUp 0.4s ease forwards ${i * 0.1}s`, opacity: 0 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar chart — by category */}
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.3s', opacity: 0 }}
          >
            <h2 className="text-sm font-bold text-gray-700 mb-4">Grievances by Category</h2>
            {categoryData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-300 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie chart — by status */}
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.4s', opacity: 0 }}
          >
            <h2 className="text-sm font-bold text-gray-700 mb-4">Grievances by Status</h2>
            {statusData.every(d => d.value === 0) ? (
              <div className="h-48 flex items-center justify-center text-gray-300 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent grievances */}
        <div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.5s', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-700">Recent Grievances</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3">Title</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3">Student</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3">Priority</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {grievances?.slice(0, 10).map((g) => (
                  <tr
                    key={g._id}
                    onClick={() => navigate(`/grievance/${g._id}`)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-medium text-gray-800 max-w-xs truncate">{g.title}</td>
                    <td className="py-3 text-gray-500 text-xs">{g.student?.name}</td>
                    <td className="py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{g.category}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        g.priority === 'high' ? 'bg-red-50 text-red-600' :
                        g.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>{g.priority}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        g.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        g.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        g.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{g.status.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(g.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;