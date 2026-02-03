import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useSelector } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, LinkForwardIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import toast from 'react-hot-toast';

export default function CommentSection({ postId, postTitle, onClose }) {
    const { userInfo } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            if (!postId) return;
            setLoading(true);
            try {
                const res = await API.get(`/comment/posts/${postId}/comments`);
                setComments(res.data.comments || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
                toast.error("Failed to load comments");
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    // Add comment
    const handlePostComment = async () => {
        if (!newComment.trim() || posting) return;
        
        setPosting(true);
        const commentText = newComment;
        setNewComment(""); // Clear input immediately for better UX

        try {
            const res = await API.post("/comment/comments", {
                postId,
                content: commentText
            });
            
            // Add the new comment to the list
            setComments(prev => [res.data.comment, ...prev]);
            toast.success("Comment posted!");
        } catch (error) {
            console.error("Error posting comment:", error);
            setNewComment(commentText); // Restore text on error
            toast.error("Failed to post comment");
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-[var(--bg-card)] p-4 border-b border-[#efefef] dark:border-[var(--border-color)] flex justify-between items-center z-10">
                <h2 className="text-lg font-semibold text-black dark:text-[var(--text-main)] truncate max-w-[80%]">
                    {postTitle ? (postTitle.length > 30 ? postTitle.substring(0, 30) + "..." : postTitle) : "Comments"}
                </h2>
                <button 
                    onClick={onClose} 
                    className="text-[#737373] dark:text-[var(--text-secondary)] hover:text-black dark:hover:text-[var(--text-main)] hover:bg-[#f5f5f5] dark:hover:bg-[var(--bg-hover)] rounded-full p-1.5 transition-colors"
                    aria-label="Close comments"
                >
                    ✕
                </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#737373] dark:border-[var(--text-secondary)]"></div>
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <Comment 
                            key={comment._id} 
                            comment={comment} 
                            postId={postId} 
                            currentUser={userInfo}
                            onCommentUpdate={(updatedComment) => {
                                setComments(prev => prev.map(c => 
                                    c._id === updatedComment._id ? updatedComment : c
                                ));
                            }}
                            onCommentDelete={(commentId) => {
                                setComments(prev => prev.filter(c => c._id !== commentId));
                            }}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 text-[#737373] dark:text-[var(--text-secondary)]">
                        <p className="text-base font-medium mb-1">No comments yet</p>
                        <p className="text-sm">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>

            {/* Add Comment Input */}
            {userInfo?.userId && (
                <div className="sticky bottom-0 bg-white dark:bg-[var(--bg-card)] p-4 border-t border-[#efefef] dark:border-[var(--border-color)] flex gap-2 z-10">
                    <div className="flex-1 flex items-center gap-3 bg-[#f5f5f5] dark:bg-[var(--bg-hover)] rounded-full px-4 py-2 border border-[#efefef] dark:border-[var(--border-color)] focus-within:border-[#737373] dark:focus-within:border-[var(--text-secondary)] transition-all">
                        <img
                            src={userInfo.avatar}
                            alt="Your avatar"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-200"
                            onError={(e) => {
                                e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#e5e7eb"/><circle cx="16" cy="12" r="6" fill="#9ca3af"/><path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="#9ca3af"/></svg>`)}`;
                            }}
                        />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-black dark:text-[var(--text-main)] placeholder-[#a8a8a8] dark:placeholder-[var(--text-secondary)]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostComment();
                                }
                            }}
                            disabled={posting}
                        />
                    </div>
                    <button
                        onClick={handlePostComment}
                        disabled={!newComment.trim() || posting}
                        className="bg-black dark:bg-[var(--text-main)] text-white dark:text-[var(--bg-main)] px-6 py-2 rounded-full hover:bg-[#272727] dark:hover:bg-[var(--bg-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
                    >
                        {posting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Posting...</span>
                            </>
                        ) : (
                            "Post"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

function Comment({ comment, postId, currentUser, onCommentUpdate: _onCommentUpdate, onCommentDelete }) {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [postingReply, setPostingReply] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isOwner = currentUser?.userId && (
        comment.authorId?._id?.toString() === currentUser.userId.toString() ||
        comment.authorId?.toString() === currentUser.userId.toString()
    );

    const fetchReplies = async () => {
        if (loadingReplies) return;
        setLoadingReplies(true);
        try {
            const res = await API.get(`/comment/comments/${comment._id}/replies?page=1`);
            setReplies(res.data.replies || []);
        } catch (error) {
            console.error("Error fetching replies:", error);
            toast.error("Failed to load replies");
        } finally {
            setLoadingReplies(false);
        }
    };

    const toggleReplies = () => {
        if (!showReplies && replies.length === 0 && !loadingReplies) {
            fetchReplies();
        }
        setShowReplies(!showReplies);
    };

    const handlePostReply = async () => {
        if (!replyText.trim() || postingReply) return;
        
        setPostingReply(true);
        const replyContent = replyText;
        setReplyText("");

        try {
            const res = await API.post("/comment/comments", {
                postId,
                content: replyContent,
                parentCommentId: comment._id
            });
            
            setReplies(prev => [...prev, res.data.comment]);
            toast.success("Reply posted!");
        } catch (error) {
            console.error("Error posting reply:", error);
            setReplyText(replyContent);
            toast.error("Failed to post reply");
        } finally {
            setPostingReply(false);
        }
    };

    const handleDelete = async () => {
        if (!isOwner || deleting) return;
        
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        setDeleting(true);
        try {
            await API.delete(`/comment/comments/${comment._id}`);
            toast.success("Comment deleted");
            if (onCommentDelete) {
                onCommentDelete(comment._id);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment");
        } finally {
            setDeleting(false);
        }
    };

    const formatTime = (date) => {
        if (!date) return "";
        const now = new Date();
        const commentDate = new Date(date);
        const diff = Math.floor((now - commentDate) / 1000);
        
        if (diff < 60) return "now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
        return commentDate.toLocaleDateString();
    };

    return (
        <div className="flex gap-3 group">
            <img
                src={comment.authorId?.avatar}
                alt={comment.authorId?.name || "User"}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-gray-100 bg-gray-200"
                onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#e5e7eb"/><circle cx="20" cy="14" r="7" fill="#9ca3af"/><path d="M8 34c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="#9ca3af"/></svg>`)}`;
                }}
            />
            <div className="flex-1 min-w-0">
                <div className="bg-[#f5f5f5] dark:bg-[var(--bg-hover)] rounded-xl p-3 hover:bg-[#efefef] dark:hover:bg-[var(--bg-card)] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-black dark:text-[var(--text-main)]">
                                    {comment.authorId?.name || "Unknown User"}
                                </p>
                                <span className="text-xs text-[#737373] dark:text-[var(--text-secondary)]">
                                    {formatTime(comment.createdAt)}
                                </span>
                            </div>
                            <p className="text-sm text-black dark:text-[var(--text-main)] whitespace-pre-wrap break-words">
                                {comment.content}
                            </p>
                        </div>
                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full text-red-500 hover:text-red-600"
                                aria-label="Delete comment"
                            >
                                <HugeiconsIcon icon={Delete02Icon} size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-2 ml-2">
                    <button
                        onClick={toggleReplies}
                        className="flex items-center gap-1.5 text-[#737373] dark:text-[var(--text-secondary)] text-xs font-medium hover:text-black dark:hover:text-[var(--text-main)] transition-colors"
                    >
                        <HugeiconsIcon icon={LinkForwardIcon} size={14} />
                        <span>{showReplies ? "Hide" : "Reply"}</span>
                        {replies.length > 0 && (
                            <span className="text-[#a8a8a8] dark:text-[var(--text-secondary)]">({replies.length})</span>
                        )}
                    </button>
                </div>

                {showReplies && (
                    <div className="mt-3 ml-3 pl-3 border-l-2 border-gray-200 space-y-3">
                        {/* Replies List */}
                        {loadingReplies ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                            </div>
                        ) : replies.length > 0 ? (
                            replies.map((reply) => (
                                <div key={reply._id} className="flex gap-2">
                                    <img
                                        src={reply.authorId?.avatar}
                                        alt={reply.authorId?.name || "User"}
                                        className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-gray-200 bg-gray-200"
                                        onError={(e) => {
                                            e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="14" fill="#e5e7eb"/><circle cx="14" cy="10" r="5" fill="#9ca3af"/><path d="M5 23c0-4.6 3.8-8.3 8.3-8.3s8.3 3.7 8.3 8.3" fill="#9ca3af"/></svg>`)}`;
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="bg-[#f5f5f5] dark:bg-[var(--bg-hover)] rounded-xl p-2.5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-xs font-semibold text-black dark:text-[var(--text-main)]">
                                                    {reply.authorId?.name || "Unknown User"}
                                                </p>
                                                <span className="text-xs text-[#737373] dark:text-[var(--text-secondary)]">
                                                    {formatTime(reply.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-black dark:text-[var(--text-main)] whitespace-pre-wrap break-words">
                                                {reply.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-[#a8a8a8] dark:text-[var(--text-secondary)] italic">No replies yet</p>
                        )}

                        {/* Add Reply Input */}
                        {currentUser?.userId && (
                            <div className="flex gap-2 items-center mt-2">
                                <img
                                    src={currentUser.avatar}
                                    alt="Your avatar"
                                    className="w-6 h-6 rounded-full object-cover flex-shrink-0 bg-gray-200"
                                    onError={(e) => {
                                        e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#e5e7eb"/><circle cx="12" cy="9" r="4" fill="#9ca3af"/><path d="M4 21c0-4 3.2-7.3 7.3-7.3s7.3 3.3 7.3 7.3" fill="#9ca3af"/></svg>`)}`;
                                    }}
                                />
                                <input
                                    className="flex-1 bg-[#f5f5f5] dark:bg-[var(--bg-hover)] border border-[#efefef] dark:border-[var(--border-color)] rounded-full px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#737373] dark:focus:ring-[var(--text-secondary)] focus:border-[#737373] dark:focus:border-[var(--text-secondary)] focus:outline-none transition-all text-black dark:text-[var(--text-main)] placeholder-[#a8a8a8] dark:placeholder-[var(--text-secondary)]"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${comment.authorId?.name || "comment"}...`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handlePostReply();
                                        }
                                    }}
                                    disabled={postingReply}
                                />
                                <button
                                    onClick={handlePostReply}
                                    disabled={!replyText.trim() || postingReply}
                                    className="text-black dark:text-[var(--text-main)] text-xs font-semibold hover:opacity-70 disabled:opacity-50 px-2 py-1"
                                >
                                    {postingReply ? "..." : "Send"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
