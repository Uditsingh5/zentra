import express from "express";
import { postComment, getComments, deleteComment } from "../controllers/commentController.js";
const router = express.Router();

router.post('/', postComment);
router.get('/:id', getComments);
router.delete('/:id', deleteComment);

export default router;