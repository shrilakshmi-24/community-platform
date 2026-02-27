import { Request, Response } from 'express';
import prisma from '../config/db';
import { uploadToCloudinary } from '../utils/cloudinary';

// ─── Types ───────────────────────────────────────────────────────────────
const postInclude = {
    business: { select: { id: true, businessName: true, logoUrl: true, category: true } },
    user: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } },
    _count: { select: { likes: true, comments: true } },
};

// ─── FOLLOW / UNFOLLOW ────────────────────────────────────────────────────

export const followBusiness = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const { businessId } = req.params;

    try {
        const existing = await (prisma as any).businessFollow.findUnique({
            where: { userId_businessId: { userId, businessId } }
        });

        if (existing) {
            // Toggle: unfollow
            await (prisma as any).businessFollow.delete({
                where: { userId_businessId: { userId, businessId } }
            });
            res.json({ following: false, message: 'Unfollowed' });
        } else {
            // Follow
            await (prisma as any).businessFollow.create({
                data: { userId, businessId }
            });
            res.json({ following: true, message: 'Following' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Failed to toggle follow' });
    }
};

export const getFollowStatus = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const { businessId } = req.params;

    try {
        const follow = await (prisma as any).businessFollow.findUnique({
            where: { userId_businessId: { userId, businessId } }
        });
        const count = await (prisma as any).businessFollow.count({ where: { businessId } });
        res.json({ following: !!follow, followerCount: count });
    } catch (e) {
        res.status(500).json({ error: 'Failed to get follow status' });
    }
};

// ─── BUSINESS FEED ────────────────────────────────────────────────────────

export const getBusinessFeed = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 15;

    try {
        // Get followed businessIds
        const follows = await (prisma as any).businessFollow.findMany({
            where: { userId },
            select: { businessId: true }
        });
        const businessIds = follows.map((f: any) => f.businessId);

        const posts = await (prisma as any).businessPost.findMany({
            where: { businessId: { in: businessIds }, isDeleted: false },
            include: {
                ...postInclude,
                likes: { where: { userId }, select: { id: true } },
                comments: {
                    where: { isDeleted: false },
                    orderBy: { createdAt: 'asc' },
                    take: 3,
                    include: {
                        user: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        res.json({
            posts,
            hasMore: posts.length === limit,
            followedCount: businessIds.length
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
};

// ─── POSTS ────────────────────────────────────────────────────────────────

export const getBusinessPosts = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const { businessId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;

    try {
        const posts = await (prisma as any).businessPost.findMany({
            where: { businessId, isDeleted: false },
            include: {
                ...postInclude,
                likes: { where: { userId }, select: { id: true } },
                comments: {
                    where: { isDeleted: false },
                    orderBy: { createdAt: 'asc' },
                    take: 3,
                    include: {
                        user: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        res.json({ posts, hasMore: posts.length === limit });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

export const createBusinessPost = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const { businessId } = req.params;

    try {
        // Verify ownership
        const business = await prisma.businessListing.findFirst({
            where: { id: String(businessId), userId: String(userId) }
        });
        if (!business) {
            res.status(403).json({ error: 'Only the business owner can post' });
            return;
        }

        const { type, content, jobTitle, jobDescription, jobContact, jobApplyLink } = req.body;
        const multerReq = req as any;

        let imageUrl: string | undefined;
        if (multerReq.file) {
            imageUrl = await uploadToCloudinary(multerReq.file.buffer, 'business_posts');
        }

        const post = await (prisma as any).businessPost.create({
            data: {
                businessId,
                userId,
                type: type || 'UPDATE',
                content,
                imageUrl,
                jobTitle: type === 'JOB' ? jobTitle : null,
                jobDescription: type === 'JOB' ? jobDescription : null,
                jobContact: type === 'JOB' ? jobContact : null,
                jobApplyLink: type === 'JOB' ? jobApplyLink : null,
            },
            include: postInclude,
        });

        res.status(201).json({ post });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

export const updateBusinessPost = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const { postId } = req.params;

    try {
        const post = await (prisma as any).businessPost.findUnique({ where: { id: postId } });
        if (!post || post.userId !== userId) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        const { content, type, jobTitle, jobDescription, jobContact, jobApplyLink } = req.body;

        const updated = await (prisma as any).businessPost.update({
            where: { id: postId },
            data: { content, type, jobTitle, jobDescription, jobContact, jobApplyLink },
            include: postInclude,
        });

        res.json({ post: updated });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

export const deleteBusinessPost = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { postId } = req.params;

    try {
        const post = await (prisma as any).businessPost.findUnique({ where: { id: postId } });
        const isOwner = post?.userId === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

        if (!post || (!isOwner && !isAdmin)) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        await (prisma as any).businessPost.update({
            where: { id: postId },
            data: { isDeleted: true }
        });

        res.json({ message: 'Post deleted' });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

// ─── LIKES ────────────────────────────────────────────────────────────────

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const { postId } = req.params;

    try {
        const existing = await (prisma as any).businessPostLike.findUnique({
            where: { postId_userId: { postId, userId } }
        });

        if (existing) {
            await (prisma as any).businessPostLike.delete({
                where: { postId_userId: { postId, userId } }
            });
        } else {
            await (prisma as any).businessPostLike.create({ data: { postId, userId } });
        }

        const count = await (prisma as any).businessPostLike.count({ where: { postId } });
        res.json({ liked: !existing, count });
    } catch (e) {
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

// ─── COMMENTS ─────────────────────────────────────────────────────────────

export const getComments = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const comments = await (prisma as any).businessPostComment.findMany({
            where: { postId, isDeleted: false },
            include: {
                user: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } }
            },
            orderBy: { createdAt: 'asc' },
        });
        res.json({ comments });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        res.status(400).json({ error: 'Comment cannot be empty' });
        return;
    }

    try {
        const comment = await (prisma as any).businessPostComment.create({
            data: { postId, userId, content: content.trim() },
            include: {
                user: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } }
            }
        });
        res.status(201).json({ comment });
    } catch (e) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { commentId } = req.params;

    try {
        const comment = await (prisma as any).businessPostComment.findUnique({ where: { id: commentId } });
        const isOwner = comment?.userId === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

        if (!comment || (!isOwner && !isAdmin)) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        await (prisma as any).businessPostComment.update({
            where: { id: commentId },
            data: { isDeleted: true }
        });
        res.json({ message: 'Comment deleted' });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};
