import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import client from '../../api/client';

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
            // Fetch scholarships to populate dropdown for applications view
            // In a real app we might reuse the same list or fetch specific endpoint
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
            alert('Scholarship created successfully');
            setNewScholarship({ title: '', description: '', amount: '', deadline: '', educationLevel: 'Undergraduate' });
            fetchScholarships(); // Refresh
        } catch (error) {
            console.error('Error creating scholarship', error);
            alert('Failed to create scholarship');
        }
    };

    const handleStatusUpdate = async (appId: string, status: string) => {
        try {
            await client.post(`/admin/scholarships/applications/${appId}/status`, { status });
            // Refresh applications
            fetchApplications(selectedScholarshipId);
        } catch (error) {
            console.error('Error updating status', error);
            alert('Failed to update status');
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Scholarship & Aid Management</Typography>

            <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Create & Manage" />
                <Tab label="Review Applications" />
            </Tabs>

            {tabValue === 0 && (
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Create New Scholarship</Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Scholarship Title"
                                    fullWidth
                                    value={newScholarship.title}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                                />
                                <TextField
                                    label="Amount (₹)"
                                    type="number"
                                    fullWidth
                                    value={newScholarship.amount}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, amount: e.target.value })}
                                />
                                <TextField
                                    label="Description"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={newScholarship.description}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Education Level</InputLabel>
                                    <Select
                                        value={newScholarship.educationLevel}
                                        label="Education Level"
                                        onChange={(e) => setNewScholarship({ ...newScholarship, educationLevel: e.target.value })}
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
                                />
                                <Button variant="contained" onClick={handleCreate} sx={{ mt: 1 }}>
                                    Publish Scholarship
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Active Scholarships</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Deadline</TableCell>
                                            <TableCell>Level</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {scholarships.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell>{s.title}</TableCell>
                                                <TableCell>₹{s.amount.toLocaleString()}</TableCell>
                                                <TableCell>{new Date(s.deadline).toLocaleDateString()}</TableCell>
                                                <TableCell>{s.educationLevel}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            setSelectedScholarshipId(s.id);
                                                            setTabValue(1);
                                                        }}
                                                    >
                                                        View Applicants
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
                    <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
                        <InputLabel>Select Scholarship</InputLabel>
                        <Select
                            value={selectedScholarshipId}
                            label="Select Scholarship"
                            onChange={(e) => setSelectedScholarshipId(e.target.value)}
                        >
                            {scholarships.map((s) => (
                                <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Applicant Name</TableCell>
                                    <TableCell>Education Level</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No applications found for this scholarship.</TableCell>
                                    </TableRow>
                                ) : (
                                    applications.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell>
                                                <Typography variant="subtitle2">{app.applicant?.fullName || 'N/A'}</Typography>
                                                <Typography variant="caption" color="textSecondary">{app.applicant?.email}</Typography>
                                            </TableCell>
                                            <TableCell>{(app.educationLevel as string) || 'N/A'}</TableCell>
                                            <TableCell>{(app.applicant?.mobileNumber as string) || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={app.status}
                                                    color={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'error' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {app.status === 'PENDING' && (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button size="small" variant="contained" color="success" onClick={() => handleStatusUpdate(app.id, 'APPROVED')}>
                                                            Accept
                                                        </Button>
                                                        <Button size="small" variant="outlined" color="error" onClick={() => handleStatusUpdate(app.id, 'REJECTED')}>
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    );
};

export default ScholarshipManager;
