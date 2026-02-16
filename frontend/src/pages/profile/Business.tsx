import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';

interface BusinessListing {
    id: string;
    businessName: string;
    category: string;
    description: string;
    status: string;
}

const Business = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [businessListings, setBusinessListings] = useState<BusinessListing[]>([]);

    const [formData, setFormData] = useState({
        occupation: '',
        company: '',
        workAddress: ''
    });

    const [originalData, setOriginalData] = useState(formData);

    // Check if form has changes
    // Check if form has changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    const fetchProfile = useCallback(async () => {
        try {
            const response = await client.get('/profile/me');
            const profile = response.data.profile;

            const profileData = {
                occupation: profile.occupation || '',
                company: profile.company || '',
                workAddress: profile.workAddress || ''
            };

            setFormData(profileData);
            setOriginalData(profileData);
            setLoading(false);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.message || 'Failed to load profile');
            setLoading(false);
        }
    }, []);

    const fetchBusinessListings = useCallback(async () => {
        try {
            const response = await client.get('/business/my-listings');
            setBusinessListings(response.data.listings || []);
        } catch (err) {
            console.error('Failed to fetch business listings:', err);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
        fetchBusinessListings();
    }, [fetchProfile, fetchBusinessListings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await client.put('/profile/business', formData);
            setOriginalData(formData); // Update original data after successful save
            setSuccess('Business information updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.message || 'Failed to update business information');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAndFinish = async (e: React.MouseEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await handleSubmit(e as any);
        navigate('/community');
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                    My Business & Occupation
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    Share your professional information and business details with the community.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Occupation / Job Title"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        margin="normal"
                        placeholder="e.g., Software Engineer, Business Owner, Doctor"
                    />

                    <TextField
                        fullWidth
                        label="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        margin="normal"
                        placeholder="e.g., ABC Technologies, Self-Employed"
                    />

                    <TextField
                        fullWidth
                        label="Work Address"
                        name="workAddress"
                        value={formData.workAddress}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={2}
                        placeholder="Your office or business location"
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={saving || !hasChanges}
                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            onClick={handleSaveAndFinish}
                            disabled={saving}
                        >
                            Save & Finish
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Business Listings Section */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" color="primary">
                            <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            My Business Listings
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddBusinessIcon />}
                            onClick={() => navigate('/business')}
                        >
                            Create Listing
                        </Button>
                    </Box>

                    {businessListings.length > 0 ? (
                        businessListings.map((listing) => (
                            <Card key={listing.id} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {listing.businessName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        {listing.category}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        {listing.description}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Status: <strong>{listing.status}</strong>
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Alert severity="info">
                            You haven't created any business listings yet. Click "Create Listing" to add your business to the directory.
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Business;
