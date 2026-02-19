import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, InputAdornment } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const { requestOtp } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await requestOtp(mobileNumber);
            showToast('Code sent. Check your device.', 'success');
            navigate('/verify-otp', { state: { mobileNumber } });
        } catch (error) {
            showToast('Connection failed. Retrying...', 'error');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f1f5f9', // Light gray background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
        }}>
            <Container maxWidth="xs">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper sx={{
                        p: 5,
                        bgcolor: 'white',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)'
                    }}>
                        <Typography variant="h5" fontWeight={800} textAlign="center" sx={{ color: '#1e293b', mb: 1 }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" textAlign="center" sx={{ color: '#64748b', mb: 5 }}>
                            Enter your mobile number to sign in.
                        </Typography>

                        <Box component="form" onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                placeholder="Mobile Number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneAndroidIcon sx={{ color: '#64748b' }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 2,
                                        bgcolor: '#f8fafc',
                                        '& fieldset': { borderColor: '#e2e8f0' },
                                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                                        '&.Mui-focused fieldset': { borderColor: '#2563eb' }
                                    }
                                }}
                                sx={{ mb: 4 }}
                            />

                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                sx={{
                                    bgcolor: '#2563eb',
                                    color: 'white',
                                    fontWeight: 700,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                                    '&:hover': { bgcolor: '#1d4ed8' }
                                }}
                            >
                                CONTINUE
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
