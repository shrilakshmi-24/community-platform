
import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;
