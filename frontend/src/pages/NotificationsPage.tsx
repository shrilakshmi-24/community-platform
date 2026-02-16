import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Divider, Chip, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = useCallback(async () => {
        try {
            const { data } = await client.get('/notifications');
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await client.put(`/notifications/${id}/read`);
            // Optimistic update
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark as read', error);
            fetchNotifications(); // Revert on error
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
                Notifications
            </Typography>

            <Paper elevation={2}>
                <List>
                    {notifications.length === 0 && (
                        <ListItem>
                            <ListItemText primary="No notifications" />
                        </ListItem>
                    )}
                    {notifications.map((notification, index) => (
                        <Box key={notification.id}>
                            <ListItem alignItems="flex-start"
                                sx={{
                                    bgcolor: notification.isRead ? 'background.paper' : 'action.hover'
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {!notification.isRead && <CircleIcon color="primary" sx={{ fontSize: 12 }} />}
                                            <Typography variant="subtitle1" component="span" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                                                {notification.title}
                                            </Typography>
                                            <Chip label={notification.type} size="small" variant="outlined" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.primary" component="span">
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                                {!notification.isRead && (
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="mark as read" onClick={() => handleMarkAsRead(notification.id)}>
                                            <CheckCircleIcon color="action" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                            {index < notifications.length - 1 && <Divider component="li" />}
                        </Box>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default NotificationsPage;
