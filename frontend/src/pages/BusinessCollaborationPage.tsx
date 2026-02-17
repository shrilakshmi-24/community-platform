
import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, Card, CardContent, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, Grid, Alert, Paper
} from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

interface CollaborationRequest {
    id: string;
    title: string;
    description: string;
    requirements: string;
    type: 'LOAN' | 'PARTNERSHIP' | 'INVESTMENT';
    status: string;
    user: {
        profile: { fullName: string; avatarUrl: string };
        businessListings: { businessName: string }[];
    };
    createdAt: string;
}

const BusinessCollaborationPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<CollaborationRequest[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        type: 'PARTNERSHIP'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await client.get('/collaboration/all');
            setRequests(data.requests);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    const handleCreate = async () => {
        try {
            await client.post('/collaboration/create', formData);
            setSuccess('Request posted successfully!');
            setOpen(false);
            setFormData({ title: '', description: '', requirements: '', type: 'PARTNERSHIP' });
            fetchRequests();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create request');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="#8B2635">
                        Business Collaboration & Loans
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Connect with partners, investors, and lenders within the community.
                    </Typography>
                </Box>
                {user?.isBusinessOwner && (
                    <Button
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        sx={{ bgcolor: '#8B2635' }}
                        onClick={() => setOpen(true)}
                    >
                        Apply / Post Request
                    </Button>
                )}
            </Box>

            {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

            <Grid container spacing={3}>
                {requests.map((req) => (
                    <Grid size={{ xs: 12, md: 6 }} key={req.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Chip
                                        label={req.type}
                                        color={req.type === 'LOAN' ? 'error' : req.type === 'INVESTMENT' ? 'success' : 'primary'}
                                        size="small"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" gutterBottom>{req.title}</Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {req.description}
                                </Typography>
                                {req.requirements && (
                                    <Box sx={{ mt: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                        <Typography variant="subtitle2">Requirements:</Typography>
                                        <Typography variant="body2">{req.requirements}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HandshakeIcon fontSize="small" color="action" />
                                    <Typography variant="caption" fontWeight="bold">
                                        {req.user.businessListings[0]?.businessName || req.user.profile.fullName}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {requests.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No active collaboration requests found.</Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Create Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Post Collaboration Request</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        fullWidth
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={formData.type}
                            label="Type"
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <MenuItem value="PARTNERSHIP">Partnership</MenuItem>
                            <MenuItem value="INVESTMENT">Investment</MenuItem>
                            <MenuItem value="LOAN">Business Loan</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Requirements (Funding amount, skills, etc.)"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        sx={{ bgcolor: '#8B2635' }}
                        disabled={!formData.title || !formData.description}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BusinessCollaborationPage;
