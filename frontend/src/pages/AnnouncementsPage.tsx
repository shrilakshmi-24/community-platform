import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, CardMedia } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Announcement {
    id: string;
    title: string;
    description: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'VIDEO';
    isActive: boolean;
    createdAt: string;
    user: {
        profile: {
            fullName: string;
        } | null;
    };
}

const AnnouncementsPage = () => {
    useAuth(); // User not needed if not used
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await client.get('/announcements');
            setAnnouncements(res.data.announcements);
        } catch (error) {
            console.error('Failed to fetch announcements', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#8B2635' }} gutterBottom>
                    Announcements
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Stay updated with the latest community news.
                </Typography>
            </Box>

            {loading ? (
                <Typography textAlign="center">Loading announcements...</Typography>
            ) : announcements.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <CampaignIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No active announcements at the moment.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {announcements.map((announcement) => (
                        <Grid size={{ xs: 12, md: 6 }} key={announcement.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
                                {announcement.mediaUrl && (
                                    <CardMedia
                                        component={announcement.mediaType === 'VIDEO' ? 'video' : 'img'}
                                        height="200"
                                        image={announcement.mediaUrl}
                                        alt={announcement.title}
                                        controls={announcement.mediaType === 'VIDEO'}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                        {announcement.title}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                                        Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {announcement.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default AnnouncementsPage;
