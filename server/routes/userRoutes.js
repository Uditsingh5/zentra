import express from "express";
import { getUser, updateUser, searchUsers, updateUserProfile, getSuggestions } from "../controllers/userController.js";
import { followUser, unFollowUser } from "../controllers/followController.js";
import { getSettings, updateSettings } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/suggestions", authMiddleware, getSuggestions);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    _id: req.user._id.toString(),
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });
});

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.put("/profile/:id", updateUserProfile);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unFollowUser);

router.get("/settings/:userId", getSettings);
router.put("/settings/:userId", updateSettings);

export default router;