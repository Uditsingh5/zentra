import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
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
    default: "",
    // Default username fn bnana hai abhi !
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return value[0] === '@';
    }
  },
  avatar: {
    type: String,
    default: "avatar.png",
    required: false
  },
  bio: {
    type: String,
    default: "",
    required: false
  },
  location: {
    type: String,
    default: "India",
    required: false
  },
  website: {
    type: String,
    default: "website-url",
    required: false
  },
  skills: {
    type: [String],
    default: [],
    required: false
  },

  // Settings Preferences
  publicProfile: {
    type: Boolean,
    default: false,
    required: false
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
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

