import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AdminDashboardLayout = () => {
    return (
        <Box>
            <Typography variant="h5">Admin Dashboard Layout (Restored)</Typography>
            <Outlet />
        </Box>
    );
};

export default AdminDashboardLayout;
