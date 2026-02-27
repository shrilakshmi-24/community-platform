import { useState, useEffect, useRef, useCallback } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
    Box, Typography, Avatar, Button, IconButton, TextField, Chip,
    CircularProgress, Skeleton, Stack, Divider, Paper, Tooltip, Menu, MenuItem
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import WorkIcon from '@mui/icons-material/Work';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const BRAND = '#E62A4D';
const BRAND2 = '#FA8231';
const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';

const POST_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactElement }> = {
    UPDATE: { label: 'Update', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: <AutorenewIcon sx={{ fontSize: 14 }} /> },
    ANNOUNCEMENT: { label: 'Announcement', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', icon: <CampaignIcon sx={{ fontSize: 14 }} /> },
    OFFER: { label: 'Special Offer', color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: <LocalOfferIcon sx={{ fontSize: 14 }} /> },
    JOB: { label: 'Job Opening', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: <WorkIcon sx={{ fontSize: 14 }} /> },
};

interface Post {
    id: string;
    type: string;
    content: string;
    imageUrl?: string;
    jobTitle?: string;
    jobDescription?: string;
    jobContact?: string;
    jobApplyLink?: string;
    createdAt: string;
    business: { id: string; businessName: string; logoUrl?: string; category: string };
    user: { id: string; profile?: { fullName?: string; avatarUrl?: string } };
    _count: { likes: number; comments: number };
    likes: { id: string }[];
    comments: CommentData[];
}

interface CommentData {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; profile?: { fullName?: string; avatarUrl?: string } };
}

interface BusinessFeedProps {
    onViewBusiness?: (id: string) => void;
}

const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

// ─── Single Post Card ────────────────────────────────────────────────────
const PostCard = ({ post, currentUserId, onDelete, onViewBusiness }: {
    post: Post;
    currentUserId?: string;
    onDelete: (id: string) => void;
    onViewBusiness?: (id: string) => void;
}) => {
    const [liked, setLiked] = useState(post.likes.length > 0);
    const [likeCount, setLikeCount] = useState(post._count.likes);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentData[]>(post.comments);
    const [commentText, setCommentText] = useState('');
    const [commentCount, setCommentCount] = useState(post._count.comments);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const typeConfig = POST_TYPE_CONFIG[post.type] || POST_TYPE_CONFIG.UPDATE;

    const handleLike = async () => {
        const prev = liked;
        setLiked(!liked);
        setLikeCount(c => liked ? c - 1 : c + 1);
        try {
            await client.post(`/business-engagement/posts/${post.id}/like`);
        } catch {
            setLiked(prev);
            setLikeCount(c => liked ? c + 1 : c - 1);
        }
    };

    const handleShowComments = async () => {
        setShowComments(s => !s);
        if (!commentsLoaded) {
            const { data } = await client.get(`/business-engagement/posts/${post.id}/comments`);
            setComments(data.comments);
            setCommentsLoaded(true);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        const { data } = await client.post(`/business-engagement/posts/${post.id}/comments`, { content: commentText });
        setComments(c => [...c, data.comment]);
        setCommentCount(c => c + 1);
        setCommentText('');
    };

    const handleDeleteComment = async (commentId: string) => {
        await client.delete(`/business-engagement/comments/${commentId}`);
        setComments(c => c.filter(x => x.id !== commentId));
        setCommentCount(c => c - 1);
    };

    const isOwner = post.user.id === currentUserId;

    return (
        <Paper sx={{
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px -4px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            transition: 'box-shadow 0.25s',
            '&:hover': { boxShadow: '0 8px 24px -8px rgba(0,0,0,0.1)' }
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, pb: 2 }}>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', flex: 1 }}
                    onClick={() => onViewBusiness?.(post.business.id)}
                >
                    <Avatar
                        src={post.business.logoUrl}
                        sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: 'rgba(230,42,77,0.1)' }}
                    >
                        <BusinessIcon sx={{ color: BRAND }} />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1.2 }}>
                            {post.business.businessName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                            <Chip
                                label={post.business.category}
                                size="small"
                                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#f1f5f9', color: '#64748b' }}
                            />
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>· {timeAgo(post.createdAt)}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                        icon={typeConfig.icon}
                        label={typeConfig.label}
                        size="small"
                        sx={{
                            bgcolor: typeConfig.bg,
                            color: typeConfig.color,
                            fontWeight: 700, fontSize: '0.7rem',
                            border: `1px solid ${typeConfig.color}22`,
                            height: 22,
                            '& .MuiChip-icon': { color: `${typeConfig.color} !important` }
                        }}
                    />
                    {isOwner && (
                        <>
                            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: '#94a3b8' }}>
                                <MoreHorizIcon fontSize="small" />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                                <MenuItem onClick={() => { onDelete(post.id); setAnchorEl(null); }} sx={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 700 }}>
                                    Delete Post
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ px: 2.5, pb: post.imageUrl ? 0 : 2 }}>
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </Typography>
            </Box>

            {/* Job card */}
            {post.type === 'JOB' && post.jobTitle && (
                <Box sx={{
                    mx: 2.5, my: 2, p: 2.5, borderRadius: '14px',
                    bgcolor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WorkIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                        <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#92400e' }}>
                            {post.jobTitle}
                        </Typography>
                    </Box>
                    {post.jobDescription && (
                        <Typography variant="body2" sx={{ color: '#78350f', mb: 1.5, lineHeight: 1.6 }}>
                            {post.jobDescription}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {post.jobContact && (
                            <Chip size="small" label={`Contact: ${post.jobContact}`} sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#92400e', fontWeight: 700 }} />
                        )}
                        {post.jobApplyLink && (
                            <Chip
                                size="small" label="Apply Now" icon={<OpenInNewIcon sx={{ fontSize: '12px !important' }} />}
                                component="a" href={post.jobApplyLink} target="_blank" clickable
                                sx={{ bgcolor: '#f59e0b', color: 'white', fontWeight: 700, '& .MuiChip-icon': { color: 'white !important' } }}
                            />
                        )}
                    </Box>
                </Box>
            )}

            {/* Image */}
            {post.imageUrl && (
                <Box sx={{ mt: 2 }}>
                    <Box component="img" src={post.imageUrl} alt="post" sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
                </Box>
            )}

            {/* Actions */}
            <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title={liked ? 'Unlike' : 'Like'}>
                    <IconButton
                        size="small"
                        onClick={handleLike}
                        sx={{ color: liked ? BRAND : '#94a3b8', transition: 'all 0.2s', '&:hover': { color: BRAND, transform: 'scale(1.1)' } }}
                    >
                        {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
                <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b', mr: 1.5 }}>{likeCount}</Typography>

                <IconButton size="small" onClick={handleShowComments} sx={{ color: showComments ? '#3b82f6' : '#94a3b8' }}>
                    <ChatBubbleOutlineIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b' }}>{commentCount}</Typography>
            </Box>

            {/* Comments section */}
            {showComments && (
                <Box sx={{ px: 2.5, pb: 2.5, borderTop: '1px solid #f1f5f9' }}>
                    {/* Existing comments */}
                    {comments.length > 0 && (
                        <Stack spacing={1.5} sx={{ pt: 2, pb: 1.5 }}>
                            {comments.map(c => (
                                <Box key={c.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                    <Avatar src={c.user.profile?.avatarUrl} sx={{ width: 30, height: 30, fontSize: '0.75rem', bgcolor: BRAND, flexShrink: 0 }}>
                                        {c.user.profile?.fullName?.[0] || '?'}
                                    </Avatar>
                                    <Box sx={{ flex: 1, bgcolor: '#f8fafc', borderRadius: '12px', p: 1.5, pr: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" fontWeight={800} color="#0f172a">{c.user.profile?.fullName || 'Member'}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="caption" color="#94a3b8">{timeAgo(c.createdAt)}</Typography>
                                                {c.user.id === currentUserId && (
                                                    <IconButton size="small" onClick={() => handleDeleteComment(c.id)} sx={{ color: '#ef4444', p: 0.25, ml: 0.5, '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
                                                        <Typography variant="caption" fontSize="0.65rem">×</Typography>
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="#475569" sx={{ mt: 0.25, lineHeight: 1.5 }}>{c.content}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    )}

                    {/* Add comment */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', pt: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px', bgcolor: '#f8fafc',
                                    '& fieldset': { borderColor: '#e2e8f0' },
                                    '&.Mui-focused fieldset': { borderColor: BRAND }
                                }
                            }}
                        />
                        <IconButton
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            sx={{
                                bgcolor: commentText.trim() ? BRAND : '#f1f5f9',
                                color: commentText.trim() ? 'white' : '#94a3b8',
                                borderRadius: '12px', p: 1.2,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: commentText.trim() ? '#c41e3a' : '#f1f5f9' },
                                '&.Mui-disabled': { bgcolor: '#f1f5f9', color: '#cbd5e1' }
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

// ─── Business Feed ─────────────────────────────────────────────────────────
const BusinessFeed = ({ onViewBusiness }: BusinessFeedProps) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [followedCount, setFollowedCount] = useState(0);

    const fetchFeed = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const { data } = await client.get(`/business-engagement/feed?page=${p}`);
            setPosts(prev => p === 1 ? data.posts : [...prev, ...data.posts]);
            setHasMore(data.hasMore);
            setFollowedCount(data.followedCount);
        } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchFeed(1); }, [fetchFeed]);

    const handleDelete = async (id: string) => {
        await client.delete(`/business-engagement/posts/${id}`);
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchFeed(next);
    };

    if (loading && posts.length === 0) {
        return (
            <Stack spacing={3}>
                {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={240} sx={{ borderRadius: '20px' }} />)}
            </Stack>
        );
    }

    if (followedCount === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10, px: 4 }}>
                <Box sx={{ fontSize: 72, mb: 2 }}>🏪</Box>
                <Typography variant="h5" fontWeight={800} color="#0f172a" gutterBottom>No businesses followed yet</Typography>
                <Typography variant="body1" color="#64748b" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                    Follow businesses from the directory to see their posts, updates, offers, and job openings here.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => onViewBusiness?.('')}
                    sx={{ background: BRAND_GRADIENT, borderRadius: '14px', fontWeight: 700, px: 4 }}
                >
                    Browse Business Directory
                </Button>
            </Box>
        );
    }

    if (posts.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Box sx={{ fontSize: 64, mb: 2 }}>📭</Box>
                <Typography variant="h6" fontWeight={700} color="#64748b">No posts yet from followed businesses</Typography>
                <Typography variant="body2" color="#94a3b8">Check back later for updates from {followedCount} followed {followedCount === 1 ? 'business' : 'businesses'}.</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="h6" fontWeight={800} color="#0f172a">Your Business Feed</Typography>
                <Chip label={`${followedCount} following`} size="small" sx={{ bgcolor: 'rgba(230,42,77,0.08)', color: BRAND, fontWeight: 700 }} />
            </Box>

            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user?.userId}
                    onDelete={handleDelete}
                    onViewBusiness={onViewBusiness}
                />
            ))}

            {hasMore && (
                <Box sx={{ textAlign: 'center', pt: 2 }}>
                    <Button
                        onClick={loadMore}
                        disabled={loading}
                        variant="outlined"
                        sx={{ borderRadius: '12px', fontWeight: 700, borderColor: '#e2e8f0', color: '#64748b' }}
                    >
                        {loading ? <CircularProgress size={18} /> : 'Load More'}
                    </Button>
                </Box>
            )}
        </Stack>
    );
};

export { PostCard };
export default BusinessFeed;
