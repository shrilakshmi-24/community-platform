import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import {
    Box, Typography, Button, Container, GridLegacy as Grid, Card, CardContent, Chip,
    Stack, Skeleton, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    organizerId: string;
    images?: string[];
    mediaUrl?: string;
    registrationRequired: boolean;
    registrationLink?: string;
    contactPerson?: string;
    contactEmail?: string;
    organizer?: {
        profile?: {
            fullName?: string;
            email?: string;
        }
    }
}

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchEventDetails(id);
        }
    }, [id]);

    const fetchEventDetails = async (eventId: string) => {
        try {
            setLoading(true);
            const { data } = await client.get(`/community/events/${eventId}`);
            setEvent(data.event);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Skeleton variant="text" height={40} width="60%" />
                <Skeleton variant="rectangular" height={300} sx={{ my: 4, borderRadius: 4 }} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} />
            </Container>
        );
    }

    if (!event) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h5">Event not found</Typography>
                <Button variant="outlined" onClick={() => navigate('/events')} sx={{ mt: 2 }}>
                    Back to Events
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/events')}
                sx={{ mb: 4, color: '#64748b' }}
            >
                Back to All Events
            </Button>

            <Grid container spacing={6}>
                <Grid item xs={12} md={8}>
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Chip label={event.registrationRequired ? "Registration Required" : "Open Event"}
                            color={event.registrationRequired ? "primary" : "success"}
                            size="small" sx={{ mb: 2, fontWeight: 700 }} />
                        <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', lineHeight: 1.2, mb: 2 }}>
                            {event.title}
                        </Typography>

                        <Stack direction="row" spacing={3} sx={{ color: '#64748b', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarMonthIcon fontSize="small" />
                                <Typography variant="body2" fontWeight={600}>
                                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTimeIcon fontSize="small" />
                                <Typography variant="body2" fontWeight={600}>
                                    {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        </Stack>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                            <LocationOnIcon fontSize="small" />
                            <Typography variant="body1">
                                {event.location}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Media */}
                    {(event.mediaUrl || (event.images && event.images.length > 0)) && (
                        <Box
                            component="img"
                            src={event.mediaUrl || event.images?.[0]}
                            sx={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 4, mb: 6, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                        />
                    )}

                    {/* Description */}
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#1e293b' }}>
                            About Event
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                            {event.description}
                        </Typography>
                    </Box>

                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'sticky', top: 100 }}>
                        <Card sx={{ borderRadius: 4, border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                            <Box sx={{ bgcolor: '#FA8231', p: 3, color: 'white' }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Event Details
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 4 }}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1 }}>ORGANIZER</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: '50%' }}>
                                                <PersonIcon sx={{ color: '#64748b' }} />
                                            </Box>
                                            <Typography variant="body2" fontWeight={600} color="#334155">
                                                {event.contactPerson || event.organizer?.profile?.fullName || 'Community Member'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {(event.contactEmail || event.organizer?.profile?.email) && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1 }}>CONTACT</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: '50%' }}>
                                                    <EmailIcon sx={{ color: '#64748b' }} />
                                                </Box>
                                                <Typography variant="body2" fontWeight={600} color="#334155">
                                                    {event.contactEmail || event.organizer?.profile?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    {event.registrationRequired ? (
                                        event.registrationLink ? (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                href={event.registrationLink}
                                                target="_blank"
                                                sx={{ bgcolor: '#FA8231', borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1.5 }}
                                            >
                                                Register Now
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                disabled // Or handle internal registration logic
                                                sx={{ bgcolor: '#FA8231', borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1.5 }}
                                            >
                                                Registration Required
                                            </Button>
                                        )
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1.5 }}
                                        >
                                            No Registration Needed
                                        </Button>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default EventDetailsPage;
