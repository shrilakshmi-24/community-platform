import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Card, CardContent, Chip,
    Button, Grid, CircularProgress, Alert
} from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface HelpRequest {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    createdAt: string;
    location: string;
    bloodGroup: string;
    contactPhone: string;
    user: {
        mobileNumber: string;
        profile: {
            fullName: string;
        }
    }
}

const EmergencyRequests = () => {
    useAuth();
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmergencyRequests();
    }, []);

    const fetchEmergencyRequests = async () => {
        try {
            // Backend restriction ensures non-admins only see 'Blood' category
            const { data } = await client.get('/help-request/all?category=Blood');
            setRequests(data.requests);
        } catch (error) {
            console.error('Failed to fetch emergency requests', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
                    <BloodtypeIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
                    Emergency & Blood Donations
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Urgent community requests. Your help can save a life.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : requests.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No active emergency or blood donation requests at the moment.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {requests.map((req) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={req.id}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderLeft: '6px solid #d32f2f', // Red border for emergency aspect
                                boxShadow: 3
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip
                                            label={req.bloodGroup || 'Emergency'}
                                            color="error"
                                            icon={<BloodtypeIcon />}
                                        />
                                        <Chip
                                            label="Urgent"
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                        />
                                    </Box>

                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        {req.title}
                                    </Typography>

                                    <Typography variant="body2" paragraph>
                                        {req.description}
                                    </Typography>

                                    <Box sx={{ mt: 'auto' }}>
                                        {req.location && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                                                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="body2">{req.location}</Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                                            <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                                            <Typography variant="body2" fontWeight="bold">
                                                {req.contactPhone || req.user?.mobileNumber || 'Contact Admin'}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                            href={`tel:${req.contactPhone || req.user?.mobileNumber}`}
                                        >
                                            Call Now
                                        </Button>
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

export default EmergencyRequests;
