import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  // User Credential ~ don't change kyuki login/signup shi krna pdega fir

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      const regEx = /\S+@\S+\.\S+/;
      return regEx.test(value);
    }
  },
  password: {
    type: String,
    required: true
  },

  // Profile Data useeffect() se call hoga or global context bna denge

  username: {
    type: String,
    required: false,
    lowercase: true,
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return value[0] === '@';
    }
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
  avatar: {
    type: String,
    default: '',
    required: false
  },


  // Settings Preferences

  preferences: {
    type: Object,
    required: false,
    default: {
      "isPrivateAccount": true,
      "activeNotifications": true,
      "enabled2fa": false,
      "theme": "system"
    }
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

const User = mongoose.model('user', userSchema);
export default User;

