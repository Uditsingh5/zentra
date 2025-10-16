import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  UserIcon,
  SecurityLockIcon,
  NotificationSquareIcon,
  CheckmarkBadge01Icon,
  Edit02Icon
} from "@hugeicons/core-free-icons";


const TAB_CONFIG = [
  { id: "general", label: "General", icon: Settings01Icon },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "security", label: "Security", icon: SecurityLockIcon },
  { id: "notifications", label: "Notifications", icon: NotificationSquareIcon },
  { id: "subscription", label: "Subscription", icon: CheckmarkBadge01Icon },
];


const THEME = {
  pageBg: "#f5f5f5",
  surface: "#ffffff",
  surfaceAlt: "#fefefe",
  border: "#e0e0e0",
  text: "#1a1a1a",
  textMuted: "#666666",
  grayDeep: "#555555",
  activeFill: "#f0f0f0",
  ring: "#d0d0d0",
};

// Default settings
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
  subscription: {
    plan: "Pro",
    status: "Active",
  },
};


function useSettingsState() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("app.settings");
      if (!saved) return DEFAULTS;
      const parsed = JSON.parse(saved);
      return {
        general: { ...DEFAULTS.general, ...parsed.general },
        profile: { ...DEFAULTS.profile, ...parsed.profile },
        security: { ...DEFAULTS.security, ...parsed.security },
        notifications: { ...DEFAULTS.notifications, ...parsed.notifications },
        subscription: { ...DEFAULTS.subscription, ...parsed.subscription },
      };
    } catch {
      return DEFAULTS;
    }
  });
  const [dirty, setDirty] = useState(false);

  const update = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setDirty(true);
  };

  const save = () => {
    localStorage.setItem("app.settings", JSON.stringify(settings));
    setDirty(false);
  };

  return { settings, update, save, dirty };
}


function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: "44px",
        height: "24px",
        background: checked ? "#333333" : "#cccccc",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          background: "white",
          borderRadius: "10px",
          top: "2px",
          left: checked ? "22px" : "2px",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}


function SettingRow({ label, children, isLast = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 0",
        borderBottom: isLast ? "none" : `1px solid ${THEME.border}`,
      }}
    >
      <span
        style={{
          fontSize: "15px",
          color: THEME.text,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}


export default function Settings() {
  const [active, setActive] = useState("general");
  const { settings, update, save, dirty } = useSettingsState();
  const tablistRef = useRef(null);
  const fileInputRef = useRef(null);
  const [editingUsername, setEditingUsername] = useState(false);

  const onTabKeyDown = (e) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const idx = TAB_CONFIG.findIndex((t) => t.id === active);
    let nextIdx = idx;
    if (e.key === "ArrowUp") nextIdx = (idx - 1 + TAB_CONFIG.length) % TAB_CONFIG.length;
    if (e.key === "ArrowDown") nextIdx = (idx + 1) % TAB_CONFIG.length;
    if (e.key === "Home") nextIdx = 0;
    if (e.key === "End") nextIdx = TAB_CONFIG.length - 1;
    setActive(TAB_CONFIG[nextIdx].id);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update("profile", "profilePicture", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.pageBg,
        padding: "40px 20px",
        paddingBottom: "120px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", minHeight: "600px" }}>
          {/* Sidebar Navigation */}
          <div
            ref={tablistRef}
            role="tablist"
            onKeyDown={onTabKeyDown}
            style={{
              width: "240px",
              background: THEME.surface,
              border: `1px solid ${THEME.border}`,
              borderRadius: "16px",
              borderBottomRightRadius:'0',
              borderTopRightRadius:'0',
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              height: "auto",
            }}
          >
            {TAB_CONFIG.map((tab) => {
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: isActive ? THEME.activeFill : "transparent",
                    border: `1px solid ${isActive ? THEME.border : "transparent"}`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    color: THEME.text,
                    fontSize: "14px",
                    fontWeight: isActive ? "600" : "500",
                    transition: "all 0.2s",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  <HugeiconsIcon icon={tab.icon} size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content */}
          <div
            style={{
              flex: 1,
              background: THEME.surface,
              border: `1px solid ${THEME.border}`,
              borderLeft: '0px',
              borderRadius: "16px",
              borderTopLeftRadius:'0px',
              borderBottomLeftRadius:'0px',
              padding: "32px",
              overflow: "auto",
            }}
          >
            {/* General Tab */}
            {active === "general" && (
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: THEME.text,
                    marginBottom: "32px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  General
                </h2>
                <SettingRow label="Username">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {editingUsername ? (
                      <input
                        type="text"
                        value={DEFAULTS.general.username}
                        onChange={(e) => update("general", "username", e.target.value)}
                        onBlur={() => setEditingUsername(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingUsername(false);
                        }}
                        style={{
                          padding: "4px 8px",
                          border: `1px solid ${THEME.border}`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          color: THEME.text,
                          background: THEME.surface,
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "14px", color: THEME.textMuted }}>
                        {DEFAULTS.general.username}
                      </span>
                    )}
                    <button
                      onClick={() => setEditingUsername(!editingUsername)}
                      style={{
                        padding: "4px 8px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: THEME.textMuted,
                      }}
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={16}/>
                    </button>
                  </div>
                </SettingRow>

                <SettingRow label="Email">
                  <span style={{ fontSize: "14px", color: THEME.textMuted }}>
                    {settings.general.email}
                  </span>
                </SettingRow>

                <SettingRow label="Enable auto-prompt idea suggestion">
                  <Toggle
                    checked={settings.general.autoPrompt}
                    onChange={(val) => update("general", "autoPrompt", val)}
                  />
                </SettingRow>

                <SettingRow label="Auto-play video on Explore">
                  <Toggle
                    checked={settings.general.autoPlay}
                    onChange={(val) => update("general", "autoPlay", val)}
                  />
                </SettingRow>

                <SettingRow label="Publish to Explore">
                  <Toggle
                    checked={settings.general.publishExplore}
                    onChange={(val) => update("general", "publishExplore", val)}
                  />
                </SettingRow>

                <SettingRow label="Language" isLast>
                  <select
                    value={settings.general.language}
                    onChange={(e) => update("general", "language", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                      cursor: "pointer",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    <option>Auto detect</option>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </SettingRow>
              </div>
            )}

            {/* Profile Tab */}
            {active === "profile" && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: THEME.text, marginBottom: "32px" }}>
                  Profile
                </h2>

                <SettingRow label="Profile Picture">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img
                      src={DEFAULTS.profile.profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: "8px 12px",
                        border: `1px solid ${THEME.border}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: THEME.text,
                        background: THEME.activeFill,
                        cursor: "pointer",
                      }}
                    >
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </SettingRow>

                <SettingRow label="Name">
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => update("profile", "name", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                    }}
                  />
                </SettingRow>

                <SettingRow label="Bio">
                  <input
                    type="text"
                    value={settings.profile.bio}
                    onChange={(e) => update("profile", "bio", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                    }}
                  />
                </SettingRow>

                <SettingRow label="Location">
                  <input
                    type="text"
                    value={settings.profile.location}
                    onChange={(e) => update("profile", "location", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                    }}
                  />
                </SettingRow>

                <SettingRow label="Website" isLast>
                  <input
                    type="text"
                    value={settings.profile.website}
                    onChange={(e) => update("profile", "website", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                    }}
                  />
                </SettingRow>
              </div>
            )}

            {/* Security Tab */}
            {active === "security" && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: THEME.text, marginBottom: "32px" }}>
                  Security
                </h2>

                <SettingRow label="Current Password">
                  <input
                    type="password"
                    value={settings.security.currentPassword}
                    onChange={(e) => update("security", "currentPassword", e.target.value)}
                    placeholder="Enter current password"
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                    }}
                  />
                </SettingRow>

                <SettingRow label="New Password">
                  <input
                    type="password"
                    value={settings.security.newPassword}
                    onChange={(e) => update("security", "newPassword", e.target.value)}
                    placeholder="Enter new password"
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                    }}
                  />
                </SettingRow>

                <SettingRow label="Confirm Password">
                  <input
                    type="password"
                    value={settings.security.confirmPassword}
                    onChange={(e) => update("security", "confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: THEME.text,
                      background: THEME.surface,
                    }}
                  />
                </SettingRow>

                <SettingRow label="Two-factor authentication" isLast>
                  <Toggle checked={settings.security.twoFA} onChange={(val) => update("security", "twoFA", val)} />
                </SettingRow>
              </div>
            )}

            {/* Notifications Tab */}
            {active === "notifications" && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: THEME.text, marginBottom: "32px" }}>
                  Notifications
                </h2>

                <SettingRow label="Likes">
                  <Toggle checked={settings.notifications.likes} onChange={(val) => update("notifications", "likes", val)} />
                </SettingRow>

                <SettingRow label="Comments">
                  <Toggle checked={settings.notifications.comments} onChange={(val) => update("notifications", "comments", val)} />
                </SettingRow>

                <SettingRow label="Mentions" isLast>
                  <Toggle checked={settings.notifications.mentions} onChange={(val) => update("notifications", "mentions", val)} />
                </SettingRow>
              </div>
            )}

            {/* Subscription Tab */}
            {active === "subscription" && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: THEME.text, marginBottom: "32px" }}>
                  Subscription
                </h2>

                <SettingRow label="Plan">
                  <span style={{ fontSize: "14px", color: THEME.textMuted }}>{settings.subscription.plan}</span>
                </SettingRow>

                <SettingRow label="Status" isLast>
                  <span style={{ fontSize: "14px", color: THEME.textMuted }}>{settings.subscription.status}</span>
                </SettingRow>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            bottom: "32px",
            right: "48px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          {dirty && (
            <span
              style={{
                padding: "10px 16px",
                fontSize: "13px",
                color: THEME.textMuted,
                background: THEME.surface,
                borderRadius: "8px",
                border: `1px solid ${THEME.border}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              Unsaved changes
            </span>
          )}
          <button
            onClick={save}
            disabled={!dirty}
            style={{
              padding: "10px 20px",
              background: dirty ? "#333333" : THEME.activeFill,
              border: `1px solid ${dirty ? "#333333" : THEME.border}`,
              borderRadius: "8px",
              cursor: dirty ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "600",
              color: dirty ? "white" : THEME.textMuted,
              boxShadow: dirty ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              transition: "all 0.2s",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
