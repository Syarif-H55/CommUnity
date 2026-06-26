'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '@/services/attendance.service';
import { AttendanceStatus, AttendanceFilters } from '@/types';

export function useQRData(eventId: string) {
    return useQuery({
        queryKey: ['attendance', 'qr', eventId],
        queryFn: async () => {
            const response = await attendanceService.getQRData(eventId);
            return response.data.data!;
        },
        enabled: !!eventId,
    });
}

export function useRefreshQRData(eventId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => attendanceService.getQRData(eventId),
        onSuccess: (response) => {
            queryClient.setQueryData(['attendance', 'qr', eventId], response.data.data);
        },
    });
}

export function useScanAttendance(eventId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { qr_content: string }) =>
            attendanceService.scanAttendance(eventId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance', eventId] });
            queryClient.invalidateQueries({ queryKey: ['attendance-summary', eventId] });
        },
    });
}

export function useManualAttendance(eventId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { volunteer_id: string; status: AttendanceStatus }) =>
            attendanceService.manualAttendance(eventId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance', eventId] });
            queryClient.invalidateQueries({ queryKey: ['attendance-summary', eventId] });
        },
    });
}

export function useUpdateAttendance(eventId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ attendanceId, status }: { attendanceId: string; status: AttendanceStatus }) =>
            attendanceService.updateAttendance(eventId, attendanceId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance', eventId] });
            queryClient.invalidateQueries({ queryKey: ['attendance-summary', eventId] });
        },
    });
}

export function useEventAttendances(eventId: string, filters?: AttendanceFilters) {
    return useQuery({
        queryKey: ['attendance', eventId, filters],
        queryFn: async () => {
            const response = await attendanceService.getEventAttendances(eventId, filters);
            return response.data;
        },
        enabled: !!eventId,
        placeholderData: (prev) => prev,
    });
}

export function useAttendanceSummary(eventId: string) {
    return useQuery({
        queryKey: ['attendance-summary', eventId],
        queryFn: async () => {
            const response = await attendanceService.getAttendanceSummary(eventId);
            return response.data.data!;
        },
        enabled: !!eventId,
    });
}

export function useMyAttendances(filters?: AttendanceFilters) {
    return useQuery({
        queryKey: ['my-attendances', filters],
        queryFn: async () => {
            const response = await attendanceService.getMyAttendances(filters);
            return response.data;
        },
        placeholderData: (prev) => prev,
    });
}
