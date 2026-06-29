"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEvent } from "@/hooks/useEvent"
import { useScanAttendance } from "@/hooks/useAttendance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AttendanceStatusBadge } from "@/components/attendance"
import {
    ArrowLeft, ScanLine, Camera, CameraOff,
    CheckCircle2, XCircle, AlertTriangle, Smartphone, RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import jsQR from "jsqr"

function QRScannerContent() {
    const params = useParams()
    const eventId = params.id as string


    const { data: event } = useEvent(eventId)
    const scanAttendance = useScanAttendance(eventId)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const animationRef = useRef<number>(0)

    const [cameraActive, setCameraActive] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [scanning, setScanning] = useState(false)
    const [scanResult, setScanResult] = useState<{
        success: boolean
        message: string
        volunteerName?: string
        status?: string
    } | null>(null)
    const [torchOn, setTorchOn] = useState(false)

    const startCamera = useCallback(async () => {
        setCameraError(null)
        setScanResult(null)

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { min: 360, ideal: 640, max: 1280 },
                    height: { min: 360, ideal: 640, max: 1280 },
                },
                audio: false,
            })

            streamRef.current = stream

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play()
                setCameraActive(true)
                setScanning(true)
                scanLoop()
            }
        } catch (err: any) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setCameraError("Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.")
            } else if (err.name === "NotFoundError") {
                setCameraError("Kamera tidak ditemukan pada perangkat ini.")
            } else {
                setCameraError("Gagal mengakses kamera. Pastikan perangkat memiliki kamera yang berfungsi.")
            }
        }
    }, [])

    const stopCamera = useCallback(() => {
        setScanning(false)
        setCameraActive(false)

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = 0
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }, [])

    const scanLoop = useCallback(() => {
        if (!scanning || !videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext("2d")
            if (!ctx) return

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            })

            if (code) {
                setScanning(false)
                stopCamera()

                // Found a QR code
                scanAttendance.mutate(
                    { qr_content: code.data },
                    {
                        onSuccess: (response) => {
                            const data = response.data.data
                            setScanResult({
                                success: true,
                                message: response.data.message || "Absensi berhasil dicatat!",
                                volunteerName: data?.volunteer?.full_name,
                                status: data?.attendance_status,
                            })
                        },
                        onError: (error: any) => {
                            const message = error?.response?.data?.message || "Gagal memproses absensi."
                            setScanResult({
                                success: false,
                                message,
                            })
                        },
                    }
                )
                return
            }
        }

        animationRef.current = requestAnimationFrame(scanLoop)
    }, [scanning, scanAttendance, stopCamera])

    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [stopCamera])

    useEffect(() => {
        if (scanning) {
            animationRef.current = requestAnimationFrame(scanLoop)
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [scanning, scanLoop])

    const handleReset = () => {
        setScanResult(null)
        setCameraError(null)
    }

    const toggleTorch = async () => {
        if (streamRef.current) {
            const track = streamRef.current.getVideoTracks()[0]
            if (track) {
                try {
                    const capabilities = track.getCapabilities() as any
                    if (capabilities?.torch) {
                        await track.applyConstraints({ advanced: [{ torch: !torchOn }] } as any)
                        setTorchOn(!torchOn)
                    }
                } catch {
                    // Torch not supported
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="mx-auto max-w-3xl px-6 py-8">
                <Link href={`/events/${eventId}/attendance`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="size-4" />Kembali ke Absensi</Link>

                <div className="space-y-6">
                    {/* Title */}
                    <div className="text-center">
                        <h1 className="text-xl font-bold">Pindai QR Code Relawan</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Arahkan kamera ke QR Code yang ditampilkan relawan untuk mencatat kehadiran
                        </p>
                    </div>

                    {/* Scanner Area */}
                    <Card className="border-emerald-100/50 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            {!cameraActive && !scanResult && (
                                <div className="flex flex-col items-center gap-6 py-16">
                                    <div className="relative">
                                        <div className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-900/20">
                                            <Camera className="size-10 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 size-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white">!</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold">Siap Memindai</p>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                                            Pastikan ruangan memiliki pencahayaan yang cukup dan QR Code berada dalam frame kamera
                                        </p>
                                    </div>
                                    <Button
                                        onClick={startCamera}
                                        className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 px-6"
                                    >
                                        <Camera className="size-4" />
                                        Mulai Scan
                                    </Button>
                                </div>
                            )}

                            {cameraActive && !scanResult && (
                                <div className="relative bg-black">
                                    <video
                                        ref={videoRef}
                                        className="w-full h-[400px] object-cover"
                                        playsInline
                                        muted
                                    />
                                    <canvas ref={canvasRef} className="hidden" />

                                    {/* Scanner Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="relative">
                                            {/* Corner markers */}
                                            <div className="absolute -top-3 -left-3 size-8 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
                                            <div className="absolute -top-3 -right-3 size-8 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
                                            <div className="absolute -bottom-3 -left-3 size-8 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
                                            <div className="absolute -bottom-3 -right-3 size-8 border-b-4 border-r-4 border-emerald-400 rounded-br" />
                                        </div>
                                    </div>

                                    {/* Scanning line */}
                                    <div className="absolute left-1/4 right-1/4 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line" />

                                    {/* Bottom controls */}
                                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 pointer-events-auto">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={stopCamera}
                                            className="gap-1.5 bg-black/60 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
                                        >
                                            <CameraOff className="size-4" />
                                            Berhenti
                                        </Button>
                                        {(streamRef.current?.getVideoTracks()[0]?.getCapabilities() as any)?.torch && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={toggleTorch}
                                                className="gap-1.5 bg-black/60 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
                                            >
                                                {torchOn ? "Matikan" : "Nyalakan"} Lampu
                                            </Button>
                                        )}
                                    </div>

                                    {/* Scanning indicator */}
                                    <div className="absolute top-4 left-4 pointer-events-auto">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                                            <span className="relative flex size-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                                <span className="relative inline-flex size-2 rounded-full bg-white" />
                                            </span>
                                            Memindai...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {cameraError && (
                                <div className="flex flex-col items-center gap-4 py-16 px-6">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
                                        <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Gagal Mengakses Kamera</p>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{cameraError}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" onClick={handleReset} className="gap-2">
                                            <RefreshCw className="size-4" />
                                            Coba Lagi
                                        </Button>
                                        <Link href={`/events/${eventId}/attendance`}>
                                            <Button variant="ghost" className="gap-2">
                                                <ArrowLeft className="size-4" />
                                                Kembali
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {scanResult && (
                                <div className="flex flex-col items-center gap-6 py-16 px-6">
                                    {scanResult.success ? (
                                        <>
                                            <div className="relative">
                                                <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                                    <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <svg
                                                    className="absolute inset-0 size-20 animate-draw-check"
                                                    viewBox="0 0 80 80"
                                                    fill="none"
                                                >
                                                    <circle cx="40" cy="40" r="36" stroke="#10b981" strokeWidth="3" opacity="0.3" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                                                    Absensi Berhasil!
                                                </p>
                                                {scanResult.volunteerName && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {scanResult.volunteerName}
                                                    </p>
                                                )}
                                                {scanResult.status && (
                                                    <div className="mt-3 inline-flex items-center gap-2">
                                                        <AttendanceStatusBadge status={scanResult.status as any} size="md" />
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex size-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
                                                <XCircle className="size-8 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div className="text-center max-w-sm">
                                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                    Absensi Gagal
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">{scanResult.message}</p>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => {
                                                handleReset()
                                                setScanResult(null)
                                                startCamera()
                                            }}
                                            className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                                        >
                                            <ScanLine className="size-4" />
                                            Scan Lagi
                                        </Button>
                                        <Link href={`/events/${eventId}/attendance`}>
                                            <Button variant="outline" className="gap-2">
                                                <ArrowLeft className="size-4" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Instructions */}
                    {!cameraActive && !scanResult && !cameraError && (
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Smartphone className="size-4 text-emerald-600" />
                                    Petunjuk
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs text-muted-foreground">
                                <p>1. Pastikan QR Code relawan tidak rusak atau buram</p>
                                <p>2. Posisikan QR Code di dalam area pemindaian</p>
                                <p>3. Jaga jarak kamera agar QR Code terbaca dengan jelas</p>
                                <p>4. Pastikan ruangan memiliki pencahayaan yang cukup</p>
                                <p>5. Setelah terpindai, status kehadiran akan otomatis tercatat</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}

export default function QRScannerPage() {
    return <QRScannerContent />
}
