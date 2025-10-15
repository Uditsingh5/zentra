import express from "express";
import { getUser, updateUser } from "../controllers/userController.js";
import {followUser,unFollowUser} from "../controllers/followController.js";
const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unFollowUser);


export default router;