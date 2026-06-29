"use client"

import { type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnalyticsMetricCardProps {
    title: string
    value: string | number
    icon: ReactNode
    gradient?: string
    iconBg?: string
    iconColor?: string
    subtitle?: string
    trend?: {
        direction: "up" | "down" | "neutral"
        label: string
    }
    children?: ReactNode
}

const gradientMap: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-orange-500",
    teal: "from-teal-500 to-teal-600",
    rose: "from-rose-500 to-rose-600",
}

const iconBgMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
}

export function AnalyticsMetricCard({
    title,
    value,
    icon,
    gradient = "emerald",
    iconBg,
    iconColor,
    subtitle,
    trend,
    children,
}: AnalyticsMetricCardProps) {
    const gradientClass = gradientMap[gradient] ?? gradientMap.emerald
    const iconBgClass = iconBg ?? iconBgMap[gradient] ?? iconBgMap.emerald

    return (
        <Card className="group relative overflow-hidden border-emerald-100/50 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:border-emerald-900/20">
            <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100", "bg-gradient-to-br", gradientClass)} />
            <CardContent className="relative z-10 p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                    <div className={cn("flex size-11 items-center justify-center rounded-xl shrink-0 transition-colors", iconBgClass)}>
                        {icon}
                    </div>
                </div>
                {trend && (
                    <div className="mt-3 flex items-center gap-1.5">
                        <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            trend.direction === "up" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                            trend.direction === "down" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                            trend.direction === "neutral" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                        )}>
                            {trend.label}
                        </span>
                    </div>
                )}
                {children}
            </CardContent>
        </Card>
    )
}
