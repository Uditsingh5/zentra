import mongoose from "mongoose";
import User from "../models/User.js";
import Settings from "../models/Settings.js";
export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select('-password'); // exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        delete updates.password;
        delete updates.email;
        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};






export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    let settings = await Settings.findOne({ userId: objectId });

    if (!settings) {
      settings = new Settings({
        userId: objectId,
        general: {
          username: "user",
          email: "user@example.com",
          autoPrompt: true,
          autoPlay: true,
          publishExplore: false,
          language: "Auto detect",
          theme: "light",
          timezone: "UTC+0",
        },
        profile: {
          name: "",
          bio: "",
          location: "",
          website: "",
          avatar: "",
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
          followers: true,
          messages: true,
        },
        privacy: {
          profileVisibility: "public",
          activityStatus: true,
        },
      });

      await settings.save();
    }

    res.status(200).json(settings);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: err.message });
  }
};

// PUT - Update user settings
export const updateSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedSettings = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Find and update settings, or create if doesn't exist
    const settings = await Settings.findOneAndUpdate(
      { userId: objectId },
      updatedSettings,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(settings);
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ error: err.message });
  }
};