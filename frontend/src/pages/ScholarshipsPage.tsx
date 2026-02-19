import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Button, Skeleton, Accordion, AccordionSummary, AccordionDetails, Chip, GridLegacy as Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { motion } from 'framer-motion';

interface Scholarship {
    id: string;
    title: string;
    description: string;
    amount: string;
    deadline: string;
    eligibility: string;
}

const ScholarshipsPage = () => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const { data } = await client.get('/community/scholarships/all');
                setScholarships(data.scholarships);
            } catch (error) {
                console.error(error);
                // Demo Data
                setScholarships([
                    { id: '1', title: 'Arya Vaishya Merit Scholarship 2026', description: 'For outstanding academic performance.', amount: '₹50,000', deadline: '2026-05-30', eligibility: 'Class 12 > 90%' },
                    { id: '2', title: 'Higher Education Grant', description: 'Support for engineering/medical students.', amount: '₹25,000', deadline: '2026-06-15', eligibility: 'Family Income < 5L' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchScholarships();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 6, pb: 10 }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
                        Scholarships & Grants
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Education support for our community's future.
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Skeleton height={80} sx={{ borderRadius: 2 }} />
                        <Skeleton height={80} sx={{ borderRadius: 2 }} />
                        <Skeleton height={80} sx={{ borderRadius: 2 }} />
                    </Box>
                ) : (
                    scholarships.map((scholarship, index) => (
                        <motion.div
                            key={scholarship.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Accordion
                                sx={{
                                    mb: 2,
                                    borderRadius: '12px !important',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                    border: '1px solid #e2e8f0',
                                    '&:before': { display: 'none' },
                                    overflow: 'hidden'
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#64748b' }} />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                        <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 1.5, color: '#2563eb' }}>
                                            <SchoolIcon />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1e293b' }}>
                                                {scholarship.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                Amount: <span style={{ color: '#059669', fontWeight: 600 }}>{scholarship.amount}</span>
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={new Date(scholarship.deadline) > new Date() ? "OPEN" : "CLOSED"}
                                            size="small"
                                            sx={{
                                                bgcolor: new Date(scholarship.deadline) > new Date() ? '#d1fae5' : '#f1f5f9',
                                                color: new Date(scholarship.deadline) > new Date() ? '#065f46' : '#94a3b8',
                                                fontWeight: 700
                                            }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9', p: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={8}>
                                            <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                                                {scholarship.description}
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 0.5 }}>
                                                Eligibility:
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                {scholarship.eligibility}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                                                <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                                                Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                            </Box>
                                            <Button variant="contained" fullWidth sx={{ bgcolor: '#2563eb', fontWeight: 600 }}>
                                                Apply Now
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))
                )}
            </Container>
        </Box>
    );
};

export default ScholarshipsPage;
