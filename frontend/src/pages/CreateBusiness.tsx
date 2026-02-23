import { useState } from 'react';
import {
    Box, Typography, Container, TextField, Button, Stepper, Step, StepLabel,
    Card, CardContent, GridLegacy as Grid, MenuItem, Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { toast } from 'react-hot-toast';

const categories = ['Retail', 'IT Services', 'Food & Beverage', 'Interior Design', 'Health & Fitness', 'Education', 'Other'];

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
            toast.success('Business submitted for approval!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit listing');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Business Details', 'Payment', 'Submission'];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pb: 10 }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', py: 2 }}>
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/business')}
                        sx={{ color: '#64748b' }}
                    >
                        Back to Directory
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: 6 }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: '#1e293b' }}>
                    List Your Business
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: '#64748b' }}>
                    Reach the community by listing your business.
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                    <CardContent sx={{ p: 4 }}>
                        {activeStep === 0 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>Basic Information</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth label="Business Name" name="businessName"
                                        value={formData.businessName} onChange={handleInputChange} required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth label="Owner Name" name="ownerName"
                                        value={formData.ownerName} onChange={handleInputChange} required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select fullWidth label="Category" name="category"
                                        value={formData.category} onChange={handleInputChange} required
                                    >
                                        {categories.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth multiline rows={3} label="Description" name="description"
                                        value={formData.description} onChange={handleInputChange} required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth multiline rows={2} label="Address" name="address"
                                        value={formData.address} onChange={handleInputChange} required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth label="Contact Phone" name="contactPhone"
                                        value={formData.contactPhone} onChange={handleInputChange} required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth label="Contact Email" name="contactEmail" type="email"
                                        value={formData.contactEmail} onChange={handleInputChange} required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth label="Website (Optional)" name="website"
                                        value={formData.website} onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                        sx={{ borderStyle: 'dashed', py: 2 }}
                                    >
                                        {logoFile ? `Logo: ${logoFile.name}` : 'Upload Business Logo'}
                                        <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => {
                                            if (validateStep1()) setActiveStep(1);
                                            else toast.error('Please fill in all required fields');
                                        }}
                                        sx={{ borderRadius: 2, px: 4 }}
                                    >
                                        Next: Payment
                                    </Button>
                                </Grid>
                            </Grid>
                        )}

                        {activeStep === 1 && (
                            <Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom>Payment Required</Typography>
                                <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                                    A one-time registration fee of <b>₹500</b> is required to list your business.
                                </Typography>

                                <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center' }}>
                                    <Typography variant="overline" display="block" color="text.secondary">Scan to Pay ₹500</Typography>
                                    {/* Placeholder QR - User can replace with actual image */}
                                    <Box sx={{ width: 150, height: 150, bgcolor: 'white', mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" color="text.secondary">QR CODE</Typography>
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={600}>UPI ID: pay.community@upi</Typography>
                                </Paper>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Transaction ID / UTR" name="transactionId"
                                            value={formData.transactionId} onChange={handleInputChange} required
                                            helperText="Enter the 12-digit UPI reference number"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<CloudUploadIcon />}
                                            fullWidth
                                            sx={{ borderStyle: 'dashed', py: 2, borderColor: proofFile ? '#10b981' : undefined, color: proofFile ? '#10b981' : undefined }}
                                        >
                                            {proofFile ? `Proof: ${proofFile.name}` : 'Upload Payment Screenshot'}
                                            <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'proof')} />
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                        <Button onClick={() => setActiveStep(0)}>Back</Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            sx={{ borderRadius: 2, px: 4 }}
                                        >
                                            {loading ? 'Submitting...' : 'Submit & Pay'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {activeStep === 2 && (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
                                <Typography variant="h5" fontWeight={700} gutterBottom>Submission Received!</Typography>
                                <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 500, mx: 'auto' }}>
                                    Your business listing and payment proof have been submitted successfully.
                                    Our admin team will verify the payment and approve your listing shortly.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/business')}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Return to Business Directory
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default CreateBusiness;
