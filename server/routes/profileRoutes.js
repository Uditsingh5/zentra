import express from "express";
import { followUser, unFollowUser } from "../controllers/followController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();


router.get("/", getProfile);
// router.post("/follow/:id", followUser);
// router.post("/unfollow/:id", unFollowUser);


export default router;