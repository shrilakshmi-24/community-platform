import { Container, Typography, Box, Button, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const EducationLoanPage = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, color: '#8B2635', mb: 2 }} />
                <Typography variant="h4" gutterBottom color="#8B2635" fontWeight="bold">
                    Education Loan Assistance
                </Typography>
                <Typography variant="body1" paragraph>
                    We provide guidance and assistance for students seeking education loans to pursue higher studies.
                    Our community partners with various financial institutions to offer competitive interest rates.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Coming Soon!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        We are currently finalizing partnerships with banks. Please check back later for application details.
                    </Typography>
                </Box>
                <Button variant="contained" sx={{ mt: 3, bgcolor: '#8B2635' }} onClick={() => window.history.back()}>
                    Go Back
                </Button>
            </Paper>
        </Container>
    );
};

export default EducationLoanPage;
