import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import {
    Box, Typography, Button, Container, GridLegacy as Grid, Card, CardContent, Chip,
    Stack, Skeleton, Divider, Avatar, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, CircularProgress, Alert, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../context/AuthContext';



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
    volunteersNeeded: boolean;
    volunteerRoles: string[];
    organizer?: {
        profile?: {
            fullName?: string;
            email?: string;
        }
    }
}

interface VolunteerSignup {
    id: string;
    userId: string;
    role?: string;
    status: string;
    notes?: string;
    createdAt: string;
    user: {
        id: string;
        mobileNumber: string;
        profile?: {
            fullName?: string;
            email?: string;
            avatarUrl?: string;
        };
    };
}

const statusColor = (s: string) => {
    if (s === 'ACCEPTED') return 'success';
    if (s === 'REJECTED') return 'error';
    return 'default';
};

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isVerifiedMember } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    // Volunteer state
    const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [volunteerNotes, setVolunteerNotes] = useState('');
    const [volunteerLoading, setVolunteerLoading] = useState(false);
    const [alreadyVolunteered, setAlreadyVolunteered] = useState(false);

    // Admin volunteer view
    const [volunteers, setVolunteers] = useState<VolunteerSignup[]>([]);
    const [volunteersLoading, setVolunteersLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEventDetails(id);
        }
    }, [id]);

    useEffect(() => {
        if (event?.id) {
            checkVolunteerStatus(event.id);
            if (isAdmin) fetchVolunteers(event.id);
        }
    }, [event?.id]);

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

    const checkVolunteerStatus = async (eventId: string) => {
        try {
            const { data } = await client.get('/community/events/my-volunteer-signups');
            const signed = data.signups?.some((s: any) => s.eventId === eventId);
            setAlreadyVolunteered(signed);
        } catch (_) { /* ignore */ }
    };

    const fetchVolunteers = async (eventId: string) => {
        try {
            setVolunteersLoading(true);
            const { data } = await client.get(`/community/events/${eventId}/volunteers`);
            setVolunteers(data.signups);
        } catch (error) {
            console.error(error);
        } finally {
            setVolunteersLoading(false);
        }
    };

    const handleVolunteerSubmit = async () => {
        if (!event) return;
        setVolunteerLoading(true);
        try {
            await client.post('/community/events/volunteer', {
                eventId: event.id,
                role: selectedRole || undefined,
                notes: volunteerNotes || undefined
            });
            setAlreadyVolunteered(true);
            setVolunteerDialogOpen(false);
            setSelectedRole('');
            setVolunteerNotes('');
        } catch (error: any) {
            console.error(error);
        } finally {
            setVolunteerLoading(false);
        }
    };

    const handleVolunteerCancel = async () => {
        if (!event) return;
        try {
            await client.post('/community/events/volunteer/cancel', { eventId: event.id });
            setAlreadyVolunteered(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateVolunteerStatus = async (signupId: string, status: string) => {
        try {
            await client.patch(`/community/events/volunteers/${signupId}/status`, { status });
            if (event?.id) fetchVolunteers(event.id);
        } catch (error) {
            console.error(error);
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

                    {/* Admin Tabs */}
                    {isAdmin && (
                        <Box sx={{ mb: 4 }}>
                            <Tabs
                                value={tab}
                                onChange={(_, v) => setTab(v)}
                                sx={{
                                    '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' },
                                    '& .Mui-selected': { color: '#E62A4D' },
                                    '& .MuiTabs-indicator': { bgcolor: '#E62A4D' }
                                }}
                            >
                                <Tab label="Event Details" />
                                <Tab
                                    label={`Volunteer Signups ${volunteers.length > 0 ? `(${volunteers.length})` : ''}`}
                                    icon={<PeopleIcon sx={{ fontSize: 18 }} />}
                                    iconPosition="start"
                                />
                            </Tabs>
                        </Box>
                    )}

                    {/* ─── Event Details Tab ─── */}
                    {(tab === 0 || !isAdmin) && (
                        <>
                            {/* Header */}
                            <Box sx={{ mb: 4 }}>
                                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    <Chip label={event.registrationRequired ? "Registration Required" : "Open Event"}
                                        color={event.registrationRequired ? "primary" : "success"}
                                        size="small" sx={{ fontWeight: 700 }} />
                                    {event.volunteersNeeded && (
                                        <Chip
                                            icon={<VolunteerActivismIcon sx={{ fontSize: '16px !important' }} />}
                                            label="Volunteers Needed"
                                            size="small"
                                            sx={{
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: 'white',
                                                fontWeight: 700,
                                                '& .MuiChip-icon': { color: 'white' }
                                            }}
                                        />
                                    )}
                                </Stack>
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

                            {/* Volunteering Section */}
                            {event.volunteersNeeded && (
                                <Box sx={{
                                    mb: 6,
                                    p: 4,
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.04) 100%)',
                                    border: '1px solid rgba(16,185,129,0.15)',
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                        <Box sx={{
                                            p: 1, borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <VolunteerActivismIcon sx={{ color: 'white', fontSize: 22 }} />
                                        </Box>
                                        <Typography variant="h6" fontWeight={800} sx={{ color: '#064e3b' }}>
                                            Volunteer Opportunities
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ color: '#065f46', mb: 3, lineHeight: 1.7 }}>
                                        This event is looking for volunteers! Join us and make a difference.
                                        Available roles are listed below.
                                    </Typography>

                                    {event.volunteerRoles && event.volunteerRoles.length > 0 && (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                            {event.volunteerRoles.map((role, i) => (
                                                <Chip
                                                    key={i}
                                                    label={role}
                                                    sx={{
                                                        bgcolor: 'rgba(16,185,129,0.1)',
                                                        color: '#065f46',
                                                        fontWeight: 700,
                                                        border: '1px solid rgba(16,185,129,0.25)'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    {!isAdmin && (
                                        alreadyVolunteered ? (
                                            <Box>
                                                <Alert
                                                    icon={<CheckCircleIcon />}
                                                    severity="success"
                                                    sx={{ mb: 2, borderRadius: '12px' }}
                                                >
                                                    You've signed up to volunteer! The organizer will contact you soon.
                                                </Alert>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    onClick={handleVolunteerCancel}
                                                    sx={{ textTransform: 'none', fontWeight: 700 }}
                                                >
                                                    Cancel Volunteer Signup
                                                </Button>
                                            </Box>
                                        ) : isVerifiedMember ? (
                                            <Button
                                                variant="contained"
                                                startIcon={<VolunteerActivismIcon />}
                                                onClick={() => setVolunteerDialogOpen(true)}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    color: 'white',
                                                    fontWeight: 800,
                                                    px: 4, py: 1.5,
                                                    borderRadius: '14px',
                                                    textTransform: 'none',
                                                    boxShadow: '0 8px 20px -6px rgba(16,185,129,0.5)',
                                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px -8px rgba(16,185,129,0.6)' },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                Sign Up to Volunteer
                                            </Button>
                                        ) : (
                                            // Non-verified / guest — show locked notice
                                            <Box sx={{
                                                p: 2, borderRadius: '12px',
                                                bgcolor: 'rgba(251,191,36,0.08)',
                                                border: '1px solid rgba(251,191,36,0.3)'
                                            }}>
                                                <Typography variant="body2" fontWeight={700} sx={{ color: '#92400e', mb: 0.5 }}>
                                                    🔒 Verified Members Only
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#78350f', lineHeight: 1.6 }}>
                                                    Only verified community members can sign up to volunteer.
                                                    Please complete your profile verification to participate.
                                                </Typography>
                                            </Box>
                                        )
                                    )}
                                </Box>
                            )}
                        </>
                    )}

                    {/* ─── Admin: Volunteer Signups Tab ─── */}
                    {isAdmin && tab === 1 && (
                        <Box>
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 3, color: '#1e293b' }}>
                                Volunteer Signups
                            </Typography>

                            {volunteersLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                    <CircularProgress />
                                </Box>
                            ) : volunteers.length === 0 ? (
                                <Box sx={{
                                    textAlign: 'center', py: 8,
                                    border: '2px dashed #e2e8f0', borderRadius: '20px',
                                }}>
                                    <VolunteerActivismIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                                    <Typography variant="h6" color="#94a3b8" fontWeight={700}>
                                        No volunteer signups yet
                                    </Typography>
                                    <Typography variant="body2" color="#94a3b8">
                                        Volunteer signups will appear here once members register.
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ '& th': { fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc', fontSize: '0.8rem', letterSpacing: '0.5px' } }}>
                                                <TableCell>VOLUNTEER</TableCell>
                                                <TableCell>ROLE</TableCell>
                                                <TableCell>CONTACT</TableCell>
                                                <TableCell>NOTES</TableCell>
                                                <TableCell>STATUS</TableCell>
                                                <TableCell>ACTIONS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {volunteers.map((v) => (
                                                <TableRow key={v.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar
                                                                src={v.user.profile?.avatarUrl}
                                                                sx={{ width: 36, height: 36, bgcolor: '#FA8231', fontSize: '0.85rem', fontWeight: 700 }}
                                                            >
                                                                {v.user.profile?.fullName?.[0] || '?'}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={700} color="#0f172a">
                                                                    {v.user.profile?.fullName || 'Unknown'}
                                                                </Typography>
                                                                <Typography variant="caption" color="#64748b">
                                                                    {v.user.mobileNumber}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {v.role ? (
                                                            <Chip label={v.role} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(16,185,129,0.1)', color: '#065f46' }} />
                                                        ) : (
                                                            <Typography variant="caption" color="#94a3b8">Not specified</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="#64748b">
                                                            {v.user.profile?.email || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="#64748b" sx={{ maxWidth: 150, display: 'block' }}>
                                                            {v.notes || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={v.status}
                                                            size="small"
                                                            color={statusColor(v.status) as any}
                                                            sx={{ fontWeight: 700 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            {v.status !== 'ACCEPTED' && (
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', fontSize: '0.75rem' }}
                                                                    onClick={() => handleUpdateVolunteerStatus(v.id, 'ACCEPTED')}
                                                                >
                                                                    Accept
                                                                </Button>
                                                            )}
                                                            {v.status !== 'REJECTED' && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="error"
                                                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', fontSize: '0.75rem' }}
                                                                    onClick={() => handleUpdateVolunteerStatus(v.id, 'REJECTED')}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            )}
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    )}
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

                                    {/* Volunteer summary for admin sidebar */}
                                    {isAdmin && event.volunteersNeeded && (
                                        <>
                                            <Divider />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1 }}>VOLUNTEERS</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ bgcolor: 'rgba(16,185,129,0.1)', p: 1, borderRadius: '50%' }}>
                                                        <VolunteerActivismIcon sx={{ color: '#059669' }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={700} color="#065f46">
                                                            {volunteers.length} signed up
                                                        </Typography>
                                                        <Typography variant="caption" color="#6b7280">
                                                            {volunteers.filter(v => v.status === 'ACCEPTED').length} accepted
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onClick={() => setTab(1)}
                                                    sx={{
                                                        mt: 2, textTransform: 'none', fontWeight: 700,
                                                        borderColor: '#10b981', color: '#059669',
                                                        borderRadius: '10px',
                                                        '&:hover': { bgcolor: 'rgba(16,185,129,0.05)', borderColor: '#059669' }
                                                    }}
                                                >
                                                    View Signups
                                                </Button>
                                            </Box>
                                        </>
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
                                                disabled
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

            {/* Volunteer Signup Dialog */}
            <Dialog
                open={volunteerDialogOpen}
                onClose={() => setVolunteerDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.3rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            p: 1, borderRadius: '10px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex'
                        }}>
                            <VolunteerActivismIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        Sign Up to Volunteer
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="#64748b" sx={{ mb: 3, mt: 1 }}>
                        Join as a volunteer for <strong>{event?.title}</strong>. Select your preferred role and leave any notes for the organizer.
                    </Typography>

                    {event?.volunteerRoles && event.volunteerRoles.length > 0 ? (
                        <TextField
                            select
                            fullWidth
                            label="Select Role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            sx={{ mb: 3 }}
                        >
                            <MenuItem value="">Any / No Preference</MenuItem>
                            {event.volunteerRoles.map((role, i) => (
                                <MenuItem key={i} value={role}>{role}</MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <TextField
                            fullWidth
                            label="Volunteer Role (optional)"
                            placeholder="What would you like to help with?"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                    )}

                    <TextField
                        fullWidth
                        label="Notes to Organizer (optional)"
                        multiline
                        rows={3}
                        placeholder="Any skills, availability or special notes..."
                        value={volunteerNotes}
                        onChange={(e) => setVolunteerNotes(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setVolunteerDialogOpen(false)}
                        sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleVolunteerSubmit}
                        variant="contained"
                        disabled={volunteerLoading}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            textTransform: 'none',
                            fontWeight: 800,
                            px: 4,
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(16,185,129,0.4)'
                        }}
                    >
                        {volunteerLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Confirm Signup'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EventDetailsPage;
