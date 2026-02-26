import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Button, Chip, CircularProgress, Alert, MenuItem, FormControl, Select, InputLabel, Divider } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import client from '../../api/client';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ShieldIcon from '@mui/icons-material/Shield';

const BRAND_GRADIENT = 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)';
const BRAND_GRADIENT_LIGHT = 'linear-gradient(135deg, rgba(250, 130, 49, 0.08) 0%, rgba(230, 42, 77, 0.08) 100%)';

interface User {
    id: string;
    email: string;
    profile?: {
        fullName?: string;
    };
    [key: string]: unknown;
}

const ContentModeration = () => {
    const [tabValue, setTabValue] = useState(0);
    const [content, setContent] = useState<{ business: unknown[]; career: unknown[]; events: unknown[]; services: unknown[] }>({ business: [], career: [], events: [], services: [] });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await client.get(`/admin/content?status=${statusFilter}`);
            setContent(data);
        } catch (error) {
            console.error('Failed to fetch content', error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]); // statusFilter is in fetchContent dependency

    const handleApprove = async (type: string, id: string, status: string) => {
        try {
            await client.post('/admin/content/approve', { type, id, status });
            fetchContent();
        } catch {
            alert('Failed to update content status');
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatusFilter(event.target.value as string);
    };

    interface ContentItem {
        id: string;
        title?: string;
        businessName?: string;
        subject?: string;
        status: string;
        description?: string;
        details?: string;
        company?: string;
        location?: string;
        date?: string;
        user?: User;
        organizer?: User;
        [key: string]: unknown;
    }

    const ListingCard = ({ item, type }: { item: ContentItem, type: string }) => {
        const isPending = item.status === 'PENDING';
        const isApproved = item.status === 'APPROVED';

        return (
            <Card sx={{
                mb: 3,
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    borderColor: isPending ? '#fbbf24' : isApproved ? '#34d399' : '#f87171'
                }
            }}>
                <Box sx={{
                    height: '4px',
                    width: '100%',
                    background: isPending ? '#fbbf24' : isApproved ? '#34d399' : '#f87171'
                }} />
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a' }}>
                                    {item.title || item.businessName || item.subject}
                                </Typography>
                                {isPending && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fbbf24' }} />}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip
                                    label={item.status}
                                    size="small"
                                    sx={{
                                        fontWeight: 700,
                                        borderRadius: '6px',
                                        bgcolor: isPending ? '#fffbeb' : isApproved ? '#ecfdf5' : '#fef2f2',
                                        color: isPending ? '#d97706' : isApproved ? '#059669' : '#dc2626'
                                    }}
                                />
                                <Chip
                                    label={type.toUpperCase()}
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#64748b',
                                        bgcolor: '#f1f5f9',
                                        borderRadius: '6px'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '12px', mb: 3, border: '1px solid #f1f5f9' }}>
                        <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                            <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>Submitted by:</Box> {item.user?.profile?.fullName || item.organizer?.profile?.fullName || 'Unknown'}
                        </Typography>
                        <Divider sx={{ my: 1, borderColor: '#e2e8f0' }} />
                        <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.6 }}>
                            {item.description || item.details}
                        </Typography>

                        {(item.company || item.location || item.date) && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2, pt: 2, borderTop: '1px dashed #cbd5e1' }}>
                                {item.company && <Typography variant="body2" sx={{ color: '#475569' }}><strong>Company:</strong> {item.company}</Typography>}
                                {item.location && <Typography variant="body2" sx={{ color: '#475569' }}><strong>Location:</strong> {item.location}</Typography>}
                                {item.date && <Typography variant="body2" sx={{ color: '#475569' }}><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</Typography>}
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {(item.status === 'PENDING' || item.status === 'REJECTED') && (
                            <Button
                                variant="contained"
                                onClick={() => handleApprove(type, item.id, 'APPROVED')}
                                sx={{
                                    bgcolor: '#10b981',
                                    color: 'white',
                                    fontWeight: 700,
                                    px: 3,
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: '#059669' },
                                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                Approve
                            </Button>
                        )}
                        {(item.status === 'PENDING' || item.status === 'APPROVED') && (
                            <Button
                                variant="outlined"
                                onClick={() => handleApprove(type, item.id, 'REJECTED')}
                                sx={{
                                    color: '#ef4444',
                                    borderColor: '#fca5a5',
                                    fontWeight: 700,
                                    px: 3,
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' }
                                }}
                            >
                                Reject
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, background: BRAND_GRADIENT_LIGHT, borderRadius: '10px' }}>
                        <ShieldIcon sx={{ color: '#E62A4D', fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                            Content Moderation
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Review and approve community posts
                        </Typography>
                    </Box>
                </Box>

                <FormControl sx={{ minWidth: 200, bgcolor: 'white', borderRadius: '12px' }}>
                    <InputLabel id="status-filter-label" sx={{ fontWeight: 600 }}>Filter Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        value={statusFilter}
                        label="Filter Status"
                        onChange={handleStatusChange}
                        sx={{
                            borderRadius: '12px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                        }}
                    >
                        <MenuItem value="ALL" sx={{ fontWeight: 600 }}>All Content</MenuItem>
                        <MenuItem value="PENDING" sx={{ fontWeight: 600 }}>Pending Review</MenuItem>
                        <MenuItem value="APPROVED" sx={{ fontWeight: 600, color: '#10b981' }}>Approved</MenuItem>
                        <MenuItem value="REJECTED" sx={{ fontWeight: 600, color: '#ef4444' }}>Rejected</MenuItem>
                    </Select>
                </FormControl>
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
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
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
                    <Tab icon={<BusinessCenterIcon sx={{ mb: 0.5 }} />} iconPosition="start" label={`Business (${content.business.length})`} />
                    <Tab icon={<WorkIcon sx={{ mb: 0.5 }} />} iconPosition="start" label={`Career (${content.career.length})`} />
                    <Tab icon={<EventIcon sx={{ mb: 0.5 }} />} iconPosition="start" label={`Events (${content.events.length})`} />
                    <Tab icon={<VolunteerActivismIcon sx={{ mb: 0.5 }} />} iconPosition="start" label={`Services (${content.services.length})`} />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#E62A4D' }} /></Box>
            ) : (
                <Box sx={{ mt: 2 }}>
                    {tabValue === 0 && (
                        <Box>
                            {content.business.length === 0 ? (
                                <Alert severity="info" sx={{ borderRadius: '12px' }}>No business listings found for the current filter.</Alert>
                            ) : (
                                content.business.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="business" />)
                            )}
                        </Box>
                    )}
                    {tabValue === 1 && (
                        <Box>
                            {content.career.length === 0 ? (
                                <Alert severity="info" sx={{ borderRadius: '12px' }}>No career listings found for the current filter.</Alert>
                            ) : (
                                content.career.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="career" />)
                            )}
                        </Box>
                    )}
                    {tabValue === 2 && (
                        <Box>
                            {content.events.length === 0 ? (
                                <Alert severity="info" sx={{ borderRadius: '12px' }}>No events found for the current filter.</Alert>
                            ) : (
                                content.events.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="event" />)
                            )}
                        </Box>
                    )}
                    {tabValue === 3 && (
                        <Box>
                            {content.services.length === 0 ? (
                                <Alert severity="info" sx={{ borderRadius: '12px' }}>No service requests found for the current filter.</Alert>
                            ) : (
                                content.services.map((item: unknown) => <ListingCard key={(item as ContentItem).id} item={item as ContentItem} type="service" />)
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ContentModeration;
