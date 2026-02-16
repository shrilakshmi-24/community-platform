import { Request, Response } from 'express';
import prisma from '../config/db';
import { uploadToCloudinary } from '../utils/cloudinary';

interface AuthRequest extends Request {
    user?: any;
}

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const multerReq = req as MulterRequest;
        const { title, description } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }

        let mediaUrl = null;
        let mediaType = null;

        if (multerReq.file) {
            try {
                mediaUrl = await uploadToCloudinary(multerReq.file.buffer, 'announcements');
                mediaType = multerReq.file.mimetype.startsWith('image/') ? 'IMAGE' : 'VIDEO';
            } catch (uploadError) {
                console.error('File upload failed:', uploadError);
                res.status(500).json({ message: 'File upload failed' });
                return;
            }
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                description,
                mediaUrl,
                mediaType,
                userId
            }
        });

        res.status(201).json({ message: 'Announcement created successfully', announcement });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllAnnouncements = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcements = await prisma.announcement.findMany({
            where: { isActive: true },
            include: { user: { select: { profile: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ announcements });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.announcement.delete({ where: { id: id as string } });
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
