import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

function getStoredAuth(): { token: string | null; user: User | null } {
    if (typeof window === 'undefined') return { token: null, user: null };
    try {
        const token = localStorage.getItem('auth_token');
        const userRaw = localStorage.getItem('auth_user');
        const user = userRaw ? JSON.parse(userRaw) : null;
        return { token, user };
    } catch {
        return { token: null, user: null };
    }
}

const stored = getStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.token,
    isAdmin: stored.user?.is_admin ?? false,
    setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isAdmin: user.is_admin });
    },
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
    },
    setUser: (user) => {
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, isAdmin: user.is_admin });
    },
}));
