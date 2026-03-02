import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { Container, Typography, Box, Card, CardContent, Button, CardMedia, Skeleton, GridLegacy as Grid, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { motion } from 'framer-motion';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    organizerId: string;
    images?: string[];
    mediaUrl?: string;
    volunteersNeeded?: boolean;
    volunteerRoles?: string[];
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const now = new Date();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await client.get('/community/events/all');
            // Backend already filters; this is an extra safety net for timezone edge cases
            const upcoming = (data.events as Event[]).filter(e => new Date(e.date) >= now);
            setEvents(upcoming);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', pb: 12, fontFamily: "'Inter', sans-serif" }}>

            {/* Standardized Hero Section */}
            <Box sx={{
                position: 'relative',
                pt: { xs: 8, md: 10 }, pb: { xs: 8, md: 10 },
                background: 'radial-gradient(120% 100% at 50% -10%, rgba(250,130,49,0.08) 0%, rgba(255,255,255,1) 100%)',
                overflow: 'hidden',
                mb: 6
            }}>
                <Box sx={{ position: 'absolute', top: '10%', left: '-5%', width: 400, height: 400, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', top: '20%', right: '-10%', width: 500, height: 500, background: 'rgba(250, 130, 49, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <Chip
                                label="COMMUNITY GATHERINGS"
                                sx={{
                                    background: BRAND_GRADIENT_LIGHT,
                                    color: '#E62A4D',
                                    fontWeight: 800,
                                    mb: 2,
                                    borderRadius: '8px',
                                    border: '1px solid rgba(230,42,77,0.2)',
                                    letterSpacing: '1px'
                                }}
                            />
                            <Typography variant="h2" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1.5px', mb: 2 }}>
                                Upcoming Events
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, maxWidth: 600, lineHeight: 1.6 }}>
                                Discover cultural celebrations, meetups, and networking opportunities happening near you.
                            </Typography>
                        </motion.div>

                        {user?.role === 'ADMIN' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/admin/create-content')}
                                    sx={{
                                        background: BRAND_GRADIENT,
                                        color: 'white',
                                        fontWeight: 800,
                                        px: 4, py: 1.5,
                                        borderRadius: '16px',
                                        boxShadow: BRAND_SHADOW,
                                        textTransform: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 25px 50px -12px rgba(230, 42, 77, 0.5)' }
                                    }}
                                >
                                    Create Event
                                </Button>
                            </motion.div>
                        )}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, i) => (
                            <Grid item key={i} xs={12} sm={6} md={4}>
                                <Skeleton variant="rectangular" height={360} sx={{ borderRadius: '24px' }} />
                            </Grid>
                        ))
                    ) : events.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{
                                textAlign: 'center',
                                py: 12,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Box sx={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    background: BRAND_GRADIENT_LIGHT,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1
                                }}>
                                    <EventBusyIcon sx={{ fontSize: 40, color: '#E62A4D' }} />
                                </Box>
                                <Typography variant="h5" fontWeight={700} color="#0f172a">
                                    No Upcoming Events
                                </Typography>
                                <Typography variant="body1" color="#64748b" maxWidth={400}>
                                    There are no upcoming events at the moment. Check back soon for new community gatherings!
                                </Typography>
                            </Box>
                        </Grid>
                    ) : events.map((event, index) => (
                        <Grid item key={event.id} xs={12} sm={6} md={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                style={{ height: '100%' }}
                            >
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '24px',
                                    border: '1px solid #f1f5f9',
                                    bgcolor: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.02)',
                                    overflow: 'hidden',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                        borderColor: 'rgba(250, 130, 49, 0.3)'
                                    }
                                }}
                                    onClick={() => navigate(`/events/${event.id}`)}>
                                    <Box sx={{ position: 'relative', height: 200, bgcolor: '#f8fafc', overflow: 'hidden' }}>
                                        {event.mediaUrl ? (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={event.mediaUrl}
                                                alt={event.title}
                                                sx={{ transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }}
                                            />
                                        ) : (
                                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND_GRADIENT_LIGHT }}>
                                                <CalendarMonthIcon sx={{ fontSize: 60, color: '#FA8231', opacity: 0.5 }} />
                                            </Box>
                                        )}
                                        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />

                                        {/* Date Badge */}
                                        <Box sx={{
                                            position: 'absolute', top: 16, right: 16,
                                            background: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '12px', p: 1, px: 2,
                                            textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                            border: '1px solid rgba(255,255,255,0.5)'
                                        }}>
                                            <Typography variant="h6" fontWeight={900} sx={{ color: '#E62A4D', lineHeight: 1 }}>
                                                {new Date(event.date).getDate()}
                                            </Typography>
                                            <Typography variant="caption" fontWeight={800} sx={{ color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                            </Typography>
                                        </Box>

                                        {/* Volunteers Needed Badge */}
                                        {event.volunteersNeeded && (
                                            <Box sx={{
                                                position: 'absolute', top: 16, left: 16,
                                            }}>
                                                <Chip
                                                    icon={<VolunteerActivismIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
                                                    label="Volunteers Needed"
                                                    size="small"
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        color: 'white',
                                                        fontWeight: 700,
                                                        fontSize: '0.65rem',
                                                        letterSpacing: '0.3px',
                                                        boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                                                        '& .MuiChip-icon': { color: 'white' }
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                                            {event.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, color: '#64748b' }}>
                                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#FA8231', mt: 0.2 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{event.location}</Typography>
                                        </Box>

                                        <Typography variant="body2" sx={{
                                            color: '#475569',
                                            mb: 4,
                                            lineHeight: 1.7,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {event.description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                            <Button
                                                variant="text"
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{
                                                    p: 0,
                                                    color: '#E62A4D',
                                                    fontWeight: 800,
                                                    textTransform: 'none',
                                                    '&:hover': { background: 'transparent', color: '#FA8231' }
                                                }}
                                            >
                                                View Details
                                            </Button>

                                            {event.volunteersNeeded && (
                                                <Chip
                                                    icon={<VolunteerActivismIcon sx={{ fontSize: '14px !important' }} />}
                                                    label={`${event.volunteerRoles?.length || 0} roles`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(16,185,129,0.08)',
                                                        color: '#059669',
                                                        fontWeight: 700,
                                                        border: '1px solid rgba(16,185,129,0.2)',
                                                        '& .MuiChip-icon': { color: '#059669' }
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
