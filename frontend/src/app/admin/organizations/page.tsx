"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { useAdminOrganizations, useVerifyOrganization } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Organization } from "@/types";
import {
    Handshake, LogOut, Loader2, Shield, Building2, CheckCircle2, XCircle,
    FileText, Search, ArrowLeft, AlertTriangle
} from "lucide-react";

const verificationBadge = (status: string) => {
    switch (status) {
        case 'approved':
            return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Terverifikasi</Badge>;
        case 'rejected':
            return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Ditolak</Badge>;
        case 'pending':
        default:
            return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>;
    }
};

function AdminOrganizationsContent() {
    const user = useAuthStore((state) => state.user);
    const logout = useLogout();
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const { data, isLoading } = useAdminOrganizations({ status: statusFilter, per_page: 20 });
    const verifyOrg = useVerifyOrganization();

    const handleVerify = (id: string, status: 'approved' | 'rejected') => {
        if (status === 'rejected') {
            const reason = prompt("Alasan penolakan:");
            if (!reason) return;
            verifyOrg.mutate({ id, data: { status, rejection_reason: reason } });
        } else {
            verifyOrg.mutate({ id, data: { status } });
        }
    };

    const organizations = (data?.data ?? []) as Organization[];
    const total = data?.total ?? 0;

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950/20 dark:via-background dark:to-slate-950/20">
            <header className="flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-background/80">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/dashboard"
                        className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-slate-700">
                        <Shield className="size-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">Verifikasi Organisasi</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => logout.mutate()}
                        disabled={logout.isPending}
                        className="gap-2"
                    >
                        {logout.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <LogOut className="size-4" />
                        )}
                        {logout.isPending ? "Keluar..." : "Keluar"}
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Verifikasi Organisasi</h1>
                            <p className="text-muted-foreground">
                                {total} organisasi ditemukan
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {['pending', 'approved', 'rejected'].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter(statusFilter === status ? undefined : status)}
                                >
                                    {status === 'pending' ? 'Pending' : status === 'approved' ? 'Terverifikasi' : 'Ditolak'}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : organizations.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Building2 className="size-12 text-muted-foreground/40 mb-4" />
                                <p className="text-muted-foreground">Tidak ada organisasi ditemukan.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {organizations.map((org) => (
                                <Card key={org.id} className="overflow-hidden">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold truncate">{org.name}</h3>
                                                    {verificationBadge(org.verification_status)}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                    {org.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>ID: {org.id}</span>
                                                    <span>{org.members_count ?? 0} anggota</span>
                                                    <span>Dibuat: {new Date(org.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                {org.rejection_reason && (
                                                    <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/20 dark:text-red-400">
                                                        <AlertTriangle className="size-3 mt-0.5 shrink-0" />
                                                        <span>{org.rejection_reason}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {org.verification_status === 'pending' && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400"
                                                        onClick={() => handleVerify(org.id, 'rejected')}
                                                        disabled={verifyOrg.isPending}
                                                    >
                                                        <XCircle className="size-4" />
                                                        Tolak
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                        onClick={() => handleVerify(org.id, 'approved')}
                                                        disabled={verifyOrg.isPending}
                                                    >
                                                        <CheckCircle2 className="size-4" />
                                                        Setujui
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AdminOrganizationsPage() {
    return <AdminOrganizationsContent />;
}
