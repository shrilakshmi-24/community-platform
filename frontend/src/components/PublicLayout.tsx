import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import { Logo } from './Logo';
import MenuIcon from '@mui/icons-material/Menu';

const PublicLayout = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const colors = {
        primary: '#FA8231',
        secondary: '#A0522D',
        accent: '#E62A4D',
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="sticky" sx={{
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                color: '#2D2D2D'
            }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: { xs: 1, md: 0 } }} onClick={() => navigate('/')}>
                            <Logo mode="light" />
                        </Box>

                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/')}
                                sx={{ fontWeight: 600, borderRadius: 50 }}
                            >
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<EventIcon />}
                                onClick={() => navigate('/events')}
                                sx={{ fontWeight: 600, borderRadius: 50 }}
                            >
                                Events
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/newsletters')}
                                sx={{ fontWeight: 600, borderRadius: 50 }}
                            >
                                Newsletters
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<InfoIcon />}
                                onClick={() => navigate('/about')}
                                sx={{ fontWeight: 600, borderRadius: 50 }}
                            >
                                About Us
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<LoginIcon />}
                                onClick={() => navigate('/login')}
                                sx={{
                                    bgcolor: colors.primary,
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: 50,
                                    px: 3,
                                    boxShadow: '0 4px 15px rgba(139, 38, 53, 0.3)',
                                    '&:hover': {
                                        bgcolor: colors.secondary,
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(139, 38, 53, 0.4)',
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

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, p: 2 },
                }}
            >
                <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', mb: 2 }}>
                    <Logo mode="mixed" />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/'); handleDrawerToggle(); }} sx={{ borderRadius: 2 }}>
                            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/events'); handleDrawerToggle(); }} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><EventIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Events" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/newsletters'); handleDrawerToggle(); }} sx={{ borderRadius: 2 }}>
                            <ListItemText primary="Newsletters" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/about'); handleDrawerToggle(); }} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><InfoIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="About Us" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <Divider sx={{ my: 2 }} />
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/login'); handleDrawerToggle(); }} sx={{ borderRadius: 2, bgcolor: colors.primary, color: 'white', '&:hover': { bgcolor: colors.secondary } }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><LoginIcon sx={{ color: 'white' }} /></ListItemIcon>
                            <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: 800 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
};

export default PublicLayout;
