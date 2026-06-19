'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { OrganizationRegistrationRequest } from '@/types';

export function useOrganizations() {
    return useQuery({
        queryKey: ['organizations'],
        queryFn: async () => {
            const response = await organizationService.list();
            return response.data.data ?? [];
        },
    });
}

export function useOrganization(id: string) {
    return useQuery({
        queryKey: ['organizations', id],
        queryFn: async () => {
            const response = await organizationService.getById(id);
            return response.data.data!;
        },
        enabled: !!id,
    });
}

export function useRegisterOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: OrganizationRegistrationRequest) =>
            organizationService.register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
}

export function useUpdateOrganization(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<OrganizationRegistrationRequest>) =>
            organizationService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations', id] });
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
}

export function useUploadDocument(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (document: File) =>
            organizationService.uploadDocument(id, document),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations', id] });
        },
    });
}

export function useOrganizationMembers(id: string) {
    return useQuery({
        queryKey: ['organizations', id, 'members'],
        queryFn: async () => {
            const response = await organizationService.getMembers(id);
            return response.data.data ?? [];
        },
        enabled: !!id,
    });
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ['organizations', 'stats'],
        queryFn: async () => {
            const response = await organizationService.getDashboardStats();
            return response.data.data!;
        },
    });
}
