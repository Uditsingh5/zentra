import express from 'express';
import { errorHandler } from '../middlewares/errorHandler.js';
import { customError } from '../utils/errorProvider.js';
import user from "../models/User.js";

export const followUser = async (req,res) =>{
  try{
      const {userId} = req.body;
      const destUserId = req.params.id;
      const user1 = await user.findById(userId);
      const user2 = await user.findById(destUserId);
      if(!user1 || !user2){
        throw new customError('USER_NOT_FOUND');
      }
      user1.Following.push(destUserId);
      user2.Followers.push(userId);
      user1.save();
      user2.save();
      res.status(200).json({
        messege : `You have Now started following ${user2.name}!`
      })
  }catch(error){
    errorHandler(error,req,res);
  }
}
export const unFollowUser = async (req,res) =>{
  try{
      const {userId} = req.body;
      const destUserId = req.params.id;
      const user1 = await user.findById(userId);
      const user2 = await user.findById(destUserId);
      if(!user1 || !user2){
        throw new customError('BAD_REQUEST');
      }
      user1.Following.pop(destUserId);
      user2.Followers.pop(userId);
      user1.save();
      user2.save();
      res.status(200).json({
        messege : `You have Now unfollowed ${user2.name}!`
      })
  }catch(error){
    errorHandler(error,req,res);
  }
}
