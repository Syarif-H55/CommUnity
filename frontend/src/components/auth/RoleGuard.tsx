"use client";

import { useRoleStore } from "@/stores/role.store";
import { useRoleContext } from "@/hooks/useRoleContext";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Array<'admin' | 'organizer' | 'coordinator'>;
    requireOrganization?: boolean;
    organizationId?: string;
    fallback?: React.ReactNode;
}

export default function RoleGuard({
    children,
    allowedRoles,
    requireOrganization = false,
    organizationId,
    fallback,
}: RoleGuardProps) {
    const { isLoading } = useRoleContext();
    const context = useRoleStore((state) => state.context);
    const isAdmin = useRoleStore((state) => state.isAdmin);
    const isOrganizer = useRoleStore((state) => state.isOrganizer);
    const isCoordinator = useRoleStore((state) => state.isCoordinator);

    if (isLoading || !context) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Memuat...</p>
            </div>
        );
    }

    const hasAllowedRole = allowedRoles.some((role) => {
        switch (role) {
            case 'admin':
                return isAdmin();
            case 'organizer':
                return isOrganizer();
            case 'coordinator':
                return isCoordinator();
            default:
                return false;
        }
    });

    if (!hasAllowedRole) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">
                        Anda tidak memiliki akses ke halaman ini.
                    </p>
                </div>
            </div>
        );
    }

    if (requireOrganization && context.organizations.length === 0) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">
                        Anda harus tergabung dalam organisasi untuk mengakses halaman ini.
                    </p>
                </div>
            </div>
        );
    }

    if (organizationId !== undefined) {
        const isMember = context.organizations.some(
            (org) => org.id === organizationId
        );
        if (!isMember) {
            if (fallback) {
                return <>{fallback}</>;
            }

            return (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground">
                            Anda tidak memiliki akses ke organisasi ini.
                        </p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
}
