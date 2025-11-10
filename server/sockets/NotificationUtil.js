import mongoose from "mongoose";
import { getUserSocket } from "./socketMap.js";
import Notification from "../models/Notification.js";

export const createNotification = async ({
    io,
    type,
    receiverId,
    senderId,
    postId = null,
    extraData = {},
}) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const notification = await Notification.create(
            [
                {
                    userId: receiverId,
                    senderId: senderId,
                    postId,
                    type,
                    read:false,
                    createdAt: new Date(),
                    ...extraData
                },
            ],
            { session }
        );
        await session.commitTransaction();
        session.endSession();

        // Now notify the author
        // receiverId nikalo -> socketMap me check kro
        const receiverSocketId = getUserSocket(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("notify", notification);
        }
        return notification;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
