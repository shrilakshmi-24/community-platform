import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
    Container, Typography, Box, Card, CardContent, Button, Chip,
    TextField, InputAdornment, Skeleton, GridLegacy as Grid, Dialog, DialogContent,
    IconButton, Tab, Tabs, Avatar, Stack, Divider, Snackbar, Alert, CircularProgress, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessFeed from '../components/business/BusinessFeed';
import BusinessPostCreator from '../components/business/BusinessPostCreator';
import { PostCard } from '../components/business/BusinessFeed';

const BRAND = '#E62A4D';
const BRAND2 = '#FA8231';
const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

interface Business {
    id: string;
    businessName: string;
    category: string;
    description: string;
    address: string;
    contactPhone?: string;
    workingHours?: string;
    logoUrl?: string;
    ownerName?: string;
    contactEmail?: string;
    website?: string;
    userId: string;
}

interface BusinessProfileProps {
    business: Business;
    currentUserId?: string;
    onBack: () => void;
}

// ─── Business Profile View ─────────────────────────────────────────────────
const BusinessProfile = ({ business, currentUserId, onBack }: BusinessProfileProps) => {
    const [following, setFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [loadingFollow, setLoadingFollow] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);

    const isOwner = business.userId === currentUserId;

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const { data } = await client.get(`/business-engagement/follow/${business.id}/status`);
                setFollowing(data.following);
                setFollowerCount(data.followerCount);
            } catch { } finally { setLoadingFollow(false); }
        };
        const loadPosts = async () => {
            try {
                const { data } = await client.get(`/business-engagement/${business.id}/posts`);
                setPosts(data.posts);
            } catch { } finally { setPostsLoading(false); }
        };
        loadStatus();
        loadPosts();
    }, [business.id]);

    const handleFollow = async () => {
        const prev = following;
        setFollowing(!following);
        setFollowerCount(c => following ? c - 1 : c + 1);
        try {
            await client.post(`/business-engagement/follow/${business.id}`);
        } catch {
            setFollowing(prev);
            setFollowerCount(c => following ? c + 1 : c - 1);
        }
    };

    const handlePostCreated = (post: any) => {
        setPosts(prev => [post, ...prev]);
    };

    const handleDeletePost = async (id: string) => {
        await client.delete(`/business-engagement/posts/${id}`);
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{
                background: BRAND_GRADIENT,
                pt: { xs: 4, md: 6 }, pb: 10,
                position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, fontWeight: 700, '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        All Businesses
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Profile card overlapping the header */}
                <Paper sx={{
                    mt: -7, borderRadius: '24px', p: { xs: 3, md: 4 },
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                    mb: 4
                }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Logo */}
                        <Box sx={{
                            width: { xs: 72, md: 90 }, height: { xs: 72, md: 90 },
                            borderRadius: '20px', bgcolor: 'rgba(230,42,77,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', border: '3px solid white',
                            boxShadow: '0 8px 20px -5px rgba(0,0,0,0.1)', flexShrink: 0,
                        }}>
                            {business.logoUrl
                                ? <img src={business.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <BusinessIcon sx={{ fontSize: 40, color: BRAND, opacity: 0.7 }} />
                            }
                        </Box>

                        {/* Info */}
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                            <Chip label={business.category} size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 700, mb: 1 }} />
                            <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1px', mb: 0.5, lineHeight: 1.2 }}>
                                {business.businessName}
                            </Typography>
                            {business.ownerName && (
                                <Typography variant="body2" color="#64748b" fontWeight={600}>
                                    by {business.ownerName}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <PeopleIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                <Typography variant="body2" fontWeight={700} color="#64748b">
                                    {followerCount} follower{followerCount !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Follow */}
                        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                            {!isOwner && (
                                <Button
                                    variant={following ? 'outlined' : 'contained'}
                                    startIcon={following ? <FavoriteIcon sx={{ color: BRAND }} /> : <FavoriteBorderIcon />}
                                    disabled={loadingFollow}
                                    onClick={handleFollow}
                                    sx={{
                                        borderRadius: '14px', fontWeight: 800, px: 3,
                                        ...(following
                                            ? { borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: 'rgba(230,42,77,0.05)' } }
                                            : { background: BRAND_GRADIENT, color: 'white', boxShadow: '0 6px 16px -4px rgba(230,42,77,0.4)', '&:hover': { opacity: 0.9 } }
                                        )
                                    }}
                                >
                                    {loadingFollow ? <CircularProgress size={16} /> : following ? 'Following' : 'Follow'}
                                </Button>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Details grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                        {[
                            { icon: <LocationOnIcon />, label: 'Address', value: business.address },
                            business.contactPhone && { icon: <PhoneIcon />, label: 'Phone', value: business.contactPhone },
                            business.contactEmail && { icon: <EmailIcon />, label: 'Email', value: business.contactEmail },
                            business.workingHours && { icon: <AccessTimeIcon />, label: 'Hours', value: business.workingHours },
                            business.website && { icon: <LanguageIcon />, label: 'Website', value: business.website, link: true },
                        ].filter(Boolean).map((item: any, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: BRAND2 }}>
                                    {item.icon}
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="#94a3b8" fontWeight={700} display="block">{item.label}</Typography>
                                    {item.link ? (
                                        <Typography variant="body2" fontWeight={700} color={BRAND} component="a" href={item.value} target="_blank" sx={{ textDecoration: 'none' }}>{item.value}</Typography>
                                    ) : (
                                        <Typography variant="body2" fontWeight={700} color="#0f172a">{item.value}</Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {business.description && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8 }}>
                                {business.description}
                            </Typography>
                        </>
                    )}
                </Paper>

                {/* Posts section */}
                <Box sx={{ maxWidth: 680, mx: 'auto', pb: 8 }}>
                    <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 3 }}>
                        {isOwner ? 'Manage Posts' : 'Posts & Updates'}
                    </Typography>

                    {isOwner && (
                        <BusinessPostCreator
                            businessId={business.id}
                            businessName={business.businessName}
                            logoUrl={business.logoUrl}
                            onPostCreated={handlePostCreated}
                        />
                    )}

                    {postsLoading ? (
                        <Stack spacing={3}>
                            {[1, 2].map(i => <Skeleton key={i} variant="rectangular" height={180} sx={{ borderRadius: '20px' }} />)}
                        </Stack>
                    ) : posts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed #e2e8f0', borderRadius: '20px' }}>
                            <Box sx={{ fontSize: 48, mb: 2 }}>📝</Box>
                            <Typography variant="h6" fontWeight={700} color="#94a3b8">
                                {isOwner ? 'No posts yet. Share your first update!' : 'No posts yet from this business.'}
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={3}>
                            {posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    currentUserId={currentUserId}
                                    onDelete={handleDeletePost}
                                />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

// ─── Main Business List + Tabs ─────────────────────────────────────────────
const BusinessList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tab, setTab] = useState(0); // 0 = Directory, 1 = My Feed
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [profileBusiness, setProfileBusiness] = useState<Business | null>(null);

    const categories = ['All', 'Retail', 'IT Services', 'Food & Beverage', 'Interior Design', 'Health & Fitness', 'Education', 'Other'];

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await client.get('/business/all');
                setBusinesses(data.listings);
            } catch { } finally { setLoading(false); }
        };
        fetch();
    }, []);

    const handleShare = async (business: Business) => {
        const text = `🏢 ${business.businessName} (${business.category})\n📍 ${business.address}${business.contactPhone ? `\n📞 ${business.contactPhone}` : ''}`;
        if (navigator.share) {
            try { await navigator.share({ title: business.businessName, text }); } catch { }
        } else {
            navigator.clipboard.writeText(text);
        }
    };

    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Business profile view
    if (profileBusiness) {
        return (
            <BusinessProfile
                business={profileBusiness}
                currentUserId={user?.userId}
                onBack={() => setProfileBusiness(null)}
            />
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', pb: 12, fontFamily: "'Inter', sans-serif" }}>
            {/* Hero */}
            <Box sx={{
                position: 'relative',
                pt: { xs: 8, md: 10 }, pb: { xs: 8, md: 10 },
                background: 'radial-gradient(120% 100% at 50% -10%, rgba(250,130,49,0.08) 0%, rgba(255,255,255,1) 100%)',
                overflow: 'hidden', mb: 2
            }}>
                <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 3 }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <Chip label="SERVICES & STORES" sx={{ background: BRAND_GRADIENT_LIGHT, color: BRAND, fontWeight: 800, mb: 2, borderRadius: '8px', border: '1px solid rgba(230,42,77,0.2)', letterSpacing: '1px' }} />
                            <Typography variant="h2" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1.5px', mb: 2 }}>
                                Business Hub
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, maxWidth: 560, lineHeight: 1.6 }}>
                                Discover, follow, and engage with community businesses. Get updates, offers, and job openings in your feed.
                            </Typography>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/business/create')}
                                sx={{
                                    background: BRAND_GRADIENT, color: 'white', fontWeight: 800,
                                    px: 4, py: 1.5, borderRadius: '16px', boxShadow: BRAND_SHADOW,
                                    textTransform: 'none', '&:hover': { transform: 'translateY(-3px)', opacity: 0.92 }
                                }}
                            >
                                List Your Business
                            </Button>
                        </motion.div>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{
                        bgcolor: 'white', borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px -4px rgba(0,0,0,0.06)',
                        p: 1,
                        display: 'inline-flex', gap: 1, mb: 3
                    }}>
                        {[
                            { label: 'Directory', icon: <StoreIcon sx={{ fontSize: 18 }} /> },
                            { label: 'My Feed', icon: <DynamicFeedIcon sx={{ fontSize: 18 }} /> },
                        ].map((t, i) => (
                            <Button
                                key={i}
                                startIcon={t.icon}
                                onClick={() => setTab(i)}
                                sx={{
                                    borderRadius: '14px', fontWeight: 800, px: 3, py: 1,
                                    textTransform: 'none', fontSize: '0.95rem',
                                    ...(tab === i
                                        ? { background: BRAND_GRADIENT, color: 'white', boxShadow: '0 4px 12px -3px rgba(230,42,77,0.4)' }
                                        : { color: '#64748b', '&:hover': { bgcolor: '#f8fafc' } }
                                    )
                                }}
                            >
                                {t.label}
                            </Button>
                        ))}
                    </Box>

                    {/* Search & Filter (Directory only) */}
                    {tab === 0 && (
                        <Box sx={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                            <TextField
                                fullWidth
                                placeholder="Search by business name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: BRAND2 }} /></InputAdornment>,
                                    sx: { bgcolor: 'white', borderRadius: '16px', '& fieldset': { border: '1px solid #e2e8f0' }, '&.Mui-focused fieldset': { borderColor: BRAND2, borderWidth: 2 } }
                                }}
                                sx={{ mb: 3 }}
                            />
                            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                                {categories.map((cat) => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        sx={{
                                            fontWeight: 700, px: 1, borderRadius: '10px',
                                            background: selectedCategory === cat ? '#0f172a' : '#f8fafc',
                                            color: selectedCategory === cat ? 'white' : '#64748b',
                                            border: selectedCategory === cat ? '1px solid #0f172a' : '1px solid #e2e8f0',
                                            '&:hover': { background: selectedCategory === cat ? '#1e293b' : '#f1f5f9' },
                                            transition: 'all 0.2s',
                                            whiteSpace: 'nowrap'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* ── Directory Tab ── */}
                {tab === 0 && (
                    <Grid container spacing={4}>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Grid item key={i} xs={12} sm={6} md={4}>
                                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '24px' }} />
                                </Grid>
                            ))
                        ) : filteredBusinesses.length > 0 ? (
                            filteredBusinesses.map((business, index) => (
                                <Grid item key={business.id} xs={12} sm={6} md={4}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        style={{ height: '100%' }}
                                    >
                                        <Card sx={{
                                            background: 'white', borderRadius: '24px',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                                            height: '100%', display: 'flex', flexDirection: 'column',
                                            cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)', borderColor: 'rgba(250, 130, 49, 0.3)' }
                                        }}>
                                            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                                                    <Box sx={{
                                                        width: 64, height: 64, background: BRAND_GRADIENT_LIGHT, borderRadius: '16px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        overflow: 'hidden', border: '1px solid rgba(230,42,77,0.1)'
                                                    }}>
                                                        {business.logoUrl
                                                            ? <img src={business.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            : <BusinessIcon fontSize="large" sx={{ color: BRAND, opacity: 0.7 }} />
                                                        }
                                                    </Box>
                                                    <Chip label={business.category} size="small" sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700, borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                                </Box>

                                                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                                                    {business.businessName}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: '#475569', mb: 4, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {business.description}
                                                </Typography>

                                                <Box sx={{ mt: 'auto', borderTop: '1px dashed #e2e8f0', pt: 3 }}>
                                                    {business.ownerName && (
                                                        <Typography variant="subtitle2" sx={{ color: '#0f172a', mb: 1, fontWeight: 700 }}>{business.ownerName}</Typography>
                                                    )}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, color: '#64748b' }}>
                                                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: BRAND2 }} />
                                                        <Typography variant="body2">{business.address}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            size="small" variant="outlined"
                                                            onClick={() => setProfileBusiness(business)}
                                                            sx={{
                                                                flex: 1, borderRadius: '12px', fontWeight: 800, textTransform: 'none',
                                                                borderColor: BRAND, color: BRAND,
                                                                '&:hover': { bgcolor: 'rgba(230,42,77,0.05)', borderColor: BRAND }
                                                            }}
                                                        >
                                                            View Profile
                                                        </Button>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => { e.stopPropagation(); handleShare(business); }}
                                                            sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}
                                                        >
                                                            <ShareIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 12, borderRadius: '32px', border: '1px dashed #cbd5e1' }}>
                                    <BusinessIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                                    <Typography variant="h5" fontWeight={800} color="#0f172a">No businesses found.</Typography>
                                    <Typography variant="body1" color="#64748b">Try adjusting your filters.</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* ── Feed Tab ── */}
                {tab === 1 && (
                    <Box sx={{ maxWidth: 680, mx: 'auto' }}>
                        <BusinessFeed onViewBusiness={(id) => {
                            if (!id) { setTab(0); return; }
                            const b = businesses.find(biz => biz.id === id);
                            if (b) setProfileBusiness(b);
                        }} />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default BusinessList;
