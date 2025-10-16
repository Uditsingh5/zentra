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


const HomeTab = () => {
  return (
    <div className='max-w-3xl my-2 px-2 py-2 mx-auto text-gray-500 flex justify-between items-center select-none'>
      <div className='flex items-center justify-center gap-3 cursor-text'>
        <div className="w-14 h-14 rounded-full bg-gray-300 cursor-pointer"></div>
        <h4>What's new with you?</h4>
      </div>
      <button className = {`bg-[#CE97FF] cursor-pointer text-gray-700 hover:text-gray-600 px-6 py-2 rounded-2xl`}>
      Post
    </button>
    </div>
  )
}


const Home = () => {
  const [isPostBox,setIsPostBox] = useState(false);

  return (
    <div className="w-full rounded-lg flex gap-1">
      {/* Main Feed */}

      <div className="h-auto basis-3/4 border-r border-gray-200">
        <HomeTab/>
        <div className='flex flex-col justify-center items-center gap-5 mt-4'>
        <Postcard />
        <Postcard />
        
        <Postcard />
        <Postcard />
        <Postcard />
        </div>
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
