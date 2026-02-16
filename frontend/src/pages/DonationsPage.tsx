import { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid, Divider, TextField, InputAdornment, Alert, CircularProgress } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const DonationsPage = () => {
    useAuth();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleDonate = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid donation amount.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await client.post('/community/donations/record', {
                amount: Number(amount),
                donationId: null, // Use default
                paymentMethod: 'ONLINE'
            });
            setSuccess(`Thank you! Your donation of ₹${amount} has been successfully recorded.`);
            setAmount('');
        } catch (err) {
            console.error('Donation failed', err);
            setError('Failed to record donation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#8B2635' }}>
                    Support Our Community
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
                    Your generous contributions help us organize cultural events, support community businesses, and maintain this platform for everyone.
                </Typography>

                {/* Donation Input Section */}
                <Box sx={{ maxWidth: 400, mx: 'auto', mb: 6, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Make a Contribution
                    </Typography>
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        fullWidth
                        label="Amount"
                        variant="outlined"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleDonate}
                        disabled={loading}
                        sx={{ bgcolor: '#8B2635', '&:hover': { bgcolor: '#A0522D' } }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Donate Now'}
                    </Button>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {/* Bank Transfer Option */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 4 }}>
                                <AccountBalanceIcon sx={{ fontSize: 60, color: '#8B2635', mb: 2 }} />
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Bank Transfer
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ textAlign: 'left', mt: 2 }}>
                                    <Typography variant="body1" gutterBottom><strong>Account Name:</strong> Arya Vyshya Samaj</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Bank:</strong> City Community Bank</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Account No:</strong> 1234 5678 9012</Typography>
                                    <Typography variant="body1" gutterBottom><strong>IFSC Code:</strong> CITY0001234</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* QR Code Option */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 4 }}>
                                <QrCode2Icon sx={{ fontSize: 60, color: '#8B2635', mb: 2 }} />
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Scan to Pay
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                {/* Placeholder for actual QR image */}
                                <Box sx={{
                                    width: 200,
                                    height: 200,
                                    mx: 'auto',
                                    bgcolor: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2,
                                    border: '2px dashed #999',
                                    mb: 2
                                }}>
                                    <Typography variant="body2" color="text.secondary">QR Code Placeholder</Typography>
                                </Box>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Accepts UPI, GPay, PhonePe
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 8, p: 4, bgcolor: '#FFF8F0', borderRadius: 3 }}>
                    <VolunteerActivismIcon sx={{ fontSize: 48, color: '#CD853F', mb: 2 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Why Donate?
                    </Typography>
                    <Typography variant="body1" paragraph>
                        100% of your donations go directly towards community welfare initiatives, including educational scholarships, emergency medical aid, and cultural festivals.
                    </Typography>
                    <Button variant="contained" size="large" sx={{ mt: 2, bgcolor: '#8B2635', '&:hover': { bgcolor: '#A0522D' } }} onClick={() => document.documentElement.scrollTop = 0}>
                        Scroll to Donate
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default DonationsPage;
