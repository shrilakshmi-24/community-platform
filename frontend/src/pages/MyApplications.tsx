import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Grid, Card, CardContent, Chip, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SchoolIcon from '@mui/icons-material/School';

interface Application {
    id: string;
    status: string;
    appliedAt: string;
    scholarship: {
        title: string;
        amount: number;
        deadline: string;
        educationLevel: string;
    };
}

const MyApplications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            if (!user) return;
            try {
                const { data } = await client.get('/community/scholarships/my-applications');
                setApplications(data.applications);
            } catch (err) {
                console.error('Failed to fetch applications', err);
                setError('Failed to load your applications.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'PENDING': return 'warning';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#8B2635' }}>
                My Scholarship Applications
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && applications.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.7 }}>
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">No applications found.</Typography>
                    <Typography variant="body2" color="textSecondary">You haven't applied for any scholarships yet.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {applications.map((app) => (
                        <Grid size={{ xs: 12 }} key={app.id}>
                            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {app.scholarship.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Amount: ₹{app.scholarship.amount.toLocaleString()} • Level: {app.scholarship.educationLevel}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={app.status}
                                            color={getStatusColor(app.status) as any}
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyApplications;
