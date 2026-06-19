import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<"div"> {
    value?: number
    max?: number
    variant?: "default" | "success" | "warning"
}

function Progress({
    className,
    value = 0,
    max = 100,
    variant = "default",
    ...props
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
        <div
            data-slot="progress"
            className={cn(
                "h-2 w-full overflow-hidden rounded-full bg-muted",
                className
            )}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            {...props}
        >
            <div
                className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    variant === "success" && "bg-emerald-500",
                    variant === "warning" && "bg-amber-500",
                    variant === "default" && "bg-primary"
                )}
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}

export { Progress }
