
import { Request, Response } from 'express';
import prisma from '../config/db';
import { HelpStatus, Priority } from '@prisma/client';

interface AuthRequest extends Request {
    user?: any;
}

// Create a new help request
export const createHelpRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const {
            title, description, category, priority,
            location, bloodGroup, contactPhone, isAnonymous
        } = req.body;

        if (!title || !description || !category) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Validate Priority if provided
        let validPriority: Priority = Priority.MEDIUM;
        if (priority && Object.values(Priority).includes(priority as Priority)) {
            validPriority = priority as Priority;
        }

        const helpRequest = await prisma.helpRequest.create({
            data: {
                userId,
                title,
                description,
                category,
                priority: validPriority,
                location,
                bloodGroup,
                contactPhone,
                isAnonymous: isAnonymous || false,
                status: HelpStatus.OPEN
            }
        });

        res.status(201).json({ message: 'Help request submitted successfully', helpRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all help requests (Admin: all, User: approved/open)
export const getAllHelpRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category, status, priority, search } = req.query;

        // Build filter
        const filter: any = {};

        if (category && category !== 'ALL') filter.category = category as string;
        if (status && status !== 'ALL') filter.status = status as HelpStatus;
        if (priority && priority !== 'ALL') filter.priority = priority as Priority;

        // Security: Non-Admins can only see 'Blood' requests in the public pool
        const userRole = req.user.role;
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

        if (!isAdmin) {
            filter.category = 'Blood'; // Strict override
            // Optional: You might want to allow 'Medical' if it's URGENT? 
            // For now, strict 'Blood' as requested.
        }

        if (search) {
            filter.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [requests, total] = await prisma.$transaction([
            prisma.helpRequest.findMany({
                where: filter,
                include: {
                    user: {
                        select: {
                            id: true,
                            mobileNumber: true, // Ensuring this exists in schema
                            profile: { select: { fullName: true, email: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.helpRequest.count({ where: filter })
        ]);

        res.status(200).json({ requests, total, page, totalPages: Math.ceil(total / limit) });
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

// Update status of a request (Admin or Owner)
export const updateHelpRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const { status, priority, adminNote } = req.body;
        const userId = req.user.userId;
        const userRole = req.user.role; // Assuming role is available in token

        const request = await prisma.helpRequest.findUnique({ where: { id } });

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        // Only Admin or the Creator can update
        // Use loose check for role to be safe, or explicit check
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
        const isOwner = request.userId === userId;

        if (!isAdmin && !isOwner) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const dataToUpdate: any = {};
        if (status && Object.values(HelpStatus).includes(status)) {
            dataToUpdate.status = status;
            // specific logic: if resolved, set isResolved = true
            if (status === HelpStatus.RESOLVED || status === HelpStatus.CLOSED) {
                dataToUpdate.isResolved = true;
            } else {
                dataToUpdate.isResolved = false;
            }
        }

        // Only Admin can change priority
        if (isAdmin && priority && Object.values(Priority).includes(priority)) {
            dataToUpdate.priority = priority;
        }

        const updatedRequest = await prisma.helpRequest.update({
            where: { id },
            data: dataToUpdate
        });

        // TODO: Notify user if Admin updated it

        res.status(200).json({ message: 'Request updated', request: updatedRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Bulk update status (Admin only)
export const bulkUpdateHelpRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
            res.status(400).json({ message: 'Invalid payload' });
            return;
        }

        await prisma.helpRequest.updateMany({
            where: { id: { in: ids } },
            data: {
                status: status as HelpStatus,
                isResolved: (status === HelpStatus.RESOLVED || status === HelpStatus.CLOSED)
            }
        });

        res.status(200).json({ message: 'Bulk update successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Stats for Admin Dashboard
export const getHelpDeskStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [total, open, urgent, resolved] = await prisma.$transaction([
            prisma.helpRequest.count(),
            prisma.helpRequest.count({ where: { status: HelpStatus.OPEN } }),
            prisma.helpRequest.count({ where: { priority: Priority.URGENT, status: { not: HelpStatus.CLOSED } } }), // Urgent and not closed
            prisma.helpRequest.count({ where: { status: { in: [HelpStatus.RESOLVED, HelpStatus.CLOSED] } } })
        ]);

        const byCategory = await prisma.helpRequest.groupBy({
            by: ['category'],
            _count: { category: true }
        });

        res.status(200).json({
            summary: { total, open, urgent, resolved },
            byCategory: byCategory.map(c => ({ category: c.category, count: c._count.category }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
