import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { requestOtp } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileNumber.length < 10) {
            showToast('Please enter a valid mobile number', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await requestOtp(mobileNumber);
            showToast('OTP sent successfully!', 'success');
            navigate('/verify-otp', { state: { mobileNumber } });
        } catch (error) {
            showToast('Failed to send OTP. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            position: 'relative',
            background: 'radial-gradient(120% 100% at 50% -10%, rgba(250,130,49,0.08) 0%, rgba(255,255,255,1) 100%)',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Decorative Elements */}
            <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, background: 'rgba(230, 42, 77, 0.08)', filter: 'blur(100px)', borderRadius: '50%' }} />
            <Box sx={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 600, height: 600, background: 'rgba(250, 130, 49, 0.08)', filter: 'blur(120px)', borderRadius: '50%' }} />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Paper sx={{
                        p: { xs: 4, md: 5 },
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Top Accent Line */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: BRAND_GRADIENT }} />

                        <IconButton
                            onClick={() => navigate('/')}
                            sx={{ position: 'absolute', top: 16, left: 16, color: '#64748b' }}
                        >
                            <ArrowBackIcon />
                        </IconButton>

                        <Box sx={{ textAlign: 'center', mt: 3, mb: 5 }}>
                            <Box sx={{
                                width: 64, height: 64, mx: 'auto', mb: 2,
                                background: 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)',
                                borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(230,42,77,0.2)'
                            }}>
                                <PhoneAndroidIcon sx={{ fontSize: 32, color: '#E62A4D' }} />
                            </Box>
                            <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-0.5px', mb: 1 }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                Enter your mobile number to sign in or create an account
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                placeholder="Enter mobile number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography fontWeight={700} sx={{ color: '#0f172a', mr: 1 }}>+91</Typography>
                                            <Box sx={{ width: '1px', height: 24, bgcolor: '#e2e8f0', mr: 1 }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: '16px',
                                        bgcolor: '#ffffff',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FA8231',
                                        }
                                    }
                                }}
                                sx={{ mb: 4 }}
                            />

                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={isLoading || mobileNumber.length < 10}
                                sx={{
                                    background: BRAND_GRADIENT,
                                    color: 'white',
                                    fontWeight: 800,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    borderRadius: '16px',
                                    boxShadow: BRAND_SHADOW,
                                    textTransform: 'none',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 25px 50px -12px rgba(230, 42, 77, 0.5)'
                                    },
                                    '&.Mui-disabled': {
                                        background: '#e2e8f0',
                                        color: '#94a3b8',
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                {isLoading ? 'Sending OTP...' : 'Continue'}
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
