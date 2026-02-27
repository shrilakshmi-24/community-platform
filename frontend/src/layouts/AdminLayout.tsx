import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, IconButton, CssBaseline, Divider, Chip, Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

const drawerWidth = 256;
const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';

interface MenuItem {
    text: string;
    icon: React.ReactElement;
    path: string;
    superAdminOnly?: boolean;
}

const ALL_MENU_ITEMS: MenuItem[] = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Pending Approvals', icon: <VerifiedUserIcon />, path: '/admin/verify' },
    { text: 'Content Moderation', icon: <RateReviewIcon />, path: '/admin/moderation' },
    { text: 'Donations', icon: <VolunteerActivismIcon />, path: '/admin/donations' },
    { text: 'Scholarships', icon: <SchoolIcon />, path: '/admin/scholarships' },
    { text: 'Create Content', icon: <PostAddIcon />, path: '/admin/create-content' },
    { text: 'Newsletters', icon: <NewspaperIcon />, path: '/admin/newsletters' },
    { text: 'Reports & Analytics', icon: <BarChartIcon />, path: '/admin/reports' },
    { text: 'Help Desk', icon: <LiveHelpIcon />, path: '/admin/help-desk' },
    // SUPER_ADMIN only ↓
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users', superAdminOnly: true },
];

const AdminLayout = () => {
    const { logout, isAdmin, isSuperAdmin, user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (isLoading) return null;

    // Block non-admins from the admin portal entirely
    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    const menuItems = isSuperAdmin
        ? ALL_MENU_ITEMS
        : ALL_MENU_ITEMS.filter(item => !item.superAdminOnly);

    const roleLabel = isSuperAdmin ? 'Super Admin' : 'Admin';
    const RoleIcon = isSuperAdmin ? SupervisorAccountIcon : AdminPanelSettingsIcon;
    const roleColor = isSuperAdmin ? '#6366f1' : '#E62A4D';
    const roleBg = isSuperAdmin ? 'rgba(99,102,241,0.1)' : 'rgba(230,42,77,0.08)';

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0f172a' }}>
            {/* Logo */}
            <Toolbar sx={{ justifyContent: 'center', py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Logo mode="mixed" />
            </Toolbar>

            {/* Role badge */}
            <Box sx={{ px: 2.5, py: 2 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: 1.5, borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)'
                }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: roleBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <RoleIcon sx={{ fontSize: 18, color: roleColor }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" fontWeight={800} sx={{ color: roleColor, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                            {roleLabel}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }} noWrap>
                            {user?.userId?.slice(0, 16)}…
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Nav items */}
            <List sx={{ px: 1.5, flex: 1, pt: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.2, px: 1.5,
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                                    background: isActive ? BRAND_GRADIENT : 'transparent',
                                    boxShadow: isActive ? '0 4px 14px -4px rgba(230,42,77,0.5)' : 'none',
                                    '&:hover': {
                                        bgcolor: isActive ? undefined : 'rgba(255,255,255,0.06)',
                                        color: 'white',
                                    },
                                    '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 38 },
                                    '&.Mui-selected': { background: BRAND_GRADIENT },
                                    '&.Mui-selected:hover': { background: BRAND_GRADIENT },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit !important', minWidth: 38 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500 }}
                                />
                                {item.superAdminOnly && (
                                    <Chip
                                        label="SA"
                                        size="small"
                                        sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: 'rgba(99,102,241,0.25)', color: '#a5b4fc', ml: 1 }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

            {/* Logout */}
            <List sx={{ px: 1.5, pb: 1.5 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            borderRadius: '12px', py: 1.2, px: 1.5,
                            color: 'rgba(255,255,255,0.4)',
                            '&:hover': { bgcolor: 'rgba(239,68,68,0.1)', color: '#f87171' },
                            '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 38 },
                        }}
                    >
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* Top bar */}
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#0f172a',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            sx={{ display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#0f172a' }}>
                            Community Platform — Administration
                        </Typography>
                    </Box>
                    <Chip
                        icon={<RoleIcon sx={{ fontSize: '14px !important', color: `${roleColor} !important` }} />}
                        label={roleLabel}
                        size="small"
                        sx={{ bgcolor: roleBg, color: roleColor, fontWeight: 800, border: `1px solid ${roleColor}22` }}
                    />
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 4 },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: '#f8fafc',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;
