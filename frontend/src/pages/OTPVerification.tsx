
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mobile = searchParams.get('mobile');

    useEffect(() => {
        if (!mobile) {
            navigate('/login');
        }
    }, [mobile, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!mobile) return;

        try {
            const data = await verifyOtp(mobile, otp);

            if (data.user.role === 'ADMIN') {
                navigate('/admin');
                return;
            }

            if (data.isProfileComplete) {
                navigate('/');
            } else {
                navigate('/profile/about-me'); // Redirect to profile if incomplete
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Verify OTP
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Enter OTP sent to {mobile}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="otp"
                        label="Enter OTP"
                        name="otp"
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Verify & Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default OTPVerification;
