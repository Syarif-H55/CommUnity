"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { TiltCard } from "@/components/organization/TiltCard"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, ChevronRight, ImageOff } from "lucide-react"
import type { Event } from "@/types"

interface EventCardProps {
    event: Event
    className?: string
}

const statusStyles: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
    draft: "warning",
    published: "success",
    cancelled: "destructive",
    completed: "secondary",
}

const statusLabels: Record<string, string> = {
    draft: "Draft",
    published: "Published",
    cancelled: "Dibatalkan",
    completed: "Selesai",
}

const categoryIcons: Record<string, string> = {
    lingkungan: "🌿",
    pendidikan: "📚",
    kesehatan: "💊",
    sosial: "🤝",
    kemanusiaan: "🆘",
}

function EventCard({ event, className }: EventCardProps) {
    const eventDate = new Date(event.event_date)
    const isUpcoming = eventDate > new Date()
    const isFull = event.current_participants >= event.quota

    return (
        <TiltCard className={cn("group", className)} tiltDegree={6}>
            <Link href={`/events/${event.id}`}>
                <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-emerald-900/10">
                    {/* Banner */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                        {event.banner_url ? (
                            <img
                                src={event.banner_url}
                                alt={event.title}
                                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30">
                                <ImageOff className="size-10 text-emerald-400/50" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                            <Badge
                                variant={statusStyles[event.status]}
                                className="text-[10px] px-2 py-0.5 uppercase tracking-wider backdrop-blur-sm"
                            >
                                {statusLabels[event.status]}
                            </Badge>
                            {event.status === "published" && isFull && (
                                <Badge
                                    variant="destructive"
                                    className="text-[10px] px-2 py-0.5 backdrop-blur-sm"
                                >
                                    Penuh
                                </Badge>
                            )}
                        </div>

                        <div className="absolute bottom-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                                {categoryIcons[(event.category_name || '').toLowerCase()] || "📌"}
                                <span>{event.category_name}</span>
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                        <div>
                            <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {event.title}
                            </h3>
                            {event.organization_name && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    by {event.organization_name}
                                </p>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {event.description}
                        </p>

                        <div className="space-y-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-3.5 shrink-0" />
                                <span>
                                    {eventDate.toLocaleDateString("id-ID", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="size-3.5 shrink-0" />
                                <span>{event.start_time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-3.5 shrink-0" />
                                <span className="truncate">{event.location_name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="size-3.5 shrink-0" />
                                <span>
                                    {event.current_participants}/{event.quota} peserta
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            {event.status === "published" && isUpcoming && !isFull && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                    </span>
                                    Bisa Diikuti
                                </span>
                            )}
                            {(event.status === "published" && !isUpcoming) && (
                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                    Sedang Berlangsung
                                </span>
                            )}
                            <ChevronRight className="size-4 text-emerald-600 dark:text-emerald-400 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>
                    </div>
                </div>
            </Link>
        </TiltCard>
    )
}

export { EventCard }
