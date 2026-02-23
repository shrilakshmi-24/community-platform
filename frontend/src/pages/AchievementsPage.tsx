import { useState, useEffect, useRef } from 'react';
import client from '../api/client';
import {
    Container, Typography, Box, Card, CardContent, Avatar,
    IconButton, Skeleton, Button, Dialog,
    DialogContent, useTheme, useMediaQuery
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';

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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        }, 4000);

        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [loading, topAchievements.length, isPaused]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % topAchievements.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + topAchievements.length) % topAchievements.length);
    };

    // V5: Maroon Theme Gradients
    const getGradient = (id: string) => {
        const colors = [
            'linear-gradient(135deg, #FA8231 0%, #B44C5C 100%)', // Maroon -> Light
            'linear-gradient(135deg, #E62A4D 0%, #FA8231 100%)', // Dark -> Maroon
            'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)', // Maroon -> Gold
            'linear-gradient(135deg, #965A23 0%, #FA8231 100%)', // Bronze -> Maroon
            'linear-gradient(135deg, #B44C5C 0%, #E6A972 100%)', // Light Maroon -> Gold
        ];
        return colors[id.charCodeAt(0) % colors.length];
    };

    const getSlideStyles = (index: number) => {
        if (topAchievements.length === 0) return {};

        const total = topAchievements.length;
        let diff = (index - activeIndex + total) % total;
        if (diff > total / 2) diff -= total;

        const isActive = diff === 0;
        const isVisible = Math.abs(diff) <= 1; // Only show immediate neighbors

        const xOffset = isMobile ? (diff * 105) : (diff * 60);
        const scale = isActive ? 1.15 : 0.85;
        const opacity = isVisible ? (isActive ? 1 : 0.4) : 0;
        const zIndex = isVisible ? (isActive ? 10 : 5) : 0;
        const blur = isActive ? '0px' : '3px';
        const boxShadow = isActive
            ? '0 25px 50px -12px rgba(139, 38, 53, 0.4)' // V5: Maroon Glow
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';

        return {
            display: 'block',
            opacity,
            transform: `translateX(${xOffset}%) scale(${scale})`,
            zIndex,
            filter: `blur(${blur})`,
            boxShadow,
            transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)', // Smooth ease-out
            position: 'absolute' as 'absolute',
            left: 0, right: 0, margin: 'auto',
            width: isMobile ? '80%' : '500px',
            top: 0,
            pointerEvents: isVisible ? 'auto' : 'none'
        };
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            // V5: Softer Maroon-tinted background
            background: 'radial-gradient(circle at 50% 0%, #fdf2f4 0%, #f8fafc 100%)',
            position: 'relative',
            overflowX: 'hidden'
        }}>

            {/* Stage Curtain Animation - Dark Maroon */}
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
                                background: 'linear-gradient(to right, #E62A4D, #E6A972)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
                            }}>
                                HALL OF FAME
                            </Typography>
                        </motion.div>
                    </Box>
                )}
            </AnimatePresence>

            <Box sx={{ py: 8 }}>
                {/* Hero Carousel Section */}
                <Container maxWidth="xl" sx={{ mb: 12, height: { xs: 500, md: 650 }, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <Typography variant="h3" fontWeight={800} sx={{ mb: 6, textAlign: 'center', color: '#E62A4D', letterSpacing: -1 }}>
                            Spotlight Achievers
                        </Typography>
                    </motion.div>

                    <Box
                        sx={{ position: 'relative', height: 480, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {loading ? (
                            <Skeleton variant="rectangular" width={500} height={400} sx={{ borderRadius: 6 }} />
                        ) : (
                            topAchievements.map((item, index) => {
                                const isItemActive = index === activeIndex;
                                return (
                                    <Box
                                        key={item.id}
                                        component={isItemActive ? motion.div : 'div'} // Only animate active item floating
                                        animate={isItemActive ? { y: [0, -10, 0] } : {}}
                                        transition={isItemActive ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : {}}
                                        sx={{
                                            height: 420,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            backgroundColor: 'white',
                                            ...getSlideStyles(index)
                                        }}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <Box sx={{
                                            width: '100%', height: '100%',
                                            background: item.proofUrl && item.proofUrl.match(/\.(jpeg|jpg|gif|png)$/)
                                                ? `url(${item.proofUrl}) center/cover no-repeat`
                                                : getGradient(item.id)
                                        }}>
                                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(90, 18, 30, 0.9) 0%, rgba(90, 18, 30, 0.2) 60%, transparent 100%)' }} />
                                        </Box>

                                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', p: 4, textAlign: 'center' }}>
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={isItemActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.8 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Avatar
                                                    src={item.user.profile.avatarUrl}
                                                    sx={{
                                                        width: 90, height: 90,
                                                        border: '4px solid white', mx: 'auto', mb: 2,
                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    {item.user.profile.fullName[0]}
                                                </Avatar>
                                                <Typography variant="h4" fontWeight={900} sx={{ color: 'white', mb: 0.5, lineHeight: 1.1, textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600} sx={{ color: '#E62A4D', letterSpacing: 1, textTransform: 'uppercase' }}>
                                                    {item.user.profile.fullName}
                                                </Typography>
                                            </motion.div>
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                    </Box>

                    {/* Navigation Buttons */}
                    {!loading && topAchievements.length > 1 && (
                        <>
                            <IconButton
                                onClick={handlePrev}
                                sx={{
                                    position: 'absolute', left: { xs: 10, md: 80 }, top: '50%', transform: 'translateY(-50%)',
                                    bgcolor: 'white', color: '#FA8231',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    '&:hover': { bgcolor: '#fdf2f4', transform: 'translateY(-50%) scale(1.1)' }
                                }}
                            >
                                <ArrowBackIosNewIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    position: 'absolute', right: { xs: 10, md: 80 }, top: '50%', transform: 'translateY(-50%)',
                                    bgcolor: 'white', color: '#FA8231',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    '&:hover': { bgcolor: '#fdf2f4', transform: 'translateY(-50%) scale(1.1)' }
                                }}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </>
                    )}

                    {/* Pagination Indicators */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 2, position: 'relative', zIndex: 10 }}>
                        {topAchievements.map((_, i) => (
                            <motion.div
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                animate={{
                                    width: i === activeIndex ? 32 : 8,
                                    backgroundColor: i === activeIndex ? '#FA8231' : '#cbd5e1'
                                }}
                                style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
                            />
                        ))}
                    </Box>
                </Container>


                {/* Grid View - Square Cards */}
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2 }}>
                        <Typography variant="h4" fontWeight={800} sx={{ color: '#E62A4D', letterSpacing: -1 }}>
                            All Achievers
                        </Typography>
                        <Box sx={{ height: 4, flexGrow: 1, borderRadius: 2, background: 'linear-gradient(90deg, #e2e8f0 0%, transparent 100%)' }} />
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 4
                    }}>
                        {achievements.map((item, index) => (
                            <Box key={item.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                >
                                    <Card
                                        onClick={() => setSelectedAchievement(item)}
                                        sx={{
                                            borderRadius: 6,
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                            border: 'none',
                                            bgcolor: 'white',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                // V5: Maroon shadow on hover
                                                boxShadow: '0 20px 25px -5px rgba(139, 38, 53, 0.15), 0 10px 10px -5px rgba(139, 38, 53, 0.05)'
                                            }
                                        }}
                                    >
                                        {/* Image / Gradient Header */}
                                        <Box sx={{
                                            height: 200, width: '100%',
                                            background: item.proofUrl && item.proofUrl.match(/\.(jpeg|jpg|gif|png)$/)
                                                ? `url(${item.proofUrl}) center/cover no-repeat`
                                                : getGradient(item.id),
                                            position: 'relative'
                                        }}>
                                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }} />
                                            <Avatar
                                                src={item.user.profile.avatarUrl}
                                                sx={{
                                                    width: 64, height: 64,
                                                    position: 'absolute', bottom: -32, left: 24,
                                                    border: '4px solid white',
                                                    // V5: Maroon accent
                                                    bgcolor: '#fdf2f4', color: '#FA8231', fontWeight: 800, fontSize: '1.5rem',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                {item.user.profile.fullName[0]}
                                            </Avatar>
                                        </Box>

                                        <CardContent sx={{ pt: 5, pb: 3, px: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', lineHeight: 1.2, mb: 1 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600} sx={{ color: '#FA8231', mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                                                {item.user.profile.fullName}
                                            </Typography>

                                            <Typography variant="body2" sx={{
                                                color: '#64748b',
                                                mb: 3,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                flexGrow: 1
                                            }}>
                                                {item.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                    {new Date(item.date).toLocaleDateString()}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
                                                    sx={{
                                                        borderRadius: 2, textTransform: 'none', fontWeight: 700, color: '#334155',
                                                        '&:hover': { bgcolor: '#fdf2f4', color: '#FA8231' }
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Detailed View Modal */}
            <Dialog
                open={!!selectedAchievement}
                onClose={() => setSelectedAchievement(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 6, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }
                }}
            >
                {selectedAchievement && (
                    <>
                        <Box sx={{
                            height: 400,
                            position: 'relative',
                            background: selectedAchievement.proofUrl && selectedAchievement.proofUrl.match(/\.(jpeg|jpg|gif|png)$/)
                                ? `url(${selectedAchievement.proofUrl}) center/cover no-repeat`
                                : getGradient(selectedAchievement.id)
                        }}>
                            <IconButton
                                onClick={() => setSelectedAchievement(null)}
                                sx={{
                                    position: 'absolute', top: 24, right: 24,
                                    zIndex: 10,
                                    bgcolor: 'rgba(0,0,0,0.3)', color: 'white', backdropFilter: 'blur(4px)',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Box sx={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top, rgba(90, 18, 30, 0.95) 0%, transparent 80%)'
                            }} />
                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 6, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                <Avatar
                                    src={selectedAchievement.user.profile.avatarUrl}
                                    sx={{ width: 120, height: 120, border: '5px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
                                >
                                    {selectedAchievement.user.profile.fullName[0]}
                                </Avatar>
                                <Box sx={{ mb: 1 }}>
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                        <Typography variant="h3" fontWeight={800} sx={{ color: 'white', textShadow: '0 4px 10px rgba(0,0,0,0.3)', letterSpacing: -1 }}>
                                            {selectedAchievement.title}
                                        </Typography>
                                        <Typography variant="h5" fontWeight={600} sx={{ color: '#E62A4D', mt: 1 }}>
                                            {selectedAchievement.user.profile.fullName}
                                        </Typography>
                                    </motion.div>
                                </Box>
                            </Box>
                        </Box>

                        <DialogContent sx={{ p: 6 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                                <Typography variant="caption" fontWeight={700} sx={{
                                    bgcolor: '#fdf2f4', px: 2, py: 1, borderRadius: 2, color: '#FA8231',
                                    textTransform: 'uppercase', letterSpacing: 1.5
                                }}>
                                    ACHIEVED • {new Date(selectedAchievement.date).toLocaleDateString()}
                                </Typography>
                            </Box>

                            <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1.125rem', mb: 6 }}>
                                {selectedAchievement.description}
                            </Typography>

                            {selectedAchievement.proofUrl && (
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<ShareIcon />}
                                    href={selectedAchievement.proofUrl}
                                    target="_blank"
                                    sx={{
                                        borderRadius: 3, py: 1.5, px: 4,
                                        bgcolor: '#FA8231', color: 'white', textTransform: 'none', fontWeight: 700,
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        '&:hover': { bgcolor: '#E62A4D', transform: 'translateY(-1px)' }
                                    }}
                                >
                                    View Proof / Media
                                </Button>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AchievementsPage;
