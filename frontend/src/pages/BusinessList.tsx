import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { Container, Typography, Box, Card, CardContent, Button, Chip, TextField, InputAdornment, Skeleton, GridLegacy as Grid, Dialog, DialogContent, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

interface Business {
    id: string;
    businessName: string;
    category: string;
    description: string;
    address: string;
    contactPhone?: string;
    workingHours?: string;
    logoUrl?: string;
    ownerName?: string;
    contactEmail?: string;
    website?: string;
}

const BusinessList = () => {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

    const categories = ['All', 'Retail', 'IT Services', 'Food & Beverage', 'Interior Design', 'Health & Fitness', 'Education', 'Other'];

    const handleShare = async (business: Business) => {
        const shareText = `Check out this business from our community directory!\n\n🏢 ${business.businessName}\n🏷️ Category: ${business.category}\n\n📝 ${business.description}\n\n📍 Address: ${business.address}${business.contactPhone ? `\n📞 Phone: ${business.contactPhone}` : ''}${business.contactEmail ? `\n✉️ Email: ${business.contactEmail}` : ''}${business.ownerName ? `\n👤 Owner: ${business.ownerName}` : ''}${business.website ? `\n🌐 Website: ${business.website}` : ''}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Business Recommendation: ${business.businessName}`,
                    text: shareText,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Business details copied to clipboard! You can now paste and share them.');
        }
    };

    useEffect(() => {
        const fetchBusinesses = async () => {
            setLoading(true);
            try {
                const { data } = await client.get('/business/all');
                setBusinesses(data.listings);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBusinesses();
    }, []);

    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                                label="SERVICES & STORES"
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
                                Business Directory
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, maxWidth: 600, lineHeight: 1.6 }}>
                                Discover, support, and collaborate with trusted businesses run by community members.
                            </Typography>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/business/create')}
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
                                List Business
                            </Button>
                        </motion.div>
                    </Box>

                    {/* Search & Filter Container */}
                    <Box sx={{
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(20px)',
                        p: 3, borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
                    }}>
                        <TextField
                            fullWidth
                            placeholder="Search by business name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#FA8231' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    bgcolor: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.02)',
                                    '& fieldset': { border: '1px solid #e2e8f0' },
                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                    '&.Mui-focused fieldset': { borderColor: '#FA8231', borderWidth: '2px' }
                                }
                            }}
                            sx={{ mb: 3 }}
                        />

                        {/* Category Chips */}
                        <Box sx={{
                            display: 'flex',
                            gap: 1.5,
                            overflowX: 'auto',
                            pb: 1,
                            '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}>
                            {categories.map((cat) => (
                                <Chip
                                    key={cat}
                                    label={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    sx={{
                                        fontWeight: 700,
                                        px: 1,
                                        borderRadius: '10px',
                                        background: selectedCategory === cat ? '#0f172a' : '#f8fafc',
                                        color: selectedCategory === cat ? 'white' : '#64748b',
                                        border: selectedCategory === cat ? '1px solid #0f172a' : '1px solid #e2e8f0',
                                        '&:hover': {
                                            background: selectedCategory === cat ? '#1e293b' : '#f1f5f9'
                                        },
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: selectedCategory === cat ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Grid */}
                <Grid container spacing={4}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, i) => (
                            <Grid item key={i} xs={12} sm={6} md={4}>
                                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '24px' }} />
                            </Grid>
                        ))
                    ) : filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map((business, index) => (
                            <Grid item key={business.id} xs={12} sm={6} md={4}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    style={{ height: '100%' }}
                                >
                                    <Card
                                        onClick={() => setSelectedBusiness(business)}
                                        sx={{
                                            background: 'white',
                                            borderRadius: '24px',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.02)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                                borderColor: 'rgba(250, 130, 49, 0.3)'
                                            }
                                        }}>
                                        <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                                                {/* Logo Implementation */}
                                                <Box sx={{
                                                    width: 64, height: 64,
                                                    minWidth: 64,
                                                    background: BRAND_GRADIENT_LIGHT,
                                                    borderRadius: '16px',
                                                    color: '#E62A4D',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    border: '1px solid rgba(230,42,77,0.1)'
                                                }}>
                                                    {business.logoUrl ? (
                                                        <img
                                                            src={business.logoUrl}
                                                            alt={`${business.businessName} logo`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <BusinessIcon fontSize="large" sx={{ opacity: 0.7 }} />
                                                    )}
                                                </Box>
                                                <Chip
                                                    label={business.category}
                                                    size="small"
                                                    sx={{ background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                                />
                                            </Box>

                                            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                                                {business.businessName}
                                            </Typography>

                                            <Typography variant="body1" sx={{
                                                color: '#475569',
                                                mb: 4,
                                                lineHeight: 1.6,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {business.description}
                                            </Typography>

                                            <Box sx={{ mt: 'auto', borderTop: '1px dashed #e2e8f0', pt: 3 }}>
                                                {business.ownerName && (
                                                    <Typography variant="subtitle2" sx={{ color: '#0f172a', mb: 1, fontWeight: 700 }}>
                                                        {business.ownerName}
                                                    </Typography>
                                                )}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#64748b', fontSize: '0.875rem' }}>
                                                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#FA8231' }} />
                                                    {business.address}
                                                </Box>

                                                <Button
                                                    size="small"
                                                    sx={{
                                                        color: '#E62A4D',
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
                                    <BusinessIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                                    <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 1 }}>No businesses found.</Typography>
                                    <Typography variant="body1" sx={{ color: '#64748b' }}>Try adjusting your search criteria or explore other categories.</Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    )}
                </Grid>

                {/* Business Details Modal */}
                <Dialog
                    open={!!selectedBusiness}
                    onClose={() => setSelectedBusiness(null)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }
                    }}
                >
                    {selectedBusiness && (
                        <>
                            <Box sx={{
                                p: 4,
                                background: 'radial-gradient(120% 100% at 50% 0%, rgba(250,130,49,0.05) 0%, rgba(255,255,255,1) 100%)',
                                borderBottom: '1px solid #f1f5f9',
                                position: 'relative'
                            }}>
                                <Typography variant="caption" fontWeight={700} sx={{ color: '#E62A4D', letterSpacing: '1px' }}>
                                    BUSINESS DIRECTORY
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 80, height: 80,
                                            background: BRAND_GRADIENT_LIGHT, borderRadius: '16px',
                                            color: '#FA8231', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden', border: '1px solid rgba(230,42,77,0.1)'
                                        }}>
                                            {selectedBusiness.logoUrl ? (
                                                <img
                                                    src={selectedBusiness.logoUrl}
                                                    alt={`${selectedBusiness.businessName} logo`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <BusinessIcon fontSize="large" sx={{ opacity: 0.7 }} />
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                                                {selectedBusiness.businessName}
                                            </Typography>
                                            <Chip label={selectedBusiness.category} size="small" sx={{ mt: 1, background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton onClick={() => handleShare(selectedBusiness)} size="small" sx={{ color: '#FA8231', background: 'rgba(250, 130, 49, 0.1)', '&:hover': { background: 'rgba(250, 130, 49, 0.2)' } }} title="Share Business Details">
                                            <ShareIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => setSelectedBusiness(null)} size="small" sx={{ color: '#64748b', background: '#f8fafc', '&:hover': { background: '#f1f5f9' } }}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>

                            <DialogContent sx={{ p: 4 }}>
                                <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>About</Typography>
                                <Typography variant="body1" sx={{ color: '#334155', mb: 4, lineHeight: 1.7, fontSize: '1.05rem' }}>
                                    {selectedBusiness.description}
                                </Typography>

                                <Box sx={{ display: 'grid', gap: 3 }}>
                                    {selectedBusiness.ownerName && (
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <PersonIcon sx={{ color: '#FA8231' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 600 }}>Owner</Typography>
                                                <Typography variant="body1" fontWeight={700} sx={{ color: '#0f172a' }}>{selectedBusiness.ownerName}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LocationOnIcon sx={{ color: '#FA8231' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 600 }}>Address</Typography>
                                            <Typography variant="body1" fontWeight={700} sx={{ color: '#0f172a' }}>{selectedBusiness.address}</Typography>
                                        </Box>
                                    </Box>

                                    {selectedBusiness.contactPhone && (
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <PhoneIcon sx={{ color: '#FA8231' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 600 }}>Phone</Typography>
                                                <Typography variant="body1" fontWeight={700} sx={{ color: '#0f172a' }}>{selectedBusiness.contactPhone}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {selectedBusiness.contactEmail && (
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <EmailIcon sx={{ color: '#FA8231' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 600 }}>Email</Typography>
                                                <Typography variant="body1" fontWeight={700} sx={{ color: '#0f172a' }}>{selectedBusiness.contactEmail}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {selectedBusiness.workingHours && (
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <AccessTimeIcon sx={{ color: '#FA8231' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 600 }}>Working Hours</Typography>
                                                <Typography variant="body1" fontWeight={700} sx={{ color: '#0f172a' }}>{selectedBusiness.workingHours}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {selectedBusiness.website && (
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <LanguageIcon sx={{ color: '#FA8231' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 600 }}>Website</Typography>
                                                <Typography variant="body1" fontWeight={700} sx={{ color: '#E62A4D' }}>
                                                    <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {selectedBusiness.website}
                                                    </a>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ mt: 5 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => window.open(`mailto:${selectedBusiness.contactEmail}`)}
                                        disabled={!selectedBusiness.contactEmail}
                                        sx={{
                                            background: BRAND_GRADIENT,
                                            color: 'white',
                                            fontWeight: 800,
                                            py: 1.5,
                                            borderRadius: '16px',
                                            boxShadow: BRAND_SHADOW,
                                            textTransform: 'none',
                                            fontSize: '1.05rem',
                                            transition: 'all 0.3s',
                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 25px 50px -12px rgba(230, 42, 77, 0.5)' },
                                            '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8' }
                                        }}
                                    >
                                        Contact Business
                                    </Button>
                                </Box>
                            </DialogContent>
                        </>
                    )}
                </Dialog>
            </Container>
        </Box>
    );
};

export default BusinessList;
