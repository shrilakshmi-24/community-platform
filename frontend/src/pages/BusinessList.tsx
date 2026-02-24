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
        <Box sx={{ minHeight: '100vh', bgcolor: '#fdf2f4', pt: 6, pb: 10 }}> {/* V5: Soft Maroon Tint Background */}
            <Container maxWidth="lg">

                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 6, gap: 3 }}>
                    <Box>
                        <Typography variant="h3" fontWeight={800} sx={{ color: '#E62A4D', letterSpacing: -1 }}> {/* V5: Dark Maroon Title */}
                            Business Directory
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FA8231', opacity: 0.8 }}> {/* V5: Maroon Text */}
                            Discover and support local businesses.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/business/create')}
                        sx={{
                            bgcolor: '#FA8231', // V5: Maroon Button
                            boxShadow: '0 4px 6px -1px rgba(139, 38, 53, 0.2)',
                            fontWeight: 700,
                            px: 3, py: 1.5,
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#E62A4D' } // V5: Darker Maroon Hover
                        }}
                    >
                        List Business
                    </Button>
                </Box>

                {/* Search & Filter */}
                <Box sx={{ mb: 6 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#B44C5C' }} /> {/* V5: Light Maroon Icon */}
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                '& fieldset': { border: '1px solid #e2e8f0' },
                                '&:hover fieldset': { borderColor: '#B44C5C' },
                                '&.Mui-focused fieldset': { borderColor: '#FA8231' } // V5: Maroon Focus
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
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    bgcolor: selectedCategory === cat ? '#FA8231' : 'white', // V5: Maroon Active
                                    color: selectedCategory === cat ? 'white' : '#64748b',
                                    border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0',
                                    '&:hover': {
                                        bgcolor: selectedCategory === cat ? '#E62A4D' : '#fdf2f4' // V5: Maroon Hover
                                    },
                                    transition: 'all 0.2s'
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Grid */}
                <Grid container spacing={4}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, i) => (
                            <Grid item key={i} xs={12} sm={6} md={4}><Skeleton height={250} sx={{ borderRadius: 4 }} /></Grid>
                        ))
                    ) : filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map((business, index) => (
                            <Grid item key={business.id} xs={12} sm={6} md={4}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card
                                        onClick={() => setSelectedBusiness(business)}
                                        sx={{
                                            bgcolor: 'white',
                                            borderRadius: 3,
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'visible',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 20px 25px -5px rgba(139, 38, 53, 0.1), 0 10px 10px -5px rgba(139, 38, 53, 0.04)' // V5: Maroon Shadow
                                            }
                                        }}>
                                        <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                                {/* V5: Logo Implementation */}
                                                <Box sx={{
                                                    width: 60, height: 60,
                                                    minWidth: 60, // Prevent shrinking
                                                    bgcolor: '#fdf2f4',
                                                    borderRadius: 3,
                                                    color: '#FA8231',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    border: '1px solid #fce7f3'
                                                }}>
                                                    {business.logoUrl ? (
                                                        <img
                                                            src={business.logoUrl}
                                                            alt={`${business.businessName} logo`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <BusinessIcon fontSize="large" />
                                                    )}
                                                </Box>
                                                <Chip
                                                    label={business.category}
                                                    size="small"
                                                    sx={{ bgcolor: '#fdf2f4', color: '#FA8231', fontWeight: 600 }} // V5: Maroon Chip
                                                />
                                            </Box>

                                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b', lineHeight: 1.2 }}>
                                                {business.businessName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {business.description}
                                            </Typography>

                                            <Box sx={{ mt: 'auto', borderTop: '1px solid #f1f5f9', pt: 2 }}>
                                                {business.ownerName && (
                                                    <Typography variant="subtitle2" sx={{ color: '#334155', mb: 1, fontWeight: 600 }}>
                                                        {business.ownerName}
                                                    </Typography>
                                                )}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#64748b', fontSize: '0.875rem' }}>
                                                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#B44C5C' }} /> {/* V5: Light Maroon Icon */}
                                                    {business.address}
                                                </Box>

                                                <Button
                                                    size="small"
                                                    sx={{
                                                        mt: 1,
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
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
                                <Typography variant="h6" color="text.secondary">No businesses found.</Typography>
                            </Box>
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
                        sx: { borderRadius: 4 }
                    }}
                >
                    {selectedBusiness && (
                        <>
                            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{
                                        width: 80, height: 80,
                                        bgcolor: '#fdf2f4', borderRadius: 2,
                                        color: '#FA8231', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden', border: '1px solid #fce7f3'
                                    }}>
                                        {selectedBusiness.logoUrl ? (
                                            <img
                                                src={selectedBusiness.logoUrl}
                                                alt={`${selectedBusiness.businessName} logo`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <BusinessIcon fontSize="large" />
                                        )}
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b' }}>
                                            {selectedBusiness.businessName}
                                        </Typography>
                                        <Chip label={selectedBusiness.category} size="small" sx={{ mt: 0.5, bgcolor: '#fdf2f4', color: '#FA8231', fontWeight: 600 }} />
                                    </Box>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => handleShare(selectedBusiness)} size="small" sx={{ mr: 1, color: '#FA8231', bgcolor: '#fdf2f4', '&:hover': { bgcolor: '#fce7f3' } }} title="Share Business Details">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton onClick={() => setSelectedBusiness(null)} size="small">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            <DialogContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>About</Typography>
                                <Typography variant="body1" sx={{ color: '#334155', mb: 3, lineHeight: 1.6 }}>
                                    {selectedBusiness.description}
                                </Typography>

                                <Box sx={{ display: 'grid', gap: 2 }}>
                                    {selectedBusiness.ownerName && (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <PersonIcon sx={{ color: '#94a3b8' }} />
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b' }}>Owner</Typography>
                                                <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>{selectedBusiness.ownerName}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <LocationOnIcon sx={{ color: '#94a3b8' }} />
                                        <Box>
                                            <Typography variant="caption" display="block" sx={{ color: '#64748b' }}>Address</Typography>
                                            <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>{selectedBusiness.address}</Typography>
                                        </Box>
                                    </Box>

                                    {selectedBusiness.contactPhone && (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <PhoneIcon sx={{ color: '#94a3b8' }} />
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b' }}>Phone</Typography>
                                                <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>{selectedBusiness.contactPhone}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {selectedBusiness.contactEmail && (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <EmailIcon sx={{ color: '#94a3b8' }} />
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b' }}>Email</Typography>
                                                <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>{selectedBusiness.contactEmail}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {selectedBusiness.workingHours && (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <AccessTimeIcon sx={{ color: '#94a3b8' }} />
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b' }}>Working Hours</Typography>
                                                <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>{selectedBusiness.workingHours}</Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {selectedBusiness.website && (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <LanguageIcon sx={{ color: '#94a3b8' }} />
                                            <Box>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b' }}>Website</Typography>
                                                <Typography variant="body2" fontWeight={600} sx={{ color: '#2563eb' }}>
                                                    <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {selectedBusiness.website}
                                                    </a>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
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
