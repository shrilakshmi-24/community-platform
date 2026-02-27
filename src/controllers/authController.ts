import { Request, Response } from 'express';
import prisma from '../config/db';
import { generateOTP, sendOTP } from '../utils/otpService';
import { generateTokens } from '../utils/jwt';

// ── Dev admin credentials (override in production via env) ─────────────────
const DEV_ADMINS: Record<string, { password: string; role: 'ADMIN' | 'SUPER_ADMIN' }> = {
    superadmin: { password: process.env.SUPER_ADMIN_PASSWORD || 'superadmin123', role: 'SUPER_ADMIN' },
    admin: { password: process.env.ADMIN_PASSWORD || 'admin123', role: 'ADMIN' },
};

// ── Member OTP Login ────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber: mobileInput } = req.body;
        const mobileNumber = mobileInput?.toString().trim();

        if (!mobileNumber) {
            res.status(400).json({ message: 'Mobile number is required' });
            return;
        }

        const otp = generateOTP();

        let user = await prisma.user.findUnique({ where: { mobileNumber } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    mobileNumber,
                    role: 'GUEST',
                    status: 'PENDING',
                    otpHash: otp,
                    otpExpires: new Date(Date.now() + 5 * 60 * 1000)
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
            res.status(200).json({ message: 'OTP sent successfully', otp: otp }); // otp returned for demo only
        } catch (smsError) {
            console.warn('Failed to send SMS:', smsError);
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

// ── Member OTP Verify ───────────────────────────────────────────────────────
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
            include: {
                profile: true,
                businessListings: {
                    where: { status: 'APPROVED' },
                    select: { id: true }
                }
            }
        });

        // If using development OTP and user doesn't exist, create them
        if (isDevelopmentOtp && !user) {
            user = await prisma.user.create({
                data: {
                    mobileNumber,
                    role: 'MEMBER',
                    status: 'ACTIVE'
                },
                include: {
                    profile: true,
                    businessListings: true
                }
            });
        }

        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        if (!isDevelopmentOtp && (user.otpHash !== otp || !user.otpExpires || user.otpExpires < new Date())) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (!isDevelopmentOtp) {
            await prisma.user.update({
                where: { id: user.id },
                data: { otpHash: null, otpExpires: null }
            });
        }

        const isBusinessOwner = user.businessListings && user.businessListings.length > 0;
        const tokens = generateTokens(user.id, user.role, isBusinessOwner);
        const isProfileComplete = !!(user.profile && user.profile.fullName);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                role: user.role,
                status: user.status,
                isBusinessOwner
            },
            isProfileComplete,
            ...tokens
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// ── Admin Credential Login → returns JWT with ADMIN or SUPER_ADMIN role ─────
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const devAdmin = DEV_ADMINS[username.toLowerCase()];

        if (!devAdmin || devAdmin.password !== password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Find or create a synthetic DB user for this admin (keyed by username)
        const syntheticMobile = `admin_${username.toLowerCase()}`;
        let user = await prisma.user.findUnique({ where: { mobileNumber: syntheticMobile } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    mobileNumber: syntheticMobile,
                    role: devAdmin.role,
                    status: 'ACTIVE',
                }
            });
        } else if (user.role !== devAdmin.role) {
            // Keep role in sync with DEV_ADMINS config
            user = await prisma.user.update({
                where: { id: user.id },
                data: { role: devAdmin.role }
            });
        }

        const tokens = generateTokens(user.id, user.role, false);

        res.status(200).json({
            message: 'Admin login successful',
            user: {
                id: user.id,
                username,
                role: user.role,
                status: user.status,
            },
            ...tokens
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
