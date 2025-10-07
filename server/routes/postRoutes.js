import express from "express"
import {postCreate, postDelete, postGet } from "../controllers/postController.js";
const router = express.Router();

router.post('/create', postCreate);
router.get('/user/:id', postGet);
router.delete('/delete/:id', postDelete);


export default router;