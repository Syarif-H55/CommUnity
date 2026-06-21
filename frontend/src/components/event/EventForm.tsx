"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    ImagePlus, X, Loader2, Calendar, Clock, MapPin, Users,
    Tag, FileText, AlertCircle, CheckCircle2
} from "lucide-react"
import type { CreateEventRequest, UpdateEventRequest } from "@/types"

interface EventFormProps {
    mode: "create" | "edit"
    initialData?: Partial<CreateEventRequest>
    onSubmit: (data: CreateEventRequest | UpdateEventRequest) => void
    isSubmitting: boolean
    serverError?: string | null
}

const CATEGORIES = [
    { value: "Sosial", label: "Sosial", icon: "🤝" },
    { value: "Pendidikan", label: "Pendidikan", icon: "📚" },
    { value: "Lingkungan", label: "Lingkungan", icon: "🌿" },
    { value: "Kesehatan", label: "Kesehatan", icon: "💊" },
    { value: "Budaya", label: "Budaya", icon: "🎭" },
    { value: "Bencana", label: "Bencana", icon: "🆘" },
    { value: "Lainnya", label: "Lainnya", icon: "📌" },
]

interface FormErrors {
    title?: string
    description?: string
    date?: string
    time?: string
    location?: string
    category?: string
    max_participants?: string
    banner?: string
}

function validateForm(data: CreateEventRequest): FormErrors {
    const errors: FormErrors = {}

    if (!data.title?.trim()) {
        errors.title = "Judul event wajib diisi"
    } else if (data.title.length < 5) {
        errors.title = "Judul minimal 5 karakter"
    }

    if (!data.description?.trim()) {
        errors.description = "Deskripsi event wajib diisi"
    } else if (data.description.length < 20) {
        errors.description = "Deskripsi minimal 20 karakter"
    }

    if (!data.date) {
        errors.date = "Tanggal event wajib diisi"
    } else {
        const selectedDate = new Date(data.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
            errors.date = "Tanggal tidak boleh sebelum hari ini"
        }
    }

    if (!data.time) {
        errors.time = "Waktu event wajib diisi"
    }

    if (!data.location?.trim()) {
        errors.location = "Lokasi event wajib diisi"
    }

    if (!data.category) {
        errors.category = "Kategori event wajib dipilih"
    }

    if (!data.max_participants || data.max_participants < 1) {
        errors.max_participants = "Minimal 1 peserta"
    } else if (data.max_participants > 10000) {
        errors.max_participants = "Maksimal 10.000 peserta"
    }

    return errors
}

function EventForm({ mode, initialData, onSubmit, isSubmitting, serverError }: EventFormProps) {
    const [title, setTitle] = useState(initialData?.title || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [date, setDate] = useState(initialData?.date || "")
    const [time, setTime] = useState(initialData?.time || "")
    const [location, setLocation] = useState(initialData?.location || "")
    const [category, setCategory] = useState(initialData?.category || "")
    const [maxParticipants, setMaxParticipants] = useState(String(initialData?.max_participants || ""))
    const [banner, setBanner] = useState<File | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Set<string>>(new Set())
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleBlur = (field: string) => {
        setTouched((prev) => new Set(prev).add(field))
        const data: CreateEventRequest = {
            title, description, date, time, location, category,
            max_participants: parseInt(maxParticipants) || 0,
        }
        const newErrors = validateForm(data)
        setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }))
    }

    const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, banner: "Maksimal ukuran banner 5MB" }))
            return
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setErrors((prev) => ({ ...prev, banner: "Format harus JPG, PNG, atau WebP" }))
            return
        }

        setBanner(file)
        setErrors((prev) => ({ ...prev, banner: undefined }))
        const reader = new FileReader()
        reader.onload = () => setBannerPreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const removeBanner = () => {
        setBanner(null)
        setBannerPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data: CreateEventRequest = {
            title: title.trim(),
            description: description.trim(),
            date,
            time,
            location: location.trim(),
            category,
            max_participants: parseInt(maxParticipants) || 0,
        }

        const validationErrors = validateForm(data)
        setErrors(validationErrors)
        setTouched(new Set([
            "title", "description", "date", "time",
            "location", "category", "max_participants"
        ]))

        if (Object.keys(validationErrors).length > 0) return

        const submitData = mode === "create" ? data : {
            ...(data.title !== initialData?.title && { title: data.title }),
            ...(data.description !== initialData?.description && { description: data.description }),
            ...(data.date !== initialData?.date && { date: data.date }),
            ...(data.time !== initialData?.time && { time: data.time }),
            ...(data.location !== initialData?.location && { location: data.location }),
            ...(data.category !== initialData?.category && { category: data.category }),
            ...(data.max_participants !== initialData?.max_participants && { max_participants: data.max_participants }),
        }

        onSubmit(mode === "create" ? data : submitData)
    }

    const isFormValid = () => {
        return title.trim() && description.trim() && date && time &&
            location.trim() && category && parseInt(maxParticipants) > 0
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {serverError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                    <AlertCircle className="size-5 shrink-0" />
                    <span>{serverError}</span>
                </div>
            )}

            {/* Banner Upload */}
            <Card className="border-emerald-100/50 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-5 border-b border-border/50">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <ImagePlus className="size-4 text-emerald-600" />
                            Banner Event
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Unggah banner untuk mempercantik tampilan event (opsional, maks 5MB)
                        </p>
                    </div>

                    <div className="p-5">
                        {bannerPreview ? (
                            <div className="relative rounded-xl overflow-hidden">
                                <img
                                    src={bannerPreview}
                                    alt="Banner preview"
                                    className="w-full aspect-[21/9] object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeBanner}
                                    className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "w-full aspect-[21/9] rounded-xl border-2 border-dashed transition-all",
                                    "flex flex-col items-center justify-center gap-2",
                                    errors.banner
                                        ? "border-red-300 bg-red-50/50 dark:border-red-800/30 dark:bg-red-950/20"
                                        : "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 hover:bg-emerald-100/50 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:hover:border-emerald-600"
                                )}
                            >
                                <ImagePlus className="size-10 text-emerald-400" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                        Klik untuk upload banner
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        JPG, PNG, atau WebP — Maks 5MB
                                    </p>
                                </div>
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleBannerSelect}
                            className="hidden"
                        />
                        {errors.banner && (
                            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.banner}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Informasi Utama */}
            <Card className="border-emerald-100/50 shadow-sm">
                <CardContent className="p-5 space-y-5">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                        <FileText className="size-4 text-emerald-600" />
                        <h3 className="text-sm font-semibold">Informasi Event</h3>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Judul Event <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: undefined })) }}
                            onBlur={() => handleBlur("title")}
                            placeholder="Contoh: Bakti Sosial di Panti Asuhan"
                            className={cn(errors.title && touched.has("title") && "border-red-500 focus:ring-red-500/20")}
                        />
                        {errors.title && touched.has("title") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Deskripsi <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => { setDescription(e.target.value); setErrors((prev) => ({ ...prev, description: undefined })) }}
                            onBlur={() => handleBlur("description")}
                            placeholder="Jelaskan detail kegiatan, tujuan, dan hal yang perlu diketahui relawan..."
                            rows={5}
                            className={cn(errors.description && touched.has("description") && "border-red-500 focus:ring-red-500/20")}
                        />
                        <div className="flex justify-between">
                            {errors.description && touched.has("description") ? (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="size-3" />
                                    {errors.description}
                                </p>
                            ) : <span />}
                            <span className="text-xs text-muted-foreground">{description.length} karakter</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Waktu & Lokasi */}
            <Card className="border-emerald-100/50 shadow-sm">
                <CardContent className="p-5 space-y-5">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                        <Calendar className="size-4 text-emerald-600" />
                        <h3 className="text-sm font-semibold">Waktu & Lokasi</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium">
                                Tanggal <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: undefined })) }}
                                    onBlur={() => handleBlur("date")}
                                    className={cn(
                                        "flex h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm",
                                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                                        errors.date && touched.has("date") && "border-red-500 focus:ring-red-500/20"
                                    )}
                                />
                            </div>
                            {errors.date && touched.has("date") && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="size-3" />
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-sm font-medium">
                                Waktu <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => { setTime(e.target.value); setErrors((prev) => ({ ...prev, time: undefined })) }}
                                    onBlur={() => handleBlur("time")}
                                    className={cn(
                                        "flex h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm",
                                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                                        errors.time && touched.has("time") && "border-red-500 focus:ring-red-500/20"
                                    )}
                                />
                            </div>
                            {errors.time && touched.has("time") && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="size-3" />
                                    {errors.time}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">
                            Lokasi <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => { setLocation(e.target.value); setErrors((prev) => ({ ...prev, location: undefined })) }}
                                onBlur={() => handleBlur("location")}
                                placeholder="Contoh: Jl. Merdeka No. 10, Jakarta Pusat"
                                className={cn("pl-10", errors.location && touched.has("location") && "border-red-500 focus:ring-red-500/20")}
                            />
                        </div>
                        {errors.location && touched.has("location") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.location}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Kategori & Kapasitas */}
            <Card className="border-emerald-100/50 shadow-sm">
                <CardContent className="p-5 space-y-5">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                        <Tag className="size-4 text-emerald-600" />
                        <h3 className="text-sm font-semibold">Kategori & Kapasitas</h3>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Kategori <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => { setCategory(cat.value); setErrors((prev) => ({ ...prev, category: undefined })) }}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                                        category === cat.value
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-950/30 dark:text-emerald-400"
                                            : "border-border bg-background hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                    )}
                                >
                                    <span className="text-lg">{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.category && touched.has("category") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="max_participants" className="text-sm font-medium">
                            Maksimal Peserta <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative max-w-xs">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="max_participants"
                                type="number"
                                min={1}
                                max={10000}
                                value={maxParticipants}
                                onChange={(e) => {
                                    setMaxParticipants(e.target.value)
                                    setErrors((prev) => ({ ...prev, max_participants: undefined }))
                                }}
                                onBlur={() => handleBlur("max_participants")}
                                placeholder="100"
                                className={cn(
                                    "pl-10",
                                    errors.max_participants && touched.has("max_participants") && "border-red-500 focus:ring-red-500/20"
                                )}
                            />
                        </div>
                        {errors.max_participants && touched.has("max_participants") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.max_participants}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className={cn(
                        "min-w-[160px] gap-2",
                        "bg-gradient-to-r from-emerald-600 to-emerald-500",
                        "hover:from-emerald-700 hover:to-emerald-600",
                        "shadow-lg shadow-emerald-900/20",
                        "transition-all active:scale-95"
                    )}
                    size="lg"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            {mode === "create" ? "Menyimpan..." : "Memperbarui..."}
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="size-4" />
                            {mode === "create" ? "Buat Event" : "Simpan Perubahan"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

export { EventForm }
