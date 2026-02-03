import mongoose from "mongoose";
import { getUserSocket } from "./socketMap.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

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
        // Fetch sender information for personalized notifications
        const sender = await User.findById(senderId).select('name').session(session);

        const notification = await Notification.create(
            [
                {
                    userId: receiverId,
                    senderId: senderId,
                    postId,
                    type,
                    read: false,
                    createdAt: new Date(),
                    ...extraData
                },
            ],
            { session }
        );

        // Get the actual notification object (create returns an array)
        const notificationData = notification[0];

        // Add sender name to the notification data for real-time delivery
        const enrichedNotificationData = {
            ...notificationData.toObject(),
            senderName: sender?.name || 'Someone',
            senderAvatar: sender?.avatar || null
        };
        await session.commitTransaction();
        session.endSession();

        // Send real-time notification if user is online
        const receiverSocketId = getUserSocket(receiverId);
        if (receiverSocketId && io.sockets.sockets.has(receiverSocketId)) {
            io.to(receiverSocketId).emit("notify", enrichedNotificationData);
        }
        return enrichedNotificationData;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
