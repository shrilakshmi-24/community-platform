import { useState } from 'react';
import {
    Container, Typography, Box, TextField, Button, MenuItem,
    FormControl, InputLabel, Select, Grid, Paper, Alert,
    FormControlLabel, Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const HELP_CATEGORIES = [
    { value: 'Medical', label: 'Medical Emergencies' },
    { value: 'Blood', label: 'Blood Requirements' },
    { value: 'Financial', label: 'Financial Guidance' },
    { value: 'Emotional', label: 'Emotional Support' },
    { value: 'Career', label: 'Career-Related Help' },
    { value: 'Other', label: 'Other' }
];

const PRIORITIES = [
    { value: 'LOW', label: 'Low - Can wait a few days' },
    { value: 'MEDIUM', label: 'Medium - Need help soon' },
    { value: 'HIGH', label: 'High - Need help within 24 hours' },
    { value: 'URGENT', label: 'Urgent - Immediate attention required' }
];

const HelpRequestForm = () => {
    useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'MEDIUM',
        location: '',
        bloodGroup: '',
        contactPhone: '',
        isAnonymous: false
    });

    const handleChange = (e: any) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validation
            if (formData.category === 'Blood' && (!formData.bloodGroup || !formData.location)) {
                setError('Blood Group and Location are required for Blood Request.');
                setLoading(false);
                return;
            }

            if (formData.priority === 'URGENT' && !formData.contactPhone) {
                setError('Contact phone is required for Urgent requests.');
                setLoading(false);
                return;
            }

            await client.post('/help-request/create', formData);
            navigate('/help/my-requests');
        } catch (err: any) {
            console.error('Failed to submit help request', err);
            setError(err.response?.data?.message || 'Failed to submit request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
                    Request Community Help
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    We are here to support you. Please provide details so we can connect you with the right assistance.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    label="Category"
                                    onChange={handleChange}
                                >
                                    {HELP_CATEGORIES.map(cat => (
                                        <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required>
                                <InputLabel>Urgency / Priority</InputLabel>
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    label="Urgency / Priority"
                                    onChange={handleChange}
                                >
                                    {PRIORITIES.map(p => (
                                        <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Subject / Title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="E.g. Urgent Blood Requirement for Surgery"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Description of Situation"
                                name="description"
                                required
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Please describe what happened and what specific help you need..."
                            />
                        </Grid>

                        {/* Dynamic Fields */}
                        {formData.category === 'Blood' && (
                            <>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Blood Group"
                                        name="bloodGroup"
                                        required
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        placeholder="e.g. O+, AB-"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Hospital / Location"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </>
                        )}

                        {(formData.category === 'Medical' || formData.priority === 'URGENT') && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Current Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Contact Phone (if different)"
                                name="contactPhone"
                                required={formData.priority === 'URGENT'}
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="For urgent coordination"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.isAnonymous}
                                        onChange={handleChange}
                                        name="isAnonymous"
                                    />
                                }
                                label="Request Anonymously (Only Admins will see your name)"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{ py: 1.5, fontSize: '1.1rem' }}
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default HelpRequestForm;
