"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Search, X, CheckCircle2, Clock, UserCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AttendanceStatus, User } from "@/types"

interface VolunteerOption {
    id: string
    volunteer_id: string
    volunteer: Pick<User, 'id' | 'full_name' | 'username' | 'profile_photo_url'>
}

interface AttendanceManualFormProps {
    volunteers: VolunteerOption[]
    isLoading?: boolean
    onMarkAttendance: (volunteerId: string, status: AttendanceStatus) => void
    isSubmitting?: boolean
}

const statusOptions: { value: AttendanceStatus; label: string; icon: React.ReactNode; gradient: string }[] = [
    { value: "present", label: "Hadir", icon: <CheckCircle2 className="size-4" />, gradient: "from-emerald-600 to-emerald-500" },
    { value: "late", label: "Terlambat", icon: <Clock className="size-4" />, gradient: "from-amber-600 to-amber-500" },
    { value: "absent", label: "Tidak Hadir", icon: <X className="size-4" />, gradient: "from-red-600 to-red-500" },
]

function AttendanceManualForm({ volunteers, isLoading, onMarkAttendance, isSubmitting }: AttendanceManualFormProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(null)

    const filteredVolunteers = useMemo(() => {
        if (!searchQuery.trim()) return volunteers
        const query = searchQuery.toLowerCase()
        return volunteers.filter((v) =>
            v.volunteer.full_name.toLowerCase().includes(query) ||
            v.volunteer.username.toLowerCase().includes(query)
        )
    }, [volunteers, searchQuery])

    const selectedVolunteerData = volunteers.find((v) => v.volunteer_id === selectedVolunteer)

    const handleSubmit = () => {
        if (selectedVolunteer && selectedStatus) {
            onMarkAttendance(selectedVolunteer, selectedStatus)
            setSelectedVolunteer(null)
            setSelectedStatus(null)
            setSearchQuery("")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-emerald-600" />
            </div>
        )
    }

    if (!volunteers || volunteers.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                    <UserCheck className="size-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">Tidak ada relawan terdaftar</p>
                <p className="text-xs text-muted-foreground">Belum ada relawan yang mendaftar event ini</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama relawan..."
                    className="flex h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
            </div>

            {/* Volunteer List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 rounded-xl border border-border p-1.5">
                {filteredVolunteers.length > 0 ? (
                    filteredVolunteers.map((v) => {
                        const isSelected = selectedVolunteer === v.volunteer_id
                        return (
                            <button
                                key={v.volunteer_id}
                                onClick={() => {
                                    setSelectedVolunteer(v.volunteer_id)
                                    setSearchQuery(v.volunteer.full_name)
                                }}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                                    isSelected
                                        ? "bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:ring-emerald-800/30"
                                        : "hover:bg-muted/50"
                                )}
                            >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-[11px] font-bold text-white">
                                    {v.volunteer.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{v.volunteer.full_name}</p>
                                    <p className="text-xs text-muted-foreground">@{v.volunteer.username}</p>
                                </div>
                                {isSelected && <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />}
                            </button>
                        )
                    })
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">Relawan tidak ditemukan</p>
                    </div>
                )}
            </div>

            {/* Status Selection */}
            {selectedVolunteerData && (
                <div className="animate-slide-up-sm space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">Status Kehadiran</p>
                    <div className="flex gap-2">
                        {statusOptions.map((option) => {
                            const isActive = selectedStatus === option.value
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedStatus(option.value)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium transition-all border-2",
                                        isActive
                                            ? option.value === "present"
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                : option.value === "late"
                                                    ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                                    : "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                                            : "border-border bg-background text-muted-foreground hover:border-muted-foreground/30"
                                    )}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedStatus || isSubmitting}
                        className={cn(
                            "w-full gap-2 bg-gradient-to-r shadow-lg transition-all active:scale-[0.98]",
                            selectedStatus === "present" && "from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-900/20",
                            selectedStatus === "late" && "from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-amber-900/20",
                            selectedStatus === "absent" && "from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-900/20",
                            !selectedStatus && "opacity-50"
                        )}
                    >
                        {isSubmitting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <UserCheck className="size-4" />
                        )}
                        {isSubmitting ? "Menyimpan..." : "Konfirmasi Kehadiran"}
                    </Button>
                </div>
            )}
        </div>
    )
}

export { AttendanceManualForm }
