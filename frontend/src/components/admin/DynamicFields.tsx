import React from 'react';
import { TextField, Grid, MenuItem, Typography, Checkbox, FormControlLabel, Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface DynamicFieldsProps {
    contentType: 'EVENT' | 'BUSINESS' | 'JOB' | 'SCHOLARSHIP' | 'ANNOUNCEMENT';
    formData: any;
    setFormData: (data: any) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    fileNames: { [key: string]: string };
}

const DynamicFields: React.FC<DynamicFieldsProps> = ({ contentType, formData, setFormData, handleFileChange, fileNames }) => {

    if (contentType === 'EVENT') {
        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" color="primary">Event Details</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Location / Venue" required
                        value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Google Map Link"
                        value={formData.googleMapLink} onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Start Date & Time" type="datetime-local" required
                        InputLabelProps={{ shrink: true }}
                        value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="End Date & Time" type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                </Grid>

                {/* Contact & Registration */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={<Checkbox checked={formData.registrationRequired} onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })} />}
                        label="Registration Required?"
                    />
                </Grid>
                {formData.registrationRequired && (
                    <>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth label="Registration Link"
                                value={formData.registrationLink} onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth label="Max Participants" type="number"
                                value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                            />
                        </Grid>
                    </>
                )}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth label="Contact Person"
                        value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth label="Contact Email"
                        value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth label="Contact Phone"
                        value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                </Grid>

                {/* Email Notification - Specific to Event */}
                <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                        control={<Checkbox checked={formData.sendNotification} onChange={(e) => setFormData({ ...formData, sendNotification: e.target.checked })} />}
                        label="Send Email Notification to All Members?"
                    />
                    {formData.sendNotification && (
                        <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2, mt: 1 }}>
                            <Typography variant="body2" color="error" gutterBottom>
                                Warning: This will send an email to ALL registered members.
                            </Typography>
                            <TextField
                                fullWidth label="Email Subject" sx={{ mb: 2 }} required
                                value={formData.emailSubject} onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
                            />
                            <TextField
                                fullWidth label="Custom Email Content (HTML supported)" multiline rows={4}
                                value={formData.emailContent} onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
                                placeholder="Leave empty to use default event template."
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        );
    }

    if (contentType === 'BUSINESS') {
        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" color="primary">Business Details</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Business Name" required
                        value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Owner Name"
                        value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Category" required select
                        value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {['Retail', 'Service', 'IT', 'Manufacturing', 'Food', 'Healthcare', 'Education', 'Other'].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Address" required
                        value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Working Hours"
                        value={formData.workingHours} onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                        placeholder="e.g. Mon-Fri 9AM-6PM"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Website"
                        value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Contact Phone"
                        value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Contact Email"
                        value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Business Logo
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="logo-upload"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'logo')}
                    />
                    <label htmlFor="logo-upload">
                        <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} fullWidth>
                            {fileNames['logo'] || "Upload Logo"}
                        </Button>
                    </label>
                </Grid>
            </Grid>
        );
    }

    if (contentType === 'JOB') {
        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" color="primary">Job / Career Details</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Job Title" required
                        value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Type" select required
                        value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <MenuItem value="SEEKING">Seeking Job</MenuItem>
                        <MenuItem value="HIRING">Hiring / Posting Job</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Company Name"
                        value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Location"
                        value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Salary Range"
                        value={formData.salaryRange} onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Employment Type"
                        value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        placeholder="Full-time, Part-time, Contract"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Experience Required"
                        value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="e.g. 2-5 years"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Application Link (External)"
                        value={formData.applicationLink} onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Application Deadline" type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.applicationDeadline} onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Contact Email"
                        value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                </Grid>
            </Grid>
        );
    }

    if (contentType === 'SCHOLARSHIP') {
        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" color="primary">Scholarship Details</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Provider Name"
                        value={formData.providerName} onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Amount" type="number" required
                        value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Education Level" required select
                        value={formData.educationLevel} onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    >
                        <MenuItem value="School">School</MenuItem>
                        <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                        <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                        <MenuItem value="PhD">PhD</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Deadline" type="date" required
                        InputLabelProps={{ shrink: true }}
                        value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth label="Eligibility Criteria" multiline rows={2}
                        value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                        placeholder="Who can apply?"
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth label="Required Documents" multiline rows={2}
                        value={formData.requiredDocuments} onChange={(e) => setFormData({ ...formData, requiredDocuments: e.target.value })}
                        placeholder="List of documents needed"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="External Application Link (Optional)"
                        value={formData.applicationLink} onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                        helperText="If provided, users will be redirected here."
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth label="Contact Email"
                        value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                </Grid>
            </Grid>
        );
    }

    // ANNOUNCEMENT has no special dynamic fields other than common
    return null;
};

export default DynamicFields;
