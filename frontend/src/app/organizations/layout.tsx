"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";

export default function OrganizationsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <Navbar />
            {children}
        </AuthGuard>
    );
}
