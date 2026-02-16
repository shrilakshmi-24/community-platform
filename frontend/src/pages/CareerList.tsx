
import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import { Container, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface CareerListing {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    status: string;
    salaryRange?: string;
    [key: string]: unknown;
}

const CareerList = () => {
    const [listings, setListings] = useState<CareerListing[]>([]);
    const [openProxy, setOpenProxy] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'HIRING',
        description: '',
        company: '',
        location: '',
        salaryRange: ''
    });
    const { user } = useAuth();

    const fetchListings = useCallback(async () => {
        try {
            const { data } = await client.get('/careers/all');
            setListings(data.listings);
        } catch (error) {
            console.error('Failed to fetch listings', error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line
        fetchListings();
    }, [fetchListings]);

    const handleCreate = async () => {
        try {
            await client.post('/career/create', formData);
            setOpenProxy(false);
            alert('Listing submitted for approval');
        } catch (error) {
            console.error('Failed to create listing', error);
        }
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Career Portal
                </Typography>
                {user && (
                    <Button variant="contained" onClick={() => setOpenProxy(true)}>
                        Post a Job
                    </Button>
                )}
            </Box>

            <Grid container spacing={4}>
                {listings.map((listing) => (
                    <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {listing.title}
                                    </Typography>
                                    <Chip label={listing.type} color={listing.type === 'HIRING' ? 'primary' : 'secondary'} size="small" />
                                </Box>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {listing.company}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {listing.location}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {listing.description}
                                </Typography>
                                {listing.salaryRange && (
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Salary: {listing.salaryRange}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Listing Dialog */}
            <Dialog open={openProxy} onClose={() => setOpenProxy(false)}>
                <DialogTitle>Post a Job / Opportunity</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Job Title"
                        fullWidth
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={formData.type}
                            label="Type"
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <MenuItem value="HIRING">Hiring</MenuItem>
                            <MenuItem value="SEEKING">Seeking Job</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Company Name"
                        fullWidth
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Salary Range"
                        fullWidth
                        value={formData.salaryRange}
                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProxy(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CareerList;
