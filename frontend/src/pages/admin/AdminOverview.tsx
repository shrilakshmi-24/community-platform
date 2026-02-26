import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardIcon from '@mui/icons-material/Dashboard';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface Stats {
    users: {
        total: number;
        pending: number;
    };
    content: {
        business: number;
        career: number;
        events: number;
        services: number;
    };
}
interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    onClick?: () => void;
}

const StatCard = ({ title, value, icon, onClick }: StatCardProps) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            cursor: onClick ? 'pointer' : 'default',
            bgcolor: 'white',
            boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': onClick ? {
                transform: 'translateY(-4px)',
                boxShadow: '0 15px 30px -10px rgba(230, 42, 77, 0.15)',
                borderColor: 'rgba(230, 42, 77, 0.3)'
            } : {}
        }}
        onClick={onClick}
    >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: '14px', background: BRAND_GRADIENT_LIGHT, color: '#E62A4D' }}>
                {icon}
            </Box>
            {onClick && (
                <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#E62A4D', background: BRAND_GRADIENT_LIGHT } }}>
                    <ArrowForwardIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
        <Box>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1, mb: 1 }}>
                {value}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {title}
            </Typography>
        </Box>
    </Paper>
);

const AdminOverview = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await client.get('/admin/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#E62A4D' }} /></Box>;
    if (error) return <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>;
    if (!stats) return null;

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <DashboardIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Dashboard Overview
                    </Typography>
                </Box>
            </Box>

            <Typography variant="h6" fontWeight={700} sx={{ color: '#475569', mb: 2, display: 'flex', alignItems: 'center' }}>
                User Management
            </Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Total Users"
                        value={stats.users.total}
                        icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                        onClick={() => navigate('/admin/users')}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Pending Approvals"
                        value={stats.users.pending}
                        icon={<PendingActionsIcon sx={{ fontSize: 32 }} />}
                        onClick={() => navigate('/admin/verify')}
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" fontWeight={700} sx={{ color: '#475569', mb: 2 }}>
                Content Moderation
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pending Business"
                        value={stats.content.business}
                        icon={<BusinessCenterIcon sx={{ fontSize: 28 }} />}
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pending Career"
                        value={stats.content.career}
                        icon={<WorkIcon sx={{ fontSize: 28 }} />}
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pending Events"
                        value={stats.content.events}
                        icon={<EventIcon sx={{ fontSize: 28 }} />}
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pending Services"
                        value={stats.content.services}
                        icon={<VolunteerActivismIcon sx={{ fontSize: 28 }} />}
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminOverview;
