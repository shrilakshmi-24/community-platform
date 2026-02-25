import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, TextField, Button, GridLegacy as Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, Chip, FormControl, InputLabel, Select, MenuItem, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import client from '../../api/client';
import { toast } from 'react-hot-toast';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.1) 0%, rgba(230, 42, 77, 0.1) 100%)';
const BRAND_SHADOW = '0 20px 40px -10px rgba(230, 42, 77, 0.3)';

interface Application {
    id: string;
    studentName: string;
    status: string;
    scholarship?: {
        title: string;
    };
    applicant?: {
        fullName: string;
        email: string;
        mobileNumber: string;
    };
    [key: string]: unknown;
}

interface Scholarship {
    id: string;
    title: string;
    amount: number;
    deadline: string;
    educationLevel: string;
    applications?: Application[];
}

const ScholarshipManager = () => {
    const [tabValue, setTabValue] = useState(0);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>('');

    // Create Form State
    const [newScholarship, setNewScholarship] = useState({
        title: '',
        description: '',
        amount: '',
        deadline: '',
        educationLevel: 'Undergraduate'
    });

    const fetchScholarships = useCallback(async () => {
        try {
            const res = await client.get('/community/scholarships'); // Using public endpoint for list
            setScholarships(res.data.scholarships);
            if (res.data.scholarships.length > 0 && !selectedScholarshipId) {
                setSelectedScholarshipId(res.data.scholarships[0].id);
            }
        } catch (error) {
            console.error('Error fetching scholarships', error);
        }
    }, [selectedScholarshipId]);

    const fetchApplications = useCallback(async (id: string) => {
        try {
            const res = await client.get(`/admin/scholarships/${id}/applications`);
            setApplications(res.data.applications);
        } catch (error) {
            console.error('Error fetching applications', error);
        }
    }, []);

    useEffect(() => {
        if (tabValue === 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchScholarships();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchScholarships(); // Refresh list on tab switch
        }
    }, [tabValue, fetchScholarships]);

    useEffect(() => {
        if (selectedScholarshipId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchApplications(selectedScholarshipId);
        }
    }, [selectedScholarshipId, fetchApplications]);

    const handleCreate = async () => {
        try {
            await client.post('/admin/scholarships', newScholarship);
            toast.success('Scholarship created successfully');
            setNewScholarship({ title: '', description: '', amount: '', deadline: '', educationLevel: 'Undergraduate' });
            fetchScholarships(); // Refresh
        } catch (error) {
            console.error('Error creating scholarship', error);
            toast.error('Failed to create scholarship');
        }
    };

    const handleStatusUpdate = async (appId: string, status: string) => {
        try {
            await client.post(`/admin/scholarships/applications/${appId}/status`, { status });
            toast.success(`Application ${status.toLowerCase()}`);
            fetchApplications(selectedScholarshipId);
        } catch (error) {
            console.error('Error updating status', error);
            toast.error('Failed to update status');
        }
    };

    return (
        <Box sx={{ fontFamily: "'Inter', sans-serif" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ background: BRAND_GRADIENT, mr: 2, width: 48, height: 48, boxShadow: BRAND_SHADOW }}>
                    <SchoolIcon />
                </Avatar>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-1px' }}>
                    Scholarship & Aid Management
                </Typography>
            </Box>

            <Tabs
                value={tabValue}
                onChange={(_, val) => setTabValue(val)}
                sx={{
                    mb: 4,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '1rem', color: '#64748b' },
                    '& .Mui-selected': { color: '#E62A4D !important' },
                    '& .MuiTabs-indicator': { background: BRAND_GRADIENT }
                }}
            >
                <Tab label="Create & Manage" />
                <Tab label="Review Applications" />
            </Tabs>

            {tabValue === 0 && (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 4, borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b', mb: 3 }}>
                                Create New Scholarship
                            </Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    label="Scholarship Title"
                                    fullWidth
                                    value={newScholarship.title}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    label="Amount (₹)"
                                    type="number"
                                    fullWidth
                                    value={newScholarship.amount}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, amount: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Education Level</InputLabel>
                                    <Select
                                        value={newScholarship.educationLevel}
                                        label="Education Level"
                                        onChange={(e) => setNewScholarship({ ...newScholarship, educationLevel: e.target.value })}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        <MenuItem value="High School">High School</MenuItem>
                                        <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                                        <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                                        <MenuItem value="Research">Research</MenuItem>
                                        <MenuItem value="Vocational">Vocational</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Application Deadline"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={newScholarship.deadline}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    label="Description"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={newScholarship.description}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleCreate}
                                    sx={{
                                        mt: 2, py: 1.5, borderRadius: '12px',
                                        background: BRAND_GRADIENT,
                                        boxShadow: BRAND_SHADOW,
                                        fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                                        '&:hover': { transform: 'translateY(-2px)' }
                                    }}
                                >
                                    Publish Scholarship
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 4, borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b', mb: 3 }}>
                                Active Scholarships
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Title</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Deadline</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Level</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {scholarships.map((s) => (
                                            <TableRow key={s.id} hover>
                                                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{s.title}</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#10b981' }}>₹{s.amount.toLocaleString()}</TableCell>
                                                <TableCell sx={{ color: '#64748b' }}>{new Date(s.deadline).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip label={s.educationLevel} size="small" sx={{ background: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 700 }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            setSelectedScholarshipId(s.id);
                                                            setTabValue(1);
                                                        }}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            borderColor: '#FA8231', color: '#FA8231',
                                                            textTransform: 'none', fontWeight: 700,
                                                            '&:hover': { background: 'rgba(250, 130, 49, 0.05)', borderColor: '#FA8231' }
                                                        }}
                                                    >
                                                        Applicants
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                        <FormControl sx={{ minWidth: 300 }}>
                            <InputLabel>Select Scholarship</InputLabel>
                            <Select
                                value={selectedScholarshipId}
                                label="Select Scholarship"
                                onChange={(e) => setSelectedScholarshipId(e.target.value)}
                                sx={{ borderRadius: '12px', bgcolor: 'white' }}
                            >
                                {scholarships.map((s) => (
                                    <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Chip
                            label={`${applications.length} Applications Total`}
                            sx={{ fontWeight: 800, background: '#f1f5f9', color: '#475569', fontSize: '1rem', py: 2.5, px: 1, borderRadius: '12px' }}
                        />
                    </Box>

                    <Paper sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Applicant</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Education Level</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Mobile Number</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {applications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                                                <Typography variant="h6" fontWeight={600}>No Applications Yet</Typography>
                                                <Typography variant="body2">Applications for this scholarship will appear here.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        applications.map((app) => (
                                            <TableRow key={app.id} hover>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b' }}>{app.applicant?.fullName || 'N/A'}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>{app.applicant?.email}</Typography>
                                                </TableCell>
                                                <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{(app.educationLevel as string) || 'N/A'}</TableCell>
                                                <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{(app.applicant?.mobileNumber as string) || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={app.status}
                                                        sx={{
                                                            fontWeight: 800,
                                                            bgcolor: app.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : app.status === 'REJECTED' ? 'rgba(2ef, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                            color: app.status === 'APPROVED' ? '#10b981' : app.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                                                            border: 'none'
                                                        }}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {app.status === 'PENDING' ? (
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                                                                sx={{ bgcolor: '#10b981', color: 'white', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                                sx={{ bgcolor: '#ef4444', color: 'white', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>Decision Final</Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default ScholarshipManager;
