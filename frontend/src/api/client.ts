
import axios from 'axios';

// In production on Vercel, we always want to use the relative '/api' 
// so it matches the exact domain the user is on (avoiding CORS issues).
// In development, we use VITE_API_URL (e.g., http://localhost:5000/api).
const isProd = import.meta.env.PROD;
const baseURL = isProd ? '/api' : (import.meta.env.VITE_API_URL || '/api');

const client = axios.create({
    baseURL,
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
