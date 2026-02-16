import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import { Container, Typography, Box, Tabs, Tab, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';

interface DashboardStats {
    users: { total: number; pending: number };
    content: { business: number; career: number; events: number };
}

interface User {
    id: string;
    role: string;
    status: string;
    profile?: { fullName: string; isVerified: boolean };
    [key: string]: unknown;
}

interface ContentItem {
    id: string;
    description: string;
    businessName?: string;
    title?: string;
    company?: string;
    [key: string]: unknown;
}

interface Member {
    id: string;
    mobileNumber: string;
    profile?: {
        fullName: string;
        email: string;
        city: string;
        state: string;
        address: string;
        submittedAt: string;
    };
    [key: string]: unknown;
}

const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [pendingContent, setPendingContent] = useState<{ business: ContentItem[]; career: ContentItem[]; events: ContentItem[] }>({ business: [], career: [], events: [] });
    const [pendingMembers, setPendingMembers] = useState<Member[]>([]);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await client.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await client.get('/admin/users');
            setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    }, []);

    const fetchPendingContent = useCallback(async () => {
        try {
            const { data } = await client.get('/admin/content/pending');
            setPendingContent(data);
        } catch (error) {
            console.error('Failed to fetch pending content', error);
        }
    }, []);

    const fetchPendingMembers = useCallback(async () => {
        try {
            const { data } = await client.get('/admin/pending-members');
            setPendingMembers(data.members);
        } catch (error) {
            console.error('Failed to fetch pending members', error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line
        fetchStats();
        fetchUsers();
        fetchPendingContent();
        fetchPendingMembers();
    }, [fetchStats, fetchUsers, fetchPendingContent, fetchPendingMembers]);

    const handleVerifyUser = async (userId: string, status: string, isVerified: boolean) => {
        try {
            await client.post('/admin/users/verify', { userId, status, isVerified });
            fetchUsers();
        } catch (error) {
            console.error('Failed to verify user', error);
        }
    };

    const handleApproveContent = async (type: string, id: string, status: string) => {
        try {
            await client.post('/admin/content/approve', { type, id, status });
            fetchPendingContent();
            fetchStats();
        } catch (error) {
            console.error('Failed to approve content', error);
        }
    };

    const handleApproveMember = async (userId: string) => {
        try {
            await client.post(`/admin/approve-member/${userId}`);
            setSuccessMessage('Member approved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchPendingMembers();
            fetchStats();
        } catch (error) {
            console.error('Failed to approve member', error);
        }
    };

    const handleRejectMember = async () => {
        try {
            await client.post(`/admin/reject-member/${selectedUserId}`, { reason: rejectReason });
            setSuccessMessage('Member rejected');
            setTimeout(() => setSuccessMessage(''), 3000);
            setRejectDialogOpen(false);
            setRejectReason('');
            fetchPendingMembers();
            fetchStats();
        } catch (error) {
            console.error('Failed to reject member', error);
        }
    };

    const openRejectDialog = (userId: string) => {
        setSelectedUserId(userId);
        setRejectDialogOpen(true);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container component="main" maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
                Admin Dashboard
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
                    <Tab label="Overview" />
                    <Tab label="Pending Members" />
                    <Tab label="User Management" />
                    <Tab label="Content Moderation" />
                </Tabs>
            </Box>

            {/* Overview Tab */}
            <div role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && stats && (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Users
                                    </Typography>
                                    <Typography variant="h3">
                                        {stats.users.total}
                                    </Typography>
                                    <Typography variant="body2">
                                        {stats.users.pending} Pending Approval
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Pending Content
                                    </Typography>
                                    <Typography variant="h5">
                                        Business: {stats.content.business}
                                    </Typography>
                                    <Typography variant="h5">
                                        Career: {stats.content.career}
                                    </Typography>
                                    <Typography variant="h5">
                                        Events: {stats.content.events}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </div>

            {/* Pending Members Tab */}
            <div role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Members Awaiting Approval
                        </Typography>
                        {pendingMembers.length === 0 ? (
                            <Alert severity="info">No pending members at this time.</Alert>
                        ) : (
                            <Grid container spacing={2}>
                                {pendingMembers.map((member) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={member.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {member.profile?.fullName || 'No Name Provided'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    📧 {member.profile?.email || 'No email'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    📱 {member.mobileNumber}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    📍 {member.profile?.address || 'No address'}, {member.profile?.city}, {member.profile?.state}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                                                    Submitted: {member.profile?.submittedAt ? new Date(member.profile.submittedAt).toLocaleDateString() : 'N/A'}
                                                </Typography>
                                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleApproveMember(member.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => openRejectDialog(member.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}
            </div>

            {/* User Management Tab */}
            <div role="tabpanel" hidden={tabValue !== 2}>
                {tabValue === 2 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Verified</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.profile?.fullName || 'N/A'}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Chip label={user.status} color={user.status === 'ACTIVE' ? 'success' : 'warning'} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            {user.profile?.isVerified ? 'Yes' : 'No'}
                                        </TableCell>
                                        <TableCell>
                                            {user.status === 'PENDING' && (
                                                <Button size="small" variant="contained" color="success" onClick={() => handleVerifyUser(user.id, 'ACTIVE', true)}>
                                                    Approve
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {/* Content Moderation Tab */}
            <div role="tabpanel" hidden={tabValue !== 3}>
                {tabValue === 3 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Business Listings</Typography>
                        {pendingContent.business.map((item) => (
                            <Card key={item.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{item.businessName}</Typography>
                                    <Typography>{item.description}</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleApproveContent('business', item.id, 'APPROVED')}>
                                            Approve
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={() => handleApproveContent('business', item.id, 'REJECTED')}>
                                            Reject
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}

                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Career Listings</Typography>
                        {pendingContent.career.map((item) => (
                            <Card key={item.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{item.title} at {item.company}</Typography>
                                    <Typography>{item.description}</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleApproveContent('career', item.id, 'APPROVED')}>
                                            Approve
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={() => handleApproveContent('career', item.id, 'REJECTED')}>
                                            Reject
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}

                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Events</Typography>
                        {pendingContent.events.map((item) => (
                            <Card key={item.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography>{item.description}</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleApproveContent('event', item.id, 'APPROVED')}>
                                            Approve
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={() => handleApproveContent('event', item.id, 'REJECTED')}>
                                            Reject
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Reject Member Application</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason for Rejection"
                        fullWidth
                        multiline
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Provide a reason for rejection (optional)"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRejectMember} color="error" variant="contained">
                        Reject Member
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default AdminDashboard;
