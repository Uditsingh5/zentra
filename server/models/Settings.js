import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },

    general: {
      username: { type: String, required: true },
      email: { type: String, required: true },
      autoPrompt: { type: Boolean, default: true },
      autoPlay: { type: Boolean, default: true },
      publishExplore: { type: Boolean, default: false },
      language: { type: String, default: "Auto detect" },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      timezone: { type: String, default: "UTC+0" },
    },

    profile: {
      name: { type: String, default: "" },
      bio: { type: String, default: "" },
      location: { type: String, default: "" },
      website: { type: String, default: "" },
      avatar: { type: String, default: "" },
    },

    security: {
      twoFA: { type: Boolean, default: false },
      currentPassword: { type: String, default: "" },
      newPassword: { type: String, default: "" },     
      confirmPassword: { type: String, default: "" }, 
    },

    notifications: {
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      followers: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
    },

    privacy: {
      profileVisibility: { type: String, enum: ["public", "friends", "private"], default: "public" },
      activityStatus: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
