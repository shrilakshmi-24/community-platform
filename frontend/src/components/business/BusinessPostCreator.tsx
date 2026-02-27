import { useState, useRef } from 'react';
import client from '../../api/client';
import {
    Box, Typography, Button, TextField, Select, MenuItem,
    FormControl, InputLabel, IconButton, Chip, CircularProgress,
    Paper, Collapse, Stack
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SendIcon from '@mui/icons-material/Send';

const BRAND = '#E62A4D';
const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';

const POST_TYPES = [
    { value: 'UPDATE', label: 'Update', icon: <AutorenewIcon sx={{ fontSize: 16 }} />, color: '#3b82f6' },
    { value: 'ANNOUNCEMENT', label: 'Announcement', icon: <CampaignIcon sx={{ fontSize: 16 }} />, color: '#8b5cf6' },
    { value: 'OFFER', label: 'Special Offer', icon: <LocalOfferIcon sx={{ fontSize: 16 }} />, color: '#10b981' },
    { value: 'JOB', label: 'Job Opening', icon: <WorkIcon sx={{ fontSize: 16 }} />, color: '#f59e0b' },
];

interface BusinessPostCreatorProps {
    businessId: string;
    businessName: string;
    logoUrl?: string;
    onPostCreated: (post: any) => void;
}

const BusinessPostCreator = ({ businessId, businessName, logoUrl, onPostCreated }: BusinessPostCreatorProps) => {
    const [expanded, setExpanded] = useState(false);
    const [type, setType] = useState('UPDATE');
    const [content, setContent] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobContact, setJobContact] = useState('');
    const [jobApplyLink, setJobApplyLink] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const imageRef = useRef<HTMLInputElement>(null);

    const selectedType = POST_TYPES.find(t => t.value === type)!;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setSubmitting(true);

        try {
            const form = new FormData();
            form.append('type', type);
            form.append('content', content.trim());
            if (type === 'JOB') {
                if (jobTitle) form.append('jobTitle', jobTitle);
                if (jobDescription) form.append('jobDescription', jobDescription);
                if (jobContact) form.append('jobContact', jobContact);
                if (jobApplyLink) form.append('jobApplyLink', jobApplyLink);
            }
            if (imageFile) form.append('image', imageFile);

            const { data } = await client.post(`/business-engagement/${businessId}/posts`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            onPostCreated(data.post);
            setContent('');
            setType('UPDATE');
            setJobTitle('');
            setJobDescription('');
            setJobContact('');
            setJobApplyLink('');
            setImageFile(null);
            setImagePreview(null);
            setExpanded(false);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Paper sx={{
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px -4px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            mb: 3,
        }}>
            {/* Trigger area */}
            {!expanded ? (
                <Box
                    sx={{
                        p: 2.5, display: 'flex', alignItems: 'center', gap: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#fafafa' },
                        transition: 'background 0.2s'
                    }}
                    onClick={() => setExpanded(true)}
                >
                    <Box sx={{
                        width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(230,42,77,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        overflow: 'hidden'
                    }}>
                        {logoUrl
                            ? <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <Typography fontWeight={900} sx={{ color: BRAND }}>{businessName[0]}</Typography>
                        }
                    </Box>
                    <Box sx={{
                        flex: 1, py: 1.2, px: 2.5, borderRadius: '14px',
                        bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                    }}>
                        <Typography variant="body2" color="#94a3b8">
                            Share an update, offer, or job opening as <strong style={{ color: '#475569' }}>{businessName}</strong>…
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ p: 3 }}>
                    {/* Type selector pills */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
                        {POST_TYPES.map(t => (
                            <Chip
                                key={t.value}
                                icon={t.icon}
                                label={t.label}
                                onClick={() => setType(t.value)}
                                sx={{
                                    fontWeight: 700, fontSize: '0.8rem',
                                    bgcolor: type === t.value ? t.color : '#f8fafc',
                                    color: type === t.value ? 'white' : '#64748b',
                                    border: `1px solid ${type === t.value ? t.color : '#e2e8f0'}`,
                                    transition: 'all 0.2s',
                                    '& .MuiChip-icon': { color: type === t.value ? 'white !important' : `${t.color} !important` },
                                    '&:hover': { bgcolor: t.color, color: 'white', '& .MuiChip-icon': { color: 'white !important' } }
                                }}
                            />
                        ))}
                    </Box>

                    {/* Content */}
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={8}
                        placeholder={
                            type === 'JOB' ? "Describe the opportunity briefly..."
                                : type === 'OFFER' ? "What's your special offer? Include details, validity, discount..."
                                    : type === 'ANNOUNCEMENT' ? "Make an announcement to your followers..."
                                        : "Share an update with your followers..."
                        }
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '14px', bgcolor: '#f8fafc',
                                '& fieldset': { borderColor: '#e2e8f0' },
                                '&.Mui-focused fieldset': { borderColor: selectedType.color, borderWidth: 2 }
                            }
                        }}
                    />

                    {/* Job fields */}
                    <Collapse in={type === 'JOB'}>
                        <Box sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', mb: 2 }}>
                            <Typography variant="caption" fontWeight={800} color="#92400e" sx={{ display: 'block', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Job Details
                            </Typography>
                            <Stack spacing={1.5}>
                                <TextField size="small" label="Job Title *" value={jobTitle} onChange={e => setJobTitle(e.target.value)} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                <TextField size="small" label="Job Description" value={jobDescription} onChange={e => setJobDescription(e.target.value)} fullWidth multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <TextField size="small" label="Contact / Phone" value={jobContact} onChange={e => setJobContact(e.target.value)} fullWidth sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    <TextField size="small" label="Apply Link (URL)" value={jobApplyLink} onChange={e => setJobApplyLink(e.target.value)} fullWidth sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Box>
                            </Stack>
                        </Box>
                    </Collapse>

                    {/* Image preview */}
                    {imagePreview && (
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Box component="img" src={imagePreview} sx={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: '14px' }} />
                            <IconButton
                                size="small"
                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    {/* Footer actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                            <IconButton size="small" onClick={() => imageRef.current?.click()} sx={{ color: '#64748b', '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59,130,246,0.08)' } }}>
                                <AddPhotoAlternateIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                size="small"
                                onClick={() => { setExpanded(false); setContent(''); setType('UPDATE'); }}
                                sx={{ borderRadius: '10px', color: '#64748b', fontWeight: 700 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : <SendIcon />}
                                onClick={handleSubmit}
                                disabled={submitting || !content.trim() || (type === 'JOB' && !jobTitle.trim())}
                                sx={{
                                    background: BRAND_GRADIENT, borderRadius: '10px', fontWeight: 800,
                                    boxShadow: '0 4px 12px -3px rgba(230,42,77,0.4)',
                                    '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8', boxShadow: 'none' },
                                }}
                            >
                                Post
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default BusinessPostCreator;
