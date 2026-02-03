import express from 'express';
import { errorHandler } from '../middlewares/errorHandler.js';
import { customError } from '../utils/errorProvider.js';
import user from "../models/User.js";
import { createNotification } from '../sockets/NotificationUtil.js';

export const followUser = async (req, res) => {
  try {
    const userId = req.user._id; // Get from auth middleware
    const destUserId = req.params.id;
    
    if (userId.toString() === destUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }
    
    const user1 = await user.findById(userId);
    const user2 = await user.findById(destUserId);
    if (!user1 || !user2) {
      throw customError('USER_NOT_FOUND');
    }
    
    // Check if already following
    const isFollowing = user1.Following.some(id => id.toString() === destUserId);
    if (isFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }
    
    // Add to following/followers
    user1.Following.push(destUserId);
    user2.Followers.push(userId);
    await user1.save();
    await user2.save();

    // Create Notification with socket emission
    const io = req.app.get('io');
    await createNotification({
      io,
      type: 'follow',
      receiverId: destUserId.toString(), // Ensure string
      senderId: userId.toString(), // Ensure string
    });

    res.status(200).json({
      message: `You have Now started following ${user2.name}!`,
      following: true
    })
  } catch (error) {
    errorHandler(error, req, res);
  }
}
export const unFollowUser = async (req, res) => {
  try {
    const userId = req.user._id; // Get from auth middleware
    const destUserId = req.params.id;
    const user1 = await user.findById(userId);
    const user2 = await user.findById(destUserId);
    if (!user1 || !user2) {
      throw customError('BAD_REQUEST');
    }

    // Check if actually following
    const isFollowing = user1.Following.some(id => id.toString() === destUserId);
    if (!isFollowing) {
      return res.status(400).json({ message: "Not following this user" });
    }

    user1.Following = user1.Following.filter(id => id.toString() !== destUserId);
    user2.Followers = user2.Followers.filter(id => id.toString() !== userId);

    await user1.save();
    await user2.save();
    res.status(200).json({
      message: `You have Now unfollowed ${user2.name}!`,
      following: false
    })
  } catch (error) {
    errorHandler(error, req, res);
  }
}
