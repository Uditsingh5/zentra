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
    username: "uditsingh_05",
    email: "udit@ui.dev",
    autoPrompt: true,
    autoPlay: true,
    publishExplore: false,
    language: "Auto detect",
  },
  profile: {
    name: "Udit Singh",
    bio: "Designer & developer",
    location: "India",
    website: "https://www.uditsingh.in",
    profilePicture: "https://i.pravatar.cc/100?img=56",
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
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? "bg-gray-800" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-200 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  )
}

// SettingRow Component
function SettingRow({ label, children, isLast = false }) {
  return (
    <div className={`flex items-center justify-between py-5 ${isLast ? "" : "border-b border-gray-200"}`}>
      <span className="text-sm text-gray-800 font-sans">{label}</span>
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
  const { data: settingsState, loading, error, dirty } = useSelector((state) => state.settings)


  
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
      
    } catch (err) {
      console.error("Failed to save settings:", err)
      const errorMsg = err?.message || "Failed to save settings. Please try again."
      setSaveError(errorMsg)
      alert(`Error: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        handleLocalUpdate("profile", "profilePicture", event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!userId) {
    return <div className="p-10 text-gray-800 text-lg font-semibold">Please log in first</div>
  }
  if (loading) return <div className="p-10 text-gray-800">Loading settings...</div>
  if (error) return <div className="p-10 text-red-500">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>

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
    <div className="min-h-screen bg-gray-100 p-5 pb-32 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex min-h-[600px]">
          {/* Sidebar */}
          <div
            ref={tablistRef}
            role="tablist"
            onKeyDown={onTabKeyDown}
            className="w-60 bg-white border border-gray-200 rounded-2xl rounded-r-none p-5 flex flex-col gap-2 h-auto"
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
                      ? "bg-gray-100 border border-gray-200 font-semibold text-gray-800"
                      : "border border-transparent font-medium text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <HugeiconsIcon icon={tab.icon} size={20} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-white border border-l-0 border-gray-200 rounded-2xl rounded-l-none p-8 overflow-auto">
            {active === "general" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 font-sans">General</h2>

                <SettingRow label="Username">
                  <div className="flex items-center gap-3">
                    {editingUsername ? (
                      <input
                        type="text"
                        value={settings.general?.username || ""}
                        onChange={(e) => handleLocalUpdate("general", "username", e.target.value)}
                        onBlur={() => setEditingUsername(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingUsername(false)
                        }}
                        className="px-2 py-1 border border-gray-200 rounded text-sm text-gray-800 bg-white font-sans"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm text-gray-600 font-sans">
                        {settings.general?.username || "Unnamed User"}
                      </span>
                    )}
                    <button
                      onClick={() => setEditingUsername(!editingUsername)}
                      className="p-1 bg-transparent border-none cursor-pointer text-sm text-gray-600"
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={16} />
                    </button>
                  </div>
                </SettingRow>

                <SettingRow label="Email">
                  <span className="text-sm text-gray-600">{settings.general?.email}</span>
                </SettingRow>

                <SettingRow label="Enable auto-prompt idea suggestion">
                  <Toggle
                    checked={!!settings.general?.autoPrompt}
                    onChange={(val) => handleLocalUpdate("general", "autoPrompt", val)}
                  />
                </SettingRow>

                <SettingRow label="Auto-play video on Explore">
                  <Toggle
                    checked={!!settings.general?.autoPlay}
                    onChange={(val) => handleLocalUpdate("general", "autoPlay", val)}
                  />
                </SettingRow>

                <SettingRow label="Publish on Explore">
                  <Toggle
                    checked={!!settings.general?.publishExplore}
                    onChange={(val) => handleLocalUpdate("general", "publishExplore", val)}
                  />
                </SettingRow>

                <SettingRow label="Language">
                  <span className="text-sm text-gray-600">{settings.general?.language}</span>
                </SettingRow>
              </div>
            )}

            {active === "profile" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 font-sans">Profile</h2>

                <SettingRow label="Profile Picture">
                  <div className="flex items-center gap-3">
                    <img
                      src={settings.profile?.profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-100 cursor-pointer font-sans"
                    >
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>
                </SettingRow>

                <SettingRow label="Name">
                  <input
                    type="text"
                    value={settings.profile?.name || ""}
                    onChange={(e) => handleLocalUpdate("profile", "name", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white font-sans"
                  />
                </SettingRow>

                <SettingRow label="Bio">
                  <input
                    type="text"
                    value={settings.profile?.bio || ""}
                    onChange={(e) => handleLocalUpdate("profile", "bio", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white font-sans"
                  />
                </SettingRow>

                <SettingRow label="Location">
                  <input
                    type="text"
                    value={settings.profile?.location || ""}
                    onChange={(e) => handleLocalUpdate("profile", "location", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white font-sans"
                  />
                </SettingRow>

                <SettingRow label="Website">
                  <input
                    type="text"
                    value={settings.profile?.website || ""}
                    onChange={(e) => handleLocalUpdate("profile", "website", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white font-sans"
                  />
                </SettingRow>
              </div>
            )}

            {active === "security" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 font-sans">Security</h2>

                <SettingRow label="Two-factor authentication">
                  <Toggle
                    checked={!!settings.security?.twoFA}
                    onChange={(val) => handleLocalUpdate("security", "twoFA", val)}
                  />
                </SettingRow>

                <SettingRow label="Current Password">
                  <input
                    type="password"
                    value={settings.security?.currentPassword || ""}
                    onChange={(e) => handleLocalUpdate("security", "currentPassword", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white font-sans"
                  />
                </SettingRow>

                <SettingRow label="New Password">
                  <input
                    type="password"
                    value={settings.security?.newPassword || ""}
                    onChange={(e) => handleLocalUpdate("security", "newPassword", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white font-sans"
                  />
                </SettingRow>

                <SettingRow label="Confirm Password" isLast>
                  <input
                    type="password"
                    value={settings.security?.confirmPassword || ""}
                    onChange={(e) => handleLocalUpdate("security", "confirmPassword", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white font-sans"
                  />
                </SettingRow>
              </div>
            )}

            {active === "notifications" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 font-sans">Notifications</h2>

                <SettingRow label="Likes">
                  <Toggle
                    checked={!!settings.notifications?.likes}
                    onChange={(val) => handleLocalUpdate("notifications", "likes", val)}
                  />
                </SettingRow>

                <SettingRow label="Comments">
                  <Toggle
                    checked={!!settings.notifications?.comments}
                    onChange={(val) => handleLocalUpdate("notifications", "comments", val)}
                  />
                </SettingRow>

                <SettingRow label="Mentions" isLast>
                  <Toggle
                    checked={!!settings.notifications?.mentions}
                    onChange={(val) => handleLocalUpdate("notifications", "mentions", val)}
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
            disabled={saving || !userId || !dirty}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 font-sans  border ${(saving || !userId || !dirty)?`cursor-not-allowed bg-gray-700 border-gray-400 text-white shadow-lg hover:shadow-lg `:
             ` cursor-pointer bg-gray-900 border-gray-800 text-white shadow-md hover:shadow-lg `
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}