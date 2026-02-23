import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import {
    Box, Typography, Button, Container, GridLegacy as Grid, Card, CardContent, CardMedia, Chip,
    IconButton, Skeleton, Stack, Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

interface Newsletter {
    id: string;
    title: string;
    content: string;
    coverImageUrl?: string;
    pdfUrl?: string;
    publishedAt: string;
    emailSummary?: string;
}

const NewsletterPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
    const [linkedContent, setLinkedContent] = useState<any>(null); // To store events/achievements
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchNewsletterDetail(id);
        } else {
            fetchNewsletters();
        }
    }, [id]);

    const fetchNewsletters = async () => {
        try {
            setLoading(true);
            const { data } = await client.get('/newsletter/all?status=APPROVED');
            setNewsletters(data.newsletters);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNewsletterDetail = async (newsletterId: string) => {
        try {
            setLoading(true);
            const { data } = await client.get(`/newsletter/${newsletterId}`);
            setSelectedNewsletter(data.newsletter);
            setLinkedContent(data.linkedContent);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (id && selectedNewsletter) {
        // --- DETAIL VIEW ---
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/newsletters')}
                    sx={{ mb: 4, color: '#64748b' }}
                >
                    Back to All Newsletters
                </Button>

                <Grid container spacing={6}>
                    <Grid item xs={12} md={8}>
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Chip label="Community Update" color="secondary" size="small" sx={{ mb: 2, fontWeight: 700 }} />
                            <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', lineHeight: 1.2, mb: 2 }}>
                                {selectedNewsletter.title}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ color: '#64748b' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarMonthIcon fontSize="small" />
                                    <Typography variant="body2">
                                        {new Date(selectedNewsletter.publishedAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                {selectedNewsletter.pdfUrl && (
                                    <Button
                                        startIcon={<DownloadIcon />}
                                        size="small"
                                        color="primary"
                                        href={selectedNewsletter.pdfUrl}
                                        target="_blank"
                                    >
                                        Download PDF
                                    </Button>
                                )}
                            </Stack>
                        </Box>

                        {/* Cover Image */}
                        {selectedNewsletter.coverImageUrl && (
                            <Box
                                component="img"
                                src={selectedNewsletter.coverImageUrl}
                                sx={{ width: '100%', borderRadius: 4, mb: 6, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                            />
                        )}

                        {/* Content */}
                        <Box
                            className="newsletter-content"
                            sx={{
                                typography: 'body1',
                                color: '#334155',
                                lineHeight: 1.8,
                                '& h2': { fontSize: '1.5rem', fontWeight: 700, mt: 4, mb: 2, color: '#1e293b' },
                                '& p': { mb: 2 },
                                '& img': { maxWidth: '100%', borderRadius: 2, my: 2 },
                                '& ul': { pl: 3, mb: 2 },
                                '& blockquote': { borderLeft: '4px solid #8B2635', pl: 2, py: 1, my: 3, bgcolor: '#f8fafc', fontStyle: 'italic' }
                            }}
                            dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
                        />
                    </Grid>

                    {/* Sidebar / Linked Content */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ position: 'sticky', top: 100 }}>
                            {linkedContent && (linkedContent.events.length > 0 || linkedContent.achievements.length > 0) && (
                                <Box sx={{ bgcolor: '#fdf2f4', p: 3, borderRadius: 4, mb: 4 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ color: '#8B2635', mb: 3 }}>
                                        In This Issue
                                    </Typography>

                                    {linkedContent.events.length > 0 && (
                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700 }}>Upcoming Events</Typography>
                                            <Stack spacing={2} sx={{ mt: 1 }}>
                                                {linkedContent.events.map((event: any) => (
                                                    <Card key={event.id} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #fce7f3' }}>
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Typography variant="subtitle2" fontWeight={700}>
                                                                {event.title}
                                                            </Typography>
                                                            <Link
                                                                component="button"
                                                                variant="caption"
                                                                onClick={() => navigate(`/events/${event.id}`)}
                                                                sx={{ color: '#8B2635', fontWeight: 600, mt: 0.5 }}
                                                            >
                                                                View Details →
                                                            </Link>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {linkedContent.achievements.length > 0 && (
                                        <Box>
                                            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700 }}>Featured Achievers</Typography>
                                            <Stack spacing={2} sx={{ mt: 1 }}>
                                                {linkedContent.achievements.map((achievement: any) => (
                                                    <Card key={achievement.id} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #fce7f3' }}>
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Typography variant="subtitle2" fontWeight={700}>
                                                                {achievement.title}
                                                            </Typography>
                                                            <Link
                                                                component="button"
                                                                variant="caption"
                                                                onClick={() => navigate(`/achievements/${achievement.id}`)} // Assuming detail route exists
                                                                sx={{ color: '#8B2635', fontWeight: 600, mt: 0.5 }}
                                                            >
                                                                Read Story →
                                                            </Link>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#f1f5f9', textAlign: 'center' }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Share this update
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    <IconButton size="small" sx={{ bgcolor: 'white' }}><ShareIcon fontSize="small" /></IconButton>
                                    {/* Add social icons here */}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    // --- LIST VIEW ---
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', mb: 2, letterSpacing: -1 }}>
                        Community Newsletters
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto' }}>
                        Stay updated with the latest stories, events, and milestones from our vibrant community.
                    </Typography>
                </Box>

                {loading ? (
                    <Grid container spacing={4}>
                        {[1, 2, 3].map((i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={4}>
                        {newsletters.map((newsletter) => (
                            <Grid item xs={12} md={4} key={newsletter.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex', flexDirection: 'column',
                                    borderRadius: 4,
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
                                }}>
                                    {newsletter.coverImageUrl && (
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={newsletter.coverImageUrl}
                                            alt={newsletter.title}
                                        />
                                    )}
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Typography variant="caption" sx={{ color: '#8B2635', fontWeight: 700, display: 'block', mb: 1 }}>
                                            {new Date(newsletter.publishedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, lineHeight: 1.3 }}>
                                            {newsletter.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                            {newsletter.emailSummary || 'Click to read the full update...'}
                                        </Typography>
                                        <Button
                                            variant="text"
                                            endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                                            onClick={() => navigate(`/newsletters/${newsletter.id}`)}
                                            sx={{ color: '#8B2635', fontWeight: 700, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                                        >
                                            Read More
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default NewsletterPage;
