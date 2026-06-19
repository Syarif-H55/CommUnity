"use client"

import { cn } from "@/lib/utils"
import { Clock, CheckCircle, XCircle, Building } from "lucide-react"
import type { VerificationStatus } from "@/types"

interface TimelineStep {
    label: string
    description: string
    status: "completed" | "active" | "upcoming"
    icon: React.ReactNode
}

interface VerificationTimelineProps {
    status: VerificationStatus
    className?: string
}

function VerificationTimeline({ status, className }: VerificationTimelineProps) {
    const steps: TimelineStep[] = [
        {
            label: "Organisasi Terdaftar",
            description: "Data organisasi berhasil disimpan",
            status: "completed",
            icon: <Building className="size-4" />,
        },
        {
            label: "Menunggu Verifikasi",
            description: "Dokumen sedang diperiksa oleh admin",
            status: status === "pending" ? "active" : "completed",
            icon: <Clock className="size-4" />,
        },
        {
            label: status === "rejected" ? "Ditolak" : "Terverifikasi",
            description: status === "rejected"
                ? "Dokumen verifikasi ditolak. Silakan upload ulang."
                : "Organisasi telah terverifikasi",
            status: status === "approved" ? "completed" : status === "rejected" ? "active" : "upcoming",
            icon: status === "rejected" ? <XCircle className="size-4" /> : <CheckCircle className="size-4" />,
        },
    ]

    return (
        <div className={cn("space-y-0", className)}>
            {steps.map((step, i) => (
                <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < steps.length - 1 && (
                        <div
                            className={cn(
                                "absolute left-[15px] top-8 w-0.5 h-full -translate-x-1/2",
                                step.status === "completed"
                                    ? "bg-emerald-500"
                                    : "bg-muted-foreground/20"
                            )}
                        />
                    )}

                    <div className="relative flex shrink-0">
                        <div
                            className={cn(
                                "flex size-8 items-center justify-center rounded-full border-2 transition-all",
                                step.status === "completed" &&
                                    "border-emerald-500 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                                step.status === "active" &&
                                    "border-emerald-500 bg-white text-emerald-600 ring-4 ring-emerald-500/20 dark:bg-background dark:text-emerald-400",
                                step.status === "upcoming" &&
                                    "border-muted-foreground/20 bg-muted text-muted-foreground/50"
                            )}
                        >
                            {step.icon}
                        </div>
                    </div>

                    <div className="flex-1 pt-1">
                        <p
                            className={cn(
                                "text-sm font-medium",
                                step.status === "completed" && "text-emerald-700 dark:text-emerald-400",
                                step.status === "active" && "text-foreground",
                                step.status === "upcoming" && "text-muted-foreground/50"
                            )}
                        >
                            {step.label}
                        </p>
                        <p
                            className={cn(
                                "text-xs mt-0.5",
                                step.status === "upcoming" ? "text-muted-foreground/40" : "text-muted-foreground"
                            )}
                        >
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}

            {status === "rejected" && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                    <p className="font-medium">Verifikasi Ditolak</p>
                    <p className="mt-1 text-xs opacity-80">
                        Dokumen yang diunggah tidak memenuhi persyaratan. Silakan upload dokumen yang valid untuk verifikasi ulang.
                    </p>
                </div>
            )}
        </div>
    )
}

export { VerificationTimeline }
