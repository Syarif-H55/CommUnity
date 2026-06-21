import api from './api';
import { ApiResponse, Organization, OrganizationMember, OrganizationRegistrationRequest, OrganizationRole, DashboardStats } from '@/types';

export const organizationService = {
    list: () =>
        api.get<ApiResponse<Organization[]>>('/organizations'),

    getById: (id: string) =>
        api.get<ApiResponse<Organization>>(`/organizations/${id}`),

    register: (data: OrganizationRegistrationRequest) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        if (data.logo) {
            formData.append('logo', data.logo);
        }
        return api.post<ApiResponse<Organization>>('/organizations', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    update: (id: string, data: Partial<OrganizationRegistrationRequest>) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.logo) formData.append('logo', data.logo);
        formData.append('_method', 'PATCH');
        return api.post<ApiResponse<Organization>>(`/organizations/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    uploadDocument: (id: string, document: File) => {
        const formData = new FormData();
        formData.append('document', document);
        return api.post<ApiResponse<Organization>>(`/organizations/${id}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getMembers: (id: string) =>
        api.get<ApiResponse<OrganizationMember[]>>(`/organizations/${id}/members`),

    addMember: (id: string, data: { user_id: string; role: OrganizationRole }) =>
        api.post<ApiResponse<OrganizationMember>>(`/organizations/${id}/members`, data),

    updateMemberRole: (orgId: string, userId: string, role: OrganizationRole) =>
        api.patch<ApiResponse<OrganizationMember>>(`/organizations/${orgId}/members/${userId}`, { role }),

    removeMember: (orgId: string, userId: string) =>
        api.delete<ApiResponse<null>>(`/organizations/${orgId}/members/${userId}`),

    getDashboardStats: () =>
        api.get<ApiResponse<DashboardStats>>('/organizations/stats'),
};
