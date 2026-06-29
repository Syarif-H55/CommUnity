"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useMyRegistrations } from "@/hooks/useVolunteer"
import { EventStatusBadge } from "@/components/event"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Loader2, Calendar, MapPin, Clock,
    Users, Search, X, CheckCircle2, History, Sparkles,
    ChevronLeft, ChevronRight, Building2
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { VolunteerRegistration } from "@/types"

const STATUS_OPTIONS = [
    { value: "", label: "Semua" },
    { value: "published", label: "Akan Datang" },
    { value: "ongoing", label: "Berlangsung" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
]

function RegistrationsContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(1)

    const filters = useMemo(() => ({
        status: statusFilter || undefined,
        per_page: 10,
        page,
    }), [statusFilter, page])

    const { data: paginatedData, isLoading } = useMyRegistrations(filters)

    const registrations = paginatedData?.data ?? []
    const total = paginatedData?.total ?? 0
    const lastPage = paginatedData?.last_page ?? 1
    const currentPage = paginatedData?.current_page ?? 1

    const filteredRegistrations = useMemo(() => {
        if (!searchQuery.trim()) return registrations

        const query = searchQuery.toLowerCase()
        return registrations.filter((reg) =>
            reg.event.title.toLowerCase().includes(query) ||
            (reg.event.location_name && reg.event.location_name.toLowerCase().includes(query)) ||
            (reg.event.organization_name && reg.event.organization_name.toLowerCase().includes(query))
        )
    }, [registrations, searchQuery])

    const activeFilters = [searchQuery, statusFilter].filter(Boolean).length

    function goToPage(p: number) {
        if (p >= 1 && p <= lastPage) setPage(p)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const pageNumbers = useMemo(() => {
        const pages: (number | "ellipsis")[] = []
        const delta = 2
        const left = Math.max(2, currentPage - delta)
        const right = Math.min(lastPage - 1, currentPage + delta)
        pages.push(1)
        if (left > 2) pages.push("ellipsis")
        for (let i = left; i <= right; i++) pages.push(i)
        if (right < lastPage - 1) pages.push("ellipsis")
        if (lastPage > 1) pages.push(lastPage)
        return pages
    }, [currentPage, lastPage])

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <History className="size-6 text-emerald-600" />
                            Riwayat Partisipasi
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Lihat semua kegiatan sosial yang pernah Anda ikuti
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="size-4" />
                        <span>{total} kegiatan</span>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                            placeholder="Cari berdasarkan judul, lokasi, atau penyelenggara..."
                            className="flex h-10 w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => { setStatusFilter(opt.value); setPage(1) }}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-3 h-9 text-sm font-medium whitespace-nowrap transition-all border",
                                    statusFilter === opt.value
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                        : "bg-background text-muted-foreground border-border hover:border-emerald-200 hover:text-emerald-600"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                            <p className="mt-3 text-sm text-muted-foreground">Memuat riwayat partisipasi...</p>
                        </div>
                    </div>
                ) : filteredRegistrations.length > 0 ? (
                    <div className="space-y-4">
                        {filteredRegistrations.map((reg) => (
                            <RegistrationCard key={reg.id} registration={reg} />
                        ))}
                    </div>
                ) : (
                    <Card className="border-emerald-100/50 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <History className="size-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-center max-w-sm">
                                <CardTitle className="text-lg">Belum Ada Partisipasi</CardTitle>
                                <CardDescription className="mt-1">
                                    {activeFilters > 0
                                        ? "Tidak ada riwayat yang sesuai dengan filter yang dipilih."
                                        : "Anda belum mengikuti kegiatan sosial apapun. Jelajahi dan daftar pada kegiatan yang tersedia."}
                                </CardDescription>
                            </div>
                            {activeFilters > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSearchQuery(""); setStatusFilter(""); setPage(1) }}
                                    className="gap-1.5 mt-2"
                                >
                                    <X className="size-4" />
                                    Hapus Semua Filter
                                </Button>
                            )}
                            {activeFilters === 0 && (
                                <Link
                                    href="/discover"
                                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-4 h-9 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm mt-2"
                                >
                                    <Sparkles className="size-4" />
                                    Jelajahi Kegiatan
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {lastPage > 1 && filteredRegistrations.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 py-6">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 h-9 text-sm font-medium transition-all hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="size-4" />
                            <span className="hidden sm:inline ml-1">Sebelumnya</span>
                        </button>

                        <div className="flex items-center gap-1">
                            {pageNumbers.map((p, idx) =>
                                p === "ellipsis" ? (
                                    <span key={`e-${idx}`} className="flex items-center justify-center size-9 text-sm text-muted-foreground">...</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={cn(
                                            "inline-flex items-center justify-center rounded-lg size-9 text-sm font-medium transition-all",
                                            p === currentPage
                                                ? "bg-emerald-600 text-white shadow-sm"
                                                : "border border-border bg-background hover:bg-muted text-foreground"
                                        )}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage >= lastPage}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 h-9 text-sm font-medium transition-all hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="hidden sm:inline mr-1">Selanjutnya</span>
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}

function RegistrationCard({ registration }: { registration: VolunteerRegistration }) {
    const event = registration.event
    const eventDate = new Date(event.event_date)
    const isUpcoming = eventDate >= new Date()
    const dateStr = eventDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <Link href={`/discover/${event.id}`}>
            <div className="group flex items-start gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/30">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="size-6" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {event.title}
                            </h3>
                            {event.organization_name && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Building2 className="size-3" />
                                    {event.organization_name}
                                </p>
                            )}
                        </div>
                        <EventStatusBadge status={event.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {dateStr}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {event.start_time} - {event.end_time}
                        </span>
                        {event.location_name && (
                            <span className="flex items-center gap-1">
                                <MapPin className="size-3.5" />
                                {event.location_name}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Users className="size-3.5" />
                            {event.current_participants}/{event.quota} peserta
                        </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            Terdaftar
                        </span>
                        {event.status === "published" && isUpcoming && (
                            <Badge variant="success" className="text-[10px] px-2 py-0.5">
                                Akan Datang
                            </Badge>
                        )}
                        {event.status === "completed" && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                                Selesai
                            </Badge>
                        )}
                        {event.status === "cancelled" && (
                            <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                                Dibatalkan
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function RegistrationsPage() {
    return <RegistrationsContent />
}
