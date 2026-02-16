import { Container, Typography, Button, Box, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import GroupsIcon from '@mui/icons-material/Groups';
import CelebrationIcon from '@mui/icons-material/Celebration';

const PublicHome = () => {
    const navigate = useNavigate();

    const colors = {
        primary: '#8B2635',
        secondary: '#A0522D',
        accent: '#CD853F',
        light: '#FFF8F0',
        lightBg: '#FDF5E6'
    };

    const upcomingEvents = [
        {
            title: 'Diwali Celebration 2026',
            date: 'November 1, 2026',
            time: '6:00 PM onwards',
            location: 'Community Hall',
            description: 'Join us for a grand Diwali celebration with traditional rituals, cultural programs, and community dinner.'
        },
        {
            title: 'Community Gathering',
            date: 'Every Sunday',
            time: '10:00 AM - 12:00 PM',
            location: 'Temple Premises',
            description: 'Weekly community gathering for prayers, discussions, and networking.'
        },
        {
            title: 'Youth Cultural Program',
            date: 'December 15, 2026',
            time: '5:00 PM',
            location: 'Auditorium',
            description: 'Cultural program showcasing talents of our youth - dance, music, and drama performances.'
        }
    ];

    return (
        <Box sx={{ bgcolor: colors.lightBg, minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
                    color: 'white',
                    py: 12,
                    mb: 6,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TempleHinduIcon sx={{ fontSize: 40, mr: 2 }} />
                                <Chip
                                    label="नमस्ते | Welcome to Arya Vyshya Samaj"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.25)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        py: 2.5
                                    }}
                                />
                            </Box>
                            <Typography variant="h2" component="h1" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
                                Together We Grow, Together We Prosper
                            </Typography>
                            <Typography variant="h6" paragraph sx={{ opacity: 0.95, lineHeight: 1.8, mb: 4, fontSize: '1.15rem' }}>
                                A vibrant platform uniting our Hindu community across the globe. Connect with families,
                                support local businesses, find opportunities, and celebrate our rich cultural heritage together.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<LoginIcon />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: colors.primary,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        '&:hover': { bgcolor: colors.light, transform: 'translateY(-2px)', boxShadow: 4 },
                                        transition: 'all 0.3s',
                                        borderRadius: 2
                                    }}
                                >
                                    Join Our Community
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<InfoIcon />}
                                    onClick={() => navigate('/about')}
                                    sx={{
                                        borderColor: 'white',
                                        borderWidth: 2,
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: 'white',
                                            borderWidth: 2,
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s',
                                        borderRadius: 2
                                    }}
                                >
                                    Learn More
                                </Button>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <TempleHinduIcon sx={{ fontSize: 180, opacity: 0.25 }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Community Stats */}
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card elevation={0} sx={{ py: 3, bgcolor: 'white', border: `2px solid ${colors.accent}40`, borderRadius: 3 }}>
                                <Avatar sx={{ bgcolor: colors.primary, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                                    <GroupsIcon />
                                </Avatar>
                                <Typography variant="h3" fontWeight={700} sx={{ color: colors.primary }}>500+</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Families</Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card elevation={0} sx={{ py: 3, bgcolor: 'white', border: `2px solid ${colors.accent}40`, borderRadius: 3 }}>
                                <Avatar sx={{ bgcolor: colors.primary, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                                    <EventIcon />
                                </Avatar>
                                <Typography variant="h3" fontWeight={700} sx={{ color: colors.primary }}>50+</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Events</Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card elevation={0} sx={{ py: 3, bgcolor: 'white', border: `2px solid ${colors.accent}40`, borderRadius: 3 }}>
                                <Avatar sx={{ bgcolor: colors.primary, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                                    <CelebrationIcon />
                                </Avatar>
                                <Typography variant="h3" fontWeight={700} sx={{ color: colors.primary }}>12+</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Festivals</Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card elevation={0} sx={{ py: 3, bgcolor: 'white', border: `2px solid ${colors.accent}40`, borderRadius: 3 }}>
                                <Avatar sx={{ bgcolor: colors.primary, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                                    <TempleHinduIcon />
                                </Avatar>
                                <Typography variant="h3" fontWeight={700} sx={{ color: colors.primary }}>1</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Community</Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Events & Announcements Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" gutterBottom fontWeight={700} textAlign="center" sx={{ mb: 2, color: colors.primary }}>
                        Upcoming Events & Celebrations
                    </Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
                        Join us in celebrating our culture and traditions
                    </Typography>
                    <Grid container spacing={4}>
                        {upcomingEvents.map((event, index) => (
                            <Grid key={index} size={{ xs: 12, md: 4 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        border: `2px solid ${colors.accent}40`,
                                        borderRadius: 3,
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 28px ${colors.primary}25`,
                                            borderColor: colors.primary
                                        }
                                    }}
                                >
                                    <Box sx={{ bgcolor: colors.light, p: 3, textAlign: 'center', borderBottom: `2px solid ${colors.accent}40` }}>
                                        <EventIcon sx={{ fontSize: 48, color: colors.primary }} />
                                    </Box>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: colors.primary }}>
                                            {event.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>Date:</strong> {event.date}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>Time:</strong> {event.time}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>Location:</strong> {event.location}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
                                            {event.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* CTA Section */}
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                        borderRadius: 3,
                        p: 6,
                        textAlign: 'center',
                        color: 'white',
                        mb: 6,
                        boxShadow: `0 8px 32px ${colors.primary}30`
                    }}
                >
                    <TempleHinduIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h4" gutterBottom fontWeight={700}>
                        Be Part of Our Growing Family
                    </Typography>
                    <Typography variant="h6" paragraph sx={{ opacity: 0.95, mb: 3 }}>
                        Join hundreds of families in our vibrant community network
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        onClick={() => navigate('/login')}
                        sx={{
                            bgcolor: 'white',
                            color: colors.primary,
                            px: 5,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: colors.light,
                                transform: 'scale(1.05)',
                                boxShadow: 6
                            },
                            transition: 'all 0.3s'
                        }}
                    >
                        Join Now
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default PublicHome;
