"use client"

import { cn } from "@/lib/utils"

interface AttendanceRateIndicatorProps {
    rate: number
    className?: string
}

export function AttendanceRateIndicator({ rate, className }: AttendanceRateIndicatorProps) {
    const colorClass = rate >= 75
        ? "text-emerald-600"
        : rate >= 50
            ? "text-amber-600"
            : "text-red-600"

    const barColor = rate >= 75
        ? "bg-emerald-500"
        : rate >= 50
            ? "bg-amber-500"
            : "bg-red-500"

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-end justify-between">
                <span className={cn("text-3xl font-bold tracking-tight", colorClass)}>
                    {rate}%
                </span>
                <span className="text-xs text-muted-foreground">
                    {rate >= 75 ? "Baik" : rate >= 50 ? "Cukup" : "Rendah"}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", barColor)}
                    style={{ width: `${Math.min(rate, 100)}%` }}
                />
            </div>
        </div>
    )
}
