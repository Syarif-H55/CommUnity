"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useCreateEvent } from "@/hooks/useEvent"
import { EventForm } from "@/components/event"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Handshake, LogOut, Loader2, Sparkles } from "lucide-react"
import type { CreateEventRequest, UpdateEventRequest } from "@/types"

function CreateEventContent() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()
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
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/events"
                            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                            <Handshake className="size-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight">Buat Event Baru</span>
                    </div>

                    <div className="flex items-center gap-2">
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

            <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
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
