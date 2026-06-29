"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <RoleGuard allowedRoles={["admin"]}>
                <Navbar />
                {children}
            </RoleGuard>
        </AuthGuard>
    );
}
