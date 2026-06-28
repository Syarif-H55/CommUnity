"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useEvent } from "@/hooks/useEvent"
import { useEventReport, useCreateReport, useUpdateReport, useUploadPhotos, useDeletePhoto, useSubmitReport, useAiGenerateReport } from "@/hooks/useReport"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ReportStatusBadge, PhotoUpload } from "@/components/report"
import type { PhotoItem } from "@/components/report"
import {
    Handshake, ArrowLeft, LogOut, Loader2, FileText, AlertCircle,
    CheckCircle2, XCircle, Send, Sparkles, Calendar, MapPin, Clock,
    Edit3, Eye, MessageSquare
} from "lucide-react"
import type { ReportStatus } from "@/types"

function ReportPageContent() {
    const params = useParams()
    const eventId = params.id as string
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()

    const { data: event, isLoading: eventLoading } = useEvent(eventId)
    const { data: report, isLoading: reportLoading } = useEventReport(eventId)
    const createReport = useCreateReport(eventId)
    const updateReport = useUpdateReport(eventId)
    const uploadPhotos = useUploadPhotos(eventId)
    const deletePhoto = useDeletePhoto(eventId)
    const submitReport = useSubmitReport(eventId)
    const aiGenerate = useAiGenerateReport(eventId)

    const [summary, setSummary] = useState("")
    const [totalAttendees, setTotalAttendees] = useState("")
    const [photos, setPhotos] = useState<PhotoItem[]>([])
    const [serverError, setServerError] = useState<string | null>(null)
    const [showAiModal, setShowAiModal] = useState(false)
    const [aiDraft, setAiDraft] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
    const [aiError, setAiError] = useState<string | null>(null)
    const [additionalNotes, setAdditionalNotes] = useState("")
    const [showAiNotes, setShowAiNotes] = useState(false)

    useEffect(() => {
        if (report) {
            setSummary(report.summary || "")
            setTotalAttendees(report.total_attendees?.toString() || "")
            setPhotos(
                report.photos.map((p) => ({
                    id: p.id,
                    preview: p.image_url,
                    isExisting: true,
                }))
            )
        }
    }, [report])

    const isEditable = report
        ? (report.report_status === "draft" || report.report_status === "revision_requested")
        : true

    const canSubmit = report
        ? (report.report_status === "draft" || report.report_status === "revision_requested")
        : false

    const isReadOnly = report
        ? (report.report_status === "submitted" || report.report_status === "approved")
        : false

    if (eventLoading || reportLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat laporan...</p>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="py-12">
                        <XCircle className="mx-auto size-12 text-destructive mb-4" />
                        <CardTitle className="text-lg">Event Tidak Ditemukan</CardTitle>
                        <CardDescription className="mt-2">Event tidak tersedia atau telah dihapus.</CardDescription>
                        <Link
                            href="/events"
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

    const handleAddPhotos = (files: File[]) => {
        const newItems = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            isExisting: false,
        }))
        setPhotos((prev) => [...prev, ...newItems].slice(0, 5))
    }

    const handleRemovePhoto = async (index: number) => {
        const photo = photos[index]
        if (photo.isExisting && photo.id) {
            deletePhoto.mutate(photo.id, {
                onSuccess: () => {
                    setPhotos((prev) => prev.filter((_, i) => i !== index))
                },
            })
        } else {
            setPhotos((prev) => prev.filter((_, i) => i !== index))
        }
    }

    const handleSaveDraft = () => {
        setServerError(null)
        const newPhotos = photos.filter((p) => !p.isExisting && p.file).map((p) => p.file!) as File[]

        if (report) {
            updateReport.mutate(
                { summary, total_attendees: parseInt(totalAttendees) || 0 },
                {
                    onSuccess: async () => {
                        if (newPhotos.length > 0) {
                            uploadPhotos.mutate(newPhotos)
                        }
                    },
                    onError: (error: any) => {
                        setServerError(error?.response?.data?.message || "Gagal menyimpan laporan.")
                    },
                }
            )
        } else {
            createReport.mutate(
                { summary, total_attendees: parseInt(totalAttendees) || 0, photos: newPhotos.length > 0 ? newPhotos : undefined },
                {
                    onError: (error: any) => {
                        setServerError(error?.response?.data?.message || "Gagal membuat laporan.")
                    },
                }
            )
        }
    }

    const handleSubmit = () => {
        setServerError(null)
        submitReport.mutate(undefined, {
            onError: (error: any) => {
                setServerError(error?.response?.data?.message || "Gagal mengirim laporan.")
            },
        })
    }

    const handleAiGenerate = () => {
        setAiLoading(true)
        setAiError(null)
        setShowAiModal(false)
        aiGenerate.mutate(additionalNotes || undefined, {
            onSuccess: (response) => {
                setAiDraft(response.data.data?.summary || "")
                setShowAiModal(true)
                setAiLoading(false)
            },
            onError: (error: any) => {
                setAiError(error?.response?.data?.message || "Gagal menghasilkan draft AI.")
                setAiLoading(false)
            },
        })
    }

    const handleUseAiDraft = () => {
        setSummary(aiDraft)
        setShowAiModal(false)
    }

    const handleAiEditComplete = (editedDraft: string) => {
        setAiDraft(editedDraft)
    }

    const isMutationLoading = createReport.isPending || updateReport.isPending || uploadPhotos.isPending || deletePhoto.isPending || submitReport.isPending

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/events/${eventId}`}
                            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                            <Handshake className="size-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-semibold tracking-tight block leading-tight">Laporan Kegiatan</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px] block">{event.title}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {report && (
                            <ReportStatusBadge status={report.report_status as ReportStatus} />
                        )}
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

                {report?.rejection_reason && report.report_status === "revision_requested" && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-900/30 dark:bg-amber-950/30">
                        <MessageSquare className="size-5 shrink-0 text-amber-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Revisi Diminta</p>
                            <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">{report.rejection_reason}</p>
                        </div>
                    </div>
                )}

                {/* Event Info Bar */}
                <Card className="border-emerald-100/50 shadow-sm">
                    <CardContent className="p-4 flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-4 text-emerald-600" />
                            {dateStr}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="size-4 text-emerald-600" />
                            {event.start_time} - {event.end_time}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="size-4 text-emerald-600" />
                            {event.location_name}
                        </span>
                    </CardContent>
                </Card>

                {/* Report Content */}
                <Card className="border-emerald-100/50 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="size-4 text-emerald-600" />
                                    {report ? "Edit Laporan" : "Buat Laporan"}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {report
                                        ? "Perbarui laporan kegiatan sebelum dikirim"
                                        : "Isi laporan pelaksanaan kegiatan sosial"}
                                </CardDescription>
                            </div>
                            {isEditable && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAiNotes(!showAiNotes)}
                                        className="gap-1.5 text-xs text-muted-foreground"
                                    >
                                        <MessageSquare className="size-3.5" />
                                        Catatan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAiGenerate}
                                        disabled={aiLoading || isMutationLoading}
                                        className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                    >
                                        {aiLoading ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="size-4" />
                                        )}
                                        Generate AI
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="summary" className="text-sm font-medium">
                                Ringkasan Kegiatan
                            </Label>
                            <Textarea
                                id="summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Jelaskan jalannya kegiatan, capaian, dan hal-hal penting lainnya..."
                                rows={6}
                                disabled={isReadOnly}
                                className="resize-y min-h-[150px]"
                            />
                            <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">
                                    Jelaskan secara rinci pelaksanaan kegiatan
                                </span>
                                <span className="text-xs text-muted-foreground">{summary.length} karakter</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="total_attendees" className="text-sm font-medium">
                                Jumlah Peserta Hadir
                            </Label>
                            <Input
                                id="total_attendees"
                                type="number"
                                min={0}
                                value={totalAttendees}
                                onChange={(e) => setTotalAttendees(e.target.value)}
                                placeholder="Contoh: 50"
                                disabled={isReadOnly}
                                className="max-w-xs"
                            />
                        </div>

                        <PhotoUpload
                            photos={photos}
                            onAdd={handleAddPhotos}
                            onRemove={handleRemovePhoto}
                            maxPhotos={5}
                            disabled={isReadOnly || deletePhoto.isPending}
                        />

                        {showAiNotes && isEditable && (
                            <div className="space-y-2 pt-2 border-t border-border/50">
                                <Label htmlFor="ai_notes" className="text-sm font-medium flex items-center gap-1.5">
                                    <MessageSquare className="size-3.5 text-emerald-600" />
                                    Catatan untuk AI
                                </Label>
                                <Textarea
                                    id="ai_notes"
                                    value={additionalNotes}
                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                    placeholder="Tambahkan catatan khusus untuk membantu AI menghasilkan draft yang lebih sesuai..."
                                    rows={2}
                                    className="text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Catatan ini akan dikirim bersama data event ke AI untuk menghasilkan draft yang lebih akurat.
                                </p>
                            </div>
                        )}

                        {aiError && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                <AlertCircle className="size-4 shrink-0" />
                                <span>{aiError}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Preview Modal */}
                {showAiModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-2xl border-emerald-100/50 shadow-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Sparkles className="size-4 text-emerald-600" />
                                        Draft AI Report
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAiModal(false)}
                                    >
                                        <XCircle className="size-4" />
                                    </Button>
                                </div>
                                <CardDescription>
                                    Review dan edit draft yang dihasilkan AI sebelum digunakan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    value={aiDraft}
                                    onChange={(e) => handleAiEditComplete(e.target.value)}
                                    rows={12}
                                    className="resize-y min-h-[200px] font-mono text-sm"
                                />
                            </CardContent>
                            <div className="flex items-center justify-end gap-2 px-6 pb-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAiModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleUseAiDraft}
                                    className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
                                >
                                    <CheckCircle2 className="size-4" />
                                    Gunakan Draft Ini
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Action Buttons */}
                {isEditable && (
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={isMutationLoading}
                            className="gap-2"
                        >
                            {isMutationLoading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Edit3 className="size-4" />
                            )}
                            Simpan Draft
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isMutationLoading || summary.trim().length < 20 || photos.length === 0}
                            className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-900/20"
                        >
                            {submitReport.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Send className="size-4" />
                            )}
                            Kirim Laporan
                        </Button>
                    </div>
                )}

                {/* Submitted State */}
                {report?.report_status === "submitted" && (
                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/20">
                        <CardContent className="flex items-start gap-4 py-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Send className="size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                    Laporan Telah Dikirim
                                </h4>
                                <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                                    Laporan sedang menunggu review dari Penyelenggara.
                                </p>
                                {report.submitted_at && (
                                    <p className="text-xs text-blue-500/70 mt-2">
                                        Dikirim pada {new Date(report.submitted_at).toLocaleDateString("id-ID", {
                                            weekday: "long", year: "numeric", month: "long", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Approved State */}
                {report?.report_status === "approved" && (
                    <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                        <CardContent className="flex items-start gap-4 py-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                    Laporan Disetujui
                                </h4>
                                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                                    Event telah selesai dan laporan kegiatan telah disetujui.
                                </p>
                                {report.approved_at && (
                                    <p className="text-xs text-emerald-500/70 mt-2">
                                        Disetujui pada {new Date(report.approved_at).toLocaleDateString("id-ID", {
                                            weekday: "long", year: "numeric", month: "long", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                )}
                            </div>
                            <Link href={`/events/${eventId}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Eye className="size-4" />
                                    Detail Event
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Hint text */}
                {!report && (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-5 py-4 dark:border-emerald-900/20 dark:bg-emerald-950/10">
                        <AlertCircle className="size-5 shrink-0 text-emerald-600 mt-0.5" />
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>Minimal <strong>1 foto</strong> dokumentasi wajib diunggah sebelum mengirim laporan.</p>
                            <p>Maksimal <strong>5 foto</strong> diperbolehkan.</p>
                            <p>Gunakan tombol <strong>Generate AI</strong> untuk membuat draft laporan secara otomatis berdasarkan data event dan kehadiran.</p>
                        </div>
                    </div>
                )}

                {/* Review Link for organizers */}
                {report?.report_status === "submitted" && (
                    <div className="flex justify-center">
                        <Link href={`/events/${eventId}/report/review`}>
                            <Button variant="outline" className="gap-2">
                                <CheckCircle2 className="size-4" />
                                Review Laporan (Penyelenggara)
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function ReportPage() {
    return <ReportPageContent />
}
