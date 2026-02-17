import React from 'react';
import { TextField, Grid, MenuItem, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface CommonFieldsProps {
    formData: any;
    setFormData: (data: any) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    fileNames: { [key: string]: string };
}

const CommonFields: React.FC<CommonFieldsProps> = ({ formData, setFormData, handleFileChange, fileNames }) => {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                    Basic Information
                </Typography>
            </Grid>

            {/* Title */}
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Title / Name"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
            </Grid>

            {/* Short Description */}
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Short Description (for lists/cards)"
                    required
                    multiline
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    helperText="A brief summary that appears in previews."
                />
            </Grid>

            {/* Content Type is handled by parent Tabs, but could be specific here if needed */}

            {/* Detailed Description */}
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Detailed Description"
                    required
                    multiline
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    helperText="Full details. markdown supported."
                />
            </Grid>

            {/* Common File Uploads (Cover Image) */}
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Cover Image / Media
                </Typography>
                <input
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    id="cover-image-upload"
                    type="file"
                    onChange={(e) => handleFileChange(e, 'media')}
                />
                <label htmlFor="cover-image-upload">
                    <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} fullWidth>
                        {fileNames['media'] || "Upload Cover Media"}
                    </Button>
                </label>
            </Grid>

            {/* Visibility & Publish Dates */}
            <Grid size={{ xs: 12 }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Publishing Settings
                </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="Visibility"
                    select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                >
                    <MenuItem value="ALL_MEMBERS">All Members</MenuItem>
                    <MenuItem value="GROUP_ONLY">Group Only</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="Publish Date"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="Expiry Date"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
            </Grid>

        </Grid>
    );
};

export default CommonFields;
