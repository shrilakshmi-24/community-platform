import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import {
    Box, Typography, Button, Container, Card, CardContent, CardMedia,
    Chip, IconButton, Skeleton, Stack, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const BRAND = '#E62A4D';
const BRAND2 = '#FA8231';
const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250,130,49,0.06) 0%, rgba(230,42,77,0.06) 100%)';

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
    const [linkedContent, setLinkedContent] = useState<any>(null);
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

    const handleShare = async (newsletter: Newsletter) => {
        const text = `Check out: ${newsletter.title}`;
        if (navigator.share) {
            try { await navigator.share({ title: newsletter.title, text }); } catch { }
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // DETAIL VIEW
    // ─────────────────────────────────────────────────────────────────────
    if (id) {
        if (loading) {
            return (
                <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 8 }}>
                    <Container maxWidth="lg">
                        <Skeleton width={120} height={40} sx={{ mb: 4, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4, mb: 4 }} />
                        <Skeleton width="60%" height={50} sx={{ mb: 2 }} />
                        {[1, 2, 3].map(i => <Skeleton key={i} height={24} sx={{ mb: 1, borderRadius: 1 }} />)}
                    </Container>
                </Box>
            );
        }

        if (!selectedNewsletter) return null;

        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', fontFamily: "'Inter', sans-serif" }}>

                {/* Hero */}
                <Box sx={{
                    position: 'relative',
                    background: selectedNewsletter.coverImageUrl
                        ? `url(${selectedNewsletter.coverImageUrl}) center/cover no-repeat`
                        : BRAND_GRADIENT,
                    minHeight: { xs: 300, md: 420 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}>
                    {/* Overlay */}
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.97) 0%, rgba(10,15,30,0.4) 60%, rgba(10,15,30,0.15) 100%)' }} />

                    {/* Back button */}
                    <Box sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/newsletters')}
                            sx={{
                                color: 'white', fontWeight: 700,
                                bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                                borderRadius: '12px', px: 2, py: 1,
                                border: '1px solid rgba(255,255,255,0.2)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                            }}
                        >
                            All Newsletters
                        </Button>
                    </Box>

                    {/* Share & Download actions */}
                    <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', gap: 1 }}>
                        {selectedNewsletter.pdfUrl && (
                            <Button
                                href={selectedNewsletter.pdfUrl}
                                target="_blank"
                                startIcon={<DownloadIcon />}
                                sx={{
                                    color: 'white', fontWeight: 700,
                                    bgcolor: 'rgba(99,102,241,0.8)', backdropFilter: 'blur(10px)',
                                    borderRadius: '12px', px: 2, py: 1,
                                    '&:hover': { bgcolor: 'rgba(99,102,241,0.95)' }
                                }}
                            >
                                Download PDF
                            </Button>
                        )}
                        <IconButton
                            onClick={() => handleShare(selectedNewsletter)}
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                            }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Box>

                    {/* Title block */}
                    <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 6 }, pb: { xs: 4, md: 6 } }}>
                        <Chip
                            label="Community Update"
                            size="small"
                            sx={{
                                mb: 2, fontWeight: 800, letterSpacing: '1px',
                                bgcolor: 'rgba(255,255,255,0.15)', color: 'white',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        />
                        <Typography variant="h2" fontWeight={900} sx={{
                            color: 'white', letterSpacing: '-1.5px',
                            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.2rem' },
                            lineHeight: 1.1, mb: 2, maxWidth: 800
                        }}>
                            {selectedNewsletter.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.7)' }}>
                            <CalendarMonthIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2" fontWeight={600}>
                                {new Date(selectedNewsletter.publishedAt).toLocaleDateString(undefined, {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Body */}
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: 6 }}>

                        {/* Main content */}
                        <Box>
                            {selectedNewsletter.emailSummary && (
                                <Box sx={{
                                    p: 3, mb: 5,
                                    borderRadius: '16px',
                                    background: BRAND_GRADIENT_LIGHT,
                                    borderLeft: `4px solid ${BRAND}`,
                                }}>
                                    <Typography variant="body1" sx={{ color: '#334155', fontStyle: 'italic', lineHeight: 1.8 }}>
                                        {selectedNewsletter.emailSummary}
                                    </Typography>
                                </Box>
                            )}

                            {/* PDF Banner */}
                            {selectedNewsletter.pdfUrl && (
                                <Box sx={{
                                    mb: 5, p: 3, borderRadius: '16px',
                                    bgcolor: 'rgba(99,102,241,0.06)',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    display: 'flex', alignItems: 'center', gap: 3,
                                    flexWrap: 'wrap'
                                }}>
                                    <Box sx={{
                                        width: 52, height: 52, borderRadius: '14px',
                                        bgcolor: 'rgba(99,102,241,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <PictureAsPdfIcon sx={{ color: '#6366f1', fontSize: 28 }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                                            PDF Version Available
                                        </Typography>
                                        <Typography variant="body2" color="#64748b">
                                            Download and read the full newsletter offline
                                        </Typography>
                                    </Box>
                                    <Button
                                        href={selectedNewsletter.pdfUrl}
                                        target="_blank"
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        sx={{
                                            borderRadius: '12px', fontWeight: 800,
                                            bgcolor: '#6366f1',
                                            '&:hover': { bgcolor: '#4f46e5' }
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Box>
                            )}

                            {/* Rich Text Content */}
                            <Box
                                sx={{
                                    typography: 'body1',
                                    color: '#334155',
                                    lineHeight: 1.9,
                                    fontSize: '1.05rem',
                                    '& h1': { fontSize: '2rem', fontWeight: 900, color: '#0f172a', mt: 4, mb: 2, letterSpacing: '-1px' },
                                    '& h2': { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', mt: 4, mb: 2, letterSpacing: '-0.5px', borderBottom: `2px solid rgba(230,42,77,0.1)`, pb: 1 },
                                    '& h3': { fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', mt: 3, mb: 1.5 },
                                    '& p': { mb: 2 },
                                    '& img': { maxWidth: '100%', borderRadius: '16px', my: 3, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)', display: 'block' },
                                    '& ul,& ol': { pl: 3, mb: 2, '& li': { mb: 0.75 } },
                                    '& blockquote': {
                                        borderLeft: `4px solid ${BRAND}`,
                                        pl: 3, py: 2, my: 4,
                                        bgcolor: BRAND_GRADIENT_LIGHT,
                                        borderRadius: '0 16px 16px 0',
                                        fontStyle: 'italic',
                                        color: '#475569',
                                        fontSize: '1.1rem'
                                    },
                                    '& a': { color: BRAND, textDecoration: 'underline', fontWeight: 600 },
                                    '& code': { bgcolor: '#f1f5f9', px: 1, py: 0.25, borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9em' },
                                    '& pre': { bgcolor: '#0f172a', color: '#e2e8f0', p: 3, borderRadius: '16px', overflowX: 'auto', my: 3 },
                                    '& strong': { fontWeight: 800, color: '#1e293b' },
                                }}
                                dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
                            />
                        </Box>

                        {/* Sidebar */}
                        <Box>
                            <Box sx={{ position: 'sticky', top: 100 }}>

                                {/* Linked events */}
                                {linkedContent?.events?.length > 0 && (
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <EventIcon sx={{ color: BRAND2, fontSize: 20 }} />
                                            <Typography variant="overline" fontWeight={800} sx={{ color: '#64748b', letterSpacing: '1.5px' }}>
                                                Upcoming Events
                                            </Typography>
                                        </Box>
                                        <Stack spacing={2}>
                                            {linkedContent.events.map((event: any) => (
                                                <Card key={event.id} onClick={() => navigate(`/events/${event.id}`)} sx={{
                                                    borderRadius: '14px', boxShadow: 'none',
                                                    border: '1px solid #e2e8f0', cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: BRAND2, transform: 'translateX(4px)', boxShadow: `0 4px 15px -5px rgba(250,130,49,0.3)` }
                                                }}>
                                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                        <Typography variant="subtitle2" fontWeight={800} color="#0f172a">{event.title}</Typography>
                                                        <Typography variant="caption" color={BRAND2} fontWeight={700}>View details →</Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {/* Linked achievements */}
                                {linkedContent?.achievements?.length > 0 && (
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <EmojiEventsIcon sx={{ color: BRAND, fontSize: 20 }} />
                                            <Typography variant="overline" fontWeight={800} sx={{ color: '#64748b', letterSpacing: '1.5px' }}>
                                                Featured Achievers
                                            </Typography>
                                        </Box>
                                        <Stack spacing={2}>
                                            {linkedContent.achievements.map((a: any) => (
                                                <Card key={a.id} sx={{
                                                    borderRadius: '14px', boxShadow: 'none',
                                                    border: '1px solid #e2e8f0',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: BRAND, transform: 'translateX(4px)', boxShadow: `0 4px 15px -5px rgba(230,42,77,0.3)` }
                                                }}>
                                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                        <Typography variant="subtitle2" fontWeight={800} color="#0f172a">{a.title}</Typography>
                                                        <Typography variant="caption" color={BRAND} fontWeight={700}>Read story →</Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {/* Share */}
                                <Box sx={{
                                    p: 3, borderRadius: '16px', bgcolor: '#f8fafc',
                                    border: '1px solid #e2e8f0', textAlign: 'center'
                                }}>
                                    <ShareIcon sx={{ color: '#94a3b8', fontSize: 28, mb: 1 }} />
                                    <Typography variant="subtitle2" fontWeight={700} color="#475569" gutterBottom>
                                        Share this update
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8" display="block" sx={{ mb: 2 }}>
                                        Spread the word in the community
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ShareIcon />}
                                        onClick={() => handleShare(selectedNewsletter)}
                                        fullWidth
                                        sx={{
                                            borderRadius: '10px', fontWeight: 700,
                                            borderColor: '#e2e8f0', color: '#475569',
                                            '&:hover': { borderColor: BRAND, color: BRAND }
                                        }}
                                    >
                                        Share
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>
        );
    }

    // ─────────────────────────────────────────────────────────────────────
    // LIST VIEW
    // ─────────────────────────────────────────────────────────────────────
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', fontFamily: "'Inter', sans-serif" }}>

            {/* Hero Banner */}
            <Box sx={{
                background: BRAND_GRADIENT,
                pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative circles */}
                <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: '20px',
                        bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3, border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <NewspaperIcon sx={{ fontSize: 36, color: 'white' }} />
                    </Box>
                    <Typography variant="h2" fontWeight={900} sx={{
                        color: 'white', letterSpacing: '-2px',
                        fontSize: { xs: '2rem', md: '3.5rem' }, mb: 2
                    }}>
                        Community Newsletter
                    </Typography>
                    <Typography variant="h6" sx={{
                        color: 'rgba(255,255,255,0.8)', fontWeight: 400,
                        maxWidth: 560, mx: 'auto', lineHeight: 1.6
                    }}>
                        Stay updated with the latest stories, achievements, and milestones from our vibrant community.
                    </Typography>
                </Container>
            </Box>

            {/* Content */}
            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
                {loading ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 4 }}>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} variant="rectangular" height={400} sx={{ borderRadius: '24px' }} />
                        ))}
                    </Box>
                ) : newsletters.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 12 }}>
                        <NewspaperIcon sx={{ fontSize: 72, color: '#cbd5e1', mb: 3 }} />
                        <Typography variant="h5" fontWeight={800} color="#94a3b8" gutterBottom>
                            No newsletters yet
                        </Typography>
                        <Typography variant="body1" color="#94a3b8">
                            Check back soon for community updates.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 4 }}>
                        {newsletters.map((nl) => (
                            <Card
                                key={nl.id}
                                onClick={() => navigate(`/newsletters/${nl.id}`)}
                                sx={{
                                    borderRadius: '24px',
                                    boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)',
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 25px 40px -10px rgba(230,42,77,0.18)`,
                                        borderColor: 'rgba(230,42,77,0.2)',
                                    }
                                }}
                            >
                                {/* Cover */}
                                {nl.coverImageUrl ? (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={nl.coverImageUrl}
                                        alt={nl.title}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Box sx={{
                                        height: 200,
                                        background: BRAND_GRADIENT,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative', overflow: 'hidden'
                                    }}>
                                        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                                        <NewspaperIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.3)' }} />
                                    </Box>
                                )}

                                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Date & PDF indicator */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <CalendarMonthIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b' }}>
                                                {new Date(nl.publishedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            </Typography>
                                        </Box>
                                        {nl.pdfUrl && (
                                            <Chip
                                                label="PDF"
                                                size="small"
                                                icon={<PictureAsPdfIcon />}
                                                sx={{
                                                    bgcolor: 'rgba(99,102,241,0.08)',
                                                    color: '#6366f1', fontWeight: 700,
                                                    border: '1px solid rgba(99,102,241,0.15)',
                                                    height: 22, fontSize: '0.65rem',
                                                    '& .MuiChip-icon': { color: '#6366f1 !important', fontSize: '12px' }
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Typography variant="h5" fontWeight={900} sx={{
                                        color: '#0f172a', lineHeight: 1.3, mb: 1.5,
                                        letterSpacing: '-0.5px',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>
                                        {nl.title}
                                    </Typography>

                                    {nl.emailSummary && (
                                        <Typography variant="body2" sx={{
                                            color: '#64748b', lineHeight: 1.6, flexGrow: 1, mb: 2,
                                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                        }}>
                                            {nl.emailSummary}
                                        </Typography>
                                    )}

                                    <Divider sx={{ mb: 2, mt: 'auto' }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" fontWeight={800} sx={{
                                            background: BRAND_GRADIENT,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            Read Full Issue
                                        </Typography>
                                        <Box sx={{
                                            width: 36, height: 36, borderRadius: '10px',
                                            background: BRAND_GRADIENT,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 12px -3px rgba(230,42,77,0.35)'
                                        }}>
                                            <ArrowForwardIcon sx={{ fontSize: 18, color: 'white' }} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default NewsletterPage;
