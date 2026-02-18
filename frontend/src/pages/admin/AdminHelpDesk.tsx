import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Chip, Button,
    FormControl, Select, MenuItem, InputLabel, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    Pagination
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import client from '../../api/client';

const AdminHelpDesk = () => {
    const [stats, setStats] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    // const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Filters
    const [filters, setFilters] = useState({
        status: 'ALL',
        priority: 'ALL',
        category: 'ALL',
        search: ''
    });

    // Update Dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [editForm, setEditForm] = useState({ status: '', priority: '' });

    useEffect(() => {
        fetchStats();
        fetchRequests();
    }, [page, filters]);

    const fetchStats = async () => {
        try {
            const { data } = await client.get('/help-request/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchRequests = async () => {
        // setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...filters
            }).toString();

            const { data } = await client.get(`/help-request/all?${query}`);
            setRequests(data.requests);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            // setLoading(false);
        }
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(1);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(requests.map(r => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkUpdate = async (status: string) => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Update ${selectedIds.length} requests to ${status}?`)) return;

        try {
            await client.post('/help-request/bulk-update', { ids: selectedIds, status });
            fetchRequests();
            fetchStats();
            setSelectedIds([]);
        } catch (error) {
            console.error('Bulk update failed', error);
        }
    };

    const openEditDialog = (req: any) => {
        setSelectedRequest(req);
        setEditForm({ status: req.status, priority: req.priority });
        setEditDialogOpen(true);
    };

    const handleUpdateSubmit = async () => {
        try {
            await client.put(`/help-request/${selectedRequest.id}/status`, editForm);
            setEditDialogOpen(false);
            fetchRequests();
            fetchStats();
        } catch (error) {
            console.error('Update failed', error);
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
            case 'MEDIUM': return 'info';
            default: return 'success';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Help Desk & Support
            </Typography>

            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                            <Typography variant="h4" color="primary">{stats.summary.open}</Typography>
                            <Typography variant="subtitle2">Open Tickets</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee' }}>
                            <Typography variant="h4" color="error">{stats.summary.urgent}</Typography>
                            <Typography variant="subtitle2">Urgent Attention</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                            <Typography variant="h4" color="success.main">{stats.summary.resolved}</Typography>
                            <Typography variant="subtitle2">Resolved</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                            <Typography variant="h4" color="secondary">{stats.summary.total}</Typography>
                            <Typography variant="subtitle2">Total Requests</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Filters & Actions */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search requests..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filters.status}
                                label="Status"
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <MenuItem value="ALL">All Status</MenuItem>
                                <MenuItem value="OPEN">Open</MenuItem>
                                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                <MenuItem value="RESOLVED">Resolved</MenuItem>
                                <MenuItem value="CLOSED">Closed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={filters.priority}
                                label="Priority"
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                            >
                                <MenuItem value="ALL">All Priorities</MenuItem>
                                <MenuItem value="URGENT">Urgent</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="LOW">Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {selectedIds.length > 0 && (
                            <>
                                <Button variant="outlined" size="small" onClick={() => handleBulkUpdate('IN_PROGRESS')}>
                                    Mark In Progress
                                </Button>
                                <Button variant="outlined" color="success" size="small" onClick={() => handleBulkUpdate('RESOLVED')}>
                                    Mark Resolved
                                </Button>
                            </>
                        )}
                        <IconButton onClick={fetchRequests}><RefreshIcon /></IconButton>
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedIds.length === requests.length && requests.length > 0}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < requests.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Requester</TableCell>
                            <TableCell>Title / Detail</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.id} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedIds.includes(req.id)}
                                        onChange={() => handleSelectOne(req.id)}
                                    />
                                </TableCell>
                                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {req.isAnonymous ? 'Anonymous' : req.user?.profile?.fullName || 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {req.user?.mobileNumber}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Typography variant="subtitle2" noWrap>{req.title}</Typography>
                                    <Typography variant="caption" color="textSecondary" noWrap>{req.description}</Typography>
                                </TableCell>
                                <TableCell><Chip label={req.category} size="small" variant="outlined" /></TableCell>
                                <TableCell>
                                    <Chip label={req.priority} size="small" color={getPriorityColor(req.priority) as any} />
                                </TableCell>
                                <TableCell>
                                    <Chip label={req.status} size="small" color={getStatusColor(req.status) as any} />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => openEditDialog(req)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                    />
                </Box>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Update Request Status</DialogTitle>
                <DialogContent sx={{ minWidth: 300, mt: 2 }}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={editForm.status}
                            label="Status"
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                            <MenuItem value="OPEN">Open</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="ON_HOLD">On Hold</MenuItem>
                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                            <MenuItem value="CLOSED">Closed</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={editForm.priority}
                            label="Priority"
                            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="URGENT">Urgent</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateSubmit}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminHelpDesk;
