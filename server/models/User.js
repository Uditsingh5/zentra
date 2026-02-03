import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // User credentials
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, validate: (value) => /\S+@\S+\.\S+/.test(value) },
  password: { type: String, required: true },
  username: { type: String, required: false, lowercase: true, validate: (value) => !value || typeof value !== 'string' ? true : value[0] === '@' },
  avatar: { type: String, default: null },
  // Track saved posts for the user
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
  // Follow system
  Following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
  Followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('user', userSchema);
export default User;
