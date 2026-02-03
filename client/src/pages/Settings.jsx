"use client"

import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings01Icon,
  UserIcon,
  SecurityLockIcon,
  NotificationSquareIcon,
  Edit02Icon,
} from "@hugeicons/core-free-icons"

import { fetchSettings, updateSettings, localUpdate, resetDirty } from "../slices/settingsSlice.js"
import { setUser } from "../slices/userSlice.js"
import API from "../api/axios.js"


const TAB_CONFIG = [
  { id: "general", label: "General", icon: Settings01Icon },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "security", label: "Security", icon: SecurityLockIcon },
  {
    id: "notifications",
    label: "Notifications",
    icon: NotificationSquareIcon,
  },
]

// Default fallback if no settings loaded
const DEFAULTS = {
  general: {
    username: "",
    email: "user@example.com",
    autoPrompt: true,
    autoPlay: true,
    publishExplore: false,
    language: "Auto detect",
  },
  profile: {
    name: "Udit Singh",
    bio: "Designer & developer",
    location: "India",
    website: "https://www.user.in",
    profilePicture: "https://i.imgur.com/WxNkK7J.png",
  },
  security: {
    twoFA: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  notifications: {
    likes: true,
    comments: true,
    mentions: true,
  },
}

// Toggle Component
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        disabled
          ? "bg-[#e5e5e5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
          : checked
          ? "bg-black dark:bg-white"
          : "bg-[#dbdbdb] dark:bg-[var(--bg-hover)]"
      }`}
    >
      <div
        className={`absolute w-5 h-5 bg-white dark:bg-[var(--bg-main)] rounded-full top-0.5 transition-all duration-200 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  )
}

// SettingRow Component
function SettingRow({ label, children, isLast = false }) {
  return (
    <div className={`flex items-center justify-between py-5 ${isLast ? "" : "border-b border-[#efefef] dark:border-[var(--border-color)]"}`}>
      <span className="text-sm text-black dark:text-[var(--text-main)] font-sans">{label}</span>
      {children}
    </div>
  )
}

export default function Settings() {
  const dispatch = useDispatch()

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Get userId from Redux global state
  const userId = useSelector(state => state.user?.userInfo?.userId || state.user?.userInfo?._id)
  const { data: settingsState, loading: _loading, error, dirty } = useSelector((state) => state.settings)


  
  const [settings, setSettings] = useState(DEFAULTS)
  const [active, setActive] = useState("general")
  const tablistRef = useRef(null)
  const fileInputRef = useRef(null)
  const [editingUsername, setEditingUsername] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Load settings from Redux when userId is available
  useEffect(() => {
    if (userId && !hasInitialized) {
      console.log("Fetching settings for userId:", userId)
      dispatch(fetchSettings(userId))
      setHasInitialized(true)
    }
  }, [dispatch, userId, hasInitialized])

  // Fetch and update global user state
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const res = await API.get("/user/me");
          dispatch(setUser({
            userId: res.data._id,
            name: res.data.name,
            email: res.data.email,
            avatar: res.data.avatar,
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [userId, dispatch]);

  // Update local settings when Redux state changes
  useEffect(() => {
    if (settingsState && Object.keys(settingsState).length > 0) {
      console.log("Updating local settings:", settingsState)
      setSettings(settingsState)
    }
  }, [settingsState])

  const handleLocalUpdate = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
    dispatch(localUpdate({ section, key, value }))
  }

  const handleSave = async () => {
    // Validate userId exists
    if (!userId) {
      console.error("Save failed - userId is missing")
      setSaveError("User ID not found. Please refresh the page.")
      return
    }

    // Validate settings exist
    if (!settings || Object.keys(settings).length === 0) {
      console.error("Save failed - settings is empty")
      setSaveError("No settings to save. Please reload.")
      return
    }

    setSaving(true)
    setSaveError(null)

    try {
      console.log("Starting save with data:", { userId, settings })
      
      // Unwrap the async thunk to handle success/error properly
      const result = await dispatch(updateSettings({ userId, updatedSettings: settings })).unwrap()
      
      console.log("Save successful, result:", result)
      
      // Reset dirty flag after successful save
      dispatch(resetDirty())
      
      // Refresh user data to update global state
      try {
        const userRes = await API.get("/user/me");
        dispatch(setUser({
          userId: userRes.data._id,
          name: userRes.data.name,
          email: userRes.data.email,
          avatar: userRes.data.avatar,
        }));
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
      
    } catch (err) {
      console.error("Failed to save settings:", err)
      const errorMsg = err?.message || "Failed to save settings. Please try again."
      setSaveError(errorMsg)
      alert(`Error: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Image size must be less than 5MB");
      return;
    }

    try {
      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (event) => {
        handleLocalUpdate("profile", "profilePicture", event.target.result)
        handleLocalUpdate("profile", "avatar", event.target.result) // Also update avatar field
      }
      reader.readAsDataURL(file)

      // Upload to server
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadRes = await API.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const imageUrl = uploadRes.data.file.secure_url || uploadRes.data.file.url
      handleLocalUpdate("profile", "profilePicture", imageUrl)
      handleLocalUpdate("profile", "avatar", imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      setSaveError("Failed to upload image. Please try again.")
    }
  }

  const isLoggedIn = !!userId;
  
  // if (loading && isLoggedIn) return <div className="p-10 text-black dark:text-[var(--text-main)]">Loading settings...</div>
  if (error && isLoggedIn) return <div className="p-10 text-red-500">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>

  const onTabKeyDown = (e) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return
    e.preventDefault()
    const idx = TAB_CONFIG.findIndex((t) => t.id === active)
    let nextIdx = idx
    if (e.key === "ArrowUp") nextIdx = (idx - 1 + TAB_CONFIG.length) % TAB_CONFIG.length
    if (e.key === "ArrowDown") nextIdx = (idx + 1) % TAB_CONFIG.length
    if (e.key === "Home") nextIdx = 0
    if (e.key === "End") nextIdx = TAB_CONFIG.length - 1
    setActive(TAB_CONFIG[nextIdx].id)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--bg-main)] p-5 pb-32 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex min-h-[600px] border border-[#efefef] dark:border-[var(--border-color)] rounded-2xl overflow-hidden bg-white dark:bg-[var(--bg-card)] shadow-sm">
          {/* Sidebar */}
          <div
            ref={tablistRef}
            role="tablist"
            onKeyDown={onTabKeyDown}
            className="w-60 bg-white dark:bg-[var(--bg-card)] border-r border-[#efefef] dark:border-[var(--border-color)] p-5 flex flex-col gap-2 h-auto"
          >
            {TAB_CONFIG.map((tab) => {
              const isActive = tab.id === active
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#f5f5f5] dark:bg-[var(--bg-hover)] font-semibold text-black dark:text-[var(--text-main)]"
                      : "font-medium text-black dark:text-[var(--text-main)] hover:bg-[#fafafa] dark:hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  <HugeiconsIcon icon={tab.icon} size={20} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-white dark:bg-[var(--bg-card)] p-8 overflow-auto">
            {active === "general" && (
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-[var(--text-main)] mb-8 font-sans">General</h2>

                <SettingRow label="Username">
                  <div className="flex items-center gap-3">
                    {editingUsername && isLoggedIn ? (
                      <input
                        type="text"
                        value={settings.general?.username || ""}
                        onChange={(e) => handleLocalUpdate("general", "username", e.target.value)}
                        onBlur={() => setEditingUsername(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingUsername(false)
                        }}
                        className="px-2 py-1 border border-[#efefef] dark:border-[var(--border-color)] rounded text-sm text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)] font-sans"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm text-[#737373] dark:text-[var(--text-secondary)] font-sans">
                        {settings.general?.username || "Unnamed User"}
                      </span>
                    )}
                    {isLoggedIn && (
                      <button
                        onClick={() => setEditingUsername(!editingUsername)}
                        className="p-1 bg-transparent border-none cursor-pointer text-sm text-[#737373] dark:text-[var(--text-secondary)]"
                      >
                        <HugeiconsIcon icon={Edit02Icon} size={16} />
                      </button>
                    )}
                  </div>
                </SettingRow>

                <SettingRow label="Email">
                  <span className="text-sm text-[#737373] dark:text-[var(--text-secondary)]">{settings.general?.email}</span>
                </SettingRow>

                <SettingRow label="Enable auto-prompt idea suggestion">
                  <Toggle
                    checked={!!settings.general?.autoPrompt}
                    onChange={(val) => handleLocalUpdate("general", "autoPrompt", val)}
                    disabled={!isLoggedIn}
                  />
                </SettingRow>

                <SettingRow label="Auto-play video on Explore">
                  <Toggle
                    checked={!!settings.general?.autoPlay}
                    onChange={(val) => handleLocalUpdate("general", "autoPlay", val)}
                    disabled={!isLoggedIn}
                  />
                </SettingRow>

                <SettingRow label="Publish on Explore">
                  <Toggle
                    checked={!!settings.general?.publishExplore}
                    onChange={(val) => handleLocalUpdate("general", "publishExplore", val)}
                    disabled={!isLoggedIn}
                  />
                </SettingRow>

                <SettingRow label="Language">
                  <span className="text-sm text-[#737373] dark:text-[var(--text-secondary)]">{settings.general?.language}</span>
                </SettingRow>
              </div>
            )}

            {active === "profile" && (
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-[var(--text-main)] mb-8 font-sans">Profile</h2>

                <SettingRow label="Profile Picture">
                  <div className="flex items-center gap-3">
                    <img
                      src={settings.profile?.profilePicture || settings.profile?.avatar || "https://i.pravatar.cc/100?img=12"}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => isLoggedIn && fileInputRef.current?.click()}
                        disabled={!isLoggedIn}
                        className={`px-4 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans transition-colors ${
                          isLoggedIn
                            ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)] hover:bg-[#fafafa] dark:hover:bg-[var(--bg-hover)] cursor-pointer"
                            : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                        }`}
                      >
                        Change Photo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        disabled={!isLoggedIn}
                        className="hidden"
                      />
                      <p className="text-xs text-[#737373] dark:text-[var(--text-secondary)]">JPG, PNG or GIF. Max 5MB</p>
                    </div>
                  </div>
                </SettingRow>

                <SettingRow label="Name">
                  <input
                    type="text"
                    value={settings.profile?.name || ""}
                    onChange={(e) => isLoggedIn && handleLocalUpdate("profile", "name", e.target.value)}
                    disabled={!isLoggedIn}
                    className={`px-3 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans ${
                      isLoggedIn
                        ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)]"
                        : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                    }`}
                  />
                </SettingRow>

                <SettingRow label="Bio">
                  <input
                    type="text"
                    value={settings.profile?.bio || ""}
                    onChange={(e) => isLoggedIn && handleLocalUpdate("profile", "bio", e.target.value)}
                    disabled={!isLoggedIn}
                    className={`px-3 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans ${
                      isLoggedIn
                        ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)]"
                        : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                    }`}
                  />
                </SettingRow>

                <SettingRow label="Location">
                  <input
                    type="text"
                    value={settings.profile?.location || ""}
                    onChange={(e) => isLoggedIn && handleLocalUpdate("profile", "location", e.target.value)}
                    disabled={!isLoggedIn}
                    className={`px-3 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans ${
                      isLoggedIn
                        ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)]"
                        : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                    }`}
                  />
                </SettingRow>

                <SettingRow label="Website">
                  <input
                    type="text"
                    value={settings.profile?.website || ""}
                    onChange={(e) => isLoggedIn && handleLocalUpdate("profile", "website", e.target.value)}
                    disabled={!isLoggedIn}
                    className={`px-3 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans ${
                      isLoggedIn
                        ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)]"
                        : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                    }`}
                  />
                </SettingRow>
              </div>
            )}

            {active === "security" && (
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-[var(--text-main)] mb-8 font-sans">Security</h2>

                <SettingRow label="Two-factor authentication">
                  <Toggle
                    checked={!!settings.security?.twoFA}
                    onChange={(val) => handleLocalUpdate("security", "twoFA", val)}
                    disabled={!isLoggedIn}
                  />
                </SettingRow>

                <SettingRow label="Current Password">
                  <input
                    type="password"
                    value={settings.security?.currentPassword || ""}
                    onChange={(e) => isLoggedIn && handleLocalUpdate("security", "currentPassword", e.target.value)}
                    disabled={!isLoggedIn}
                    className={`px-3 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans ${
                      isLoggedIn
                        ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)]"
                        : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                    }`}
                  />
                </SettingRow>

                <SettingRow label="New Password">
                  <input
                    type="password"
                    value={settings.security?.newPassword || ""}
                    onChange={(e) => isLoggedIn && handleLocalUpdate("security", "newPassword", e.target.value)}
                    disabled={!isLoggedIn}
                    className={`px-3 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans ${
                      isLoggedIn
                        ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)]"
                        : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                    }`}
                  />
                </SettingRow>

                <SettingRow label="Confirm Password" isLast>
                  <input
                    type="password"
                    value={settings.security?.confirmPassword || ""}
                    onChange={(e) => isLoggedIn && handleLocalUpdate("security", "confirmPassword", e.target.value)}
                    disabled={!isLoggedIn}
                    className={`px-3 py-2 border border-[#efefef] dark:border-[var(--border-color)] rounded-lg text-sm font-sans ${
                      isLoggedIn
                        ? "text-black dark:text-[var(--text-main)] bg-white dark:bg-[var(--bg-card)]"
                        : "text-[#a8a8a8] dark:text-[var(--text-tertiary)] bg-[#f5f5f5] dark:bg-[var(--bg-hover)] cursor-not-allowed opacity-50"
                    }`}
                  />
                </SettingRow>
              </div>
            )}

            {active === "notifications" && (
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-[var(--text-main)] mb-8 font-sans">Notifications</h2>

                <SettingRow label="Likes">
                  <Toggle
                    checked={!!settings.notifications?.likes}
                    onChange={(val) => handleLocalUpdate("notifications", "likes", val)}
                    disabled={!isLoggedIn}
                  />
                </SettingRow>

                <SettingRow label="Comments">
                  <Toggle
                    checked={!!settings.notifications?.comments}
                    onChange={(val) => handleLocalUpdate("notifications", "comments", val)}
                    disabled={!isLoggedIn}
                  />
                </SettingRow>

                <SettingRow label="Mentions" isLast>
                  <Toggle
                    checked={!!settings.notifications?.mentions}
                    onChange={(val) => handleLocalUpdate("notifications", "mentions", val)}
                    disabled={!isLoggedIn}
                  />
                </SettingRow>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 right-12 flex gap-3 items-center z-50">
          {saveError && (
            <span className="px-4 py-2.5 text-xs text-red-600 bg-red-50 rounded-lg border border-red-200 shadow-md font-sans">
              {saveError}
            </span>
          )}
          {dirty && !saveError && (
            <span className="px-4 py-2.5 text-xs text-gray-600 bg-white rounded-lg border border-gray-200 shadow-md font-sans">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isLoggedIn || !dirty}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 font-sans border ${
              (saving || !isLoggedIn || !dirty)
                ? "cursor-not-allowed bg-[#f5f5f5] dark:bg-[var(--bg-hover)] border-[#efefef] dark:border-[var(--border-color)] text-[#737373] dark:text-[var(--text-secondary)]"
                : "cursor-pointer bg-black dark:bg-white border-black dark:border-white text-white dark:text-black hover:bg-[#272727] dark:hover:bg-[var(--bg-hover)]"
            }`}
          >
            {saving ? "Saving..." : isLoggedIn ? "Save Changes" : "Login to Save"}
          </button>
        </div>
      </div>
    </div>
  )
}