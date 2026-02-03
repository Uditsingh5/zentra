


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    FavouriteIcon,
    Comment01Icon,
    Share08Icon,
    Bookmark01Icon,
    MoreVerticalIcon,
    SentIcon,
    Delete02Icon,
    Flag01Icon
} from "@hugeicons/core-free-icons";
import toast from 'react-hot-toast';
import CommentSection from "./CommentSection";
import API from "../../api/axios";

const PostHeader = ({ user, createdAt, feeling, postId, onDelete }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { userInfo } = useSelector((state) => state.user);
    const isOwnPost = userInfo?.userId === user?._id;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await API.delete(`/post/delete/${postId}`);
            toast.success('Post deleted successfully');
            onDelete?.(postId);
            setShowDropdown(false);
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete post');
        }
    };

    const handleReport = async () => {
        if (!window.confirm('Are you sure you want to report this post?')) return;

        try {
            await API.post(`/post/report/${postId}`, {
                reason: 'inappropriate', // Default reason, could be expanded to show options
                description: ''
            });
            toast.success('Post reported successfully. We will review it shortly.');
            setShowDropdown(false);
        } catch (error) {
            console.error('Report error:', error);
            if (error.response?.status === 400 && error.response?.data?.message?.includes('already reported')) {
                toast.error('You have already reported this post');
            } else {
                toast.error('Failed to report post');
            }
        }
    };

    return (
        <div className="flex items-center gap-4 p-4 relative">
            {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-secondary)] text-sm font-semibold cursor-pointer">
                    {user?.name?.[0] || "U"}
                </div>
            )}
            <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[var(--text-main)] font-semibold text-[15px] cursor-pointer hover:opacity-70 transition-opacity">
                        {user?.name || "Unknown User"}
                    </p>
                    {feeling && (feeling.emoji || feeling.label) && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-hover)] rounded-full border border-[var(--border-color)] ">
                            {feeling.emoji && (
                                <span className="text-lg leading-none">{feeling.emoji}</span>
                            )}
                            {feeling.label && (
                                <span className="text-xs text-[var(--text-secondary)] font-medium">
                                    {feeling.label}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <p className="text-xs font-normal text-[var(--text-secondary)] mt-0.5">{new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
            </div>

            {/* Three dots menu */}
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-full transition-all cursor-pointer"
                >
                    <HugeiconsIcon icon={MoreVerticalIcon} className="w-5 h-5" />
                </button>

                {/* Dropdown menu */}
                {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg z-50">
                        {isOwnPost ? (
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg mx-1 my-1"
                            >
                                <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                                Delete Post
                            </button>
                        ) : (
                            <button
                                onClick={handleReport}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors rounded-lg mx-1 my-1"
                            >
                                <HugeiconsIcon icon={Flag01Icon} className="w-4 h-4" />
                                Report Post
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
};

const MainPost = ({ content, image, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageArray = images && images.length > 0 ? images : (image ? [image] : []);
    const hasMultipleImages = imageArray.length > 1;

    // Debug: Log image URLs
    console.log('MainPost - image:', image);
    console.log('MainPost - images:', images);
    console.log('MainPost - imageArray:', imageArray);

    return (
        <div className="px-4 pb-4">
            {content && (
                <p className="text-black dark:text-[var(--text-main)] text-[15px] leading-relaxed whitespace-pre-wrap mb-4 font-normal">
                    {content}
                </p>
            )}
            {imageArray.length > 0 && (
                <div className="rounded-xl overflow-hidden bg-[#f5f5f5] dark:bg-[var(--bg-hover)] relative">
                    {/* Image Carousel */}
                    <div className="relative">
                        <img
                            src={imageArray[currentImageIndex]}
                            alt="Post visual"
                            className="w-full h-auto object-cover max-h-[500px]"
                            loading="lazy"
                            onError={(e) => {
                                console.error('Image failed to load:', imageArray[currentImageIndex]);
                                e.target.style.display = 'none';
                            }}
                            onLoad={() => console.log('Image loaded successfully:', imageArray[currentImageIndex])}
                        />
                        
                        {/* Navigation Arrows */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => 
                                        prev === 0 ? imageArray.length - 1 : prev - 1
                                    )}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 dark:bg-white/20 hover:bg-black/80 dark:hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => 
                                        prev === imageArray.length - 1 ? 0 : prev + 1
                                    )}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 dark:bg-white/20 hover:bg-black/80 dark:hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all"
                                    aria-label="Next image"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Image Indicators */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {imageArray.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`h-2 rounded-full transition-all ${
                                        index === currentImageIndex
                                            ? 'w-8 bg-white'
                                            : 'w-2 bg-white/50 hover:bg-white/75'
                                    }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Image Counter */}
                    {hasMultipleImages && (
                        <div className="absolute top-4 right-4 bg-black/60 dark:bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                            {currentImageIndex + 1} / {imageArray.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const PostNav = ({ likes, isLiked, onLike, onComment, onShare, onSave }) => (
    <div className="post-nav px-4 py-3 flex items-center justify-between border-t border-[#efefef] dark:border-[var(--border-color)]">
        <div className="flex items-center gap-6">
            <button
                onClick={onLike}
                className={`flex items-center gap-2 transition-all duration-200 group ${isLiked ? "text-red-500" : "text-[#737373] dark:text-[var(--text-secondary)]"}`}
            >
                <div className={`p-2 rounded-full transition-colors`}>
                    <HugeiconsIcon
                        icon={FavouriteIcon}
                        size={22}
                        className={`transition-transform duration-200 ${isLiked ? "fill-current animate-heart-beat" : "group-hover:scale-110"}`}
                        variant={isLiked ? "solid" : "stroke"}
                    />
                </div>
                <span className={`text-sm font-medium ${isLiked ? "text-red-500" : "text-[#737373] dark:text-[var(--text-secondary)]"}`}>{likes}</span>
            </button>

            <button
                onClick={onComment}
                className="flex items-center gap-2 text-[#737373] dark:text-[var(--text-secondary)] transition-colors group"
            >
                <div className="p-2 rounded-full transition-colors">
                    <HugeiconsIcon icon={Comment01Icon} size={22} className="group-hover:scale-110 transition-transform" />
                </div>
            </button>

            <button
                onClick={onShare}
                className="flex items-center gap-2 text-[#737373] dark:text-[var(--text-secondary)] transition-colors group"
            >
                <div className="p-2 rounded-full transition-colors">
                    <HugeiconsIcon icon={SentIcon} size={22} className="group-hover:scale-110 transition-transform" />
                </div>
            </button>
        </div>

        <button
            onClick={onSave}
            className="flex items-center gap-2 text-[#737373] dark:text-[var(--text-secondary)] transition-colors group"
        >
            <div className="p-2 rounded-full transition-colors">
                <HugeiconsIcon icon={Bookmark01Icon} size={22} className="group-hover:scale-110 transition-transform" />
            </div>
        </button>
    </div>
);

const PostCard = ({ post, onDelete }) => {
    const [showComments, setShowComments] = useState(false);
    const { userInfo } = useSelector((state) => state.user);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (post) {
            const likesArray = Array.isArray(post.likes) ? post.likes : [];
            setLiked(likesArray.includes(userInfo?.userId) || false);
            setLikeCount(likesArray.length || 0);
        }
    }, [post, userInfo?.userId]);

    if (!post) return null;

    const handleLike = async () => {
        // Save previous state for rollback
        const prevLiked = liked;
        const prevCount = likeCount;

        // Optimistic update
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);

        try {
            if (prevLiked) {
                await API.post(`/post/unlike/${post._id}`);
            } else {
                await API.post(`/post/like/${post._id}`);
            }
        } catch (error) {
            // Rollback on error
            setLiked(prevLiked);
            setLikeCount(prevCount);
            console.error("Like error:", error);
            // Toast already shown by interceptor
        }
    };

    const handleComment = () => setShowComments(true);

    const handleShare = () => {
        const url = window.location.origin + `/post/${post._id}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    const handleSave = async () => {
        // Optimistic toggle saved state
        const wasSaved = saved;
        setSaved(!wasSaved);
        try {
            if (wasSaved) {
                await API.post(`/post/unsave/${post._id}`);
                toast.success('Post unsaved');
            } else {
                await API.post(`/post/save/${post._id}`);
                toast.success('Post saved');
            }
        } catch (error) {
            // rollback on error
            setSaved(wasSaved);
            console.error('Save error:', error);
            toast.error('Failed to update saved status');
        }
    };

    return (
        <div className="w-full relative group">
            <div className="bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-active)]/60 transition-all duration-200 shadow-sm hover:shadow-md">
                <PostHeader
                    user={post.author}
                    createdAt={post.createdAt}
                    feeling={post.feeling || post.mood || post.emotion || null}
                    postId={post._id}
                    onDelete={onDelete}
                />
                <MainPost content={post.content} image={post.image} images={post.images || post.attachments} />
                <PostNav
                    likes={likeCount}
                    isLiked={liked}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onSave={handleSave}
                />
            </div>

            {/* Overlay + Sliding Comment Tab */}
            {showComments && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 dark:bg-[var(--bg-main)]/80 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setShowComments(false)}
                    ></div>

                    <div className="fixed bottom-0 left-0 w-full z-50 animate-in slide-in-from-bottom duration-300">
                        <div className="bg-white dark:bg-[var(--bg-card)] rounded-t-2xl max-w-3xl mx-auto border border-[#efefef] dark:border-[var(--border-color)] shadow-lg">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />
                            <CommentSection
                                postId={post._id}
                                postTitle={post.content?.substring(0, 30) + "..."}
                                onClose={() => setShowComments(false)}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(PostCard);