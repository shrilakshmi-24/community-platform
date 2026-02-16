import { Request, Response } from 'express';
import prisma from '../config/db';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore
    const userId = req.user.userId;
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.userId;

    try {
        // Ensure user owns the notification
        const notification = await prisma.notification.findFirst({ where: { id: id as string, userId } });
        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        await prisma.notification.update({
            where: { id: id as string },
            data: { isRead: true }
        });

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error });
    }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
    const { userId, title, message, type } = req.body;
    try {
        const notification = await prisma.notification.create({
            data: { userId, title, message, type }
        });
        res.status(201).json({ message: 'Notification created', notification });
    } catch (error) {
        res.status(500).json({ message: 'Error creating notification', error });
    }
};
