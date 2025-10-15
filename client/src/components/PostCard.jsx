import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon, Message01Icon, SentIcon, Bookmark01Icon, Comment01Icon } from '@hugeicons/core-free-icons';

const PostHeader = () => {
    return (
        <div className="flex items-center gap-3 p-5">
            <div className="w-14 h-14 rounded-full bg-gray-300"></div>
            <div className="flex-1">
                <div className="h-3 w-20 bg-gray-400 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="px-4 py-0 text-gray-600 ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </div>
        </div>
    );
};


const MainPost = ({ content }) => {
    return (
        <div className="px-8 py-1">
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                {content}
            </p>
        </div>
    );
};


const PostNav = ({ likes, onLike, onComment, onShare, onSave }) => {
    return (
        <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div
                    onClick={onLike}
                    className="flex items-center gap-1 p-1 px-2 text-gray-800  rounded-full transition-colors"
                >
                  
                    <HugeiconsIcon 
                        icon={FavouriteIcon} 
                        size={24} 
                    />
                    <span className="text-sm font-medium">{likes}</span>
                </div>

                <div
                    onClick={onComment}
                    className="p-2 rounded-full text-gray-800 transition-colors"
                >   
                    <HugeiconsIcon 
                        icon={Comment01Icon} 
                        size={24} 
                    />
                   
                </div>

                <div
                    onClick={onShare}
                    className="p-2 rounded-full text-gray-800 transition-colors"
                >
                    <HugeiconsIcon 
                        icon={SentIcon} 
                        size={24} 
                    />
                </div>
            </div>

            <div
                onClick={onSave}
                className="flex items-center gap-1 p-1 px-2 text-gray-800 rounded-full transition-colors"
            >
                <HugeiconsIcon 
                        icon={Bookmark01Icon} 
                        size={24} 
                    />
                <span className="text-sm font-medium">Save</span>
            </div>
        </div>
    );
};


const PostCard = () => {
    const handleLike = () => console.log('Liked!');
    const handleComment = () => console.log('Comment!');
    const handleShare = () => console.log('Shared!');
    const handleSave = () => console.log('Saved!');

    const msg = `💻 Dev Life Be Like...

Some days you write a single line of code and feel like a genius.
Other days you spend 4 hours fixing a bug caused by that same line. 😅

But that’s the beauty of being a developer —
Every error, every refactor, every “why isn’t this working” moment
is secretly sharpening your problem-solving instincts. ⚡

Keep building. Keep breaking. Keep learning.
Because somewhere between the commits and caffeine,
you’re turning logic into magic. ✨

#DevLife #CodingJourney #DeveloperDiaries #BuildInPublic`;

    return (
        <div className="bg-[#ffffff] p-2 w-auto flex items-center justify-center">
            <div className="max-w-3xl w-full">
                <div className="bg-[#efefef] rounded-3xl shadow-lg overflow-hidden">
                    <PostHeader />

                    <MainPost content={msg} />

                    <PostNav
                        likes={100}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                        onSave={handleSave}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostCard;


