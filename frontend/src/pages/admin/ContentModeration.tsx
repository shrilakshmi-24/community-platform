import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Button, Chip, CircularProgress, Alert, MenuItem, FormControl, Select, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import client from '../../api/client';

interface User {
    id: string;
    email: string;
    profile?: {
        fullName?: string;
    };
    [key: string]: unknown;
}

const ContentModeration = () => {
    const [tabValue, setTabValue] = useState(0);
    const [content, setContent] = useState<{ business: unknown[]; career: unknown[]; events: unknown[]; services: unknown[] }>({ business: [], career: [], events: [], services: [] });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await client.get(`/admin/content?status=${statusFilter}`);
            setContent(data);
        } catch (error) {
            console.error('Failed to fetch content', error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    // Event Form State
    const [openEventDialog, setOpenEventDialog] = useState(false);
    const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '' });

    // Achievement Form State
    const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
    const [achievementForm, setAchievementForm] = useState({ userId: '', title: '', description: '', date: '', proofUrl: '' });
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (openAchievementDialog) {
            fetchUsers();
        }
    }, [openAchievementDialog]);

    const fetchUsers = async () => {
        try {
            const { data } = await client.get('/admin/users');
            setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleCreateEvent = async () => {
        try {
            await client.post('/community/events/create', eventForm);
            setOpenEventDialog(false);
            setEventForm({ title: '', description: '', date: '', location: '' });
            fetchContent();
            alert('Event created successfully!');
        } catch (error) {
            console.error('Failed to create event', error);
            alert('Failed to create event');
        }
    };

    const handleCreateAchievement = async () => {
        try {
            if (!achievementForm.userId) {
                alert('Please select a user');
                return;
            }
            await client.post('/admin/achievements', achievementForm);
            setOpenAchievementDialog(false);
            setAchievementForm({ userId: '', title: '', description: '', date: '', proofUrl: '' });
            alert('Achievement awarded successfully!');
        } catch (error) {
            console.error('Failed to create achievement', error);
            alert('Failed to create achievement');
        }
    };

    useEffect(() => {
        fetchContent();
    }, [fetchContent]); // statusFilter is in fetchContent dependency

    const handleApprove = async (type: string, id: string, status: string) => {
        try {
            await client.post('/admin/content/approve', { type, id, status });
            fetchContent();
        } catch {
            alert('Failed to update content status');
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatusFilter(event.target.value as string);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'PENDING': return 'warning';
            default: return 'default';
        }
    };

    interface ContentItem {
        id: string;
        title?: string;
        businessName?: string;
        subject?: string;
        status: string;
        description?: string;
        details?: string;
        company?: string;
        location?: string;
        date?: string;
        user?: User;
        organizer?: User;
        [key: string]: unknown;
    }

    const ListingCard = ({ item, type }: { item: ContentItem, type: string }) => (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                        <Typography variant="h6">
                            {item.title || item.businessName || item.subject}
                        </Typography>
                        <Chip
                            label={item.status}
                            color={getStatusColor(item.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                            size="small"
                            sx={{ mr: 1, mt: 0.5 }}
                        />
                        <Chip label={type.toUpperCase()} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                    </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Submitted by: {item.user?.profile?.fullName || item.organizer?.profile?.fullName || 'Unknown'}
                </Typography>

                <Typography variant="body1" paragraph>
                    {item.description || item.details}
                </Typography>

                {item.company && <Typography variant="body2"><strong>Company:</strong> {item.company}</Typography>}
                {item.location && <Typography variant="body2"><strong>Location:</strong> {item.location}</Typography>}
                {item.date && <Typography variant="body2"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</Typography>}

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {(item.status === 'PENDING' || item.status === 'REJECTED') && (
                        <Button variant="contained" color="success" onClick={() => handleApprove(type, item.id, 'APPROVED')}>
                            Approve
                        </Button>
                    )}
                    {(item.status === 'PENDING' || item.status === 'APPROVED') && (
                        <Button variant="outlined" color="error" onClick={() => handleApprove(type, item.id, 'REJECTED')}>
                            Reject
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">
                    Content Moderation
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={() => setOpenEventDialog(true)}>
                        Add Event
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => setOpenAchievementDialog(true)}>
                        Award Achievement
                    </Button>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="status-filter-label">Filter Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            value={statusFilter}
                            label="Filter Status"
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="APPROVED">Approved</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                            <MenuItem value="ALL">All</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={`Business (${content.business.length})`} />
                    <Tab label={`Career (${content.career.length})`} />
                    <Tab label={`Events (${content.events.length})`} />
                    <Tab label={`Services (${content.services.length})`} />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : (
                <>
                    {tabValue === 0 && (
                        <Box>
                            {content.business.length === 0 ? <Alert severity="info">No business listings found.</Alert> : (
                                content.business.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="business" />)
                            )}
                        </Box>
                    )}
                    {tabValue === 1 && (
                        <Box>
                            {content.career.length === 0 ? <Alert severity="info">No career listings found.</Alert> : (
                                content.career.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="career" />)
                            )}
                        </Box>
                    )}
                    {tabValue === 2 && (
                        <Box>
                            {content.events.length === 0 ? <Alert severity="info">No events found.</Alert> : (
                                content.events.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="event" />)
                            )}
                        </Box>
                    )}
                    {tabValue === 3 && (
                        <Box>
                            {content.services.length === 0 ? <Alert severity="info">No service requests found.</Alert> : (
                                content.services.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="service" />)
                            )}
                        </Box>
                    )}
                </>
            )}

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

            {/* Create Achievement Dialog */}
            <Dialog open={openAchievementDialog} onClose={() => setOpenAchievementDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Award Achievement</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="user-select-label">Select User</InputLabel>
                        <Select
                            labelId="user-select-label"
                            value={achievementForm.userId}
                            label="Select User"
                            onChange={(e) => setAchievementForm({ ...achievementForm, userId: e.target.value })}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.profile?.fullName || user.email} ({user.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Achievement Title"
                        fullWidth
                        value={achievementForm.title}
                        onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={achievementForm.description}
                        onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={achievementForm.date}
                        onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Proof URL (Optional)"
                        fullWidth
                        value={achievementForm.proofUrl}
                        onChange={(e) => setAchievementForm({ ...achievementForm, proofUrl: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAchievementDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateAchievement} variant="contained" color="secondary">Award</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContentModeration;
