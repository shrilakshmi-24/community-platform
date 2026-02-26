import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, Chip, FormControl, InputLabel, Select, MenuItem, Avatar, Alert } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import client from '../../api/client';
import { toast } from 'react-hot-toast';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

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
        p: { xs: 3, md: 4 },
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
    };

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                    <SchoolIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Scholarship & Aid Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Manage funding, applications, and support for students
                    </Typography>
                </Box>
            </Box>

            <Box sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 4,
                bgcolor: 'white',
                borderRadius: '16px 16px 0 0',
                px: 2,
                pt: 1
            }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, val) => setTabValue(val)}
                    sx={{
                        '& .MuiTabs-indicator': {
                            background: BRAND_GRADIENT,
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        },
                        '& .MuiTab-root': {
                            fontWeight: 700,
                            textTransform: 'none',
                            fontSize: '1rem',
                            color: '#64748b',
                            minWidth: 120,
                            '&.Mui-selected': {
                                color: '#E62A4D'
                            }
                        }
                    }}
                >
                    <Tab label="Create & Manage" />
                    <Tab label="Review Applications" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper sx={{ ...paperSx }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: BRAND_GRADIENT }} />
                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b', mb: 3 }}>
                                Create New Scholarship
                            </Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    label="Scholarship Title"
                                    fullWidth
                                    value={newScholarship.title}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                                    sx={textFieldSx}
                                />
                                <TextField
                                    label="Amount (₹)"
                                    type="number"
                                    fullWidth
                                    value={newScholarship.amount}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, amount: e.target.value })}
                                    sx={textFieldSx}
                                />
                                <FormControl fullWidth sx={textFieldSx}>
                                    <InputLabel sx={{ fontWeight: 600 }}>Education Level</InputLabel>
                                    <Select
                                        value={newScholarship.educationLevel}
                                        label="Education Level"
                                        onChange={(e) => setNewScholarship({ ...newScholarship, educationLevel: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
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
                                    sx={textFieldSx}
                                />
                                <TextField
                                    label="Description"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={newScholarship.description}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
                                    sx={textFieldSx}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleCreate}
                                    sx={{
                                        mt: 1, py: 1.5, borderRadius: '12px',
                                        background: BRAND_GRADIENT,
                                        boxShadow: '0 8px 20px -6px rgba(230,42,77,0.4)',
                                        fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px -6px rgba(230,42,77,0.5)' },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Publish Scholarship
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper sx={{ ...paperSx, p: 0 }}>
                            <Box sx={{ p: { xs: 3, md: 4 }, pb: 2 }}>
                                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b' }}>
                                    Active Scholarships
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Title</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Deadline</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Level</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {scholarships.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                                                    <SchoolIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1 }} />
                                                    <Typography variant="body1" fontWeight={600} sx={{ color: '#64748b' }}>No active scholarships</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            scholarships.map((s) => (
                                                <TableRow key={s.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{s.title}</TableCell>
                                                    <TableCell sx={{ fontWeight: 800, color: '#10b981' }}>₹{s.amount.toLocaleString()}</TableCell>
                                                    <TableCell sx={{ color: '#64748b', fontWeight: 500 }}>{new Date(s.deadline).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Chip label={s.educationLevel} size="small" sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', fontWeight: 700, borderRadius: '6px' }} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setSelectedScholarshipId(s.id);
                                                                setTabValue(1);
                                                            }}
                                                            sx={{
                                                                borderRadius: '8px',
                                                                borderColor: '#e2e8f0', color: '#E62A4D',
                                                                textTransform: 'none', fontWeight: 700,
                                                                '&:hover': { bgcolor: BRAND_GRADIENT_LIGHT, borderColor: '#FA8231' }
                                                            }}
                                                        >
                                                            Applicants
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
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
                        <FormControl sx={{ minWidth: 300, bgcolor: 'white', borderRadius: '12px' }}>
                            <InputLabel sx={{ fontWeight: 600 }}>Select Scholarship</InputLabel>
                            <Select
                                value={selectedScholarshipId}
                                label="Select Scholarship"
                                onChange={(e) => setSelectedScholarshipId(e.target.value)}
                                sx={{
                                    borderRadius: '12px',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                                }}
                            >
                                {scholarships.map((s) => (
                                    <MenuItem key={s.id} value={s.id} sx={{ fontWeight: 600 }}>{s.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Chip
                            label={`${applications.length} Applications Total`}
                            sx={{ fontWeight: 800, bgcolor: 'white', color: '#E62A4D', border: '1px solid #e2e8f0', fontSize: '0.95rem', py: 2.5, px: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
                        />
                    </Box>

                    <Paper sx={{ ...paperSx, p: 0 }}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Applicant</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Education Level</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Mobile Number</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Status</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0', py: 2 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {applications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                                <Alert icon={false} severity="info" sx={{ width: 'fit-content', mx: 'auto', borderRadius: '12px', fontWeight: 600 }}>
                                                    No applications available for this scholarship yet.
                                                </Alert>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        applications.map((app) => (
                                            <TableRow key={app.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: BRAND_GRADIENT_LIGHT, color: '#E62A4D', width: 36, height: 36, fontWeight: 700 }}>
                                                            {(app.applicant?.fullName || 'N').charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>{app.applicant?.fullName || 'N/A'}</Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>{app.applicant?.email}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ color: '#475569', fontWeight: 600 }}>{(app.educationLevel as string) || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                                                        {(app.applicant?.mobileNumber as string) || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={app.status}
                                                        sx={{
                                                            fontWeight: 800,
                                                            bgcolor: app.status === 'APPROVED' ? '#ecfdf5' : app.status === 'REJECTED' ? '#fef2f2' : '#fffbeb',
                                                            color: app.status === 'APPROVED' ? '#10b981' : app.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                                                            borderRadius: '6px'
                                                        }}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    {app.status === 'PENDING' ? (
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
                                                                variant="outlined"
                                                                onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                                sx={{ borderColor: '#fca5a5', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' }, textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 600 }}>Decision Final</Typography>
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
