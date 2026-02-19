import { Request, Response } from 'express';
import { PrismaClient, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalUsers = await prisma.user.count();
        const pendingUsers = await prisma.user.count({ where: { status: 'PENDING' } });
        const pendingBusiness = await prisma.businessListing.count({ where: { status: 'PENDING' } });
        const pendingCareer = await prisma.careerListing.count({ where: { status: 'PENDING' } });
        const pendingEvents = await prisma.event.count({ where: { status: 'PENDING' } });
        const pendingServices = await prisma.helpRequest.count({ where: { status: 'OPEN' as any } });

        res.json({
            users: { total: totalUsers, pending: pendingUsers },
            content: {
                business: pendingBusiness,
                career: pendingCareer,
                events: pendingEvents,
                services: pendingServices
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

// --- User Management ---

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                role: true,
                status: true,
                createdAt: true,
                profile: true // Include full profile or select needed fields
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params as { userId: string };
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: 'SUSPENDED' }
        });
        res.json({ message: 'User deactivated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params as { userId: string };
    try {
        await prisma.user.delete({ where: { id: userId } });
        res.json({ message: 'User deleted permanently' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

export const verifyUser = async (req: Request, res: Response): Promise<void> => {
    const { userId, status, isVerified } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status }
        });

        if (isVerified !== undefined) {
            await prisma.profile.update({
                where: { userId },
                data: { isVerified, verifiedAt: isVerified ? new Date() : null }
            });
        }

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user', error });
    }
};

export const getContent = async (req: Request, res: Response): Promise<void> => {
    const status = req.query.status as string;

    // Status mapping for Help Requests (which use different Enum)
    let helpRequestStatus: any = undefined;
    if (status) {
        if (status === 'PENDING') helpRequestStatus = 'OPEN';
        else if (status === 'APPROVED') helpRequestStatus = 'IN_PROGRESS'; // or RESOLVED
        else if (status === 'REJECTED') helpRequestStatus = 'CLOSED';
        else if (status === 'ALL') helpRequestStatus = undefined;
    }

    const whereGeneric: any = (status && status !== 'ALL') ? { status } : {};
    const whereHelp: any = helpRequestStatus ? { status: helpRequestStatus } : {};

    try {
        const business = await prisma.businessListing.findMany({ where: whereGeneric, include: { user: { select: { profile: { select: { fullName: true } } } } }, orderBy: { createdAt: 'desc' } });
        const career = await prisma.careerListing.findMany({ where: whereGeneric, include: { user: { select: { profile: { select: { fullName: true } } } } }, orderBy: { createdAt: 'desc' } });
        const events = await prisma.event.findMany({ where: whereGeneric, include: { organizer: { select: { profile: { select: { fullName: true } } } } }, orderBy: { createdAt: 'desc' } });

        // HelpRequests use a different status enum
        const services = await prisma.helpRequest.findMany({
            where: whereHelp,
            include: { user: { select: { profile: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ business, career, events, services });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content', error });
    }
};

export const approveContent = async (req: Request, res: Response): Promise<void> => {
    const { type, id, status } = req.body; // type: 'business', 'career', 'event'

    try {
        let result;
        if (type === 'business') {
            result = await prisma.businessListing.update({ where: { id }, data: { status } });
        } else if (type === 'career') {
            result = await prisma.careerListing.update({ where: { id }, data: { status } });
        } else if (type === 'event') {
            result = await prisma.event.update({ where: { id }, data: { status } });
        } else if (type === 'service') {
            result = await prisma.helpRequest.update({ where: { id }, data: { status } });
        } else {
            res.status(400).json({ message: 'Invalid content type' });
            return;
        }
        res.json({ message: 'Content updated', result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating content', error });
    }
};

// Get pending members awaiting approval
export const getPendingMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const pendingMembers = await prisma.user.findMany({
            where: { status: 'PENDING' },
            select: {
                id: true,
                status: true,
                createdAt: true,
                profile: {
                    select: {
                        fullName: true,
                        email: true,
                        address: true,
                        city: true,
                        state: true,
                        submittedAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ members: pendingMembers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending members', error });
    }
};

// Approve members (Bulk)
export const approveMembers = async (req: Request, res: Response): Promise<void> => {
    const { userIds } = req.body; // Array of user IDs

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ message: 'No user IDs provided' });
        return;
    }

    try {
        // Use a transaction ensures all or nothing
        await prisma.$transaction(async (tx) => {
            // 1. Update users status
            await tx.user.updateMany({
                where: { id: { in: userIds } },
                data: { status: 'ACTIVE' }
            });

            // 2. Update profiles verification
            await tx.profile.updateMany({
                where: { userId: { in: userIds } },
                data: {
                    isVerified: true,
                    verifiedAt: new Date()
                }
            });

            // 3. Create notifications (createMany is supported in Postgres)
            const notifications = userIds.map(userId => ({
                userId,
                title: 'Membership Approved! 🎉',
                message: 'Congratulations! Your membership has been approved. You now have full access to the community.',
                type: 'SUCCESS'
            }));

            await tx.notification.createMany({
                data: notifications
            });
        });

        res.json({ message: 'Members approved successfully', count: userIds.length });
    } catch (error) {
        console.error('Error approving members:', error);
        res.status(500).json({ message: 'Error approving members', error });
    }
};

// Reject members (Bulk)
export const rejectMembers = async (req: Request, res: Response): Promise<void> => {
    const { userIds, reason } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ message: 'No user IDs provided' });
        return;
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Update users status
            await tx.user.updateMany({
                where: { id: { in: userIds } },
                data: { status: 'SUSPENDED' } // Or REJECTED if enum allows, using SUSPENDED as per previous logic
            });

            // 2. Create notifications
            const notifications = userIds.map(userId => ({
                userId,
                title: 'Membership Application Update',
                message: `Your membership application has been reviewed. ${reason || 'Please contact support for more information.'}`,
                type: 'WARNING'
            }));

            await tx.notification.createMany({
                data: notifications
            });
        });

        res.json({ message: 'Members rejected successfully', count: userIds.length });
    } catch (error) {
        console.error('Error rejecting members:', error);
        res.status(500).json({ message: 'Error rejecting members', error });
    }
};

// --- Donation Management ---

export const getDonationSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalDonations = await prisma.donationTransaction.aggregate({
            _sum: { amount: true },
            _count: { id: true }
        });

        const uniqueDonors = await prisma.donationTransaction.findMany({
            distinct: ['donorName', 'donorId'],
            select: { id: true }
        });

        const campaigns = await prisma.donation.findMany({
            include: {
                _count: { select: { transactions: true } }
            }
        });

        res.json({
            totalAmount: totalDonations._sum.amount || 0,
            totalTransactions: totalDonations._count.id,
            uniqueDonors: uniqueDonors.length,
            campaigns: campaigns.map(c => ({
                id: c.id,
                title: c.title,
                target: c.targetAmount,
                collected: c.collectedAmount,
                transactionCount: c._count.transactions
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation summary', error });
    }
};

export const getDonationTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const transactions = await prisma.donationTransaction.findMany({
            include: {
                donation: { select: { title: true } },
                donorUser: {
                    select: {
                        profile: {
                            select: {
                                fullName: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

// --- Reports & Analytics ---

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        // User Geography
        const usersByCity = await prisma.profile.groupBy({
            by: ['city'],
            _count: { city: true },
            orderBy: { _count: { city: 'desc' } },
            take: 10
        });

        // Family Members
        const totalFamilyMembers = await prisma.profile.aggregate({
            _sum: { totalFamilyMembers: true }
        });

        // Content Activity
        const eventCount = await prisma.event.count();
        const serviceRequestCount = await prisma.helpRequest.count();

        res.json({
            userGeography: usersByCity,
            totalFamilyMembers: totalFamilyMembers._sum.totalFamilyMembers || 0,
            contentActivity: {
                events: eventCount,
                serviceRequests: serviceRequestCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error });
    }
};
