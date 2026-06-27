"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import RoleGuard from "@/components/auth/RoleGuard";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <RoleGuard allowedRoles={["organizer", "coordinator"]}>
                {children}
            </RoleGuard>
        </AuthGuard>
    );
}
