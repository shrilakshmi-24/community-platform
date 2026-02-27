import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, TextField, Button, Paper,
    Grid, CircularProgress, Alert, Stepper, Step, StepLabel
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import client from '../../api/client';
import { toast } from 'react-hot-toast';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface ScholarshipDetails {
    id: string;
    title: string;
    amount: number;
}

const ApplyScholarship = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [scholarship, setScholarship] = useState<ScholarshipDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Personal Information', 'Education Details', 'Bank Details', 'Documents'];

    const [formData, setFormData] = useState({
        fatherName: '',
        motherName: '',
        familyIncome: '',
        classOrCourse: '',
        collegeName: '',
        scoreOrGpa: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        coverLetter: ''
    });

    const [markSheetFile, setMarkSheetFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                // For now we get all and find, optimally there should be a GET /scholarships/:id
                const { data } = await client.get('/community/scholarships');
                const p = data.scholarships.find((s: any) => s.id === id);
                if (p) {
                    setScholarship(p);
                } else {
                    setError('Scholarship not found');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load scholarship details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchScholarship();
        }
    }, [id]);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!markSheetFile) {
            toast.error("Please explicitly upload a marksheet document.");
            return;
        }

        setSubmitting(true);
        try {
            const formDataObj = new FormData();
            formDataObj.append('scholarshipId', id as string);

            // Append all text fields
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });

            // Append file
            if (markSheetFile) {
                formDataObj.append('markSheet', markSheetFile);
            }

            await client.post('/community/scholarships/apply', formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Scholarship application submitted successfully!');
            navigate('/profile'); // or wherever makes sense

        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit application');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            bgcolor: '#f8fafc',
            borderRadius: '12px',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: '#E62A4D', borderWidth: 2 }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#E62A4D' }} />
            </Box>
        );
    }

    if (error || !scholarship) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>{error || 'Scholarship not found'}</Alert>
                <Button onClick={() => navigate('/scholarships')} sx={{ mt: 2, color: '#64748b', fontWeight: 700, textTransform: 'none' }} startIcon={<ArrowBackIcon />}>
                    Back to Scholarships
                </Button>
            </Container>
        );
    }

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Father's Name" required sx={textFieldSx} value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Mother's Name" required sx={textFieldSx} value={formData.motherName} onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Annual Family Income (₹)" required type="number" sx={textFieldSx} value={formData.familyIncome} onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })} />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Current Class / Course" required sx={textFieldSx} value={formData.classOrCourse} onChange={(e) => setFormData({ ...formData, classOrCourse: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="College / School Name" required sx={textFieldSx} value={formData.collegeName} onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Score / GPA from Last Year" required sx={textFieldSx} value={formData.scoreOrGpa} onChange={(e) => setFormData({ ...formData, scoreOrGpa: e.target.value })} />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Bank Name" required sx={textFieldSx} value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Account Number" required sx={textFieldSx} value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="IFSC Code" required sx={textFieldSx} value={formData.ifscCode} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Branch Name" required sx={textFieldSx} value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} />
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Statement of Purpose / Cover Letter" multiline rows={4} sx={textFieldSx} value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{ p: 3, border: '2px dashed #cbd5e1', borderRadius: '16px', bgcolor: '#f8fafc', textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: '#FA8231', bgcolor: 'rgba(250, 130, 49, 0.02)' } }} component="label">
                                <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setMarkSheetFile(e.target.files[0]);
                                    }
                                }} />
                                <CloudUploadIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
                                <Typography variant="h6" fontWeight={700} sx={{ color: '#334155' }}>
                                    Upload Previous Year Marksheet
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {markSheetFile ? markSheetFile.name : 'Click to browse (PDF, JPG, PNG up to 5MB)'}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/scholarships')} sx={{ color: '#64748b', fontWeight: 700, mb: 3, textTransform: 'none', '&:hover': { color: '#0f172a' } }}>
                    Back to Scholarships
                </Button>

                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: BRAND_GRADIENT }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box sx={{ p: 1.5, background: BRAND_GRADIENT_LIGHT, borderRadius: '12px', color: '#E62A4D' }}>
                            <SchoolIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                                Application Form
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                                {scholarship.title}
                            </Typography>
                        </Box>
                    </Box>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6, '& .MuiStepIcon-root': { color: '#cbd5e1' }, '& .MuiStepIcon-root.Mui-active': { color: '#FA8231' }, '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' } }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <form onSubmit={handleSubmit}>
                        {renderStepContent(activeStep)}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid #e2e8f0' }}>
                            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none' }}>
                                Back
                            </Button>

                            {activeStep === steps.length - 1 ? (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitting}
                                    sx={{
                                        background: BRAND_GRADIENT,
                                        color: 'white',
                                        fontWeight: 800,
                                        px: 4, py: 1.5,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        boxShadow: '0 8px 16px -4px rgba(230,42,77,0.3)',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px -4px rgba(230,42,77,0.4)' }
                                    }}
                                >
                                    {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Application'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{
                                        bgcolor: '#0f172a',
                                        color: 'white',
                                        fontWeight: 700,
                                        px: 4, py: 1.5,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#1e293b' }
                                    }}
                                >
                                    Continue
                                </Button>
                            )}
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default ApplyScholarship;
