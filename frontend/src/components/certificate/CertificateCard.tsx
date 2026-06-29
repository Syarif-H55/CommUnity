"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Award, Download, Loader2, CheckCircle2, Calendar, Building2, Hash, ExternalLink } from "lucide-react"
import type { Certificate } from "@/types"

interface CertificateCardProps {
    certificate: Certificate
    onDownload?: (id: string, filename: string) => void
    isDownloading?: boolean
    className?: string
}

function CertificateCard({ certificate, onDownload, isDownloading, className }: CertificateCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState<React.CSSProperties>({})
    const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({})

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -6
        const rotateY = ((x - centerX) / centerX) * 6

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: "transform 0.1s ease-out",
        })

        const glareX = (x / rect.width) * 100
        const glareY = (y / rect.height) * 100
        setGlareStyle({
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
        })
    }

    function handleMouseLeave() {
        setStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: "transform 0.5s ease-out",
        })
        setGlareStyle({})
    }

    const issuedDate = certificate.issued_at
        ? new Date(certificate.issued_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null

    const eventDate = certificate.event_date
        ? new Date(certificate.event_date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null

    return (
        <div
            ref={cardRef}
            className={cn("relative", className)}
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="relative overflow-hidden rounded-2xl border border-emerald-100/50 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/80 shadow-lg shadow-emerald-900/5 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-emerald-900/10 dark:from-emerald-950/20 dark:via-emerald-900/10 dark:to-emerald-950/20 dark:border-emerald-800/20"
                style={{ transformStyle: "preserve-3d", ...style }}
            >
                {/* Glare */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl" style={glareStyle} />

                {/* Decorative corner accents */}
                <div className="pointer-events-none absolute -top-1 -left-1 size-16">
                    <div className="absolute top-3 left-3 size-8 border-t-2 border-l-2 border-emerald-300/60 rounded-tl-lg" />
                </div>
                <div className="pointer-events-none absolute -top-1 -right-1 size-16">
                    <div className="absolute top-3 right-3 size-8 border-t-2 border-r-2 border-emerald-300/60 rounded-tr-lg" />
                </div>
                <div className="pointer-events-none absolute -bottom-1 -left-1 size-16">
                    <div className="absolute bottom-3 left-3 size-8 border-b-2 border-l-2 border-emerald-300/60 rounded-bl-lg" />
                </div>
                <div className="pointer-events-none absolute -bottom-1 -right-1 size-16">
                    <div className="absolute bottom-3 right-3 size-8 border-b-2 border-r-2 border-emerald-300/60 rounded-br-lg" />
                </div>

                {/* Decorative ribbon line */}
                <div className="pointer-events-none absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

                <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
                                <Award className="size-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-emerald-800 dark:text-emerald-200">
                                    Sertifikat Partisipasi
                                </h3>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {certificate.certificate_number}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 dark:bg-emerald-900/30">
                            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">Terverifikasi</span>
                        </div>
                    </div>

                    {/* Certificate Visual */}
                    <div className="relative mb-5 overflow-hidden rounded-xl border border-emerald-200/30 bg-gradient-to-br from-emerald-900 to-emerald-800 p-5 shadow-inner dark:from-emerald-950 dark:to-emerald-900">
                        {/* Decorative pattern */}
                        <div className="pointer-events-none absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 0%, transparent 50%)`
                            }} />
                        </div>

                        {/* Gold seal decoration */}
                        <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-gradient-to-br from-amber-300/20 to-amber-500/10 blur-xl" />
                        <div className="pointer-events-none absolute -bottom-4 -left-4 size-16 rounded-full bg-gradient-to-br from-emerald-300/10 to-emerald-500/5 blur-lg" />

                        <div className="relative text-center">
                            <Award className="mx-auto size-8 text-amber-400/80 mb-2" />
                            <h4 className="text-lg font-bold text-white/90 tracking-tight font-[family-name:var(--font-heading)]">
                                {certificate.volunteer_name || "Relawan"}
                            </h4>
                            <div className="mx-auto mt-2 h-px w-16 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
                            <p className="text-[11px] text-emerald-200/70 mt-2 leading-relaxed">
                                Telah berpartisipasi dalam kegiatan
                            </p>
                            <p className="text-sm font-semibold text-white mt-1">
                                {certificate.event_title}
                            </p>
                            {certificate.organization_name && (
                                <p className="text-[10px] text-emerald-200/60 mt-1">
                                    oleh {certificate.organization_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {eventDate && (
                            <div className="flex items-center gap-2 rounded-lg bg-emerald-100/40 px-3 py-2 dark:bg-emerald-900/20">
                                <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Tanggal Event</p>
                                    <p className="text-xs font-medium truncate">{eventDate}</p>
                                </div>
                            </div>
                        )}
                        {certificate.organization_name && (
                            <div className="flex items-center gap-2 rounded-lg bg-emerald-100/40 px-3 py-2 dark:bg-emerald-900/20">
                                <Building2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Organisasi</p>
                                    <p className="text-xs font-medium truncate">{certificate.organization_name}</p>
                                </div>
                            </div>
                        )}
                        {issuedDate && (
                            <div className="flex items-center gap-2 rounded-lg bg-emerald-100/40 px-3 py-2 dark:bg-emerald-900/20">
                                <ExternalLink className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Diterbitkan</p>
                                    <p className="text-xs font-medium truncate">{issuedDate}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-100/40 px-3 py-2 dark:bg-emerald-900/20">
                            <Hash className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">No. Sertifikat</p>
                                <p className="text-[10px] font-mono font-medium truncate">{certificate.certificate_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={() => {
                            if (onDownload && certificate.pdf_url) {
                                const filename = `sertifikat-${certificate.certificate_number}.pdf`
                                onDownload(certificate.id, filename)
                            }
                        }}
                        disabled={!certificate.pdf_url || isDownloading}
                        className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-98",
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
                                Unduh Sertifikat
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export { CertificateCard }
