import api from './api';
import { ApiResponse, Event, CreateEventRequest, UpdateEventRequest, EventFilters, DiscoverResponse } from '@/types';

export const eventService = {
    list: (params?: EventFilters) =>
        api.get<DiscoverResponse>('/events', { params }),

    getById: (id: string) =>
        api.get<ApiResponse<Event>>(`/events/${id}`),

    create: (data: CreateEventRequest) => {
        const formData = new FormData();
        formData.append('category_id', String(data.category_id));
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.province) formData.append('province', data.province);
        if (data.city) formData.append('city', data.city);
        if (data.location_name) formData.append('location_name', data.location_name);
        formData.append('quota', String(data.quota));
        formData.append('event_date', data.event_date);
        formData.append('start_time', data.start_time);
        formData.append('end_time', data.end_time);
        if (data.banner) {
            formData.append('banner', data.banner);
        }
        return api.post<ApiResponse<Event>>('/events', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    update: (id: string, data: UpdateEventRequest) => {
        const formData = new FormData();
        if (data.category_id !== undefined) formData.append('category_id', String(data.category_id));
        if (data.title) formData.append('title', data.title);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.province !== undefined) formData.append('province', data.province);
        if (data.city !== undefined) formData.append('city', data.city);
        if (data.location_name !== undefined) formData.append('location_name', data.location_name);
        if (data.quota !== undefined) formData.append('quota', String(data.quota));
        if (data.event_date) formData.append('event_date', data.event_date);
        if (data.start_time) formData.append('start_time', data.start_time);
        if (data.end_time) formData.append('end_time', data.end_time);
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
