// // NotificationsPage.jsx
// import React, { useMemo, useState } from "react";

// // --- Mock users (Indian-friendly) ---
// const users = [
//   {
//     id: 1,
//     name: "Aarav Sharma",
//     username: "@aarav.codes",
//     avatar: "https://source.unsplash.com/featured/256x256/?indian,man,portrait",
//   },
//   {
//     id: 2,
//     name: "Priya Mehta",
//     username: "@priya.designs",
//     avatar: "https://source.unsplash.com/featured/256x256/?indian,woman,portrait",
//   },
//   {
//     id: 3,
//     name: "Rohan Verma",
//     username: "@rohan.dev",
//     avatar: "https://source.unsplash.com/featured/256x256/?indian,man,software,engineer",
//   },
//   {
//     id: 4,
//     name: "Neha Kapoor",
//     username: "@neha.codes",
//     avatar: "https://source.unsplash.com/featured/256x256/?indian,woman,developer",
//   },
// ];

// // --- Mock notifications ---
// const now = Date.now();
// const notificationsMock = [
//   {
//     id: "n1",
//     type: "like",
//     actor: users[1], // Priya
//     content: "liked your post “Landing page v2”",
//     postId: "p1",
//     createdAt: now - 5 * 60 * 1000, // 5m
//     unread: true,
//   },
//   {
//     id: "n2",
//     type: "comment",
//     actor: users[0], // Aarav
//     content: 'commented: "Clean UI, love the spacing!"',
//     postId: "p2",
//     createdAt: now - 35 * 60 * 1000, // 35m
//     unread: true,
//   },
//   {
//     id: "n3",
//     type: "mention",
//     actor: users[2], // Rohan
//     content: "mentioned you in a comment",
//     postId: "p3",
//     createdAt: now - 3 * 60 * 60 * 1000, // 3h
//     unread: true,
//   },
//   {
//     id: "n4",
//     type: "follow",
//     actor: users[3], // Neha
//     content: "started following you",
//     postId: null,
//     createdAt: now - 20 * 60 * 60 * 1000, // 20h
//     unread: false,
//   },
//   {
//     id: "n5",
//     type: "system",
//     actor: null,
//     content: "Your weekly summary is ready",
//     postId: null,
//     createdAt: now - 2 * 24 * 60 * 60 * 1000, // 2d
//     unread: false,
//   },
//   {
//     id: "n6",
//     type: "like",
//     actor: users[0],
//     content: "liked your post “Design tokens guide”",
//     postId: "p4",
//     createdAt: now - 7 * 24 * 60 * 60 * 1000, // 7d
//     unread: false,
//   },
// ];

// // --- Utils ---
// const formatRelativeTime = (timestamp) => {
//   const diffMs = Date.now() - timestamp;
//   const diffMin = Math.floor(diffMs / (60 * 1000));
//   if (diffMin < 1) return "just now";
//   if (diffMin < 60) return `${diffMin}m`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr}h`;
//   const diffDay = Math.floor(diffHr / 24);
//   if (diffDay === 1) return "Yesterday";
//   return `${diffDay}d`;
// };

// const bucketLabel = (timestamp) => {
//   const d = new Date(timestamp);
//   const today = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(today.getDate() - 1);

//   const isSameDay = (a, b) =>
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate();

//   if (isSameDay(d, today)) return "Today";
//   if (isSameDay(d, yesterday)) return "Yesterday";

//   const diffDays = Math.floor((today - d) / (24 * 60 * 60 * 1000));
//   if (diffDays < 7) return "This week";
//   return "Earlier";
// };

// const emojiByType = (type) =>
//   type === "like"
//     ? "❤️"
//     : type === "comment"
//     ? "💬"
//     : type === "mention"
//     ? "📣"
//     : type === "follow"
//     ? "👤"
//     : "🔧"; // system

// // --- Page Component ---
// export default function Notifications() {
//   const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'mentions' | 'follows'
//   const [items, setItems] = useState(notificationsMock);

//   const unreadCount = useMemo(() => items.filter((n) => n.unread).length, [items]);

//   const filtered = useMemo(() => {
//     let list = items.slice().sort((a, b) => b.createdAt - a.createdAt);
//     if (filter === "unread") list = list.filter((n) => n.unread);
//     if (filter === "mentions") list = list.filter((n) => n.type === "mention");
//     if (filter === "follows") list = list.filter((n) => n.type === "follow");
//     return list;
//   }, [items, filter]);

//   const grouped = useMemo(() => {
//     const buckets = new Map();
//     filtered.forEach((n) => {
//       const label = bucketLabel(n.createdAt);
//       if (!buckets.has(label)) buckets.set(label, []);
//       buckets.get(label).push(n);
//     });
//     // enforce display order
//     const order = ["Today", "Yesterday", "This week", "Earlier"];
//     const ordered = new Map();
//     order.forEach((label) => {
//       if (buckets.has(label)) ordered.set(label, buckets.get(label));
//     });
//     return ordered;
//   }, [filtered]);

//   const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
//   const clearRead = () => setItems((prev) => prev.filter((n) => n.unread));
//   const clearAll = () => setItems([]);

//   const toggleRead = (id) =>
//     setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)));

//   const removeItem = (id) => setItems((prev) => prev.filter((n) => n.id !== id));

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 md:mb-8 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">🔔</span>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
//             {unreadCount > 0 && (
//               <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
//                 {unreadCount} new
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={markAllRead}
//               className="px-3 py-2 rounded-xl bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition"
//             >
//               Mark all as read
//             </button>
//             <button
//               onClick={clearRead}
//               className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition"
//             >
//               Clear read
//             </button>
//             <button
//               onClick={clearAll}
//               className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition"
//             >
//               Clear all
//             </button>
//           </div>
//         </div>

//         {/* Filters (chips) */}
//         <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter notifications">
//           {[
//             { key: "all", label: "All" },
//             { key: "unread", label: "Unread" },
//             { key: "mentions", label: "@ Mentions" },
//             { key: "follows", label: "Follows" },
//           ].map((f) => {
//             const active = filter === f.key;
//             return (
//               <button
//                 key={f.key}
//                 role="tab"
//                 aria-selected={active}
//                 onClick={() => setFilter(f.key)}
//                 className={
//                   "px-3 py-1.5 rounded-full text-sm transition border " +
//                   (active
//                     ? "bg-purple-500 text-white border-purple-500 shadow-sm"
//                     : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700")
//                 }
//               >
//                 {f.label}
//               </button>
//             );
//           })}
//         </div>

//         {/* Groups */}
//         {grouped.size > 0 ? (
//           <div className="space-y-8">
//             {[...grouped.entries()].map(([label, group]) => (
//               <section key={label} aria-label={label}>
//                 <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
//                   {label}
//                 </h2>
//                 <ul role="list" className="space-y-3">
//                   {group.map((n) => (
//                     <li key={n.id} role="listitem">
//                       <NotificationItem
//                         data={n}
//                         onToggleRead={() => toggleRead(n.id)}
//                         onRemove={() => removeItem(n.id)}
//                       />
//                     </li>
//                   ))}
//                 </ul>
//               </section>
//             ))}
//           </div>
//         ) : (
//           // Empty State
//           <div className="text-center text-gray-600 mt-24">
//             <div className="inline-flex flex-col items-center bg-white rounded-3xl px-6 py-10 border border-gray-200 shadow-sm">
//               <div className="text-3xl mb-2">🫖</div>
//               <p className="font-semibold mb-1">All caught up</p>
//               <p className="text-sm text-gray-500">
//                 No notifications right now. Perfect time for a chai ☕️
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // --- Notification Item ---
// function NotificationItem({ data, onToggleRead, onRemove }) {
//   const { type, actor, content, createdAt, unread } = data;

//   const iconEmoji = emojiByType(type);

//   const textPrimary = actor ? (
//     <>
//       <strong className="text-gray-900">{actor.name}</strong>{" "}
//       <span className="text-gray-500">{actor.username}</span>{" "}
//     </>
//   ) : (
//     <strong className="text-gray-900">Update</strong>
//   );

//   const fallback = actor
//     ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
//         actor.name
//       )}&backgroundColor=f3f4f6&radius=50`
//     : `https://api.dicebear.com/7.x/icons/svg?seed=system&backgroundColor=f3f4f6&radius=50`;

//   const handleImgError = (e) => {
//     if (e.currentTarget.dataset.fallbackApplied === "true") return;
//     e.currentTarget.src = fallback;
//     e.currentTarget.dataset.fallbackApplied = "true";
//   };

//   return (
//     <div
//       className={
//         "flex items-center gap-4 rounded-2xl border px-4 py-3 transition " +
//         (unread ? "bg-purple-50 border-purple-200" : "bg-white border-gray-200 hover:bg-gray-50")
//       }
//     >
//       {/* Avatar */}
//       <div className="relative">
//         {actor ? (
//           <img
//             src={actor.avatar}
//             alt={actor.name}
//             loading="lazy"
//             decoding="async"
//             onError={handleImgError}
//             className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-purple-200 flex items-center justify-center text-xl">
//             🔧
//           </div>
//         )}
//         {unread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full ring-2 ring-white" />}
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <p className="text-gray-800">
//           <span className="mr-2">{iconEmoji}</span>
//           {textPrimary}
//           <span className="text-gray-700">{content}</span>
//         </p>
//         <p className="text-xs text-gray-500 mt-0.5">{formatRelativeTime(createdAt)}</p>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={onToggleRead}
//           className={
//             "px-3 py-1.5 rounded-xl text-sm transition " +
//             (unread
//               ? "bg-purple-500 text-white hover:bg-purple-600"
//               : "border border-gray-200 bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700")
//           }
//         >
//           {unread ? "Mark read" : "Mark unread"}
//         </button>
//         {data.type === "follow" && (
//           <button className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition">
//             Follow back
//           </button>
//         )}
//         <button
//           onClick={onRemove}
//           aria-label="Dismiss notification"
//           className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition"
//         >
//           Dismiss
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Comment01Icon,
  UserAdd02Icon,
  BlushBrush02Icon,
  NotificationSquareIcon,
} from "@hugeicons/core-free-icons";

const mockUsers = [
  { id: 1, name: "Aarav Sharma", username: "@aarav.codes", avatar: "https://source.unsplash.com/256x256/?portrait,man" },
  { id: 2, name: "Priya Mehta", username: "@priya.designs", avatar: "https://source.unsplash.com/256x256/?portrait,woman" },
  { id: 3, name: "Rohan Verma", username: "@rohan.dev", avatar: "https://source.unsplash.com/256x256/?developer,india" },
];

const now = Date.now();
const notificationsMock = [
  { id: 1, type: "like", user: mockUsers[0], text: "liked your post “Zentra UI Concepts”", time: now - 4 * 60 * 1000, unread: true },
  { id: 2, type: "comment", user: mockUsers[1], text: 'commented: "Absolutely stunning design!"', time: now - 42 * 60 * 1000, unread: true },
  { id: 3, type: "mention", user: mockUsers[2], text: "mentioned you in a post", time: now - 3 * 60 * 60 * 1000, unread: false },
  { id: 4, type: "follow", user: mockUsers[1], text: "started following you", time: now - 8 * 60 * 60 * 1000, unread: false },
];

const icons = {
  like: FavouriteIcon,
  comment: Comment01Icon,
  mention: BlushBrush02Icon,
  follow: UserAdd02Icon,
};

const formatTime = (t) => {
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

export default function NotificationsPage() {
  const [items, setItems] = useState(notificationsMock);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white text-gray-900 px-6 py-10 overflow-hidden">
      {/* Decorative background Hugeicons */}
      <HugeiconsIcon
        icon={NotificationSquareIcon}
        size={300}
        className="absolute -top-20 -right-20 text-purple-200 opacity-10 rotate-12 pointer-events-none"
      />
      <HugeiconsIcon
        icon={FavouriteIcon}
        size={180}
        className="absolute bottom-10 left-10 text-pink-200 opacity-10 pointer-events-none"
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((n) => {
              const Icon = icons[n.type];
              return (
                <div
                  key={n.id}
                  className={`group flex items-start gap-4 p-4 rounded-2xl transition-all backdrop-blur-sm border ${
                    n.unread
                      ? "bg-gradient-to-r from-purple-50 to-white border-purple-100"
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  } shadow-sm hover:shadow-md`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={n.user.avatar}
                      alt={n.user.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200"
                    />
                    {n.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm leading-snug">
                      <HugeiconsIcon
                        icon={Icon}
                        size={16}
                        className="inline text-purple-500 mr-1 mb-0.5"
                      />
                      <span className="font-semibold">{n.user.name}</span>{" "}
                      <span className="text-gray-500">{n.user.username}</span>{" "}
                      {n.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(n.time)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-3">🫖</div>
              <p className="font-semibold text-gray-700 mb-1">All caught up!</p>
              <p className="text-sm text-gray-500">
                You’re all clear — no new notifications right now ☕
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
