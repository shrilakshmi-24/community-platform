import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TextField, InputAdornment, Menu, MenuItem } from '@mui/material';
import client from '../../api/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

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
        <Box>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Verification</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">
                                        {user.profile?.fullName || 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {user.profile?.email}
                                    </Typography>
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        color={user.status === 'ACTIVE' ? 'success' : user.status === 'SUSPENDED' ? 'error' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {user.profile?.isVerified ? (
                                        <Chip label="Verified" color="primary" variant="outlined" size="small" />
                                    ) : (
                                        <Chip label="Unverified" size="small" />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDeactivate} sx={{ color: 'warning.main' }}>
                    Deactivate Account
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    Delete Permanently
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default UserList;
