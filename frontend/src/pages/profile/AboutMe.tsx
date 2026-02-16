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
    Chip,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const AboutMe = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Get logout function
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        mobileNumber: '',
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        bio: '',
        avatarUrl: '',
        profession: '',
        bloodGroup: '',
        dateOfBirth: '',
        maritalStatus: '',
        interests: [] as string[],
        skills: [] as string[]
    });

    const [originalData, setOriginalData] = useState(formData);
    const [interestInput, setInterestInput] = useState('');
    const [skillInput, setSkillInput] = useState('');

    // Check if form has changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    const fetchProfile = useCallback(async () => {
        try {
            const response = await client.get('/profile/me');
            const profile = response.data.profile || {}; // Handle null profile
            const user = response.data.user || {};

            const profileData = {
                mobileNumber: user.mobileNumber || '',
                fullName: profile.fullName || '',
                email: profile.email || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                bio: profile.bio || '',
                avatarUrl: profile.avatarUrl || '',
                profession: profile.profession || '',
                bloodGroup: profile.bloodGroup || '',
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
                maritalStatus: profile.maritalStatus || '',
                interests: profile.interests || [],
                skills: profile.skills || []
            };

            setFormData(profileData);
            setOriginalData(profileData);
            setLoading(false);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (err.response && err.response.status === 404) {
                // Profile not found - this is expected for new users
                const user = err.response.data.user || {};
                setFormData(prev => ({
                    ...prev,
                    mobileNumber: user.mobileNumber || ''
                }));
                // Don't set error, just stop loading
            } else if (err.response && err.response.status === 401) {
                // Token invalid or user not found
                setError('Session expired or invalid. Logging out...');
                setTimeout(() => {
                    logout(); // Clear auth state and local storage
                    // ProtectedRoute or AuthContext will likely handle redirection, 
                    // but explicit navigate is safer if logout is async or doesn't trigger immediate unmount
                    navigate('/login');
                }, 2000);
            } else {
                setError(err.response?.data?.message || 'Failed to load profile');
            }
            setLoading(false);
        }
    }, [logout, navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddInterest = () => {
        if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
            setFormData({
                ...formData,
                interests: [...formData.interests, interestInput.trim()]
            });
            setInterestInput('');
        }
    };

    const handleDeleteInterest = (interest: string) => {
        setFormData({
            ...formData,
            interests: formData.interests.filter(i => i !== interest)
        });
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skillInput.trim()]
            });
            setSkillInput('');
        }
    };

    const handleDeleteSkill = (skill: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skill)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Remove mobileNumber before sending to API safely
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { mobileNumber: _mobileNumber, ...dataToSend } = formData;
            await client.put('/profile/about-me', dataToSend);

            // Update original data but keep mobile number
            setOriginalData(formData);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (err.response && err.response.status === 401) {
                setError('Session expired. Logging out...');
                setTimeout(() => logout(), 2000);
            } else {
                setError(err.response?.data?.message || 'Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAndNext = async (e: React.MouseEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await handleSubmit(e as any);
        navigate('/profile/family');
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
                    About Me
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    Tell us about yourself. This information helps other community members get to know you better.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Mobile Number"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        margin="normal"
                        disabled
                        helperText="Registered mobile number cannot be changed"
                    />


                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={2}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Bio / About Me"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                        placeholder="Tell us about yourself, your background, and what you're passionate about..."
                    />

                    {/* New Fields */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Profession / Occupation"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., Software Engineer, Doctor, Business Owner"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Blood Group</InputLabel>
                            <Select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                label="Blood Group"
                            >
                                <MenuItem value="">Select Blood Group</MenuItem>
                                <MenuItem value="A+">A+</MenuItem>
                                <MenuItem value="A-">A-</MenuItem>
                                <MenuItem value="B+">B+</MenuItem>
                                <MenuItem value="B-">B-</MenuItem>
                                <MenuItem value="AB+">AB+</MenuItem>
                                <MenuItem value="AB-">AB-</MenuItem>
                                <MenuItem value="O+">O+</MenuItem>
                                <MenuItem value="O-">O-</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Marital Status</InputLabel>
                            <Select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                                label="Marital Status"
                            >
                                <MenuItem value="">Select Status</MenuItem>
                                <MenuItem value="Single">Single</MenuItem>
                                <MenuItem value="Married">Married</MenuItem>
                                <MenuItem value="Divorced">Divorced</MenuItem>
                                <MenuItem value="Widowed">Widowed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Interests */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Interests
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Add an interest"
                                value={interestInput}
                                onChange={(e) => setInterestInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                            />
                            <Button variant="outlined" size="small" onClick={handleAddInterest}>
                                Add
                            </Button>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {formData.interests.map((interest) => (
                                <Chip
                                    key={interest}
                                    label={interest}
                                    onDelete={() => handleDeleteInterest(interest)}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Skills */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Skills
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Add a skill"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            />
                            <Button variant="outlined" size="small" onClick={handleAddSkill}>
                                Add
                            </Button>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {formData.skills.map((skill) => (
                                <Chip
                                    key={skill}
                                    label={skill}
                                    onDelete={() => handleDeleteSkill(skill)}
                                    color="secondary"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
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

export default AboutMe;
