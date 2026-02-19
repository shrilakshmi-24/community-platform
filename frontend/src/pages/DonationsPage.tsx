import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, LinearProgress, Skeleton, GridLegacy as Grid } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const DonationsPage = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for UI
        setTimeout(() => {
            setCampaigns([
                { id: 1, title: 'Community Hall Renovation', target: 500000, raised: 320000, description: 'Upgrading the sound system and seating for better events.' },
                { id: 2, title: 'Medical Emergency Fund', target: 200000, raised: 150000, description: 'Immediate support for families in need.' }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

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
                        ) : campaigns.map((campaign) => (
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
                        ))}
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
                                UPI ID:gavs.community@upi
                            </Typography>
                            <Button variant="outlined" startIcon={<CurrencyRupeeIcon />} fullWidth sx={{ borderColor: '#cbd5e1', color: '#475569' }}>
                                Copy UPI ID
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DonationsPage;
