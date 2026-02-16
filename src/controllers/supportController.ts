
import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const createSupportRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { type, subject, details } = req.body;

        if (!type || !subject || !details) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const supportRequest = await prisma.supportRequest.create({
            data: {
                userId,
                type,
                subject,
                details,
                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Support request submitted successfully', supportRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getMySupportRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const requests = await prisma.supportRequest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllSupportRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Admin only? Or mentors too?
        // For now, let's assume filtering by type is possible
        const { type } = req.query;
        const filter: any = {};
        if (type) filter.type = type as string;

        const requests = await prisma.supportRequest.findMany({
            where: filter,
            include: { user: { select: { profile: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
