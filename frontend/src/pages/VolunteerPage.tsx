import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import {
    Box, Container, Typography, Chip, Button, Card, CardContent, CardMedia,
    GridLegacy as Grid, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, CircularProgress, Alert, Stack, Divider, Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PeopleIcon from '@mui/icons-material/People';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const GREEN_GRADIENT = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
const GREEN_LIGHT = 'rgba(16,185,129,0.08)';

interface VolunteerEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    mediaUrl?: string;
    volunteerRoles: string[];
    volunteersNeeded: boolean;
    organizer?: { profile?: { fullName?: string } };
}

export default function VolunteerPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<VolunteerEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [mySignups, setMySignups] = useState<Set<string>>(new Set());

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [justSignedUp, setJustSignedUp] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [eventsRes, signupsRes] = await Promise.all([
                client.get('/community/events/all'),
                client.get('/community/events/my-volunteer-signups').catch(() => ({ data: { signups: [] } }))
            ]);

            const allEvents: VolunteerEvent[] = eventsRes.data.events;
            const volunteerEvents = allEvents.filter(e => e.volunteersNeeded);
            setEvents(volunteerEvents);

            const signedIds = new Set<string>(
                (signupsRes.data.signups || []).map((s: any) => s.eventId as string)
            );
            setMySignups(signedIds);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openDialog = (event: VolunteerEvent) => {
        setSelectedEvent(event);
        setSelectedRole('');
        setNotes('');
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedEvent) return;
        setSubmitting(true);
        try {
            await client.post('/community/events/volunteer', {
                eventId: selectedEvent.id,
                role: selectedRole || undefined,
                notes: notes || undefined
            });
            setMySignups(prev => new Set([...prev, selectedEvent.id]));
            setJustSignedUp(selectedEvent.id);
            setDialogOpen(false);
            setTimeout(() => setJustSignedUp(null), 4000);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (eventId: string) => {
        try {
            await client.post('/community/events/volunteer/cancel', { eventId });
            setMySignups(prev => {
                const next = new Set(prev);
                next.delete(eventId);
                return next;
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 12, fontFamily: "'Inter', sans-serif" }}>

            {/* ── Hero ── */}
            <Box sx={{
                position: 'relative',
                pt: { xs: 8, md: 10 }, pb: { xs: 8, md: 10 },
                overflow: 'hidden',
                background: 'radial-gradient(120% 100% at 50% -10%, rgba(16,185,129,0.08) 0%, rgba(255,255,255,1) 100%)',
                mb: 6
            }}>
                <Box sx={{ position: 'absolute', top: '5%', left: '-5%', width: 500, height: 500, background: 'rgba(16,185,129,0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', bottom: '10%', right: '-10%', width: 400, height: 400, background: 'rgba(5,150,105,0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Chip
                            icon={<HandshakeIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
                            label="GIVE BACK TO THE COMMUNITY"
                            sx={{
                                bgcolor: 'rgba(16,185,129,0.1)',
                                color: '#059669',
                                fontWeight: 800,
                                mb: 2,
                                borderRadius: '8px',
                                border: '1px solid rgba(16,185,129,0.2)',
                                letterSpacing: '1px',
                                '& .MuiChip-icon': { color: '#059669' }
                            }}
                        />
                        <Typography variant="h2" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1.5px', mb: 2 }}>
                            Volunteer{' '}
                            <Box component="span" sx={{
                                background: GREEN_GRADIENT,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Opportunities
                            </Box>
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, maxWidth: 620, lineHeight: 1.7 }}>
                            Make a difference in your community. Browse upcoming events that need your help and sign up to volunteer today.
                        </Typography>

                        {/* Stats row */}
                        <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
                            {[
                                { icon: <VolunteerActivismIcon />, label: `${events.length} Event${events.length !== 1 ? 's' : ''} Available`, color: '#059669' },
                                { icon: <PeopleIcon />, label: `${mySignups.size} Signed Up`, color: '#FA8231' },
                            ].map((stat, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ color: stat.color, display: 'flex' }}>{stat.icon}</Box>
                                    <Typography fontWeight={700} color="#334155">{stat.label}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Success toast */}
                {justSignedUp && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <Alert
                            icon={<CheckCircleIcon />}
                            severity="success"
                            sx={{ mb: 4, borderRadius: '16px', fontWeight: 700, boxShadow: '0 8px 20px -6px rgba(16,185,129,0.3)' }}
                        >
                            You've successfully signed up to volunteer! The organizer will reach out soon. 🎉
                        </Alert>
                    </motion.div>
                )}

                {loading ? (
                    <Grid container spacing={4}>
                        {Array.from(new Array(4)).map((_, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: '24px' }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : events.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center', py: 14,
                        border: '2px dashed #e2e8f0',
                        borderRadius: '28px',
                        bgcolor: '#fafafa'
                    }}>
                        <Box sx={{
                            width: 88, height: 88, borderRadius: '50%',
                            background: GREEN_GRADIENT,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 3,
                            boxShadow: '0 12px 30px -8px rgba(16,185,129,0.4)'
                        }}>
                            <VolunteerActivismIcon sx={{ fontSize: 44, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" fontWeight={800} color="#0f172a" mb={1}>
                            No Volunteer Opportunities Right Now
                        </Typography>
                        <Typography variant="body1" color="#64748b" mb={4} maxWidth={420} mx="auto">
                            We'll post events that need volunteers here. In the meantime, check out all upcoming community events.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/events')}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                background: BRAND_GRADIENT,
                                textTransform: 'none',
                                fontWeight: 800,
                                px: 4, py: 1.5,
                                borderRadius: '14px',
                                boxShadow: '0 8px 20px -6px rgba(230,42,77,0.4)'
                            }}
                        >
                            Browse All Events
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {events.map((event, index) => {
                            const isSigned = mySignups.has(event.id);
                            const isPast = new Date(event.date) < new Date();
                            return (
                                <Grid item xs={12} sm={6} key={event.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ delay: index * 0.08, duration: 0.5 }}
                                    >
                                        <Card sx={{
                                            borderRadius: '24px',
                                            border: isSigned
                                                ? '2px solid rgba(16,185,129,0.4)'
                                                : '1px solid #e2e8f0',
                                            boxShadow: isSigned
                                                ? '0 8px 30px -8px rgba(16,185,129,0.25)'
                                                : '0 4px 12px -4px rgba(0,0,0,0.04)',
                                            overflow: 'hidden',
                                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                boxShadow: '0 20px 40px -10px rgba(16,185,129,0.2)',
                                                borderColor: 'rgba(16,185,129,0.4)'
                                            }
                                        }}>
                                            {/* Colored top strip */}
                                            <Box sx={{ height: 6, background: isSigned ? GREEN_GRADIENT : BRAND_GRADIENT }} />

                                            {/* Media thumbnail */}
                                            {event.mediaUrl && (
                                                <CardMedia
                                                    component="img"
                                                    height="160"
                                                    image={event.mediaUrl}
                                                    alt={event.title}
                                                    sx={{ objectFit: 'cover' }}
                                                />
                                            )}
                                            {!event.mediaUrl && (
                                                <Box sx={{
                                                    height: 120,
                                                    background: GREEN_LIGHT,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <VolunteerActivismIcon sx={{ fontSize: 56, color: '#10b981', opacity: 0.4 }} />
                                                </Box>
                                            )}

                                            <CardContent sx={{ p: 3.5 }}>
                                                {/* Signed-up badge */}
                                                {isSigned && (
                                                    <Chip
                                                        icon={<CheckCircleIcon sx={{ fontSize: '16px !important', color: 'white !important' }} />}
                                                        label="You're Volunteering!"
                                                        size="small"
                                                        sx={{
                                                            background: GREEN_GRADIENT,
                                                            color: 'white',
                                                            fontWeight: 800,
                                                            mb: 2,
                                                            '& .MuiChip-icon': { color: 'white' }
                                                        }}
                                                    />
                                                )}

                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.3px', mb: 1.5 }}>
                                                    {event.title}
                                                </Typography>

                                                {/* Date & Location */}
                                                <Stack spacing={0.75} sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b' }}>
                                                        <CalendarMonthIcon sx={{ fontSize: 16, color: '#FA8231' }} />
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {new Date(event.date).toLocaleDateString(undefined, {
                                                                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b' }}>
                                                        <LocationOnIcon sx={{ fontSize: 16, color: '#FA8231' }} />
                                                        <Typography variant="body2" fontWeight={600}>{event.location}</Typography>
                                                    </Box>
                                                </Stack>

                                                <Typography variant="body2" sx={{
                                                    color: '#475569', lineHeight: 1.7, mb: 2.5,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {event.description}
                                                </Typography>

                                                {/* Volunteer Roles */}
                                                {event.volunteerRoles && event.volunteerRoles.length > 0 && (
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="caption" fontWeight={800} sx={{
                                                            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', mb: 1
                                                        }}>
                                                            Open Roles
                                                        </Typography>
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
                                                                        fontSize: '0.72rem',
                                                                        border: '1px solid rgba(16,185,129,0.2)'
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                )}

                                                <Divider sx={{ mb: 2.5 }} />

                                                {/* Action Buttons */}
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    {isPast ? (
                                                        <Chip label="Event Ended" size="small" sx={{ color: '#94a3b8', fontWeight: 700 }} />
                                                    ) : isSigned ? (
                                                        <>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexGrow: 1 }}>
                                                                <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                                                <Typography variant="body2" fontWeight={700} color="#059669">
                                                                    Signed Up
                                                                </Typography>
                                                            </Box>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => handleCancel(event.id)}
                                                                sx={{
                                                                    textTransform: 'none', fontWeight: 700,
                                                                    borderRadius: '10px', fontSize: '0.8rem'
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<VolunteerActivismIcon />}
                                                                onClick={() => openDialog(event)}
                                                                sx={{
                                                                    background: GREEN_GRADIENT,
                                                                    textTransform: 'none',
                                                                    fontWeight: 800,
                                                                    borderRadius: '12px',
                                                                    boxShadow: '0 6px 14px -4px rgba(16,185,129,0.45)',
                                                                    flex: 1,
                                                                    py: 1,
                                                                    '&:hover': {
                                                                        transform: 'translateY(-1px)',
                                                                        boxShadow: '0 10px 20px -6px rgba(16,185,129,0.5)'
                                                                    },
                                                                    transition: 'all 0.25s ease'
                                                                }}
                                                            >
                                                                Volunteer Now
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="text"
                                                                endIcon={<ArrowForwardIcon />}
                                                                onClick={() => navigate(`/events/${event.id}`)}
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    fontWeight: 700,
                                                                    color: '#64748b',
                                                                    '&:hover': { color: '#E62A4D' }
                                                                }}
                                                            >
                                                                Details
                                                            </Button>
                                                        </>
                                                    )}
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* "My Signups" bottom section */}
                {!loading && mySignups.size > 0 && (
                    <Box sx={{ mt: 8 }}>
                        <Divider sx={{ mb: 5 }} />
                        <Typography variant="h5" fontWeight={800} sx={{ mb: 3, color: '#0f172a' }}>
                            🙌 Your Volunteer Commitments
                        </Typography>
                        <Grid container spacing={3}>
                            {events.filter(e => mySignups.has(e.id)).map(event => (
                                <Grid item xs={12} sm={6} md={4} key={`my-${event.id}`}>
                                    <Box sx={{
                                        p: 2.5,
                                        borderRadius: '16px',
                                        border: '1px solid rgba(16,185,129,0.25)',
                                        bgcolor: 'rgba(16,185,129,0.04)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Avatar sx={{ bgcolor: '#10b981', width: 44, height: 44 }}>
                                            <VolunteerActivismIcon sx={{ fontSize: 22 }} />
                                        </Avatar>
                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Typography fontWeight={800} color="#065f46" noWrap>
                                                {event.title}
                                            </Typography>
                                            <Typography variant="caption" color="#6b7280" fontWeight={600}>
                                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Typography>
                                        </Box>
                                        <Button
                                            size="small"
                                            variant="text"
                                            onClick={() => navigate(`/events/${event.id}`)}
                                            sx={{ color: '#059669', fontWeight: 700, textTransform: 'none', flexShrink: 0 }}
                                        >
                                            View
                                        </Button>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            {/* ── Sign Up Dialog ── */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '22px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.35rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            p: 1, borderRadius: '12px',
                            background: GREEN_GRADIENT,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <VolunteerActivismIcon sx={{ color: 'white', fontSize: 22 }} />
                        </Box>
                        Sign Up to Volunteer
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {selectedEvent && (
                        <>
                            {/* Event summary box */}
                            <Box sx={{
                                p: 2, borderRadius: '12px',
                                bgcolor: GREEN_LIGHT,
                                border: '1px solid rgba(16,185,129,0.15)',
                                mb: 3, mt: 1
                            }}>
                                <Typography fontWeight={800} color="#065f46" mb={0.5}>
                                    {selectedEvent.title}
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6b7280' }}>
                                        <CalendarMonthIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption" fontWeight={600}>
                                            {new Date(selectedEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6b7280' }}>
                                        <LocationOnIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption" fontWeight={600}>{selectedEvent.location}</Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Role selector */}
                            {selectedEvent.volunteerRoles && selectedEvent.volunteerRoles.length > 0 ? (
                                <TextField
                                    select
                                    fullWidth
                                    label="Select Your Role"
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e.target.value)}
                                    sx={{ mb: 2.5 }}
                                    helperText="Choose the role you'd like to help with"
                                >
                                    <MenuItem value="">Any / No Preference</MenuItem>
                                    {selectedEvent.volunteerRoles.map((role, i) => (
                                        <MenuItem key={i} value={role}>{role}</MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField
                                    fullWidth
                                    label="What would you like to help with?"
                                    placeholder="e.g. Stage setup, Catering, Registration"
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e.target.value)}
                                    sx={{ mb: 2.5 }}
                                />
                            )}

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Notes to Organizer (optional)"
                                placeholder="Your experience, availability, or anything else you'd like to share..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        onClick={() => setDialogOpen(false)}
                        sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b', borderRadius: '10px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitting}
                        sx={{
                            background: GREEN_GRADIENT,
                            textTransform: 'none',
                            fontWeight: 800,
                            px: 4, py: 1.2,
                            borderRadius: '12px',
                            boxShadow: '0 6px 14px -4px rgba(16,185,129,0.45)',
                            minWidth: 160
                        }}
                    >
                        {submitting
                            ? <CircularProgress size={20} sx={{ color: 'white' }} />
                            : '✅ Confirm Signup'
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
