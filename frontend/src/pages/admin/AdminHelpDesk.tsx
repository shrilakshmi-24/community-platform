import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, GridLegacy as Grid, Chip, Button,
    FormControl, Select, MenuItem, InputLabel, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    Pagination, Tooltip, CircularProgress, Avatar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import client from '../../api/client';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

const AdminHelpDesk = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stats, setStats] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [editForm, setEditForm] = useState({ status: '', priority: '' });

    // View Dialog
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [viewingRequest, setViewingRequest] = useState<any>(null);

    useEffect(() => {
        fetchStats();
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setLoading(true);
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
            setLoading(false);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            case 'OPEN': return '#3b82f6';
            case 'IN_PROGRESS': return '#f59e0b';
            case 'RESOLVED': return '#10b981';
            case 'CLOSED': return '#64748b';
            case 'ON_HOLD': return '#8b5cf6';
            default: return '#64748b';
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'OPEN': return '#eff6ff';
            case 'IN_PROGRESS': return '#fffbeb';
            case 'RESOLVED': return '#ecfdf5';
            case 'CLOSED': return '#f1f5f9';
            case 'ON_HOLD': return '#f5f3ff';
            default: return '#f1f5f9';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return '#ef4444';
            case 'HIGH': return '#f97316';
            case 'MEDIUM': return '#3b82f6';
            case 'LOW': return '#10b981';
            default: return '#64748b';
        }
    };

    const getPriorityBg = (priority: string) => {
        switch (priority) {
            case 'URGENT': return '#fef2f2';
            case 'HIGH': return '#fff7ed';
            case 'MEDIUM': return '#eff6ff';
            case 'LOW': return '#ecfdf5';
            default: return '#f1f5f9';
        }
    };

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <SupportAgentIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Help Desk & Support
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Manage and resolve community support requests
                    </Typography>
                </Box>
            </Box>

            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #bfdbfe', bgcolor: '#eff6ff', boxShadow: 'none' }}>
                            <Typography variant="h3" fontWeight={800} sx={{ color: '#2563eb', lineHeight: 1, mb: 0.5 }}>{stats.summary.open}</Typography>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#3b82f6', textTransform: 'uppercase' }}>Open Tickets</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #fecaca', bgcolor: '#fef2f2', boxShadow: 'none' }}>
                            <Typography variant="h3" fontWeight={800} sx={{ color: '#dc2626', lineHeight: 1, mb: 0.5 }}>{stats.summary.urgent}</Typography>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#ef4444', textTransform: 'uppercase' }}>Urgent Attention</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #bbf7d0', bgcolor: '#f0fdf4', boxShadow: 'none' }}>
                            <Typography variant="h3" fontWeight={800} sx={{ color: '#16a34a', lineHeight: 1, mb: 0.5 }}>{stats.summary.resolved}</Typography>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#22c55e', textTransform: 'uppercase' }}>Resolved</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc', boxShadow: 'none' }}>
                            <Typography variant="h3" fontWeight={800} sx={{ color: '#475569', lineHeight: 1, mb: 0.5 }}>{stats.summary.total}</Typography>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#64748b', textTransform: 'uppercase' }}>Total Requests</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Filters & Actions */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: '20px', boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search requests..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc' } }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontWeight: 600 }}>Status</InputLabel>
                            <Select
                                value={filters.status}
                                label="Status"
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="ALL">All Status</MenuItem>
                                <MenuItem value="OPEN">Open</MenuItem>
                                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                <MenuItem value="RESOLVED">Resolved</MenuItem>
                                <MenuItem value="CLOSED">Closed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontWeight: 600 }}>Priority</InputLabel>
                            <Select
                                value={filters.priority}
                                label="Priority"
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="ALL">All Priorities</MenuItem>
                                <MenuItem value="URGENT">Urgent</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="LOW">Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        {selectedIds.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1, bgcolor: '#f8fafc', p: 0.5, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <Button variant="text" size="small" onClick={() => handleBulkUpdate('IN_PROGRESS')} sx={{ fontWeight: 700, borderRadius: '8px', color: '#f59e0b' }}>
                                    Mark In Progress
                                </Button>
                                <Button variant="text" size="small" onClick={() => handleBulkUpdate('RESOLVED')} sx={{ fontWeight: 700, borderRadius: '8px', color: '#10b981' }}>
                                    Mark Resolved
                                </Button>
                            </Box>
                        )}
                        <Tooltip title="Refresh">
                            <IconButton onClick={fetchRequests} sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', borderRadius: '12px' }}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedIds.length === requests.length && requests.length > 0}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < requests.length}
                                    onChange={handleSelectAll}
                                    sx={{ '&.Mui-checked': { color: '#E62A4D' }, '&.MuiCheckbox-indeterminate': { color: '#FA8231' } }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Requester</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Title / Detail</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Priority</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                    <CircularProgress sx={{ color: '#E62A4D' }} />
                                </TableCell>
                            </TableRow>
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#64748b', fontWeight: 600 }}>
                                    <SupportAgentIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                    No support requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedIds.includes(req.id)}
                                            onChange={() => handleSelectOne(req.id)}
                                            sx={{ '&.Mui-checked': { color: '#E62A4D' } }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', width: 36, height: 36, fontWeight: 700 }}>
                                                {req.isAnonymous ? 'A' : (req.user?.profile?.fullName || 'U').charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                                                    {req.isAnonymous ? 'Anonymous' : req.user?.profile?.fullName || 'N/A'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontFamily: 'monospace' }}>
                                                    {req.user?.mobileNumber || 'Hide'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }} noWrap title={req.title}>{req.title}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={req.category} size="small" variant="outlined" sx={{ fontWeight: 600, color: '#64748b', borderColor: '#cbd5e1', borderRadius: '6px' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={req.priority}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                color: getPriorityColor(req.priority),
                                                bgcolor: getPriorityBg(req.priority),
                                                borderRadius: '6px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={req.status}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                color: getStatusColor(req.status),
                                                bgcolor: getStatusBg(req.status),
                                                borderRadius: '6px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <Tooltip title="View Details">
                                                <IconButton size="small" onClick={() => { setViewingRequest(req); setViewDialogOpen(true); }} sx={{ color: '#3b82f6', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: '8px' }}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Status">
                                                <IconButton size="small" onClick={() => openEditDialog(req)} sx={{ color: '#E62A4D', bgcolor: BRAND_GRADIENT_LIGHT, '&:hover': { bgcolor: 'rgba(230, 42, 77, 0.15)' }, borderRadius: '8px' }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        sx={{
                            '& .MuiPaginationItem-root.Mui-selected': {
                                background: BRAND_GRADIENT,
                                color: 'white',
                                fontWeight: 800
                            }
                        }}
                    />
                </Box>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Update Request Status</DialogTitle>
                <DialogContent sx={{ minWidth: 350, mt: 1 }}>
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: 600 }}>Status</InputLabel>
                        <Select
                            value={editForm.status}
                            label="Status"
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            sx={{ borderRadius: '12px' }}
                        >
                            <MenuItem value="OPEN">Open</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="ON_HOLD">On Hold</MenuItem>
                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                            <MenuItem value="CLOSED">Closed</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel sx={{ fontWeight: 600 }}>Priority</InputLabel>
                        <Select
                            value={editForm.priority}
                            label="Priority"
                            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                            sx={{ borderRadius: '12px' }}
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="URGENT">Urgent</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateSubmit} sx={{ background: BRAND_GRADIENT, fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}>Update</Button>
                </DialogActions>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0', p: 3 }}>Request Details</DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {viewingRequest && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 3 }}>{viewingRequest.title}</Typography>

                            <Grid container spacing={3} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created At</Typography>
                                        <Typography variant="body1" fontWeight={700} sx={{ color: '#0f172a' }}>{new Date(viewingRequest.createdAt).toLocaleString()}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requester</Typography>
                                        <Typography variant="body1" fontWeight={700} sx={{ color: '#0f172a' }}>
                                            {viewingRequest.isAnonymous ? 'Anonymous' : viewingRequest.user?.profile?.fullName || 'N/A'}
                                        </Typography>
                                        {viewingRequest.user?.mobileNumber && (
                                            <Typography variant="body2" sx={{ color: '#475569', fontFamily: 'monospace' }}>{viewingRequest.user.mobileNumber}</Typography>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5, display: 'block' }}>Status</Typography>
                                        <Chip label={viewingRequest.status} size="small" sx={{ fontWeight: 800, color: getStatusColor(viewingRequest.status), bgcolor: getStatusBg(viewingRequest.status), borderRadius: '6px' }} />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5, display: 'block' }}>Priority & Category</Typography>
                                        <Box display="flex" gap={1}>
                                            <Chip label={viewingRequest.priority} size="small" sx={{ fontWeight: 800, color: getPriorityColor(viewingRequest.priority), bgcolor: getPriorityBg(viewingRequest.priority), borderRadius: '6px' }} />
                                            <Chip label={viewingRequest.category} size="small" variant="outlined" sx={{ fontWeight: 600, color: '#475569', borderColor: '#cbd5e1', borderRadius: '6px' }} />
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mt: 4, mb: 1 }}>Description</Typography>
                            <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', borderColor: '#e2e8f0' }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#334155', lineHeight: 1.6 }}>
                                    {viewingRequest.description}
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
                    <Button onClick={() => setViewDialogOpen(false)} variant="contained" sx={{ background: BRAND_GRADIENT, fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminHelpDesk;
