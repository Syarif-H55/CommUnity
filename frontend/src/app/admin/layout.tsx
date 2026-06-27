"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import RoleGuard from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <RoleGuard allowedRoles={["admin"]}>
                {children}
            </RoleGuard>
        </AuthGuard>
    );
}
