'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '@/services/api';
import { useRoleStore } from '@/stores/role.store';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRoleContext } from '@/types';

export function useRoleContext() {
    const token = useAuthStore((state) => state.token);
    const setContext = useRoleStore((state) => state.setContext);
    const setLoading = useRoleStore((state) => state.setLoading);

    const query = useQuery<UserRoleContext>({
        queryKey: ['user-context'],
        queryFn: async () => {
            const response = await api.get('/my-context');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: !!token,
    });

    useEffect(() => {
        setLoading(query.isLoading);
        if (query.data) {
            setContext(query.data);
        }
    }, [query.data, query.isLoading, setContext, setLoading]);

    return query;
}
