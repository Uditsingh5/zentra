// SearchPage.jsx
import React, { useEffect, useRef, useState } from "react";
import PostCard from "../components/Post/PostCard.jsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import API from "../api/axios.js";
import { Link } from "react-router-dom";

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
              className="bg-purple-100 text-purple-700 rounded px-0.5 font-medium"
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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/user/search?q=${debouncedQuery}`);
        setResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [debouncedQuery]);

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

  return (
    <div className="min-h-screen bg-main p-8 pb-20">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-main mb-1">
              Explore
            </h1>
            <p className="text-secondary">Find friends and connect with people.</p>
          </div>
        </div>


        <div className="relative mb-8 group">
          <div className="relative bg-card rounded-xl border border-main flex items-center p-2">
            <div className="pl-4 pr-3 text-secondary">
              <HugeiconsIcon icon={Search01Icon} size={24} />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name or username..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-main bg-transparent outline-none text-lg font-sans px-2"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="px-2 py-1 rounded-full hover:bg-hover transition-all"
                title="Clear"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="rotate-180 text-secondary" />
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#737373] dark:border-[var(--text-secondary)]"></div>
          </div>
        )}

        {results.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-bold text-black dark:text-[var(--text-main)] mb-4 px-1">People</h2>
            <div className="grid grid-cols-1 gap-3">
              {results.map((user) => (
                <UserCard key={user._id} user={user} query={debouncedQuery} />
              ))}
            </div>
          </section>
        )}

        {!loading && debouncedQuery && results.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-white rounded-full shadow-sm mb-6 text-4xl border border-gray-100">
              🔍
            </div>
            <h3 className="text-xl font-bold text-black dark:text-[var(--text-main)] mb-2">No results found</h3>
            <p className="text-[#737373] dark:text-[var(--text-secondary)]">
              We couldn't find anyone matching <span className="text-black dark:text-[var(--text-main)] font-semibold">"{debouncedQuery}"</span>
            </p>
          </div>
        )}

        {!debouncedQuery && (
          <div className="text-center py-20 opacity-50">
            <HugeiconsIcon icon={Search01Icon} size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-[#737373] dark:text-[var(--text-secondary)]">Start typing to search...</p>
          </div>
        )}
      </div>
    </div>
  );
}


function UserCard({ user, query }) {
  const username = user.username || `@${user.name?.toLowerCase().split(' ')[0] || 'user'}`;
  return (
    <Link to={`/profile/${user._id}`} className="group bg-[var(--bg-card)] rounded-xl p-4 flex items-center gap-4 border border-[var(--border-color)]">
      <img
        src={user.avatar || 'https://i.pravatar.cc/150?img=12'}
        alt={user.name}
        className="w-14 h-14 rounded-full object-cover shadow"
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[var(--text-main)] truncate text-[15px] group-hover:opacity-70 transition-opacity">
          {highlight(user.name, query)}
        </p>
        <p className="text-[var(--text-secondary)] text-sm truncate">
          {highlight(username, query)}
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-tertiary)]">
        <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
      </div>
    </Link>
  );
}