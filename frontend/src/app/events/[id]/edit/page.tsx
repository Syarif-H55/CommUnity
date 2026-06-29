"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEvent, useUpdateEvent } from "@/hooks/useEvent"
import { EventForm } from "@/components/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Edit3, XCircle } from "lucide-react"
import type { UpdateEventRequest } from "@/types"

function EditEventContent() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const { data: event, isLoading, error } = useEvent(id)
    const updateEvent = useUpdateEvent(id)
    const [serverError, setServerError] = useState<string | null>(null)

    const handleSubmit = (data: UpdateEventRequest) => {
        setServerError(null)
        updateEvent.mutate(data, {
            onSuccess: () => {
                router.push(`/events/${id}`)
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message
                setServerError(message || "Gagal memperbarui event. Silakan coba lagi.")
            },
        })
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat event...</p>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <Card className="w-full max-w-md text-center border-emerald-100/50">
                    <CardContent className="py-12">
                        <XCircle className="mx-auto size-12 text-destructive mb-4" />
                        <CardTitle className="text-lg">Event Tidak Ditemukan</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            Event yang ingin Anda edit tidak tersedia atau telah dihapus.
                        </p>
                        <Link
                            href="/events"
                            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
                <Link href={`/events/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="size-4" />Kembali ke Event</Link>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 p-8 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                    <div className="relative flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                            <Edit3 className="size-7" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Edit Event</h1>
                            <p className="text-amber-100/80 text-sm mt-1">
                                Perbarui informasi event &quot;{event.title}&quot;
                            </p>
                        </div>
                    </div>
                </div>

                <EventForm
                    mode="edit"
                    initialData={{
                        title: event.title,
                        description: event.description ?? undefined,
                        event_date: event.event_date,
                        start_time: event.start_time,
                        end_time: event.end_time,
                        location_name: event.location_name ?? undefined,
                        category_id: event.category_id,
                        quota: event.quota,
                    }}
                    onSubmit={handleSubmit}
                    isSubmitting={updateEvent.isPending}
                    serverError={serverError}
                />
            </main>
        </div>
    )
}

export default function EditEventPage() {
    return <EditEventContent />
}
