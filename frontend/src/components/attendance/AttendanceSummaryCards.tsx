"use client"

import { cn } from "@/lib/utils"
import { Users, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react"
import type { AttendanceSummary } from "@/types"

interface AttendanceSummaryCardsProps {
    summary?: AttendanceSummary
    isLoading?: boolean
}

function AttendanceSummaryCards({ summary, isLoading }: AttendanceSummaryCardsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
                        <div className="h-8 w-8 rounded-lg bg-muted mb-3" />
                        <div className="h-4 w-20 bg-muted rounded mb-2" />
                        <div className="h-8 w-12 bg-muted rounded" />
                    </div>
                ))}
            </div>
        )
    }

    if (!summary) return null

    const cards = [
        {
            label: "Total Terdaftar",
            value: summary.total_registered,
            icon: Users,
            gradient: "from-blue-600 to-blue-500",
            bgClass: "bg-blue-100 dark:bg-blue-900/30",
            iconClass: "text-blue-600 dark:text-blue-400",
            borderClass: "border-blue-200/50 dark:border-blue-800/30",
        },
        {
            label: "Hadir",
            value: summary.present,
            icon: CheckCircle2,
            gradient: "from-emerald-600 to-emerald-500",
            bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
            iconClass: "text-emerald-600 dark:text-emerald-400",
            borderClass: "border-emerald-200/50 dark:border-emerald-800/30",
        },
        {
            label: "Terlambat",
            value: summary.late,
            icon: Clock,
            gradient: "from-amber-600 to-amber-500",
            bgClass: "bg-amber-100 dark:bg-amber-900/30",
            iconClass: "text-amber-600 dark:text-amber-400",
            borderClass: "border-amber-200/50 dark:border-amber-800/30",
        },
        {
            label: "Tidak Hadir",
            value: summary.absent,
            icon: XCircle,
            gradient: "from-red-600 to-red-500",
            bgClass: "bg-red-100 dark:bg-red-900/30",
            iconClass: "text-red-600 dark:text-red-400",
            borderClass: "border-red-200/50 dark:border-red-800/30",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon
                const percentage = summary.total_registered > 0
                    ? Math.round((card.value / summary.total_registered) * 100)
                    : 0

                return (
                    <div
                        key={card.label}
                        className={cn(
                            "group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                            card.borderClass
                        )}
                    >
                        <div className="absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" />
                        <div className="flex items-start justify-between mb-3">
                            <div className={cn(
                                "flex size-10 items-center justify-center rounded-xl",
                                card.bgClass
                            )}>
                                <Icon className={cn("size-5", card.iconClass)} />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                                {percentage}%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                        <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                        <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-700 ease-out",
                                    `bg-gradient-to-r ${card.gradient}`
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export { AttendanceSummaryCards }
