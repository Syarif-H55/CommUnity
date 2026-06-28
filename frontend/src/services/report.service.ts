import api from './api';
import { ApiResponse, EventReport, CreateReportRequest, UpdateReportRequest, ReviewReportRequest, AiGenerateReportResponse } from '@/types';

export const reportService = {
    getReport: (eventId: string) =>
        api.get<ApiResponse<EventReport | null>>(`/events/${eventId}/report`),

    createReport: (eventId: string, data: CreateReportRequest) => {
        const formData = new FormData();
        if (data.summary) formData.append('summary', data.summary);
        if (data.total_attendees !== undefined) formData.append('total_attendees', String(data.total_attendees));
        if (data.photos) {
            data.photos.forEach((photo) => formData.append('photos[]', photo));
        }
        return api.post<ApiResponse<EventReport>>(`/events/${eventId}/report`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    updateReport: (eventId: string, data: UpdateReportRequest) =>
        api.patch<ApiResponse<EventReport>>(`/events/${eventId}/report`, data),

    uploadPhotos: (eventId: string, photos: File[]) => {
        const formData = new FormData();
        photos.forEach((photo) => formData.append('photos[]', photo));
        return api.post<ApiResponse<EventReport>>(`/events/${eventId}/report/photos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deletePhoto: (eventId: string, photoId: string) =>
        api.delete<ApiResponse<null>>(`/events/${eventId}/report/photos/${photoId}`),

    submitReport: (eventId: string) =>
        api.post<ApiResponse<EventReport>>(`/events/${eventId}/report/submit`),

    reviewReport: (eventId: string, data: ReviewReportRequest) =>
        api.post<ApiResponse<EventReport>>(`/events/${eventId}/report/review`, data),

    aiGenerate: (eventId: string, additionalNotes?: string) =>
        api.post<ApiResponse<AiGenerateReportResponse>>(`/events/${eventId}/report/ai-generate`, {
            additional_notes: additionalNotes,
        }),
};
