import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Skeleton } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    proofUrl?: string;
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

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#8B2635' }}>
                    Community Achievements
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {loading ? (
                    // Skeleton Loading State
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
                                    <Skeleton variant="text" height={24} width="50%" sx={{ mb: 1 }} />
                                    <Skeleton variant="text" height={20} width="40%" sx={{ mb: 2 }} />
                                    <Skeleton variant="text" height={60} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : achievements.length > 0 ? (
                    achievements.map((achievement) => (
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
                    ))
                ) : (
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 8, opacity: 0.7 }}>
                        <EmojiEventsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">No achievements recorded yet.</Typography>
                        <Typography variant="body2" color="textSecondary">Community milestones will appear here.</Typography>
                    </Box>
                )}
            </Grid>
        </Container>
    );
};

export default AchievementsPage;
