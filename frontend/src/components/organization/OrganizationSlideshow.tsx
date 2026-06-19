"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface Slide {
    image: string
    title: string
    description: string
}

interface OrganizationSlideshowProps {
    slides: Slide[]
    autoPlayInterval?: number
    className?: string
}

function OrganizationSlideshow({ slides, autoPlayInterval = 5000, className }: OrganizationSlideshowProps) {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [direction, setDirection] = useState<"left" | "right">("right")
    const len = slides.length

    const goTo = useCallback((index: number) => {
        setDirection(index > current ? "right" : "left")
        setCurrent(((index % len) + len) % len)
    }, [current, len])

    const next = useCallback(() => goTo(current + 1), [goTo, current])
    const prev = useCallback(() => goTo(current - 1), [goTo, current])

    useEffect(() => {
        if (isPaused || len <= 1) return
        const timer = setInterval(next, autoPlayInterval)
        return () => clearInterval(timer)
    }, [isPaused, len, autoPlayInterval, next])

    if (len === 0) return null

    const slide = slides[current]

    return (
        <div
            className={cn("relative overflow-hidden rounded-2xl", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative aspect-[21/9] overflow-hidden">
                {slides.map((s, i) => (
                    <div
                        key={i}
                        className={cn(
                            "absolute inset-0 transition-all duration-700 ease-in-out",
                            i === current
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-105"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />
                        <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${s.image})` }}
                        />
                    </div>
                ))}

                <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-12">
                    <div
                        key={current}
                        className="animate-fade-slide-up"
                    >
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                            {slide.title}
                        </h3>
                        <p className="text-base md:text-lg text-white/80 max-w-2xl drop-shadow">
                            {slide.description}
                        </p>
                    </div>
                </div>

                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                        onClick={() => setIsPaused((p) => !p)}
                        className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                        aria-label={isPaused ? "Play" : "Pause"}
                    >
                        {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                    </button>
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            i === current
                                ? "w-8 bg-white"
                                : "w-2 bg-white/40 hover:bg-white/60"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            <button
                onClick={prev}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100"
                aria-label="Previous slide"
            >
                <ChevronLeft className="size-5" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100"
                aria-label="Next slide"
            >
                <ChevronRight className="size-5" />
            </button>
        </div>
    )
}

export { OrganizationSlideshow }
