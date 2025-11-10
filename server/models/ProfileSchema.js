import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  
  display_name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: false,
    lowercase: true,
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return value[0] === '@';
    }
  },
  avatar: {
    type: String,
    default: "",
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  skills: {
    type: [String],
    default: [],
    required: false
  },

  // Settings Preferences

  preferences: {
    type: Object,
    required: false,
    default: {
      "dataSharing": false,
      "isPrivateAccount": true,
      "enabled2fa": false,
      "theme": "system",
      "language": "en",
      "location" : "India",
      "activeNotifications": true,
      "likeNotifications": true,
      "commentNotifications": true,
      "followNotifications": true,
      "mentionNotifications": true ,

    }
  },
  publicProfile: {
    type: Boolean,
    default: true,
    required: false
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model('profile', profileSchema);
export default Profile;

