"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlProps {
    currentPage: number
    lastPage: number
    total: number
    onPageChange: (page: number) => void
    className?: string
}

function PaginationControl({ currentPage, lastPage, total, onPageChange, className }: PaginationControlProps) {
    if (lastPage <= 1) return null

    const getPageNumbers = () => {
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
    }

    const from = (currentPage - 1) * 10 + 1
    const to = Math.min(currentPage * 10, total)

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
            <p className="text-sm text-muted-foreground">
                Menampilkan <span className="font-medium">{from}</span> —{" "}
                <span className="font-medium">{to}</span> dari{" "}
                <span className="font-medium">{total}</span> event
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="size-4" />
                </button>

                {getPageNumbers().map((page, i) =>
                    page === "ellipsis" ? (
                        <span key={`e-${i}`} className="flex size-9 items-center justify-center text-xs text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-all",
                                page === currentPage
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "border border-border bg-background text-foreground hover:bg-muted"
                            )}
                            aria-current={page === currentPage ? "page" : undefined}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Next page"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>
        </div>
    )
}

export { PaginationControl }
