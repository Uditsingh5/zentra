import { useEffect, useState, useRef } from "react";
import API from "../api/axios.js";
import NewPost from "../components/Post/NewPost.jsx";
import PostCard from "../components/Post/PostCard.jsx";
import Suggestion from "../components/Profile/Suggestion.jsx";
import { useSelector } from "react-redux";

const Home = () => {
    const user = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);
    const pageRef = useRef(0);

    const fetchPosts = async (skip = 0, append = false) => {
        try {
            const res = await API.get(`/post/?limit=10&skip=${skip}`);
            const newPosts = res.data.posts || [];
            setHasMore(res.data.hasMore || false);
            
            if (append) {
                setPosts(prev => {
                    // Ensure no duplicates when appending
                    const existingIds = new Set(prev.map(p => p._id));
                    const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p._id));

                    if (uniqueNewPosts.length !== newPosts.length) {
                        console.warn('Filtered out duplicate posts when appending');
                    }

                    return [...prev, ...uniqueNewPosts];
                });
            } else {
                setPosts(newPosts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const res = await API.get("/user/suggestions");
            setSuggestions(res.data || []);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const loadMore = () => {
        // Prevent loading if already loading or no more posts
        if (!hasMore || loadingMore) return;

        setLoadingMore(true);
        pageRef.current += 1;

        // Load exactly 10 more posts
        fetchPosts(pageRef.current * 10, true);
    };

    const handleDeletePost = (postId) => {
        setPosts(prev => prev.filter(post => post._id !== postId));
    };

    useEffect(() => {
        fetchPosts();
        if (user?.userInfo?.userId) {
            fetchSuggestions();
        }
    }, [user?.userInfo?.userId]);

    // Infinite scroll with aggressive debugging
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const lastEntry = entries[0];
                if (lastEntry.isIntersecting && hasMore && !loadingMore) {
                    console.log('🔄 Last post in view - loading more posts');
                    loadMore();
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before the last post is fully visible
                threshold: 0.1 // Trigger when 10% of the last post is visible
            }
        );

        // Observe the loading trigger element at the end
        const loadingTrigger = document.querySelector('[data-post-id="loading-trigger"]');
        if (loadingTrigger) {
            observer.observe(loadingTrigger);
        }

        return () => observer.disconnect();
    // loadMore is stable; deps intentionally minimal for intersection observer
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts.length, hasMore, loadingMore]);

    return (
        <div className="w-full min-h-screen bg-white dark:bg-[var(--bg-main)]">
            <div className="max-w-7xl mx-auto flex gap-8 pt-6 px-4">
                {/* Main Feed */}
                <div className="flex-1 max-w-2xl mx-auto space-y-6 pb-20">
                    {/* New Post Trigger */}
                    <NewPost onPostCreated={fetchPosts} />

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#737373] dark:border-[var(--text-secondary)]"></div>
                            </div>
                        ) : posts.length > 0 ? (
                            <>
                                {posts.map(post => <PostCard key={post._id} post={post} data-post-id={post._id} onDelete={handleDeletePost} />)}
                                {hasMore && (
                                    <div
                                        className="flex justify-center py-8"
                                        data-post-id="loading-trigger"
                                    >
                                        <div className="text-sm text-[#737373] dark:text-[var(--text-secondary)]">
                                            Scroll for more posts...
                                        </div>
                                    </div>
                                )}

                                {loadingMore && (
                                    <div className="flex flex-col items-center py-8 space-y-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#737373] dark:border-[var(--text-secondary)]"></div>
                                        <p className="text-sm text-[#737373] dark:text-[var(--text-secondary)]">
                                            Loading more posts...
                                        </p>
                                    </div>
                                )}

                                {!hasMore && posts.length > 0 && (
                                    <div className="text-center py-8 text-[#737373] dark:text-[var(--text-secondary)] text-sm">
                                        You've seen all available posts! 🎉
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-12 text-center border-b border-[#efefef] dark:border-[var(--border-color)]">
                                <p className="text-[#737373] dark:text-[var(--text-secondary)] text-lg">No posts yet. Be the first to share something!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Suggestions */}
                <div className="hidden xl:block w-80 flex-shrink-0 sticky top-6">
                    {loadingSuggestions ? (
                        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-[#efefef] dark:border-[var(--border-color)] p-4">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <Suggestion profiles={suggestions} />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Home;