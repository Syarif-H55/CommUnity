import api from './api';
import { ApiResponse, RegistrationFilters, RegistrationPaginatedResponse } from '@/types';

export const volunteerService = {
    register: (eventId: string) =>
        api.post<ApiResponse<{ id: string; event_id: string; registered_at: string }>>(`/events/${eventId}/register`),

    myRegistrations: (params?: RegistrationFilters) =>
        api.get<RegistrationPaginatedResponse>('/my-registrations', { params }),
};
