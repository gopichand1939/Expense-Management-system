// FILE: src/controllers/notification.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../config/client';

// ✅ GET notifications for the logged-in user
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// ✅ MARK all notifications as read
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};
