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
  attachments: {
    type: [String],
    required: false,
    default: []
  },
  likes: {
    type: Number,
    default: 0
  },
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

const Post = mongoose.model('post',postSchema)
export default Post;