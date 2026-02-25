import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Card, CardContent, Button, Chip, Skeleton, GridLegacy as Grid } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

interface Career {
    id: string;
    title: string;
    type: 'SEEKING' | 'HIRING';
    description: string;
    company?: string;
    location?: string;
    salaryRange?: string;
    skills: string[];
}

const CareerList = () => {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'HIRING' | 'SEEKING'>('ALL');
    const { user } = useAuth();

    useEffect(() => {
        const fetchCareers = async () => {
            setLoading(true);
            try {
                const { data } = await client.get('/career/all');
                setCareers(data.listings);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCareers();
    }, []);

    const filteredCareers = careers.filter(c => filter === 'ALL' || c.type === filter);

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
                <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 500, height: 500, background: 'rgba(250, 130, 49, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 3 }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <Chip
                                label="PROFESSIONAL NETWORK"
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
                                Career Opportunities
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, maxWidth: 600, lineHeight: 1.6 }}>
                                Find your next role, hire top talent, and build professional connections within the community.
                            </Typography>
                        </motion.div>

                        {user && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<WorkOutlineIcon />}
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
                                    Post Listing
                                </Button>
                            </motion.div>
                        )}
                    </Box>

                    {/* Filter Tabs */}
                    <Box sx={{
                        display: 'inline-flex', gap: 1,
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(20px)',
                        p: 1, borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.5)',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                        {['ALL', 'HIRING', 'SEEKING'].map((f) => (
                            <Button
                                key={f}
                                variant={filter === f ? 'contained' : 'text'}
                                onClick={() => setFilter(f as any)}
                                sx={{
                                    borderRadius: '12px',
                                    px: { xs: 2, sm: 4 },
                                    py: 1,
                                    background: filter === f ? '#0f172a' : 'transparent',
                                    color: filter === f ? 'white' : '#64748b',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    boxShadow: filter === f ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { background: filter === f ? '#1e293b' : '#f1f5f9' }
                                }}
                            >
                                {f === 'ALL' ? 'All Roles' : f === 'HIRING' ? 'Now Hiring' : 'Looking for Roles'}
                            </Button>
                        ))}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, i) => (
                            <Grid item key={i} xs={12} md={6}>
                                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: '24px' }} />
                            </Grid>
                        ))
                    ) : filteredCareers.length > 0 ? (
                        filteredCareers.map((career, index) => (
                            <Grid item key={career.id} xs={12} md={6}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    style={{ height: '100%' }}
                                >
                                    <Card sx={{
                                        display: 'flex', flexDirection: 'column',
                                        background: 'white',
                                        borderRadius: '24px',
                                        border: '1px solid #f1f5f9',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.02)',
                                        height: '100%',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                            borderColor: career.type === 'HIRING' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(236, 72, 153, 0.3)'
                                        }
                                    }}>
                                        {/* Status Accent Line */}
                                        <Box sx={{
                                            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                                            background: career.type === 'HIRING' ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ec4899, #f472b6)'
                                        }} />

                                        <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                                <Box>
                                                    <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px', mb: 0.5 }}>
                                                        {career.title}
                                                    </Typography>
                                                    {career.company && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                                                            <BusinessCenterIcon fontSize="small" sx={{ mr: 1, color: '#94a3b8' }} />
                                                            <Typography variant="body2" fontWeight={600}>{career.company}</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                                <Chip
                                                    label={career.type}
                                                    sx={{
                                                        background: career.type === 'HIRING' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                                                        color: career.type === 'HIRING' ? '#059669' : '#be185d',
                                                        fontWeight: 800,
                                                        px: 1,
                                                        borderRadius: '8px',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                />
                                            </Box>

                                            <Typography variant="body1" sx={{
                                                color: '#475569',
                                                mb: 4,
                                                lineHeight: 1.7,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {career.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4, mt: 'auto' }}>
                                                {career.skills?.map((skill, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={skill}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#f8fafc',
                                                            color: '#64748b',
                                                            fontWeight: 600,
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '6px'
                                                        }}
                                                    />
                                                ))}
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3, borderTop: '1px dashed #e2e8f0' }}>
                                                {career.salaryRange ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontWeight: 800 }}>
                                                        <MonetizationOnIcon fontSize="small" sx={{ mr: 1, color: '#10b981' }} />
                                                        {career.salaryRange}
                                                    </Box>
                                                ) : <Box />}

                                                <Button
                                                    variant="text"
                                                    endIcon={<ArrowForwardIcon />}
                                                    sx={{
                                                        color: career.type === 'HIRING' ? '#10b981' : '#ec4899',
                                                        fontWeight: 800,
                                                        textTransform: 'none',
                                                        p: 0,
                                                        '&:hover': { background: 'transparent', textDecoration: 'underline' }
                                                    }}
                                                >
                                                    Connect
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                <Box sx={{
                                    textAlign: 'center',
                                    py: 12,
                                    px: 4,
                                    background: 'rgba(255,255,255,0.5)',
                                    borderRadius: '32px',
                                    border: '1px dashed #cbd5e1'
                                }}>
                                    <WorkOutlineIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                                    <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 1 }}>No active signals.</Typography>
                                    <Typography variant="body1" sx={{ color: '#64748b' }}>Check back later or post your own listing to get started.</Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default CareerList;
