import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRoleContext, OrganizationMembership } from '@/types';

interface RoleState {
    context: UserRoleContext | null;
    isLoading: boolean;
    setContext: (context: UserRoleContext) => void;
    clearContext: () => void;
    setLoading: (loading: boolean) => void;
    isAdmin: () => boolean;
    isOrganizer: () => boolean;
    isCoordinator: () => boolean;
    isVolunteer: () => boolean;
    getOrganizations: () => OrganizationMembership[];
    hasRoleInOrganization: (orgId: string, role: string) => boolean;
}

export const useRoleStore = create<RoleState>()(
    persist(
        (set, get) => ({
            context: null,
            isLoading: false,
            setContext: (context) => set({ context, isLoading: false }),
            clearContext: () => set({ context: null }),
            setLoading: (loading) => set({ isLoading: loading }),
            isAdmin: () => get().context?.is_admin ?? false,
            isOrganizer: () => get().context?.is_organizer ?? false,
            isCoordinator: () => get().context?.is_coordinator ?? false,
            isVolunteer: () => {
                const ctx = get().context;
                if (!ctx) return false;
                return !ctx.is_admin && !ctx.is_organizer && !ctx.is_coordinator;
            },
            getOrganizations: () => get().context?.organizations ?? [],
            hasRoleInOrganization: (orgId, role) => {
                const orgs = get().context?.organizations ?? [];
                return orgs.some((org) => org.id === orgId && org.role === role);
            },
        }),
        {
            name: 'role-context',
        }
    )
);
