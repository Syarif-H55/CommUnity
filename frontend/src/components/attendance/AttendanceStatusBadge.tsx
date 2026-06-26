"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react"
import type { AttendanceStatus } from "@/types"

interface AttendanceStatusBadgeProps {
    status: AttendanceStatus
    className?: string
    size?: "sm" | "md"
}

const statusConfig: Record<AttendanceStatus, {
    label: string
    icon: React.ReactNode
    containerClass: string
    textClass: string
}> = {
    present: {
        label: "Hadir",
        icon: <CheckCircle2 className="size-3.5" />,
        containerClass: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/30",
        textClass: "text-emerald-700 dark:text-emerald-400",
    },
    late: {
        label: "Terlambat",
        icon: <Clock className="size-3.5" />,
        containerClass: "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/30",
        textClass: "text-amber-700 dark:text-amber-400",
    },
    absent: {
        label: "Tidak Hadir",
        icon: <XCircle className="size-3.5" />,
        containerClass: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/30",
        textClass: "text-red-700 dark:text-red-400",
    },
}

function AttendanceStatusBadge({ status, className, size = "sm" }: AttendanceStatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full border font-medium",
            size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
            config.containerClass,
            config.textClass,
            className
        )}>
            {config.icon}
            {config.label}
        </span>
    )
}

export { AttendanceStatusBadge }
