import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Chip, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface HelpRequest {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    isResolved: boolean;
}

const HelpRequestList = () => {
    useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const { data } = await client.get('/help-request/my-requests');
            setRequests(data.requests);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'primary';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            case 'ON_HOLD': return 'info';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'error';
            case 'HIGH': return 'warning';
            default: return 'default';
        }
    };

    const handleResolve = async (id: string) => {
        if (!window.confirm('Are you sure you want to mark this request as resolved?')) return;
        try {
            await client.put(`/help-request/${id}/status`, { status: 'RESOLVED' });
            fetchMyRequests();
        } catch (error) {
            console.error('Failed to resolve request', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                    My Help Requests
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/help/create')}
                >
                    Request Help
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : requests.length === 0 ? (
                <Paper sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    color: 'text.secondary'
                }}>
                    <SentimentDissatisfiedIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
                    <Typography variant="h6" gutterBottom>
                        No requests found!
                    </Typography>
                    <Typography variant="body1">
                        You haven't reached out for help yet. That's great! <br />
                        But if you ever need us, we're just a click away.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Category</strong></TableCell>
                                <TableCell><strong>Title & Description</strong></TableCell>
                                <TableCell><strong>Priority</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id} hover>
                                    <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip label={req.category} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {req.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {req.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {req.priority !== 'MEDIUM' && req.priority !== 'LOW' && (
                                            <Chip label={req.priority} size="small" color={getPriorityColor(req.priority) as any} />
                                        )}
                                        {(req.priority === 'MEDIUM' || req.priority === 'LOW') && (
                                            <Chip label={req.priority} size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={req.status} size="small" color={getStatusColor(req.status) as any} />
                                    </TableCell>
                                    <TableCell align="right">
                                        {req.status !== 'RESOLVED' && req.status !== 'CLOSED' && (
                                            <Button
                                                size="small"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleResolve(req.id)}
                                            >
                                                Resolve
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default HelpRequestList;
