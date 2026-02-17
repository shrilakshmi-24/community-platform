import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Scholarship {
    id: string;
    title: string;
    description: string;
    amount: number;
    deadline: string;
    educationLevel: string;
    isClosed: boolean;
    applicationLink?: string; // New field
}

const ScholarshipsPage = () => {
    useAuth(); // User not needed specifically if we don't display user info here
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
    const [formData, setFormData] = useState({
        fatherName: '', motherName: '', familyIncome: '',
        classOrCourse: '', collegeName: '', scoreOrGpa: '',
        bankName: '', accountNumber: '', ifscCode: '', branchName: '',
        coverLetter: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');

    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            const res = await client.get('/community/scholarships');
            setScholarships(res.data.scholarships);
        } catch (error) {
            console.error('Failed to fetch scholarships', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = (scholarship: Scholarship) => {
        if (scholarship.applicationLink) {
            window.open(scholarship.applicationLink, '_blank', 'noopener,noreferrer');
            return;
        }

        setSelectedScholarship(scholarship);
        setOpenDialog(true);
        // Reset form
        setFormData({
            fatherName: '', motherName: '', familyIncome: '',
            classOrCourse: '', collegeName: '', scoreOrGpa: '',
            bankName: '', accountNumber: '', ifscCode: '', branchName: '',
            coverLetter: ''
        });
        setFile(null);
        setFileName('');
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmitApplication = async () => {
        if (!selectedScholarship) return;

        // Basic Client Validation
        if (!formData.fatherName || !formData.familyIncome || !formData.classOrCourse ||
            !formData.bankName || !formData.coverLetter) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        setSubmitLoading(true);
        setErrorMessage('');

        try {
            const submissionData = new FormData();
            submissionData.append('scholarshipId', selectedScholarship.id);

            // Append all string fields
            Object.entries(formData).forEach(([key, value]) => {
                submissionData.append(key, value);
            });

            // Append file
            if (file) {
                submissionData.append('markSheet', file);
            }

            await client.post('/community/scholarships/apply', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccessMessage('Application submitted successfully!');
            setTimeout(() => {
                setOpenDialog(false);
                fetchScholarships();
            }, 2000);
        } catch (error) {
            console.error('Application failed', error);
            // @ts-expect-error: error.response is not typed
            setErrorMessage(error.response?.data?.message || 'Failed to apply. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#8B2635' }} gutterBottom>
                    Scholarships
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Financial aid opportunities for your education.
                </Typography>
            </Box>

            {loading ? (
                <Typography textAlign="center">Loading opportunities...</Typography>
            ) : scholarships.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No active scholarships found at the moment.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {scholarships.map((scholarship) => (
                        <Grid size={{ xs: 12, md: 6 }} key={scholarship.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3, position: 'relative' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h5" fontWeight="bold" color="primary">
                                            {scholarship.title}
                                        </Typography>
                                        {scholarship.isClosed ? (
                                            <Chip label="Closed" color="error" size="small" icon={<EventBusyIcon />} />
                                        ) : (
                                            <Chip label="Active" color="success" size="small" />
                                        )}
                                    </Box>

                                    <Typography variant="h6" sx={{ color: '#2E7D32', mb: 1, fontWeight: 'bold' }}>
                                        ₹{scholarship.amount.toLocaleString()}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        <strong>Level:</strong> {scholarship.educationLevel}
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        {scholarship.description}
                                    </Typography>

                                    <Typography variant="caption" display="block" color="text.secondary">
                                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                    </Typography>

                                    {scholarship.applicationLink && (
                                        <Typography variant="body2" sx={{ mt: 1, color: 'info.main', fontStyle: 'italic' }}>
                                            * External Application
                                        </Typography>
                                    )}
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        disabled={scholarship.isClosed}
                                        onClick={() => handleApplyClick(scholarship)}
                                        sx={{ bgcolor: '#8B2635', '&:hover': { bgcolor: '#A0522D' } }}
                                    >
                                        {scholarship.isClosed ? 'Applications Closed' : (scholarship.applicationLink ? 'Apply External' : 'Apply Now')}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Application Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#8B2635', color: 'white' }}>
                    Apply for {selectedScholarship?.title}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

                    {!successMessage && (
                        <Box component="form" sx={{ mt: 1 }}>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                                Personal & Family Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Father's Name" required
                                        value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Mother's Name" required
                                        value={formData.motherName} onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Annual Family Income" type="number" required
                                        value={formData.familyIncome} onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })} />
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                                Education Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField fullWidth label="Class / Course" required
                                        value={formData.classOrCourse} onChange={(e) => setFormData({ ...formData, classOrCourse: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField fullWidth label="College / Institute" required
                                        value={formData.collegeName} onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField fullWidth label="Score / GPA" required
                                        value={formData.scoreOrGpa} onChange={(e) => setFormData({ ...formData, scoreOrGpa: e.target.value })} />
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                                Bank Details (For Scholarship Disbursement)
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Bank Name" required
                                        value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Account Number" required
                                        value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="IFSC Code" required
                                        value={formData.ifscCode} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Branch Name" required
                                        value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} />
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                                Documents & Statement
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Statement of Purpose"
                                        multiline rows={3} required
                                        value={formData.coverLetter}
                                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                        placeholder="Why do you deserve this scholarship?"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Upload Mark Sheet / Income Proof (PDF/Image max 5MB) *
                                    </Typography>
                                    <input
                                        accept="image/*,application/pdf"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="outlined" component="span" startIcon={<SchoolIcon />}>
                                            {fileName || "Choose File"}
                                        </Button>
                                    </label>
                                    {fileName && <Typography variant="caption" sx={{ ml: 2 }}>{fileName}</Typography>}
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} disabled={submitLoading}>Cancel</Button>
                    {!successMessage && (
                        <Button
                            onClick={handleSubmitApplication}
                            variant="contained"
                            disabled={submitLoading}
                            sx={{ bgcolor: '#8B2635' }}
                        >
                            {submitLoading ? 'Submitting Application...' : 'Submit Application'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ScholarshipsPage;
