import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import client from '../api/client';

/* eslint-disable react-refresh/only-export-components */

// ── Role hierarchy ──────────────────────────────────────────────────────────
export type UserRole = 'GUEST' | 'MEMBER' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN';
export const ROLE_LEVELS: Record<UserRole, number> = {
    GUEST: 0,
    MEMBER: 1,
    MENTOR: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4,
};

// ── Types ───────────────────────────────────────────────────────────────────
interface User {
    userId: string;
    role: UserRole;
    status: string;
    isBusinessOwner?: boolean;
    profile?: {
        fullName?: string;
        avatarUrl?: string;
        email?: string;
    };
}

interface DecodedToken {
    userId: string;
    role: UserRole;
    status: string;
    isBusinessOwner?: boolean;
    [key: string]: unknown;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Role checks
    isSuperAdmin: boolean;
    isAdmin: boolean;           // true for both ADMIN and SUPER_ADMIN
    isMember: boolean;          // true for MEMBER, MENTOR, ADMIN, SUPER_ADMIN
    isVerifiedMember: boolean;  // true only if status === 'ACTIVE'
    isGuest: boolean;

    hasMinRole: (minRole: UserRole) => boolean;

    login: (token: string) => void;
    adminLoginWithToken: (token: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestOtp: (mobileNumber: string) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verifyOtp: (mobileNumber: string, otp: string) => Promise<any>;
    logout: () => void;
}

// ── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeUser = (token: string): User | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return {
            userId: decoded.userId,
            role: decoded.role,
            status: decoded.status || 'ACTIVE',
            isBusinessOwner: decoded.isBusinessOwner,
        };
    } catch {
        return null;
    }
};

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decoded = decodeUser(storedToken);
            if (decoded) {
                setToken(storedToken);
                setUser(decoded);
            } else {
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    // ── Role helpers ──────────────────────────────────────────────────────
    const hasMinRole = (minRole: UserRole) => {
        if (!user) return false;
        return (ROLE_LEVELS[user.role] ?? 0) >= (ROLE_LEVELS[minRole] ?? 0);
    };

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    const isMember = hasMinRole('MEMBER');
    const isVerifiedMember = isMember && user?.status === 'ACTIVE';
    const isGuest = !user || user.role === 'GUEST';

    // ── Auth actions ──────────────────────────────────────────────────────
    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decoded = decodeUser(newToken);
        if (decoded) setUser(decoded);
    };

    // Alias for admin login — same mechanics, just signals it came from admin route
    const adminLoginWithToken = (newToken: string) => {
        login(newToken);
    };

    const requestOtp = async (mobileNumber: string) => {
        return await client.post('/auth/login', { mobileNumber });
    };

    const verifyOtp = async (mobileNumber: string, otp: string) => {
        const { data } = await client.post('/auth/verify-otp', { mobileNumber, otp });
        const { accessToken } = data;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        const decoded = decodeUser(accessToken);
        if (decoded) setUser(decoded);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            user, token, isAuthenticated: !!user, isLoading,
            isSuperAdmin, isAdmin, isMember, isVerifiedMember, isGuest,
            hasMinRole,
            login, adminLoginWithToken, requestOtp, verifyOtp, logout,
        }}>
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
