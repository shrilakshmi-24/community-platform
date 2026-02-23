import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Button, Skeleton, Card, CardContent, Chip, Dialog, DialogContent, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

interface Scholarship {
    id: string;
    title: string;
    description: string;
    amount: string;
    deadline: string;
    educationLevel: string;
    applicationLink?: string;
    providerName?: string;
    eligibility?: string;
    requiredDocuments?: string;
    contactEmail?: string;
    contactPhone?: string;
    mediaUrl?: string;
}

const ScholarshipsPage = () => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const { data } = await client.get('/community/scholarships');
                setScholarships(data.scholarships);
            } catch (error) {
                console.error(error);
                setScholarships([]);
            } finally {
                setLoading(false);
            }
        };
        fetchScholarships();
    }, []);

    const isExpired = (deadline: string) => new Date(deadline) < new Date();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fdf2f4', pt: 6, pb: 10 }}>
            <Container maxWidth="xl">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#E62A4D', mb: 2, letterSpacing: -1 }}>
                        Scholarships & Grants
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FA8231', opacity: 0.8 }}>
                        Investing in the bright future of our community.
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 4 }}>
                        {Array.from(new Array(4)).map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={350} sx={{ borderRadius: 6 }} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 4 }}>
                        {scholarships.map((scholarship, index) => {
                            const expired = isExpired(scholarship.deadline);
                            return (
                                <motion.div
                                    key={scholarship.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex', flexDirection: 'column',
                                        borderRadius: 6,
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(139, 38, 53, 0.05)',
                                        transition: 'all 0.3s ease',
                                        bgcolor: 'white',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 25px -5px rgba(139, 38, 53, 0.15), 0 10px 10px -5px rgba(139, 38, 53, 0.05)'
                                        }
                                    }}>
                                        {/* Header Concept: Maroon Gradient */}
                                        <Box sx={{
                                            p: 4,
                                            background: 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)',
                                            color: 'white',
                                            position: 'relative'
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box sx={{
                                                    p: 1,
                                                    bgcolor: 'rgba(255,255,255,0.15)',
                                                    borderRadius: 2,
                                                    color: 'white',
                                                    backdropFilter: 'blur(4px)'
                                                }}>
                                                    <SchoolIcon />
                                                </Box>
                                                <Chip
                                                    label={expired ? "CLOSED" : "OPEN"}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: expired ? 'rgba(0,0,0,0.4)' : '#d1fae5',
                                                        color: expired ? '#e5e7eb' : '#065f46',
                                                        fontWeight: 700,
                                                        border: 'none'
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2, mb: 1 }}>
                                                {scholarship.amount}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                                MAXIMUM GRANT
                                            </Typography>
                                        </Box>

                                        <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 2, lineHeight: 1.3 }}>
                                                {scholarship.title}
                                            </Typography>

                                            <Typography variant="body2" sx={{
                                                color: '#64748b', mb: 3, flexGrow: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {scholarship.description}
                                            </Typography>

                                            <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 3, mb: 3 }}>
                                                <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontWeight: 600, mb: 0.5 }}>
                                                    ELIGIBILITY
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} sx={{
                                                    color: '#334155',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {scholarship.eligibility}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: '#B44C5C', fontSize: '0.875rem', fontWeight: 600 }}>
                                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1, opacity: 0.8 }} />
                                                    {new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </Box>

                                                <Button
                                                    endIcon={<ArrowForwardIcon />}
                                                    onClick={() => setSelectedScholarship(scholarship)}
                                                    sx={{
                                                        color: '#FA8231',
                                                        fontWeight: 700,
                                                        textTransform: 'none',
                                                        '&:hover': { bgcolor: '#fdf2f4' }
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </Box>
                )}

                {/* Detail Modal */}
                <Dialog
                    open={!!selectedScholarship}
                    onClose={() => setSelectedScholarship(null)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: 6, p: 0, overflow: 'hidden' }
                    }}
                >
                    {selectedScholarship && (
                        <>
                            <Box sx={{
                                p: 4,
                                background: 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)',
                                color: 'white',
                                position: 'relative'
                            }}>
                                <IconButton
                                    onClick={() => setSelectedScholarship(null)}
                                    sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                                    SCHOLARSHIP DETAILS
                                </Typography>
                                <Typography variant="h5" fontWeight={800} sx={{ mt: 1, mb: 1 }}>
                                    {selectedScholarship.title}
                                </Typography>
                                <Chip
                                    label={scholarships.find(s => s.id === selectedScholarship.id)?.amount}
                                    sx={{ bgcolor: 'white', color: '#FA8231', fontWeight: 800 }}
                                />
                            </Box>

                            <DialogContent sx={{ p: 4 }}>
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
                                        Description
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.6 }}>
                                        {selectedScholarship.description}
                                    </Typography>
                                </Box>

                                {selectedScholarship.eligibility && (
                                    <Box sx={{ mb: 4, bgcolor: '#fdf2f4', p: 3, borderRadius: 2, border: '1px solid #fce7f3' }}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#FA8231', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Eligibility Criteria
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#E62A4D' }}>
                                            {selectedScholarship.eligibility}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
                                    {selectedScholarship.educationLevel && (
                                        <Box>
                                            <Typography variant="caption" display="block" sx={{ color: '#64748b', mb: 0.5 }}>Target Education</Typography>
                                            <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b', bgcolor: '#f1f5f9', py: 0.5, px: 1.5, borderRadius: 1, display: 'inline-block' }}>
                                                {selectedScholarship.educationLevel}
                                            </Typography>
                                        </Box>
                                    )}

                                    {selectedScholarship.providerName && (
                                        <Box>
                                            <Typography variant="caption" display="block" sx={{ color: '#64748b', mb: 0.5 }}>Provided By</Typography>
                                            <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>
                                                {selectedScholarship.providerName}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {selectedScholarship.requiredDocuments && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 1, fontSize: '1rem' }}>
                                            Required Documents
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#334155', whiteSpace: 'pre-line' }}>
                                            {selectedScholarship.requiredDocuments}
                                        </Typography>
                                    </Box>
                                )}

                                {(selectedScholarship.contactEmail || selectedScholarship.contactPhone) && (
                                    <Box sx={{ mb: 4, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#64748b', mb: 1 }}>Contact Information</Typography>
                                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                            {selectedScholarship.contactEmail && (
                                                <Typography variant="body2" sx={{ color: '#334155' }}>
                                                    <strong>Email:</strong> {selectedScholarship.contactEmail}
                                                </Typography>
                                            )}
                                            {selectedScholarship.contactPhone && (
                                                <Typography variant="body2" sx={{ color: '#334155' }}>
                                                    <strong>Phone:</strong> {selectedScholarship.contactPhone}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#B44C5C', fontWeight: 600, bgcolor: '#fdf2f4', p: 2, borderRadius: 2, width: 'fit-content', mb: 4 }}>
                                    <CalendarMonthIcon fontSize="small" />
                                    <Typography variant="body2" fontWeight={600}>
                                        Deadline: {new Date(selectedScholarship.deadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                                    <Button
                                        onClick={() => setSelectedScholarship(null)}
                                        sx={{ color: '#64748b', fontWeight: 600 }}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={new Date(selectedScholarship.deadline) < new Date()}
                                        onClick={() => {
                                            // Apply Logic
                                        }}
                                        sx={{
                                            bgcolor: '#FA8231',
                                            boxShadow: '0 4px 6px -1px rgba(139, 38, 53, 0.2)',
                                            px: 4,
                                            '&:hover': { bgcolor: '#E62A4D' },
                                            '&.Mui-disabled': { bgcolor: '#cbd5e1', color: '#fff' }
                                        }}
                                    >
                                        {new Date(selectedScholarship.deadline) < new Date() ? 'Deadline Passed' : 'Apply Now'}
                                    </Button>
                                </Box>
                            </DialogContent>
                        </>
                    )}
                </Dialog>
            </Container >
        </Box >
    );
};

export default ScholarshipsPage;
