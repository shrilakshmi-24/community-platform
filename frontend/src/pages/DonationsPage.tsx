import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, LinearProgress, Skeleton, GridLegacy as Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import client from '../api/client';

const DonationsPage = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [amount, setAmount] = useState<number | ''>('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDonations = async () => {
        try {
            const { data } = await client.get('/donations/all');
            setCampaigns(data.donations.map((d: any) => ({
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

    const handleOpenDonate = (campaign: any) => {
        setSelectedCampaign(campaign);
        setAmount('');
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
            alert('Thank you for your donation!');
            setOpenDialog(false);
            fetchDonations(); // Refresh the progress bars
        } catch (error) {
            console.error('Donation failed', error);
            alert('Donation processing failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 6, pb: 10 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
                        Support Causes
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Your contribution helps build a stronger community.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#334155', mb: 3 }}>
                            Active Campaigns
                        </Typography>
                        {loading ? (
                            <Skeleton height={200} sx={{ borderRadius: 3 }} />
                        ) : campaigns.length > 0 ? (
                            campaigns.map((campaign) => (
                                <Card key={campaign.id} sx={{ mb: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
                                                    {campaign.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                                                    {campaign.description}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" fontWeight={700} color="primary">
                                                        Raised: ₹{(campaign.raised / 1000).toFixed(0)}k
                                                    </Typography>
                                                    <Typography variant="caption" fontWeight={700} sx={{ color: '#94a3b8' }}>
                                                        Goal: ₹{(campaign.target / 1000).toFixed(0)}k
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(campaign.raised / campaign.target) * 100}
                                                    sx={{ height: 8, borderRadius: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={<VolunteerActivismIcon />}
                                                    onClick={() => handleOpenDonate(campaign)}
                                                    sx={{
                                                        bgcolor: '#059669',
                                                        color: 'white', fontWeight: 700,
                                                        py: 1.5, borderRadius: 2,
                                                        boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
                                                        '&:hover': { bgcolor: '#047857' }
                                                    }}
                                                >
                                                    DONATE NOW
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                                No active campaigns at the moment.
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#334155', mb: 3 }}>
                            Scan to Pay
                        </Typography>
                        <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center', p: 4 }}>
                            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, border: '1px dashed #cbd5e1', display: 'inline-block', mb: 3 }}>
                                <QrCode2Icon sx={{ fontSize: 150, color: '#1e293b' }} />
                            </Box>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
                                Arya Vaishya Community Fund
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                                UPI ID: gavs.community@upi
                            </Typography>
                            <Button variant="outlined" startIcon={<CurrencyRupeeIcon />} fullWidth sx={{ borderColor: '#cbd5e1', color: '#475569' }}>
                                Copy UPI ID
                            </Button>
                        </Card>
                    </Grid>
                </Grid>

                {/* Donation Dialog */}
                <Dialog open={openDialog} onClose={() => !isSubmitting && setOpenDialog(false)} maxWidth="xs" fullWidth>
                    <DialogTitle fontWeight={800} color="#1e293b">
                        Donate to {selectedCampaign?.title}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                            <TextField
                                label="Amount (₹)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value) || '')}
                                disabled={isSubmitting}
                                InputProps={{
                                    startAdornment: <CurrencyRupeeIcon sx={{ color: '#64748b', mr: 1, fontSize: 20 }} />
                                }}
                            />
                            <FormControl fullWidth disabled={isSubmitting}>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    value={paymentMethod}
                                    label="Payment Method"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <MenuItem value="UPI">UPI</MenuItem>
                                    <MenuItem value="CARD">Credit / Debit Card</MenuItem>
                                    <MenuItem value="NETBANKING">Net Banking</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenDialog(false)} disabled={isSubmitting} sx={{ color: '#64748b', fontWeight: 600 }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleDonateSubmit}
                            disabled={isSubmitting || !amount}
                            sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, fontWeight: 700, px: 3 }}
                        >
                            {isSubmitting ? 'Processing...' : 'Complete Payment'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default DonationsPage;
