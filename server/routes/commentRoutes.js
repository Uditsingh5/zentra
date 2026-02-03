import express from "express";
import { postComment, getComments, getReplies, deleteComment } from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/comments", authMiddleware, postComment);
router.get("/posts/:id/comments", getComments);
router.get("/comments/:id/replies", getReplies);
router.delete("/comments/:id", authMiddleware, deleteComment);

export default router;