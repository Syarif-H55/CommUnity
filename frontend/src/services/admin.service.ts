import api from './api';
import { ApiResponse, DashboardStats, Organization, User } from '@/types';

export const adminService = {
    getStats: () =>
        api.get<ApiResponse<DashboardStats>>('/admin/stats'),

    getOrganizations: (params?: { status?: string; per_page?: number; page?: number }) =>
        api.get<ApiResponse<Organization[]>>('/admin/organizations', { params }),

    getUsers: (params?: { search?: string; per_page?: number; page?: number }) =>
        api.get<ApiResponse<User[]>>('/admin/users', { params }),

    verifyOrganization: (id: string, data: { status: 'approved' | 'rejected'; rejection_reason?: string }) =>
        api.patch<ApiResponse<Organization>>(`/admin/organizations/${id}/verify`, data),
};
