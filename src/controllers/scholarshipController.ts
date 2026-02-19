import { Request, Response } from 'express';
import prisma from '../config/db';

// --- Admin Operations ---

export const createScholarship = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            title, description, shortDescription, amount, deadline, educationLevel, applicationLink,
            providerName, eligibility, requiredDocuments, contactEmail, contactPhone,
            status, publishDate, expiryDate, visibility
        } = req.body;

        const mediaUrl = (req as any).file ? (req as any).file.path : null;

        const scholarship = await prisma.scholarship.create({
            data: {
                title,
                description,
                shortDescription,
                amount: parseFloat(amount),
                deadline: new Date(deadline),
                educationLevel,
                applicationLink: applicationLink || null,

                providerName,
                eligibility,
                requiredDocuments,
                contactEmail,
                contactPhone,

                status: status || 'PENDING',
                publishDate: publishDate ? new Date(publishDate) : new Date(),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                visibility: visibility || 'ALL_MEMBERS',
                mediaUrl,
                isActive: true // Maintain backward compatibility
            }
        });

        res.status(201).json({ message: 'Scholarship created successfully', scholarship });
    } catch (error) {
        console.error('Error creating scholarship:', error);
        res.status(500).json({ message: 'Error creating scholarship', error });
    }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const { scholarshipId } = req.params;

        const applications = await prisma.scholarshipApplication.findMany({
            where: { scholarshipId: String(scholarshipId) },
            include: {
                applicant: {
                    select: {
                        id: true,
                        mobileNumber: true,
                        profile: {
                            select: {
                                fullName: true,
                                email: true,
                                city: true,
                                state: true
                                // educationLevel not in Profile
                            }
                        }
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });

        res.json({ applications });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body; // APPROVED, REJECTED

        const application = await prisma.scholarshipApplication.update({
            where: { id: String(applicationId) },
            data: { status }
        });

        // Notify user
        await prisma.notification.create({
            data: {
                userId: application.applicantId,
                title: `Scholarship Application Update`,
                message: `Your application for the scholarship has been ${status.toLowerCase()}.`,
                type: status === 'APPROVED' ? 'SUCCESS' : 'INFO'
            }
        });

        res.json({ message: 'Application status updated', application });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Error updating application status', error });
    }
};

// --- User Operations ---

export const getAllScholarships = async (req: Request, res: Response): Promise<void> => {
    try {
        const scholarships = await prisma.scholarship.findMany({
            where: {
                OR: [
                    { status: 'APPROVED', publishDate: { lte: new Date() } },
                    { isActive: true } // Fallback for old data
                ]
            },
            orderBy: { deadline: 'asc' }
        });

        // Calculate if closed based on date
        const now = new Date();
        const scholarshipWithStatus = scholarships.map(s => ({
            ...s,
            isClosed: new Date(s.deadline) < now,
            applicationLink: s.applicationLink // Ensure this field is exposed
        }));

        res.json({ scholarships: scholarshipWithStatus });
    } catch (error) {
        console.error('Error fetching scholarships:', error);
        res.status(500).json({ message: 'Error fetching scholarships', error });
    }
};

import { uploadToCloudinary } from '../utils/cloudinary';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const applyForScholarship = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;
        const multerReq = req as MulterRequest;
        const {
            scholarshipId,
            coverLetter,
            // New Fields
            fatherName, motherName, familyIncome,
            classOrCourse, collegeName, scoreOrGpa,
            bankName, accountNumber, ifscCode, branchName
        } = req.body;

        // Check if file exists
        let markSheetUrl = null;
        if (multerReq.file) {
            try {
                markSheetUrl = await uploadToCloudinary(multerReq.file.buffer, 'scholarship_docs');
            } catch (uploadError) {
                console.error('File upload failed:', uploadError);
                res.status(500).json({ message: 'File upload failed' });
                return;
            }
        }

        // Check if already applied
        const existing = await prisma.scholarshipApplication.findUnique({
            where: {
                scholarshipId_applicantId: {
                    scholarshipId,
                    applicantId: userId
                }
            }
        });

        if (existing) {
            res.status(400).json({ message: 'You have already applied for this scholarship.' });
            return;
        }

        const application = await prisma.scholarshipApplication.create({
            data: {
                scholarshipId,
                applicantId: userId,
                coverLetter,

                // Personal & Family
                fatherName,
                motherName,
                familyIncome: familyIncome ? parseFloat(familyIncome) : null,

                // Education
                classOrCourse,
                collegeName,
                scoreOrGpa,

                // Bank
                bankName,
                accountNumber,
                ifscCode,
                branchName,

                // Documents
                markSheetUrl,

                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        console.error('Error applying for scholarship:', error);
        res.status(500).json({ message: 'Error submitting application', error });
    }
};

export const getMyScholarshipApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;
        const applications = await prisma.scholarshipApplication.findMany({
            where: { applicantId: userId },
            include: {
                scholarship: {
                    select: {
                        title: true,
                        amount: true,
                        deadline: true,
                        educationLevel: true
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });

        res.status(200).json({ applications });
    } catch (error) {
        console.error('Error fetching my applications:', error);
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};
