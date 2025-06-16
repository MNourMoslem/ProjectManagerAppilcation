import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { 
    getNotifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get notifications
router.get("/", verifyToken, getNotifications);

// Get unread count
router.get("/unread-count", verifyToken, getUnreadCount);

// Mark notification as read
router.put("/:notificationId/read", verifyToken, markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", verifyToken, markAllAsRead);

// Delete notification
router.delete("/:notificationId", verifyToken, deleteNotification);

export default router;
