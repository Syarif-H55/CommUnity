"use client"

import { useMemo } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { cn } from "@/lib/utils"
import { RefreshCw, Smartphone, Loader2 } from "lucide-react"
import type { QRData } from "@/types"
import { Button } from "@/components/ui/button"

interface AttendanceQRCodeProps {
    qrData?: QRData
    isLoading?: boolean
    onRefresh?: () => void
    isRefreshing?: boolean
    size?: number
}

function AttendanceQRCode({ qrData, isLoading, onRefresh, isRefreshing, size = 256 }: AttendanceQRCodeProps) {
    const qrValue = useMemo(() => {
        if (!qrData?.qr_content) return ''
        return qrData.qr_content
    }, [qrData])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="size-64 rounded-2xl bg-muted animate-pulse flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
        )
    }

    if (!qrData || !qrValue) {
        return (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="size-64 rounded-2xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center">
                    <Smartphone className="size-12 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">QR Code tidak tersedia</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative group">
                <div className={cn(
                    "absolute -inset-2 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 opacity-20 blur-xl",
                    "group-hover:opacity-30 transition-opacity duration-500"
                )} />
                <div className="relative rounded-2xl bg-white p-4 shadow-lg ring-1 ring-emerald-200/50">
                    <QRCodeCanvas
                        value={qrValue}
                        size={size}
                        bgColor="#ffffff"
                        fgColor="#059669"
                        level="M"
                        includeMargin
                    />
                </div>
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {qrData.event_title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <Smartphone className="size-3.5" />
                    Arahkan kamera ponsel ke QR Code untuk melakukan absensi
                </p>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                    QR ini akan kadaluarsa
                </span>
                {onRefresh && (
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="gap-1.5"
                    >
                        <RefreshCw className={cn("size-3", isRefreshing && "animate-spin")} />
                        Perbarui
                    </Button>
                )}
            </div>
        </div>
    )
}

export { AttendanceQRCode }
