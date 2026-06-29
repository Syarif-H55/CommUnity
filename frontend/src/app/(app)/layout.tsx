"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <Navbar />
            {children}
        </AuthGuard>
    );
}
