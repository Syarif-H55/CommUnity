"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEvent } from "@/hooks/useEvent"
import { useRegisterEvent, useMyRegistrations } from "@/hooks/useVolunteer"
import { useAuthStore } from "@/stores/auth.store"
import { EventStatusBadge } from "@/components/event"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Handshake, ArrowLeft, Loader2, Calendar, MapPin, Clock,
    Users, Building2, XCircle, LogIn, UserPlus, CheckCircle2,
    Share2, ExternalLink, ImageOff, Sparkles, PartyPopper, AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DiscoverEventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const { data: event, isLoading, error } = useEvent(id)
    const registerEvent = useRegisterEvent()
    const { data: registrationsData } = useMyRegistrations({ per_page: 100 })
    const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set())
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        if (registrationsData?.data) {
            setRegisteredEventIds(new Set(registrationsData.data.map((r) => r.event_id)))
        }
    }, [registrationsData])

    const isRegistered = id ? registeredEventIds.has(id) : false
    const isFull = event ? event.current_participants >= event.quota : false

    const handleRegister = useCallback(() => {
        if (!id) return
        registerEvent.mutate(id, {
            onSuccess: () => {
                setRegisteredEventIds((prev) => new Set(prev).add(id))
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 5000)
            },
        })
    }, [id, registerEvent])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat detail kegiatan...</p>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <Card className="w-full max-w-md text-center border-emerald-100/50">
                    <CardContent className="py-12">
                        <XCircle className="mx-auto size-12 text-destructive mb-4" />
                        <CardTitle className="text-lg">Kegiatan Tidak Ditemukan</CardTitle>
                        <CardDescription className="mt-2">
                            Kegiatan yang Anda cari tidak tersedia atau telah dihapus.
                        </CardDescription>
                        <Link
                            href="/discover"
                            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke Jelajahi
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const eventDate = new Date(event.event_date)
    const isUpcoming = eventDate >= new Date()
    const dateStr = eventDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })

    const participantsPercent = Math.round((event.current_participants / event.quota) * 100)

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            {/* Header */}
            <header className="border-b bg-white/80 dark:bg-background/80">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/discover"
                            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <Link href="/" className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                            <Handshake className="size-5 text-white" />
                        </Link>
                        <span className="text-lg font-semibold tracking-tight truncate max-w-[200px]">
                            {event.title}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted transition-all"
                                >
                                    <LogIn className="size-4" />
                                    <span className="hidden sm:inline">Masuk</span>
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm"
                                >
                                    <UserPlus className="size-4" />
                                    <span className="hidden sm:inline">Daftar</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 min-h-[260px]">
                    {event.banner_url ? (
                        <div className="absolute inset-0">
                            <img
                                src={event.banner_url}
                                alt={event.title}
                                className="size-full object-cover opacity-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/60 to-emerald-900/30" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
                    )}

                    <div className="relative z-10 p-8 md:p-10">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm text-xs px-3 py-1">
                                {event.category_name}
                            </Badge>
                            {event.status === "published" && isUpcoming && (
                                <Badge variant="success" className="flex items-center gap-1.5 backdrop-blur-sm">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                                    </span>
                                    Akan Datang
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-100/70">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                {dateStr}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-4" />
                                {event.start_time} - {event.end_time}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="size-4" />
                                {event.location_name || "Lokasi belum ditentukan"}
                            </span>
                            {event.organization_name && (
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="size-4" />
                                    {event.organization_name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Sparkles className="size-4 text-emerald-600" />
                                    Tentang Kegiatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                                    {event.description || "Belum ada deskripsi untuk kegiatan ini."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Time & Location */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Card className="border-emerald-100/50 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Calendar className="size-4 text-emerald-600" />
                                        Waktu & Lokasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Calendar className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Tanggal</p>
                                            <p className="text-sm font-medium">{dateStr}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Clock className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Waktu</p>
                                            <p className="text-sm font-medium">{event.start_time} - {event.end_time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <MapPin className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Lokasi</p>
                                            <p className="text-sm font-medium">{event.location_name || "Belum ditentukan"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-100/50 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Users className="size-4 text-emerald-600" />
                                        Partisipasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Users className="size-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Pendaftar</p>
                                            <p className="text-sm font-medium">
                                                {event.current_participants} / {event.quota}
                                            </p>
                                            <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        isFull ? "bg-red-500" : "bg-emerald-500"
                                                    )}
                                                    style={{ width: `${Math.min(participantsPercent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {event.organization_name && (
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <Building2 className="size-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Penyelenggara</p>
                                                <p className="text-sm font-medium">{event.organization_name}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Join Event */}
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="size-4 text-emerald-600" />
                                    Ikuti Kegiatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isAuthenticated ? (
                                    <>
                                        {isRegistered ? (
                                            <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-5 text-center dark:border-emerald-900/30 dark:bg-emerald-950/20">
                                                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <CheckCircle2 className="size-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                                        Sudah Mendaftar
                                                    </p>
                                                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                                                        Anda telah terdaftar pada kegiatan ini
                                                    </p>
                                                </div>
                                            </div>
                                        ) : isFull ? (
                                            <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50/50 px-4 py-5 text-center dark:border-red-900/30 dark:bg-red-950/20">
                                                <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                    <XCircle className="size-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                                        Kuota Penuh
                                                    </p>
                                                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                                                        Maaf, kuota peserta untuk kegiatan ini sudah terpenuhi
                                                    </p>
                                                </div>
                                            </div>
                                        ) : event?.status !== "published" ? (
                                            <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-5 text-center dark:border-amber-900/30 dark:bg-amber-950/20">
                                                <AlertCircle className="size-6 text-amber-600" />
                                                <div>
                                                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                                                        Belum Tersedia
                                                    </p>
                                                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">
                                                        Kegiatan ini belum dapat diikuti
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Button
                                                    onClick={handleRegister}
                                                    disabled={registerEvent.isPending}
                                                    className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                                                >
                                                    {registerEvent.isPending ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : (
                                                        <UserPlus className="size-4" />
                                                    )}
                                                    {registerEvent.isPending ? "Mendaftarkan..." : "Ikuti Kegiatan Ini"}
                                                </Button>
                                                <p className="text-xs text-center text-muted-foreground">
                                                    {event?.quota - (event?.current_participants || 0)} dari {event?.quota} kursi tersedia
                                                </p>
                                            </div>
                                        )}

                                        {showSuccess && (
                                            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/30 dark:bg-emerald-950/30">
                                                <PartyPopper className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                                                <div>
                                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                                        Pendaftaran Berhasil!
                                                    </p>
                                                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                                                        Anda telah terdaftar sebagai relawan pada kegiatan ini.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {registerEvent.isError && (
                                            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/30">
                                                <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
                                                <div>
                                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                                        Gagal Mendaftar
                                                    </p>
                                                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                                                        {registerEvent.error instanceof Error
                                                            ? (registerEvent.error as any)?.response?.data?.message || registerEvent.error.message
                                                            : "Terjadi kesalahan. Silakan coba lagi."}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <Link href="/login">
                                            <Button className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
                                                <LogIn className="size-4" />
                                                Masuk untuk Mendaftar
                                            </Button>
                                        </Link>
                                        <p className="text-xs text-center text-muted-foreground">
                                            Belum punya akun?{" "}
                                            <Link href="/register" className="text-emerald-600 hover:underline font-medium">
                                                Daftar
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Event Info */}
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                    Informasi Event
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Kategori</span>
                                    <Badge variant="outline">{event.category_name}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Kapasitas</span>
                                    <span className="text-sm font-medium">{event.quota} orang</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Pendaftar</span>
                                    <span className={cn(
                                        "text-sm font-medium",
                                        isFull ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                                    )}>
                                        {event.current_participants} {isFull ? "(Penuh)" : ""}
                                    </span>
                                </div>
                                <Separator />
                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Share2 className="size-4" />
                                    </div>
                                    <span className="flex-1 text-left">Bagikan</span>
                                    <ExternalLink className="size-4 text-muted-foreground" />
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Back to Discover */}
                <div className="flex justify-center pt-4">
                    <Link
                        href="/discover"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 h-10 text-sm font-medium transition-all hover:bg-muted hover:border-emerald-200"
                    >
                        <ArrowLeft className="size-4" />
                        Jelajahi Kegiatan Lainnya
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-white/50 dark:bg-background/50 mt-12">
                <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Handshake className="size-4" />
                        <span>&copy; {new Date().getFullYear()} CommUnity. Platform Kegiatan Sosial Komunitas.</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {!isAuthenticated && (
                            <>
                                <Link href="/login" className="hover:text-emerald-600 transition-colors">Masuk</Link>
                                <Link href="/register" className="hover:text-emerald-600 transition-colors">Daftar</Link>
                            </>
                        )}
                        <Link href="/discover" className="hover:text-emerald-600 transition-colors">Jelajahi</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
