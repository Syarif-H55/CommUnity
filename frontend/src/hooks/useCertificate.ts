'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { certificateService } from '@/services/certificate.service';
import { useAuthStore } from '@/stores/auth.store';
import type { Certificate } from '@/types';

export function useMyCertificates() {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['my-certificates'],
        queryFn: async () => {
            const response = await certificateService.getMyCertificates();
            return {
                data: (response.data as unknown as { data: Certificate[]; pagination?: Record<string, unknown> }).data,
            };
        },
        enabled: !!token,
    });
}

export function useCertificate(id: string) {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['certificate', id],
        queryFn: async () => {
            const response = await certificateService.getCertificate(id);
            return response.data.data!;
        },
        enabled: !!token && !!id,
    });
}

export function useDownloadCertificate() {
    return useMutation({
        mutationFn: async ({ id, filename }: { id: string; filename: string }) => {
            const response = await certificateService.downloadCertificate(id);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
}

export function useEventCertificates(eventId: string) {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['event-certificates', eventId],
        queryFn: async () => {
            const response = await certificateService.getEventCertificates(eventId);
            return {
                data: (response.data as unknown as { data: Certificate[]; pagination?: Record<string, unknown> }).data,
            };
        },
        enabled: !!token && !!eventId,
    });
}
