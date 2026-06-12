import api from './api';
import { ApiResponse, User } from '@/types';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    full_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authService = {
    register: (data: RegisterRequest) =>
        api.post<ApiResponse<AuthResponse>>('/auth/register', data),

    login: (data: LoginRequest) =>
        api.post<ApiResponse<AuthResponse>>('/auth/login', data),

    logout: () =>
        api.post<ApiResponse>('/auth/logout'),

    forgotPassword: (email: string) =>
        api.post<ApiResponse>('/auth/forgot-password', { email }),

    resetPassword: (data: { email: string; token: string; password: string; password_confirmation: string }) =>
        api.post<ApiResponse>('/auth/reset-password', data),

    getProfile: () =>
        api.get<ApiResponse<User>>('/profile'),

    updateProfile: (data: Partial<User>) =>
        api.patch<ApiResponse<User>>('/profile', data),

    uploadPhoto: (formData: FormData) =>
        api.post<ApiResponse<{ profile_photo_url: string }>>('/profile/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};
