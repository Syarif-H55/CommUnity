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
    { id: 1, label: "Lingkungan", icon: "🌿" },
    { id: 2, label: "Pendidikan", icon: "📚" },
    { id: 3, label: "Kesehatan", icon: "💊" },
    { id: 4, label: "Sosial", icon: "🤝" },
    { id: 5, label: "Kemanusiaan", icon: "🆘" },
]

interface FormErrors {
    title?: string
    description?: string
    event_date?: string
    start_time?: string
    end_time?: string
    location_name?: string
    category_id?: string
    quota?: string
    banner?: string
}

function validateForm(data: CreateEventRequest): FormErrors {
    const errors: FormErrors = {}

    if (!data.title?.trim()) {
        errors.title = "Judul event wajib diisi"
    } else if (data.title.length < 5) {
        errors.title = "Judul minimal 5 karakter"
    }

    if (data.description && data.description.length < 20) {
        errors.description = "Deskripsi minimal 20 karakter"
    }

    if (!data.event_date) {
        errors.event_date = "Tanggal event wajib diisi"
    } else {
        const selectedDate = new Date(data.event_date + "T00:00:00")
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
            errors.event_date = "Tanggal tidak boleh sebelum hari ini"
        }
    }

    if (!data.start_time) {
        errors.start_time = "Waktu mulai wajib diisi"
    }

    if (!data.end_time) {
        errors.end_time = "Waktu selesai wajib diisi"
    }

    if (data.start_time && data.end_time && data.start_time >= data.end_time) {
        errors.end_time = "Waktu selesai harus setelah waktu mulai"
    }

    if (!data.location_name?.trim()) {
        errors.location_name = "Lokasi event wajib diisi"
    }

    if (!data.category_id) {
        errors.category_id = "Kategori event wajib dipilih"
    }

    if (!data.quota || data.quota < 1) {
        errors.quota = "Minimal 1 peserta"
    } else if (data.quota > 10000) {
        errors.quota = "Maksimal 10.000 peserta"
    }

    return errors
}

function EventForm({ mode, initialData, onSubmit, isSubmitting, serverError }: EventFormProps) {
    const [title, setTitle] = useState(initialData?.title || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [eventDate, setEventDate] = useState(initialData?.event_date || "")
    const [startTime, setStartTime] = useState(initialData?.start_time || "")
    const [endTime, setEndTime] = useState(initialData?.end_time || "")
    const [locationName, setLocationName] = useState(initialData?.location_name || "")
    const [categoryId, setCategoryId] = useState<number>(initialData?.category_id || 0)
    const [quota, setQuota] = useState(String(initialData?.quota || ""))
    const [banner, setBanner] = useState<File | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Set<string>>(new Set())
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleBlur = (field: string) => {
        setTouched((prev) => new Set(prev).add(field))
        const data: CreateEventRequest = {
            title, description: description || undefined, event_date: eventDate,
            start_time: startTime, end_time: endTime, location_name: locationName,
            category_id: categoryId, quota: parseInt(quota) || 0,
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
            description: description.trim() || undefined,
            event_date: eventDate,
            start_time: startTime,
            end_time: endTime,
            location_name: locationName.trim(),
            category_id: categoryId,
            quota: parseInt(quota) || 0,
        }

        const validationErrors = validateForm(data)
        setErrors(validationErrors)
        setTouched(new Set([
            "title", "description", "event_date",
            "start_time", "end_time", "location_name", "category_id", "quota"
        ]))

        if (Object.keys(validationErrors).length > 0) return

        if (banner) {
            data.banner = banner
        }

        const submitData = mode === "create" ? data : buildUpdateData(data)

        onSubmit(mode === "create" ? data : submitData)
    }

    const buildUpdateData = (data: CreateEventRequest) => {
        const updateData: Record<string, unknown> = {}
        if (data.title !== initialData?.title) updateData.title = data.title
        if (data.description !== initialData?.description) updateData.description = data.description
        if (data.event_date !== initialData?.event_date) updateData.event_date = data.event_date
        if (data.start_time !== initialData?.start_time) updateData.start_time = data.start_time
        if (data.end_time !== initialData?.end_time) updateData.end_time = data.end_time
        if (data.location_name !== initialData?.location_name) updateData.location_name = data.location_name
        if (data.category_id !== initialData?.category_id) updateData.category_id = data.category_id
        if (data.quota !== initialData?.quota) updateData.quota = data.quota
        if (banner) updateData.banner = banner
        return updateData as UpdateEventRequest
    }

    const isFormValid = () => {
        return title.trim() && eventDate && startTime && endTime &&
            locationName.trim() && categoryId > 0 && parseInt(quota) > 0
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
                            Deskripsi
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

                    <div className="space-y-2">
                        <Label htmlFor="event_date" className="text-sm font-medium">
                            Tanggal <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <input
                                id="event_date"
                                type="date"
                                value={eventDate}
                                onChange={(e) => { setEventDate(e.target.value); setErrors((prev) => ({ ...prev, event_date: undefined })) }}
                                onBlur={() => handleBlur("event_date")}
                                className={cn(
                                    "flex h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm",
                                    "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                                    errors.event_date && touched.has("event_date") && "border-red-500 focus:ring-red-500/20"
                                )}
                            />
                        </div>
                        {errors.event_date && touched.has("event_date") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.event_date}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="start_time" className="text-sm font-medium">
                                Waktu Mulai <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <input
                                    id="start_time"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => { setStartTime(e.target.value); setErrors((prev) => ({ ...prev, start_time: undefined })) }}
                                    onBlur={() => handleBlur("start_time")}
                                    className={cn(
                                        "flex h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm",
                                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                                        errors.start_time && touched.has("start_time") && "border-red-500 focus:ring-red-500/20"
                                    )}
                                />
                            </div>
                            {errors.start_time && touched.has("start_time") && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="size-3" />
                                    {errors.start_time}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_time" className="text-sm font-medium">
                                Waktu Selesai <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <input
                                    id="end_time"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => { setEndTime(e.target.value); setErrors((prev) => ({ ...prev, end_time: undefined })) }}
                                    onBlur={() => handleBlur("end_time")}
                                    className={cn(
                                        "flex h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm",
                                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                                        errors.end_time && touched.has("end_time") && "border-red-500 focus:ring-red-500/20"
                                    )}
                                />
                            </div>
                            {errors.end_time && touched.has("end_time") && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="size-3" />
                                    {errors.end_time}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location_name" className="text-sm font-medium">
                            Lokasi <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="location_name"
                                value={locationName}
                                onChange={(e) => { setLocationName(e.target.value); setErrors((prev) => ({ ...prev, location_name: undefined })) }}
                                onBlur={() => handleBlur("location_name")}
                                placeholder="Contoh: Jl. Merdeka No. 10, Jakarta Pusat"
                                className={cn("pl-10", errors.location_name && touched.has("location_name") && "border-red-500 focus:ring-red-500/20")}
                            />
                        </div>
                        {errors.location_name && touched.has("location_name") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.location_name}
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => { setCategoryId(cat.id); setErrors((prev) => ({ ...prev, category_id: undefined })) }}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                                        categoryId === cat.id
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-950/30 dark:text-emerald-400"
                                            : "border-border bg-background hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                                    )}
                                >
                                    <span className="text-lg">{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.category_id && touched.has("category_id") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="quota" className="text-sm font-medium">
                            Maksimal Peserta <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative max-w-xs">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="quota"
                                type="number"
                                min={1}
                                max={10000}
                                value={quota}
                                onChange={(e) => {
                                    setQuota(e.target.value)
                                    setErrors((prev) => ({ ...prev, quota: undefined }))
                                }}
                                onBlur={() => handleBlur("quota")}
                                placeholder="100"
                                className={cn(
                                    "pl-10",
                                    errors.quota && touched.has("quota") && "border-red-500 focus:ring-red-500/20"
                                )}
                            />
                        </div>
                        {errors.quota && touched.has("quota") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {errors.quota}
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
