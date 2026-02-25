import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { Container, Typography, Button, Box, Paper, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

const OTPVerification = () => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { verifyOtp } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const mobileNumber = location.state?.mobileNumber;

    useEffect(() => {
        if (!mobileNumber) {
            showToast('Session expired. Please start over.', 'error');
            navigate('/login');
        }
    }, [mobileNumber, navigate, showToast]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleChange = (val: string, index: number) => {
        if (!/^\d*$/.test(val)) return;

        const newOtp = [...otp];
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, idx) => {
                if (idx < 6) newOtp[idx] = char;
            });
            setOtp(newOtp);
            const focusIndex = Math.min(pastedData.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            showToast('Please enter complete 6-digit OTP', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const data = await verifyOtp(mobileNumber, enteredOtp);
            showToast('Verification Successful!', 'success');
            if (data?.user?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error) {
            showToast('Invalid or expired OTP', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            position: 'relative',
            background: 'radial-gradient(120% 100% at 50% -10%, rgba(230,42,77,0.08) 0%, rgba(255,255,255,1) 100%)',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Decorative Elements */}
            <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, background: 'rgba(250, 130, 49, 0.08)', filter: 'blur(100px)', borderRadius: '50%' }} />
            <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 600, height: 600, background: 'rgba(230, 42, 77, 0.08)', filter: 'blur(120px)', borderRadius: '50%' }} />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
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
                            onClick={() => navigate('/login')}
                            sx={{ position: 'absolute', top: 16, left: 16, color: '#64748b' }}
                        >
                            <ArrowBackIcon />
                        </IconButton>

                        <Box sx={{ textAlign: 'center', mt: 3, mb: 4 }}>
                            <Box sx={{
                                width: 64, height: 64, mx: 'auto', mb: 2,
                                background: 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)',
                                borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(230,42,77,0.2)'
                            }}>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#E62A4D', mt: 1 }}>***</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-0.5px', mb: 1 }}>
                                Enter Code
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                We sent a 6-digit verification code to
                                <br />
                                <strong style={{ color: '#0f172a' }}>+91 {mobileNumber}</strong>
                            </Typography>
                        </Box>

                        <form onSubmit={handleVerify}>
                            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, justifyContent: 'center', mb: 5 }}>
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        value={data}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        style={{
                                            width: '100%',
                                            aspectRatio: '1/1.2',
                                            maxWidth: '48px',
                                            padding: 0,
                                            textAlign: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: '800',
                                            background: '#f8fafc',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            color: '#0f172a',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#FA8231';
                                            e.target.style.background = '#ffffff';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(250, 130, 49, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = data ? '#cbd5e1' : '#e2e8f0';
                                            e.target.style.background = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                ))}
                            </Box>

                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={isLoading || !isOtpComplete}
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
                                {isLoading ? 'Verifying...' : 'Verify & Continue'}
                            </Button>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    Didn't receive the code?{' '}
                                    <Button
                                        variant="text"
                                        sx={{
                                            p: 0,
                                            minWidth: 'auto',
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            color: '#E62A4D',
                                            '&:hover': { background: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        Resend
                                    </Button>
                                </Typography>
                            </Box>
                        </form>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default OTPVerification;
