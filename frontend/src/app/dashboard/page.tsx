"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Handshake, User, Mail, Shield, LogOut, Settings, Loader2, Building2, CalendarDays, History, QrCode, ArrowRight } from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  async function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
      <header className="flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-background/80">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
            <Handshake className="size-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CommUnity</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Settings className="size-4" />
            <span className="hidden sm:inline">Profil</span>
          </Link>

          <Button
            variant="outline"
            onClick={handleLogout}
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

      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-lg border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
          <CardHeader className="pb-6 text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              {user?.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt={user.full_name}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-7 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <CardTitle className="text-xl">{user?.full_name}</CardTitle>
            <CardDescription>@{user?.username}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
              <Mail className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
              <Shield className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium capitalize">{user?.role}</p>
              </div>
            </div>

            <Separator className="my-2" />

            <Link
              href="/organizations"
              className="group flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 transition-all hover:bg-emerald-100/50 dark:border-emerald-900/20 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Building2 className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Kelola Organisasi
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                  Daftarkan & kelola organisasi sosial Anda
                </p>
              </div>
              <ArrowRight className="size-4 text-emerald-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/events"
              className="group flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 transition-all hover:bg-emerald-100/50 dark:border-emerald-900/20 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CalendarDays className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Kelola Event
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                  Buat & publikasikan kegiatan sosial Anda
                </p>
              </div>
              <ArrowRight className="size-4 text-emerald-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/registrations"
              className="group flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 transition-all hover:bg-emerald-100/50 dark:border-emerald-900/20 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <History className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Riwayat Partisipasi
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                  Lihat kegiatan sosial yang Anda ikuti
                </p>
              </div>
              <ArrowRight className="size-4 text-emerald-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/my-attendances"
              className="group flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 transition-all hover:bg-emerald-100/50 dark:border-emerald-900/20 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <QrCode className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Riwayat Kehadiran
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                  Lihat catatan absensi Anda pada event
                </p>
              </div>
              <ArrowRight className="size-4 text-emerald-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
              Selamat datang di CommUnity — Platform Kegiatan Sosial Komunitas
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
