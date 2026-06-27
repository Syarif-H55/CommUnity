"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { useAdminStats } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Handshake, LogOut, Loader2, Shield, Users, Building2, CalendarDays,
    Clock, CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";

function AdminDashboardContent() {
    const user = useAuthStore((state) => state.user);
    const logout = useLogout();
    const { data: stats, isLoading } = useAdminStats();

    const statusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
            case 'published': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'ongoing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950/20 dark:via-background dark:to-slate-950/20">
            <header className="flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-background/80">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-slate-700">
                        <Shield className="size-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">Admin CommUnity</span>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard"
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted transition-all"
                    >
                        Dashboard
                    </Link>
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
                <div className="mx-auto max-w-6xl space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
                        <p className="text-muted-foreground">
                            Selamat datang, {user?.full_name}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total Organisasi</CardTitle>
                                        <Building2 className="size-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold">{stats?.total_organizations ?? 0}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total Event</CardTitle>
                                        <CalendarDays className="size-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold">{stats?.total_events ?? 0}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                                        <Users className="size-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold">{stats?.total_users ?? 0}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-amber-200 dark:border-amber-900/30">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
                                        <AlertTriangle className="size-4 text-amber-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold text-amber-600">{stats?.pending_verification ?? 0}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Organisasi Pending</CardTitle>
                                        <CardDescription>
                                            {stats?.pending_verification ?? 0} organisasi menunggu verifikasi
                                        </CardDescription>
                                    </div>
                                    <Link
                                        href="/admin/organizations"
                                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                    >
                                        Lihat Semua
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    {stats && stats.pending_verification > 0 ? (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/20 dark:bg-amber-950/10">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className="size-8 text-amber-500" />
                                                <div>
                                                    <p className="font-medium text-amber-800 dark:text-amber-300">
                                                        {stats.pending_verification} organisasi perlu diverifikasi
                                                    </p>
                                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                                                        Klik "Lihat Semua" untuk melakukan verifikasi.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Semua organisasi sudah diverifikasi.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Event Terbaru</CardTitle>
                                            <CardDescription>5 event terbaru di platform</CardDescription>
                                        </div>
                                        <CalendarDays className="size-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        {stats?.recent_events && stats.recent_events.length > 0 ? (
                                            <div className="space-y-3">
                                                {stats.recent_events.map((event) => (
                                                    <div key={event.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium">{event.title}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {event.organization_name ?? '—'}
                                                            </p>
                                                        </div>
                                                        <Badge className={statusColor(event.status)}>
                                                            {event.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Belum ada event.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Pengguna Terbaru</CardTitle>
                                            <CardDescription>5 pengguna terbaru di platform</CardDescription>
                                        </div>
                                        <Users className="size-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        {stats?.recent_users && stats.recent_users.length > 0 ? (
                                            <div className="space-y-3">
                                                {stats.recent_users.map((u) => (
                                                    <div key={u.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium">{u.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">@{u.username}</p>
                                                        </div>
                                                        {u.is_admin && (
                                                            <Badge className="bg-slate-100 text-slate-700">Admin</Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Belum ada pengguna.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AdminDashboardPage() {
    return <AdminDashboardContent />;
}
