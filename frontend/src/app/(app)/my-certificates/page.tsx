"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useMyCertificates, useDownloadCertificate } from "@/hooks/useCertificate"
import { CertificateCard } from "@/components/certificate"
import { CertificateDetailModal } from "@/components/certificate"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
    Loader2, Award, Search, ExternalLink
} from "lucide-react"
import type { Certificate } from "@/types"

function MyCertificatesContent() {
    const { data: certPage, isLoading } = useMyCertificates()
    const downloadCert = useDownloadCertificate()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

    const certificates = certPage?.data || []

    const filteredCerts = useMemo(() => {
        if (!searchQuery.trim()) return certificates
        const q = searchQuery.toLowerCase()
        return certificates.filter((c) =>
            c.event_title?.toLowerCase().includes(q) ||
            c.organization_name?.toLowerCase().includes(q) ||
            c.certificate_number.toLowerCase().includes(q)
        )
    }, [certificates, searchQuery])

    const stats = useMemo(() => ({
        total: certificates.length,
    }), [certificates])

    const handleDownload = (id: string, filename: string) => {
        downloadCert.mutate({ id, filename })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                    <div className="absolute inset-0 opacity-[0.04]">
                        <div className="absolute top-5 right-10 text-[120px] font-bold text-white leading-none select-none">
                            <Award className="size-20 opacity-20" />
                        </div>
                    </div>
                    <div className="relative flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                            <Award className="size-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Sertifikat Saya</h1>
                            <p className="text-emerald-100/70 text-sm mt-1">
                                Kumpulan sertifikat partisipasi dari event yang telah Anda ikuti
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                            <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">Total Sertifikat</p>
                            <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
                        </div>
                        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                            <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">Telah Diunduh</p>
                            <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
                        </div>
                        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                            <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">Status</p>
                            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-300 mt-1">
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                                </span>
                                Terverifikasi
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative flex-1 w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari sertifikat (event, organisasi)..."
                            className="flex h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border hover:bg-muted transition-all"
                        >
                            Hapus Filter
                        </button>
                    )}
                </div>

                {/* Certificate Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                            <p className="mt-4 text-sm text-muted-foreground">Memuat sertifikat...</p>
                        </div>
                    </div>
                ) : filteredCerts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCerts.map((cert, index) => (
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
                                    {searchQuery
                                        ? "Tidak ada sertifikat yang sesuai dengan pencarian"
                                        : "Anda belum memiliki sertifikat. Sertifikat akan diterbitkan setelah event selesai dan laporan disetujui."}
                                </CardDescription>
                            </div>
                            {!searchQuery && (
                                <Link
                                    href="/discover"
                                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-4 h-9 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm mt-2"
                                >
                                    <ExternalLink className="size-4" />
                                    Temukan Event
                                </Link>
                            )}
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

export default function MyCertificatesPage() {
    return <MyCertificatesContent />
}
