import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Card, CardContent, Button, Chip, TextField, InputAdornment, Skeleton, GridLegacy as Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { motion } from 'framer-motion';

interface Business {
    id: string;
    businessName: string;
    category: string;
    description: string;
    address: string;
    contactPhone?: string;
    workingHours?: string;
    logoUrl?: string; // If added to schema later
}

const BusinessList = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Retail', 'IT Services', 'Food & Beverage', 'Interior Design', 'Health & Fitness', 'Education', 'Other'];

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
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 6, pb: 10 }}>
            <Container maxWidth="lg">

                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 6, gap: 3 }}>
                    <Box>
                        <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', letterSpacing: -1 }}>
                            Business Directory
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                            Discover and support local businesses.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: '#2563eb',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                            fontWeight: 700,
                            px: 3, py: 1.5,
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#1d4ed8' }
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
                                    <SearchIcon sx={{ color: '#94a3b8' }} />
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                '& fieldset': { border: '1px solid #e2e8f0' },
                                '&:hover fieldset': { borderColor: '#cbd5e1' },
                                '&.Mui-focused fieldset': { borderColor: '#2563eb' }
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
                                    bgcolor: selectedCategory === cat ? '#2563eb' : 'white',
                                    color: selectedCategory === cat ? 'white' : '#64748b',
                                    border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0',
                                    '&:hover': {
                                        bgcolor: selectedCategory === cat ? '#1d4ed8' : '#f1f5f9'
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
                                    <Card sx={{
                                        bgcolor: 'white',
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'visible'
                                    }}>
                                        <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 2, color: '#2563eb' }}>
                                                    <BusinessIcon />
                                                </Box>
                                                <Chip
                                                    label={business.category}
                                                    size="small"
                                                    sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }}
                                                />
                                            </Box>

                                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b' }}>
                                                {business.businessName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineClamp: 2 }}>
                                                {business.description}
                                            </Typography>

                                            <Box sx={{ mt: 'auto', borderTop: '1px solid #f1f5f9', pt: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#64748b', fontSize: '0.875rem' }}>
                                                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#94a3b8' }} />
                                                    {business.address}
                                                </Box>
                                                {business.contactPhone && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                                                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: '#94a3b8' }} />
                                                        {business.contactPhone}
                                                    </Box>
                                                )}
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
            </Container>
        </Box>
    );
};

export default BusinessList;
