import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Card, CardContent, Avatar, IconButton, Skeleton, GridLegacy as Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { motion } from 'framer-motion';

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

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            setLoading(true);
            try {
                const { data } = await client.get('/community/achievements/all');
                setAchievements(data.achievements);
            } catch (error) {
                console.error('Failed to fetch achievements', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 6, pb: 10 }}>
            <Container component="main" maxWidth="lg">
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <WorkspacePremiumIcon sx={{ fontSize: 60, color: '#eab308' }} />
                        <Typography variant="h3" fontWeight={800} sx={{ mt: 2, color: '#1e293b' }}>
                            Hall of Fame
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
                            Celebrating the legends of our community.
                        </Typography>
                    </motion.div>
                </Box>

                {loading ? (
                    <Grid container spacing={3}>
                        {Array.from(new Array(3)).map((_, i) => (
                            <Grid item key={i} xs={12} md={4}><Skeleton height={300} sx={{ borderRadius: 4 }} /></Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={3}>
                        {achievements.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card sx={{
                                        bgcolor: 'white',
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                        overflow: 'visible',
                                        position: 'relative',
                                        mt: 4,
                                        pt: 4
                                    }}>
                                        {/* Avatar floating top */}
                                        <Box sx={{ position: 'absolute', top: -30, left: 24 }}>
                                            <Avatar
                                                src={item.user?.profile?.avatarUrl}
                                                sx={{
                                                    width: 60, height: 60,
                                                    border: '4px solid white',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                    bgcolor: '#2563eb'
                                                }}
                                            >
                                                {item.user?.profile?.fullName?.[0]}
                                            </Avatar>
                                        </Box>

                                        <CardContent sx={{ px: 3, pb: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#0d9488', fontWeight: 700, letterSpacing: 0.5 }}>
                                                UNLOCKED {new Date(item.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1, color: '#1e293b', lineHeight: 1.3 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                                                {item.description}
                                            </Typography>

                                            <Box sx={{ borderTop: '1px solid #f1f5f9', pt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}><FavoriteIcon fontSize="small" /></IconButton>
                                                <IconButton
                                                    component="a"
                                                    href={item.proofUrl}
                                                    target="_blank"
                                                    size="small"
                                                    disabled={!item.proofUrl}
                                                    sx={{ color: '#94a3b8', '&:hover': { color: '#2563eb' } }}
                                                >
                                                    <ShareIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default AchievementsPage;
