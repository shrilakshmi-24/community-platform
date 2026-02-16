import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';

const PublicLayout = () => {
    const navigate = useNavigate();

    const colors = {
        primary: '#8B2635',
        secondary: '#A0522D',
        accent: '#CD853F',
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="sticky" sx={{ bgcolor: colors.primary }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <TempleHinduIcon sx={{ fontSize: 32, mr: 1.5 }} />
                            <Typography variant="h6" component="div" fontWeight={700}>
                                Arya Vyshya Community
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/')}
                                sx={{ fontWeight: 600 }}
                            >
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<EventIcon />}
                                onClick={() => navigate('/events')}
                                sx={{ fontWeight: 600 }}
                            >
                                Events
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<InfoIcon />}
                                onClick={() => navigate('/about')}
                                sx={{ fontWeight: 600 }}
                            >
                                About Us
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<LoginIcon />}
                                onClick={() => navigate('/login')}
                                sx={{
                                    bgcolor: 'white',
                                    color: colors.primary,
                                    fontWeight: 700,
                                    '&:hover': {
                                        bgcolor: '#f5f5f5'
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            <Box
                component="footer"
                sx={{
                    bgcolor: colors.primary,
                    color: 'white',
                    py: 4,
                    mt: 'auto'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <TempleHinduIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6" gutterBottom fontWeight={700}>
                            Arya Vyshya Community
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Connecting families, celebrating traditions, building futures
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
                            © 2026 Arya Vyshya Samaj. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default PublicLayout;
