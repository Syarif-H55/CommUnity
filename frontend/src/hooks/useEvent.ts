'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/event.service';
import { CreateEventRequest, UpdateEventRequest, EventFilters } from '@/types';

export function useEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await eventService.list();
            return response.data.data ?? [];
        },
    });
}

export function useDiscoverEvents(filters: EventFilters = {}) {
    return useQuery({
        queryKey: ['discover', 'events', filters],
        queryFn: async () => {
            const response = await eventService.list(filters);
            return response.data;
        },
        placeholderData: (prev) => prev,
    });
}

export function useEvent(id: string) {
    return useQuery({
        queryKey: ['events', id],
        queryFn: async () => {
            const response = await eventService.getById(id);
            return response.data.data!;
        },
        enabled: !!id,
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateEventRequest) =>
            eventService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}

export function useUpdateEvent(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateEventRequest) =>
            eventService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', id] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}

export function usePublishEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            eventService.publish(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            eventService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}
