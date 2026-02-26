import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Alert, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
    IconButton, Tooltip, Toolbar, Avatar
} from '@mui/material';
import client from '../../api/client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

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
            setSelectedIds([]);
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

    const handleBulkReject = () => {
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

    const handleSingleApprove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds([id]);

        if (!window.confirm('Approve this member?')) return;

        client.post('/admin/members/approve', { userIds: [id] })
            .then(() => {
                setMessage({ type: 'success', text: 'Member approved successfully!' });
                fetchPendingMembers();
            })
            .catch(() => setMessage({ type: 'error', text: 'Failed to approve member.' }));
    };

    const handleSingleReject = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds([id]);
        setRejectDialogOpen(true);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#E62A4D' }} /></Box>;

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <PendingActionsIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Pending Member Approvals
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Review and verify new community registrations
                    </Typography>
                </Box>
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }} onClose={() => setMessage(null)}>
                    {message.text}
                </Alert>
            )}

            <Paper sx={{ width: '100%', mb: 2, borderRadius: '20px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden' }}>
                <Toolbar
                    sx={{
                        pl: { sm: 3 },
                        pr: { xs: 2, sm: 3 },
                        bgcolor: selectedIds.length > 0 ? 'rgba(230, 42, 77, 0.05)' : 'white',
                        borderBottom: '1px solid #f1f5f9',
                        minHeight: '70px !important'
                    }}
                >
                    {selectedIds.length > 0 ? (
                        <>
                            <Typography sx={{ flex: '1 1 100%', fontWeight: 700, color: '#E62A4D' }} variant="subtitle1" component="div">
                                {selectedIds.length} members selected
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Reject Selected">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleBulkReject}
                                        startIcon={<CancelIcon />}
                                        sx={{ borderRadius: '8px', fontWeight: 700, borderColor: '#fca5a5' }}
                                    >
                                        Reject
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Approve Selected">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleBulkApprove}
                                        startIcon={<CheckCircleIcon />}
                                        sx={{ borderRadius: '8px', fontWeight: 700, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, boxShadow: 'none' }}
                                    >
                                        Approve
                                    </Button>
                                </Tooltip>
                            </Box>
                        </>
                    ) : (
                        <Typography sx={{ flex: '1 1 100%', fontWeight: 800, color: '#1e293b' }} variant="h6" id="tableTitle" component="div">
                            Applications List
                        </Typography>
                    )}
                </Toolbar>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < pendingMembers.length}
                                        checked={pendingMembers.length > 0 && selectedIds.length === pendingMembers.length}
                                        onChange={handleSelectAllClick}
                                        sx={{ '&.Mui-checked': { color: '#E62A4D' }, '&.MuiCheckbox-indeterminate': { color: '#FA8231' } }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Applicant Details</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Submitted Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" fontWeight={600} sx={{ color: '#64748b' }}>No pending applications currently.</Typography>
                                    </TableCell>
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
                                            onClick={() => handleClick(member.id)}
                                            sx={{ cursor: 'pointer', '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'rgba(250, 130, 49, 0.04)' }, '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isSelected}
                                                    sx={{ '&.Mui-checked': { color: '#E62A4D' } }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 700 }}>
                                                        {(member.profile?.fullName || 'N').charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0f172a' }}>
                                                            {member.profile?.fullName || 'No Name Provided'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                            {member.profile?.email || 'No email'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600} sx={{ color: '#475569' }}>
                                                    {member.profile?.city || '-'}, {member.profile?.state || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                    {member.profile?.submittedAt ? new Date(member.profile.submittedAt).toLocaleDateString() : 'Unknown'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                    <Tooltip title="Approve">
                                                        <IconButton
                                                            onClick={(e) => handleSingleApprove(member.id, e)}
                                                            sx={{ color: '#10b981', bgcolor: '#ecfdf5', '&:hover': { bgcolor: '#d1fae5' }, width: 36, height: 36 }}
                                                        >
                                                            <CheckCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton
                                                            onClick={(e) => handleSingleReject(member.id, e)}
                                                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' }, width: 36, height: 36 }}
                                                        >
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Reject Application(s)</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 3, color: '#475569' }}>
                        You are about to reject <Box component="span" sx={{ fontWeight: 700, color: '#E62A4D' }}>{selectedIds.length}</Box> application(s).
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
                        placeholder="Please provide a clear reason to be sent to the user(s)."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: '#f8fafc',
                                '&.Mui-focused fieldset': { borderColor: '#E62A4D' }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setRejectDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
                    <Button
                        onClick={confirmReject}
                        color="error"
                        variant="contained"
                        disabled={!rejectReason}
                        sx={{ borderRadius: '8px', fontWeight: 700, boxShadow: 'none' }}
                    >
                        Confirm Rejection
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserVerification;
