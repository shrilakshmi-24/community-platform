import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Card, CardContent, Button, Chip, Skeleton, GridLegacy as Grid } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { motion } from 'framer-motion';

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
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 6, pb: 10 }}>
            <Container maxWidth="lg">

                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 8, gap: 3 }}>
                    <Box>
                        <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', letterSpacing: -1 }}>
                            Career Opportunities
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                            Find jobs or hire talent within the community.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, bgcolor: 'white', p: 0.5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        {['ALL', 'HIRING', 'SEEKING'].map((f) => (
                            <Button
                                key={f}
                                variant={filter === f ? 'contained' : 'text'}
                                onClick={() => setFilter(f as any)}
                                sx={{
                                    borderRadius: 2.5,
                                    px: 3,
                                    bgcolor: filter === f ? '#2563eb' : 'transparent',
                                    color: filter === f ? 'white' : '#64748b',
                                    fontWeight: 700,
                                    boxShadow: filter === f ? '0 2px 4px rgba(37,99,235,0.2)' : 'none',
                                    '&:hover': { bgcolor: filter === f ? '#1d4ed8' : '#f1f5f9' }
                                }}
                            >
                                {f}
                            </Button>
                        ))}
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, i) => (
                            <Grid item key={i} xs={12} md={6}><Skeleton height={200} sx={{ borderRadius: 4 }} /></Grid>
                        ))
                    ) : filteredCareers.length > 0 ? (
                        filteredCareers.map((career, index) => (
                            <Grid item key={career.id} xs={12} md={6}>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <Card sx={{
                                        bgcolor: 'white',
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                        borderLeft: `4px solid ${career.type === 'HIRING' ? '#10b981' : '#ec4899'}`,
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ p: 4 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>{career.title}</Typography>
                                                    {career.company && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', mt: 0.5 }}>
                                                            <BusinessCenterIcon fontSize="small" sx={{ mr: 1, color: '#94a3b8' }} />
                                                            {career.company}
                                                        </Box>
                                                    )}
                                                </Box>
                                                <Chip
                                                    label={career.type}
                                                    sx={{
                                                        bgcolor: career.type === 'HIRING' ? '#d1fae5' : '#fce7f3',
                                                        color: career.type === 'HIRING' ? '#065f46' : '#9d174d',
                                                        fontWeight: 700,
                                                        borderRadius: 1
                                                    }}
                                                />
                                            </Box>

                                            <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
                                                {career.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                                {career.skills?.map((skill, i) => (
                                                    <Chip key={i} label={skill} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500 }} />
                                                ))}
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                                {career.salaryRange && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 600 }}>
                                                        <MonetizationOnIcon fontSize="small" sx={{ mr: 1 }} />
                                                        {career.salaryRange}
                                                    </Box>
                                                )}
                                                <Button size="small" sx={{ color: '#2563eb', fontWeight: 600 }}>
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
                            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
                                <Typography variant="h6" color="text.secondary">No active signals.</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default CareerList;
