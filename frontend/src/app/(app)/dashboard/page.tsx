"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/stores/role.store";
import { Handshake, Loader2 } from "lucide-react";

function DashboardRedirect() {
    const router = useRouter();
    const context = useRoleStore((state) => state.context);
    const isLoading = useRoleStore((state) => state.isLoading);

    useEffect(() => {
        if (!context || isLoading) return;

        if (context.is_admin) {
            router.replace("/admin/dashboard");
        } else if (context.is_organizer) {
            router.replace("/organizations");
        } else if (context.is_coordinator) {
            router.replace("/events");
        } else {
            router.replace("/discover");
        }
    }, [context, isLoading, router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-600 mb-4">
                <Handshake className="size-7 text-white" />
            </div>
            <Loader2 className="size-6 animate-spin text-emerald-600" />
            <p className="mt-3 text-sm text-muted-foreground">Mengarahkan Anda...</p>
        </div>
    );
}

export default function DashboardPage() {
    return <DashboardRedirect />;
}
