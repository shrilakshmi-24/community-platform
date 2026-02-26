import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import {
    Box, Typography, Button, TextField, Paper, Grid,
    FormControl, InputLabel, Select, MenuItem, Chip,
    Stack, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface ContentItem {
    id: string;
    title: string;
}

const NewsletterEditor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<ContentItem[]>([]);
    const [achievements, setAchievements] = useState<ContentItem[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const pdfUrl = null;
    const [emailSubject, setEmailSubject] = useState('');
    const [emailSummary, setEmailSummary] = useState('');

    // Selection State
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [eventsRes, achievementsRes] = await Promise.all([
                    client.get('/community/events/all'),
                    client.get('/community/achievements/all')
                ]);
                setEvents(eventsRes.data.events || []);
                setAchievements(achievementsRes.data.achievements || []);
            } catch (error) {
                console.error('Failed to fetch content', error);
            }
        };
        fetchContent();
    }, []);

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'community_upload');

        try {
            setLoading(true);
            const res = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setCoverImageUrl(data.secure_url);
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (isDraft: boolean) => {
        setLoading(true);
        try {
            const payload = {
                title,
                content,
                coverImageUrl,
                pdfUrl,
                emailSubject,
                emailSummary,
                linkedEventIds: selectedEvents,
                linkedAchievementIds: selectedAchievements,
            };

            const { data } = await client.post('/newsletter/create', payload);

            if (!isDraft) {
                await client.post(`/newsletter/publish/${data.newsletter.id}`);
                alert('Newsletter Published and Sent!');
            } else {
                alert('Draft Saved!');
            }
            navigate('/admin/newsletters');
        } catch (error) {
            console.error('Submission failed', error);
            alert('Failed to save newsletter');
        } finally {
            setLoading(false);
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

    const paperSx = {
        p: 4,
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
    };

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <EmailIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Create Newsletter
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Design and distribute updates to the community
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ ...paperSx, p: { xs: 3, md: 4 } }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#1e293b', mb: 3 }}>
                            Main Content
                        </Typography>

                        <TextField
                            label="Newsletter Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 4, ...textFieldSx }}
                        />

                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#475569', mb: 1 }}>Content Editor (HTML Supported)</Typography>
                        <TextField
                            multiline
                            rows={15}
                            fullWidth
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your newsletter content here. You can use basic HTML tags for formatting."
                            sx={textFieldSx}
                        />
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={4}>
                        <Paper sx={{ ...paperSx, p: 3 }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: BRAND_GRADIENT }} />
                            <Typography variant="h6" fontWeight={700} sx={{ color: '#1e293b', mb: 3 }}>Publishing Details</Typography>

                            <TextField
                                label="Email Subject"
                                fullWidth
                                size="small"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                sx={{ mb: 3, ...textFieldSx }}
                            />

                            <TextField
                                label="Short Summary"
                                fullWidth
                                multiline
                                rows={3}
                                value={emailSummary}
                                onChange={(e) => setEmailSummary(e.target.value)}
                                sx={{ mb: 3, ...textFieldSx }}
                            />

                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                fullWidth
                                sx={{
                                    mb: 3,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    borderWidth: 2,
                                    borderColor: '#e2e8f0',
                                    color: '#475569',
                                    '&:hover': { borderColor: '#E62A4D', color: '#E62A4D', borderWidth: 2, bgcolor: BRAND_GRADIENT_LIGHT }
                                }}
                            >
                                Upload Cover Image
                                <input type="file" hidden onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                            </Button>
                            {coverImageUrl && <Box component="img" src={coverImageUrl} sx={{ width: '100%', borderRadius: '12px', mb: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />}

                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSubmit(true)}
                                    disabled={loading}
                                    fullWidth
                                    sx={{
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        borderColor: '#e2e8f0',
                                        color: '#475569',
                                        '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
                                    }}
                                >
                                    Draft
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    onClick={() => handleSubmit(false)}
                                    disabled={loading}
                                    fullWidth
                                    sx={{
                                        borderRadius: '12px',
                                        fontWeight: 800,
                                        background: BRAND_GRADIENT,
                                        boxShadow: '0 8px 20px -6px rgba(230,42,77,0.4)',
                                        '&:hover': { opacity: 0.95, boxShadow: '0 12px 25px -6px rgba(230,42,77,0.5)' }
                                    }}
                                >
                                    Publish
                                </Button>
                            </Stack>
                        </Paper>

                        <Paper sx={{ ...paperSx, p: 3 }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: BRAND_GRADIENT }} />
                            <Typography variant="h6" fontWeight={700} sx={{ color: '#1e293b', mb: 3 }}>Linked Content</Typography>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel sx={{ fontWeight: 600 }}>Attach Events</InputLabel>
                                <Select
                                    multiple
                                    value={selectedEvents}
                                    onChange={(e) => setSelectedEvents(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                                    sx={{ ...textFieldSx['& .MuiOutlinedInput-root'] }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={events.find(e => e.id === value)?.title} size="small" sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 600 }} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {events.map((event) => (
                                        <MenuItem key={event.id} value={event.id} sx={{ fontWeight: 500 }}>
                                            {event.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel sx={{ fontWeight: 600 }}>Attach Achievements</InputLabel>
                                <Select
                                    multiple
                                    value={selectedAchievements}
                                    onChange={(e) => setSelectedAchievements(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                                    sx={{ ...textFieldSx['& .MuiOutlinedInput-root'] }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={achievements.find(a => a.id === value)?.title} size="small" sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 600 }} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {achievements.map((achievement) => (
                                        <MenuItem key={achievement.id} value={achievement.id} sx={{ fontWeight: 500 }}>
                                            {achievement.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NewsletterEditor;
