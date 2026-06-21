'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { OrganizationRegistrationRequest, OrganizationRole } from '@/types';

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

export function useAddMember(orgId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { user_id: string; role: OrganizationRole }) =>
            organizationService.addMember(orgId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations', orgId, 'members'] });
            queryClient.invalidateQueries({ queryKey: ['organizations', orgId] });
        },
    });
}

export function useUpdateMemberRole(orgId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: OrganizationRole }) =>
            organizationService.updateMemberRole(orgId, userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations', orgId, 'members'] });
        },
    });
}

export function useRemoveMember(orgId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) =>
            organizationService.removeMember(orgId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations', orgId, 'members'] });
            queryClient.invalidateQueries({ queryKey: ['organizations', orgId] });
        },
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
