import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Skeleton, Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    proofUrl?: string; // Effectively the image URL for carousel
    user: {
        profile: {
            fullName: string;
        }
    };
}

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

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

    // Split achievements: Top 5 for Carousel, rest for Grid
    const carouselItems = achievements.slice(0, 5);
    const gridItems = achievements.slice(5);

    return (
        <Container component="main" maxWidth="lg" sx={{ mb: 8 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#8B2635', mb: 1 }}>
                    Community Hall of Fame
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Celebrating our members' success and contributions.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 4 }} />
                </Box>
            ) : achievements.length > 0 ? (
                <>
                    {/* Carousel Section */}
                    <Box sx={{ mb: 6 }}>
                        <Carousel
                            animation="slide"
                            indicatorContainerProps={{
                                style: { marginTop: '20px' }
                            }}
                            navButtonsAlwaysVisible
                        >
                            {carouselItems.map((item) => (
                                <Paper
                                    key={item.id}
                                    elevation={4}
                                    sx={{
                                        position: 'relative',
                                        height: 400,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        backgroundImage: item.proofUrl ? `url(${item.proofUrl})` : 'linear-gradient(45deg, #8B2635 30%, #FF8E53 90%)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'flex-end'
                                    }}
                                >
                                    <Box sx={{
                                        width: '100%',
                                        p: 4,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                                        color: 'white'
                                    }}>
                                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h6">
                                            Awarded to: {item.user?.profile?.fullName || 'Community Member'}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                                            {item.description}
                                        </Typography>
                                        <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.7 }}>
                                            {new Date(item.date).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Carousel>
                    </Box>

                    {/* Grid Section for Remaining Items */}
                    {gridItems.length > 0 && (
                        <>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#8B2635' }}>
                                More Achievements
                            </Typography>
                            <Grid container spacing={4}>
                                {gridItems.map((achievement) => (
                                    <Grid key={achievement.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#A0522D' }}>
                                                    {achievement.title}
                                                </Typography>
                                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                    Awarded to: <strong>{achievement.user?.profile?.fullName || 'Community Member'}</strong>
                                                </Typography>
                                                <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                                                    {new Date(achievement.date).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body1" paragraph>
                                                    {achievement.description}
                                                </Typography>
                                                {achievement.proofUrl && (
                                                    <Button size="small" variant="outlined" href={achievement.proofUrl} target="_blank">
                                                        View Proof
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>
            ) : (
                <Box sx={{ width: '100%', textAlign: 'center', mt: 8, opacity: 0.7 }}>
                    <EmojiEventsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">No achievements recorded yet.</Typography>
                    <Typography variant="body2" color="textSecondary">Community milestones will appear here.</Typography>
                </Box>
            )}
        </Container>
    );
};

export default AchievementsPage;
