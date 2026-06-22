"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, ChevronRight, ImageOff, Building2 } from "lucide-react"
import type { Event } from "@/types"

interface EventDiscoveryCardProps {
    event: Event
    className?: string
}

function EventDiscoveryCard({ event, className }: EventDiscoveryCardProps) {
    const eventDate = new Date(event.event_date)
    const isUpcoming = eventDate > new Date()
    const isFull = event.participants_count >= event.quota
    const location = [event.city, event.province].filter(Boolean).join(", ") || event.location_name || "—"

    return (
        <Link href={`/explore/${event.id}`}>
            <div className={cn(
                "group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all",
                "hover:shadow-lg hover:shadow-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-800/30",
                className
            )}>
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white border border-white/20">
                            {event.category_name}
                        </span>
                        {isFull && (
                            <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                                Penuh
                            </Badge>
                        )}
                    </div>

                    {event.organization_logo_url && (
                        <div className="absolute top-3 right-3 z-10">
                            <img
                                src={event.organization_logo_url}
                                alt={event.organization_name || ""}
                                className="size-8 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {event.title}
                        </h3>
                        {event.organization_name && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Building2 className="size-3" />
                                {event.organization_name}
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
                            <span>{event.start_time} - {event.end_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="size-3.5 shrink-0" />
                            <span>
                                {event.participants_count}/{event.quota} peserta
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        {isUpcoming && !isFull && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                </span>
                                Bisa Diikuti
                            </span>
                        )}
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 ml-auto">
                            Lihat Detail
                            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export { EventDiscoveryCard }
