
import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import { Container, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, Divider, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ShareIcon from '@mui/icons-material/Share';

interface BusinessListing {
    id: string;
    businessName: string;
    category: string;
    description: string;
    address: string;
    contactPhone: string;
    website: string;
    status: string;
    user?: {
        profile?: {
            fullName?: string;
            email?: string;
        };
    };
    [key: string]: unknown;
}

const BusinessList = () => {
    const [listings, setListings] = useState<BusinessListing[]>([]);
    const [openProxy, setOpenProxy] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        description: '',
        address: '',
        contactPhone: '',
        website: ''
    });
    const { user } = useAuth();

    const fetchListings = useCallback(async () => {
        try {
            const { data } = await client.get('/business/all');
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
            await client.post('/business/create', formData);
            setOpenProxy(false);
            // Optionally fetch listings again or wait for approval
            alert('Listing submitted for approval');
        } catch (error) {
            console.error('Failed to create listing', error);
        }
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Business Directory
                </Typography>
                {user && (
                    <Button variant="contained" onClick={() => setOpenProxy(true)}>
                        List Your Business
                    </Button>
                )}
            </Box>

            <Grid container spacing={4}>
                {listings.map((listing) => (
                    <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {listing.businessName}
                                </Typography>
                                <Chip
                                    label={listing.category}
                                    size="small"
                                    color="primary"
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="body1" paragraph>
                                    {listing.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    📍 {listing.address}
                                </Typography>

                                {/* Owner Contact Information */}
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Contact Information
                                </Typography>

                                {listing.user?.profile?.fullName && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <PersonIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {listing.user.profile.fullName}
                                        </Typography>
                                    </Box>
                                )}

                                {listing.user?.profile?.email && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <EmailIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <a href={`mailto:${listing.user.profile.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {listing.user.profile.email}
                                            </a>
                                        </Typography>
                                    </Box>
                                )}

                                {listing.contactPhone && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <PhoneIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <a href={`tel:${listing.contactPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {listing.contactPhone}
                                            </a>
                                        </Typography>
                                    </Box>
                                )}

                                {/* Action Buttons */}
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    {listing.website && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            href={listing.website}
                                            target="_blank"
                                            fullWidth
                                        >
                                            Visit Website
                                        </Button>
                                    )}
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<ShareIcon />}
                                        fullWidth
                                        onClick={() => {
                                            const shareData = {
                                                title: listing.businessName,
                                                text: `${listing.businessName}\n${listing.description}\nPhone: ${listing.contactPhone}`,
                                                url: window.location.href
                                            };
                                            if (navigator.share) {
                                                navigator.share(shareData).catch(console.error);
                                            } else {
                                                navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
                                                alert('Business details copied to clipboard!');
                                            }
                                        }}
                                    >
                                        Share
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Listing Dialog */}
            <Dialog open={openProxy} onClose={() => setOpenProxy(false)}>
                <DialogTitle>Add Business Listing</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Business Name"
                        fullWidth
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        label="Address"
                        fullWidth
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Contact Phone"
                        fullWidth
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Website"
                        fullWidth
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProxy(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
};

export default BusinessList;
