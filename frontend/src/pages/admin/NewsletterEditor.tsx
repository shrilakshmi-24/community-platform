import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Box, Typography, Button, TextField, Paper, Chip,
    Stack, CircularProgress, Dialog, DialogContent, DialogTitle,
    IconButton, Tooltip, Skeleton, Divider, Alert, Snackbar
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DraftIcon from '@mui/icons-material/Drafts';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublishIcon from '@mui/icons-material/Publish';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const BRAND = '#E62A4D';
const BRAND2 = '#FA8231';
const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250,130,49,0.08) 0%, rgba(230,42,77,0.08) 100%)';

// ─── Quill Toolbar Config ───────────────────────────────────────────────────
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
    ],
};

const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image',
];

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface Newsletter {
    id: string;
    title: string;
    content: string;
    coverImageUrl?: string;
    pdfUrl?: string;
    publishedAt?: string;
    createdAt: string;
    status: string;
    emailSubject?: string;
    emailSummary?: string;
}

// ─── Shared Styles ───────────────────────────────────────────────────────────
const paperSx = {
    p: { xs: 3, md: 4 },
    borderRadius: '20px',
    border: '1px solid rgba(226,232,240,0.8)',
    boxShadow: '0 4px 20px -8px rgba(0,0,0,0.07)',
    position: 'relative',
    overflow: 'hidden',
    bgcolor: '#fff',
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        bgcolor: '#f8fafc',
        '& fieldset': { borderColor: '#e2e8f0' },
        '&:hover fieldset': { borderColor: '#cbd5e1' },
        '&.Mui-focused fieldset': { borderColor: BRAND, borderWidth: 2 },
    },
};

// ───────────────────────────────────────────────────────────────────────────
const NewsletterEditor = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
    const [editingId, setEditingId] = useState<string | null>(null);

    // List state
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [listLoading, setListLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailSummary, setEmailSummary] = useState('');

    // Cover image
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [coverUploading, setCoverUploading] = useState(false);

    // PDF
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfName, setPdfName] = useState('');
    const [pdfUploading, setPdfUploading] = useState(false);

    // Submission
    const [saving, setSaving] = useState(false);

    // Snackbar
    const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({ open: false, msg: '', severity: 'success' });

    // Preview dialog
    const [previewOpen, setPreviewOpen] = useState(false);

    // Delete confirm
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const coverRef = useRef<HTMLInputElement>(null);
    const pdfRef = useRef<HTMLInputElement>(null);

    // ── Fetch newsletters list ──
    useEffect(() => {
        if (view === 'list') fetchNewsletters();
    }, [view]);

    const fetchNewsletters = async () => {
        setListLoading(true);
        try {
            const { data } = await client.get('/newsletter/all');
            setNewsletters(data.newsletters || []);
        } catch {
            showSnack('Failed to load newsletters', 'error');
        } finally {
            setListLoading(false);
        }
    };

    const showSnack = (msg: string, severity: 'success' | 'error' = 'success') => {
        setSnack({ open: true, msg, severity });
    };

    // ── Reset form ──
    const resetForm = () => {
        setTitle('');
        setContent('');
        setEmailSubject('');
        setEmailSummary('');
        setCoverImageUrl('');
        setPdfUrl('');
        setPdfName('');
        setEditingId(null);
    };

    // ── Load newsletter for editing ──
    const handleEdit = (nl: Newsletter) => {
        setTitle(nl.title);
        setContent(nl.content);
        setEmailSubject(nl.emailSubject || '');
        setEmailSummary(nl.emailSummary || '');
        setCoverImageUrl(nl.coverImageUrl || '');
        setPdfUrl(nl.pdfUrl || '');
        setPdfName(nl.pdfUrl ? 'Existing PDF' : '');
        setEditingId(nl.id);
        setView('edit');
    };

    // ── File upload helper ──
    const uploadFile = async (
        file: File,
        setUrl: (url: string) => void,
        setLoading: (b: boolean) => void,
        setName?: (n: string) => void
    ) => {
        setLoading(true);
        try {
            const form = new FormData();
            form.append('file', file);
            const { data } = await client.post('/newsletter/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUrl(data.url);
            if (setName) setName(file.name);
            showSnack('File uploaded successfully ✓');
        } catch {
            showSnack('Upload failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ── Save draft / publish ──
    const handleSubmit = async (isDraft: boolean) => {
        if (!title.trim()) { showSnack('Please enter a newsletter title', 'error'); return; }
        if (!content || content === '<p><br></p>') { showSnack('Content cannot be empty', 'error'); return; }

        setSaving(true);
        try {
            const payload = {
                title: title.trim(),
                content,
                coverImageUrl: coverImageUrl || undefined,
                pdfUrl: pdfUrl || undefined,
                emailSubject: emailSubject || undefined,
                emailSummary: emailSummary || undefined,
                linkedEventIds: [],
                linkedAchievementIds: [],
                linkedBusinessIds: [],
            };

            let newsletterId = editingId;

            if (editingId) {
                await client.put(`/newsletter/update/${editingId}`, payload);
            } else {
                const { data } = await client.post('/newsletter/create', payload);
                newsletterId = data.newsletter.id;
            }

            if (!isDraft && newsletterId) {
                await client.post(`/newsletter/publish/${newsletterId}`);
                showSnack('Newsletter published successfully! 🎉');
            } else {
                showSnack('Draft saved successfully ✓');
            }

            resetForm();
            setView('list');
        } catch {
            showSnack('Failed to save newsletter. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Publish existing draft ──
    const handlePublish = async (id: string) => {
        try {
            await client.post(`/newsletter/publish/${id}`);
            showSnack('Newsletter published! 🎉');
            fetchNewsletters();
        } catch {
            showSnack('Failed to publish', 'error');
        }
    };

    // ── Delete ──
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await client.delete(`/newsletter/${deleteId}`);
            showSnack('Newsletter deleted');
            setDeleteId(null);
            fetchNewsletters();
        } catch {
            showSnack('Failed to delete', 'error');
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // LIST VIEW
    // ═══════════════════════════════════════════════════════════════════════
    if (view === 'list') {
        return (
            <Box sx={{ pb: 8 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ p: 1.2, background: BRAND_GRADIENT_LIGHT, borderRadius: '12px' }}>
                            <NewspaperIcon sx={{ color: BRAND, fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                                Newsletters
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Manage community newsletters & updates
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => { resetForm(); setView('create'); }}
                        sx={{
                            background: BRAND_GRADIENT,
                            borderRadius: '12px',
                            fontWeight: 700,
                            px: 3, py: 1.2,
                            boxShadow: '0 8px 20px -6px rgba(230,42,77,0.4)',
                            '&:hover': { opacity: 0.92 },
                        }}
                    >
                        Create Newsletter
                    </Button>
                </Box>

                {/* Cards */}
                {listLoading ? (
                    <Stack spacing={3}>
                        {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: '16px' }} />)}
                    </Stack>
                ) : newsletters.length === 0 ? (
                    <Paper sx={{ ...paperSx, textAlign: 'center', py: 10 }}>
                        <NewspaperIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" fontWeight={700} color="#94a3b8">No newsletters yet</Typography>
                        <Typography variant="body2" color="#94a3b8" sx={{ mb: 3 }}>
                            Create your first newsletter to get started
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => { resetForm(); setView('create'); }}
                            sx={{ background: BRAND_GRADIENT, borderRadius: '12px', fontWeight: 700 }}
                        >
                            Create Newsletter
                        </Button>
                    </Paper>
                ) : (
                    <Stack spacing={3}>
                        {newsletters.map((nl) => (
                            <Paper key={nl.id} sx={{ ...paperSx, p: 0, overflow: 'hidden' }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                                    {/* Color accent */}
                                    <Box sx={{
                                        width: { xs: '100%', md: 6 },
                                        height: { xs: 6, md: 'auto' },
                                        background: nl.status === 'APPROVED' ? 'linear-gradient(180deg, #10b981, #059669)' : BRAND_GRADIENT,
                                        flexShrink: 0
                                    }} />

                                    {/* Cover thumbnail */}
                                    {nl.coverImageUrl && (
                                        <Box
                                            component="img"
                                            src={nl.coverImageUrl}
                                            sx={{
                                                width: { xs: '100%', md: 140 },
                                                height: { xs: 120, md: 'auto' },
                                                objectFit: 'cover',
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}

                                    {/* Content */}
                                    <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                                                    <Chip
                                                        label={nl.status === 'APPROVED' ? 'Published' : 'Draft'}
                                                        size="small"
                                                        icon={nl.status === 'APPROVED' ? <CheckCircleIcon /> : <DraftIcon />}
                                                        sx={{
                                                            bgcolor: nl.status === 'APPROVED' ? 'rgba(16,185,129,0.1)' : BRAND_GRADIENT_LIGHT,
                                                            color: nl.status === 'APPROVED' ? '#059669' : BRAND,
                                                            fontWeight: 700,
                                                            border: `1px solid ${nl.status === 'APPROVED' ? 'rgba(16,185,129,0.2)' : 'rgba(230,42,77,0.15)'}`,
                                                            '& .MuiChip-icon': { color: 'inherit !important', fontSize: '14px' }
                                                        }}
                                                    />
                                                    {nl.pdfUrl && (
                                                        <Chip
                                                            label="PDF"
                                                            size="small"
                                                            icon={<PictureAsPdfIcon />}
                                                            sx={{
                                                                bgcolor: 'rgba(99,102,241,0.08)',
                                                                color: '#6366f1',
                                                                fontWeight: 700,
                                                                border: '1px solid rgba(99,102,241,0.15)',
                                                                '& .MuiChip-icon': { color: '#6366f1 !important', fontSize: '14px' }
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1.3 }}>
                                                    {nl.title}
                                                </Typography>
                                                {nl.emailSummary && (
                                                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {nl.emailSummary}
                                                    </Typography>
                                                )}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: '#94a3b8' }}>
                                                    <CalendarMonthIcon sx={{ fontSize: 14 }} />
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {new Date(nl.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Actions */}
                                            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                                {nl.status !== 'APPROVED' && (
                                                    <Tooltip title="Publish">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handlePublish(nl.id)}
                                                            sx={{ color: '#10b981', '&:hover': { bgcolor: 'rgba(16,185,129,0.1)' } }}
                                                        >
                                                            <PublishIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(nl)}
                                                        sx={{ color: BRAND2, '&:hover': { bgcolor: 'rgba(250,130,49,0.1)' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setDeleteId(nl.id)}
                                                        sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                )}

                {/* Delete Confirm Dialog */}
                <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                    <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Delete Newsletter?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                            This action cannot be undone. The newsletter will be permanently removed.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: '10px', color: '#64748b', fontWeight: 700 }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleDelete}
                                sx={{ borderRadius: '10px', bgcolor: '#ef4444', fontWeight: 700, '&:hover': { bgcolor: '#dc2626' } }}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </DialogContent>
                </Dialog>

                <Snackbar
                    open={snack.open}
                    autoHideDuration={4000}
                    onClose={() => setSnack(s => ({ ...s, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity={snack.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snack.msg}</Alert>
                </Snackbar>
            </Box>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CREATE / EDIT FORM VIEW
    // ═══════════════════════════════════════════════════════════════════════
    return (
        <Box sx={{ pb: 8 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2, flexWrap: 'wrap' }}>
                <IconButton
                    onClick={() => { resetForm(); setView('list'); }}
                    sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', '&:hover': { borderColor: BRAND, color: BRAND } }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ p: 1.2, background: BRAND_GRADIENT_LIGHT, borderRadius: '12px' }}>
                    <EmailIcon sx={{ color: BRAND, fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        {view === 'edit' ? 'Edit Newsletter' : 'Create Newsletter'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {view === 'edit' ? 'Update your newsletter content and settings' : 'Design and publish a community update'}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' }, gap: 4 }}>

                {/* ── Left: Main Content ── */}
                <Stack spacing={4}>

                    {/* Title */}
                    <Paper sx={{ ...paperSx }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: BRAND_GRADIENT }} />
                        <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 3 }}>
                            Newsletter Details
                        </Typography>
                        <TextField
                            label="Newsletter Title *"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Community Monthly Update – February 2026"
                            sx={{ mb: 3, ...inputSx }}
                        />
                        <TextField
                            label="Short Summary / Teaser"
                            fullWidth
                            multiline
                            rows={2}
                            value={emailSummary}
                            onChange={(e) => setEmailSummary(e.target.value)}
                            placeholder="A brief preview shown on the list page..."
                            sx={{ mb: 3, ...inputSx }}
                        />
                        <TextField
                            label="Email Subject (for broadcasts)"
                            fullWidth
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="e.g. February Community Update is Live!"
                            sx={{ ...inputSx }}
                        />
                    </Paper>

                    {/* Rich Text Editor */}
                    <Paper sx={{ ...paperSx }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: BRAND_GRADIENT }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
                                Content
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setPreviewOpen(true)}
                                disabled={!content || content === '<p><br></p>'}
                                sx={{
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    color: BRAND,
                                    border: `1px solid rgba(230,42,77,0.2)`,
                                    '&:hover': { bgcolor: BRAND_GRADIENT_LIGHT },
                                }}
                            >
                                Preview
                            </Button>
                        </Box>

                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5 }}>
                            Use the toolbar to add headings, bold text, lists, images, links and more. You can have multiple news sections.
                        </Typography>

                        {/* Quill Editor */}
                        <Box sx={{
                            '& .ql-container': { fontFamily: "'Inter', sans-serif", fontSize: '15px', minHeight: 400, borderRadius: '0 0 12px 12px', borderColor: '#e2e8f0' },
                            '& .ql-toolbar': { borderRadius: '12px 12px 0 0', borderColor: '#e2e8f0', bgcolor: '#f8fafc' },
                            '& .ql-editor': { minHeight: 400, lineHeight: 1.8 },
                            '& .ql-editor.ql-blank::before': { fontStyle: 'normal', color: '#94a3b8' },
                            '& .ql-toolbar .ql-stroke': { stroke: '#475569' },
                            '& .ql-toolbar .ql-fill': { fill: '#475569' },
                            '& .ql-toolbar button:hover .ql-stroke': { stroke: BRAND },
                            '& .ql-toolbar button.ql-active .ql-stroke': { stroke: BRAND },
                            '& .ql-toolbar button:hover .ql-fill': { fill: BRAND },
                            '& .ql-toolbar button.ql-active .ql-fill': { fill: BRAND },
                        }}>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Write your newsletter content here. You can add multiple news sections, images, links, and more..."
                            />
                        </Box>
                    </Paper>
                </Stack>

                {/* ── Right: Sidebar ── */}
                <Stack spacing={4}>

                    {/* Actions */}
                    <Paper sx={{ ...paperSx }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: BRAND_GRADIENT }} />
                        <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 3 }}>
                            Publish Settings
                        </Typography>

                        <Stack spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />}
                                onClick={() => handleSubmit(true)}
                                disabled={saving}
                                fullWidth
                                sx={{
                                    borderRadius: '12px', fontWeight: 700, py: 1.3,
                                    borderColor: '#e2e8f0', color: '#475569', borderWidth: 1.5,
                                    '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
                                }}
                            >
                                Save as Draft
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                                onClick={() => handleSubmit(false)}
                                disabled={saving}
                                fullWidth
                                sx={{
                                    borderRadius: '12px', fontWeight: 800, py: 1.3,
                                    background: BRAND_GRADIENT,
                                    boxShadow: '0 8px 20px -6px rgba(230,42,77,0.4)',
                                    '&:hover': { opacity: 0.92 },
                                }}
                            >
                                Publish Now
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Cover Image Upload */}
                    <Paper sx={{ ...paperSx }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: BRAND_GRADIENT }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <ImageIcon sx={{ color: BRAND, fontSize: 22 }} />
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
                                Cover Image
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="#94a3b8" sx={{ display: 'block', mb: 2 }}>
                            Upload a banner image for the newsletter card and header.
                        </Typography>

                        <input
                            ref={coverRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadFile(file, setCoverImageUrl, setCoverUploading);
                                e.target.value = '';
                            }}
                        />

                        {coverImageUrl ? (
                            <Box sx={{ position: 'relative' }}>
                                <Box component="img" src={coverImageUrl} sx={{ width: '100%', borderRadius: '12px', display: 'block', maxHeight: 180, objectFit: 'cover' }} />
                                <IconButton
                                    size="small"
                                    onClick={() => setCoverImageUrl('')}
                                    sx={{
                                        position: 'absolute', top: 8, right: 8,
                                        bgcolor: 'rgba(0,0,0,0.6)', color: '#fff',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={coverUploading ? <CircularProgress size={18} /> : <CloudUploadIcon />}
                                fullWidth
                                disabled={coverUploading}
                                onClick={() => coverRef.current?.click()}
                                sx={{
                                    py: 3, borderRadius: '12px', fontWeight: 700, borderStyle: 'dashed',
                                    borderColor: '#cbd5e1', color: '#64748b', borderWidth: 2,
                                    '&:hover': { borderColor: BRAND, color: BRAND, bgcolor: BRAND_GRADIENT_LIGHT },
                                }}
                            >
                                {coverUploading ? 'Uploading...' : 'Upload Cover Image'}
                            </Button>
                        )}
                    </Paper>

                    {/* PDF Upload */}
                    <Paper sx={{ ...paperSx }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <PictureAsPdfIcon sx={{ color: '#6366f1', fontSize: 22 }} />
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
                                Attach PDF
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="#94a3b8" sx={{ display: 'block', mb: 2 }}>
                            Members can download this PDF from the newsletter page.
                        </Typography>

                        <input
                            ref={pdfRef}
                            type="file"
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadFile(file, setPdfUrl, setPdfUploading, setPdfName);
                                e.target.value = '';
                            }}
                        />

                        {pdfUrl ? (
                            <Box sx={{
                                p: 2, borderRadius: '12px',
                                bgcolor: 'rgba(99,102,241,0.06)',
                                border: '1px solid rgba(99,102,241,0.2)',
                                display: 'flex', alignItems: 'center', gap: 2
                            }}>
                                <PictureAsPdfIcon sx={{ color: '#6366f1', fontSize: 32 }} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={700} color="#0f172a" noWrap>
                                        {pdfName || 'PDF Attached'}
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">
                                        Downloadable by members
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => { setPdfUrl(''); setPdfName(''); }}
                                    sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                startIcon={pdfUploading ? <CircularProgress size={18} /> : <PictureAsPdfIcon />}
                                fullWidth
                                disabled={pdfUploading}
                                onClick={() => pdfRef.current?.click()}
                                sx={{
                                    py: 3, borderRadius: '12px', fontWeight: 700, borderStyle: 'dashed',
                                    borderColor: 'rgba(99,102,241,0.35)', color: '#6366f1', borderWidth: 2,
                                    '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.06)' },
                                }}
                            >
                                {pdfUploading ? 'Uploading...' : 'Upload PDF File'}
                            </Button>
                        )}
                    </Paper>

                    {/* Tips */}
                    <Paper sx={{ ...paperSx, bgcolor: '#fafafa' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="#475569" sx={{ mb: 1.5 }}>
                            💡 Editor Tips
                        </Typography>
                        <Stack spacing={1}>
                            {[
                                'Use H2 or H3 headings to separate news sections',
                                'Add images with the image icon in the toolbar',
                                'Blockquotes make great featured highlights',
                                'Preview before publishing to check formatting',
                            ].map((tip, i) => (
                                <Typography key={i} variant="caption" sx={{ color: '#64748b', display: 'flex', gap: 1 }}>
                                    <span style={{ color: BRAND, fontWeight: 800 }}>→</span> {tip}
                                </Typography>
                            ))}
                        </Stack>
                    </Paper>
                </Stack>
            </Box>

            {/* Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
            >
                <Box sx={{
                    background: BRAND_GRADIENT,
                    px: 4, py: 2.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Typography variant="h6" fontWeight={800} color="white">
                        Preview
                    </Typography>
                    <IconButton onClick={() => setPreviewOpen(false)} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ p: 0 }}>
                    {coverImageUrl && (
                        <Box component="img" src={coverImageUrl} sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
                    )}
                    <Box sx={{ p: { xs: 3, md: 5 } }}>
                        <Typography variant="h3" fontWeight={900} sx={{ color: '#0f172a', mb: 1, letterSpacing: '-1px' }}>
                            {title || 'Untitled Newsletter'}
                        </Typography>
                        {emailSummary && (
                            <Typography variant="body1" sx={{ color: '#64748b', mb: 3, fontStyle: 'italic' }}>
                                {emailSummary}
                            </Typography>
                        )}
                        {pdfUrl && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(99,102,241,0.06)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)', display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                                <PictureAsPdfIcon sx={{ color: '#6366f1' }} />
                                <Typography variant="body2" fontWeight={700} color="#6366f1">PDF Attachment available for download</Typography>
                            </Box>
                        )}
                        <Divider sx={{ mb: 3 }} />
                        <Box
                            sx={{
                                typography: 'body1',
                                color: '#334155',
                                lineHeight: 1.9,
                                '& h1,& h2,& h3': { color: '#0f172a', fontWeight: 800, mt: 3, mb: 1.5 },
                                '& h1': { fontSize: '2rem' },
                                '& h2': { fontSize: '1.5rem' },
                                '& h3': { fontSize: '1.2rem' },
                                '& p': { mb: 1.5 },
                                '& img': { maxWidth: '100%', borderRadius: '12px', my: 2 },
                                '& ul,& ol': { pl: 3, mb: 2 },
                                '& blockquote': {
                                    borderLeft: `4px solid ${BRAND}`,
                                    pl: 3, py: 1, my: 3,
                                    bgcolor: BRAND_GRADIENT_LIGHT,
                                    borderRadius: '0 12px 12px 0',
                                    fontStyle: 'italic'
                                },
                                '& a': { color: BRAND, textDecoration: 'underline' },
                                '& code': { bgcolor: '#f1f5f9', px: 0.5, borderRadius: '4px', fontFamily: 'monospace' },
                            }}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snack.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default NewsletterEditor;
