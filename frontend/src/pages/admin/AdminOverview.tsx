import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

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
    color: string;
    onClick?: () => void;
}

const StatCard = ({ title, value, icon, color, onClick }: StatCardProps) => (
    <Paper
        elevation={3}
        sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: onClick ? 'pointer' : 'default',
            '&:hover': onClick ? { transform: 'translateY(-2px)', transition: '0.2s' } : {}
        }}
        onClick={onClick}
    >
        <Box>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h3" color={color}>
                {value}
            </Typography>
        </Box>
        <Box sx={{ color: color, opacity: 0.8 }}>
            {icon}
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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!stats) return null;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Dashboard Overview
            </Typography>

            <Grid container spacing={3}>
                {/* User Stats */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <StatCard
                        title="Total Users"
                        value={stats.users.total}
                        icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                        color="primary.main"
                        onClick={() => navigate('/admin/users')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <StatCard
                        title="Pending Approvals"
                        value={stats.users.pending}
                        icon={<PendingActionsIcon sx={{ fontSize: 40 }} />}
                        color="error.main"
                        onClick={() => navigate('/admin/verify')}
                    />
                </Grid>

                {/* Content Stats */}
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <StatCard
                        title="Pending Business"
                        value={stats.content.business}
                        icon={<BusinessCenterIcon sx={{ fontSize: 30 }} />}
                        color="warning.main"
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <StatCard
                        title="Pending Career"
                        value={stats.content.career}
                        icon={<WorkIcon sx={{ fontSize: 30 }} />}
                        color="warning.main"
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <StatCard
                        title="Pending Events"
                        value={stats.content.events}
                        icon={<EventIcon sx={{ fontSize: 30 }} />}
                        color="warning.main"
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <StatCard
                        title="Pending Services"
                        value={stats.content.services}
                        icon={<VolunteerActivismIcon sx={{ fontSize: 30 }} />}
                        color="warning.main"
                        onClick={() => navigate('/admin/moderation')}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminOverview;
