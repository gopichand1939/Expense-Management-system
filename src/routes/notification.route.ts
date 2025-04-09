// FILE: src/routes/notification.route.ts
import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { getUserNotifications, markAllAsRead } from '../controllers/notification.controller';

const router = Router();

// ✅ Get all notifications for the logged-in user
router.get('/', verifyToken, getUserNotifications);

// ✅ Mark all as read
router.patch('/read-all', verifyToken, markAllAsRead);

export default router;
