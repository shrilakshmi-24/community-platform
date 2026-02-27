import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';
import type { UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
    /** If set, user must have at least this role level */
    minRole?: UserRole;
    /** If set, user must have one of these exact roles */
    allowedRoles?: UserRole[];
    /** Where to redirect if not authenticated (default: /login) */
    redirectTo?: string;
}

const ProtectedRoute = ({
    children,
    minRole,
    allowedRoles,
    redirectTo = '/login',
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, hasMinRole, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Minimum role check
    if (minRole && !hasMinRole(minRole)) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
                <Typography variant="h4" fontWeight={800} color="#0f172a">Access Denied</Typography>
                <Typography variant="body1" color="#64748b">
                    You don't have permission to view this page.
                </Typography>
            </Box>
        );
    }

    // Exact role check
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
                <Typography variant="h4" fontWeight={800} color="#0f172a">Access Denied</Typography>
                <Typography variant="body1" color="#64748b">
                    You don't have permission to view this page.
                </Typography>
            </Box>
        );
    }

    return children;
};

export default ProtectedRoute;
