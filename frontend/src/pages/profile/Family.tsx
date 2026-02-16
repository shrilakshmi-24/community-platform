import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import client from '../../api/client';

interface FamilyMember {
    name: string;
    ageRange: string;
    relation: string;
}

const AGE_RANGES = ['18–25', '26–40', '41–60', '60+'];

const Family = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        totalFamilyMembers: 0,
        familyMembers: [] as FamilyMember[]
    });

    const [originalData, setOriginalData] = useState(formData);

    // Check if form has changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    const fetchProfile = useCallback(async () => {
        try {
            const response = await client.get('/profile/me');
            const profile = response.data.profile;

            const profileData = {
                totalFamilyMembers: profile.totalFamilyMembers || 0,
                familyMembers: profile.familyMembers || []
            };

            setFormData(profileData);
            setOriginalData(profileData);
            setLoading(false);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.message || 'Failed to load profile');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.name === 'totalFamilyMembers' ? parseInt(e.target.value) || 0 : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleAddFamilyMember = () => {
        setFormData({
            ...formData,
            familyMembers: [...formData.familyMembers, { name: '', ageRange: '', relation: '' }]
        });
    };

    const handleFamilyMemberChange = (index: number, field: keyof FamilyMember, value: string) => {
        const updatedMembers = [...formData.familyMembers];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setFormData({
            ...formData,
            familyMembers: updatedMembers
        });
    };

    const handleDeleteFamilyMember = (index: number) => {
        setFormData({
            ...formData,
            familyMembers: formData.familyMembers.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await client.put('/profile/family', formData);
            setOriginalData(formData); // Update original data after successful save
            setSuccess('Family information updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.message || 'Failed to update family information');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAndNext = async (e: React.MouseEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await handleSubmit(e as any);
        navigate('/profile/business');
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
                    About Family
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    Share information about your family. This helps build stronger community connections.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Total Family Members (excluding you)"
                        name="totalFamilyMembers"
                        type="number"
                        value={formData.totalFamilyMembers}
                        onChange={handleChange}
                        margin="normal"
                        inputProps={{ min: 0 }}
                        helperText="How many people are in your family besides yourself?"
                    />

                    <Box sx={{ mt: 4, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Family Members Details
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddFamilyMember}
                            >
                                Add Member
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {formData.familyMembers.map((member, index) => (
                                <Grid size={{ xs: 12 }} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                                <TextField
                                                    label="Name"
                                                    value={member.name}
                                                    onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                                    size="small"
                                                    sx={{ flex: '1 1 200px' }}
                                                />
                                                <FormControl size="small" sx={{ flex: '1 1 150px' }}>
                                                    <InputLabel>Age Range</InputLabel>
                                                    <Select
                                                        value={member.ageRange}
                                                        onChange={(e) => handleFamilyMemberChange(index, 'ageRange', e.target.value)}
                                                        label="Age Range"
                                                    >
                                                        <MenuItem value="">Select Age Range</MenuItem>
                                                        {AGE_RANGES.map((range) => (
                                                            <MenuItem key={range} value={range}>{range}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    label="Relation"
                                                    value={member.relation}
                                                    onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                                                    size="small"
                                                    placeholder="Father, Mother, Son, etc."
                                                    sx={{ flex: '1 1 150px' }}
                                                />
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteFamilyMember(index)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {formData.familyMembers.length === 0 && (
                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                                No family members added yet. Click "Add Member" to get started.
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
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
                            onClick={handleSaveAndNext}
                            disabled={saving}
                        >
                            Save & Next
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Family;
