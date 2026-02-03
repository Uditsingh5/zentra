import mongoose from "mongoose";
import User from "../models/User.js";
import Settings from "../models/Settings.js";
import Profile from "../models/ProfileSchema.js";
export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await Profile.findOne({ userId: id });
    
    // Merge user and profile data, including followers/following from User model
    const mergedData = {
      ...user.toObject(),
      ...(profile ? profile.toObject() : {}),
      followers: user.Followers || [],
      following: user.Following || []
    };
    
    return res.status(200).json({ user: mergedData, profile });
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

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Ensure userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      updates,
      { new: true, upsert: true }
    );

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};






export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Fetch from User and Profile schemas
    const user = await User.findById(userId).select('name email avatar username');
    const userProfile = await Profile.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get or create settings
    let settings = await Settings.findOne({ userId });

    if (!settings) {
      // Create new settings with data from User and Profile
      settings = new Settings({
        userId,
        general: {
          username: userProfile?.username || user.username || `@${user.name.toLowerCase().split(' ')[0]}`,
          email: user.email,
          autoPrompt: true,
          autoPlay: true,
          publishExplore: false,
          language: "Auto detect",
          theme: "light",
          timezone: "UTC+0",
        },
        profile: {
          name: user.name,
          bio: userProfile?.bio || "",
          location: userProfile?.location || "",
          website: userProfile?.website || "",
          avatar: user.avatar || userProfile?.avatar || "",
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
    } else {
      // Update settings with latest data from User and Profile
      settings.general.username = userProfile?.username || user.username || settings.general.username;
      settings.general.email = user.email;
      settings.profile.name = user.name;
      settings.profile.avatar = user.avatar || userProfile?.avatar || settings.profile.avatar;
      settings.profile.bio = userProfile?.bio || settings.profile.bio;
      settings.profile.location = userProfile?.location || settings.profile.location;
      settings.profile.website = userProfile?.website || settings.profile.website;
      
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

    // Update Settings document
    const settings = await Settings.findOneAndUpdate(
      { userId },
      updatedSettings,
      { new: true, upsert: true, runValidators: true }
    );

    // Update User model with profile data
    if (updatedSettings.profile) {
      const userUpdates = {};
      if (updatedSettings.profile.name) {
        userUpdates.name = updatedSettings.profile.name;
      }
      // Handle both avatar and profilePicture fields
      if (updatedSettings.profile.avatar) {
        userUpdates.avatar = updatedSettings.profile.avatar;
      } else if (updatedSettings.profile.profilePicture) {
        userUpdates.avatar = updatedSettings.profile.profilePicture;
      }
      
      if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(userId, userUpdates, { new: true });
      }
    }

    // Update Profile model
    if (updatedSettings.profile || updatedSettings.general?.username) {
      const profileUpdates = {};
      
      if (updatedSettings.profile) {
        if (updatedSettings.profile.bio !== undefined) profileUpdates.bio = updatedSettings.profile.bio;
        if (updatedSettings.profile.location !== undefined) profileUpdates.location = updatedSettings.profile.location;
        if (updatedSettings.profile.website !== undefined) profileUpdates.website = updatedSettings.profile.website;
        // Handle both avatar and profilePicture fields
        if (updatedSettings.profile.avatar) {
          profileUpdates.avatar = updatedSettings.profile.avatar;
        } else if (updatedSettings.profile.profilePicture) {
          profileUpdates.avatar = updatedSettings.profile.profilePicture;
        }
        if (updatedSettings.profile.name) profileUpdates.display_name = updatedSettings.profile.name;
      }
      
      if (updatedSettings.general?.username) {
        profileUpdates.username = updatedSettings.general.username;
      }

      if (Object.keys(profileUpdates).length > 0) {
        await Profile.findOneAndUpdate(
          { userId },
          profileUpdates,
          { new: true, upsert: true }
        );
      }
    }

    // Handle password change if provided
    if (updatedSettings.security?.newPassword && updatedSettings.security?.currentPassword) {
      const user = await User.findById(userId);
      if (user && user.password) {
        const bcrypt = await import('bcrypt');
        const match = await bcrypt.default.compare(updatedSettings.security.currentPassword, user.password);
        
        if (!match) {
          return res.status(400).json({ error: "Current password is incorrect" });
        }

        if (updatedSettings.security.newPassword !== updatedSettings.security.confirmPassword) {
          return res.status(400).json({ error: "New password and confirm password do not match" });
        }

        const hashedPassword = await bcrypt.default.hash(updatedSettings.security.newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
      }
    }

    res.status(200).json(settings);
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    }).select("name username avatar _id");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get users that the current user is not following and not themselves
    const followingIds = [...currentUser.Following, userId];
    
    const suggestions = await User.find({
      _id: { $nin: followingIds }
    })
    .select("name username avatar _id")
    .limit(5)
    .lean();

    // Get profile data for suggestions
    const suggestionsWithProfile = await Promise.all(
      suggestions.map(async (user) => {
        const profile = await Profile.findOne({ userId: user._id });
        return {
          id: user._id.toString(),
          username: profile?.username || user.username || `@${user.name.toLowerCase().split(' ')[0]}`,
          name: user.name,
          avatar: user.avatar || profile?.avatar || null,
          mutuals: "Suggested for you"
        };
      })
    );

    res.status(200).json(suggestionsWithProfile);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};