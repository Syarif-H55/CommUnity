import api from './api';
import { ApiResponse, RegistrationFilters, RegistrationPaginatedResponse } from '@/types';

export interface EventRegistrationVolunteer {
    id: string;
    full_name: string;
    username: string;
    profile_photo_url: string | null;
}

export interface EventRegistration {
    id: string;
    event_id: string;
    volunteer_id: string;
    volunteer: EventRegistrationVolunteer | null;
    registered_at: string;
    created_at: string;
}

export const volunteerService = {
    register: (eventId: string) =>
        api.post<ApiResponse<{ id: string; event_id: string; registered_at: string }>>(`/events/${eventId}/register`),

    myRegistrations: (params?: RegistrationFilters) =>
        api.get<RegistrationPaginatedResponse>('/my-registrations', { params }),

    getEventRegistrations: (eventId: string, params?: { per_page?: number }) =>
        api.get<ApiResponse<EventRegistration[]> & { pagination: { current_page: number; per_page: number; total: number; last_page: number } }>(
            `/events/${eventId}/registrations`, { params }
        ),
};
