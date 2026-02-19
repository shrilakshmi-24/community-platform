import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const { verifyOtp } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const mobileNumber = location.state?.mobileNumber;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mobileNumber) {
            showToast('Session expired. Please login again.', 'error');
            navigate('/login');
            return;
        }
        try {
            await verifyOtp(mobileNumber, otp);
            showToast('Access Granted.', 'success');
            navigate('/home');
        } catch (error) {
            showToast('Invalid Code.', 'error');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
        }}>
            <Container maxWidth="xs">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper sx={{
                        p: 5,
                        bgcolor: 'white',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
                        textAlign: 'center'
                    }}>
                        <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
                            Verify Identity
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                            Enter the code sent to your device.
                        </Typography>

                        <form onSubmit={handleVerify}>
                            <TextField
                                fullWidth
                                autoFocus
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                inputProps={{
                                    style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', color: '#1e293b' },
                                    maxLength: 6
                                }}
                                sx={{
                                    mb: 4,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: '#f8fafc',
                                        '& fieldset': { borderColor: '#e2e8f0' },
                                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                                        '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 2 }
                                    }
                                }}
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
                                VERIFY
                            </Button>
                        </form>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default OTPVerification;
