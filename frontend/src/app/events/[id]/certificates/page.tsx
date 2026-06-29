"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useEvent } from "@/hooks/useEvent"
import { useEventCertificates, useDownloadCertificate } from "@/hooks/useCertificate"
import { CertificateCard } from "@/components/certificate"
import { CertificateDetailModal } from "@/components/certificate"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
    Handshake, ArrowLeft, LogOut, Loader2, Award, FileText,
    Users, ScrollText, ChevronRight, ExternalLink, XCircle
} from "lucide-react"
import type { Certificate } from "@/types"

function EventCertificatesContent() {
    const params = useParams()
    const id = params.id as string
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()
    const { data: event, isLoading: eventLoading, error: eventError } = useEvent(id)
    const { data: certPage, isLoading: certsLoading } = useEventCertificates(id)
    const downloadCert = useDownloadCertificate()

    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

    const certificates = certPage?.data || []

    const handleDownload = (certId: string, filename: string) => {
        downloadCert.mutate({ id: certId, filename })
    }

    if (eventLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat data sertifikat...</p>
                </div>
            </div>
        )
    }

    if (eventError || !event) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <Card className="w-full max-w-md text-center border-emerald-100/50">
                    <CardContent className="py-12">
                        <XCircle className="mx-auto size-12 text-destructive mb-4" />
                        <CardTitle className="text-lg">Event Tidak Ditemukan</CardTitle>
                        <CardDescription className="mt-2">
                            Event yang Anda cari tidak tersedia atau telah dihapus.
                        </CardDescription>
                        <Link
                            href="/events"
                            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/events/${event.id}`}
                            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                            <Handshake className="size-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight truncate max-w-[200px]">
                            {event.title}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/login" })}
                        disabled={logout.isPending}
                    >
                        {logout.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                    <div className="relative flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                            <Award className="size-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Sertifikat Event</h1>
                            <p className="text-emerald-100/70 text-sm mt-1">
                                {event.title}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                            <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">Total Sertifikat</p>
                            <p className="text-xl font-bold text-white mt-1">{certificates.length}</p>
                        </div>
                        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                            <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">Status Event</p>
                            <p className="text-sm font-medium text-emerald-300 mt-1">Selesai</p>
                        </div>
                        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                            <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">Relawan</p>
                            <p className="text-xl font-bold text-white mt-1">{event.current_participants}</p>
                        </div>
                    </div>
                </div>

                {/* Certificate List */}
                {certsLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                            <p className="mt-4 text-sm text-muted-foreground">Memuat sertifikat...</p>
                        </div>
                    </div>
                ) : certificates.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {certificates.map((cert, index) => (
                            <div
                                key={cert.id}
                                className="animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
                            >
                                <button
                                    onClick={() => setSelectedCert(cert)}
                                    className="w-full text-left group"
                                >
                                    <CertificateCard
                                        certificate={cert}
                                        onDownload={handleDownload}
                                        isDownloading={
                                            downloadCert.isPending &&
                                            downloadCert.variables?.id === cert.id
                                        }
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card className="border-emerald-100/50 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <Award className="size-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-center">
                                <CardTitle className="text-lg">Belum Ada Sertifikat</CardTitle>
                                <CardDescription className="mt-1">
                                    Sertifikat akan diterbitkan setelah event selesai dan laporan disetujui.
                                </CardDescription>
                            </div>
                            <Link
                                href={`/events/${event.id}`}
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-4 h-9 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm mt-2"
                            >
                                <ArrowLeft className="size-4" />
                                Kembali ke Event
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </main>

            {/* Detail Modal */}
            <CertificateDetailModal
                certificate={selectedCert}
                open={!!selectedCert}
                onClose={() => setSelectedCert(null)}
                onDownload={handleDownload}
                isDownloading={downloadCert.isPending && selectedCert ? downloadCert.variables?.id === selectedCert.id : false}
            />
        </div>
    )
}

export default function EventCertificatesPage() {
    return (
        <AuthGuard>
            <EventCertificatesContent />
        </AuthGuard>
    )
}
