import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminLogin = () => {
    // Maroon color palette matching home page
    const colors = {
        primary: '#8B2635',
        secondary: '#A0522D'
    };

    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple hardcoded admin login for development
        // In production, this should authenticate against backend
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            // Set admin user in localStorage or context
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Invalid admin credentials');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={10} sx={{ p: 5, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <AdminPanelSettingsIcon sx={{ fontSize: 80, color: colors.primary, mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                            Admin Login
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Access the administrative dashboard
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                py: 1.5,
                                bgcolor: colors.primary,
                                fontWeight: 600,
                                '&:hover': { bgcolor: colors.secondary }
                            }}
                        >
                            Login to Admin Panel
                        </Button>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            onClick={() => navigate('/')}
                            sx={{ color: 'text.secondary' }}
                        >
                            ← Back to Main Site
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            <strong>Development Credentials:</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Username: admin
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Password: admin123
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminLogin;
