import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, Paper,
    Alert, Chip, Divider, Stack
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminLoginWithToken } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await client.post('/auth/admin-login', {
                username: credentials.username.trim(),
                password: credentials.password,
            });

            // Store JWT — which carries the real role (ADMIN or SUPER_ADMIN)
            adminLoginWithToken(data.accessToken);
            navigate('/admin');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: '#E62A4D', borderWidth: 2 },
        },
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Decorative blobs */}
            <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(230,42,77,0.08)', filter: 'blur(80px)' }} />
            <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(250,130,49,0.06)', filter: 'blur(80px)' }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper elevation={0} sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: '28px',
                    bgcolor: 'rgba(255,255,255,0.97)',
                    border: '1px solid rgba(226,232,240,0.5)',
                    boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)',
                }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box sx={{
                            width: 80, height: 80, borderRadius: '22px',
                            background: BRAND_GRADIENT,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 3,
                            boxShadow: '0 12px 30px -8px rgba(230,42,77,0.5)',
                        }}>
                            <AdminPanelSettingsIcon sx={{ fontSize: 42, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1px', mb: 0.5 }}>
                            Admin Portal
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                            Sign in to access the administration panel
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                required
                                autoComplete="username"
                                sx={inputSx}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                                autoComplete="current-password"
                                sx={inputSx}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<LockIcon />}
                                sx={{
                                    py: 1.6, borderRadius: '14px', fontWeight: 800, fontSize: '1rem',
                                    background: BRAND_GRADIENT,
                                    boxShadow: '0 8px 25px -6px rgba(230,42,77,0.5)',
                                    '&:hover': { opacity: 0.92, boxShadow: '0 12px 30px -6px rgba(230,42,77,0.6)' },
                                    '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8' },
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
                            </Button>
                        </Stack>
                    </form>

                    <Divider sx={{ my: 4 }} />

                    {/* Dev credentials reference */}
                    <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" fontWeight={800} color="#475569" display="block" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Development Credentials
                        </Typography>

                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: '10px', bgcolor: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SupervisorAccountIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="#0f172a" display="block">superadmin / superadmin123</Typography>
                                        <Typography variant="caption" color="#64748b">Full access everywhere</Typography>
                                    </Box>
                                </Box>
                                <Chip label="SUPER ADMIN" size="small" sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: 800, fontSize: '0.6rem' }} />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: '10px', bgcolor: 'rgba(230,42,77,0.05)', border: '1px solid rgba(230,42,77,0.12)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AdminPanelSettingsIcon sx={{ color: '#E62A4D', fontSize: 18 }} />
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="#0f172a" display="block">admin / admin123</Typography>
                                        <Typography variant="caption" color="#64748b">Content moderation only</Typography>
                                    </Box>
                                </Box>
                                <Chip label="ADMIN" size="small" sx={{ bgcolor: 'rgba(230,42,77,0.08)', color: '#E62A4D', fontWeight: 800, fontSize: '0.6rem' }} />
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            onClick={() => navigate('/')}
                            sx={{ color: '#64748b', fontWeight: 600, '&:hover': { color: '#E62A4D' } }}
                        >
                            ← Back to Main Site
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminLogin;
