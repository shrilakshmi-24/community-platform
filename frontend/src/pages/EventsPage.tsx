import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip, Skeleton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import EventIcon from '@mui/icons-material/Event';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    organizerId: string;
}

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEventDialog, setOpenEventDialog] = useState(false);
    const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '' });
    const { user } = useAuth();

    const { showToast } = useToast();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/community/events/all');
            setEvents(data.events);
        } catch (error) {
            console.error('Failed to fetch events', error);
            showToast('Failed to load events', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleCreateEvent = async () => {
        try {
            await client.post('/community/events/create', eventForm);
            setOpenEventDialog(false);
            setEventForm({ title: '', description: '', date: '', location: '' });
            showToast('Event created successfully! It will be visible once approved by an admin.', 'success');
            fetchEvents();
        } catch (error) {
            showToast('Failed to create event', 'error');
            console.error('Failed to create event', error);
        }
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#8B2635' }}>
                    Community Events
                </Typography>
                {user && user.role === 'ADMIN' && (
                    <Button variant="contained" onClick={() => setOpenEventDialog(true)} startIcon={<EventIcon />}>
                        Create Event
                    </Button>
                )}
            </Box>

            <Grid container spacing={4}>
                {loading ? (
                    // Skeleton Loading State
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
                                    <Skeleton variant="rectangular" height={24} width="40%" sx={{ mb: 2, borderRadius: 1 }} />
                                    <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
                                    <Skeleton variant="text" height={60} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : events.length > 0 ? (
                    events.map((event) => (
                        <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {event.title}
                                    </Typography>
                                    <Chip label={new Date(event.date).toLocaleDateString()} color="primary" size="small" sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        📍 {event.location}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {event.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 8, opacity: 0.7 }}>
                        <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">No upcoming events found</Typography>
                        <Typography variant="body2" color="textSecondary">Check back later for new community gatherings.</Typography>
                    </Box>
                )}
            </Grid>

            {/* Create Event Dialog */}
            <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Event Title"
                        fullWidth
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateEvent} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EventsPage;
