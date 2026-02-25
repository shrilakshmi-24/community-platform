import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, LinearProgress, Skeleton, GridLegacy as Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, Select, MenuItem, Chip, Snackbar, Alert, Stack, IconButton, InputAdornment } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

import PublicIcon from '@mui/icons-material/Public';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';
const BRAND_SHADOW = '0 10px 20px -5px rgba(230, 42, 77, 0.3)';

interface DonationCampaign {
    id: string;
    title: string;
    target: number;
    raised: number;
    description: string;
    upiId?: string;
}

const DonationsPage = () => {
    const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
    const [amount, setAmount] = useState<number | ''>('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [successSnackbar, setSuccessSnackbar] = useState(false);

    const quickAmounts = [500, 1000, 2500, 5000];

    const fetchDonations = async () => {
        try {
            const { data } = await client.get('/donations/all');
            setCampaigns(data.donations.map((d: { id: string, title: string, targetAmount?: number, collectedAmount?: number, description: string, upiId?: string }) => ({
                id: d.id,
                title: d.title,
                target: d.targetAmount || 0,
                raised: d.collectedAmount || 0,
                description: d.description,
                upiId: d.upiId
            })));
        } catch (error) {
            console.error('Failed to fetch donations', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleOpenDonate = (campaign: DonationCampaign) => {
        setSelectedCampaign(campaign);
        setAmount(1000); // Defaulting to a quick amount for faster UX
        setPaymentMethod('UPI');
        setOpenDialog(true);
    };

    const handleDonateSubmit = async () => {
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        setIsSubmitting(true);
        try {
            await client.post('/donations/record', {
                amount: Number(amount),
                donationId: selectedCampaign?.id,
                paymentMethod,
                paymentStatus: 'SUCCESS'
            });
            setSuccessSnackbar(true);
            setOpenDialog(false);
            fetchDonations(); // Refresh the progress bars
        } catch (error) {
            console.error('Donation failed', error);
            alert('Donation processing failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyUpi = () => {
        navigator.clipboard.writeText('gavs.community@upi');
        setSnackbarOpen(true);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 6, fontFamily: "'Inter', sans-serif" }}>
            {/* Standardized Modern Hero Section - Compacted */}
            <Box sx={{
                position: 'relative',
                pt: { xs: 4, md: 6 }, pb: { xs: 4, md: 5 },
                bgcolor: '#ffffff',
                overflow: 'hidden',
                mb: 4,
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
                <Box sx={{ position: 'absolute', top: '-20%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(230,42,77,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
                        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Typography variant="h2" fontWeight={900} sx={{
                                color: '#0f172a',
                                letterSpacing: '-1px',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '3rem' },
                                lineHeight: 1.2
                            }}>
                                Make a <Box component="span" sx={{ background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Difference</Box>
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, fontSize: '1.1rem', lineHeight: 1.5, mx: 'auto' }}>
                                Your contribution empowers initiatives, builds a stronger community, and makes a real impact.
                            </Typography>
                        </motion.div>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                            <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                                <PublicIcon sx={{ color: '#E62A4D', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                                    Active Campaigns
                                </Typography>
                            </Box>
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {Array.from(new Array(3)).map((_, i) => (
                                    <Skeleton key={i} variant="rectangular" height={160} sx={{ borderRadius: '20px' }} />
                                ))}
                            </Box>
                        ) : campaigns.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {campaigns.map((campaign, index) => {
                                    const progress = Math.min((campaign.raised / Math.max(campaign.target, 1)) * 100, 100);
                                    return (
                                        <motion.div
                                            key={campaign.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                        >
                                            <Card sx={{
                                                borderRadius: '20px',
                                                bgcolor: 'white',
                                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                                boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 15px 30px -10px rgba(230, 42, 77, 0.1)',
                                                    borderColor: 'rgba(230, 42, 77, 0.3)'
                                                }
                                            }}>
                                                <Box sx={{
                                                    position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                                                    background: BRAND_GRADIENT
                                                }} />
                                                <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pl: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
                                                    <Grid container spacing={3} alignItems="center">
                                                        <Grid item xs={12} sm={8}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                                                                    {campaign.title}
                                                                </Typography>
                                                                <Chip
                                                                    label="Verified"
                                                                    size="small"
                                                                    icon={<CheckCircleOutlineIcon sx={{ fontSize: '12px !important' }} />}
                                                                    sx={{ bgcolor: '#fff0f2', color: '#E62A4D', fontWeight: 700, height: 20, '& .MuiChip-label': { px: 1 } }}
                                                                />
                                                            </Box>
                                                            <Typography variant="body2" sx={{ color: '#475569', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {campaign.description}
                                                            </Typography>

                                                            <Box sx={{ px: 2, py: 1.5, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                                        <Box component="span" sx={{ color: '#E62A4D', fontWeight: 800, fontSize: '14px' }}>₹{(campaign.raised).toLocaleString()}</Box> raised
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                                        Goal: ₹{(campaign.target).toLocaleString()}
                                                                    </Typography>
                                                                </Box>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={progress}
                                                                    sx={{
                                                                        height: 8,
                                                                        borderRadius: 4,
                                                                        bgcolor: '#e2e8f0',
                                                                        '& .MuiLinearProgress-bar': {
                                                                            background: BRAND_GRADIENT,
                                                                            borderRadius: 4
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                onClick={() => handleOpenDonate(campaign)}
                                                                sx={{
                                                                    background: BRAND_GRADIENT,
                                                                    color: 'white',
                                                                    fontWeight: 700,
                                                                    py: 1.2,
                                                                    borderRadius: '12px',
                                                                    boxShadow: BRAND_SHADOW,
                                                                    textTransform: 'none',
                                                                    '&:hover': { opacity: 0.95 }
                                                                }}
                                                            >
                                                                Contribute
                                                            </Button>
                                                            <Button
                                                                variant="text"
                                                                fullWidth
                                                                size="small"
                                                                sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none' }}
                                                            >
                                                                Learn More
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
                                <FavoriteIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                                <Typography variant="h6" fontWeight={700} sx={{ color: '#0f172a' }}>No active campaigns</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>Check back later to support our causes.</Typography>
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={{ position: 'sticky', top: 24 }}>
                            <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', letterSpacing: '-0.5px' }}>
                                <QrCode2Icon sx={{ mr: 1, color: '#E62A4D', fontSize: 28 }} /> Direct Transfer
                            </Typography>
                            <Card sx={{
                                borderRadius: '24px',
                                border: 'none',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                            }}>
                                <Box sx={{ p: 3, background: '#0f172a', color: 'white', textAlign: 'center' }}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                                        Community General Trust
                                    </Typography>
                                    <Box sx={{
                                        bgcolor: 'white', p: 2, borderRadius: '16px', display: 'inline-block',
                                    }}>
                                        <QrCode2Icon sx={{ fontSize: 130, color: '#0f172a' }} />
                                    </Box>
                                </Box>
                                <Box sx={{ p: 3, bgcolor: 'white', textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                                        Official UPI ID
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#E62A4D', mb: 2 }}>
                                        gavs.community@upi
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ContentCopyIcon fontSize="small" />}
                                        fullWidth
                                        onClick={handleCopyUpi}
                                        sx={{
                                            borderColor: '#e2e8f0',
                                            color: '#334155',
                                            fontWeight: 700,
                                            py: 1,
                                            borderWidth: 2,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            '&:hover': { borderColor: '#E62A4D', color: '#E62A4D', borderWidth: 2, bgcolor: '#fff0f2' }
                                        }}
                                    >
                                        Copy UPI ID
                                    </Button>
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>

                {/* Modernized Compact Donation Dialog */}
                <AnimatePresence>
                    {openDialog && (
                        <Dialog
                            open={openDialog}
                            onClose={() => !isSubmitting && setOpenDialog(false)}
                            maxWidth="xs"
                            fullWidth
                            PaperProps={{
                                sx: { borderRadius: '24px', p: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }
                            }}
                        >
                            <Box sx={{ position: 'absolute', right: 12, top: 12 }}>
                                <IconButton size="small" onClick={() => setOpenDialog(false)} disabled={isSubmitting} sx={{ bgcolor: '#f1f5f9' }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
                                <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ letterSpacing: '-0.5px' }}>
                                    Support Cause
                                </Typography>
                                <Typography variant="body2" color="#64748b" sx={{ mt: 0.5, fontWeight: 500, px: 2 }}>
                                    Contributing to: <Box component="span" sx={{ color: '#0f172a', fontWeight: 700 }}>{selectedCampaign?.title}</Box>
                                </Typography>
                            </DialogTitle>

                            <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, pb: 2, pt: 2 }}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                            {quickAmounts.map((amt) => (
                                                <Grid item xs={3} key={amt}>
                                                    <Button
                                                        fullWidth
                                                        variant={amount === amt ? "contained" : "outlined"}
                                                        onClick={() => setAmount(amt)}
                                                        disabled={isSubmitting}
                                                        size="small"
                                                        sx={{
                                                            py: 0.8,
                                                            minWidth: 0,
                                                            borderRadius: '8px',
                                                            fontWeight: 700,
                                                            borderColor: amount === amt ? 'transparent' : '#e2e8f0',
                                                            color: amount === amt ? 'white' : '#475569',
                                                            background: amount === amt ? BRAND_GRADIENT : 'transparent',
                                                            boxShadow: amount === amt ? BRAND_SHADOW : 'none',
                                                            '&:hover': { borderColor: '#E62A4D', color: amount === amt ? 'white' : '#E62A4D' }
                                                        }}
                                                    >
                                                        ₹{amt}
                                                    </Button>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <TextField
                                            placeholder="Custom amount"
                                            type="number"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value) || '')}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon sx={{ color: '#E62A4D', fontSize: 20 }} /></InputAdornment>,
                                                sx: {
                                                    borderRadius: '12px',
                                                    fontWeight: 700,
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderWidth: 2 },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E62A4D' }
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                            Payment Method
                                        </Typography>
                                        <FormControl fullWidth disabled={isSubmitting} size="small">
                                            <Select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                sx={{
                                                    borderRadius: '12px',
                                                    fontWeight: 600,
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderWidth: 2 },
                                                }}
                                            >
                                                <MenuItem value="UPI" sx={{ fontWeight: 600 }}>UPI</MenuItem>
                                                <MenuItem value="CARD" sx={{ fontWeight: 600 }}>Card</MenuItem>
                                                <MenuItem value="NETBANKING" sx={{ fontWeight: 600 }}>Net Banking</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Stack>
                            </DialogContent>
                            <DialogActions sx={{ p: { xs: 2.5, sm: 3 }, pt: 0, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleDonateSubmit}
                                    disabled={isSubmitting || !amount}
                                    sx={{
                                        background: BRAND_GRADIENT,
                                        color: 'white',
                                        fontWeight: 800,
                                        py: 1.2,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        boxShadow: BRAND_SHADOW,
                                        '&:hover': { opacity: 0.95 }
                                    }}
                                >
                                    {isSubmitting ? 'Processing...' : `Donate ₹${amount || 0}`}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </AnimatePresence>

                <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={() => setSnackbarOpen(false)} icon={<CheckCircleOutlineIcon fontSize="inherit" />} severity="success" sx={{ width: '100%', borderRadius: '12px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        UPI ID copied!
                    </Alert>
                </Snackbar>

                <Snackbar open={successSnackbar} autoHideDuration={4000} onClose={() => setSuccessSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={() => setSuccessSnackbar(false)} icon={<VolunteerActivismIcon fontSize="inherit" />} severity="success" sx={{ width: '100%', borderRadius: '12px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#E62A4D', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
                        Thank you for your generous donation!
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default DonationsPage;
