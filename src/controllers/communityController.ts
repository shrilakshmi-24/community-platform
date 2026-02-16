
import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

// GROUPS
export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Group name is required' });
            return;
        }

        const group = await prisma.group.create({
            data: {
                name,
                description,
                ownerId: userId,
                members: {
                    create: { userId } // Owner is automatically a member
                }
            }
        });

        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const groups = await prisma.group.findMany({
            include: { _count: { select: { members: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ groups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const joinGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { groupId } = req.body;

        if (!groupId) {
            res.status(400).json({ message: 'Group ID is required' });
            return;
        }

        const existingMember = await prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } }
        });

        if (existingMember) {
            res.status(400).json({ message: 'Already a member of this group' });
            return;
        }

        await prisma.groupMember.create({
            data: { groupId, userId }
        });

        res.status(200).json({ message: 'Joined group successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

import { uploadToCloudinary } from '../utils/cloudinary';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// EVENTS
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const multerReq = req as MulterRequest;
        const { title, description, date, location } = req.body;

        if (!title || !date || !location) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        let mediaUrl = null;
        let mediaType = null;

        if (multerReq.file) {
            try {
                mediaUrl = await uploadToCloudinary(multerReq.file.buffer, 'events');
                mediaType = multerReq.file.mimetype.startsWith('image/') ? 'IMAGE' : 'VIDEO';
            } catch (uploadError) {
                console.error('File upload failed:', uploadError);
                res.status(500).json({ message: 'File upload failed' });
                return;
            }
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                organizerId: userId,
                status: req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
                mediaUrl,
                mediaType // Saved if uploaded
            }
        });

        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await prisma.event.findMany({
            where: {
                status: 'APPROVED',
                date: {
                    gte: new Date()
                }
            },
            include: { organizer: { select: { profile: { select: { fullName: true } } } } },
            orderBy: { date: 'asc' }
        });
        res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
