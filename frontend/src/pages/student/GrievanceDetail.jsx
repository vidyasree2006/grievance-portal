import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
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

function GrievanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Fetch grievance
  const { data: grievance, isLoading } = useQuery({
    queryKey: ['grievance', id],
    queryFn: async () => {
      const res = await api.get(`/grievances/${id}`);
      return res.data.data;
    }
  });

  // Fetch comments
  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await api.get(`/comments/${id}`);
      return res.data.data;
    }
  });

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: async () => {
      await api.post(`/comments/${id}`, { text: comment });
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries(['comments', id]);
    }
  });

  // Update status mutation
  const updateStatus = useMutation({
    mutationFn: async () => {
      await api.put(`/grievances/${id}/status`, { status: newStatus, note: statusNote });
    },
    onSuccess: () => {
      setNewStatus('');
      setStatusNote('');
      queryClient.invalidateQueries(['grievance', id]);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #f0fdf4 100%)' }}>
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-800">GrievancePortal</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Grievance header */}
        <div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex gap-2 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusColors[grievance?.status]}`}>
                {statusIcons[grievance?.status]} {grievance?.status?.replace('_', ' ')}
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                {grievance?.category}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                grievance?.priority === 'high' ? 'bg-red-50 text-red-600' :
                grievance?.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                'bg-green-50 text-green-600'
              }`}>
                {grievance?.priority} priority
              </span>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {new Date(grievance?.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-3">{grievance?.title}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{grievance?.description}</p>

          {/* Student info */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">
                {grievance?.student?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">{grievance?.student?.name}</p>
              <p className="text-xs text-gray-400">{grievance?.student?.department} · {grievance?.student?.rollNumber}</p>
            </div>
          </div>
        </div>

        {/* Status timeline */}
        <div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.1s', opacity: 0 }}
        >
          <h2 className="text-sm font-bold text-gray-700 mb-4">Status Timeline</h2>
          <div className="space-y-4">
            {grievance?.statusHistory?.map((h, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-0.5 ${statusColors[h.status]?.includes('yellow') ? 'bg-yellow-400' : statusColors[h.status]?.includes('blue') ? 'bg-blue-400' : statusColors[h.status]?.includes('purple') ? 'bg-purple-400' : statusColors[h.status]?.includes('green') ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  {i < grievance.statusHistory.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-100 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 capitalize">
                      {h.status?.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(h.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })}
                    </span>
                  </div>
                  {h.note && <p className="text-xs text-gray-400 mt-0.5">{h.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update status — HOD and Admin only */}
        {(user?.role === 'hod' || user?.role === 'admin') && (
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.2s', opacity: 0 }}
          >
            <h2 className="text-sm font-bold text-gray-700 mb-4">Update Status</h2>
            <div className="space-y-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select new status</option>
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <input
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => updateStatus.mutate()}
                disabled={!newStatus || updateStatus.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
              >
                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {/* Comments */}
        <div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          style={{ animation: 'fadeSlideUp 0.4s ease forwards 0.3s', opacity: 0 }}
        >
          <h2 className="text-sm font-bold text-gray-700 mb-4">
            Comments ({comments?.length || 0})
          </h2>

          {/* Comment list */}
          <div className="space-y-4 mb-6">
            {comments?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No comments yet — start the conversation</p>
            ) : (
              comments?.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-xs">
                      {c.author?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-700">{c.author?.name}</span>
                      <span className="text-xs text-gray-400 capitalize">· {c.author?.role}</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add comment */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-xs">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && comment && addComment.mutate()}
              />
              <button
                onClick={() => addComment.mutate()}
                disabled={!comment || addComment.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GrievanceDetail;