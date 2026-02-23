import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Button, TextField, Box, Skeleton, Avatar, Paper, IconButton, Chip, Stack, GridLegacy as Grid, Divider } from '@mui/material';
import { useToast } from '../context/ToastContext';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import VerifiedIcon from '@mui/icons-material/Verified';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await client.get('/profile/me');
                setProfile(data.profile);
                setFormData(data.profile);
            } catch (error) {
                console.error(error);
                // Auth error correctly handled globally by axios interceptor
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            await client.put('/profile/update', formData);
            setProfile(formData);
            setEditing(false);
            showToast('Profile Updated', 'success');
        } catch (error) {
            showToast('Update Failed', 'error');
        }
    };

    if (loading) return <Box sx={{ bgcolor: '#f8f9fa', height: '100vh', pt: 10 }}><Container><Skeleton height={400} sx={{ borderRadius: 4 }} /></Container></Box>;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pb: 10 }}>
            {/* Beautiful Gradient Header Area */}
            <Box sx={{
                height: 250,
                background: 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)',
                boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)'
            }} />

            <Container maxWidth="md" sx={{ mt: -10 }}>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Paper sx={{
                        p: { xs: 3, md: 5 },
                        bgcolor: 'white',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                        mb: 6,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={profile?.avatarUrl}
                                    sx={{
                                        width: 140, height: 140,
                                        border: '5px solid white',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                                        bgcolor: '#e2e8f0',
                                        color: '#64748b'
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute', bottom: 5, right: 5,
                                        bgcolor: 'white', color: '#FA8231',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        '&:hover': { bgcolor: '#f8fafc' }
                                    }}
                                    size="small"
                                >
                                    <PhotoCamera fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-1px', mb: 0.5 }}>
                                    {profile?.fullName || 'Community Member'}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#64748b', mb: 2, fontWeight: 400 }}>
                                    {profile?.occupation ? `${profile.occupation} at ${profile.company || 'Unknown'}` : 'Complete your profile'}
                                </Typography>
                                <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                                    <Chip label="MEMBER" size="small" sx={{ bgcolor: '#fff0eb', color: '#FA8231', fontWeight: 800, px: 1 }} />
                                    {profile?.isVerified && <Chip icon={<VerifiedIcon sx={{ color: 'white !important' }} />} label="VERIFIED" size="small" sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 800, px: 1 }} />}
                                </Stack>
                            </Box>

                            <Button
                                variant={editing ? "contained" : "outlined"}
                                startIcon={editing ? <SaveIcon /> : <EditIcon />}
                                onClick={() => editing ? handleSave() : setEditing(true)}
                                sx={{
                                    borderRadius: 8,
                                    px: 4,
                                    py: 1,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    borderColor: editing ? 'transparent' : '#e2e8f0',
                                    color: editing ? 'white' : '#1e293b',
                                    background: editing ? 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)' : 'transparent',
                                    boxShadow: editing ? '0 10px 15px -3px rgba(249, 115, 22, 0.3)' : 'none',
                                    '&:hover': {
                                        borderColor: '#cbd5e1',
                                        bgcolor: editing ? 'transparent' : '#f8fafc',
                                        boxShadow: editing ? '0 10px 20px -3px rgba(249, 115, 22, 0.4)' : 'none'
                                    }
                                }}
                            >
                                {editing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </Box>
                    </Paper>

                    {/* Details Form Area */}
                    <Box sx={{ px: { xs: 1, md: 3 } }}>
                        <Typography variant="h5" fontWeight={800} sx={{ mb: 4, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                            Personal Information
                            <Divider sx={{ flexGrow: 1, ml: 2 }} />
                        </Typography>
                        <Grid container spacing={4}>
                            {[
                                { name: 'fullName', label: 'Full Name', type: 'text' },
                                { name: 'email', label: 'Email Address', type: 'email' },
                                { name: 'occupation', label: 'Occupation / Role', type: 'text' },
                                { name: 'company', label: 'Company Name', type: 'text' },
                                { name: 'address', label: 'Address / Street', type: 'text' },
                                { name: 'city', label: 'City', type: 'text' }
                            ].map((field) => (
                                <Grid item key={field.name} xs={12} sm={6}>
                                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, fontWeight: 600 }}>
                                        {field.label}
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        hiddenLabel
                                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        disabled={!editing}
                                        variant="outlined"
                                        type={field.type}
                                        InputProps={{
                                            sx: {
                                                bgcolor: editing ? '#ffffff' : '#f8fafc',
                                                borderRadius: 2.5,
                                                fontWeight: 500,
                                                color: '#1e293b',
                                                border: '1px solid',
                                                borderColor: editing ? '#cbd5e1' : 'transparent',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: editing ? '#94a3b8' : 'transparent',
                                                    bgcolor: editing ? '#ffffff' : '#f1f5f9'
                                                },
                                                '&.Mui-focused': {
                                                    borderColor: '#FA8231',
                                                    boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
                                                },
                                                '& fieldset': { border: 'none' } // Remove default MUI border to use our custom one
                                            }
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ProfilePage;
