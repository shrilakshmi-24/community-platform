import { Request, Response } from 'express';
import prisma from '../config/db';

export const recordDonation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount, donationId, paymentMethod, paymentStatus, transactionId } = req.body;
        const userId = (req as any).user?.userId;

        // Default to a General Fund campaign if no ID provided
        let targetDonationId = donationId;
        if (!targetDonationId) {
            let generalFund = await prisma.donation.findFirst({
                where: { title: 'General Community Fund' }
            });

            if (!generalFund) {
                generalFund = await prisma.donation.create({
                    data: {
                        title: 'General Community Fund',
                        description: 'General fund for community welfare and events.',
                        bankDetails: 'City Community Bank, Acc: 1234567890',
                        isActive: true
                    }
                });
            }
            targetDonationId = generalFund.id;
        }

        const transaction = await prisma.donationTransaction.create({
            data: {
                donationId: targetDonationId,
                donorId: userId, // Optional, linked if logged in
                donorName: (req as any).user ? undefined : 'Guest', // Could be enhanced
                amount: parseFloat(amount),
                paymentMethod: paymentMethod || 'ONLINE',
                paymentStatus: paymentStatus || 'SUCCESS', // Simulating success for now
                transactionId: transactionId || `TXN-${Date.now()}`
            }
        });

        // Update collected amount
        await prisma.donation.update({
            where: { id: targetDonationId },
            data: {
                collectedAmount: { increment: parseFloat(amount) }
            }
        });

        res.status(201).json({ message: 'Donation recorded successfully', transaction });
    } catch (error) {
        console.error('Error recording donation:', error);
        res.status(500).json({ message: 'Error recording donation', error: error instanceof Error ? error.message : String(error) });
    }
};
