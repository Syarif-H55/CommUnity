"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import AuthGuard from "@/components/auth/AuthGuard"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { useEvents } from "@/hooks/useEvent"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { EventSlideshow, EventCard } from "@/components/event"
import type { EventSlide } from "@/components/event"
import {
    Handshake, Plus, LogOut, Loader2, CalendarDays, Search,
    SlidersHorizontal, Grid3X3, List, X, Sparkles, ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

const CATEGORIES = [
    { value: "Sosial", label: "Sosial", icon: "🤝" },
    { value: "Pendidikan", label: "Pendidikan", icon: "📚" },
    { value: "Lingkungan", label: "Lingkungan", icon: "🌿" },
    { value: "Kesehatan", label: "Kesehatan", icon: "💊" },
    { value: "Budaya", label: "Budaya", icon: "🎭" },
    { value: "Bencana", label: "Bencana", icon: "🆘" },
    { value: "Lainnya", label: "Lainnya", icon: "📌" },
]

const FEATURED_EVENT_SLIDES: EventSlide[] = [
    {
        id: "featured-1",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
        title: "Bakti Sosial untuk Negeri",
        description: "Mari bersama-sama memberikan dampak positif bagi masyarakat melalui kegiatan bakti sosial yang menyentuh langsung kebutuhan mereka.",
        date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        time: "08:00",
        location: "Jakarta Pusat, DKI Jakarta",
        category: "Sosial",
    },
    {
        id: "featured-2",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
        title: "Seminar Pendidikan Anak Bangsa",
        description: "Tingkatkan kualitas pendidikan Indonesia dengan menjadi bagian dari seminar pendidikan yang inspiratif dan edukatif.",
        date: new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0],
        time: "09:30",
        location: "Bandung, Jawa Barat",
        category: "Pendidikan",
    },
    {
        id: "featured-3",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80",
        title: "Aksi Bersih Pantai & Lingkungan",
        description: "Bergabung dalam aksi bersih-bersih pantai dan pelestarian lingkungan untuk menjaga keindahan alam Indonesia.",
        date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        time: "07:00",
        location: "Anyer, Banten",
        category: "Lingkungan",
    },
    {
        id: "featured-4",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80",
        title: "Donor Darah & Cek Kesehatan Gratis",
        description: "Setetes darah Anda bisa menyelamatkan jiwa. Ikuti kegiatan donor darah dan pemeriksaan kesehatan gratis untuk masyarakat.",
        date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        time: "10:00",
        location: "Surabaya, Jawa Timur",
        category: "Kesehatan",
    },
]

function EventsContent() {
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()
    const { data: events, isLoading } = useEvents()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [sortBy, setSortBy] = useState<"date" | "title" | "participants">("date")

    const filteredEvents = useMemo(() => {
        if (!events) return []

        let result = [...events]

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (e) =>
                    e.title.toLowerCase().includes(query) ||
                    e.description.toLowerCase().includes(query) ||
                    e.location.toLowerCase().includes(query)
            )
        }

        if (selectedCategory) {
            result = result.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase())
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                case "title":
                    return a.title.localeCompare(b.title)
                case "participants":
                    return b.current_participants - a.current_participants
                default:
                    return 0
            }
        })

        return result
    }, [events, searchQuery, selectedCategory, sortBy])

    const upcomingEvents = useMemo(() =>
        filteredEvents.filter((e) => new Date(e.date) >= new Date() && e.status === "published"),
        [filteredEvents]
    )

    const draftEvents = useMemo(() =>
        filteredEvents.filter((e) => e.status === "draft"),
        [filteredEvents]
    )

    const activeFilters = [searchQuery, selectedCategory].filter(Boolean).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex size-9 items-center justify-center rounded-xl bg-emerald-600"
                        >
                            <Handshake className="size-5 text-white" />
                        </Link>
                        <span className="text-lg font-semibold tracking-tight">Event Saya</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/events/create"
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-3 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm"
                        >
                            <Plus className="size-4" />
                            <span className="hidden sm:inline">Buat Event</span>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/login" })}
                            disabled={logout.isPending}
                            className="gap-2"
                        >
                            {logout.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                            <span className="hidden sm:inline">Keluar</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
                <EventSlideshow slides={FEATURED_EVENT_SLIDES} />

                {/* Search & Filter Bar */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <CalendarDays className="size-5 text-emerald-600" />
                                Jelajahi Event
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Temukan dan kelola kegiatan sosial yang sesuai dengan minat Anda
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-lg border border-border bg-background overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "p-2 transition-colors",
                                        viewMode === "grid"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                    aria-label="Grid view"
                                >
                                    <Grid3X3 className="size-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "p-2 transition-colors",
                                        viewMode === "list"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                    aria-label="List view"
                                >
                                    <List className="size-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg border px-3 h-8 text-sm font-medium transition-all",
                                    activeFilters > 0
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                        : "border-border bg-background text-foreground hover:bg-muted"
                                )}
                            >
                                <SlidersHorizontal className="size-4" />
                                Filter
                                {activeFilters > 0 && (
                                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                                        {activeFilters}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search & Filter Panel */}
                    <div className={cn(
                        "space-y-3 overflow-hidden transition-all duration-300",
                        showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari event berdasarkan judul, deskripsi, atau lokasi..."
                                className="flex h-10 w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground mr-1">Kategori:</span>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all border",
                                    !selectedCategory
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                        : "bg-background text-muted-foreground border-border hover:border-emerald-200"
                                )}
                            >
                                <Sparkles className="size-3" />
                                Semua
                            </button>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
                                    className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all border",
                                        selectedCategory === cat.value
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                            : "bg-background text-muted-foreground border-border hover:border-emerald-200"
                                    )}
                                >
                                    <span>{cat.icon}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-muted-foreground">Urutkan:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "date" | "title" | "participants")}
                                className="flex h-8 rounded-lg border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <option value="date">Tanggal Terdekat</option>
                                <option value="title">A-Z</option>
                                <option value="participants">Peserta Terbanyak</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Event Listings */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-8 animate-spin text-emerald-600" />
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="space-y-8">
                        {draftEvents.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                        <span className="flex size-2 rounded-full bg-amber-500" />
                                        Draft Event ({draftEvents.length})
                                    </h3>
                                </div>
                                {viewMode === "grid" ? (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {draftEvents.map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                    </div>
                                ) : (
                                    <EventListView events={draftEvents} />
                                )}
                            </section>
                        )}

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <CalendarDays className="size-4 text-emerald-600" />
                                    Semua Event ({filteredEvents.length})
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                    {upcomingEvents.length} akan datang
                                </span>
                            </div>
                            {viewMode === "grid" ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredEvents.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            ) : (
                                <EventListView events={filteredEvents} />
                            )}
                        </section>
                    </div>
                ) : (
                    <Card className="border-emerald-100 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <CalendarDays className="size-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-center">
                                <CardTitle className="text-lg">Belum Ada Event</CardTitle>
                                <CardDescription className="mt-1">
                                    {searchQuery || selectedCategory
                                        ? "Tidak ada event yang sesuai dengan pencarian Anda"
                                        : "Buat event sosial pertama Anda untuk mulai berdampak"}
                                </CardDescription>
                            </div>
                            {!searchQuery && !selectedCategory && (
                                <Link
                                    href="/events/create"
                                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-4 h-9 gap-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-emerald-700 transition-all shadow-sm mt-2"
                                >
                                    <Plus className="size-4" />
                                    Buat Event
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}

function EventListView({ events }: { events: Event[] }) {
    return (
        <div className="space-y-3">
            {events.map((event) => {
                const eventDate = new Date(event.date)
                return (
                    <Link key={event.id} href={`/events/${event.id}`}>
                        <div className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/30">
                            <div className="flex flex-col items-center justify-center size-14 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                                <span className="text-lg font-bold">{eventDate.getDate()}</span>
                                <span className="text-[10px] uppercase leading-tight">
                                    {eventDate.toLocaleDateString("id-ID", { month: "short" })}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="text-sm font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {event.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                            {event.location} · {event.time}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={cn(
                                            "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                            event.status === "published" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                            event.status === "draft" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                            event.status === "cancelled" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                            event.status === "completed" && "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
                                        )}>
                                            {event.status === "published" ? "Published" :
                                                event.status === "draft" ? "Draft" :
                                                event.status === "cancelled" ? "Dibatalkan" : "Selesai"}
                                        </span>
                                        <ArrowRight className="size-4 text-emerald-500 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default function EventsPage() {
    return (
        <AuthGuard>
            <EventsContent />
        </AuthGuard>
    )
}
