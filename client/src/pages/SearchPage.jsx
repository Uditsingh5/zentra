// SearchPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";


const usersMock = [
  {
    id: 1,
    name: "Aarav Sharma",
    username: "@aarav.codes",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
  {
    id: 2,
    name: "Jacob Smith",
    username: "@dev.jacob",
    avatar: "https://i.pravatar.cc/150?img=69",
  },
  {
    id: 3,
    name: "Rohan Verma",
    username: "@rohan.dev",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 4,
    name: "Neha Sharma",
    username: "@neha.codes",
    avatar: "https://i.pravatar.cc/150?img=42",
  },
];

const postsMock = [
  {
    id: 1,
    content: "💻 Building my first app! #CodingJourney #DevLife",
    likes: 120,
  },
  {
    id: 2,
    content: "🎬 Just watched a classic! #Bollywood #MovieNight",
    likes: 85,
  },
  {
    id: 3,
    content: "🏏 India vs Australia! What a match! #Cricket #Sports",
    likes: 60,
  },
];


const extractHashtags = (text) => text.match(/#\w+/g) ?? [];
const trendingTags = Array.from(
  new Set(postsMock.flatMap((p) => extractHashtags(p.content)))
).slice(0, 8);

function highlight(text, query) {
  if (!query) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(safe, "ig");
  return (
    <span>
      {text.split(regex).reduce((acc, part, i, arr) => {
        acc.push(<span key={`chunk-${i}`}>{part}</span>);
        if (i < arr.length - 1) {
          const match = text.match(regex)?.[i] ?? query;
          acc.push(
            <mark
              key={`hl-${i}`}
              className="bg-purple-100 text-purple-700 rounded px-0.5"
            >
              {match}
            </mark>
          );
        }
        return acc;
      }, [])}
    </span>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredUsers = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return usersMock.slice(0, 4); 
    return usersMock.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  const filteredPosts = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [];
    const qTag = (q.startsWith("#") ? q.slice(1) : q).trim();
    return postsMock.filter((post) => {
      const tags = extractHashtags(post.content)
        .map((t) => t.slice(1).toLowerCase());
      return tags.some((tag) => tag.includes(qTag));
    });
  }, [debouncedQuery]);

  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0;
  const applyChip = (tag) => setQuery(tag);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
    
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Explore & Connect
          </h1>
          <div className="hidden md:block text-sm text-gray-500">
            Press <kbd className="px-1 py-0.5 border border-gray-300 rounded">/</kbd> to search
          </div>
        </div>

      
        <div className="relative mb-4">
          <HugeiconsIcon
            icon={Search01Icon}
            size={24}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search friends or #topics… (e.g., #devop, #react)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />
        </div>

       
        <div className="mb-6 flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => applyChip(tag)}
              className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition text-sm"
            >
              {tag}
            </button>
          ))}
        </div>

    
        {filteredUsers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">People</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} query={debouncedQuery} />
              ))}
            </div>
          </section>
        )}

    
        {filteredPosts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  highlightQuery={debouncedQuery}
                />
              ))}
            </div>
          </section>
        )}

        
        {!hasResults && (
          <div className="text-center text-gray-600 mt-16">
            <div className="inline-flex flex-col items-center bg-white rounded-3xl px-6 py-10 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-2">🔍</div>
              <p className="font-semibold mb-1">
                No results for <span className="text-purple-600">“{debouncedQuery}”</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Try searching for a friend or a hashtag like <code>#Cricket</code>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function UserCard({ user, query }) {
  return (
    <div className="bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition border border-gray-200">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-14 h-14 rounded-full object-cover border-2 border-purple-200"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {highlight(user.name, query)}
        </p>
        <p className="text-gray-500 text-sm truncate">
          {highlight(user.username, query)}
        </p>
      </div>
      <button className="px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition">
        Follow
      </button>
    </div>
  );
}