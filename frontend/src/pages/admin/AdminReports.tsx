import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, CircularProgress, Avatar, LinearProgress } from '@mui/material';
import client from '../../api/client';
import InsightsIcon from '@mui/icons-material/Insights';
import PublicIcon from '@mui/icons-material/Public';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CampaignIcon from '@mui/icons-material/Campaign';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface AnalyticsData {
    userGeography: { city: string; _count: { city: number } }[];
    totalUsers: number;
    activeUsers: number;
    totalFamilyMembers: number;
    contentActivity: {
        events: number;
        serviceRequests: number;
    };
}

const AdminReports = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await client.get('/admin/analytics');
                setAnalytics(data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const paperSx = {
        p: { xs: 3, md: 4 },
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#E62A4D' }} /></Box>;
    if (!analytics) return <Typography>Error loading analytics data.</Typography>;

    const maxCityUsers = Math.max(...analytics.userGeography.map(c => c._count.city), 1);

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <InsightsIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Reports & Analytics
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Platform insights, metrics, and demographics
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ ...paperSx, p: 3 }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Avatar sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', width: 44, height: 44 }}>
                                <PeopleOutlineIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1 }}>{analytics.totalUsers}</Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', mt: 0.5 }}>Total Users</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ ...paperSx, p: 3 }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Avatar sx={{ bgcolor: '#ecfdf5', color: '#10b981', width: 44, height: 44 }}>
                                <InsightsIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1 }}>{analytics.activeUsers}</Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', mt: 0.5 }}>Active Users</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ ...paperSx, p: 3 }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 44, height: 44 }}>
                                <FamilyRestroomIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1 }}>{analytics.totalFamilyMembers}</Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', mt: 0.5 }}>Family Members</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ ...paperSx, p: 0 }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <PublicIcon sx={{ color: '#FA8231' }} />
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
                                User Geography (Top Cities)
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>City</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2, width: '40%' }}>Distribution</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Users</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {analytics.userGeography.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 6, color: '#94a3b8', fontWeight: 600 }}>No demographic data available.</TableCell>
                                        </TableRow>
                                    ) : (
                                        analytics.userGeography.map((item, index: number) => {
                                            const percentage = Math.round((item._count.city / maxCityUsers) * 100);
                                            return (
                                                <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{item.city || 'Unknown'}</TableCell>
                                                    <TableCell>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={percentage}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                bgcolor: '#f1f5f9',
                                                                '& .MuiLinearProgress-bar': { background: BRAND_GRADIENT, borderRadius: 4 }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 800, color: '#0f172a' }}>{item._count.city}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ ...paperSx, p: 0, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CampaignIcon sx={{ color: '#E62A4D' }} />
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
                                Platform Activity
                            </Typography>
                        </Box>

                        <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#475569' }}>
                                    Total Events Created
                                </Typography>
                                <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
                                    {analytics.contentActivity.events}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#475569' }}>
                                    Service Requests Submitted
                                </Typography>
                                <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
                                    {analytics.contentActivity.serviceRequests}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminReports;
