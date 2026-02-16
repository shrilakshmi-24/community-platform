
import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;

        // Fetch user details first to ensure user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { mobileNumber: true, role: true, status: true }
        });

        if (!user) {
            res.status(401).json({ message: 'User account not found. Please log in again.' });
            return;
        }

        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            res.status(404).json({ message: 'Profile not found', user });
            return;
        }

        res.status(200).json({ profile, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { fullName, email, address, city, state, bio, avatarUrl } = req.body;

        const profile = await prisma.profile.upsert({
            where: { userId },
            update: {
                fullName,
                email,
                address,
                city,
                state,
                bio,
                avatarUrl
            },
            create: {
                userId,
                fullName,
                email,
                address,
                city,
                state,
                bio,
                avatarUrl
            }
        });

        // If profile is completed, we might want to change user status to ACTIVE if it was PENDING
        // For now, let's keep it manual or based on admin verification if required.
        // However, if basic details are filled, we can consider them a MEMBER.

        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const requestVerification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { idProofType, idProofUrl } = req.body;

        if (!idProofType || !idProofUrl) {
            res.status(400).json({ message: 'ID Proof Type and URL are required' });
            return;
        }

        const profile = await prisma.profile.update({
            where: { userId },
            data: {
                idProofType,
                idProofUrl,
                submittedAt: new Date(),
                isVerified: false // Reset if re-submitting
            }
        });

        res.status(200).json({ message: 'Verification requested successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update About Me section
export const updateAboutMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { fullName, email, address, city, state, bio, avatarUrl, interests, skills, profession, bloodGroup, dateOfBirth, maritalStatus } = req.body;

        const profile = await prisma.profile.upsert({
            where: { userId },
            update: {
                fullName,
                email,
                address,
                city,
                state,
                bio,
                avatarUrl,
                interests: interests || [],
                skills: skills || [],
                profession,
                bloodGroup,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                maritalStatus
            },
            create: {
                userId,
                fullName,
                email,
                address,
                city,
                state,
                bio,
                avatarUrl,
                interests: interests || [],
                skills: skills || [],
                profession,
                bloodGroup,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                maritalStatus
            }
        });

        res.status(200).json({ message: 'About Me updated successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Family section
export const updateFamily = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { totalFamilyMembers, familyMembers } = req.body;

        const profile = await prisma.profile.upsert({
            where: { userId },
            update: {
                totalFamilyMembers: totalFamilyMembers ? parseInt(totalFamilyMembers) : 0,
                familyMembers: familyMembers || null
            },
            create: {
                userId,
                totalFamilyMembers: totalFamilyMembers ? parseInt(totalFamilyMembers) : 0,
                familyMembers: familyMembers || null
            }
        });

        res.status(200).json({ message: 'Family information updated successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Business/Occupation section
export const updateBusiness = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { occupation, company, workAddress } = req.body;

        const profile = await prisma.profile.upsert({
            where: { userId },
            update: {
                occupation,
                company,
                workAddress
            },
            create: {
                userId,
                occupation,
                company,
                workAddress
            }
        });

        res.status(200).json({ message: 'Business information updated successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
