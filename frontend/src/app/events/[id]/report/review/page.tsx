"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useEvent } from "@/hooks/useEvent"
import { useEventReport, useReviewReport } from "@/hooks/useReport"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ReportStatusBadge } from "@/components/report"
import {
    Handshake, ArrowLeft, LogOut, Loader2, FileText, AlertCircle,
    CheckCircle2, XCircle, Send, Calendar, MapPin, Clock, MessageSquare,
    ThumbsUp, ThumbsDown, User, Image
} from "lucide-react"
import type { ReportStatus } from "@/types"

function ReviewReportContent() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()

    const { data: event, isLoading: eventLoading } = useEvent(eventId)
    const { data: report, isLoading: reportLoading } = useEventReport(eventId)
    const reviewReport = useReviewReport(eventId)

    const [action, setAction] = useState<"approved" | "revision_requested" | null>(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const [serverError, setServerError] = useState<string | null>(null)

    if (eventLoading || reportLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat data...</p>
                </div>
            </div>
        )
    }

    if (!event || !report) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="py-12">
                        <XCircle className="mx-auto size-12 text-destructive mb-4" />
                        <CardTitle className="text-lg">Data Tidak Ditemukan</CardTitle>
                        <CardDescription className="mt-2">
                            Event atau laporan tidak ditemukan.
                        </CardDescription>
                        <Link
                            href={`/events/${eventId}`}
                            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted transition-all"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const eventDate = new Date(event.event_date)
    const dateStr = eventDate.toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    })

    const handleReview = () => {
        if (!action) return

        if (action === "revision_requested" && !rejectionReason.trim()) {
            setServerError("Alasan revisi wajib diisi.")
            return
        }

        setServerError(null)
        reviewReport.mutate(
            { action, rejection_reason: action === "revision_requested" ? rejectionReason : undefined },
            {
                onSuccess: () => {
                    router.push(`/events/${eventId}`)
                },
                onError: (error: any) => {
                    setServerError(error?.response?.data?.message || "Gagal melakukan review.")
                },
            }
        )
    }

    const isReviewed = report.report_status === "approved" || report.report_status === "revision_requested"

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/events/${eventId}/report`}
                            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                            <Handshake className="size-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-semibold tracking-tight block leading-tight">Review Laporan</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px] block">{event.title}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ReportStatusBadge status={report.report_status as ReportStatus} />
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

            <main className="mx-auto max-w-4xl px-6 py-8 space-y-6">
                {serverError && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                        <AlertCircle className="size-5 shrink-0" />
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Event Info */}
                <Card className="border-emerald-100/50 shadow-sm">
                    <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Handshake className="size-4 text-emerald-600" />
                            {event.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="size-3.5" />
                                {dateStr}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {event.start_time} - {event.end_time}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="size-3.5" />
                                {event.location_name}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Detail */}
                <Card className="border-emerald-100/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="size-4 text-emerald-600" />
                            Laporan Kegiatan
                        </CardTitle>
                        {report.submitter_name && (
                            <CardDescription className="flex items-center gap-1.5">
                                <User className="size-3.5" />
                                Dikirim oleh: {report.submitter_name}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">Ringkasan Kegiatan</h4>
                            <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                                {report.summary || "Tidak ada ringkasan."}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Peserta Hadir:</span>
                            <span className="text-sm font-semibold">{report.total_attendees || 0} orang</span>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                                <Image className="size-4" />
                                Dokumentasi ({report.photos.length} foto)
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {report.photos.map((photo) => (
                                    <a
                                        key={photo.id}
                                        href={photo.image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                                    >
                                        <img
                                            src={photo.image_url}
                                            alt="Dokumentasi"
                                            className="size-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Review Actions */}
                {!isReviewed && report.report_status === "submitted" && (
                    <Card className="border-emerald-100/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-emerald-600" />
                                Review Laporan
                            </CardTitle>
                            <CardDescription>
                                Setujui laporan atau minta revisi jika ada yang perlu diperbaiki
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {action === "revision_requested" && (
                                <div className="space-y-2">
                                    <Label htmlFor="rejection_reason" className="text-sm font-medium">
                                        Alasan Revisi <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="rejection_reason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Jelaskan apa yang perlu diperbaiki dalam laporan..."
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    variant={action === "approved" ? "default" : "outline"}
                                    onClick={() => { setAction("approved"); setServerError(null) }}
                                    className={cn(
                                        "gap-2",
                                        action === "approved" && "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    )}
                                >
                                    <ThumbsUp className="size-4" />
                                    Setujui
                                </Button>
                                <Button
                                    variant={action === "revision_requested" ? "default" : "outline"}
                                    onClick={() => { setAction("revision_requested"); setServerError(null) }}
                                    className={cn(
                                        "gap-2",
                                        action === "revision_requested" && "bg-amber-600 hover:bg-amber-700 text-white"
                                    )}
                                >
                                    <ThumbsDown className="size-4" />
                                    Minta Revisi
                                </Button>
                            </div>

                            {action && (
                                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                                    <Button
                                        onClick={handleReview}
                                        disabled={reviewReport.isPending}
                                        className="gap-2"
                                    >
                                        {reviewReport.isPending ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Send className="size-4" />
                                        )}
                                        {action === "approved" ? "Setujui Laporan" : "Kirim Permintaan Revisi"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => { setAction(null); setRejectionReason("") }}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Already Reviewed */}
                {isReviewed && (
                    <Card className={cn(
                        "border",
                        report.report_status === "approved"
                            ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20"
                            : "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20"
                    )}>
                        <CardContent className="flex items-start gap-4 py-5">
                            <div className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                                report.report_status === "approved"
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            )}>
                                {report.report_status === "approved" ? (
                                    <CheckCircle2 className="size-5" />
                                ) : (
                                    <MessageSquare className="size-5" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">
                                    {report.report_status === "approved" ? "Laporan Disetujui" : "Revisi Diminta"}
                                </h4>
                                {report.rejection_reason && (
                                    <p className="text-sm text-muted-foreground mt-1">{report.rejection_reason}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}

import { cn } from "@/lib/utils"

export default function ReviewReportPage() {
    return <ReviewReportContent />
}
