import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Card, CardContent, Chip,
    Button, Skeleton, Avatar
} from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { motion } from 'framer-motion';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const EMERGENCY_GRADIENT = 'linear-gradient(135deg, #e62a4d 0%, #b80028 100%)';
const EMERGENCY_LIGHT = 'linear-gradient(135deg, rgba(230, 42, 77, 0.1) 0%, rgba(184, 0, 40, 0.1) 100%)';
const EMERGENCY_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

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
    user?: {
        mobileNumber?: string;
        profile?: {
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
            // Backend restriction ensures non-admins only see 'Blood' category for now
            const { data } = await client.get('/help-request/all?category=Blood');
            setRequests(data.requests || []);
        } catch (error) {
            console.error('Failed to fetch emergency requests', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', fontFamily: "'Inter', sans-serif", pb: 12 }}>
            <Box sx={{
                position: 'relative',
                pt: { xs: 8, md: 10 }, pb: { xs: 8, md: 10 },
                background: 'radial-gradient(120% 100% at 50% -10%, rgba(230,42,77,0.08) 0%, rgba(255,255,255,1) 100%)',
                overflow: 'hidden',
                mb: 6
            }}>
                <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 500, height: 500, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Chip
                            icon={<WarningAmberRoundedIcon sx={{ color: '#E62A4D !important' }} />}
                            label="CRITICAL ASSISTANCE"
                            sx={{
                                background: EMERGENCY_LIGHT,
                                color: '#E62A4D',
                                fontWeight: 800,
                                mb: 2,
                                borderRadius: '8px',
                                border: '1px solid rgba(230,42,77,0.2)',
                                letterSpacing: '1px'
                            }}
                        />
                        <Typography variant="h2" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1.5px', mb: 2 }}>
                            Emergency <Typography component="span" variant="h2" fontWeight={900} sx={{ color: '#E62A4D' }}>& Blood</Typography> Requests
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, maxWidth: 600, lineHeight: 1.6, mx: 'auto' }}>
                            Urgent community requests. Your quick response and assistance can save a life today.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {loading ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 4 }}>
                        {Array.from(new Array(3)).map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={380} sx={{ borderRadius: '24px' }} />
                        ))}
                    </Box>
                ) : requests.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Box sx={{
                            textAlign: 'center', py: 10, px: 4,
                            borderRadius: '24px',
                            background: '#f8fafc',
                            border: '1px dashed #cbd5e1'
                        }}>
                            <Avatar sx={{ mx: 'auto', mb: 3, width: 80, height: 80, background: 'white', color: '#10b981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <BloodtypeIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
                                No Active Emergencies
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 400, mx: 'auto' }}>
                                There are currently no active emergency or blood donation requests in the community at this moment.
                            </Typography>
                        </Box>
                    </motion.div>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 4 }}>
                        {requests.map((req, index) => (
                            <motion.div
                                key={req.id}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                style={{ height: '100%' }}
                            >
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex', flexDirection: 'column',
                                    borderRadius: '24px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.05)',
                                    border: '1px solid #f1f5f9',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    bgcolor: 'white',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px -10px rgba(230,42,77,0.15)',
                                        borderColor: 'rgba(230,42,77,0.3)'
                                    }
                                }}>
                                    <Box sx={{ position: 'absolute', top: 0, left: 0, w: '100%', h: '6px', width: '100%', background: EMERGENCY_GRADIENT }} />

                                    <CardContent sx={{ p: 4, pt: 5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                            <Chip
                                                label={`Blood: ${req.bloodGroup || 'Required'}`}
                                                icon={<BloodtypeIcon sx={{ fontSize: '18px' }} />}
                                                sx={{
                                                    background: EMERGENCY_GRADIENT,
                                                    color: 'white',
                                                    fontWeight: 800,
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(230,42,77,0.2)',
                                                    '& .MuiChip-icon': { color: 'white' }
                                                }}
                                            />
                                            <Chip
                                                label="URGENT"
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(230,42,77,0.1)',
                                                    color: '#E62A4D',
                                                    fontWeight: 900,
                                                    borderRadius: '6px',
                                                    letterSpacing: '1px'
                                                }}
                                            />
                                        </Box>

                                        <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 2, lineHeight: 1.3, letterSpacing: '-0.5px' }}>
                                            {req.title}
                                        </Typography>

                                        <Typography variant="body1" sx={{
                                            color: '#475569', mb: 3, flexGrow: 1,
                                            lineHeight: 1.6
                                        }}>
                                            {req.description}
                                        </Typography>

                                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: '16px', mb: 3, border: '1px dashed #cbd5e1' }}>
                                            {req.location && (
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                    <LocationOnIcon sx={{ color: '#64748b', mr: 1.5, mt: 0.2 }} />
                                                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>
                                                        {req.location}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PhoneIcon sx={{ color: '#64748b', mr: 1.5 }} />
                                                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 800 }}>
                                                    {req.contactPhone || req.user?.mobileNumber || 'Contact Admin'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 'auto', pt: 2 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                href={`tel:${req.contactPhone || req.user?.mobileNumber}`}
                                                sx={{
                                                    background: EMERGENCY_GRADIENT,
                                                    boxShadow: EMERGENCY_SHADOW,
                                                    color: 'white',
                                                    fontWeight: 800,
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontSize: '1.05rem',
                                                    '&:hover': { transform: 'translateY(-2px)' }
                                                }}
                                            >
                                                Call Now to Help
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default EmergencyRequests;
