import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Alert, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
    IconButton, Tooltip, Toolbar, alpha
} from '@mui/material';
import client from '../../api/client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';

interface UserProfile {
    fullName: string;
    email: string;
    city: string;
    state: string;
    submittedAt: string;
}

interface Member {
    id: string;
    profile?: UserProfile;
}

const UserVerification = () => {
    const [pendingMembers, setPendingMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [rejectReason, setRejectReason] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchPendingMembers = async () => {
        try {
            const { data } = await client.get('/admin/pending-members');
            setPendingMembers(data.members);
            setSelectedIds([]); // Reset selection on refresh
        } catch (error) {
            console.error('Failed to fetch pending members', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingMembers();
    }, []);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = pendingMembers.map((n) => n.id);
            setSelectedIds(newSelecteds);
            return;
        }
        setSelectedIds([]);
    };

    const handleClick = (id: string) => {
        const selectedIndex = selectedIds.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIds.slice(0, selectedIndex),
                selectedIds.slice(selectedIndex + 1),
            );
        }
        setSelectedIds(newSelected);
    };


    const handleBulkApprove = async () => {
        if (!window.confirm(`Are you sure you want to approve ${selectedIds.length} members?`)) return;

        try {
            await client.post('/admin/members/approve', { userIds: selectedIds });
            setMessage({ type: 'success', text: `Successfully approved ${selectedIds.length} members!` });
            fetchPendingMembers();
        } catch (error) {
            console.error('Approval error', error);
            setMessage({ type: 'error', text: 'Failed to approve members.' });
        }
    };

    const handleBulkReject = async () => {
        // Just open the dialog, we'll use selectedIds in the confirm action
        setRejectDialogOpen(true);
    };

    const confirmReject = async () => {
        try {
            await client.post('/admin/members/reject', {
                userIds: selectedIds,
                reason: rejectReason
            });
            setMessage({ type: 'success', text: `Successfully rejected ${selectedIds.length} members.` });
            setRejectDialogOpen(false);
            setRejectReason('');
            fetchPendingMembers();
        } catch (error) {
            console.error('Rejection error', error);
            setMessage({ type: 'error', text: 'Failed to reject members.' });
        }
    };

    // Single action handlers - just wrap in array
    const handleSingleApprove = (id: string) => {
        setSelectedIds([id]);

        if (!window.confirm('Approve this member?')) return;

        client.post('/admin/members/approve', { userIds: [id] })
            .then(() => {
                setMessage({ type: 'success', text: 'Member approved successfully!' });
                fetchPendingMembers();
            })
            .catch(() => setMessage({ type: 'error', text: 'Failed to approve member.' }));
    };

    const handleSingleReject = (id: string) => {
        setSelectedIds([id]);
        setRejectDialogOpen(true);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Pending Member Approvals
            </Typography>

            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
                    {message.text}
                </Alert>
            )}

            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* Enhanced Toolbar */}
                {selectedIds.length > 0 ? (
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                        }}
                    >
                        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                            {selectedIds.length} selected
                        </Typography>
                        <Tooltip title="Approve Selected">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleBulkApprove}
                                sx={{ mr: 1 }}
                                startIcon={<CheckCircleIcon />}
                            >
                                Approve
                            </Button>
                        </Tooltip>
                        <Tooltip title="Reject Selected">
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleBulkReject}
                                startIcon={<CancelIcon />}
                            >
                                Reject
                            </Button>
                        </Tooltip>
                    </Toolbar>
                ) : (
                    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                            Applications
                        </Typography>
                        <Tooltip title="Filter list">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                )}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < pendingMembers.length}
                                        checked={pendingMembers.length > 0 && selectedIds.length === pendingMembers.length}
                                        onChange={handleSelectAllClick}
                                        inputProps={{ 'aria-label': 'select all members' }}
                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Submitted Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No pending members at this time.</TableCell>
                                </TableRow>
                            ) : (
                                pendingMembers.map((member) => {
                                    const isSelected = selectedIds.indexOf(member.id) !== -1;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={member.id}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isSelected}
                                                    onChange={() => handleClick(member.id)}
                                                    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${member.id}` }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2">
                                                    {member.profile?.fullName || 'No Name'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{member.profile?.email || 'N/A'}</TableCell>
                                            <TableCell>{member.profile?.city || '-'}, {member.profile?.state || '-'}</TableCell>
                                            <TableCell>
                                                {member.profile?.submittedAt ? new Date(member.profile.submittedAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Approve">
                                                    <IconButton color="success" onClick={() => handleSingleApprove(member.id)}>
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton color="error" onClick={() => handleSingleReject(member.id)}>
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Reject Application(s)</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        You are about to reject {selectedIds.length} application(s).
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason for Rejection"
                        fullWidth
                        multiline
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Provide a reason (sent to user)"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmReject} color="error" variant="contained" disabled={!rejectReason}>
                        Confirm Rejection
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserVerification;
