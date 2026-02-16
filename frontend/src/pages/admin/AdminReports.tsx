import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText } from '@mui/material';
import client from '../../api/client';

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

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await client.get('/admin/analytics');
                setAnalytics(data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            }
        };
        fetchAnalytics();
    }, []);

    if (!analytics) return <Typography>Loading analytics...</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Reports & Analytics
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>User Geography (Top Cities)</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>City</TableCell>
                                        <TableCell align="right">Users</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {analytics.userGeography.map((item, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.city || 'Unknown'}</TableCell>
                                            <TableCell align="right">{item._count.city}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">Total Users</Typography>
                            <Typography variant="h3">{analytics.totalUsers}</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">Active Users</Typography>
                            <Typography variant="h3">{analytics.activeUsers}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                       <Typography variant="h6" gutterBottom>User Growth</Typography>
                         Placeholder for Chart
                       <Box sx={{ height: 300, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           Chart Component Here
                       </Box>
                    </Paper>
                </Grid>
            </Grid> */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Community Reach</Typography>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Total Registered Family Members"
                                    secondary={analytics.totalFamilyMembers}
                                    primaryTypographyProps={{ variant: 'subtitle1' }}
                                    secondaryTypographyProps={{ variant: 'h4', color: 'primary' }}
                                />
                            </ListItem>
                        </List>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Platform Activity</Typography>
                        <List>
                            <ListItem divider>
                                <ListItemText primary="Total Events Created" />
                                <Typography variant="h6">{analytics.contentActivity.events}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Service Requests Submitted" />
                                <Typography variant="h6">{analytics.contentActivity.serviceRequests}</Typography>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminReports;
