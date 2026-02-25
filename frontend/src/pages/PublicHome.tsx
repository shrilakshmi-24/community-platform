import { Container, Typography, Button, Box, Card, Chip, Stack, GridLegacy as Grid, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import GroupsIcon from '@mui/icons-material/Groups';
import CelebrationIcon from '@mui/icons-material/Celebration';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import client from '../api/client';

// Shared Gradients
const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

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
                setStats({ families: 1240, businesses: 345, events: 82, supportGiven: 5000000 });
            }
        };
        fetchStats();
    }, []);

    const features = [
        { title: 'Community Directory', desc: 'Connect with families and members through our verified digital network.', icon: <GroupsIcon fontSize="large" />, path: '/login' },
        { title: 'Community Events', desc: 'Celebrate festivals and gatherings. Stay updated on all cultural activities.', icon: <CelebrationIcon fontSize="large" />, path: '/login' },
        { title: 'Business Network', desc: 'Grow together with local support, discover community-owned businesses.', icon: <HandshakeIcon fontSize="large" />, path: '/login' },
        { title: 'Student Support', desc: 'Access scholarships, career guidance, and mentorship programs.', icon: <SchoolIcon fontSize="large" />, path: '/login' },
    ];

    const successStories = [
        { title: "Scholarship Recipient", name: "Aditi Rao", role: "Data Science Student", desc: "Thanks to the Arya Vaishya Education Fund, I was able to pursue my Masters without financial burden. The mentorship I received was invaluable.", label: "EDUCATION", img: "A" },
        { title: "Business Growth", name: "Ramesh Kamath", role: "Founder, Kamath Spices", desc: "The community network helped us expand our distribution to 3 new cities. Real relationships built on trust made it possible.", label: "BUSINESS", img: "R" },
        { title: "Medical Aid", name: "Senior Care Initiative", role: "Welfare Committee", desc: "We successfully provided emergency support and health checkups to 150+ elderly members in record time.", label: "WELFARE", img: "S" }
    ];

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>

            {/* Hero Section */}
            <Box sx={{
                position: 'relative',
                pt: { xs: 15, md: 20 }, pb: { xs: 15, md: 24 },
                background: 'radial-gradient(120% 100% at 50% -10%, rgba(250,130,49,0.08) 0%, rgba(255,255,255,1) 100%)',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <Box sx={{ position: 'absolute', top: '10%', left: '-5%', width: 400, height: 400, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', top: '20%', right: '-10%', width: 500, height: 500, background: 'rgba(250, 130, 49, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                                <Chip
                                    label="OFFICIAL COMMUNITY PLATFORM"
                                    sx={{
                                        background: BRAND_GRADIENT_LIGHT,
                                        color: '#E62A4D',
                                        fontWeight: 800,
                                        mb: 4,
                                        borderRadius: '12px',
                                        px: 1,
                                        border: '1px solid rgba(230,42,77,0.2)',
                                        letterSpacing: '0.5px'
                                    }}
                                />
                                <Typography variant="h1" sx={{
                                    color: '#0f172a',
                                    mb: 3,
                                    fontSize: { xs: '3rem', md: '4.5rem' },
                                    lineHeight: 1.05,
                                    fontWeight: 900,
                                    letterSpacing: '-1.5px'
                                }}>
                                    Empowering the<br />
                                    <Box component="span" sx={{
                                        background: BRAND_GRADIENT,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    }}>
                                        Arya Vaishya
                                    </Box>
                                    <br />Community.
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#475569', mb: 5, fontWeight: 400, maxWidth: 480, lineHeight: 1.7, fontSize: '1.125rem' }}>
                                    A unified digital space to connect families, support businesses, and preserve our rich cultural heritage for future generations.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            background: BRAND_GRADIENT,
                                            fontSize: '1.05rem',
                                            fontWeight: 700,
                                            px: 5, py: 1.8,
                                            borderRadius: '16px',
                                            boxShadow: BRAND_SHADOW,
                                            textTransform: 'none',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            width: { xs: '100%', sm: 'auto' },
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 25px 50px -12px rgba(230, 42, 77, 0.5)'
                                            }
                                        }}
                                    >
                                        Join the Portal
                                    </Button>
                                    <Button
                                        variant="text"
                                        size="large"
                                        onClick={() => navigate('/about')}
                                        startIcon={
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                bgcolor: 'rgba(15, 23, 42, 0.05)', borderRadius: '50%', p: 0.5
                                            }}>
                                                <PlayArrowRoundedIcon sx={{ color: '#0f172a' }} />
                                            </Box>
                                        }
                                        sx={{
                                            color: '#0f172a',
                                            fontSize: '1.05rem',
                                            fontWeight: 600,
                                            px: 3, py: 1.5,
                                            textTransform: 'none',
                                            borderRadius: '16px',
                                            width: { xs: '100%', sm: 'auto' },
                                            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.03)' }
                                        }}
                                    >
                                        How it works
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                            >
                                <Box sx={{ position: 'relative', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Main Hero Graphic */}
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: 420,
                                        aspectRatio: '1/1',
                                        borderRadius: '32px',
                                        background: BRAND_GRADIENT,
                                        boxShadow: '0 30px 60px -15px rgba(230, 42, 77, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }} />

                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                            style={{ position: 'absolute', width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)' }}
                                        />

                                        <TempleHinduIcon sx={{ fontSize: 130, color: '#ffffff', zIndex: 1, filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.2))' }} />
                                        <Typography variant="h5" fontWeight={800} sx={{ color: '#ffffff', zIndex: 1, mt: 3, letterSpacing: '-0.5px' }}>
                                            Unity. Progress. Service.
                                        </Typography>
                                    </Box>

                                    {/* Floating Cards simulating App UI */}
                                    <motion.div
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ position: 'absolute', top: 20, right: -20 }}
                                    >
                                        <Card sx={{
                                            p: 2, borderRadius: '20px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                            display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.5)'
                                        }}>
                                            <Avatar sx={{ background: BRAND_GRADIENT, width: 40, height: 40 }}><CelebrationIcon sx={{ fontSize: 20 }} /></Avatar>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>New Event Setup</Typography>
                                                <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 800 }}>Ugadi Milan 2026</Typography>
                                            </Box>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [0, 15, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        style={{ position: 'absolute', bottom: 40, left: -30 }}
                                    >
                                        <Card sx={{
                                            p: 2, borderRadius: '20px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)'
                                        }}>
                                            <Typography variant="caption" fontWeight={700} sx={{ color: '#E62A4D', mb: 1, display: 'block' }}>Network Growing</Typography>
                                            <Stack direction="row" spacing={-1.5}>
                                                <Avatar sx={{ width: 36, height: 36, border: '2px solid white' }} src="https://i.pravatar.cc/100?img=1" />
                                                <Avatar sx={{ width: 36, height: 36, border: '2px solid white' }} src="https://i.pravatar.cc/100?img=5" />
                                                <Avatar sx={{ width: 36, height: 36, border: '2px solid white' }} src="https://i.pravatar.cc/100?img=3" />
                                                <Avatar sx={{ width: 36, height: 36, border: '2px solid white', background: BRAND_GRADIENT, color: 'white', fontSize: 12, fontWeight: 700 }}>+4k</Avatar>
                                            </Stack>
                                        </Card>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Bar */}
            <Box sx={{ position: 'relative', zIndex: 10, mt: -8 }}>
                <Container maxWidth="lg">
                    <Card sx={{
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(255,255,255,0.8)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        px: { xs: 3, md: 6 }, py: 4
                    }}>
                        <Grid container spacing={4} justifyContent="center" alignItems="center">
                            {[
                                { label: 'FAMILIES', value: stats.families.toLocaleString() },
                                { label: 'BUSINESSES', value: stats.businesses.toLocaleString() },
                                { label: 'EVENTS', value: stats.events.toLocaleString() },
                                { label: 'SUPPORT ₹', value: ((stats.supportGiven / 1000).toFixed(0)) + 'k+' }
                            ].map((stat, i) => (
                                <Grid item xs={6} md={3} key={i}>
                                    <Box sx={{ textAlign: 'center', position: 'relative' }}>
                                        {i !== 0 && <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: 0, top: '10%', bottom: '10%', width: '1px', background: 'linear-gradient(to bottom, transparent, #e2e8f0, transparent)' }} />}
                                        <Typography variant="h3" fontWeight={900} sx={{
                                            color: '#0f172a',
                                            mb: 0.5,
                                            letterSpacing: '-1px'
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#FA8231', fontWeight: 800, letterSpacing: '1px', fontSize: '0.75rem' }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Container>
            </Box>

            {/* Mission & Features */}
            <Box sx={{ pt: { xs: 15, md: 20 }, pb: { xs: 12, md: 16 } }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: { xs: 10, md: 14 }, maxWidth: 700, mx: 'auto' }}>
                        <Typography variant="overline" sx={{ color: '#E62A4D', fontWeight: 800, letterSpacing: '2px' }}>OUR ECOSYSTEM</Typography>
                        <Typography variant="h2" fontWeight={900} sx={{ color: '#0f172a', mb: 3, mt: 1, letterSpacing: '-1px', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                            Everything you need,<br />in one secure place.
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, lineHeight: 1.8, fontSize: '1.125rem' }}>
                            We have integrated tools specifically designed to uplift and assist every Arya Vaishya family, from networking to emergency aid.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{ height: '100%' }}
                                >
                                    <Card
                                        onClick={() => navigate(feature.path)}
                                        sx={{
                                            height: '100%',
                                            p: { xs: 4, md: 5 },
                                            bgcolor: '#ffffff',
                                            borderRadius: '24px',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.02)',
                                            border: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                                borderColor: '#FA8231',
                                                '& .icon-box': {
                                                    background: BRAND_GRADIENT,
                                                    color: 'white'
                                                }
                                            }
                                        }}
                                    >
                                        <Box className="icon-box" sx={{
                                            color: '#FA8231',
                                            mb: 4, p: 2.5,
                                            background: BRAND_GRADIENT_LIGHT,
                                            borderRadius: '16px',
                                            width: 'fit-content',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.7, flexGrow: 1 }}>
                                            {feature.desc}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Impact Section */}
            <Box sx={{ background: '#0f172a', py: { xs: 15, md: 20 }, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(230,42,77,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Typography variant="overline" sx={{ color: '#FA8231', fontWeight: 800, letterSpacing: '2px' }}>REAL IMPACT</Typography>
                            <Typography variant="h2" fontWeight={900} sx={{ color: '#ffffff', mb: 3, mt: 1, letterSpacing: '-1px' }}>
                                Stories of Success
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 5, lineHeight: 1.8, fontSize: '1.125rem' }}>
                                See how our platform is making a tangible difference in the lives of our members. When we support each other, the entire community rises.
                            </Typography>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    px: 4, py: 1.5,
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.05)' }
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Share Your Story
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Grid container spacing={3}>
                                {successStories.map((story, i) => (
                                    <Grid item xs={12} sm={i === 0 ? 12 : 6} key={i}>
                                        <Card sx={{
                                            p: 4,
                                            borderRadius: '24px',
                                            background: 'rgba(255,255,255,0.03)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white',
                                            height: '100%',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}>
                                            <Chip label={story.label} size="small" sx={{ mb: 3, background: 'rgba(250,130,49,0.15)', color: '#FA8231', fontWeight: 800, borderRadius: '8px', letterSpacing: '0.5px' }} />
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', mb: 4, lineHeight: 1.7, fontSize: '1.05rem' }}>
                                                "{story.desc}"
                                            </Typography>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ background: BRAND_GRADIENT }}>{story.img}</Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={800} sx={{ color: '#ffffff' }}>
                                                        {story.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                        {story.role}
                                                    </Typography>
                                                </Box>
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
            <Box sx={{ position: 'relative', py: { xs: 15, md: 24 } }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Box sx={{
                        p: { xs: 6, md: 10 },
                        borderRadius: '32px',
                        background: BRAND_GRADIENT,
                        color: 'white',
                        boxShadow: BRAND_SHADOW,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Shimmer effect */}
                        <Box sx={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transition: '0.5s', animation: 'shimmer 3s infinite' }} />
                        <style dangerouslySetInnerHTML={{ __html: '@keyframes shimmer { 100% { left: 100%; } }' }} />

                        <Typography variant="h2" fontWeight={900} sx={{ mb: 3, letterSpacing: '-1px', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                            Ready to join the community?
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 6, opacity: 0.9, fontSize: '1.25rem', maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}>
                            Sign up today to access events, directory, and support tailored for you.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                background: '#ffffff',
                                color: '#E62A4D',
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                px: 6, py: 2,
                                borderRadius: '16px',
                                textTransform: 'none',
                                boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)',
                                '&:hover': { background: '#f8fafc', transform: 'translateY(-2px)' }
                            }}
                        >
                            Create Free Account
                        </Button>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
};

export default PublicHome;
