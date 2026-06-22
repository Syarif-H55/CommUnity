'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { volunteerService } from '@/services/volunteer.service';
import { RegistrationFilters } from '@/types';

export function useRegisterEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: string) =>
            volunteerService.register(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
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
