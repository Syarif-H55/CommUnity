"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import Navbar from "@/components/layout/Navbar";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <RoleGuard allowedRoles={["organizer", "coordinator"]}>
                <Navbar />
                {children}
            </RoleGuard>
        </AuthGuard>
    );
}
