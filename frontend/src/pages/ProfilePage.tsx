
import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Button, TextField, Box, Grid, Skeleton } from '@mui/material';
import { useToast } from '../context/ToastContext';

interface UserProfile {
    user: {
        id: string;
        mobileNumber: string;
        role: string;
    };
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
    city?: string;
    state?: string;
    [key: string]: unknown;
}

const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await client.get('/profile/me');
                setProfile({ ...(data.profile || {}), user: data.user }); // Merge profile and user data
                setLoading(false);
            } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                console.error('Failed to fetch profile', error);
                setLoading(false);

                // Set user-friendly error message via Toast
                if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                    showToast('Unable to connect to the server. Please make sure the backend is running.', 'error');
                } else if (error.response?.status === 401) {
                    showToast('Please log in to view your profile.', 'error');
                } else {
                    showToast('Failed to load profile. Please try again later.', 'error');
                }
            }
        };

        fetchProfile();
    }, [showToast]);


    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.put('/profile/update', profile);
            showToast('Profile updated successfully', 'success');
        } catch (error) {
            console.error('Failed to update profile', error);
            showToast('Failed to update profile. Please try again.', 'error');
        }
    };

    if (loading) {
        return (
            <Container component="main" maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Profile
                    </Typography>
                    <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="text" height={40} />
                </Box>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container component="main" maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Profile
                    </Typography>
                    <Typography variant="body1">
                        No profile data available.
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Profile
                </Typography>

                <Box component="form" onSubmit={handleUpdate} noValidate sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                value={profile.user?.mobileNumber || ''}
                                disabled
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="firstName"
                                label="First Name"
                                fullWidth
                                value={profile.firstName || ''}
                                onChange={(e) => setProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="lastName"
                                label="Last Name"
                                fullWidth
                                value={profile.lastName || ''}
                                onChange={(e) => setProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="email"
                                label="Email Address"
                                fullWidth
                                value={profile.email || ''}
                                onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="bio"
                                label="Bio"
                                fullWidth
                                multiline
                                rows={4}
                                value={profile.bio || ''}
                                onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="city"
                                label="City"
                                fullWidth
                                value={profile.city || ''}
                                onChange={(e) => setProfile(prev => prev ? { ...prev, city: e.target.value } : null)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="state"
                                label="State"
                                fullWidth
                                value={profile.state || ''}
                                onChange={(e) => setProfile(prev => prev ? { ...prev, state: e.target.value } : null)}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfilePage;
