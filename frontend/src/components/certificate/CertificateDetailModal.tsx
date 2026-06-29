"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { X, Award, Download, Loader2, CheckCircle2, Calendar, Building2, MapPin, Hash, ExternalLink, Users, Shield } from "lucide-react"
import type { Certificate } from "@/types"

interface CertificateDetailModalProps {
    certificate: Certificate | null
    open: boolean
    onClose: () => void
    onDownload?: (id: string, filename: string) => void
    isDownloading?: boolean
}

function CertificateDetailModal({ certificate, open, onClose, onDownload, isDownloading }: CertificateDetailModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [open])

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose()
        }
        if (open) {
            window.addEventListener("keydown", handleKeyDown)
            return () => window.removeEventListener("keydown", handleKeyDown)
        }
    }, [open, onClose])

    if (!open || !certificate) return null

    const issuedDate = certificate.issued_at
        ? new Date(certificate.issued_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : null

    const eventDate = certificate.event_date
        ? new Date(certificate.event_date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null

    const filename = `sertifikat-${certificate.certificate_number}.pdf`

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose()
            }}
        >
            <div className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-10 flex size-8 items-center justify-center rounded-full bg-white shadow-lg border border-border text-muted-foreground hover:text-foreground transition-all hover:scale-110 dark:bg-emerald-900 dark:border-emerald-800"
                >
                    <X className="size-4" />
                </button>

                {/* Certificate Display */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-2xl dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-emerald-950/30 border border-emerald-100/50 dark:border-emerald-800/20">
                    {/* Decorative top bar */}
                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />

                    <div className="p-6 md:p-8">
                        {/* Top Section */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
                                    <Award className="size-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 font-[family-name:var(--font-heading)]">
                                        Detail Sertifikat
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {certificate.certificate_number}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1.5 dark:bg-emerald-900/30">
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Terverifikasi</span>
                            </div>
                        </div>

                        {/* Large Certificate Visual */}
                        <div className="relative mb-6 overflow-hidden rounded-xl border border-emerald-200/30 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8 md:p-10 shadow-inner">
                            {/* Decorative Pattern */}
                            <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 40%),
                                                      radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0%, transparent 40%)`
                                }} />
                            </div>

                            {/* Corner decorations */}
                            <div className="pointer-events-none absolute top-4 left-4 size-12 border-t-2 border-l-2 border-emerald-300/20 rounded-tl-lg" />
                            <div className="pointer-events-none absolute top-4 right-4 size-12 border-t-2 border-r-2 border-emerald-300/20 rounded-tr-lg" />
                            <div className="pointer-events-none absolute bottom-4 left-4 size-12 border-b-2 border-l-2 border-emerald-300/20 rounded-bl-lg" />
                            <div className="pointer-events-none absolute bottom-4 right-4 size-12 border-b-2 border-r-2 border-emerald-300/20 rounded-br-lg" />

                            {/* Gold decorative elements */}
                            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 rounded-full border border-emerald-300/5" />
                            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-36 rounded-full border border-emerald-300/5" />

                            <div className="relative text-center">
                                <Award className="mx-auto size-10 text-amber-400/80 mb-3" />
                                <h3 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-heading)] tracking-tight">
                                    Sertifikat Partisipasi
                                </h3>
                                <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
                                <p className="text-sm text-emerald-200/70 mt-4">
                                    Diberikan kepada
                                </p>
                                <h4 className="text-xl md:text-2xl font-bold text-white mt-2 font-[family-name:var(--font-heading)]">
                                    {certificate.volunteer_name || "Relawan"}
                                </h4>
                                <p className="text-sm text-emerald-200/70 mt-3 leading-relaxed">
                                    Telah berpartisipasi dalam kegiatan
                                </p>
                                <p className="text-lg font-bold text-white mt-2">
                                    {certificate.event_title}
                                </p>
                                {certificate.organization_name && (
                                    <>
                                        <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />
                                        <p className="text-sm text-emerald-200/60 mt-3">
                                            Diselenggarakan oleh
                                        </p>
                                        <p className="text-base font-semibold text-emerald-200 mt-1">
                                            {certificate.organization_name}
                                        </p>
                                    </>
                                )}
                                {eventDate && (
                                    <p className="text-xs text-emerald-200/50 mt-4">
                                        {eventDate}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="rounded-xl bg-emerald-100/40 p-4 dark:bg-emerald-900/20 border border-emerald-200/20 dark:border-emerald-800/20">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Informasi Event</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <span className="text-xs text-foreground/80">{eventDate || "-"}</span>
                                    </div>
                                    {certificate.organization_name && (
                                        <div className="flex items-center gap-2">
                                            <Building2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            <span className="text-xs text-foreground/80">{certificate.organization_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="rounded-xl bg-emerald-100/40 p-4 dark:bg-emerald-900/20 border border-emerald-200/20 dark:border-emerald-800/20">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Detail Sertifikat</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <span className="text-xs font-mono text-foreground/80">{certificate.certificate_number}</span>
                                    </div>
                                    {issuedDate && (
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            <span className="text-xs text-foreground/80">{issuedDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <button
                                onClick={() => {
                                    if (onDownload && certificate.pdf_url) {
                                        onDownload(certificate.id, filename)
                                    }
                                }}
                                disabled={!certificate.pdf_url || isDownloading}
                                className={cn(
                                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all active:scale-98",
                                    certificate.pdf_url
                                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-500/30"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Mengunduh...
                                    </>
                                ) : (
                                    <>
                                        <Download className="size-4" />
                                        Unduh Sertifikat (PDF)
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 transition-all"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CertificateDetailModal }
