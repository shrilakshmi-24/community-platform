import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Menu, MenuItem, IconButton, Divider, Popover, GridLegacy as Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { Logo } from './Logo';

const Layout = () => {
    const { logout, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

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
                    <Box onClick={() => navigate('/home')} sx={{ mr: 4, cursor: 'pointer' }}>
                        <Logo mode="light" />
                    </Box>

                    {isAuthenticated ? (
                        <>
                            {/* Primary Navigation (Left) */}
                            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, alignItems: 'center' }}>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        </>
    );
};

export default Layout;
