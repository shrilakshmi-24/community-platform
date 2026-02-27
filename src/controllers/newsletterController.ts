import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { uploadToCloudinary } from '../utils/cloudinary';

// Schema for Creating/Updating Newsletter
const newsletterSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(1), // Rich Text HTML
  coverImageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  linkedEventIds: z.array(z.string()).optional(),
  linkedAchievementIds: z.array(z.string()).optional(),
  linkedBusinessIds: z.array(z.string()).optional(),
  emailSubject: z.string().optional(),
  emailSummary: z.string().optional(),
});

// --- UPLOAD: Image or PDF to Cloudinary ---
export const uploadNewsletterFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const multerReq = req as any;
    if (!multerReq.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const fileType = multerReq.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    const folder = fileType === 'pdf' ? 'newsletter_pdfs' : 'newsletter_images';

    const url = await uploadToCloudinary(multerReq.file.buffer, folder);
    res.status(200).json({ url, fileType });
  } catch (error) {
    console.error('Newsletter File Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
};

// --- ADMIN: Create Newsletter (Draft) ---
export const createNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    // Parse arrays if sent as JSON strings (from multipart)
    if (typeof body.linkedEventIds === 'string') {
      try { body.linkedEventIds = JSON.parse(body.linkedEventIds); } catch { body.linkedEventIds = []; }
    }
    if (typeof body.linkedAchievementIds === 'string') {
      try { body.linkedAchievementIds = JSON.parse(body.linkedAchievementIds); } catch { body.linkedAchievementIds = []; }
    }
    if (typeof body.linkedBusinessIds === 'string') {
      try { body.linkedBusinessIds = JSON.parse(body.linkedBusinessIds); } catch { body.linkedBusinessIds = []; }
    }

    const validatedData = newsletterSchema.parse(body);

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
    const body = req.body;

    // Parse arrays if sent as JSON strings
    if (typeof body.linkedEventIds === 'string') {
      try { body.linkedEventIds = JSON.parse(body.linkedEventIds); } catch { body.linkedEventIds = []; }
    }
    if (typeof body.linkedAchievementIds === 'string') {
      try { body.linkedAchievementIds = JSON.parse(body.linkedAchievementIds); } catch { body.linkedAchievementIds = []; }
    }
    if (typeof body.linkedBusinessIds === 'string') {
      try { body.linkedBusinessIds = JSON.parse(body.linkedBusinessIds); } catch { body.linkedBusinessIds = []; }
    }

    const validatedData = newsletterSchema.parse(body);

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

// --- ADMIN: Publish Newsletter ---
export const publishNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const newsletter = await (prisma as any).newsletter.update({
      where: { id },
      data: {
        status: 'APPROVED',
        publishedAt: new Date(),
      },
    });

    res.status(200).json({ message: 'Newsletter published', newsletter });
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

    const linkedEvents = newsletter.linkedEventIds?.length > 0
      ? await prisma.event.findMany({ where: { id: { in: newsletter.linkedEventIds } } })
      : [];

    const linkedAchievements = newsletter.linkedAchievementIds?.length > 0
      ? await prisma.achievement.findMany({ where: { id: { in: newsletter.linkedAchievementIds } } })
      : [];

    const linkedBusinesses = newsletter.linkedBusinessIds?.length > 0
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
