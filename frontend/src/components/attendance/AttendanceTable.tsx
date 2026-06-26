"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Search, X, ChevronLeft, ChevronRight, Loader2, Users, Clock, UserCheck } from "lucide-react"
import { AttendanceStatusBadge } from "./AttendanceStatusBadge"
import type { Attendance } from "@/types"

interface AttendanceTableProps {
    attendances: Attendance[]
    isLoading?: boolean
    total?: number
    currentPage?: number
    lastPage?: number
    onPageChange?: (page: number) => void
    onFilterChange?: (status: string | null) => void
    activeFilter?: string | null
}

function AttendanceTable({
    attendances,
    isLoading,
    total = 0,
    currentPage = 1,
    lastPage = 1,
    onPageChange,
    onFilterChange,
    activeFilter,
}: AttendanceTableProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredAttendances = useMemo(() => {
        if (!searchQuery.trim()) return attendances
        const query = searchQuery.toLowerCase()
        return attendances.filter((a) =>
            a.volunteer.full_name.toLowerCase().includes(query) ||
            a.volunteer.username.toLowerCase().includes(query)
        )
    }, [attendances, searchQuery])

    const filterOptions = [
        { value: null, label: "Semua", icon: Users },
        { value: "present", label: "Hadir", icon: UserCheck },
        { value: "late", label: "Terlambat", icon: Clock },
        { value: "absent", label: "Tidak Hadir", icon: X },
    ]

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                        <p className="mt-3 text-sm text-muted-foreground">Memuat data kehadiran...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari relawan..."
                        className="flex h-9 w-full rounded-lg border border-border bg-background pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {filterOptions.map((option) => {
                        const Icon = option.icon
                        const isActive = activeFilter === option.value
                        return (
                            <button
                                key={String(option.value)}
                                onClick={() => onFilterChange?.(option.value)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all border",
                                    isActive
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                        : "bg-background text-muted-foreground border-border hover:border-emerald-200 hover:text-foreground"
                                )}
                            >
                                <Icon className="size-3.5" />
                                {option.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Table */}
            {filteredAttendances.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Relawan</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Username</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredAttendances.map((attendance) => (
                                    <tr
                                        key={attendance.id}
                                        className="group transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                                                    attendance.attendance_status === "present" && "bg-emerald-500",
                                                    attendance.attendance_status === "late" && "bg-amber-500",
                                                    attendance.attendance_status === "absent" && "bg-red-400",
                                                )}>
                                                    {attendance.volunteer.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium truncate max-w-[160px]">
                                                    {attendance.volunteer.full_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="text-xs text-muted-foreground">
                                                @{attendance.volunteer.username}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <AttendanceStatusBadge status={attendance.attendance_status} size="md" />
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-xs text-muted-foreground">
                                                {attendance.attendance_time
                                                    ? new Date(attendance.attendance_time).toLocaleTimeString("id-ID", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "-"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                        <Users className="size-8 text-muted-foreground/50" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Belum Ada Data Kehadiran</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {searchQuery || activeFilter
                                ? "Tidak ada data yang sesuai dengan filter"
                                : "Belum ada relawan yang melakukan absensi"}
                        </p>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        {total} data kehadiran
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange?.(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="inline-flex items-center justify-center rounded-lg size-8 border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        {Array.from({ length: lastPage }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1)
                            .map((p, idx, arr) => (
                                <span key={p} className="flex items-center">
                                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                                        <span className="px-1 text-xs text-muted-foreground">...</span>
                                    )}
                                    <button
                                        onClick={() => onPageChange?.(p)}
                                        className={cn(
                                            "inline-flex items-center justify-center rounded-lg size-8 text-sm font-medium transition-all",
                                            p === currentPage
                                                ? "bg-emerald-600 text-white"
                                                : "border border-border text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {p}
                                    </button>
                                </span>
                            ))}
                        <button
                            onClick={() => onPageChange?.(currentPage + 1)}
                            disabled={currentPage >= lastPage}
                            className="inline-flex items-center justify-center rounded-lg size-8 border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export { AttendanceTable }
