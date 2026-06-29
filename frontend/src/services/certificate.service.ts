import api from './api';
import type { ApiResponse, Certificate, PaginatedResponse } from '@/types';

export const certificateService = {
    getMyCertificates: (params?: { per_page?: number }) =>
        api.get<ApiResponse<Certificate[]> & { pagination: PaginatedResponse<Certificate>['current_page'] }>('/certificates', { params }),

    getCertificate: (id: string) =>
        api.get<ApiResponse<Certificate>>(`/certificates/${id}`),

    downloadCertificate: (id: string) =>
        api.get(`/certificates/${id}/download`, {
            responseType: 'blob',
        }),

    getEventCertificates: (eventId: string, params?: { per_page?: number }) =>
        api.get<ApiResponse<Certificate[]> & { pagination: PaginatedResponse<Certificate>['current_page'] }>(`/events/${eventId}/certificates`, { params }),
};
