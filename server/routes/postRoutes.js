import express from "express"
import { getPosts, postCreate, postDelete, postGet, likePost, unlikePost, savePost, unsavePost, reportPost } from "../controllers/postController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create', protect, postCreate); // Protect create
router.post('/save/:id', protect, savePost); // Save post
router.post('/unsave/:id', protect, unsavePost); // Unsave post
router.get('/user/:id', postGet); // Get posts by user ID
router.get('/', getPosts);
router.delete('/delete/:id', protect, postDelete); // Protect delete
router.post('/like/:id', protect, likePost);
router.post('/unlike/:id', protect, unlikePost);
router.post('/report/:id', protect, reportPost); // Report post

export default router;