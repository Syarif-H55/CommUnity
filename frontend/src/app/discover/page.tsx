"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDiscoverEvents } from "@/hooks/useEvent"
import { useAuthStore } from "@/stores/auth.store"
import { EventCard } from "@/components/event"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import {
    Handshake, Search, X, Loader2, Sparkles,
    CalendarDays, MapPin, ChevronLeft, ChevronRight, SlidersHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
    { id: null, label: "Semua", icon: "✨" },
    { id: 1, label: "Lingkungan", icon: "🌿" },
    { id: 2, label: "Pendidikan", icon: "📚" },
    { id: 3, label: "Kesehatan", icon: "💊" },
    { id: 4, label: "Sosial", icon: "🤝" },
    { id: 5, label: "Kemanusiaan", icon: "🆘" },
]

export default function DiscoverPage() {
    const router = useRouter()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [cityFilter, setCityFilter] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [page, setPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    function handleSearchChange(val: string) {
        setSearch(val)
        setPage(1)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(val)
        }, 400)
    }

    const filters = useMemo(() => ({
        search: debouncedSearch || undefined,
        category_id: selectedCategory ?? undefined,
        city: cityFilter || undefined,
        date: dateFilter || undefined,
        per_page: 12,
        page,
    }), [debouncedSearch, selectedCategory, cityFilter, dateFilter, page])

    const { data: paginatedData, isLoading, isFetching } = useDiscoverEvents(filters)

    const events = paginatedData?.data ?? []
    const total = paginatedData?.total ?? 0
    const lastPage = paginatedData?.last_page ?? 1
    const currentPage = paginatedData?.current_page ?? 1

    const activeFilters = [debouncedSearch, selectedCategory, cityFilter, dateFilter].filter(Boolean).length

    function handleCategorySelect(catId: number | null) {
        setSelectedCategory((prev) => (prev === catId ? null : catId))
        setPage(1)
    }

    function handleCityChange(val: string) {
        setCityFilter(val)
        setPage(1)
    }

    function handleDateChange(val: string) {
        setDateFilter(val)
        setPage(1)
    }

    function clearAllFilters() {
        setSearch("")
        setDebouncedSearch("")
        if (debounceRef.current) clearTimeout(debounceRef.current)
        setSelectedCategory(null)
        setCityFilter("")
        setDateFilter("")
        setPage(1)
    }

    function goToPage(p: number) {
        if (p >= 1 && p <= lastPage) setPage(p)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const pageNumbers = useMemo(() => {
        const pages: (number | "ellipsis")[] = []
        const delta = 2
        const left = Math.max(2, currentPage - delta)
        const right = Math.min(lastPage - 1, currentPage + delta)

        pages.push(1)
        if (left > 2) pages.push("ellipsis")
        for (let i = left; i <= right; i++) pages.push(i)
        if (right < lastPage - 1) pages.push("ellipsis")
        if (lastPage > 1) pages.push(lastPage)

        return pages
    }, [currentPage, lastPage])

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8 md:p-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                            Temukan Kegiatan Sosial
                        </h1>
                        <p className="text-emerald-100/70 text-base md:text-lg mb-6">
                            Jelajahi dan ikuti berbagai kegiatan sosial yang memberikan dampak nyata bagi masyarakat.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-emerald-300/70 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Cari kegiatan sosial, lokasi, atau kata kunci..."
                                className="flex h-13 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-12 py-3 text-base text-white placeholder:text-emerald-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/60 transition-all"
                            />
                            {search && (
                                <button
                                    onClick={() => { setSearch(""); setDebouncedSearch(""); if (debounceRef.current) clearTimeout(debounceRef.current); setPage(1) }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-300/70 hover:text-white transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Sparkles className="size-5 text-emerald-600" />
                                Jelajahi Event
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {total > 0
                                    ? `Menampilkan ${events.length} dari ${total} kegiatan sosial`
                                    : "Temukan kegiatan sosial yang sesuai dengan minat Anda"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {(activeFilters > 0 || page > 1) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="gap-1.5 text-xs"
                                >
                                    <X className="size-3.5" />
                                    Reset
                                </Button>
                            )}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg border px-3 h-8 text-sm font-medium transition-all",
                                    activeFilters > 1
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

                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id ?? "all"}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all border",
                                    selectedCategory === cat.id
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30 shadow-sm"
                                        : "bg-background text-muted-foreground border-border hover:border-emerald-200 hover:text-emerald-600"
                                )}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Advanced Filters (collapsible) */}
                    <div className={cn(
                        "flex flex-wrap items-center gap-4 overflow-hidden transition-all duration-300",
                        showFilters ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                    )}>
                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-muted-foreground shrink-0" />
                            <input
                                type="text"
                                value={cityFilter}
                                onChange={(e) => handleCityChange(e.target.value)}
                                placeholder="Filter kota..."
                                className="flex h-9 w-48 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            {cityFilter && (
                                <button onClick={() => handleCityChange("")} className="text-muted-foreground hover:text-foreground">
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-muted-foreground shrink-0" />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => handleDateChange(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="flex h-9 rounded-lg border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            {dateFilter && (
                                <button onClick={() => handleDateChange("")} className="text-muted-foreground hover:text-foreground">
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                            <p className="mt-3 text-sm text-muted-foreground">Mencari kegiatan sosial...</p>
                        </div>
                    </div>
                )}

                {/* Event Grid */}
                {!isLoading && events.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} href={`/discover/${event.id}`} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && events.length === 0 && (
                    <Card className="border-emerald-100/50 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <Search className="size-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-center max-w-sm">
                                <CardTitle className="text-lg">Tidak Ditemukan</CardTitle>
                                <CardDescription className="mt-1">
                                    {activeFilters > 0
                                        ? "Tidak ada kegiatan sosial yang sesuai dengan filter yang dipilih. Coba ubah kata kunci atau filter."
                                        : "Belum ada kegiatan sosial yang dipublikasikan. Silakan cek kembali nanti."}
                                </CardDescription>
                            </div>
                            {activeFilters > 0 && (
                                <Button variant="outline" size="sm" onClick={clearAllFilters} className="gap-1.5 mt-2">
                                    <X className="size-4" />
                    Hapus Semua Filter
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Loading Overlay for refetch */}
                {isFetching && !isLoading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="size-5 animate-spin text-emerald-600/70" />
                    </div>
                )}

                {/* Pagination */}
                {lastPage > 1 && events.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 py-6">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 h-9 text-sm font-medium transition-all hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="size-4" />
                            <span className="hidden sm:inline ml-1">Sebelumnya</span>
                        </button>

                        <div className="flex items-center gap-1">
                            {pageNumbers.map((p, idx) =>
                                p === "ellipsis" ? (
                                    <span key={`e-${idx}`} className="flex items-center justify-center size-9 text-sm text-muted-foreground">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={cn(
                                            "inline-flex items-center justify-center rounded-lg size-9 text-sm font-medium transition-all",
                                            p === currentPage
                                                ? "bg-emerald-600 text-white shadow-sm"
                                                : "border border-border bg-background hover:bg-muted text-foreground"
                                        )}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage >= lastPage}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 h-9 text-sm font-medium transition-all hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="hidden sm:inline mr-1">Selanjutnya</span>
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t bg-white/50 dark:bg-background/50">
                <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Handshake className="size-4" />
                        <span>&copy; {new Date().getFullYear()} CommUnity. Platform Kegiatan Sosial Komunitas.</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {!isAuthenticated && (
                            <>
                                <Link href="/login" className="hover:text-emerald-600 transition-colors">Masuk</Link>
                                <Link href="/register" className="hover:text-emerald-600 transition-colors">Daftar</Link>
                            </>
                        )}
                        <Link href="/discover" className="hover:text-emerald-600 transition-colors">Jelajahi</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
