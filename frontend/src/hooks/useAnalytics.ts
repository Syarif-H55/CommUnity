'use client';

import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';

export function useOrganizationAnalytics(organizationId: string) {
    return useQuery({
        queryKey: ['organizations', organizationId, 'analytics'],
        queryFn: async () => {
            const response = await organizationService.getAnalytics(organizationId);
            return response.data.data!;
        },
        enabled: !!organizationId,
    });
}
