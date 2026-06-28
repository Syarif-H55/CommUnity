'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';
import { CreateReportRequest, UpdateReportRequest, ReviewReportRequest } from '@/types';

export function useEventReport(eventId: string) {
    return useQuery({
        queryKey: ['event-report', eventId],
        queryFn: async () => {
            const response = await reportService.getReport(eventId);
            return response.data.data ?? null;
        },
        enabled: !!eventId,
    });
}

export function useCreateReport(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateReportRequest) =>
            reportService.createReport(eventId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-report', eventId] });
        },
    });
}

export function useUpdateReport(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateReportRequest) =>
            reportService.updateReport(eventId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-report', eventId] });
        },
    });
}

export function useUploadPhotos(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (photos: File[]) =>
            reportService.uploadPhotos(eventId, photos),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-report', eventId] });
        },
    });
}

export function useDeletePhoto(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (photoId: string) =>
            reportService.deletePhoto(eventId, photoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-report', eventId] });
        },
    });
}

export function useSubmitReport(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            reportService.submitReport(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-report', eventId] });
        },
    });
}

export function useReviewReport(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReviewReportRequest) =>
            reportService.reviewReport(eventId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-report', eventId] });
            queryClient.invalidateQueries({ queryKey: ['events', eventId] });
        },
    });
}

export function useAiGenerateReport(eventId: string) {
    return useMutation({
        mutationFn: (additionalNotes?: string) =>
            reportService.aiGenerate(eventId, additionalNotes),
    });
}
