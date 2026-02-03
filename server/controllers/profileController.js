import express from 'express';
import { errorHandler } from '../middlewares/errorHandler.js';
import { customError } from '../utils/errorProvider.js';
import Profile from '../models/ProfileSchema.js';



export const getProfile = async (req,res) => {
  try {
    const userId = req.params.id;
    const userProfile = await Profile.findById(userId);
    if(!userId)
        throw new customError('USER_NOT_FOUND');
    res.status(200).json({userProfile});
  } catch (e) {
    errorHandler(e,req,res,next);
  }
}