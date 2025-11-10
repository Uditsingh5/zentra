import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { createNotification } from "./NotificationUtil.js";


const handleCommentEvents = (io, socket) => {
  socket.on("new_comment", async ({ postId, text, senderId, receiverId }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const post = await Post.findById(postId).session(session);
      if (!post) {
        throw new Error("Post Not Found!");
      }
      const comment = await Comment.create({ postId, authorId: senderId, content: text }, { session });
      post.comments.push(comment._id);
      await post.save({ session });
      await createNotification({
        io,
        type: "comment",
        senderId,
        receiverId,
        postId
      });
      await session.commitTransaction();
      session.endSession();

      socket.emit("Comment_success", { comment });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      socket.emit("comment_error", {
        message: err.message
      });
    }
  });
};

export default handleCommentEvents;