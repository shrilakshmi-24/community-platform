
import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const createHelpRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const helpRequest = await prisma.helpRequest.create({
            data: {
                userId,
                title,
                description,
                category,
                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Help request submitted successfully', helpRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllHelpRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, status } = req.query;

        const filter: any = {};

        if (category) filter.category = category as string;
        if (status) filter.status = status as string;
        else filter.status = 'APPROVED'; // Default to showing approved requests

        const requests = await prisma.helpRequest.findMany({
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

export const getMyHelpRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const requests = await prisma.helpRequest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const markRequestAsResolved = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const request = await prisma.helpRequest.findFirst({
            where: { id: id as string, userId }
        });

        if (!request) {
            res.status(404).json({ message: 'Request not found or unauthorized' });
            return;
        }

        const updatedRequest = await prisma.helpRequest.update({
            where: { id: id as string },
            data: { isResolved: true, status: 'CLOSED' }
        });

        res.status(200).json({ message: 'Request marked as resolved', request: updatedRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
