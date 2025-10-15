import React from 'react';
import Postcard from "../components/PostCard.jsx";
import Suggestion from '../components/Suggestion.jsx';
import { HugeiconsIcon } from '@hugeicons/react';
import { AddSquareIcon } from '@hugeicons/core-free-icons';
import NewPost from '../components/NewPost.jsx';

import { useState } from 'react';

const PostBoxOpen = () => {
  setIsPostBox(!isPostBox);
}
const PostBoxClose = () => {
    setIsPostBox(!isPostBox);
  }
const Home = () => {
  const [isPostBox,setIsPostBox] = useState(false);

  return (
    <div className="w-full rounded-lg flex gap-1">
      {/* Main Feed */}
      <div className="h-auto basis-3/4 border-r border-gray-200">
        <Postcard />
        <Postcard />
        <Postcard />
        <Postcard />
        <Postcard />
        <Postcard />
        <Postcard />
      </div>

      {/* Sidebar */}
      <div className="w-1/4 p-2 flex flex-col">
        <Suggestion
          profiles={[
            { id: 1, username: "UditSingh_05", mutuals: "Followed by xyz", avatar: "https://i.pravatar.cc/100?img=12" },
            { id: 2, username: "Thakur._.", mutuals: "Followed by abc", avatar: "https://i.pravatar.cc/100?img=68" },
            { id: 3, username: "Thakur.Yuvi", mutuals: "Followed by def", avatar: "https://i.pravatar.cc/100?img=14" },
          ]}
        />
      </div>

      {/* Fixed Floating Button — moved outside the flex flow */}
      {
        isPostBox && <NewPost PostBoxClose={PostBoxClose}/>
      }
      <div
        className="fixed bottom-6 right-10 z-50 pointer-events-none overflow-visible"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      >
        
        <button
          id="postButton"
          aria-label="Create post"
          className="transform-gpu rounded-3xl p-4 px-6 font-semibold text-gray-600 border border-gray-300 shadow-lg bg-gray-50 flex gap-3 items-center pointer-events-auto cursor-pointer hover:shadow-xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          What's on your mind?
          <HugeiconsIcon icon={AddSquareIcon} size={28} />
        </button>
      </div>
    </div>
  );
};

export default Home;
