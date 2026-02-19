import { useState, useEffect } from 'react';
import client from '../api/client';
import { Container, Typography, Button, TextField, Box, Skeleton, Avatar, Paper, IconButton, Chip, Stack, GridLegacy as Grid } from '@mui/material';
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
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 6, pb: 10 }}>
            <Container maxWidth="md">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Paper sx={{
                        p: 4,
                        bgcolor: 'white',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                        mb: 6
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={profile?.avatarUrl}
                                    sx={{
                                        width: 120, height: 120,
                                        border: '4px solid white',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        bgcolor: 'white', color: '#64748b',
                                        border: '1px solid #e2e8f0',
                                        '&:hover': { bgcolor: '#f1f5f9' }
                                    }}
                                    size="small"
                                >
                                    <PhotoCamera fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
                                <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b' }}>
                                    {profile?.fullName || 'Anonymous User'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748b', mb: 1 }}>
                                    @{profile?.user?.mobileNumber || 'hidden'}
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                                    <Chip label="MEMBER" size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700 }} />
                                    {profile?.isVerified && <Chip icon={<VerifiedIcon sx={{ color: 'white !important' }} />} label="VERIFIED" size="small" sx={{ bgcolor: '#059669', color: 'white', fontWeight: 700 }} />}
                                </Stack>
                            </Box>

                            <Button
                                variant={editing ? "contained" : "outlined"}
                                startIcon={editing ? <SaveIcon /> : <EditIcon />}
                                onClick={() => editing ? handleSave() : setEditing(true)}
                                sx={{
                                    borderRadius: 2,
                                    borderColor: '#e2e8f0',
                                    color: editing ? 'white' : '#64748b',
                                    bgcolor: editing ? '#2563eb' : 'transparent',
                                    '&:hover': { borderColor: '#cbd5e1', bgcolor: editing ? '#1d4ed8' : '#f8fafc' }
                                }}
                            >
                                {editing ? 'SAVE' : 'EDIT'}
                            </Button>
                        </Box>
                    </Paper>

                    {/* Details Grid */}
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 3, color: '#334155' }}>
                        Personal Information
                    </Typography>
                    <Grid container spacing={3}>
                        {['fullName', 'email', 'occupation', 'company', 'address', 'city'].map((field) => (
                            <Grid item key={field} xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={formData[field] || ''}
                                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                    disabled={!editing}
                                    variant="outlined"
                                    InputProps={{
                                        sx: {
                                            bgcolor: 'white',
                                            borderRadius: 2,
                                            '& fieldset': { borderColor: '#e2e8f0' }
                                        }
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ProfilePage;
