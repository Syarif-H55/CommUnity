"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCreateEvent } from "@/hooks/useEvent"
import { EventForm } from "@/components/event"
import { ArrowLeft, Sparkles } from "lucide-react"
import type { CreateEventRequest, UpdateEventRequest } from "@/types"

function CreateEventContent() {
    const router = useRouter()

    const createEvent = useCreateEvent()
    const [serverError, setServerError] = useState<string | null>(null)

    const handleSubmit = (data: CreateEventRequest | UpdateEventRequest) => {
        setServerError(null)
        createEvent.mutate(data as CreateEventRequest, {
            onSuccess: (response) => {
                const eventId = response.data.data?.id
                if (eventId) {
                    router.push(`/events/${eventId}`)
                } else {
                    router.push("/events")
                }
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message
                setServerError(message || "Gagal membuat event. Silakan coba lagi.")
            },
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
                <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="size-4" />Kembali ke Event</Link>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-8 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                                <Sparkles className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Buat Event Sosial</h1>
                                <p className="text-emerald-100/80 text-sm">
                                    Bagikan kegiatan sosial Anda dan ajak relawan untuk berpartisipasi
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            {[
                                { label: "Isi Detail Event", desc: "Judul, deskripsi, & kategori" },
                                { label: "Tentukan Waktu", desc: "Tanggal & lokasi kegiatan" },
                                { label: "Upload Banner", desc: "Buat tampilan menarik" },
                                { label: "Publikasikan", desc: "Sebarkan ke relawan" },
                            ].map((step, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-white">{step.label}</p>
                                        <p className="text-xs text-emerald-200/70">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <EventForm
                    mode="create"
                    onSubmit={handleSubmit}
                    isSubmitting={createEvent.isPending}
                    serverError={serverError}
                />
            </main>
        </div>
    )
}

export default function CreateEventPage() {
    return <CreateEventContent />
}
