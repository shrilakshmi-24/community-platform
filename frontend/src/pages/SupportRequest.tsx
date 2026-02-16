
import React, { useState } from 'react';
import client from '../api/client';
import { Container, Typography, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useToast } from '../context/ToastContext';

const SupportRequest = () => {
    const [formData, setFormData] = useState({
        type: '',
        subject: '',
        details: ''
    });
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/support/create', formData);
            showToast('Support request submitted successfully. We will contact you soon.', 'success');
            setFormData({ type: '', subject: '', details: '' });
        } catch {
            showToast('Failed to submit request', 'error');
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Request Support
                </Typography>
                <Typography variant="body1" paragraph>
                    Get help from the community experts.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Support Type</InputLabel>
                        <Select
                            value={formData.type}
                            label="Support Type"
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <MenuItem value="OVERSEAS">Overseas Support</MenuItem>
                            <MenuItem value="FINANCIAL">Financial Guidance</MenuItem>
                            <MenuItem value="GUIDANCE">General Guidance</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        multiline
                        rows={6}
                        label="Details"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Submit Request
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default SupportRequest;
