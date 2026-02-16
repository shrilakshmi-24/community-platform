
import { Request, Response } from 'express';
import prisma from '../config/db';
import { generateOTP, sendOTP } from '../utils/otpService';
import { generateTokens } from '../utils/jwt';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber: mobileInput } = req.body;
        const mobileNumber = mobileInput?.toString().trim();

        if (!mobileNumber) {
            res.status(400).json({ message: 'Mobile number is required' });
            return;
        }

        // In a real app, validate mobile number format

        const otp = generateOTP();
        // In production: store hash(otp) in DB associated with mobileNumber
        // For MVP/Demo: storing OTP directly in user record (simplified)
        // NOTE: This is not production secure for OTP storage. 
        // Ideally use a separate OTP table or Redis with expiration.

        // Check if user exists, if not create placeholder
        let user = await prisma.user.findUnique({ where: { mobileNumber } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    mobileNumber,
                    role: 'MEMBER',
                    status: 'ACTIVE',
                    otpHash: otp, // In prod, hash this
                    otpExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
                }
            });
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpHash: otp,
                    otpExpires: new Date(Date.now() + 5 * 60 * 1000)
                }
            });
        }

        try {
            await sendOTP(mobileNumber, otp);
            res.status(200).json({ message: 'OTP sent successfully', otp: otp }); // Returning OTP for demo purposes ONLY
        } catch (smsError) {
            console.warn('Failed to send SMS:', smsError);
            // Return success anyway to allow development/demo flow
            res.status(200).json({
                message: 'OTP generation successful (SMS failed, check console)',
                otp: otp
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber: mobileInput, otp: otpInput } = req.body;
        const mobileNumber = mobileInput?.toString().trim();
        const otp = otpInput?.toString().trim();

        if (!mobileNumber || !otp) {
            res.status(400).json({ message: 'Mobile number and OTP are required' });
            return;
        }

        // Development bypass: Accept "123456" as valid OTP
        const isDevelopmentOtp = otp === '123456';

        let user = await prisma.user.findUnique({
            where: { mobileNumber },
            include: { profile: true } // Include profile to check status
        });

        // If using development OTP and user doesn't exist, create them
        if (isDevelopmentOtp && !user) {
            user = await prisma.user.create({
                data: {
                    mobileNumber,
                    role: 'MEMBER',
                    status: 'ACTIVE'
                },
                include: { profile: true }
            });
        }

        // Validate OTP (either development OTP or stored OTP)
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        if (!isDevelopmentOtp && (user.otpHash !== otp || !user.otpExpires || user.otpExpires < new Date())) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        // Clear OTP if it was a real OTP (not development bypass)
        if (!isDevelopmentOtp) {
            await prisma.user.update({
                where: { id: user.id },
                data: { otpHash: null, otpExpires: null }
            });
        }

        const tokens = generateTokens(user.id, user.role);

        // Check if profile is complete (basic check: has profile record and a name)
        const isProfileComplete = !!(user.profile && user.profile.fullName);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                role: user.role,
                status: user.status
            },
            isProfileComplete,
            ...tokens
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
