import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from 'react-hot-toast';

export default function Suggestion({ profiles = [] }) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState({});

  console.log('Suggestion component received profiles:', profiles);

  const handleFollow = async (userId, username) => {
    console.log('Attempting to follow user:', { userId, username });

    // Check if user is logged in
    const token = localStorage.getItem('token');
    console.log('Auth token present:', !!token);

    if (!token) {
      toast.error('Please log in to follow users');
      return;
    }

    try {
      const response = await API.post(`/user/follow/${userId}`);
      console.log('Follow API response:', response.data);

      setFollowing(prev => {
        const newState = { ...prev, [userId]: true };
        console.log('Updated following state:', newState);
        return newState;
      });

      toast.success(`Now following ${username}`);
    } catch (error) {
      console.error("Follow error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // More specific error messages
      if (error.response?.status === 401) {
        toast.error('Please log in to follow users');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Cannot follow this user');
      } else {
        toast.error('Failed to follow user. Please try again.');
      }
    }
  };

  if (profiles.length === 0) return null;

  return (
    <aside className="w-full max-w-xs rounded-xl border border-[#efefef] dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-card)] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-black dark:text-[var(--text-main)]">Suggested for you</h2>
      </div>

      <div className="space-y-3">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg p-2 hover:bg-[#f5f5f5] dark:hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => navigate(`/profile/${p.id}`)}
            >
              <img
                src={p.avatar || "https://i.pravatar.cc/100?img=12"}
                alt={`${p.username} avatar`}
                className="h-10 w-10 rounded-full object-cover bg-gray-100"
              />
              <div>
                <p className="text-sm font-semibold text-black dark:text-[var(--text-main)]">{p.username}</p>
                <p className="text-xs text-[#737373] dark:text-[var(--text-secondary)]">{p.mutuals}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(p.id, p.username);
              }}
              disabled={following[p.id]}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                following[p.id]
                  ? 'bg-[#f5f5f5] dark:bg-[var(--bg-hover)] text-[#737373] dark:text-[var(--text-secondary)] cursor-not-allowed'
                  : 'bg-black dark:bg-[var(--text-main)] text-white dark:text-[var(--bg-main)] hover:bg-[#272727] dark:hover:bg-[var(--bg-hover)]'
              }`}
            >
              {following[p.id] ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
