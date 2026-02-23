import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Menu, MenuItem, IconButton, Divider, Popover, GridLegacy as Grid, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DomainIcon from '@mui/icons-material/Domain';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { Logo } from './Logo';

const Layout = () => {
    const { logout, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Responsive Mobile Drawer State
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Profile Menu State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Explore Menu State (Mega Menu)
    const [exploreAnchorEl, setExploreAnchorEl] = useState<null | HTMLElement>(null);
    const exploreOpen = Boolean(exploreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleExploreClick = (event: React.MouseEvent<HTMLElement>) => {
        setExploreAnchorEl(event.currentTarget);
    };

    const handleExploreClose = () => {
        setExploreAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        handleExploreClose();
        handleProfileMenuClose();
    };

    const handleLogout = () => {
        logout();
        handleProfileMenuClose();
    };

    return (
        <>
            <AppBar position="static" color="transparent" sx={{ bgcolor: 'white', color: '#1e293b' }}>
                <Toolbar>
                    <Box onClick={() => navigate('/home')} sx={{ mr: { xs: 2, md: 4 }, cursor: 'pointer', flexGrow: { xs: 1, md: 0 } }}>
                        <Logo mode="light" />
                    </Box>

                    {/* Mobile Menu Icon */}
                    {isAuthenticated && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {isAuthenticated ? (
                        <>
                            {/* Primary Navigation (Left) */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1, alignItems: 'center' }}>
                                <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>

                                <Button
                                    color="inherit"
                                    onClick={handleExploreClick}
                                    endIcon={<KeyboardArrowDownIcon />}
                                >
                                    Explore
                                </Button>

                                <Button color="inherit" onClick={() => navigate('/donations')}>Donate</Button>
                                <Button color="inherit" onClick={() => navigate('/about')}>About</Button>
                            </Box>

                            {/* Utilities (Right) */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => navigate('/help/emergency')}
                                    sx={{ mr: 1, fontWeight: 'bold' }}
                                >
                                    Emergency
                                </Button>

                                <IconButton color="inherit" onClick={() => navigate('/notifications')}>
                                    <NotificationsIcon />
                                </IconButton>

                                <IconButton
                                    color="inherit"
                                    onClick={handleProfileMenuOpen}
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                            </Box>

                            {/* Explore Mega Menu */}
                            <Popover
                                open={exploreOpen}
                                anchorEl={exploreAnchorEl}
                                onClose={handleExploreClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                PaperProps={{
                                    sx: { width: '80%', maxWidth: 1000, p: 4, mt: 1, borderRadius: 3 }
                                }}
                            >
                                <Grid container spacing={4}>
                                    {/* Community */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            Community
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/events')}>Events</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/achievements')}>Achievements</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/newsletters')}>Newsletters</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/announcements')}>Announcements</Button>
                                        </Box>
                                    </Grid>

                                    {/* Career & Growth */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            Career & Growth
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/career')}>Jobs</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/scholarships')}>Scholarships</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/education-loan')}>Loans</Button>
                                        </Box>
                                    </Grid>

                                    {/* Business */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            Business
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/business')}>Directory</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/business-collaboration')}>Collaboration</Button>
                                            {user?.isBusinessOwner && (
                                                <Button color="inherit" size="small" onClick={() => handleNavigate('/business-collaboration')} sx={{ textAlign: 'left' }}>
                                                    Post Request
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Support */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            Support
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/help/my-requests')}>Help Requests</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/help/emergency')}>Blood</Button>
                                            <Button color="inherit" size="small" onClick={() => handleNavigate('/help/my-requests')}>Hostels</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Popover>

                            {/* Profile Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleProfileMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={() => handleNavigate('/profile/about-me')}>
                                    <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                                    About Me
                                </MenuItem>
                                <MenuItem onClick={() => handleNavigate('/profile/family')}>
                                    <FamilyRestroomIcon sx={{ mr: 1 }} fontSize="small" />
                                    About Family
                                </MenuItem>
                                <MenuItem onClick={() => handleNavigate('/profile/business')}>
                                    <BusinessCenterIcon sx={{ mr: 1 }} fontSize="small" />
                                    My Business
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Outlet />
            </Container>

            {/* Mobile Drawer */}
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
                        <ListItemButton onClick={() => handleNavigate('/home')} sx={{ borderRadius: 2 }}>
                            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate('/events')} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><EventIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Events" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate('/achievements')} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><EmojiEventsIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Achievements" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate('/donations')} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><AccountBalanceIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Donate" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate('/business')} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><DomainIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Business Directory" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate('/help/emergency')} sx={{ borderRadius: 2, bgcolor: '#fff0eb' }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><LocalHospitalIcon color="error" /></ListItemIcon>
                            <ListItemText primary="Emergency Help" primaryTypographyProps={{ color: 'error', fontWeight: 800 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider sx={{ my: 2 }} />
                <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate('/profile/about-me')} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><PersonIcon /></ListItemIcon>
                            <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Layout;
