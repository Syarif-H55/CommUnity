"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Search, X, MapPin, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import type { EventCategory, EventQueryParams } from "@/types"

interface EventDiscoveryFiltersProps {
    categories: EventCategory[]
    cities: string[]
    onFilterChange: (params: EventQueryParams) => void
    initialParams?: EventQueryParams
    className?: string
}

function EventDiscoveryFilters({ categories, cities, onFilterChange, initialParams, className }: EventDiscoveryFiltersProps) {
    const [search, setSearch] = useState(initialParams?.search || "")
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialParams?.category_id)
    const [selectedCity, setSelectedCity] = useState(initialParams?.city || "")
    const [dateFrom, setDateFrom] = useState(initialParams?.date_from || "")
    const [dateTo, setDateTo] = useState(initialParams?.date_to || "")
    const [showCityDropdown, setShowCityDropdown] = useState(false)
    const [citySearch, setCitySearch] = useState("")
    const cityRef = useRef<HTMLDivElement>(null)
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

    const filteredCities = cities.filter((c) =>
        c.toLowerCase().includes(citySearch.toLowerCase())
    )

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
                setShowCityDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const emitChange = (overrides?: Partial<EventQueryParams>) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current)
        searchTimeout.current = setTimeout(() => {
            onFilterChange({
                search: search || undefined,
                category_id: selectedCategory,
                city: selectedCity || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            })
        }, 300)
    }

    useEffect(() => {
        emitChange()
        return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
    }, [search, selectedCategory, selectedCity, dateFrom, dateTo])

    const clearAll = () => {
        setSearch("")
        setSelectedCategory(undefined)
        setSelectedCity("")
        setDateFrom("")
        setDateTo("")
        setCitySearch("")
    }

    const hasActiveFilters = search || selectedCategory || selectedCity || dateFrom || dateTo

    return (
        <div className={cn("space-y-4", className)}>
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kegiatan sosial..."
                    className="flex h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            {/* Filter Chips Row */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-1.5">
                    <button
                        onClick={() => setSelectedCategory(undefined)}
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
                            !selectedCategory
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                : "bg-background text-muted-foreground border-border hover:border-emerald-200"
                        )}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? undefined : cat.id)}
                            className={cn(
                                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
                                selectedCategory === cat.id
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                    : "bg-background text-muted-foreground border-border hover:border-emerald-200"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* City Filter */}
                <div className="relative" ref={cityRef}>
                    <button
                        onClick={() => setShowCityDropdown(!showCityDropdown)}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-lg border px-3 h-9 text-xs font-medium transition-all",
                            selectedCity
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                : "bg-background text-muted-foreground border-border hover:border-emerald-200"
                        )}
                    >
                        <MapPin className="size-3.5" />
                        {selectedCity || "Semua Kota"}
                        <ChevronDown className="size-3" />
                    </button>

                    {showCityDropdown && (
                        <div className="absolute top-full mt-1 left-0 z-50 w-56 rounded-xl border bg-card shadow-lg p-2 space-y-1">
                            <div className="relative mb-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    placeholder="Cari kota..."
                                    className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <button
                                onClick={() => { setSelectedCity(""); setShowCityDropdown(false); setCitySearch("") }}
                                className={cn(
                                    "w-full rounded-lg px-3 py-1.5 text-xs text-left transition-colors",
                                    !selectedCity ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "hover:bg-muted"
                                )}
                            >
                                Semua Kota
                            </button>
                            {filteredCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => { setSelectedCity(city); setShowCityDropdown(false); setCitySearch("") }}
                                    className={cn(
                                        "w-full rounded-lg px-3 py-1.5 text-xs text-left transition-colors",
                                        selectedCity === city ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "hover:bg-muted"
                                    )}
                                >
                                    {city}
                                </button>
                            ))}
                            {filteredCities.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-2">Kota tidak ditemukan</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2">
                    <CalendarIcon className="size-3.5 text-muted-foreground" />
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="flex h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        title="Dari tanggal"
                    />
                    <span className="text-xs text-muted-foreground">—</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="flex h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        title="Sampai tanggal"
                    />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="inline-flex items-center gap-1 rounded-lg px-3 h-9 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all"
                    >
                        <X className="size-3.5" />
                        Hapus Filter
                    </button>
                )}
            </div>
        </div>
    )
}

export { EventDiscoveryFilters }
