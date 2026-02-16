import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import client from '../api/client';

/* eslint-disable react-refresh/only-export-components */

interface User {
    userId: string;
    role: string;
    description: string;
    status: string;
    // Add other fields from token if needed
}

interface DecodedToken {
    userId: string;
    role: string;
    status: string;
    [key: string]: unknown;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestOtp: (mobileNumber: string) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verifyOtp: (mobileNumber: string, otp: string) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode<DecodedToken>(storedToken);
                // eslint-disable-next-line
                setToken(storedToken);
                setUser({
                    userId: decoded.userId,
                    role: decoded.role,
                    description: '', // Assuming description is not in token or needs to be fetched
                    status: decoded.status,
                });
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
        console.log('AuthProvider finished loading');
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        try {
            const decoded = jwtDecode<DecodedToken>(newToken);
            setUser({
                userId: decoded.userId,
                role: decoded.role,
                description: '',
                status: decoded.status,
            });
        } catch (error) {
            console.error('Invalid token during login:', error);
        }
    };

    const requestOtp = async (mobileNumber: string) => {
        await client.post('/auth/login', { mobileNumber });
    };

    const verifyOtp = async (mobileNumber: string, otp: string) => {
        const { data } = await client.post('/auth/verify-otp', { mobileNumber, otp });
        const { accessToken, user } = data;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setUser(user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, requestOtp, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
