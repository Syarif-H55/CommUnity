"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import AuthGuard from "@/components/auth/AuthGuard"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useMyAttendances } from "@/hooks/useAttendance"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AttendanceStatusBadge } from "@/components/attendance"
import {
    Handshake, ArrowLeft, LogOut, Loader2, Calendar, MapPin, Clock,
    CheckCircle2, XCircle, Search, Filter, Building2, User, Shield,
    History, ChevronRight, ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

function MyAttendancesContent() {
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()

    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const { data: attendancesPage, isLoading } = useMyAttendances()

    const attendances = attendancesPage?.data || []

    const filteredAttendances = useMemo(() => {
        let result = attendances

        if (selectedStatus) {
            result = result.filter((a) => a.attendance_status === selectedStatus)
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter((a) =>
                a.event?.title.toLowerCase().includes(query) ||
                a.event?.location_name?.toLowerCase().includes(query)
            )
        }

        return result
    }, [attendances, selectedStatus, searchQuery])

    const stats = useMemo(() => ({
        total: attendances.length,
        present: attendances.filter((a) => a.attendance_status === "present").length,
        late: attendances.filter((a) => a.attendance_status === "late").length,
        absent: attendances.filter((a) => a.attendance_status === "absent").length,
    }), [attendances])

    const filterOptions = [
        { value: null, label: "Semua", color: "bg-emerald-600" },
        { value: "present", label: "Hadir", color: "bg-emerald-500" },
        { value: "late", label: "Terlambat", color: "bg-amber-500" },
        { value: "absent", label: "Tidak Hadir", color: "bg-red-400" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex size-9 items-center justify-center rounded-xl bg-emerald-600"
                        >
                            <Handshake className="size-5 text-white" />
                        </Link>
                        <span className="text-lg font-semibold tracking-tight">Riwayat Kehadiran Saya</span>
                    </div>

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
            </header>

            <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                    <div className="relative flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                            <History className="size-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Riwayat Kehadiran</h1>
                            <p className="text-emerald-100/70 text-sm mt-1">
                                Lihat semua catatan kehadiran Anda pada berbagai event
                            </p>
                        </div>
                    </div>

                    {/* Mini Stats */}
                    <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Total Event", value: stats.total, icon: Calendar },
                            { label: "Hadir", value: stats.present, icon: CheckCircle2, color: "text-emerald-300" },
                            { label: "Terlambat", value: stats.late, icon: Clock, color: "text-amber-300" },
                            { label: "Tidak Hadir", value: stats.absent, icon: XCircle, color: "text-red-300" },
                        ].map((stat) => {
                            const Icon = stat.icon
                            return (
                                <div key={stat.label} className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Icon className={cn("size-3.5", stat.color || "text-emerald-200")} />
                                        <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                    <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative flex-1 w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari event..."
                            className="flex h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {filterOptions.map((option) => (
                            <button
                                key={String(option.value)}
                                onClick={() => setSelectedStatus(option.value)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all border",
                                    selectedStatus === option.value
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                        : "bg-background text-muted-foreground border-border hover:border-emerald-200 hover:text-foreground"
                                )}
                            >
                                <span className={cn("size-2 rounded-full", option.color)} />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Attendance List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-8 animate-spin text-emerald-600" />
                    </div>
                ) : filteredAttendances.length > 0 ? (
                    <div className="space-y-3">
                        {filteredAttendances.map((attendance) => {
                            const eventDate = attendance.event ? new Date(attendance.event.event_date) : null
                            return (
                                <Link
                                    key={attendance.id}
                                    href={attendance.event ? `/discover/${attendance.event_id}` : "#"}
                                    className="group block"
                                >
                                    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/30">
                                        <div className={cn(
                                            "flex flex-col items-center justify-center size-14 shrink-0 rounded-xl text-white",
                                            attendance.attendance_status === "present" && "bg-gradient-to-br from-emerald-500 to-emerald-700",
                                            attendance.attendance_status === "late" && "bg-gradient-to-br from-amber-500 to-amber-700",
                                            attendance.attendance_status === "absent" && "bg-gradient-to-br from-red-400 to-red-600",
                                        )}>
                                            {eventDate && (
                                                <>
                                                    <span className="text-lg font-bold">{eventDate.getDate()}</span>
                                                    <span className="text-[10px] uppercase leading-tight">
                                                        {eventDate.toLocaleDateString("id-ID", { month: "short" })}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="text-sm font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {attendance.event?.title || "Event"}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                                        {attendance.event?.location_name && (
                                                            <>
                                                                <MapPin className="size-3" />
                                                                {attendance.event.location_name}
                                                            </>
                                                        )}
                                                        {attendance.attendance_time && (
                                                            <>
                                                                {attendance.event?.location_name && <span>·</span>}
                                                                <Clock className="size-3" />
                                                                {new Date(attendance.attendance_time).toLocaleTimeString("id-ID", {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <AttendanceStatusBadge status={attendance.attendance_status} />
                                                    <ChevronRight className="size-4 text-emerald-500 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="border-emerald-100/50 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <History className="size-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-center">
                                <CardTitle className="text-lg">Belum Ada Riwayat Kehadiran</CardTitle>
                                <CardDescription className="mt-1">
                                    {searchQuery || selectedStatus
                                        ? "Tidak ada data kehadiran yang sesuai dengan filter"
                                        : "Anda belum memiliki catatan kehadiran pada event apapun"}
                                </CardDescription>
                            </div>
                            {!searchQuery && !selectedStatus && (
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
        </div>
    )
}

export default function MyAttendancesPage() {
    return (
        <AuthGuard>
            <MyAttendancesContent />
        </AuthGuard>
    )
}
