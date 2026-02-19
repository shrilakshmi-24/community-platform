import { Container, Typography, Button, Box, Card, Chip, Stack, GridLegacy as Grid, Avatar } from '@mui/material';
// import Grid from '@mui/material/Grid2'; // broken
import { useNavigate } from 'react-router-dom';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import GroupsIcon from '@mui/icons-material/Groups';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SchoolIcon from '@mui/icons-material/School';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import client from '../api/client';

// Define StatCard locally
const PublicHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ families: 0, businesses: 0, events: 0, supportGiven: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await client.get('/community/stats');
                setStats(data.stats);
            } catch (error) {
                console.error("Failed to fetch stats", error);
                setStats({ families: 120, businesses: 45, events: 12, supportGiven: 500000 });
            }
        };
        fetchStats();
    }, []);

    const features = [
        { title: 'Community Directory', desc: 'Connect with families and members.', icon: <GroupsIcon fontSize="large" />, path: '/login' },
        { title: 'Community Events', desc: 'Celebrate festivals and gatherings.', icon: <CelebrationIcon fontSize="large" />, path: '/login' },
        { title: 'Business Network', desc: 'Grow together with local support.', icon: <HandshakeIcon fontSize="large" />, path: '/login' },
        { title: 'Student Support', desc: 'Scholarships and career guidance.', icon: <SchoolIcon fontSize="large" />, path: '/login' },
    ];

    const successStories = [
        { title: "Scholarship Recipient", name: "Aditi Rao", desc: "Thanks to the Arya Vaishya Education Fund, I pursued my Masters in Data Science.", label: "EDUCATION" },
        { title: "Business Growth", name: "Kamath Spices", desc: "The community network helped us expand our distribution to 3 new cities.", label: "BUSINESS" },
        { title: "Medical Aid", name: "Senior Care Initiative", desc: "Provided emergency support to 15 elderly members in record time.", label: "WELFARE" }
    ];

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* Hero Section */}
            <Box sx={{
                pt: 15, pb: 12,
                background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                <Chip label="OFFICIAL COMMUNITY PLATFORM" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, mb: 3, borderRadius: 2 }} />
                                <Typography variant="h1" fontWeight={800} sx={{ color: '#1e293b', mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1 }}>
                                    Empowering the <br />
                                    <span style={{ color: '#2563eb' }}>Arya Vaishya Community.</span>
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#64748b', mb: 5, fontWeight: 400, maxWidth: 500, lineHeight: 1.6 }}>
                                    A unified digital space to connect families, support businesses, and preserve our rich cultural heritage for future generations.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            bgcolor: '#2563eb',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            px: 5, py: 1.5,
                                            borderRadius: 2,
                                            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                                            '&:hover': { bgcolor: '#1d4ed8', transform: 'translateY(-2px)' }
                                        }}
                                    >
                                        JOIN THE PORTAL
                                    </Button>
                                    <Button
                                        variant="text"
                                        size="large"
                                        onClick={() => navigate('/about')}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            color: '#64748b',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            px: 3,
                                            '&:hover': { color: '#1e293b', bgcolor: 'transparent' }
                                        }}
                                    >
                                        Our Mission
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Box sx={{
                                    position: 'relative',
                                    height: 450,
                                    bgcolor: '#ffffff',
                                    borderRadius: 6,
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #e2e8f0',
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                                    <TempleHinduIcon sx={{ fontSize: 160, color: '#2563eb', opacity: 0.1, mb: 2 }} />
                                    <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', zIndex: 1 }}>
                                        Unity. Progress. Service.
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', mt: 1, zIndex: 1, letterSpacing: 2, textTransform: 'uppercase' }}>
                                        Est. 2026
                                    </Typography>

                                    {/* Abstract floating cards */}
                                    <Card sx={{ position: 'absolute', bottom: 40, right: -20, p: 2, borderRadius: 3, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: 180, display: { xs: 'none', lg: 'block' } }}>
                                        <Typography variant="caption" fontWeight={700} sx={{ color: '#0d9488' }}>Recently Joined</Typography>
                                        <Stack direction="row" spacing={1} mt={1}>
                                            <Avatar sx={{ width: 30, height: 30, bgcolor: '#f1f5f9' }} />
                                            <Avatar sx={{ width: 30, height: 30, bgcolor: '#f1f5f9' }} />
                                            <Avatar sx={{ width: 30, height: 30, bgcolor: '#2563eb', fontSize: 12 }}>+40</Avatar>
                                        </Stack>
                                    </Card>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Bar */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#2563eb' }}>{stats.families}</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>FAMILIES REGISTERED</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#0d9488' }}>{stats.businesses}</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>LOCAL BUSINESSES</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#7c3aed' }}>{stats.events}</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>COMMUNITY EVENTS</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#f59e0b' }}>₹{(stats.supportGiven / 1000).toFixed(0)}k+</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>SUPPORT GRANTED</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Mission Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 10, maxWidth: 700, mx: 'auto' }}>
                    <VolunteerActivismIcon sx={{ fontSize: 50, color: '#2563eb', mb: 2 }} />
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', mb: 3 }}>
                        Why We Built This Platform
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#475569', fontWeight: 400, lineHeight: 1.8 }}>
                        To create a thriving ecosystem where every Arya Vaishya family feels connected, supported, and empowered. From educational aid to business networking, we are here to uplift each other.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div whileHover={{ y: -5 }}>
                                <Card
                                    onClick={() => navigate(feature.path)}
                                    sx={{
                                        height: '100%',
                                        p: 4,
                                        bgcolor: 'white',
                                        borderRadius: 4,
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                        border: '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': { borderColor: '#2563eb', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }
                                    }}
                                >
                                    <Box sx={{ color: '#2563eb', mb: 3, p: 2, bgcolor: '#eff6ff', borderRadius: 3, width: 'fit-content' }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#1e293b' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                        {feature.desc}
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Impact Section */}
            <Box sx={{ bgcolor: '#eff6ff', py: 12, borderTop: '1px solid #dbeafe', borderBottom: '1px solid #dbeafe' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Typography variant="overline" sx={{ color: '#2563eb', fontWeight: 700, letterSpacing: 1 }}>REAL IMPACT</Typography>
                            <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', mb: 3, mt: 1 }}>
                                Stories of Success
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#475569', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                                See how our platform is making a tangible difference in the lives of our members. From education to entrepreneurship, we are growing together.
                            </Typography>
                            <Button variant="contained" size="large" sx={{ bgcolor: '#0f172a' }} onClick={() => navigate('/login')}>
                                Share Your Story
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Grid container spacing={3}>
                                {successStories.map((story, i) => (
                                    <Grid item xs={12} sm={6} key={i}>
                                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: 'none' }}>
                                            <Chip label={story.label} size="small" sx={{ mb: 2, bgcolor: '#e0f2fe', color: '#0284c7', fontWeight: 700, borderRadius: 1 }} />
                                            <Typography variant="body1" fontWeight={600} sx={{ color: '#334155', mb: 2, fontStyle: 'italic' }}>
                                                "{story.desc}"
                                            </Typography>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#cbd5e1' }}>{story.name[0]}</Avatar>
                                                <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b' }}>
                                                    {story.name}
                                                </Typography>
                                            </Stack>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Footer */}
            <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', mb: 3 }}>
                    Ready to join the community?
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 5 }}>
                    Sign up today to access events, directory, and support tailored for you.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                        bgcolor: '#2563eb',
                        fontSize: '1.2rem',
                        px: 6, py: 2,
                        borderRadius: 3,
                        boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
                        '&:hover': { bgcolor: '#1d4ed8', transform: 'translateY(-2px)' }
                    }}
                >
                    GET STARTED
                </Button>
            </Container>

        </Box>
    );
};

export default PublicHome;
