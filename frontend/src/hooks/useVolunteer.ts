'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { volunteerService, type EventRegistration } from '@/services/volunteer.service';
import { RegistrationFilters } from '@/types';

export function useRegisterEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: string) =>
            volunteerService.register(eventId),
        onSuccess: (_data, eventId) => {
            queryClient.invalidateQueries({ queryKey: ['registrations'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event-registrations', eventId] });
        },
    });
}

export function useEventRegistrations(eventId: string) {
    return useQuery({
        queryKey: ['event-registrations', eventId],
        queryFn: async () => {
            const response = await volunteerService.getEventRegistrations(eventId);
            const data = response.data as unknown as { data: EventRegistration[] };
            return data.data;
        },
        enabled: !!eventId,
    });
}

export function useMyRegistrations(filters: RegistrationFilters = {}) {
    return useQuery({
        queryKey: ['registrations', filters],
        queryFn: async () => {
            const response = await volunteerService.myRegistrations(filters);
            return response.data;
        },
        placeholderData: (prev) => prev,
    });
}
