import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Card, CardContent } from '@mui/material';
import client from '../../api/client';

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

    if (loading) return <LinearProgress />;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Donation Management
            </Typography>

            {summary && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                            <Typography variant="subtitle1">Total Donations</Typography>
                            <Typography variant="h4">₹{summary.totalAmount.toLocaleString()}</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                            <Typography variant="subtitle1">Total Donors</Typography>
                            <Typography variant="h4">{summary.uniqueDonors}</Typography> {/* Changed from donorCount to uniqueDonors for consistency */}
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
                            <Typography variant="subtitle1">Avg. Donation</Typography>
                            <Typography variant="h4">₹{Math.round(summary.totalAmount / (summary.uniqueDonors || 1)).toLocaleString()}</Typography> {/* Changed from donorCount to uniqueDonors */}
                        </Paper>
                    </Grid>
                </Grid>
            )}


            {/* Campaigns Section (Placeholder) */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Active Campaigns</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {summary?.campaigns.map((campaign) => (
                    <Grid size={{ xs: 12, md: 6 }} key={campaign.id}>
                        <Card variant="outlined"> {/* Changed Paper to Card for consistency with original */}
                            <CardContent> {/* Added CardContent for consistency with original */}
                                <Typography variant="subtitle1" fontWeight="bold">{campaign.title}</Typography>
                                <Typography variant="body2" color="text.secondary">Goal: ₹{campaign.target?.toLocaleString()} | Raised: ₹{campaign.collected?.toLocaleString()}</Typography> {/* Changed goal/raised to target/collected */}
                                {/* Progress Bar Placeholder */}
                                <Box sx={{ mt: 2 }}> {/* Added Box for consistency with original */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}> {/* Added Box for consistency with original */}
                                        <Typography variant="caption">Collected: ₹{campaign.collected?.toLocaleString()}</Typography> {/* Added for consistency with original */}
                                        <Typography variant="caption">{campaign.transactionCount} donations</Typography> {/* Added for consistency with original */}
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min((campaign.collected / (campaign.target || 1)) * 100, 100)}
                                        sx={{ height: 8, borderRadius: 1 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Transactions Table */}
            <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Donor</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {/* Priority: User Profile Name > Explicit Donor Name > Anonymous */}
                                        {(tx as any).user?.profile?.fullName || tx.donorName || 'Anonymous'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {(tx as any).user?.email || tx.donorEmail}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>₹{tx.amount.toLocaleString()}</TableCell>
                                <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell> {/* Added Date cell, using createdAt */}
                                <TableCell>{tx.paymentMethod}</TableCell> {/* Added Method cell, assuming paymentMethod exists */}
                                <TableCell>{tx.paymentStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DonationManager;
