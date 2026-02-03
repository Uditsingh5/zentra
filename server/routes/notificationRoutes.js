import express from "express";
import { getNotifications, markRead, deleteNotification } from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all notification routes

router.get("/", getNotifications);
router.put("/read/:id", markRead);
router.delete("/:id", deleteNotification);



export default router;
