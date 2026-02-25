import { useState, useEffect, useRef } from 'react';
import client from '../api/client';
import {
    Container, Typography, Box, Card, CardContent, Avatar,
    IconButton, Skeleton, Button, Dialog,
    DialogContent, useTheme, useMediaQuery, Chip
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(230, 42, 77, 0.05) 0%, rgba(250, 130, 49, 0.05) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

const CARD_GRADIENTS = [
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // warm sunrise
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // cool breeze
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // lavender
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // pink sherbet
    'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', // soft twilight
    'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', // clean slate
];

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    proofUrl?: string;
    user: {
        profile: {
            fullName: string;
            avatarUrl?: string;
        }
    };
}

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [showCurtain, setShowCurtain] = useState(true);

    // Carousel State
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            setLoading(true);
            try {
                const { data } = await client.get('/community/achievements/all');
                const sorted = data.achievements.sort((a: Achievement, b: Achievement) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setAchievements(sorted);
            } catch (error) {
                console.error('Failed to fetch achievements', error);
            } finally {
                setLoading(false);
                setTimeout(() => setShowCurtain(false), 1000);
            }
        };
        fetchAchievements();
    }, []);

    const topAchievements = achievements.slice(0, 5);

    // Auto-play Logic
    useEffect(() => {
        if (loading || topAchievements.length <= 1 || isPaused) return;

        autoplayRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % topAchievements.length);
        }, 3500);

        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [loading, topAchievements.length, isPaused]);

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % topAchievements.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + topAchievements.length) % topAchievements.length);

    const getGradient = (id: string, useBrand = false) => {
        if (useBrand) return BRAND_GRADIENT;
        return CARD_GRADIENTS[id.charCodeAt(0) % CARD_GRADIENTS.length];
    };

    const getSlideStyles = (index: number) => {
        if (topAchievements.length === 0) return {};
        const total = topAchievements.length;
        let diff = (index - activeIndex + total) % total;
        if (diff > total / 2) diff -= total;

        const isActive = diff === 0;
        const isVisible = Math.abs(diff) <= 1;

        // Spread the cards elegantly
        const xOffset = isMobile ? (diff * 95) : (diff * 65);
        const scale = isActive ? 1 : 0.85;
        const opacity = isVisible ? (isActive ? 1 : 0.4) : 0;
        const zIndex = isVisible ? (isActive ? 10 : 5) : 0;
        const blur = isActive ? '0px' : '4px';

        return {
            opacity,
            transform: `translateX(calc(-50% + ${xOffset}%)) scale(${scale})`,
            zIndex,
            filter: `blur(${blur})`,
            transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)', // Snappy modern spring
            position: 'absolute' as 'absolute',
            left: '50%',
            top: '5%',
            width: isMobile ? '85%' : '60%',
            height: '90%',
            pointerEvents: isVisible ? 'auto' : 'none',
        };
    };

    const handleShare = async (achievement: Achievement) => {
        if (!achievement) return;
        const shareText = `Check out this achievement by ${achievement.user.profile.fullName}!\n\n🏆 ${achievement.title}\n\n${achievement.description}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: `Achievement: ${achievement.title}`, text: shareText });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Details copied to clipboard!');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pb: 12, fontFamily: "'Inter', sans-serif" }}>

            {/* Stage Curtain Animation */}
            <AnimatePresence>
                {showCurtain && (
                    <Box sx={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
                        <motion.div
                            initial={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #E62A4D 0%, #FA8231 100%)' }}
                        />
                        <motion.div
                            initial={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            style={{ width: '50%', height: '100%', background: 'linear-gradient(-90deg, #E62A4D 0%, #FA8231 100%)' }}
                        />
                        <motion.div
                            initial={{ opacity: 1, scale: 0.9, x: '-50%', y: '-50%' }}
                            animate={{ scale: 1.1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 1.5, x: '-50%', y: '-50%' }}
                            transition={{ duration: 0.8 }}
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                color: '#E62A4D', textAlign: 'center', zIndex: 10001, width: '100%'
                            }}
                        >
                            <Typography variant="h1" fontWeight={900} sx={{
                                fontSize: { xs: '3rem', md: '5rem' },
                                letterSpacing: -2,
                                color: 'white',
                                textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}>
                                HALL OF FAME
                            </Typography>
                        </motion.div>
                    </Box>
                )}
            </AnimatePresence>

            {/* Elevated Hero Area */}
            <Box sx={{
                position: 'relative',
                pt: { xs: 8, md: 10 }, pb: { xs: 6 },
                background: 'radial-gradient(100% 120% at 50% 0%, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)',
                overflow: 'hidden',
                borderBottom: '1px solid rgba(0,0,0,0.03)'
            }}>
                <Box sx={{ position: 'absolute', top: '-20%', right: '10%', width: 500, height: 500, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', top: '20%', left: '-10%', width: 400, height: 400, background: 'rgba(250, 130, 49, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                        <Chip
                            icon={<EmojiEventsIcon sx={{ color: '#E62A4D !important' }} />}
                            label="COMMUNITY HALL OF FAME"
                            sx={{
                                background: BRAND_GRADIENT_LIGHT,
                                color: '#E62A4D',
                                fontWeight: 800,
                                mb: 3,
                                px: 1,
                                borderRadius: '12px',
                                border: '1px solid rgba(230,42,77,0.1)',
                                letterSpacing: '1.5px',
                                boxShadow: '0 4px 10px rgba(230,42,77,0.05)'
                            }}
                        />
                        <Typography variant="h2" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-2px', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
                            Spotlight <Typography component="span" variant="inherit" sx={{ background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Achievers</Typography>
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, maxWidth: 650, lineHeight: 1.6, mx: 'auto' }}>
                            Discover incredible milestones and celebrate the remarkable people who are making waves in our community.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Box sx={{ py: 6 }}>
                {/* 3D Modern Carousel Array */}
                <Container maxWidth="xl" sx={{ mb: 10, height: { xs: 450, md: 550 }, position: 'relative', perspective: '1200px' }}>
                    <Box
                        sx={{ position: 'relative', height: '100%', width: '100%' }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Skeleton variant="rectangular" width="60%" height="90%" sx={{ borderRadius: 8 }} />
                            </Box>
                        ) : (
                            topAchievements.map((item, index) => {
                                const isItemActive = index === activeIndex;
                                return (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            ...getSlideStyles(index),
                                            borderRadius: '32px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            backgroundColor: '#fff',
                                            boxShadow: isItemActive ? '0 30px 60px -15px rgba(230,42,77,0.3)' : '0 20px 40px -10px rgba(0,0,0,0.1)',
                                            border: isItemActive ? '1px solid rgba(230,42,77,0.1)' : '1px solid transparent',
                                        }}
                                        onClick={() => !isItemActive && setActiveIndex(index)}
                                    >
                                        <Box sx={{
                                            width: '100%', height: '100%',
                                            position: 'relative',
                                            background: item.proofUrl && item.proofUrl.match(/\.(jpeg|jpg|gif|png)$/)
                                                ? `url(${item.proofUrl}) center/cover no-repeat`
                                                : getGradient(item.id, true) // Force brand gradient for hero
                                        }}>
                                            {/* Advanced Overlay */}
                                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)' }} />

                                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, px: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 }, width: '100%' }}>
                                                <AnimatePresence mode="wait">
                                                    {isItemActive && (
                                                        <motion.div
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            exit={{ y: -20, opacity: 0 }}
                                                            transition={{ duration: 0.4 }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                                <Avatar
                                                                    src={item.user.profile.avatarUrl}
                                                                    sx={{
                                                                        width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 },
                                                                        border: '4px solid white',
                                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                                                    }}
                                                                >
                                                                    {item.user.profile.fullName[0]}
                                                                </Avatar>
                                                                <Box>
                                                                    <Chip
                                                                        label="STAR ACHIEVER"
                                                                        size="small"
                                                                        sx={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', fontWeight: 800, mb: 1.5, letterSpacing: '1px' }}
                                                                    />
                                                                    <Typography variant="h3" fontWeight={900} sx={{ color: 'white', mb: 0.5, lineHeight: 1.1, fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: '-1px' }}>
                                                                        {item.title}
                                                                    </Typography>
                                                                    <Typography variant="h6" fontWeight={700} sx={{ color: '#FA8231', letterSpacing: 0.5 }}>
                                                                        {item.user.profile.fullName}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })
                        )}

                        {/* Navigation Buttons placed beautifully on the sides */}
                        {!loading && topAchievements.length > 1 && (
                            <>
                                <IconButton
                                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                    sx={{
                                        position: 'absolute', left: { xs: '5%', md: '10%' }, top: '50%', transform: 'translateY(-50%)', zIndex: 100,
                                        width: 56, height: 56,
                                        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                                        color: '#0f172a',
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        '&:hover': { background: '#fff', transform: 'translateY(-50%) scale(1.1)', color: '#E62A4D' }
                                    }}
                                >
                                    <ArrowBackIosNewIcon sx={{ mr: -0.5 }} />
                                </IconButton>
                                <IconButton
                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                    sx={{
                                        position: 'absolute', right: { xs: '5%', md: '10%' }, top: '50%', transform: 'translateY(-50%)', zIndex: 100,
                                        width: 56, height: 56,
                                        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                                        color: '#0f172a',
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        '&:hover': { background: '#fff', transform: 'translateY(-50%) scale(1.1)', color: '#E62A4D' }
                                    }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    {/* Minimal Dots */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 4, position: 'relative', zIndex: 10 }}>
                        {topAchievements.map((_, i) => (
                            <Box
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                sx={{
                                    width: i === activeIndex ? 32 : 10,
                                    height: 10,
                                    borderRadius: 5,
                                    background: i === activeIndex ? BRAND_GRADIENT : '#cbd5e1',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                    boxShadow: i === activeIndex ? '0 4px 10px rgba(230,42,77,0.3)' : 'none'
                                }}
                            />
                        ))}
                    </Box>
                </Container>

                <Container maxWidth="lg" sx={{ mt: 8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <StarIcon sx={{ color: '#FA8231', fontSize: 32, mr: 2, filter: 'drop-shadow(0 4px 6px rgba(250,130,49,0.3))' }} />
                        <Typography variant="h3" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1px' }}>
                            All <Typography component="span" variant="inherit" sx={{ color: '#E62A4D' }}>Achievements</Typography>
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 4 }}>
                            {Array.from(new Array(6)).map((_, i) => (
                                <Skeleton key={i} variant="rectangular" height={420} sx={{ borderRadius: '24px' }} />
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: 4
                        }}>
                            {achievements.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.05, duration: 0.6, ease: "easeOut" }}
                                    style={{ height: '100%' }}
                                >
                                    <Card
                                        onClick={() => setSelectedAchievement(item)}
                                        sx={{
                                            borderRadius: '24px',
                                            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.03)',
                                            border: '1px solid #f1f5f9',
                                            bgcolor: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                                            position: 'relative',
                                            overflow: 'visible', // For Avatar pop-out
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 25px 40px -10px rgba(0,0,0,0.08)',
                                                borderColor: 'rgba(230,42,77,0.2)'
                                            }
                                        }}
                                    >
                                        {/* Image / Vibrant Gradient Header */}
                                        <Box sx={{
                                            borderTopLeftRadius: '24px',
                                            borderTopRightRadius: '24px',
                                            height: 180, width: '100%',
                                            background: item.proofUrl && item.proofUrl.match(/\.(jpeg|jpg|gif|png)$/)
                                                ? `url(${item.proofUrl}) center/cover no-repeat`
                                                : getGradient(item.id),
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 100%)' }} />
                                            {/* Beautiful Tag */}
                                            <Chip
                                                label={new Date(item.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                size="small"
                                                sx={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.9)', color: '#0f172a', fontWeight: 800, backdropFilter: 'blur(5px)' }}
                                            />
                                        </Box>

                                        {/* Floating Avatar offset slightly */}
                                        <Box sx={{ px: 4, position: 'relative' }}>
                                            <Avatar
                                                src={item.user.profile.avatarUrl}
                                                sx={{
                                                    width: 72, height: 72,
                                                    position: 'absolute', top: -36, left: 32,
                                                    border: '4px solid white',
                                                    background: 'white',
                                                    color: '#E62A4D',
                                                    fontWeight: 900, fontSize: '1.5rem',
                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                {item.user.profile.fullName[0]}
                                            </Avatar>
                                        </Box>

                                        <CardContent sx={{ pt: 6, pb: 4, px: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#E62A4D', mb: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                {item.user.profile.fullName}
                                            </Typography>
                                            <Typography variant="h5" fontWeight={900} sx={{ color: '#0f172a', lineHeight: 1.3, mb: 2, letterSpacing: '-0.5px' }}>
                                                {item.title}
                                            </Typography>

                                            <Typography variant="body1" sx={{
                                                color: '#64748b', mb: 4, lineHeight: 1.7,
                                                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                flexGrow: 1,
                                            }}>
                                                {item.description}
                                            </Typography>

                                            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                                                <Button
                                                    sx={{
                                                        color: '#0f172a', fontWeight: 800, p: 0,
                                                        background: 'transparent',
                                                        display: 'inline-flex', alignItems: 'center',
                                                        '&:hover': { background: 'transparent', color: '#E62A4D' }
                                                    }}
                                                    disableRipple
                                                    endIcon={<ArrowForwardIosIcon sx={{ fontSize: '12px !important', ml: 0.5, transition: 'transform 0.2s', '.MuiButton-root:hover &': { transform: 'translateX(4px)' } }} />}
                                                >
                                                    Tap to expand
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Ultra Modern Modal */}
            <Dialog
                open={!!selectedAchievement}
                onClose={() => setSelectedAchievement(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4)' }
                }}
            >
                {selectedAchievement && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Box sx={{
                            minHeight: 350,
                            position: 'relative',
                            background: selectedAchievement.proofUrl && selectedAchievement.proofUrl.match(/\.(jpeg|jpg|gif|png)$/)
                                ? `url(${selectedAchievement.proofUrl}) center/cover no-repeat`
                                : getGradient(selectedAchievement.id, true), // Brand colors for modal header
                        }}>
                            <Box sx={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 1.5, zIndex: 10 }}>
                                <IconButton
                                    onClick={() => handleShare(selectedAchievement)}
                                    sx={{ color: '#0f172a', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', '&:hover': { background: 'white', transform: 'scale(1.05)' } }}
                                    title="Share Achievement"
                                >
                                    <ShareIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={() => setSelectedAchievement(null)}
                                    sx={{ color: '#0f172a', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', '&:hover': { background: 'white', transform: 'scale(1.05)', color: '#E62A4D' } }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15,23,42,0.1) 80%)' }} />

                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: { xs: 4, md: 6 }, display: 'flex', alignItems: 'flex-end', gap: { xs: 3, md: 4 } }}>
                                <Avatar
                                    src={selectedAchievement.user.profile.avatarUrl}
                                    sx={{
                                        width: { xs: 90, md: 120 }, height: { xs: 90, md: 120 },
                                        border: '4px solid white',
                                        boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                                        background: 'white', color: '#E62A4D', fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.5rem' }
                                    }}
                                >
                                    {selectedAchievement.user.profile.fullName[0]}
                                </Avatar>
                                <Box sx={{ mb: 1.5 }}>
                                    <Chip
                                        label={new Date(selectedAchievement.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        size="small"
                                        sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, mb: 1.5, px: 1 }}
                                    />
                                    <Typography variant="h3" fontWeight={900} sx={{ color: 'white', letterSpacing: '-1.5px', fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.1, mb: 1 }}>
                                        {selectedAchievement.title}
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700} sx={{ color: '#FA8231' }}>
                                        {selectedAchievement.user.profile.fullName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <DialogContent sx={{ p: { xs: 4, md: 6 }, background: '#ffffff' }}>
                            <Box sx={{ maxWidth: 800 }}>
                                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', mb: 2, letterSpacing: '-0.5px' }}>
                                    About the Achievement
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', mb: 5, whiteSpace: 'pre-wrap' }}>
                                    {selectedAchievement.description}
                                </Typography>

                                {selectedAchievement.proofUrl && (
                                    <Box sx={{ mt: 2, p: 4, borderRadius: '20px', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                                        <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center' }}>
                                            <ShareIcon sx={{ mr: 1, fontSize: 18 }} /> ATTACHED MEDIA
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            href={selectedAchievement.proofUrl}
                                            target="_blank"
                                            sx={{
                                                borderRadius: '16px', py: 1.5, px: 4,
                                                background: BRAND_GRADIENT,
                                                color: 'white', textTransform: 'none', fontWeight: 800, fontSize: '1.05rem',
                                                boxShadow: BRAND_SHADOW,
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 25px 50px -12px rgba(230, 42, 77, 0.4)' }
                                            }}
                                        >
                                            View Full Proof / Media
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </DialogContent>
                    </motion.div>
                )}
            </Dialog>
        </Box>
    );
};

export default AchievementsPage;
