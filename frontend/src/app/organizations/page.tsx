"use client"

import { useState } from "react"
import Link from "next/link"
import AuthGuard from "@/components/auth/AuthGuard"
import RoleGuard from "@/components/auth/RoleGuard"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useOrganizations } from "@/hooks/useOrganization"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { OrganizationCard, OrganizationSlideshow } from "@/components/organization"
import { Handshake, Plus, LogOut, Loader2, Building2 } from "lucide-react"

const FEATURED_SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80",
        title: "Kelola Organisasi Sosial Anda",
        description: "Daftarkan organisasi Anda dan mulai buat kegiatan sosial yang berdampak bagi masyarakat.",
    },
    {
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80",
        title: "Verifikasi Mudah & Cepat",
        description: "Upload dokumen verifikasi organisasi Anda dan dapatkan status terverifikasi untuk membuat event.",
    },
    {
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80",
        title: "Rekrut Anggota & Koordinator",
        description: "Kelola anggota organisasi dan tunjuk koordinator event untuk setiap kegiatan.",
    },
    {
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80",
        title: "Buat Event Sosial",
        description: "Setelah terverifikasi, buat dan publikasikan event sosial untuk menjangkau lebih banyak relawan.",
    },
]

function OrganizationsContent() {
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()
    const { data: organizations, isLoading } = useOrganizations()

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex size-9 items-center justify-center rounded-xl bg-emerald-600"
                        >
                            <Handshake className="size-5 text-white" />
                        </Link>
                        <span className="text-lg font-semibold tracking-tight">Organisasi Saya</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/organizations/register"
                            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            <Plus className="size-4" />
                            <span className="hidden sm:inline">Daftar Organisasi</span>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/login" })}
                            disabled={logout.isPending}
                            className="gap-2"
                        >
                            {logout.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                            <span className="hidden sm:inline">Keluar</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
                <OrganizationSlideshow slides={FEATURED_SLIDES} />

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Organisasi Anda</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola dan pantau organisasi sosial Anda
                        </p>
                    </div>
                    <Link
                        href="/organizations/register"
                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm"
                    >
                        <Plus className="size-4" />
                        Daftar Baru
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-8 animate-spin text-emerald-600" />
                    </div>
                ) : organizations && organizations.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {organizations.map((org) => (
                            <OrganizationCard key={org.id} organization={org} />
                        ))}
                    </div>
                ) : (
                    <Card className="border-emerald-100 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <Building2 className="size-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-center">
                                <CardTitle className="text-lg">Belum Ada Organisasi</CardTitle>
                                <CardDescription className="mt-1">
                                    Daftarkan organisasi sosial Anda untuk mulai membuat event dan merekrut relawan
                                </CardDescription>
                            </div>
                            <Link
                                href="/organizations/register"
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm mt-2"
                            >
                                <Plus className="size-4" />
                                Daftar Organisasi
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}

export default function OrganizationsPage() {
    return (
        <AuthGuard>
            <RoleGuard allowedRoles={["organizer"]}>
                <OrganizationsContent />
            </RoleGuard>
        </AuthGuard>
    )
}
