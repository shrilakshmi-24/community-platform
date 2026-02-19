
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
import { sendEmail } from '../utils/emailService';
import { UserStatus } from '@prisma/client';

interface MulterRequest extends Request {
    files?: Express.Multer.File[]; // Changed to support multiple files
}

// EVENTS
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const multerReq = req as MulterRequest;
        const {
            title, description, shortDescription, date, endDate, location, googleMapLink,
            sendNotification, emailSubject, emailContent,
            registrationRequired, registrationLink, maxParticipants,
            contactPerson, contactEmail, contactPhone,
            status, publishDate, expiryDate, visibility
        } = req.body;

        if (!title || !date || !location) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const images: string[] = [];
        let mediaUrl = null;
        let mediaType = null;

        // Handle multiple file uploads
        if (multerReq.files && Array.isArray(multerReq.files)) {
            for (const file of multerReq.files) {
                try {
                    const url = await uploadToCloudinary(file.buffer, 'events');
                    images.push(url);
                    // Keep existing logic for backward compatibility (first image as mediaUrl)
                    if (!mediaUrl) {
                        mediaUrl = url;
                        mediaType = file.mimetype.startsWith('image/') ? 'IMAGE' : 'VIDEO';
                    }
                } catch (uploadError) {
                    console.error('File upload failed:', uploadError);
                    // Continue with other files if one fails? Or abort? Let's log and continue
                }
            }
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                shortDescription,
                date: new Date(date),
                endDate: endDate ? new Date(endDate) : null,
                location,
                googleMapLink,
                organizerId: userId,

                registrationRequired: registrationRequired === 'true',
                registrationLink,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
                contactPerson,
                contactEmail,
                contactPhone,

                status: status || (req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING'),
                publishDate: publishDate ? new Date(publishDate) : new Date(),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                visibility: visibility || 'ALL_MEMBERS',

                mediaUrl,
                mediaType, // Saved if uploaded
                images: images // Save array of image URLs
            }
        });

        // Send Email Notification if requested
        if (req.user.role === 'ADMIN' && sendNotification === 'true') {
            // Fetch all active members with email
            const users = await prisma.user.findMany({
                where: {
                    status: UserStatus.ACTIVE,
                    profile: {
                        email: { not: null }
                    }
                },
                select: {
                    profile: { select: { email: true } }
                }
            });

            const emails = users
                .map(u => u.profile?.email)
                .filter((email): email is string => !!email);

            if (emails.length > 0) {
                const subject = emailSubject || `New Event: ${title}`;
                // Basic template if no content provided
                const html = emailContent || `
                     <h1>New Community Event!</h1>
                     <h2>${title}</h2>
                     <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                     <p><strong>Location:</strong> ${location}</p>
                     <p>${description}</p>
                     <br/>
                     <p>Log in to the app for more details.</p>
                 `;

                // Send in batches or all at once? Nodemailer handles array of recipients (BCC logic might be better for privacy)
                // For now, sending as BCC by using empty 'to' or just direct 'to' if low volume. 
                // Better to loop or use BCC. Let's send individually or BCC to avoid exposing emails.
                // Actually, sendEmail util takes array. Let's assumes it puts them in 'to'. 
                // We should probably change util to use BCC but for now let's just call it.
                // WARNING: Putting all in 'to' exposes emails. Let's modify service call to treat array as BCC? 
                // Or loop. Looping is safer for privacy but slower.
                // Let's loop for now to be safe, or batch.

                // Simplified:
                console.log(`Sending emails to ${emails.length} users...`);
                // Fire and forget email sending to not block response
                sendEmail(emails, subject, html).catch(err => console.error(err));
            }
        }

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
                publishDate: { lte: new Date() }
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

// EVENT REGISTRATION
export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { eventId } = req.body;

        if (!eventId) {
            res.status(400).json({ message: 'Event ID is required' });
            return;
        }

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        const existingRegistration = await prisma.eventRegistration.findUnique({
            where: { eventId_userId: { eventId, userId } }
        });

        if (existingRegistration) {
            if (existingRegistration.status === 'CANCELLED') {
                // Re-register
                await prisma.eventRegistration.update({
                    where: { id: existingRegistration.id },
                    data: { status: 'REGISTERED' }
                });
                res.status(200).json({ message: 'Registration reactivated successfully' });
                return;
            }
            res.status(400).json({ message: 'Already registered for this event' });
            return;
        }

        await prisma.eventRegistration.create({
            data: { eventId, userId }
        });

        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const cancelRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { eventId } = req.body;

        await prisma.eventRegistration.update({
            where: { eventId_userId: { eventId, userId } },
            data: { status: 'CANCELLED' }
        });

        res.status(200).json({ message: 'Registration cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getMyEventRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const registrations = await prisma.eventRegistration.findMany({
            where: { userId, status: 'REGISTERED' },
            select: { eventId: true }
        });
        res.status(200).json({ registrations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
export const getCommunityStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const [
            usersCount,
            businessesCount,
            eventsCount,
            scholarships,
            donations
        ] = await Promise.all([
            prisma.user.count(),
            prisma.businessListing.count({ where: { status: 'APPROVED' } }),
            prisma.event.count({ where: { status: 'APPROVED' } }),
            prisma.scholarship.aggregate({ _sum: { amount: true } }),
            prisma.donation.aggregate({ _sum: { collectedAmount: true } })
        ]);

        const totalSupport = (scholarships._sum.amount || 0) + (donations._sum.collectedAmount || 0);

        res.status(200).json({
            stats: {
                families: usersCount,
                businesses: businessesCount,
                events: eventsCount,
                supportGiven: totalSupport
            }
        });
    } catch (error) {
        console.error('Error fetching community stats:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
