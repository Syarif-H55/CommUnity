import api from './api';
import { ApiResponse, Event, CreateEventRequest, UpdateEventRequest } from '@/types';

export const eventService = {
    list: () =>
        api.get<ApiResponse<Event[]>>('/events'),

    getById: (id: string) =>
        api.get<ApiResponse<Event>>(`/events/${id}`),

    create: (data: CreateEventRequest) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('date', data.date);
        formData.append('time', data.time);
        formData.append('location', data.location);
        formData.append('category', data.category);
        formData.append('max_participants', String(data.max_participants));
        if (data.banner) {
            formData.append('banner', data.banner);
        }
        return api.post<ApiResponse<Event>>('/events', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    update: (id: string, data: UpdateEventRequest) => {
        const formData = new FormData();
        if (data.title) formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.date) formData.append('date', data.date);
        if (data.time) formData.append('time', data.time);
        if (data.location) formData.append('location', data.location);
        if (data.category) formData.append('category', data.category);
        if (data.max_participants !== undefined) formData.append('max_participants', String(data.max_participants));
        if (data.banner) formData.append('banner', data.banner);
        formData.append('_method', 'PATCH');
        return api.post<ApiResponse<Event>>(`/events/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    publish: (id: string) =>
        api.patch<ApiResponse<Event>>(`/events/${id}/publish`),

    delete: (id: string) =>
        api.delete<ApiResponse<null>>(`/events/${id}`),
};
