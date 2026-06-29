"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useRoleStore } from "@/stores/role.store";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
    Handshake, User, LogOut, Loader2, Settings, Menu, X,
    Building2, CalendarDays, History, QrCode, Shield, LayoutDashboard, FileText, Award
} from "lucide-react";
interface NavLink {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export default function Navbar() {
    const router = useRouter();
    const [hydrated, setHydrated] = useState(false);
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const context = useRoleStore((state) => state.context);
    const logout = useLogout();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => { setHydrated(true); }, []);

    const isAdmin = context?.is_admin ?? false;
    const isOrganizer = context?.is_organizer ?? false;
    const isCoordinator = context?.is_coordinator ?? false;

    const navLinks: NavLink[] = [];

    if (isAdmin) {
        navLinks.push(
            { label: "Dashboard Admin", href: "/admin/dashboard", icon: <Shield className="size-4" /> },
            { label: "Verifikasi", href: "/admin/organizations", icon: <FileText className="size-4" /> },
        );
    }

    if (isOrganizer) {
        navLinks.push(
            { label: "Organisasi", href: "/organizations", icon: <Building2 className="size-4" /> },
        );
    }

    if (isOrganizer || isCoordinator) {
        navLinks.push(
            { label: "Event", href: "/events", icon: <CalendarDays className="size-4" /> },
        );
    }

    navLinks.push(
        { label: "Beranda", href: "/discover", icon: <LayoutDashboard className="size-4" /> },
    );

    if (isAuthenticated) {
        navLinks.push(
            { label: "Partisipasi", href: "/registrations", icon: <History className="size-4" /> },
            { label: "Kehadiran", href: "/my-attendances", icon: <QrCode className="size-4" /> },
            { label: "Sertifikat", href: "/my-certificates", icon: <Award className="size-4" /> },
        );
    }

    const handleLogout = () => {
        logout.mutate(undefined, {
            onSuccess: () => {
                router.push("/login");
            },
        });
    };

    return (
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                        <Handshake className="size-5 text-white" />
                    </Link>
                    <span className="text-lg font-semibold tracking-tight hidden sm:inline">CommUnity</span>
                </div>

                {hydrated && (
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}

                <div className="flex items-center gap-2">
                    {!hydrated ? (
                        <>
                            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground">
                                <Loader2 className="size-3.5 animate-spin" />
                            </span>
                        </>
                    ) : isAuthenticated ? (
                        <>
                            <Link
                                href="/profile"
                                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                <Settings className="size-4" />
                                Profil
                            </Link>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                disabled={logout.isPending}
                                className="hidden sm:inline-flex gap-1.5 h-8"
                            >
                                {logout.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <LogOut className="size-4" />
                                )}
                                {logout.isPending ? "..." : "Keluar"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                            >
                                Daftar
                            </Link>
                        </>
                    )}

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>
            </div>

            {hydrated && menuOpen && (
                <div className="border-t md:hidden">
                    <div className="space-y-1 px-4 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-2" />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <User className="size-4" />
                                    Profil
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                                    disabled={logout.isPending}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    {logout.isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <LogOut className="size-4" />
                                    )}
                                    {logout.isPending ? "Keluar..." : "Keluar"}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
