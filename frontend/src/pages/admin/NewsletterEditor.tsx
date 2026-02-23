import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import {
    Box, Typography, Button, TextField, Paper, GridLegacy as Grid,
    FormControl, InputLabel, Select, MenuItem, Chip,
    Stack, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';

const NewsletterEditor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<any[]>([]); // Replace with proper interface
    const [achievements, setAchievements] = useState<any[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const pdfUrl = null; // Placeholder until PDF upload is implemented
    const [emailSubject, setEmailSubject] = useState('');
    const [emailSummary, setEmailSummary] = useState('');

    // Selection State
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const [eventsRes, achievementsRes] = await Promise.all([
                client.get('/community/events/all'), // Adjust endpoint if needed
                client.get('/community/achievements/all')
            ]);
            setEvents(eventsRes.data.events || []);
            setAchievements(achievementsRes.data.achievements || []);
        } catch (error) {
            console.error('Failed to fetch content', error);
        }
    };

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'community_upload'); // Replace with env var if possible

        try {
            setLoading(true);
            // using direct fetch to cloudinary as client might have baseurl set to backend
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
                pdfUrl, // Handle PDF upload similarly if needed
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
            navigate('/admin/newsletters'); // Redirect to list
        } catch (error) {
            console.error('Submission failed', error);
            alert('Failed to save newsletter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: '#1e293b' }}>
                Create Newsletter
            </Typography>

            <Grid container spacing={4}>
                {/* Main Editor */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <TextField
                            label="Newsletter Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Typography variant="subtitle2" gutterBottom>Content (HTML Supported)</Typography>
                        <TextField
                            multiline
                            rows={15}
                            fullWidth
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your newsletter content here. You can use basic HTML tags for formatting."
                            sx={{ mb: 3 }}
                        />
                    </Paper>
                </Grid>

                {/* Sidebar Controls */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom>Publishing Details</Typography>

                            <TextField
                                label="Email Subject"
                                fullWidth
                                size="small"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                label="Short Summary"
                                fullWidth
                                multiline
                                rows={3}
                                value={emailSummary}
                                onChange={(e) => setEmailSummary(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Upload Cover Image
                                <input type="file" hidden onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                            </Button>
                            {coverImageUrl && <Box component="img" src={coverImageUrl} sx={{ width: '100%', borderRadius: 2, mb: 2 }} />}

                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSubmit(true)}
                                    disabled={loading}
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    color="primary"
                                    onClick={() => handleSubmit(false)}
                                    disabled={loading}
                                >
                                    Publish
                                </Button>
                            </Stack>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom>Linked Content</Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Attach Events</InputLabel>
                                <Select
                                    multiple
                                    value={selectedEvents}
                                    onChange={(e) => setSelectedEvents(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={events.find(e => e.id === value)?.title} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {events.map((event) => (
                                        <MenuItem key={event.id} value={event.id}>
                                            {event.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Attach Achievements</InputLabel>
                                <Select
                                    multiple
                                    value={selectedAchievements}
                                    onChange={(e) => setSelectedAchievements(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={achievements.find(a => a.id === value)?.title} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {achievements.map((achievement) => (
                                        <MenuItem key={achievement.id} value={achievement.id}>
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
