import { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Chip, CircularProgress,
    Avatar, Stack, Button,
    Divider, Alert, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Collapse, IconButton
} from '@mui/material';
import client from '../../api/client';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface EventWithVolunteers {
    id: string;
    title: string;
    date: string;
    location: string;
    volunteerRoles: string[];
    volunteersNeeded: boolean;
    signups?: VolunteerSignup[];
    signupsLoaded?: boolean;
    signupsLoading?: boolean;
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

const statusColor = (s: string): 'success' | 'error' | 'default' => {
    if (s === 'ACCEPTED') return 'success';
    if (s === 'REJECTED') return 'error';
    return 'default';
};

const AdminVolunteerManager = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventWithVolunteers[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchVolunteerEvents();
    }, []);

    const fetchVolunteerEvents = async () => {
        try {
            setLoading(true);
            const { data } = await client.get('/community/events/all');
            // Filter to events that need volunteers
            const volunteerEvents = (data.events as EventWithVolunteers[]).filter(e => e.volunteersNeeded);
            setEvents(volunteerEvents);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = async (eventId: string) => {
        if (expandedId === eventId) {
            setExpandedId(null);
            return;
        }

        setExpandedId(eventId);

        const event = events.find(e => e.id === eventId);
        if (event?.signupsLoaded) return;

        // Load signups
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, signupsLoading: true } : e));
        try {
            const { data } = await client.get(`/community/events/${eventId}/volunteers`);
            setEvents(prev => prev.map(e => e.id === eventId
                ? { ...e, signups: data.signups, signupsLoaded: true, signupsLoading: false }
                : e
            ));
        } catch (error) {
            console.error(error);
            setEvents(prev => prev.map(e => e.id === eventId ? { ...e, signupsLoading: false } : e));
        }
    };

    const handleUpdateStatus = async (eventId: string, signupId: string, status: string) => {
        try {
            await client.patch(`/community/events/volunteers/${signupId}/status`, { status });
            setEvents(prev => prev.map(e => {
                if (e.id !== eventId) return e;
                return {
                    ...e,
                    signups: e.signups?.map(s => s.id === signupId ? { ...s, status } : s)
                };
            }));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
                <CircularProgress sx={{ color: '#E62A4D' }} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 1.5 }}>
                <Box sx={{ p: 1.5, background: BRAND_GRADIENT_LIGHT, borderRadius: '12px' }}>
                    <VolunteerActivismIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Volunteer Management
                    </Typography>
                    <Typography variant="body2" color="#64748b" fontWeight={500}>
                        Review and manage volunteer signups for upcoming events
                    </Typography>
                </Box>
            </Box>

            {events.length === 0 ? (
                <Box sx={{
                    textAlign: 'center',
                    py: 12,
                    border: '2px dashed #e2e8f0',
                    borderRadius: '24px',
                    bgcolor: '#f8fafc'
                }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: BRAND_GRADIENT_LIGHT,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3
                    }}>
                        <VolunteerActivismIcon sx={{ fontSize: 36, color: '#E62A4D' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>
                        No Events Seeking Volunteers
                    </Typography>
                    <Typography variant="body2" color="#64748b" mb={3}>
                        Events that need volunteers will appear here. Create an event with "Volunteers Needed" enabled.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/admin/create-content')}
                        sx={{
                            background: BRAND_GRADIENT,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 4, py: 1.5,
                            borderRadius: '14px',
                            boxShadow: '0 8px 20px -6px rgba(230,42,77,0.4)'
                        }}
                    >
                        Create Event
                    </Button>
                </Box>
            ) : (
                <Stack spacing={3}>
                    {events.map(event => {
                        const isExpanded = expandedId === event.id;
                        const signupCount = event.signups?.length ?? 0;
                        const acceptedCount = event.signups?.filter(s => s.status === 'ACCEPTED').length ?? 0;

                        return (
                            <Card key={event.id} sx={{
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                boxShadow: isExpanded ? '0 8px 30px -10px rgba(230,42,77,0.15)' : '0 4px 12px -4px rgba(0,0,0,0.04)',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease'
                            }}>
                                {/* Card Header */}
                                <CardContent
                                    sx={{
                                        p: 3,
                                        cursor: 'pointer',
                                        '&:last-child': { pb: 3 },
                                        background: isExpanded ? BRAND_GRADIENT_LIGHT : 'white',
                                        transition: 'background 0.3s ease'
                                    }}
                                    onClick={() => toggleExpand(event.id)}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                <Box sx={{
                                                    p: 0.8, borderRadius: '10px',
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    display: 'flex'
                                                }}>
                                                    <VolunteerActivismIcon sx={{ color: 'white', fontSize: 18 }} />
                                                </Box>
                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.3px' }}>
                                                    {event.title}
                                                </Typography>
                                            </Box>

                                            <Stack direction="row" spacing={3} sx={{ color: '#64748b', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <CalendarMonthIcon sx={{ fontSize: 16, color: '#FA8231' }} />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <LocationOnIcon sx={{ fontSize: 16, color: '#FA8231' }} />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {event.location}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            {/* Roles */}
                                            {event.volunteerRoles && event.volunteerRoles.length > 0 && (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                                    {event.volunteerRoles.map((role, i) => (
                                                        <Chip
                                                            key={i}
                                                            label={role}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(16,185,129,0.1)',
                                                                color: '#065f46',
                                                                fontWeight: 700,
                                                                fontSize: '0.72rem'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2, flexShrink: 0 }}>
                                            {event.signupsLoaded && (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h5" fontWeight={900} sx={{
                                                        background: BRAND_GRADIENT,
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent'
                                                    }}>
                                                        {signupCount}
                                                    </Typography>
                                                    <Typography variant="caption" color="#64748b" fontWeight={600} display="block">
                                                        Signed Up
                                                    </Typography>
                                                    <Typography variant="caption" color="#059669" fontWeight={700} display="block">
                                                        {acceptedCount} Accepted
                                                    </Typography>
                                                </Box>
                                            )}
                                            <IconButton sx={{ color: '#64748b', bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '10px' }}>
                                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>

                                {/* Expanded Volunteer Table */}
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <Divider />
                                    <Box sx={{ p: 3 }}>
                                        {event.signupsLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                                <CircularProgress size={28} sx={{ color: '#E62A4D' }} />
                                            </Box>
                                        ) : !event.signups || event.signups.length === 0 ? (
                                            <Alert
                                                severity="info"
                                                sx={{ borderRadius: '12px' }}
                                                icon={<VolunteerActivismIcon />}
                                            >
                                                No volunteer signups yet for this event.
                                            </Alert>
                                        ) : (
                                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ '& th': { fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc', fontSize: '0.75rem', letterSpacing: '0.5px' } }}>
                                                            <TableCell>VOLUNTEER</TableCell>
                                                            <TableCell>ROLE</TableCell>
                                                            <TableCell>CONTACT</TableCell>
                                                            <TableCell>NOTES</TableCell>
                                                            <TableCell>STATUS</TableCell>
                                                            <TableCell>ACTIONS</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {event.signups.map((v) => (
                                                            <TableRow key={v.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                        <Avatar
                                                                            src={v.user.profile?.avatarUrl}
                                                                            sx={{ width: 34, height: 34, bgcolor: '#FA8231', fontSize: '0.8rem', fontWeight: 700 }}
                                                                        >
                                                                            {v.user.profile?.fullName?.[0] || '?'}
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="body2" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1.2 }}>
                                                                                {v.user.profile?.fullName || 'Unknown'}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="#94a3b8">
                                                                                {v.user.mobileNumber}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {v.role ? (
                                                                        <Chip label={v.role} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(16,185,129,0.1)', color: '#065f46', fontSize: '0.72rem' }} />
                                                                    ) : (
                                                                        <Typography variant="caption" color="#94a3b8">Any</Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="caption" color="#64748b">
                                                                        {v.user.profile?.email || '—'}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ maxWidth: 150 }}>
                                                                    <Typography variant="caption" color="#64748b" noWrap>
                                                                        {v.notes || '—'}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={v.status}
                                                                        size="small"
                                                                        color={statusColor(v.status)}
                                                                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={0.75}>
                                                                        {v.status !== 'ACCEPTED' && (
                                                                            <Button
                                                                                size="small"
                                                                                variant="contained"
                                                                                color="success"
                                                                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', fontSize: '0.72rem', minWidth: 0, px: 1.5 }}
                                                                                onClick={() => handleUpdateStatus(event.id, v.id, 'ACCEPTED')}
                                                                            >
                                                                                Accept
                                                                            </Button>
                                                                        )}
                                                                        {v.status !== 'REJECTED' && (
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="error"
                                                                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', fontSize: '0.72rem', minWidth: 0, px: 1.5 }}
                                                                                onClick={() => handleUpdateStatus(event.id, v.id, 'REJECTED')}
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
                                </Collapse>
                            </Card>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
};

export default AdminVolunteerManager;
