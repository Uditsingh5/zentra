// import mongoose from 'mongoose';

// const commentSchema = new mongoose.Schema({
  
//   postId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'post',
//     required: true,
//   },
//   authorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: [] }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// commentSchema.index({ postId: 1, createdAt: -1 });


// const Comment = mongoose.model('comment', commentSchema)
// export default Comment;

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);