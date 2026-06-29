'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import type { Organization } from '@/types';

export function useAdminStats() {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const response = await adminService.getStats();
            return response.data.data!;
        },
    });
}

export function useAdminOrganizations(params?: { status?: string; per_page?: number; page?: number }) {
    return useQuery({
        queryKey: ['admin', 'organizations', params],
        queryFn: async () => {
            const response = await adminService.getOrganizations(params);
            const body = response.data as any;
            return {
                data: body.data ?? [],
                total: body.meta?.total ?? 0,
                per_page: body.meta?.per_page ?? 10,
                current_page: body.meta?.current_page ?? 1,
                last_page: body.meta?.last_page ?? 1,
            };
        },
        retry: 1,
    });
}

export function useAdminUsers(params?: { search?: string; per_page?: number; page?: number }) {
    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: async () => {
            const response = await adminService.getUsers(params);
            return response.data;
        },
    });
}

export function useVerifyOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { status: 'approved' | 'rejected'; rejection_reason?: string } }) =>
            adminService.verifyOrganization(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'organizations'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
}
