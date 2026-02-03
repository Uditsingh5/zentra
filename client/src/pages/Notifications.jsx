import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Comment01Icon,
  UserAdd02Icon,
  BlushBrush02Icon,
  NotificationSquareIcon,
  Delete02Icon,
  Tick02Icon
} from "@hugeicons/core-free-icons";
import API from "../api/axios.js";
import { Link } from "react-router-dom";

const icons = {
  like: FavouriteIcon,
  comment: Comment01Icon,
  mention: BlushBrush02Icon,
  follow: UserAdd02Icon,
};

const formatTime = (t) => {
  const diff = (Date.now() - new Date(t).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = items.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read/all");
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error("Error marking read:", error);
    }
  }

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--bg-main)] p-8 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-black dark:text-[var(--text-main)]">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[#f5f5f5] dark:bg-[var(--bg-hover)] text-black dark:text-[var(--text-main)] text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-semibold text-black dark:text-[var(--text-main)] hover:opacity-70 transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[var(--bg-hover)] px-3 py-1.5 rounded-lg"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : items.length > 0 ? (
            items.map((n) => {
              const Icon = icons[n.type] || NotificationSquareIcon;
              return (
                <div
                  key={n._id}
                  className={`group flex items-start gap-4 p-5 rounded-xl transition-all border-b ${!n.read
                    ? "bg-white dark:bg-[var(--bg-card)] border-[#efefef] dark:border-[var(--border-color)]"
                    : "bg-white dark:bg-[var(--bg-card)] border-[#efefef] dark:border-[var(--border-color)] hover:bg-[#fafafa] dark:hover:bg-[var(--bg-hover)]"
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={n.senderId?.avatar || "https://i.pravatar.cc/150?img=12"}
                      alt={n.senderId?.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <HugeiconsIcon icon={Icon} size={14} className="text-purple-600" />
                    </div>
                    {!n.read && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-black dark:text-[var(--text-main)] text-[15px] leading-snug">
                      <span className="font-bold">{n.senderId?.name || "Unknown"}</span>{" "}
                      <span className="text-[#737373] dark:text-[var(--text-secondary)] font-medium">
                        {n.type === 'like' && 'liked your post'}
                        {n.type === 'comment' && 'commented on your post'}
                        {n.type === 'follow' && 'started following you'}
                      </span>
                    </p>
                    <p className="text-xs text-[#a8a8a8] dark:text-[var(--text-secondary)] mt-1 font-medium">{formatTime(n.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                    {!n.read && (
                      <button onClick={() => markRead(n._id)} title="Mark as read" className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-[var(--bg-hover)] rounded-xl text-[#737373] dark:text-[var(--text-secondary)] hover:text-black dark:hover:text-[var(--text-main)] transition-colors">
                        <HugeiconsIcon icon={Tick02Icon} size={18} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n._id)} title="Delete" className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-[var(--bg-hover)] rounded-xl text-[#737373] dark:text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                      <HugeiconsIcon icon={Delete02Icon} size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex justify-center items-center w-20 h-20 bg-white rounded-full shadow-sm mb-6 text-4xl border border-gray-100">
                🔔
              </div>
              <h3 className="text-xl font-bold text-black dark:text-[var(--text-main)] mb-2">No notifications</h3>
              <p className="text-[#737373] dark:text-[var(--text-secondary)]">
                You're all caught up! Check back later.
              </p>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
