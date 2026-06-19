"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface DocumentUploadProps {
    onUpload: (file: File) => void
    isUploading?: boolean
    acceptedFormats?: string
    maxSizeMB?: number
    className?: string
    uploadedFileName?: string | null
}

function DocumentUpload({
    onUpload,
    isUploading = false,
    acceptedFormats = ".pdf,.jpg,.jpeg,.png",
    maxSizeMB = 5,
    className,
    uploadedFileName,
}: DocumentUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")

    function validateFile(f: File): boolean {
        setError("")
        const ext = f.name.split(".").pop()?.toLowerCase()
        const allowed = acceptedFormats.split(",").map((f) => f.trim().replace(".", "").toLowerCase())
        if (!ext || !allowed.includes(ext)) {
            setError(`Format file tidak didukung. Gunakan: ${acceptedFormats}`)
            return false
        }
        if (f.size > maxSizeMB * 1024 * 1024) {
            setError(`Ukuran file maksimal ${maxSizeMB}MB`)
            return false
        }
        return true
    }

    function handleFile(f: File) {
        if (!validateFile(f)) return
        setFile(f)
        onUpload(f)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        const f = e.dataTransfer.files?.[0]
        if (f) handleFile(f)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (f) handleFile(f)
    }

    function handleRemove() {
        setFile(null)
        setError("")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const hasFile = !!file || !!uploadedFileName
    const fileName = file?.name || uploadedFileName || ""

    return (
        <div className={cn("space-y-3", className)}>
            {!hasFile ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all",
                        dragOver
                            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                            : "border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/30"
                    )}
                >
                    <div className={cn(
                        "flex size-12 items-center justify-center rounded-full transition-colors",
                        dragOver
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                    )}>
                        {isUploading ? (
                            <Loader2 className="size-6 animate-spin" />
                        ) : (
                            <Upload className="size-6" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium">
                            {isUploading ? "Mengunggah..." : "Klik atau seret file ke sini"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            PDF, JPG, atau PNG (maks. {maxSizeMB}MB)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <FileText className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Dokumen siap diunggah</p>
                    </div>
                    {isUploading ? (
                        <Loader2 className="size-5 animate-spin text-emerald-600 shrink-0" />
                    ) : (
                        <button
                            onClick={handleRemove}
                            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            )}

            {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                onChange={handleChange}
                className="hidden"
            />
        </div>
    )
}

export { DocumentUpload }
