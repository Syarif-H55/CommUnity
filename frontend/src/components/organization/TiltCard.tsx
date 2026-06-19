"use client"

import { useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps {
    children: ReactNode
    className?: string
    tiltDegree?: number
    glare?: boolean
}

function TiltCard({ children, className, tiltDegree = 8, glare = true }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState<React.CSSProperties>({})
    const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({})

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -tiltDegree
        const rotateY = ((x - centerX) / centerX) * tiltDegree

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: "transform 0.1s ease-out",
        })

        if (glare) {
            const glareX = (x / rect.width) * 100
            const glareY = (y / rect.height) * 100
            setGlareStyle({
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            })
        }
    }

    function handleMouseLeave() {
        setStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: "transform 0.5s ease-out",
        })
        setGlareStyle({})
    }

    return (
        <div
            ref={cardRef}
            className={cn("relative", className)}
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="relative overflow-hidden rounded-xl"
                style={{ transformStyle: "preserve-3d", ...style }}
            >
                {children}
                {glare && (
                    <div
                        className="pointer-events-none absolute inset-0 rounded-xl"
                        style={glareStyle}
                    />
                )}
            </div>
        </div>
    )
}

export { TiltCard }
