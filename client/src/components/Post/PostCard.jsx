import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    FavouriteIcon,
    SentIcon,
    Bookmark01Icon,
    Comment01Icon,
} from "@hugeicons/core-free-icons";

const PostHeader = () => (
    <div className="flex items-center gap-3 p-5">
        <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center text-white text-xl font-bold shadow-md cursor-pointer">
            U
        </div>
        <div className="flex-1">
            <p className="text-zinc-800 font-semibold text-[15px] cursor-pointer">
                Udit Narayan Singh
            </p>
            <p className="text-sm text-zinc-500">2 hours ago</p>
        </div>
        <button className="p-2 text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
        </button>
    </div>
);

const MainPost = ({ content, image }) => (
    <div className="px-8 pb-4">
        {content && (
            <p className="text-zinc-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
                {content}
            </p>
        )}
        {image && (
            <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                <img
                    src={image}
                    alt="Post visual"
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
            </div>
        )}
    </div>
);

const PostNav = ({ likes, onLike, onComment, onShare, onSave }) => (
    <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-200">
        <div className="flex items-center gap-4">
            <button
                onClick={onLike}
                className="flex items-center gap-2 text-zinc-600 transition-colors"
            >
                <HugeiconsIcon
                    icon={FavouriteIcon}
                    size={22}
                    className="hover:text-red-700 "
                />
                <span className="text-sm font-medium">{likes}</span>
            </button>

            <button
                onClick={onComment}
                className="flex items-center gap-2 text-zinc-600 hover:text-gray-800 transition-colors"
            >
                <HugeiconsIcon icon={Comment01Icon} size={22} />
            </button>

            <button
                onClick={onShare}
                className="flex items-center gap-2 text-zinc-600 hover:text-blue-600 transition-colors"
            >
                <HugeiconsIcon icon={SentIcon} size={22} />
            </button>
        </div>

        <button
            onClick={onSave}
            className="flex items-center gap-2 text-zinc-600 transition-colors"
        >
            <HugeiconsIcon
                icon={Bookmark01Icon}
                size={22}
                
            />
            <span className="text-sm font-medium ">Save</span>
        </button>
    </div>
);

const PostCard = () => {
    const handleLike = (e) => {
        console.log("Liked!");
        e.target.children[0].classList.toggle("fill-red-700");
    };
    const handleComment = () => console.log("Comment!");
    const handleShare = () => console.log("Shared!");
    const handleSave = (e) => {
        e.target.children[0].classList.toggle("fill-yellow-700");
        console.log("Saved!")
    };

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

    const imageUrl = "";

    return (
        <div className="w-full">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-md border border-zinc-200 overflow-hidden transition-shadow duration-300">
                    <PostHeader />
                    <MainPost content={msg} image={imageUrl} />
                    <PostNav
                        likes={245}
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

export default React.memo(PostCard);
