import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const SessionHandler = () => {
    const { logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
            showToast('Session expired. Please login again.', 'error');
            navigate('/admin/login'); // Or just /login, but user was likely admin if 401 on admin action
            // Actually, better to redirect to /login and let them choose, or detect current path.
            // For now, let's redirect to home or login.
            // If it's an admin app mostly, /admin/login is safer if they were in admin.
            // But we have public login too.
            // Let's check current path? No, keep it simple: /login
            // Wait, this is a general handler.
            navigate('/login');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [logout, showToast, navigate]);

    return null;
};

export default SessionHandler;
