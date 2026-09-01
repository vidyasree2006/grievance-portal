import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

function UserManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data;
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }) => {
      await api.put(`/admin/users/${id}`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries(['admin-users'])
  });

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      setDeleteConfirm(null);
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  const filtered = users?.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors = {
    student: 'bg-blue-100 text-blue-700',
    hod: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
  };

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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-800">GrievancePortal</span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-8"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management 👥</h1>
            <p className="text-gray-400 text-sm mt-1">
              {users?.length || 0} total users registered
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 gap-4 mb-6"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.1s', opacity: 0 }}
        >
          {[
            { label: 'Students', value: users?.filter(u => u.role === 'student').length || 0, icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'HODs', value: users?.filter(u => u.role === 'hod').length || 0, icon: '👨‍🏫', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Admins', value: users?.filter(u => u.role === 'admin').length || 0, icon: '🛡️', color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div
          className="mb-4"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.2s', opacity: 0 }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by name, email or department..."
            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.3s', opacity: 0 }}
        >
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">User</th>
                    <th className="text-left text-xs font-semibold text-gray-400 px-4 py-4">Department</th>
                    <th className="text-left text-xs font-semibold text-gray-400 px-4 py-4">Role</th>
                    <th className="text-left text-xs font-semibold text-gray-400 px-4 py-4">Joined</th>
                    <th className="text-left text-xs font-semibold text-gray-400 px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered?.map((u, i) => (
                    <tr
                      key={u._id}
                      className="hover:bg-blue-50 transition-colors"
                      style={{ animation: `fadeSlideUp 0.3s ease forwards ${i * 0.05}s`, opacity: 0 }}
                    >
                      {/* User info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">
                              {u.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">
                          {u.department}
                        </span>
                      </td>

                      {/* Role dropdown */}
                      <td className="px-4 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole.mutate({ id: u._id, role: e.target.value })}
                          className={`text-xs px-2 py-1 rounded-lg font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${roleColors[u.role]}`}
                        >
                          <option value="student">🎓 Student</option>
                          <option value="hod">👨‍🏫 HOD</option>
                          <option value="admin">🛡️ Admin</option>
                        </select>
                      </td>

                      {/* Joined date */}
                      <td className="px-4 py-4 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-4">
                        {deleteConfirm === u._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => deleteUser.mutate(u._id)}
                              className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(u._id)}
                            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500 font-medium">No users found</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4"
            style={{ animation: 'fadeSlideUp 0.2s ease forwards' }}>
            <div className="text-3xl mb-3">⚠️</div>
            <h3 className="font-bold text-gray-800 mb-2">Delete this user?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. All their data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser.mutate(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;