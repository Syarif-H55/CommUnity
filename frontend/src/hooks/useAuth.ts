'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginRequest, RegisterRequest } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

export function useLogin() {
    const setAuth = useAuthStore((state) => state.setAuth);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: (response) => {
            const { user, token } = response.data.data!;
            setAuth(user, token);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

export function useRegister() {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: (response) => {
            const { user, token } = response.data.data!;
            setAuth(user, token);
        },
    });
}

export function useLogout() {
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            logout();
            router.push('/login');
        },
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: (data: {
            email: string;
            token: string;
            password: string;
            password_confirmation: string;
        }) => authService.resetPassword(data),
    });
}

export function useProfile() {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await authService.getProfile();
            return response.data.data!;
        },
        enabled: !!token,
    });
}
