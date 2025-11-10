import mongoose from "mongoose";
import { createNotification } from "./NotificationUtil.js";
import user from "../models/User.js";

const handleFollowEvents = (io,socket) =>{
  socket.on("new_follow",async (
    {senderId,receiverId}) => 
  {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user1 = await user.findById(senderId);
      const user2 = await user.findById(receiverId);
      if(!user1 || !user2){
        throw new Error('USER_NOT_FOUND!');
      }
      user1.Following.push(destUserId);
      user2.Followers.push(userId);
      user1.save();
      user2.save();

      await createNotification({
        io,
        type : "follow",
        senderId,
        receiverId,
      });
      await session.commitTransaction();
      session.endSession();

      socket.emit("Follow_success",{
        message: "Follow failed!"
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      socket.emit("follow_error",{
        message: err.message
      });
    }

  })
}
export default handleFollowEvents;