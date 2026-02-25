import { useState } from 'react';
import {
    Box, Typography, Container, TextField, Button, Stepper, Step, StepLabel,
    Card, CardContent, GridLegacy as Grid, MenuItem, Paper, Avatar,
    IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

const categories = ['Retail', 'IT Services', 'Food & Beverage', 'Interior Design', 'Health & Fitness', 'Education', 'Other'];

const steps = ['Business Details', 'Payment Proof', 'Submission'];

const CreateBusiness = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        category: '',
        description: '',
        address: '',
        contactPhone: '',
        contactEmail: '',
        website: '',
        workingHours: '',
        transactionId: ''
    });

    // File State
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'proof') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'logo') setLogoFile(e.target.files[0]);
            else setProofFile(e.target.files[0]);
        }
    };

    const validateStep1 = () => {
        return formData.businessName && formData.ownerName && formData.category &&
            formData.description && formData.address &&
            formData.contactPhone && formData.contactEmail;
    };

    const validateStep2 = () => {
        return formData.transactionId && proofFile;
    };

    const handleSubmit = async () => {
        if (!validateStep2()) {
            toast.error('Please complete payment details');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, (formData as any)[key]);
            });

            if (logoFile) data.append('logo', logoFile);
            if (proofFile) data.append('paymentProof', proofFile);

            await client.post('/business/create', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setActiveStep(2); // Success step
            toast.success('Business submitted successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', fontFamily: "'Inter', sans-serif" }}>

            {/* Standardized Header */}
            <Box sx={{
                background: BRAND_GRADIENT,
                pt: { xs: 4, md: 5 }, pb: { xs: 8, md: 10 },
                position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <IconButton
                        onClick={() => navigate('/business')}
                        sx={{
                            color: 'white', mb: 3,
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': { background: 'rgba(255,255,255,0.3)' }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Typography variant="h3" fontWeight={900} sx={{ color: 'white', letterSpacing: '-1px', mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        List Your Business
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, maxWidth: 600 }}>
                        Join the community directory and reach more customers today.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: -6, pb: 12, position: 'relative', zIndex: 2 }}>

                <Card sx={{
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    overflow: 'visible'
                }}>
                    <CardContent sx={{ p: { xs: 3, md: 6 } }}>

                        {/* Custom Stepper */}
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6, '& .MuiStepIcon-root.Mui-active': { color: '#FA8231' }, '& .MuiStepIcon-root.Mui-completed': { color: '#E62A4D' } }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeStep === 0 && (
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ background: BRAND_GRADIENT_LIGHT, color: '#E62A4D', mr: 2, borderRadius: '12px' }}>
                                                    <BusinessIcon />
                                                </Avatar>
                                                <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>Basic Information</Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth label="Business Name" name="businessName"
                                                value={formData.businessName} onChange={handleInputChange} required
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth label="Owner/Contact Person" name="ownerName"
                                                value={formData.ownerName} onChange={handleInputChange} required
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select fullWidth label="Category" name="category"
                                                value={formData.category} onChange={handleInputChange} required
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            >
                                                {categories.map((option) => (
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth label="Working Hours" name="workingHours"
                                                placeholder="e.g., Mon-Fri 9AM-6PM"
                                                value={formData.workingHours} onChange={handleInputChange}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth multiline rows={4} label="Business Description" name="description"
                                                value={formData.description} onChange={handleInputChange} required
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth multiline rows={2} label="Complete Address" name="address"
                                                value={formData.address} onChange={handleInputChange} required
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth label="Phone Number" name="contactPhone"
                                                value={formData.contactPhone} onChange={handleInputChange} required
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth label="Email Address" name="contactEmail" type="email"
                                                value={formData.contactEmail} onChange={handleInputChange} required
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth label="Website URL (Optional)" name="website"
                                                value={formData.website} onChange={handleInputChange}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Box sx={{
                                                border: '2px dashed #cbd5e1',
                                                borderRadius: '16px',
                                                p: 4,
                                                textAlign: 'center',
                                                bgcolor: '#f8fafc',
                                                transition: 'all 0.3s',
                                                '&:hover': { borderColor: '#FA8231', bgcolor: 'rgba(250,130,49,0.02)' }
                                            }}>
                                                <Button
                                                    component="label"
                                                    variant="text"
                                                    startIcon={<CloudUploadIcon sx={{ fontSize: 40, color: '#FA8231' }} />}
                                                    sx={{ display: 'flex', flexDirection: 'column', color: '#64748b', textTransform: 'none' }}
                                                >
                                                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a', mt: 2 }}>
                                                        {logoFile ? logoFile.name : 'Upload Business Logo'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ mt: 1 }}>
                                                        SVG, PNG, JPG or GIF (max. 5MB)
                                                    </Typography>
                                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                                </Button>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => {
                                                    if (validateStep1()) setActiveStep(1);
                                                    else toast.error('Please fill in all required fields');
                                                }}
                                                sx={{
                                                    background: BRAND_GRADIENT,
                                                    color: 'white', fontWeight: 800, px: 4, py: 1.5,
                                                    borderRadius: '12px', boxShadow: BRAND_SHADOW, textTransform: 'none',
                                                    '&:hover': { transform: 'translateY(-2px)' }
                                                }}
                                            >
                                                Continue to Payment
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}

                                {activeStep === 1 && (
                                    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                                            <Avatar sx={{ background: BRAND_GRADIENT_LIGHT, color: '#E62A4D', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                                                <QrCodeIcon fontSize="large" />
                                            </Avatar>
                                            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#0f172a' }}>Payment Validation</Typography>
                                            <Typography variant="body1" sx={{ color: '#64748b' }}>
                                                A one-time registration fee of <Typography component="span" fontWeight={800} color="#E62A4D">₹500</Typography> is required.
                                            </Typography>
                                        </Box>

                                        <Paper variant="outlined" sx={{ p: 4, mb: 4, bgcolor: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                                            <Typography variant="overline" display="block" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1 }}>Scan to Pay</Typography>

                                            {/* Beautiful QR Placeholder */}
                                            <Box sx={{
                                                width: 180, height: 180,
                                                bgcolor: 'white', mx: 'auto', mt: 2, mb: 3,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: '16px',
                                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                                            }}>
                                                <QrCodeIcon sx={{ fontSize: 100, color: '#cbd5e1' }} />
                                            </Box>
                                            <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#0f172a' }}>UPI ID: pay.community@upi</Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Merchant: Community Trust</Typography>
                                        </Paper>

                                        <Grid container spacing={4}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="12-Digit Transaction / UTR No." name="transactionId"
                                                    value={formData.transactionId} onChange={handleInputChange} required
                                                    helperText="Found in your UPI app's transaction history"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    startIcon={<CloudUploadIcon />}
                                                    fullWidth
                                                    sx={{
                                                        borderStyle: 'dashed', py: 2, borderRadius: '12px',
                                                        borderColor: proofFile ? '#10b981' : '#cbd5e1',
                                                        color: proofFile ? '#10b981' : '#64748b',
                                                        borderWidth: '2px', textTransform: 'none',
                                                        '&:hover': { background: proofFile ? 'rgba(16, 185, 129, 0.05)' : '#f8fafc', borderColor: proofFile ? '#10b981' : '#94a3b8' }
                                                    }}
                                                >
                                                    {proofFile ? `Proof Attached: ${proofFile.name}` : 'Upload Payment Screenshot'}
                                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'proof')} />
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                                                <Button
                                                    onClick={() => setActiveStep(0)}
                                                    sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none' }}
                                                >
                                                    Back to Details
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                    sx={{
                                                        background: BRAND_GRADIENT,
                                                        color: 'white', fontWeight: 800, px: 5, py: 1.5,
                                                        borderRadius: '12px', boxShadow: BRAND_SHADOW, textTransform: 'none',
                                                        '&:hover': { transform: 'translateY(-2px)' },
                                                        '&.Mui-disabled': { background: '#cbd5e1', color: 'white' }
                                                    }}
                                                >
                                                    {loading ? 'Submitting...' : 'Submit Final Application'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {activeStep === 2 && (
                                    <Box sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        >
                                            <Box sx={{
                                                width: 120, height: 120, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4
                                            }}>
                                                <CheckCircleIcon sx={{ fontSize: 72, color: '#10b981' }} />
                                            </Box>
                                        </motion.div>

                                        <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: '#0f172a', letterSpacing: '-1px' }}>
                                            Success!
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#64748b', mb: 6, maxWidth: 500, mx: 'auto', lineHeight: 1.6, fontWeight: 400 }}>
                                            Your business listing has been received. Our team will verify your payment and details.
                                            You'll be notified once it's live.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/business')}
                                            sx={{
                                                borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700,
                                                borderColor: '#FA8231', color: '#FA8231', textTransform: 'none',
                                                '&:hover': { background: BRAND_GRADIENT_LIGHT, borderColor: '#E62A4D', color: '#E62A4D' }
                                            }}
                                        >
                                            Return to Directory
                                        </Button>
                                    </Box>
                                )}
                            </motion.div>
                        </AnimatePresence>

                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default CreateBusiness;
