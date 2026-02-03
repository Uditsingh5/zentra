import React, { useEffect, useState } from "react";
import PostCard from "../components/Post/PostCard.jsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, Location01Icon, Calendar01Icon, Link01Icon, Edit02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice.js";
import API from "../api/axios.js";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user?.userInfo?.userId);
  const userId = id || loggedInUserId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    bio: "",
    location: "",
    website: "",
  });

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, postsRes] = await Promise.all([
          API.get(`/user/${userId}`),
          API.get(`/post/user/${userId}`)
        ]);

        const userData = profileRes.data.user;
        const profileData = profileRes.data.profile || {};
        const mergedProfile = { ...userData, ...profileData };

        setProfile(mergedProfile);
        setPosts(postsRes.data.posts || []);

        setEditForm({
          display_name: mergedProfile.display_name || mergedProfile.name || "",
          bio: mergedProfile.bio || "",
          location: mergedProfile.location || "",
          website: mergedProfile.website || "",
        });

        if (mergedProfile.followers && loggedInUserId) {
          const followersArray = Array.isArray(mergedProfile.followers) 
            ? mergedProfile.followers 
            : [];
          setIsFollowing(followersArray.some(id => id.toString() === loggedInUserId.toString()));
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, loggedInUserId]);

  const handleFollow = async () => {
    const previousState = isFollowing;
    const previousFollowers = profile?.followers || [];
    
    // Optimistic update
    setIsFollowing(!isFollowing);
    setProfile(prev => ({
      ...prev,
      followers: isFollowing 
        ? prev.followers.filter(id => id.toString() !== loggedInUserId.toString())
        : [...(prev.followers || []), loggedInUserId]
    }));

    try {
      if (previousState) {
        await API.post(`/user/unfollow/${userId}`);
        toast.success('Unfollowed successfully');
      } else {
        await API.post(`/user/follow/${userId}`);
        toast.success('Following now!');
      }
    } catch (err) {
      // Rollback on error
      setIsFollowing(previousState);
      setProfile(prev => ({ ...prev, followers: previousFollowers }));
      console.error("Follow error:", err);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const previousProfile = { ...profile }; // Save current state

    try {
      // Optimistically update UI
      setProfile(prev => ({ ...prev, ...editForm }));

      // Call API
      const { data } = await API.put(`/user/profile/${userId}`, editForm);

      // Update with server response
      setProfile(prev => ({ ...prev, ...data.profile }));
      setIsEditing(false);

      // Update Redux global state if editing own profile
      if (userId === loggedInUserId) {
        dispatch(setUser({
          userId: loggedInUserId,
          name: data.profile.display_name || data.profile.name,
          email: profile.email,
          avatar: data.profile.avatar || profile.avatar,
        }));
      }

      // Show success toast
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Rollback on error
      setProfile(previousProfile);
      console.error("Update profile error:", error);
      // Toast error already shown by interceptor
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[var(--bg-card)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#efefef] dark:border-[var(--border-color)] border-t-black dark:border-t-white"></div>
    </div>
  );

  if (!profile) return <div className="p-10 text-center text-[#737373] dark:text-[var(--text-secondary)]">User not found</div>;

  const joinedDate = new Date(profile.createdAt).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--bg-card)] pb-20">
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 dark:bg-[var(--bg-card)]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl w-full max-w-lg animate-in zoom-in-95 duration-300 overflow-hidden border border-[#efefef] dark:border-[var(--border-color)] shadow-lg">
            <div className="flex items-center justify-between p-5 border-b border-[#efefef] dark:border-[var(--border-color)]">
              <h2 className="text-xl font-semibold text-black dark:text-[var(--text-main)]">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                <HugeiconsIcon icon={Cancel01Icon} size={24} className="text-[#737373] dark:text-[var(--text-secondary)]" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-black dark:text-[var(--text-main)] mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#efefef] dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-card)] text-black dark:text-[var(--text-main)] focus:ring-2 focus:ring-black/10 dark:focus:ring-[var(--text-secondary)]/20 focus:border-[#dbdbdb] dark:focus:border-[var(--border-hover)] outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-[var(--text-main)] mb-1.5">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#efefef] dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-card)] text-black dark:text-[var(--text-main)] focus:ring-2 focus:ring-black/10 dark:focus:ring-[var(--text-secondary)]/20 focus:border-[#dbdbdb] dark:focus:border-[var(--border-hover)] outline-none transition-all resize-none"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-[var(--text-main)] mb-1.5">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#efefef] dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-card)] text-black dark:text-[var(--text-main)] focus:ring-2 focus:ring-black/10 dark:focus:ring-[var(--text-secondary)]/20 focus:border-[#dbdbdb] dark:focus:border-[var(--border-hover)] outline-none transition-all"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-[var(--text-main)] mb-1.5">Website</label>
                  <input
                    type="text"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#efefef] dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-card)] text-black dark:text-[var(--text-main)] focus:ring-2 focus:ring-black/10 dark:focus:ring-[var(--text-secondary)]/20 focus:border-[#dbdbdb] dark:focus:border-[var(--border-hover)] outline-none transition-all"
                    placeholder="yourwebsite.com"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-[#737373] dark:text-[var(--text-secondary)] hover:bg-[#f5f5f5] dark:hover:bg-[var(--bg-hover)] rounded-xl font-medium transition-colors border border-[#efefef] dark:border-[var(--border-color)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black dark:bg-[var(--text-main)] text-white dark:text-[var(--bg-main)] rounded-xl font-medium hover:bg-[#272727] dark:hover:bg-[var(--bg-hover)] transition-all transform hover:-translate-y-0.5 border border-black dark:border-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto pt-4 px-4">
        {/* Restored Old Profile Banner/Header Section */}
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl overflow-visible mb-8 border-b border-[#efefef] dark:border-[var(--border-color)] relative">
          {/* Banner: pattern-lines ONLY for placeholder if no banner, NO gradient or color fill */}
          <div className={[
            'relative h-48',
            profile.banner ? 'bg-cover bg-center' : 'pattern-lines'
          ].join(' ')}
            style={profile.banner ? { backgroundImage: `url(${profile.banner})` } : {}}>
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          {/* Avatar, positioned outside banner but within parent */}
          <div className="absolute left-8 top-[calc(192px-80px)] z-30">
            <div className="p-1.5 bg-white dark:bg-[var(--bg-card)] rounded-full inline-block shadow-md">
              <img
                src={profile.avatar || "https://i.imgur.com/WxNkK7J.png"}
                alt={profile.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-[var(--bg-card)]"
              />
            </div>
          </div>
          
          <div className="px-8 pb-8 pt-24 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 pt-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-black dark:text-[var(--text-main)]">{profile.display_name || profile.name}</h1>
                    <p className="text-[#737373] dark:text-[var(--text-secondary)] font-medium">{profile.username?.startsWith('@') ? profile.username : `@${profile.username}`}</p>
                  </div>
                  <div className="flex gap-3">
                    {userId !== loggedInUserId ? (
                      <button
                        onClick={handleFollow}
                        className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isFollowing
                          ? "bg-gray-100 dark:bg-[var(--bg-hover)] text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-[var(--bg-card)]"
                          : "bg-black dark:bg-[var(--accent)] text-white dark:text-[var(--text-main)] hover:bg-[#272727] dark:hover:bg-[var(--bg-hover)]"
                          }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 rounded-full border-2 border-[#efefef] dark:border-[var(--border-color)] text-black dark:text-[var(--text-main)] font-semibold hover:border-[#dbdbdb] dark:hover:border-[var(--border-hover)] hover:bg-[#fafafa] dark:hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2"
                      >
                        <HugeiconsIcon icon={Edit02Icon} size={18} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-6 max-w-2xl">
                  {/* <p className="text-black dark:text-[var(--text-main)] leading-relaxed text-[15px]">{profile.bio || "No bio yet."}</p> */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-[#737373] dark:text-[var(--text-secondary)] font-medium">
                    {profile.location && (
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Location01Icon} size={16} className="text-gray-400" />
                        {profile.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-gray-400" />
                      Joined {joinedDate}
                    </span>
                    {profile.website && (
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Link01Icon} size={16} className="text-gray-400" />
                        <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">
                          {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-12 mt-8 border-t border-[#efefef] dark:border-[var(--border-color)] pt-6">
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold text-black dark:text-[var(--text-main)]">{posts.length}</span>
                    <span className="text-sm text-[#737373] dark:text-[var(--text-secondary)] font-medium">Posts</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold text-black dark:text-[var(--text-main)]">{profile.followers?.length || 0}</span>
                    <span className="text-sm text-[#737373] dark:text-[var(--text-secondary)] font-medium">Followers</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold text-black dark:text-[var(--text-main)]">{profile.following?.length || 0}</span>
                    <span className="text-sm text-[#737373] dark:text-[var(--text-secondary)] font-medium">Following</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modern Tabs and Bottom Section (leave as is) */}
        {/* Tabs Section */}
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-3xl shadow-sm overflow-hidden border border-[#efefef] dark:border-[var(--border-color)]">
          <div className="flex border-b border-[#efefef] dark:border-[var(--border-color)]">
            {["posts", "about", "skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
                  activeTab === tab 
                    ? "text-black dark:text-[var(--text-main)]" 
                    : "text-[#737373] dark:text-[var(--text-secondary)] hover:text-black dark:hover:text-white"
                }`}
              >
                {tab === "posts" && "📝 Posts"}
                {tab === "about" && "👤 About"}
                {tab === "skills" && "⚡ Skills"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-[var(--text-main)]"></div>
                )}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map(post => <PostCard key={post._id} post={post} onDelete={handleDeletePost} />)
                ) : (
                  <div className="text-center py-20 border border-[#efefef] dark:border-[var(--border-color)] border-dashed rounded-xl">
                    <p className="text-[#737373] dark:text-[var(--text-secondary)] text-lg">No posts yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="text-[#737373] dark:text-[var(--text-secondary)] space-y-4">
                <h3 className="text-xl font-bold mb-4 text-black dark:text-[var(--text-main)]">About {(profile.display_name || profile.name)?.split(" ")[0]}</h3>
                <p className="leading-relaxed text-black dark:text-[var(--text-main)] whitespace-pre-wrap">
                  {profile.bio || "No bio available."}
                </p>
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-black dark:text-[var(--text-main)]">Technical Skills</h3>
                {profile.skills && profile.skills.length > 0 ? (
                  <SkillSection 
                    title="Skills" 
                    items={profile.skills} 
                    color="purple" 
                  />
                ) : (
                  <p className="text-[#737373] dark:text-[var(--text-secondary)]">No skills listed yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillSection({ title, items, color }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    green: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
  };

  return (
    <div className="mb-6">
      <h4 className="font-semibold text-black dark:text-[var(--text-main)] mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span 
            key={i} 
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${colorClasses[color] || colorClasses.purple}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}