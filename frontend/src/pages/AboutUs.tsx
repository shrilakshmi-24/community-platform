import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';

const AboutUs = () => {
    // Maroon color palette matching home page
    const colors = {
        primary: '#8B2635',
        secondary: '#A0522D',
        accent: '#CD853F',
        light: '#FFF8F0',
        lightBg: '#FDF5E6'
    };

    const values = [
        {
            icon: <GroupsIcon sx={{ fontSize: 40 }} />,
            title: 'Community First',
            description: 'We believe in the power of collective growth and mutual support.'
        },
        {
            icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
            title: 'Trust & Integrity',
            description: 'Building relationships based on honesty, transparency, and respect.'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            title: 'Continuous Growth',
            description: 'Empowering members to achieve personal and professional excellence.'
        },
        {
            icon: <PublicIcon sx={{ fontSize: 40 }} />,
            title: 'Cultural Heritage',
            description: 'Preserving our traditions while embracing modern opportunities.'
        }
    ];

    const features = [
        {
            title: 'Business Network',
            description: 'Connect with community entrepreneurs, discover local businesses, and support economic growth within our community.'
        },
        {
            title: 'Career Development',
            description: 'Access job opportunities, mentorship programs, and professional guidance from experienced community members.'
        },
        {
            title: 'Community Groups',
            description: 'Join interest-based groups, participate in cultural activities, and build meaningful relationships.'
        },
        {
            title: 'Events & Programs',
            description: 'Stay informed about community gatherings, cultural celebrations, and networking opportunities.'
        }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    color: 'white',
                    py: 8,
                    mb: 6,
                    borderRadius: 2
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Chip
                            label="About Us"
                            sx={{
                                mb: 2,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 600
                            }}
                        />
                        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
                            Arya Vyshya Community
                        </Typography>
                        <Typography variant="h5" sx={{ opacity: 0.95, maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
                            A vibrant community dedicated to preserving our cultural heritage while fostering
                            growth, collaboration, and prosperity for all members.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Our Story Section */}
                <Box sx={{ mb: 8 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h3" component="h2" gutterBottom fontWeight={700} sx={{ color: colors.primary }}>
                                Our Story
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                                The Arya Vyshya community has a rich history spanning generations, rooted in strong
                                cultural values and traditions. Our community has always been known for its
                                entrepreneurial spirit, educational excellence, and commitment to social welfare.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                                As our community members spread across different cities and countries, we recognized
                                the need for a digital platform that could keep us connected, help us support each
                                other's businesses, share career opportunities, and maintain our cultural bonds.
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                                This portal was born from that vision – a modern solution to bring our traditional
                                community values into the digital age.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    bgcolor: '#f5f5f5',
                                    borderRadius: 3,
                                    p: 4,
                                    textAlign: 'center',
                                    border: '2px solid #e0e0e0'
                                }}
                            >
                                <GroupsIcon sx={{ fontSize: 120, color: colors.primary, mb: 2 }} />
                                <Typography variant="h4" fontWeight={700} sx={{ color: colors.primary }} gutterBottom>
                                    500+ Members
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Growing stronger together
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Mission & Vision Section */}
                <Box sx={{ mb: 8 }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    border: `2px solid ${colors.primary}`,
                                    borderRadius: 3,
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Avatar sx={{ bgcolor: colors.primary, width: 60, height: 60, mb: 2 }}>
                                        <VisibilityIcon sx={{ fontSize: 35 }} />
                                    </Avatar>
                                    <Typography variant="h4" component="h3" gutterBottom fontWeight={700}>
                                        Our Vision
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                                        To create a thriving, interconnected community where every member has access
                                        to opportunities for personal growth, professional success, and cultural
                                        enrichment. We envision a future where our community members support each
                                        other's aspirations and celebrate collective achievements.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    border: `2px solid ${colors.secondary}`,
                                    borderRadius: 3,
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Avatar sx={{ bgcolor: colors.secondary, width: 60, height: 60, mb: 2 }}>
                                        <FavoriteIcon sx={{ fontSize: 35 }} />
                                    </Avatar>
                                    <Typography variant="h4" component="h3" gutterBottom fontWeight={700}>
                                        Our Mission
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                                        To provide a comprehensive digital platform that connects community members,
                                        promotes local businesses, facilitates career development, and preserves our
                                        cultural heritage. We are committed to creating value through technology while
                                        maintaining the warmth of traditional community bonds.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Core Values Section */}
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant="h3" component="h2" gutterBottom fontWeight={700} sx={{ mb: 5 }}>
                        Our Core Values
                    </Typography>
                    <Grid container spacing={4}>
                        {values.map((value, index) => (
                            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: colors.primary,
                                            width: 80,
                                            height: 80,
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    >
                                        {value.icon}
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom fontWeight={700}>
                                        {value.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {value.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* About the Portal Section */}
                <Box
                    sx={{
                        mb: 8,
                        bgcolor: '#f8f9fa',
                        borderRadius: 3,
                        p: 5
                    }}
                >
                    <Typography variant="h3" component="h2" gutterBottom fontWeight={700} textAlign="center" sx={{ mb: 4 }}>
                        About This Portal
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', mb: 3 }}>
                        The Arya Vyshya Community Portal is a comprehensive digital platform designed to strengthen
                        the bonds within our community. Built with modern technology and user-centric design, this
                        portal serves as a central hub for all community activities and interactions.
                    </Typography>
                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid key={index} size={{ xs: 12, sm: 6 }}>
                                <Card elevation={0} sx={{ bgcolor: 'white', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: colors.primary }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {feature.description}
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
                        mb: 6
                    }}
                >
                    <Typography variant="h4" gutterBottom fontWeight={700}>
                        Join Our Growing Community
                    </Typography>
                    <Typography variant="h6" paragraph sx={{ opacity: 0.95 }}>
                        Be part of something bigger. Connect, collaborate, and grow with us.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;
