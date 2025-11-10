import mongoose from "mongoose";
import Post from "../models/Post.js";
import { createNotification } from "./NotificationUtil.js";


const handleLikeEvents = (io,socket) =>{
  socket.on("new_like",async (
    {postId,senderId,receiverId}) => 
  {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Post.findByIdAndUpdate(
        postId,
        { $inc: {
          [likes]: 1
        }},
        {new:true}
      ).session(session);

      await createNotification({
        io,
        type : "like",
        senderId,
        receiverId,
        postId
      });
      await session.commitTransaction();
      session.endSession();

      socket.emit("like_success",{
        massage: "liked Successfully!"
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      socket.emit("like_error",{
        message: err.message
      });
    }

  })
}
export default handleLikeEvents;