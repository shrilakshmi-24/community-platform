import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Skeleton, GridLegacy as Grid } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { motion } from 'framer-motion';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch or real endpoint
        setTimeout(() => {
            setAnnouncements([
                { id: 1, title: 'Annual Arya Vaishya Meetup 2026', content: 'Join us for the biggest community gathering of the year. Music, food, and networking.', date: '2026-04-15' },
                { id: 2, title: 'Exam Toppers Felicitation', content: 'We are inviting applications for student awards. Submit your mark sheets by May 1st.', date: '2026-04-10' },
                { id: 3, title: 'New Business Support Scheme', content: 'Interest-free loans available for young entrepreneurs. Check the business section.', date: '2026-04-01' }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-app)', pt: 6, pb: 10 }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
                        Announcements
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Latest news and updates from the committee.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {loading ? (
                        Array.from(new Array(3)).map((_, i) => (
                            <Grid item key={i} xs={12}><Skeleton height={150} sx={{ borderRadius: 3 }} /></Grid>
                        ))
                    ) : (
                        announcements.map((item, index) => (
                            <Grid item xs={12} key={item.id}>
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                        display: 'flex',
                                        gap: 3
                                    }}>
                                        <Box sx={{
                                            display: { xs: 'none', sm: 'flex' },
                                            alignItems: 'center', justifyContent: 'center',
                                            width: 60, height: 60,
                                            bgcolor: '#fff1f2', color: '#be123c',
                                            borderRadius: '50%', flexShrink: 0
                                        }}>
                                            <CampaignIcon fontSize="medium" />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                                                {new Date(item.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mt: 0.5, mb: 1 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                                                {item.content}
                                            </Typography>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default AnnouncementsPage;
