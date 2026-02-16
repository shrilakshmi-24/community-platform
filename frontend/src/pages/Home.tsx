// import { useAuth } from '../context/AuthContext'; // Not needed for now
import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandshakeIcon from '@mui/icons-material/Handshake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import client from '../api/client';

interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    [key: string]: unknown;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    user?: { profile?: { fullName?: string } };
    [key: string]: unknown;
}

const Home = () => {
    const navigate = useNavigate();
    const [recentEvents, setRecentEvents] = useState<Event[]>([]);
    const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, achievementsRes] = await Promise.all([
                    client.get('/community/events/all'),
                    client.get('/community/achievements/all')
                ]);
                setRecentEvents(eventsRes.data.events || []);
                setRecentAchievements(achievementsRes.data.achievements || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);

    // Elegant maroon/burgundy color palette
    const colors = {
        primary: '#8B2635',      // Deep maroon
        secondary: '#A0522D',    // Sienna brown
        accent: '#CD853F',       // Peru gold
        light: '#FFF8F0',        // Warm white
        lightBg: '#FDF5E6'       // Old lace
    };

    const features = [
        {
            icon: <BusinessIcon sx={{ fontSize: 48, color: colors.primary }} />,
            title: 'Business Directory',
            description: 'Support community businesses and connect with fellow entrepreneurs in our network.',
            action: () => navigate('/business'),
            color: '#FFF8F0'
        },
        {
            icon: <WorkIcon sx={{ fontSize: 48, color: colors.secondary }} />,
            title: 'Career Opportunities',
            description: 'Find jobs and mentorship within our trusted community network.',
            action: () => navigate('/career'),
            color: '#FFF8F0'
        },
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 48, color: colors.primary }} />,
            title: 'Achievements',
            description: 'Celebrate the success and milestones of our community members.',
            action: () => navigate('/achievements'),
            color: '#FFF8F0'
        },
        {
            icon: <EventIcon sx={{ fontSize: 48, color: colors.secondary }} />,
            title: 'Events & Celebrations',
            description: 'Participate in cultural programs, festivals, and community gatherings.',
            action: () => navigate('/events'),
            color: '#FFF8F0'
        }
    ];

    const stats = [
        { value: '500+', label: 'Members', icon: <GroupsIcon /> },
        { value: '150+', label: 'Businesses', icon: <BusinessIcon /> },
        { value: '80+', label: 'Opportunities', icon: <WorkIcon /> },
        { value: '50+', label: 'Events', icon: <EventIcon /> }
    ];

    const values = [
        { icon: <TempleHinduIcon />, text: 'Cultural Heritage' },
        { icon: <FavoriteIcon />, text: 'Unity & Support' },
        { icon: <HandshakeIcon />, text: 'Trust & Integrity' },
        { icon: <EmojiEventsIcon />, text: 'Collective Growth' }
    ];

    return (
        <Box sx={{ bgcolor: colors.lightBg }}>
            {/* Hero Section with Traditional Theme */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
                    color: 'white',
                    py: 10,
                    mb: 6,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(139, 38, 53, 0.25)'
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
                                    onClick={() => navigate('/profile')}
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
                {/* Recent Highlights Section */}
                {(recentEvents.length > 0 || recentAchievements.length > 0) && (
                    <Box sx={{ mb: 8 }}>
                        <Typography variant="h3" component="h2" gutterBottom fontWeight={700} textAlign="center" sx={{ mb: 4, color: colors.primary }}>
                            Recent Highlights
                        </Typography>
                        <Grid container spacing={4}>
                            {recentEvents.slice(0, 2).map((event) => (
                                <Grid key={event.id} size={{ xs: 12, md: 6 }}>
                                    <Card sx={{ display: 'flex', height: '100%', borderRadius: 2, boxShadow: 3 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <CardContent sx={{ flex: '1 0 auto' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <EventIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography component="div" variant="h6" fontWeight="bold">
                                                        {event.title}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {event.description.substring(0, 100)}...
                                                </Typography>
                                            </CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                                                <Button size="small" onClick={() => navigate('/events')}>Read More</Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                            {recentAchievements.slice(0, 2).map((achievement) => (
                                <Grid key={achievement.id} size={{ xs: 12, md: 6 }}>
                                    <Card sx={{ display: 'flex', height: '100%', borderRadius: 2, boxShadow: 3 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <CardContent sx={{ flex: '1 0 auto' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <EmojiEventsIcon sx={{ color: colors.accent, mr: 1 }} />
                                                    <Typography component="div" variant="h6" fontWeight="bold">
                                                        {achievement.title}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="subtitle2" color="text.secondary" component="div">
                                                    Awarded to: {achievement.user?.profile?.fullName || 'Member'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {achievement.description.substring(0, 100)}...
                                                </Typography>
                                            </CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                                                <Button size="small" onClick={() => navigate('/achievements')}>View Details</Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Stats Section */}
                <Box sx={{ mb: 8 }}>
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid key={index} size={{ xs: 6, sm: 3 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        textAlign: 'center',
                                        py: 3,
                                        bgcolor: 'white',
                                        border: `2px solid ${colors.accent}40`,
                                        borderRadius: 3,
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: `0 8px 24px ${colors.primary}30`,
                                            borderColor: colors.primary
                                        }
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: colors.primary, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Typography variant="h3" fontWeight={700} sx={{ color: colors.primary }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                        {stat.label}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Core Values Section */}
                <Box sx={{ mb: 8, textAlign: 'center', bgcolor: 'white', borderRadius: 3, p: 5, border: `2px solid ${colors.accent}40` }}>
                    <Typography variant="h3" component="h2" gutterBottom fontWeight={700} sx={{ color: colors.primary, mb: 2 }}>
                        Our Community Values
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
                        Rooted in tradition, growing together with shared values
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {values.map((value, index) => (
                            <Grid key={index} size={{ xs: 6, sm: 6, md: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: colors.primary, width: 60, height: 60 }}>
                                        {value.icon}
                                    </Avatar>
                                    <Typography variant="body1" fontWeight={700} sx={{ color: colors.secondary }}>
                                        {value.text}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Features Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" gutterBottom fontWeight={700} textAlign="center" sx={{ mb: 2, color: colors.primary }}>
                        How We Serve Our Community
                    </Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
                        Connecting families, creating opportunities, celebrating together
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: `2px solid ${colors.accent}40`,
                                        borderRadius: 3,
                                        transition: 'all 0.3s',
                                        bgcolor: 'white',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 28px ${colors.primary}25`,
                                            borderColor: colors.primary
                                        }
                                    }}
                                >
                                    <Box sx={{ bgcolor: feature.color, p: 3, textAlign: 'center', borderBottom: `2px solid ${colors.accent}40` }}>
                                        {feature.icon}
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Typography variant="h6" component="h3" gutterBottom fontWeight={700} sx={{ color: colors.primary }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ p: 3, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={feature.action}
                                            sx={{
                                                py: 1.2,
                                                fontWeight: 700,
                                                bgcolor: colors.primary,
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: colors.secondary, transform: 'scale(1.02)' },
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            Explore
                                        </Button>
                                    </CardActions>
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
                        onClick={() => navigate('/profile')}
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
                        Complete Your Profile
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;
