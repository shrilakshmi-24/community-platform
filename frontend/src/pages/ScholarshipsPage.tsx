import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Button, Skeleton, Card, CardContent, Chip, Dialog, DialogContent, IconButton, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

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
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', fontFamily: "'Inter', sans-serif", pb: 12 }}>
            <Box sx={{
                position: 'relative',
                pt: { xs: 8, md: 10 }, pb: { xs: 8, md: 10 },
                background: 'radial-gradient(120% 100% at 50% -10%, rgba(250,130,49,0.08) 0%, rgba(255,255,255,1) 100%)',
                overflow: 'hidden',
                mb: 6
            }}>
                <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, background: 'rgba(230, 42, 77, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />
                <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 500, height: 500, background: 'rgba(250, 130, 49, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Chip
                            label="EDUCATION EMPOWERMENT"
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
                            Scholarships & Grants
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, maxWidth: 600, lineHeight: 1.6, mx: 'auto' }}>
                            Investing in the bright future of our community through financial aid and educational support.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {loading ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 4 }}>
                        {Array.from(new Array(4)).map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={350} sx={{ borderRadius: '24px' }} />
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
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    style={{ height: '100%' }}
                                >
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex', flexDirection: 'column',
                                        borderRadius: '24px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.02)',
                                        border: '1px solid #f1f5f9',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        bgcolor: 'white',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                            borderColor: 'rgba(250, 130, 49, 0.3)'
                                        }
                                    }}>
                                        <Box sx={{
                                            p: 4,
                                            background: BRAND_GRADIENT,
                                            color: 'white',
                                            position: 'relative'
                                        }}>
                                            <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, position: 'relative', zIndex: 2 }}>
                                                <Avatar sx={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white' }}>
                                                    <SchoolIcon />
                                                </Avatar>
                                                <Chip
                                                    label={expired ? "DEADLINE PASSED" : "ACCEPTING APPLICATIONS"}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: expired ? 'rgba(0,0,0,0.6)' : 'rgba(255, 255, 255, 0.95)',
                                                        color: expired ? '#ffffff' : '#E62A4D',
                                                        fontWeight: 800,
                                                        border: 'none',
                                                        backdropFilter: 'blur(4px)',
                                                        letterSpacing: '0.5px',
                                                        boxShadow: expired ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="h4" fontWeight={900} sx={{ color: 'white', lineHeight: 1.2, mb: 0.5, position: 'relative', zIndex: 2 }}>
                                                {scholarship.amount}
                                            </Typography>
                                            <Typography variant="subtitle2" sx={{ color: 'white', opacity: 0.9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', position: 'relative', zIndex: 2 }}>
                                                Maximum Grant
                                            </Typography>
                                        </Box>

                                        <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 2, lineHeight: 1.3, letterSpacing: '-0.5px' }}>
                                                {scholarship.title}
                                            </Typography>

                                            <Typography variant="body1" sx={{
                                                color: '#475569', mb: 3, flexGrow: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                lineHeight: 1.6
                                            }}>
                                                {scholarship.description}
                                            </Typography>

                                            {scholarship.eligibility && (
                                                <Box sx={{ bgcolor: '#f8fafc', p: 2.5, borderRadius: '16px', mb: 3, border: '1px dashed #cbd5e1' }}>
                                                    <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontWeight: 800, mb: 1, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                        Eligibility Highlights
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600} sx={{
                                                        color: '#334155',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        lineHeight: 1.5
                                                    }}>
                                                        {scholarship.eligibility}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 3, borderTop: '1px solid #f1f5f9' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: expired ? '#94a3b8' : '#E62A4D', fontSize: '0.875rem', fontWeight: 700 }}>
                                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                                                    {new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </Box>

                                                <Button
                                                    endIcon={<ArrowForwardIcon />}
                                                    onClick={() => setSelectedScholarship(scholarship)}
                                                    sx={{
                                                        color: '#FA8231',
                                                        fontWeight: 800,
                                                        textTransform: 'none',
                                                        p: 0,
                                                        '&:hover': { background: 'transparent', textDecoration: 'underline' }
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
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: '24px', p: 0, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }
                    }}
                >
                    {selectedScholarship && (
                        <>
                            <Box sx={{
                                p: { xs: 4, md: 6 },
                                background: BRAND_GRADIENT,
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <Box sx={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                                <IconButton
                                    onClick={() => setSelectedScholarship(null)}
                                    sx={{ position: 'absolute', right: 16, top: 16, color: 'white', background: 'rgba(0,0,0,0.1)', '&:hover': { background: 'rgba(0,0,0,0.2)' } }}
                                >
                                    <CloseIcon />
                                </IconButton>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 2 }}>
                                    <Avatar sx={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', width: 64, height: 64, mr: 3 }}>
                                        <SchoolIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Chip
                                            label={scholarships.find(s => s.id === selectedScholarship.id)?.amount}
                                            sx={{ bgcolor: 'white', color: '#E62A4D', fontWeight: 900, mb: 1, fontSize: '1.1rem', py: 2, px: 1 }}
                                        />
                                    </Box>
                                </Box>

                                <Typography variant="h3" fontWeight={900} sx={{ mb: 1, letterSpacing: '-1px', position: 'relative', zIndex: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                                    {selectedScholarship.title}
                                </Typography>
                                {selectedScholarship.providerName && (
                                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600, position: 'relative', zIndex: 2 }}>
                                        Provided by {selectedScholarship.providerName}
                                    </Typography>
                                )}
                            </Box>

                            <DialogContent sx={{ p: { xs: 4, md: 6 } }}>
                                <Box sx={{ mb: 5 }}>
                                    <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 2, letterSpacing: '-0.5px' }}>
                                        Overview
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem' }}>
                                        {selectedScholarship.description}
                                    </Typography>
                                </Box>

                                {selectedScholarship.eligibility && (
                                    <Box sx={{ mb: 5, bgcolor: '#f8fafc', p: 4, borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
                                        <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#E62A4D', mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Eligibility Criteria
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7 }}>
                                            {selectedScholarship.eligibility}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, mb: 5 }}>
                                    {selectedScholarship.educationLevel && (
                                        <Box>
                                            <Typography variant="caption" display="block" sx={{ color: '#64748b', mb: 1, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Target Education Level</Typography>
                                            <Chip label={selectedScholarship.educationLevel} sx={{ background: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 800, borderRadius: '8px' }} />
                                        </Box>
                                    )}

                                    <Box>
                                        <Typography variant="caption" display="block" sx={{ color: '#64748b', mb: 1, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Application Deadline</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#1e293b', fontWeight: 700 }}>
                                            <CalendarMonthIcon sx={{ mr: 1, color: '#FA8231' }} />
                                            {new Date(selectedScholarship.deadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Box>
                                    </Box>
                                </Box>

                                {selectedScholarship.requiredDocuments && (
                                    <Box sx={{ mb: 5 }}>
                                        <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 2, letterSpacing: '-0.5px' }}>
                                            Required Documents
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#475569', whiteSpace: 'pre-line', lineHeight: 1.8, bgcolor: '#f1f5f9', p: 3, borderRadius: '16px' }}>
                                            {selectedScholarship.requiredDocuments}
                                        </Typography>
                                    </Box>
                                )}

                                {(selectedScholarship.contactEmail || selectedScholarship.contactPhone) && (
                                    <Box sx={{ mb: 5 }}>
                                        <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', mb: 2 }}>Contact Information</Typography>
                                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', bgcolor: 'rgba(250, 130, 49, 0.05)', p: 3, borderRadius: '16px', border: '1px solid rgba(250, 130, 49, 0.2)' }}>
                                            {selectedScholarship.contactEmail && (
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#FA8231', fontWeight: 700, textTransform: 'uppercase' }}>Email</Typography>
                                                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>{selectedScholarship.contactEmail}</Typography>
                                                </Box>
                                            )}
                                            {selectedScholarship.contactPhone && (
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#FA8231', fontWeight: 700, textTransform: 'uppercase' }}>Phone</Typography>
                                                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>{selectedScholarship.contactPhone}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 4, borderTop: '1px solid #e2e8f0' }}>
                                    <Button
                                        onClick={() => setSelectedScholarship(null)}
                                        sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none', px: 3 }}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={new Date(selectedScholarship.deadline) < new Date()}
                                        onClick={() => {
                                            if (selectedScholarship.applicationLink) {
                                                window.open(selectedScholarship.applicationLink, '_blank');
                                            }
                                        }}
                                        sx={{
                                            background: BRAND_GRADIENT,
                                            boxShadow: BRAND_SHADOW,
                                            color: 'white',
                                            fontWeight: 800,
                                            px: 5, py: 1.5,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            '&:hover': { transform: 'translateY(-2px)' },
                                            '&.Mui-disabled': { background: '#cbd5e1', color: '#fff', boxShadow: 'none' }
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
