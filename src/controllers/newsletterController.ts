import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
// @ts-ignore
import nodemailer from 'nodemailer';
import prisma from '../config/db';

// const prisma = new PrismaClient(); // Removed local instance

// Schema for Creating/Updating Newsletter
const newsletterSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10), // Rich Text HTML
  coverImageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  linkedEventIds: z.array(z.string()).optional(),
  linkedAchievementIds: z.array(z.string()).optional(),
  linkedBusinessIds: z.array(z.string()).optional(),
  emailSubject: z.string().optional(),
  emailSummary: z.string().optional(),
});

// --- ADMIN: Create Newsletter (Draft) ---
export const createNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = newsletterSchema.parse(req.body);

    const newsletter = await (prisma as any).newsletter.create({
      data: {
        ...validatedData,
        status: 'DRAFT',
      },
    });

    res.status(201).json({ message: 'Newsletter draft created', newsletter });
  } catch (error) {
    console.error('Create Newsletter Error:', error);
    res.status(500).json({ error: 'Failed to create newsletter' });
  }
};

// --- ADMIN: Update Newsletter ---
export const updateNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = newsletterSchema.parse(req.body);

    const newsletter = await (prisma as any).newsletter.update({
      where: { id },
      data: validatedData,
    });

    res.status(200).json({ message: 'Newsletter updated', newsletter });
  } catch (error) {
    console.error('Update Newsletter Error:', error);
    res.status(500).json({ error: 'Failed to update newsletter' });
  }
};

// --- ADMIN: Publish Newsletter & Broadcast Email ---
export const publishNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Update Status
    const newsletter = await (prisma as any).newsletter.update({
      where: { id },
      data: {
        status: 'APPROVED', // Using 'APPROVED' as 'PUBLISHED' based on Enum
        publishedAt: new Date(),
      },
    });

    // 2. Broadcast Email (Mocking for now, can implement actual logic later)
    if (newsletter.emailSubject && newsletter.emailSummary) {
      // In a real scenario, we would fetch all subscribed users and send emails.
      console.log(`[Email Broadcast] Sending "${newsletter.emailSubject}" to all members...`);
      // Simulate async email sending
      setTimeout(() => {
        console.log(`[Email Broadcast] Sent successfully.`);
      }, 2000);
    }

    res.status(200).json({ message: 'Newsletter published and broadcast initiated', newsletter });
  } catch (error) {
    console.error('Publish Newsletter Error:', error);
    res.status(500).json({ error: 'Failed to publish newsletter' });
  }
};

// --- PUBLIC/USER: Get All Newsletters ---
export const getNewsletters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const where: any = {};

    // If public request (not admin), only show APPROVED
    // For simplicity, let's assume if status is passed, use it, else default to all for admin or APPROVED for public
    if (status) {
      where.status = status;
    }

    const newsletters = await (prisma as any).newsletter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ newsletters });
  } catch (error) {
    console.error('Get Newsletters Error:', error);
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
};

// --- PUBLIC/USER: Get Newsletter By ID ---
export const getNewsletterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const newsletter = await (prisma as any).newsletter.findUnique({
      where: { id },
    });

    if (!newsletter) {
      res.status(404).json({ error: 'Newsletter not found' });
      return;
    }

    // Fetch linked content details manually since we store IDs
    // In a real app, strict relations or `include` would be better if we migrated to relations
    const linkedEvents = newsletter.linkedEventIds.length > 0
      ? await prisma.event.findMany({ where: { id: { in: newsletter.linkedEventIds } } })
      : [];

    const linkedAchievements = newsletter.linkedAchievementIds.length > 0
      ? await prisma.achievement.findMany({ where: { id: { in: newsletter.linkedAchievementIds } } })
      : [];

    const linkedBusinesses = newsletter.linkedBusinessIds.length > 0
      ? await prisma.businessListing.findMany({ where: { id: { in: newsletter.linkedBusinessIds } } })
      : [];

    res.status(200).json({
      newsletter,
      linkedContent: {
        events: linkedEvents,
        achievements: linkedAchievements,
        businesses: linkedBusinesses
      }
    });

  } catch (error) {
    console.error('Get Newsletter Detail Error:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter details' });
  }
};

// --- ADMIN: Delete Newsletter ---
export const deleteNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await (prisma as any).newsletter.delete({ where: { id } });
    res.status(200).json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
};
