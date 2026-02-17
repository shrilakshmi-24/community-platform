import React, { useState } from 'react';
import {
    Container, Typography, Box, Paper, Button, CircularProgress, TextField, MenuItem
} from '@mui/material';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import CommonFields from '../../components/admin/CommonFields';
import DynamicFields from '../../components/admin/DynamicFields';

const AdminContentCreation = () => {
    const { showToast } = useToast();
    const [contentType, setContentType] = useState('EVENT');
    const [loading, setLoading] = useState(false);

    // --- STATE MANAGEMENT ---

    // EVENT
    const [eventData, setEventData] = useState({
        title: '', description: '', shortDescription: '',
        date: '', endDate: '', location: '', googleMapLink: '',
        registrationRequired: false, registrationLink: '', maxParticipants: '',
        contactPerson: '', contactEmail: '', contactPhone: '',
        sendNotification: false, emailSubject: '', emailContent: '',
        publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
    });
    const [eventFiles, setEventFiles] = useState<{ media?: File, [key: string]: File | undefined }>({});

    // ANNOUNCEMENT
    const [announcementData, setAnnouncementData] = useState({
        title: '', description: '', shortDescription: '',
        publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
    });
    const [announcementFiles, setAnnouncementFiles] = useState<{ media?: File }>({});

    // SCHOLARSHIP
    const [scholarshipData, setScholarshipData] = useState({
        title: '', description: '', shortDescription: '',
        amount: '', deadline: '', educationLevel: 'Undergraduate',
        providerName: '', eligibility: '', requiredDocuments: '',
        applicationLink: '', contactEmail: '', contactPhone: '',
        publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
    });
    const [scholarshipFiles, setScholarshipFiles] = useState<{ media?: File }>({});

    // BUSINESS
    const [businessData, setBusinessData] = useState({
        title: '', // Maps to businessName in backend, but keep 'title' for CommonFields compatibility then map on submit
        businessName: '', // Redundant but safe? Let's use 'title' as businessName in UI and map it.
        // Actually, CommonFields uses 'title'. Let's sync them.
        ownerName: '', category: 'Retail', description: '', shortDescription: '',
        address: '', contactPhone: '', contactEmail: '', website: '', workingHours: '',
        publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
    });
    // Sync title/businessName
    // Better approach: Use 'title' in state, map to 'businessName' payload.
    const [businessFiles, setBusinessFiles] = useState<{ media?: File, logo?: File }>({});

    // JOB
    const [jobData, setJobData] = useState({
        title: '', type: 'HIRING', description: '', shortDescription: '',
        company: '', companyLogo: '', location: '', salaryRange: '',
        skills: [], experience: '', employmentType: '',
        applicationLink: '', applicationDeadline: '',
        contactEmail: '', status: 'PENDING',
        publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
    });
    const [jobFiles, setJobFiles] = useState<{ media?: File, logo?: File }>({});


    // --- HANDLERS ---

    // Generic File Handler
    const createFileHandler = (setFiles: React.Dispatch<React.SetStateAction<any>>) =>
        (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setFiles((prev: any) => ({ ...prev, [field]: file }));
            }
        };

    const handleEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.entries(eventData).forEach(([key, value]) => data.append(key, value.toString()));
        if (eventFiles.media) data.append('images', eventFiles.media); // Backend expects 'images' array or single 'media'?

        try {
            await client.post('/community/events/create', data);
            showToast('Event created successfully!', 'success');
            // Reset
            setEventData({ ...eventData, title: '', description: '', date: '', location: '' });
            setEventFiles({});
        } catch (error) {
            console.error(error);
            showToast('Failed to create event', 'error');
        } finally { setLoading(false); }
    };

    const handleAnnouncementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.entries(announcementData).forEach(([key, value]) => data.append(key, value.toString()));
        if (announcementFiles.media) data.append('media', announcementFiles.media);

        try {
            await client.post('/announcements', data);
            showToast('Announcement posted!', 'success');
            setAnnouncementData({ ...announcementData, title: '', description: '' });
            setAnnouncementFiles({});
        } catch (error) {
            console.error(error);
            showToast('Failed to post announcement', 'error');
        } finally { setLoading(false); }
    };

    const handleScholarshipSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(scholarshipData).forEach(([key, value]) => data.append(key, String(value)));

            if (scholarshipFiles.media) {
                data.append('media', scholarshipFiles.media);
            }

            await client.post('/scholarships/create', data);
            showToast('Scholarship published successfully', 'success');
            setScholarshipData({
                title: '', description: '', shortDescription: '',
                amount: '', deadline: '', educationLevel: 'Undergraduate',
                providerName: '', eligibility: '', requiredDocuments: '',
                applicationLink: '', contactEmail: '', contactPhone: '',
                publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
            });
            setScholarshipFiles({});
        } catch (error) {
            console.error(error);
            showToast('Failed to publish scholarship', 'error');
        } finally { setLoading(false); }
    };

    const handleBusinessSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            // Map 'title' to 'businessName' if needed, or stick to state
            // Let's use 'title' as 'businessName' to match CommonFields
            const payload = { ...businessData, businessName: businessData.title || businessData.businessName };

            Object.entries(payload).forEach(([key, value]) => {
                if (key !== 'title') { // Avoid duplicating if title used as businessName
                    data.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                }
            });
            // Ensure businessName is sent
            if (!data.has('businessName')) data.append('businessName', businessData.title);

            if (businessFiles.logo) {
                data.append('logo', businessFiles.logo);
            }
            if (businessFiles.media) {
                // Optional: Map CommonFields media to something? Or ignore.
                // Business controller only looks for 'logo' (req.file).
            }

            await client.post('/business/create', data);
            showToast('Business listing created successfully', 'success');
            setBusinessData({
                title: '', businessName: '', ownerName: '', category: 'Retail', description: '', shortDescription: '', address: '',
                contactPhone: '', contactEmail: '', website: '', workingHours: '',
                publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
            });
            setBusinessFiles({});
        } catch (error) {
            console.error(error);
            showToast('Failed to create business listing', 'error');
        } finally { setLoading(false); }
    };

    const handleJobSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(jobData).forEach(([key, value]) => {
                if (key === 'skills' && Array.isArray(value)) {
                    // skills array? FormData handles same-key multiple values or backend expects comma separated?
                    // prisma expects string[] usually.
                    // Let's append each skill or JSON stringify?
                    // Backend careerController: `skills: skills || []`. If body is FormData, `skills` might come as string or array depending on middleware.
                    // Multer usually parses non-file fields.
                    // Let's strict to JSON stringify for arrays if complex, or append multiple times.
                    // But prisma create expects `skills: string[]`.
                    // If we send `skills` multiple times, multer/body-parser might make it an array.
                    // Safest is to handle in controller or send as JSON string/keys.
                    // Let's assumes backend handles array from formData (via standard express/multer body parsing).
                    // Or just stringify it if we are unsure.
                    // Actually, let's just append each value.
                    (value as string[]).forEach(skill => data.append('skills[]', skill));
                    // Or just 'skills' if backend handles it.
                    // Let's try simple append for now.
                } else {
                    data.append(key, String(value));
                }
            });

            // CommonFields media mapped to companyLogo
            if (jobFiles.media) {
                data.append('companyLogo', jobFiles.media);
            }

            await client.post('/careers/create', data);
            showToast('Career listing created successfully', 'success');
            setJobData({
                title: '', type: 'HIRING', description: '', shortDescription: '',
                company: '', companyLogo: '', location: '', salaryRange: '',
                skills: [], experience: '', employmentType: '',
                applicationLink: '', applicationDeadline: '',
                contactEmail: '', status: 'PENDING',
                publishDate: '', expiryDate: '', visibility: 'ALL_MEMBERS'
            });
            setJobFiles({});
        } catch (error) {
            console.error(error);
            showToast('Failed to create career listing', 'error');
        } finally { setLoading(false); }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="#8B2635" fontWeight="bold">
                    Unified Content Creation
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Manage Events, Announcements, Scholarships, Businesses, and Jobs.
                </Typography>

                <TextField
                    select
                    fullWidth
                    label="Select Content Type"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    sx={{ mb: 4 }}
                >
                    <MenuItem value="EVENT">Event</MenuItem>
                    <MenuItem value="ANNOUNCEMENT">Announcement</MenuItem>
                    <MenuItem value="SCHOLARSHIP">Scholarship</MenuItem>
                    <MenuItem value="BUSINESS">Business Listing</MenuItem>
                    <MenuItem value="JOB">Job / Career</MenuItem>
                </TextField>

                {/* --- EVENT --- */}
                {contentType === 'EVENT' && (
                    <Box component="form" onSubmit={handleEventSubmit}>
                        <CommonFields
                            formData={eventData} setFormData={setEventData}
                            handleFileChange={createFileHandler(setEventFiles)}
                            fileNames={{ media: eventFiles.media?.name || '' }}
                        />
                        <Box sx={{ mt: 3 }}>
                            <DynamicFields
                                contentType="EVENT"
                                formData={eventData} setFormData={setEventData}
                                handleFileChange={createFileHandler(setEventFiles)}
                                fileNames={{}}
                            />
                        </Box>
                        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                            <Button variant="outlined" color="primary" fullWidth>Save Draft</Button>
                            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Publish Event'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* --- ANNOUNCEMENT --- */}
                {contentType === 'ANNOUNCEMENT' && (
                    <Box component="form" onSubmit={handleAnnouncementSubmit}>
                        <CommonFields
                            formData={announcementData} setFormData={setAnnouncementData}
                            handleFileChange={createFileHandler(setAnnouncementFiles)}
                            fileNames={{ media: announcementFiles.media?.name || '' }}
                        />
                        <Box sx={{ mt: 4 }}>
                            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Post Announcement'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* --- SCHOLARSHIP --- */}
                {contentType === 'SCHOLARSHIP' && (
                    <Box component="form" onSubmit={handleScholarshipSubmit}>
                        <CommonFields
                            formData={scholarshipData} setFormData={setScholarshipData}
                            handleFileChange={createFileHandler(setScholarshipFiles)}
                            fileNames={{ media: scholarshipFiles.media?.name || '' }}
                        />
                        <Box sx={{ mt: 3 }}>
                            <DynamicFields
                                contentType="SCHOLARSHIP"
                                formData={scholarshipData} setFormData={setScholarshipData}
                                handleFileChange={createFileHandler(setScholarshipFiles)}
                                fileNames={{}} // No specific dynamic files for now
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Publish Scholarship'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* --- BUSINESS --- */}
                {contentType === 'BUSINESS' && (
                    <Box component="form" onSubmit={handleBusinessSubmit}>
                        {/* Business uses 'businessName' usually, but CommonFields uses 'title'. mapped on submit */}
                        <CommonFields
                            formData={businessData} setFormData={setBusinessData}
                            handleFileChange={createFileHandler(setBusinessFiles)}
                            fileNames={{ media: businessFiles.media?.name || '' }}
                        />
                        <Box sx={{ mt: 3 }}>
                            <DynamicFields
                                contentType="BUSINESS"
                                formData={businessData} setFormData={setBusinessData}
                                handleFileChange={createFileHandler(setBusinessFiles)}
                                fileNames={{ logo: businessFiles.logo?.name || '' }}
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Create Business Listing'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* --- JOB --- */}
                {contentType === 'JOB' && (
                    <Box component="form" onSubmit={handleJobSubmit}>
                        <CommonFields
                            formData={jobData} setFormData={setJobData}
                            handleFileChange={createFileHandler(setJobFiles)}
                            fileNames={{ media: jobFiles.media?.name || '' }}
                        />
                        <Box sx={{ mt: 3 }}>
                            <DynamicFields
                                contentType="JOB"
                                formData={jobData} setFormData={setJobData}
                                handleFileChange={createFileHandler(setJobFiles)}
                                fileNames={{ logo: jobFiles.logo?.name || '' }}
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Post Job'}
                            </Button>
                        </Box>
                    </Box>
                )}

            </Paper>
        </Container>
    );
};

export default AdminContentCreation;
