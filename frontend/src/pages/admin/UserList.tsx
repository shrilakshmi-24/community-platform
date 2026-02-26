import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TextField, InputAdornment, Menu, MenuItem, Avatar } from '@mui/material';
import client from '../../api/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';

const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface UserProfile {
    fullName: string;
    email: string;
    isVerified: boolean;
}

interface User {
    id: string;
    role: string;
    status: string;
    profile?: UserProfile;
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await client.get('/admin/users');
            setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, [fetchUsers]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleDeactivate = async () => {
        if (!selectedUser) return;
        if (!window.confirm(`Are you sure you want to deactivate ${selectedUser.profile?.fullName}?`)) return;

        try {
            await client.post(`/admin/users/${selectedUser.id}/deactivate`);
            fetchUsers();
        } catch {
            alert('Failed to deactivate user');
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        if (!window.confirm(`PERMANENT ACTION: Are you sure you want to DELETE ${selectedUser.profile?.fullName}? This cannot be undone.`)) return;

        try {
            await client.delete(`/admin/users/${selectedUser.id}`);
            fetchUsers();
        } catch {
            alert('Failed to delete user');
        }
        handleMenuClose();
    };

    const filteredUsers = users.filter(user =>
        user.profile?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.profile?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <PeopleIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        User Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Manage {users.length} registered members
                    </Typography>
                </Box>
            </Box>

            <Paper sx={{
                p: { xs: 2, md: 3 },
                mb: 4,
                borderRadius: '20px',
                boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
                <TextField
                    fullWidth
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '12px',
                            bgcolor: '#f8fafc',
                            '& fieldset': { borderColor: '#e2e8f0' },
                            '&:hover fieldset': { borderColor: '#cbd5e1' },
                            '&.Mui-focused fieldset': { borderColor: '#E62A4D' }
                        }
                    }}
                />
            </Paper>

            <TableContainer component={Paper} sx={{
                borderRadius: '20px',
                boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Verification</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 700 }}>
                                            {user.profile?.fullName?.charAt(0) || '?'}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                                                {user.profile?.fullName || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                {user.profile?.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} sx={{ color: '#475569', textTransform: 'capitalize' }}>
                                        {user.role.toLowerCase()}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        color={user.status === 'ACTIVE' ? 'success' : user.status === 'SUSPENDED' ? 'error' : 'warning'}
                                        size="small"
                                        sx={{
                                            fontWeight: 700,
                                            borderRadius: '8px',
                                            bgcolor: user.status === 'ACTIVE' ? '#ecfdf5' : '#fff1f2',
                                            color: user.status === 'ACTIVE' ? '#10b981' : '#E62A4D',
                                            '& .MuiChip-label': { px: 2 }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {user.profile?.isVerified ? (
                                        <Chip label="Verified" size="small" sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 700, borderRadius: '8px' }} />
                                    ) : (
                                        <Chip label="Unverified" size="small" variant="outlined" sx={{ color: '#64748b', borderColor: '#cbd5e1', fontWeight: 600, borderRadius: '8px' }} />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={(e) => handleMenuOpen(e, user)} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                                        <MoreVertIcon sx={{ color: '#64748b' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <PeopleIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                                    <Typography variant="body1" fontWeight={600} sx={{ color: '#64748b' }}>
                                        No users found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        minWidth: 200
                    }
                }}
            >
                <MenuItem onClick={handleDeactivate} sx={{ color: '#f59e0b', fontWeight: 600, py: 1.5 }}>
                    Deactivate Account
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: '#ef4444', fontWeight: 600, py: 1.5 }}>
                    Delete Permanently
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default UserList;
