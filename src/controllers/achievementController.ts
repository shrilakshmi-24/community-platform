import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

import { uploadToCloudinary } from '../utils/cloudinary';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Create a new achievement for a user (Admin only)
export const createAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Admin check should be done in middleware, but good to be safe or if re-used
        // Assuming the route is protected by verifyAdmin
        const multerReq = req as MulterRequest;
        const { userId, title, description, date } = req.body;

        if (!userId || !title || !description || !date) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        let proofUrl = null;
        let mediaType = null;

        if (multerReq.file) {
            try {
                proofUrl = await uploadToCloudinary(multerReq.file.buffer, 'achievements');
                mediaType = multerReq.file.mimetype.startsWith('image/') ? 'IMAGE' : 'PDF';
            } catch (uploadError) {
                console.error('File upload failed:', uploadError);
                res.status(500).json({ message: 'File upload failed' });
                return;
            }
        }

        const achievement = await prisma.achievement.create({
            data: {
                userId,
                title,
                description,
                date: new Date(date),
                proofUrl,
                mediaType, // Saved if uploaded
                status: 'APPROVED' // Admin created, so auto-approved
            }
        });

        // Create a notification for the user
        await prisma.notification.create({
            data: {
                userId,
                title: 'New Achievement Awarded! 🏆',
                message: `You have been awarded the achievement: ${title}`,
                type: 'SUCCESS'
            }
        });

        res.status(201).json({ message: 'Achievement created successfully', achievement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all achievements (for admin review or public list if needed)
export const getAllAchievements = async (req: Request, res: Response): Promise<void> => {
    try {
        const achievements = await prisma.achievement.findMany({
            include: { user: { select: { profile: { select: { fullName: true, avatarUrl: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ achievements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete achievement
export const deleteAchievement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.achievement.delete({ where: { id: id as string } });
        res.status(200).json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
