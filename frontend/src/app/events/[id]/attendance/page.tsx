"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useEvent } from "@/hooks/useEvent"
import { useQRData, useRefreshQRData, useAttendanceSummary, useEventAttendances, useManualAttendance, useUpdateAttendance } from "@/hooks/useAttendance"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AttendanceSummaryCards, AttendanceQRCode, AttendanceTable, AttendanceManualForm } from "@/components/attendance"
import {
    Handshake, ArrowLeft, LogOut, Loader2, QrCode, ScanLine, Users,
    ClipboardList, Calendar, MapPin, Clock, Sparkles, ExternalLink, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

function AttendanceDashboardContent() {
    const params = useParams()
    const eventId = params.id as string
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()

    const { data: event, isLoading: eventLoading } = useEvent(eventId)
    const { data: qrData, isLoading: qrLoading } = useQRData(eventId)
    const refreshQR = useRefreshQRData(eventId)
    const { data: summary, isLoading: summaryLoading } = useAttendanceSummary(eventId)
    const { data: attendancesPage, isLoading: attendancesLoading } = useEventAttendances(eventId)
    const manualAttendance = useManualAttendance(eventId)
    const updateAttendance = useUpdateAttendance(eventId)

    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [attendancePage, setAttendancePage] = useState(1)

    const { data: filteredAttendances, isLoading: filteredLoading } = useEventAttendances(eventId, {
        status: filterStatus || undefined,
        page: attendancePage,
    })

    if (eventLoading || !event) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat data...</p>
                </div>
            </div>
        )
    }

    const eventDate = new Date(event.event_date)
    const dateStr = eventDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/events/${eventId}`}
                            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                            <Handshake className="size-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-semibold tracking-tight block leading-tight">Absensi Event</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px] block">{event.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/events/${eventId}/attendance/scan`}
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm"
                        >
                            <ScanLine className="size-4" />
                            <span className="hidden sm:inline">Scan QR</span>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/login" })}
                            disabled={logout.isPending}
                        >
                            {logout.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                <div className="relative mx-auto max-w-6xl px-6 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-emerald-100/70 text-xs">
                                <Calendar className="size-3.5" />
                                {dateStr}
                                <span className="mx-1.5">·</span>
                                <Clock className="size-3.5" />
                                {event.start_time} - {event.end_time}
                                {event.location_name && (
                                    <>
                                        <span className="mx-1.5">·</span>
                                        <MapPin className="size-3.5" />
                                        {event.location_name}
                                    </>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                                Manajemen Absensi
                            </h1>
                            <p className="text-emerald-100/70 text-sm max-w-xl">
                                Kelola kehadiran relawan, tampilkan QR Code untuk absensi, dan pantau rekap kehadiran secara real-time.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/events/${eventId}`}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-all border border-white/10"
                            >
                                <ExternalLink className="size-4" />
                                Detail Event
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "Terdaftar", value: summary?.total_registered ?? "-", color: "text-blue-300" },
                            { label: "Hadir", value: summary?.present ?? "-", color: "text-emerald-300" },
                            { label: "Rate", value: summary ? `${summary.attendance_rate}%` : "-", color: "text-amber-300" },
                            { label: "Tidak Hadir", value: summary?.absent ?? "-", color: "text-red-300" },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
                                <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider">{stat.label}</p>
                                <p className={cn("text-xl font-bold mt-0.5", stat.color)}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-6 py-8">
                {/* Tabs */}
                <Tabs defaultValue="dashboard" className="space-y-6">
                    <TabsList className="bg-background border border-border rounded-xl p-1">
                        <TabsTrigger value="dashboard" className="rounded-lg gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                            <Sparkles className="size-4" />
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="qr" className="rounded-lg gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                            <QrCode className="size-4" />
                            Tampilkan QR
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="rounded-lg gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                            <ClipboardList className="size-4" />
                            Absensi Manual
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                            <Users className="size-4" />
                            Riwayat
                        </TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6 animate-fade-slide-up">
                        <AttendanceSummaryCards summary={summary} isLoading={summaryLoading} />

                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="size-4 text-emerald-600" />
                                    Ringkasan Kehadiran
                                </CardTitle>
                                <CardDescription>
                                    Rekap kehadiran relawan pada event ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {summary && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Total Pendaftar</span>
                                            <span className="text-sm font-bold">{summary.total_registered}</span>
                                        </div>
                                        <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                                            {summary.present > 0 && (
                                                <div
                                                    className="bg-emerald-500 h-full transition-all duration-700"
                                                    style={{ width: `${(summary.present / summary.total_registered) * 100}%` }}
                                                />
                                            )}
                                            {summary.late > 0 && (
                                                <div
                                                    className="bg-amber-500 h-full transition-all duration-700"
                                                    style={{ width: `${(summary.late / summary.total_registered) * 100}%` }}
                                                />
                                            )}
                                            {summary.absent > 0 && (
                                                <div
                                                    className="bg-red-400 h-full transition-all duration-700"
                                                    style={{ width: `${(summary.absent / summary.total_registered) * 100}%` }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <span className="size-2.5 rounded-full bg-emerald-500" />
                                                Hadir ({summary.present})
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="size-2.5 rounded-full bg-amber-500" />
                                                Terlambat ({summary.late})
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="size-2.5 rounded-full bg-red-400" />
                                                Tidak Hadir ({summary.absent})
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Quick Action Cards */}
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <TabsTrigger value="qr" className="!block text-left !rounded-xl !p-0 data-[state=active]:!bg-transparent hover:!bg-transparent">
                                        <div className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
                                                <QrCode className="size-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold group-hover:text-emerald-600 transition-colors">Tampilkan QR</p>
                                                <p className="text-xs text-muted-foreground">Untuk absensi mandiri</p>
                                            </div>
                                            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="manual" className="!block text-left !rounded-xl !p-0 data-[state=active]:!bg-transparent hover:!bg-transparent">
                                        <div className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                                                <ClipboardList className="size-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors">Absensi Manual</p>
                                                <p className="text-xs text-muted-foreground">Catat kehadiran manual</p>
                                            </div>
                                            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </TabsTrigger>
                                    <Link
                                        href={`/events/${eventId}/attendance/scan`}
                                        className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
                                            <ScanLine className="size-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold group-hover:text-purple-600 transition-colors">Scan QR</p>
                                            <p className="text-xs text-muted-foreground">Scan QR relawan</p>
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                    <Link
                                        href={`/events/${eventId}`}
                                        className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm">
                                            <ExternalLink className="size-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold group-hover:text-amber-600 transition-colors">Detail Event</p>
                                            <p className="text-xs text-muted-foreground">Kembali ke event</p>
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* QR Tab */}
                    <TabsContent value="qr" className="space-y-6 animate-fade-slide-up">
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-lg flex items-center justify-center gap-2">
                                    <QrCode className="size-5 text-emerald-600" />
                                    QR Code Absensi
                                </CardTitle>
                                <CardDescription>
                                    Tampilkan QR Code ini agar dapat dipindai oleh relawan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AttendanceQRCode
                                    qrData={qrData}
                                    isLoading={qrLoading}
                                    onRefresh={() => refreshQR.mutate()}
                                    isRefreshing={refreshQR.isPending}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Manual Attendance Tab */}
                    <TabsContent value="manual" className="space-y-6 animate-fade-slide-up">
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <ClipboardList className="size-4 text-emerald-600" />
                                    Absensi Manual
                                </CardTitle>
                                <CardDescription>
                                    Pilih relawan dan tentukan status kehadiran secara manual
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AttendanceManualForm
                                    volunteers={attendancesPage?.data.map((a) => ({
                                        id: a.id,
                                        volunteer_id: a.volunteer_id,
                                        volunteer: a.volunteer,
                                    })) || []}
                                    isLoading={attendancesLoading}
                                    onMarkAttendance={(volunteerId, status) =>
                                        manualAttendance.mutate({ volunteer_id: volunteerId, status })
                                    }
                                    isSubmitting={manualAttendance.isPending}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6 animate-fade-slide-up">
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="size-4 text-emerald-600" />
                                    Riwayat Kehadiran
                                </CardTitle>
                                <CardDescription>
                                    Data kehadiran seluruh relawan pada event ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AttendanceTable
                                    attendances={filteredAttendances?.data || []}
                                    isLoading={filteredLoading}
                                    total={filteredAttendances?.total}
                                    currentPage={filteredAttendances?.current_page}
                                    lastPage={filteredAttendances?.last_page}
                                    onPageChange={setAttendancePage}
                                    onFilterChange={(status) => {
                                        setFilterStatus(status)
                                        setAttendancePage(1)
                                    }}
                                    activeFilter={filterStatus}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

export default function AttendancePage() {
    return (
        <AuthGuard>
            <AttendanceDashboardContent />
        </AuthGuard>
    )
}
