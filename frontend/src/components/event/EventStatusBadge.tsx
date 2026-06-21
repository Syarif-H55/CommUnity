"use client"

import { cn } from "@/lib/utils"
import { Clock, CheckCircle2, XCircle, Archive } from "lucide-react"
import type { EventStatus } from "@/types"

interface EventStatusBadgeProps {
    status: EventStatus
    className?: string
}

const statusConfig: Record<EventStatus, {
    label: string
    icon: React.ReactNode
    containerClass: string
    textClass: string
}> = {
    draft: {
        label: "Draft",
        icon: <Clock className="size-3.5" />,
        containerClass: "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/30",
        textClass: "text-amber-700 dark:text-amber-400",
    },
    published: {
        label: "Published",
        icon: <CheckCircle2 className="size-3.5" />,
        containerClass: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/30",
        textClass: "text-emerald-700 dark:text-emerald-400",
    },
    cancelled: {
        label: "Dibatalkan",
        icon: <XCircle className="size-3.5" />,
        containerClass: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/30",
        textClass: "text-red-700 dark:text-red-400",
    },
    completed: {
        label: "Selesai",
        icon: <Archive className="size-3.5" />,
        containerClass: "bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/30",
        textClass: "text-slate-600 dark:text-slate-400",
    },
}

function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            config.containerClass,
            config.textClass,
            className
        )}>
            {config.icon}
            {config.label}
        </span>
    )
}

export { EventStatusBadge }
