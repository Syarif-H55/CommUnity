"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Pause, Play, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

interface EventSlide {
    id: string
    image: string
    title: string
    description: string
    date: string
    time: string
    location: string
    category: string
}

interface EventSlideshowProps {
    slides: EventSlide[]
    autoPlayInterval?: number
    className?: string
}

function EventSlideshow({ slides, autoPlayInterval = 6000, className }: EventSlideshowProps) {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const len = slides.length
    const containerRef = useRef<HTMLDivElement>(null)

    const goTo = useCallback((index: number) => {
        setCurrent(((index % len) + len) % len)
    }, [len])

    const next = useCallback(() => goTo(current + 1), [goTo, current])
    const prev = useCallback(() => goTo(current - 1), [goTo, current])

    useEffect(() => {
        if (isPaused || isHovering || len <= 1) return
        const timer = setInterval(next, autoPlayInterval)
        return () => clearInterval(timer)
    }, [isPaused, isHovering, len, autoPlayInterval, next])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev()
            if (e.key === "ArrowRight") next()
        }
        const el = containerRef.current
        el?.addEventListener("keydown", handleKeyDown)
        return () => el?.removeEventListener("keydown", handleKeyDown)
    }, [prev, next])

    if (len === 0) return null

    const slide = slides[current]

    const categoryColors: Record<string, string> = {
        sosial: "bg-rose-500/20 text-rose-200 border-rose-400/30",
        pendidikan: "bg-blue-500/20 text-blue-200 border-blue-400/30",
        lingkungan: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
        kesehatan: "bg-teal-500/20 text-teal-200 border-teal-400/30",
        budaya: "bg-purple-500/20 text-purple-200 border-purple-400/30",
        bencana: "bg-orange-500/20 text-orange-200 border-orange-400/30",
        lainnya: "bg-slate-500/20 text-slate-200 border-slate-400/30",
    }

    const defaultCategoryColor = "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden rounded-2xl group",
                "shadow-lg shadow-emerald-900/10 dark:shadow-emerald-950/30",
                className
            )}
            onMouseEnter={() => { setIsHovering(true); setIsPaused(true) }}
            onMouseLeave={() => { setIsHovering(false); setIsPaused(false) }}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured events slideshow"
        >
            <div className="relative aspect-[21/9] overflow-hidden bg-emerald-950">
                {slides.map((s, i) => (
                    <div
                        key={i}
                        className={cn(
                            "absolute inset-0 transition-all duration-1000 ease-in-out",
                            i === current
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-110"
                        )}
                        aria-hidden={i !== current}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 via-60% to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 z-10" />
                        <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${s.image})` }}
                        />
                    </div>
                ))}

                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 lg:p-14">
                    <div
                        key={`content-${current}`}
                        className="animate-fade-slide-up max-w-3xl"
                    >
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
                                categoryColors[slide.category?.toLowerCase()] || defaultCategoryColor
                            )}>
                                {slide.category}
                            </span>
                            {new Date(slide.date) > new Date() ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                                    </span>
                                    Akan Datang
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30 backdrop-blur-sm">
                                    Sedang Berlangsung
                                </span>
                            )}
                        </div>

                        <Link href={`/events/${slide.id}`}>
                            <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg hover:text-emerald-200 transition-colors">
                                {slide.title}
                            </h3>
                        </Link>

                        <p className="text-sm md:text-base text-white/70 max-w-2xl drop-shadow line-clamp-2 mb-4">
                            {slide.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-white/60">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                {new Date(slide.date).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-4" />
                                {slide.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="size-4" />
                                {slide.location}
                            </span>
                        </div>

                        <div className="mt-5">
                            <Link
                                href={`/events/${slide.id}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/25 transition-all hover:scale-105 active:scale-95 shadow-md"
                            >
                                Lihat Detail
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                        onClick={() => setIsPaused((p) => !p)}
                        className={cn(
                            "flex size-9 items-center justify-center rounded-full backdrop-blur-md text-white transition-all",
                            "bg-white/15 border border-white/20",
                            "hover:bg-white/30 hover:scale-110 active:scale-95",
                            "opacity-0 group-hover:opacity-100"
                        )}
                        aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                    >
                        {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                    </button>
                </div>

                <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between px-3 -translate-y-1/2 pointer-events-none">
                    <button
                        onClick={prev}
                        className={cn(
                            "pointer-events-auto flex size-10 items-center justify-center rounded-full backdrop-blur-md text-white transition-all",
                            "bg-white/15 border border-white/20",
                            "hover:bg-white/30 hover:scale-110 active:scale-95",
                            "opacity-0 group-hover:opacity-100"
                        )}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        onClick={next}
                        className={cn(
                            "pointer-events-auto flex size-10 items-center justify-center rounded-full backdrop-blur-md text-white transition-all",
                            "bg-white/15 border border-white/20",
                            "hover:bg-white/30 hover:scale-110 active:scale-95",
                            "opacity-0 group-hover:opacity-100"
                        )}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            </div>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                {slides.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={cn(
                            "rounded-full transition-all duration-500",
                            i === current
                                ? "w-10 h-2.5 bg-white shadow-md"
                                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                        )}
                        aria-label={`Go to slide ${i + 1}: ${s.title}`}
                        aria-current={i === current ? "true" : undefined}
                    />
                ))}
            </div>

            <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/30 backdrop-blur-md text-white/80 border border-white/10">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {current + 1} / {len}
                </span>
            </div>
        </div>
    )
}

export { EventSlideshow }
export type { EventSlide }
