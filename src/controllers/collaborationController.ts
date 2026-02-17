import { Request, Response } from 'express';
import prisma from '../config/db';
import { CollaborationType, ListingStatus } from '@prisma/client';

interface AuthRequest extends Request {
    user?: any;
}

// Create a new collaboration/loan request
export const createCollaborationRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { title, description, requirements, type } = req.body;

        if (!title || !description || !type) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Verify if the user is a business owner (has an approved business listing)
        // This enforces "only business user" rule 
        const business = await prisma.businessListing.findFirst({
            where: {
                userId,
                status: ListingStatus.APPROVED
            }
        });

        if (!business) {
            res.status(403).json({ message: 'Only approved business owners can post collaboration requests.' });
            return;
        }

        const request = await prisma.collaborationRequest.create({
            data: {
                userId,
                title,
                description,
                requirements,
                type: type as CollaborationType,
                status: ListingStatus.PENDING // or APPROVED if no moderation needed? Let's default to PENDING
            }
        });

        res.status(201).json({ message: 'Collaboration request created successfully', request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all collaboration requests
export const getAllCollaborationRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const requests = await prisma.collaborationRequest.findMany({
            where: {
                // status: ListingStatus.APPROVED // Uncomment if moderation is strictly required
            },
            include: {
                user: {
                    select: {
                        profile: { select: { fullName: true, avatarUrl: true } },
                        businessListings: { where: { status: ListingStatus.APPROVED }, select: { businessName: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
