
import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const createCareerListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const {
            title, type, description, shortDescription, company, companyLogo, location, salaryRange,
            skills, experience, employmentType, applicationLink, applicationDeadline, contactEmail,
            status, publishDate, expiryDate, visibility
        } = req.body;

        const uploadedLogo = (req as any).file ? (req as any).file.path : null;
        const finalCompanyLogo = uploadedLogo || companyLogo;

        if (!title || !type || !description) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const listing = await prisma.careerListing.create({
            data: {
                userId,
                title,
                type,
                description,
                shortDescription,
                company,
                companyLogo: finalCompanyLogo,
                location,
                salaryRange,
                skills: skills || [],
                experience,
                employmentType,
                applicationLink,
                applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
                contactEmail,
                status: status || 'PENDING',
                publishDate: publishDate ? new Date(publishDate) : new Date(),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                visibility: visibility || 'ALL_MEMBERS'
            }
        });

        res.status(201).json({ message: 'Career listing created successfully', listing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllCareerListings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, search } = req.query;

        const filter: any = {
            status: 'APPROVED',
            publishDate: { lte: new Date() }
        };

        if (type) {
            filter.type = type as string;
        }

        if (search) {
            filter.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
                { company: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const listings = await prisma.careerListing.findMany({
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

export const getMyCareerListings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const listings = await prisma.careerListing.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ listings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteCareerListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const listing = await prisma.careerListing.findFirst({
            where: { id: id as string, userId }
        });

        if (!listing) {
            res.status(404).json({ message: 'Listing not found or unauthorized' });
            return;
        }

        await prisma.careerListing.delete({ where: { id: id as string } });

        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
