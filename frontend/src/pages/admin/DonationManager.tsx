import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Card, CardContent, Chip, Avatar, GridLegacy as Grid } from '@mui/material';
import client from '../../api/client';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface Campaign {
    id: string;
    title: string;
    target: number;
    collected: number;
    transactionCount: number;
}

interface DonationSummary {
    totalAmount: number;
    uniqueDonors: number;
    campaigns: Campaign[];
}

interface Transaction {
    id: string;
    donorName: string;
    donorEmail: string;
    amount: number;
    createdAt: string;
    paymentMethod: string;
    paymentStatus: string;
    donorUser?: {
        profile?: {
            fullName?: string;
            email?: string;
        };
    };
    donation?: {
        title?: string;
    };
}

const DonationManager = () => {
    const [summary, setSummary] = useState<DonationSummary | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const summaryRes = await client.get('/admin/donations/summary');
                const transactionsRes = await client.get('/admin/donations/transactions');
                setSummary(summaryRes.data);
                setTransactions(transactionsRes.data.transactions);
            } catch (error) {
                console.error('Failed to fetch donation data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><LinearProgress sx={{ width: '50%', '& .MuiLinearProgress-bar': { background: BRAND_GRADIENT } }} /></Box>;

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <VolunteerActivismIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Donation Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Track and manage community contributions
                    </Typography>
                </Box>
            </Box>

            {summary && (
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            p: 3,
                            borderRadius: '20px',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                            <Avatar sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', width: 56, height: 56 }}>
                                <AccountBalanceWalletIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1, mb: 0.5 }}>
                                    ₹{summary.totalAmount.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Total Donations
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            p: 3,
                            borderRadius: '20px',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                            <Avatar sx={{ bgcolor: '#ecfdf5', color: '#10b981', width: 56, height: 56 }}>
                                <GroupsIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1, mb: 0.5 }}>
                                    {summary.uniqueDonors}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Unique Donors
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            p: 3,
                            borderRadius: '20px',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                            <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 56, height: 56 }}>
                                <TrendingUpIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1, mb: 0.5 }}>
                                    ₹{Math.round(summary.totalAmount / (summary.uniqueDonors || 1)).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Avg. Donation
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}


            <Typography variant="h6" fontWeight={700} sx={{ color: '#475569', mb: 2 }}>
                Active Campaigns
            </Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {summary?.campaigns.map((campaign) => {
                    const progress = Math.min((campaign.collected / (campaign.target || 1)) * 100, 100);
                    return (
                        <Grid item xs={12} md={6} key={campaign.id}>
                            <Card sx={{
                                borderRadius: '20px',
                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                                '&:hover': {
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                    borderColor: '#cbd5e1'
                                },
                                transition: 'all 0.2s'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1.2 }}>
                                            {campaign.title}
                                        </Typography>
                                        <Chip label={`${campaign.transactionCount} contributions`} size="small" sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 700 }} />
                                    </Box>

                                    <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                <Box component="span" sx={{ color: '#E62A4D', fontWeight: 800, fontSize: '15px' }}>₹{campaign.collected?.toLocaleString()}</Box> collected
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                Goal: ₹{campaign.target?.toLocaleString()}
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
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Recent Transactions Table */}
            <Typography variant="h6" fontWeight={700} sx={{ color: '#475569', mb: 2 }}>
                Recent Transactions
            </Typography>
            <TableContainer component={Paper} sx={{
                borderRadius: '20px',
                boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Donor Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Campaign</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Method & Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', width: 36, height: 36, fontWeight: 700 }}>
                                            {(tx.donorUser?.profile?.fullName || tx.donorName || 'A').charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                                                {tx.donorUser?.profile?.fullName || tx.donorName || 'Anonymous'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                {tx.donorUser?.profile?.email || tx.donorEmail || 'Hidden'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} sx={{ color: '#475569' }}>
                                        {tx.donation?.title || 'General Fund'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                        {new Date(tx.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Chip label={tx.paymentMethod} size="small" variant="outlined" sx={{ fontWeight: 600, color: '#64748b', borderColor: '#cbd5e1' }} />
                                        <Chip
                                            label={tx.paymentStatus}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                bgcolor: tx.paymentStatus === 'SUCCESS' ? '#ecfdf5' : '#fff1f2',
                                                color: tx.paymentStatus === 'SUCCESS' ? '#10b981' : '#E62A4D',
                                                borderRadius: '6px'
                                            }}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#10b981' }}>
                                        +₹{tx.amount.toLocaleString()}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DonationManager;
