
import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

// Create a new business listing
export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { businessName, category, description, address, contactPhone, website } = req.body;

        if (!businessName || !category || !description || !address) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const listing = await prisma.businessListing.create({
            data: {
                userId,
                businessName,
                category,
                description,
                address,
                contactPhone,
                website,
                status: 'PENDING' // Default to pending approval
            }
        });

        res.status(201).json({ message: 'Business listing created successfully', listing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all approved listings (Public)
export const getAllListings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, search } = req.query;

        const filter: any = { status: 'APPROVED' };

        if (category) {
            filter.category = category as string;
        }

        if (search) {
            filter.OR = [
                { businessName: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const listings = await prisma.businessListing.findMany({
            where: filter,
            include: { user: { select: { profile: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ listings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get my listings
export const getMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const listings = await prisma.businessListing.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ listings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const data = req.body;

        const listing = await prisma.businessListing.findFirst({
            where: { id: id as string, userId }
        });

        if (!listing) {
            res.status(404).json({ message: 'Listing not found or unauthorized' });
            return;
        }

        const updatedListing = await prisma.businessListing.update({
            where: { id: id as string },
            data: {
                ...data,
                status: 'PENDING' // Re-approval needed on update
            }
        });

        res.status(200).json({ message: 'Listing updated successfully', listing: updatedListing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const listing = await prisma.businessListing.findFirst({
            where: { id: id as string, userId }
        });

        if (!listing) {
            res.status(404).json({ message: 'Listing not found or unauthorized' });
            return;
        }

        await prisma.businessListing.delete({ where: { id: id as string } });

        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
