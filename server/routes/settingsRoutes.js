import express from "express";
import Settings from "../models/Settings.js"; // Adjust path as needed

const router = express.Router();


router.get("/api/settings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let settings = await Settings.findOne({ userId });

    if (!settings) {
      settings = new Settings({
        userId,
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
});

router.put("/api/settings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedSettings = req.body;


    const settings = await Settings.findOneAndUpdate(
      { userId },
      updatedSettings,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(settings);
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;