

import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';

const Layout = () => {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleProfileMenuClose();
    };

    const handleLogout = () => {
        logout();
        handleProfileMenuClose();
    };

    return (
        <>
            <AppBar position="static" sx={{ bgcolor: '#8B2635', boxShadow: '0 2px 8px rgba(139, 38, 53, 0.25)' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        Arya Vyshya Community
                    </Typography>
                    {isAuthenticated ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button color="inherit" onClick={() => navigate('/business')}>Business</Button>
                            <Button color="inherit" onClick={() => navigate('/career')}>Career</Button>
                            <Button color="inherit" onClick={() => navigate('/events')}>Events</Button>
                            <Button color="inherit" onClick={() => navigate('/achievements')}>Achievements</Button>
                            <Button color="inherit" onClick={() => navigate('/announcements')}>Announcements</Button>
                            <Button color="inherit" onClick={() => navigate('/scholarships')}>Scholarships</Button>
                            <Button color="inherit" onClick={() => navigate('/donations')} sx={{ color: '#FFD700', fontWeight: 'bold' }}>Donate</Button>
                            <Button color="inherit" onClick={() => navigate('/about')}>About Us</Button>
                            <Button color="inherit" onClick={() => navigate('/notifications')}>Notifications</Button>

                            {/* Profile Dropdown */}
                            <IconButton
                                color="inherit"
                                onClick={handleProfileMenuOpen}
                                sx={{ ml: 1 }}
                            >
                                <AccountCircleIcon />
                            </IconButton>
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
                                <MenuItem onClick={() => handleMenuItemClick('/profile/about-me')}>
                                    <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                                    About Me
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick('/profile/family')}>
                                    <FamilyRestroomIcon sx={{ mr: 1 }} fontSize="small" />
                                    About Family
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick('/profile/business')}>
                                    <BusinessCenterIcon sx={{ mr: 1 }} fontSize="small" />
                                    My Business
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
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
