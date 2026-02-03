import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  attachments: {
    type: [String],
    required: false,
    default: []
  },
  feeling: {
    type: {
      emoji: String,
      label: String
    },
    required: false,
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: [] }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('post', postSchema)
export default Post;