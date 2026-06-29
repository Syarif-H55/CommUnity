"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useEvent, usePublishEvent, useDeleteEvent } from "@/hooks/useEvent"
import { useOrganization } from "@/hooks/useOrganization"
import { useEventRegistrations } from "@/hooks/useVolunteer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EventStatusBadge } from "@/components/event"
import {
    Handshake, ArrowLeft, LogOut, Loader2, Calendar, MapPin, Clock,
    Users, Edit3, Trash2, Send, CheckCircle2, XCircle, Building2,
    ImageOff, Globe, User, Shield, AlertTriangle, FileText, Share2,
    ChevronRight, ExternalLink, Sparkles, PartyPopper, QrCode, Award,
    UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

function EventDetailContent() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()
    const { data: event, isLoading, error } = useEvent(id)
    const publishEvent = usePublishEvent()
    const deleteEvent = useDeleteEvent()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const { data: registrationsData } = useEventRegistrations(id)

    const registrations = registrationsData || []

    const isLoadingMutation = publishEvent.isPending || deleteEvent.isPending

    const handlePublish = () => {
        publishEvent.mutate(id, {
            onSuccess: () => {
                // Refetch event data after publish
            }
        })
    }

    const handleDelete = () => {
        deleteEvent.mutate(id, {
            onSuccess: () => {
                router.push("/events")
            }
        })
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat event...</p>
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
                        <CardTitle className="text-lg">Event Tidak Ditemukan</CardTitle>
                        <CardDescription className="mt-2">
                            Event yang Anda cari tidak tersedia atau telah dihapus.
                        </CardDescription>
                        <Link
                            href="/events"
                            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke Event
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
    const isFull = event.current_participants >= event.quota

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/events"
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

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/login" })}
                            disabled={logout.isPending}
                        >
                            {logout.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 min-h-[280px]">
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
                            <EventStatusBadge status={event.status} className="backdrop-blur-sm" />
                            {event.status === "published" && isUpcoming && (
                                <Badge variant="success" className="flex items-center gap-1.5">
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
                                {event.location_name}
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

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    {event.status === "draft" && (
                        <>
                            <Button
                                onClick={handlePublish}
                                disabled={isLoadingMutation}
                                className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                            >
                                {publishEvent.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Send className="size-4" />
                                )}
                                Publikasikan Event
                            </Button>
                            <Link href={`/events/${event.id}/edit`}>
                                <Button variant="outline" className="gap-2">
                                    <Edit3 className="size-4" />
                                    Edit
                                </Button>
                            </Link>
                        </>
                    )}
                    {event.status === "published" && (
                        <Link href={`/events/${event.id}/edit`}>
                            <Button variant="outline" className="gap-2">
                                <Edit3 className="size-4" />
                                Edit Event
                            </Button>
                        </Link>
                    )}
                    {event.status === "draft" && (
                        <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="size-4" />
                            Hapus
                        </Button>
                    )}
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <Card className="border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/20">
                        <CardContent className="flex items-start gap-4 py-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                                    Hapus Event?
                                </h4>
                                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                                    Tindakan ini tidak dapat dibatalkan. Event &quot;{event.title}&quot; akan dihapus secara permanen.
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={deleteEvent.isPending}
                                        className="gap-2"
                                    >
                                        {deleteEvent.isPending ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="size-4" />
                                        )}
                                        Ya, Hapus
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="size-4 text-emerald-600" />
                                    Deskripsi Event
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Info Cards */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Card className="border-emerald-100/50 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Calendar className="size-4 text-emerald-600" />
                                        Waktu Pelaksanaan
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
                                            <p className="text-sm font-medium">{event.location_name}</p>
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
                                            <p className="text-xs text-muted-foreground">Peserta</p>
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
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Shield className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Status</p>
                                            <EventStatusBadge status={event.status} className="mt-0.5" />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Globe className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Kategori</p>
                                            <p className="text-sm font-medium">{event.category_name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Published Success Message */}
                        {publishEvent.isSuccess && (
                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-900/30 dark:bg-emerald-950/30">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <PartyPopper className="size-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                        Event Berhasil Dipublikasikan! 
                                    </h4>
                                    <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                                        Event Anda sekarang dapat dilihat dan diikuti oleh relawan. 
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Sparkles className="size-4 text-emerald-600" />
                                    Aksi Cepat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link
                                    href={`/events/${event.id}/edit`}
                                    className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Edit3 className="size-4" />
                                    </div>
                                    <span className="flex-1">Edit Event</span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </Link>

                                <Link
                                    href={`/events/${event.id}/attendance`}
                                    className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <QrCode className="size-4" />
                                    </div>
                                    <span className="flex-1">Kelola Absensi</span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </Link>

                                <Link
                                    href={`/events/${event.id}/report`}
                                    className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <FileText className="size-4" />
                                    </div>
                                    <span className="flex-1">Laporan Kegiatan</span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </Link>

                                <Link
                                    href={`/events/${event.id}/certificates`}
                                    className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Award className="size-4" />
                                    </div>
                                    <span className="flex-1">Sertifikat</span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </Link>

                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Share2 className="size-4" />
                                    </div>
                                    <span className="flex-1">Salin Tautan</span>
                                    <ExternalLink className="size-4 text-muted-foreground" />
                                </button>

                                <Link
                                    href="/events"
                                    className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <ArrowLeft className="size-4" />
                                    </div>
                                    <span className="flex-1">Semua Event</span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Event Status Summary */}
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                    Ringkasan
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
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <EventStatusBadge status={event.status} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Dibuat</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(event.created_at).toLocaleDateString("id-ID")}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Registered Volunteers */}
                        {(event.status === "published" || event.status === "completed") && (
                            <Card className="border-emerald-100/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <UserCheck className="size-4 text-emerald-600" />
                                        Relawan Terdaftar
                                        <span className="ml-auto text-xs font-normal text-muted-foreground">
                                            {event.current_participants}/{event.quota}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {registrations.length > 0 ? (
                                        <div className="space-y-2">
                                            {registrations.slice(0, 10).map((reg) => (
                                                <div key={reg.id} className="flex items-center gap-3 rounded-xl border border-border/50 px-3 py-2.5">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        {reg.volunteer?.profile_photo_url ? (
                                                            <img src={reg.volunteer.profile_photo_url} alt="" className="size-full rounded-full object-cover" />
                                                        ) : (
                                                            reg.volunteer?.full_name?.charAt(0) || "?"
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium truncate">{reg.volunteer?.full_name || "Relawan"}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {new Date(reg.registered_at).toLocaleDateString("id-ID", {
                                                                day: "numeric", month: "short", year: "numeric"
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {registrations.length > 10 && (
                                                <p className="text-xs text-center text-muted-foreground pt-1">
                                                    +{registrations.length - 10} relawan lainnya
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 py-6 text-center">
                                            <Users className="size-8 text-muted-foreground/40" />
                                            <p className="text-sm text-muted-foreground">Belum ada pendaftar</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function EventDetailPage() {
    return <EventDetailContent />
}
