"use client"

import { useState, useCallback, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: ReactNode
}

function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const isOpen = isControlled ? controlledOpen : internalOpen

    const setOpen = useCallback(
        (value: boolean) => {
            if (!isControlled) setInternalOpen(value)
            onOpenChange?.(value)
        },
        [isControlled, onOpenChange]
    )

    return (
        <DialogContext.Provider value={{ open: isOpen, setOpen }}>
            {children}
        </DialogContext.Provider>
    )
}

import { createContext, useContext } from "react"

interface DialogContextType {
    open: boolean
    setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | null>(null)

function useDialog() {
    const ctx = useContext(DialogContext)
    if (!ctx) throw new Error("Dialog compound components must be used within Dialog")
    return ctx
}

function DialogTrigger({ children, asChild, ...props }: { children: ReactNode; asChild?: boolean; className?: string }) {
    const { setOpen } = useDialog()
    return (
        <div onClick={() => setOpen(true)} {...props}>
            {children}
        </div>
    )
}

function DialogContent({ className, children, ...props }: React.ComponentProps<"div">) {
    const { open, setOpen } = useDialog()

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [open])

    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false)
        }
        if (open) window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [open, setOpen])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />
            <div
                data-slot="dialog-content"
                className={cn(
                    "relative z-50 w-full max-w-lg rounded-xl bg-card p-6 shadow-2xl",
                    "animate-in fade-in zoom-in-95",
                    className
                )}
                {...props}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="size-4" />
                </button>
                {children}
            </div>
        </div>
    )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("mb-4 space-y-1.5", className)}
            {...props}
        />
    )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
    return (
        <h2
            data-slot="dialog-title"
            className={cn("text-lg font-semibold", className)}
            {...props}
        />
    )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="dialog-description"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn("mt-6 flex items-center justify-end gap-3", className)}
            {...props}
        />
    )
}

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
}
