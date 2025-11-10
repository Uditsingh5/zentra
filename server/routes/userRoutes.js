import express from "express";
import { getUser, updateUser } from "../controllers/userController.js";
import { followUser, unFollowUser } from "../controllers/followController.js";
import { getSettings, updateSettings } from "../controllers/userController.js"; // Add 
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unFollowUser);


router.get("/settings/:userId", getSettings);
router.put("/settings/:userId", updateSettings);

export default router;