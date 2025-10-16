import React from "react";
import FollowButton from "./FollowButton";

export default function Suggestion({ profiles = [] }) {
  return (
    <aside className="w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Suggested for you</h2>
        #<a>
          See All
        </a>
      </div>

      
      <div className="space-y-3">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50"
          >
         
            <div className="flex items-center gap-3">
              <img
                src={p.avatar}
                alt={`${p.username} avatar`}
                className="h-10 w-10 rounded-full object-cover bg-gray-100"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{p.username}</p>
                <p className="text-xs text-gray-500">{p.mutuals}</p>
              </div>
            </div>

       
            <FollowButton
              classes="text-xs font-semibold text-blue-600 hover:text-blue-500 focus:outline-none"
              action={() => alert(`Followed ${p.username}`)}
              name = 'Follow'
            />
            
          </div>
        ))}
      </div>
    </aside>
    
  );
}
