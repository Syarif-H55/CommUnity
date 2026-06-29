"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useRegisterOrganization } from "@/hooks/useOrganization"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
    ArrowLeft, Building2, FileText, CheckCircle,
    AlertCircle, Loader2, Upload, ChevronRight, ChevronLeft, Send
} from "lucide-react"
import type { AxiosError } from "axios"
import type { ApiResponse } from "@/types"

interface FormData {
    name: string
    description: string
    logo: File | null
}

interface FormErrors {
    name?: string
    description?: string
    logo?: string
}

const STEPS = [
    { title: "Informasi Dasar", description: "Nama dan deskripsi organisasi", icon: Building2 },
    { title: "Dokumen & Logo", description: "Upload logo dan dokumen", icon: Upload },
    { title: "Konfirmasi", description: "Review data organisasi", icon: CheckCircle },
]

function RegisterOrganizationContent() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const register = useRegisterOrganization()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [step, setStep] = useState(0)
    const [form, setForm] = useState<FormData>({
        name: "",
        description: "",
        logo: null,
    })
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<FormErrors>({})
    const [serverError, setServerError] = useState("")

    function validateStep(currentStep: number): boolean {
        const newErrors: FormErrors = {}

        if (currentStep === 0) {
            if (!form.name.trim()) newErrors.name = "Nama organisasi wajib diisi"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleNext() {
        setServerError("")
        if (!validateStep(step)) return

        if (step < STEPS.length - 1) {
            setStep((s) => s + 1)
        }
    }

    function handleBack() {
        setServerError("")
        setErrors({})
        setStep((s) => Math.max(0, s - 1))
    }

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setForm((prev) => ({ ...prev, logo: file }))
        const reader = new FileReader()
        reader.onload = () => setLogoPreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    async function handleSubmit() {
        setServerError("")
        setErrors({})

        register.mutate(
            { name: form.name, description: form.description, logo: form.logo || undefined },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({ queryKey: ["user-context"] })
                    router.push("/organizations")
                },
                onError: (error) => {
                    const axiosError = error as AxiosError<ApiResponse>
                    const data = axiosError.response?.data
                    if (data?.errors) {
                        const mapped: FormErrors = {}
                        for (const [key, messages] of Object.entries(data.errors)) {
                            mapped[key as keyof FormErrors] = messages[0]
                        }
                        setErrors(mapped)
                    } else {
                        setServerError(data?.message || "Gagal mendaftarkan organisasi.")
                    }
                },
            }
        )
    }

    const progressValue = ((step + 1) / STEPS.length) * 100
    const Icon = STEPS[step].icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="mx-auto max-w-2xl px-6 py-8">
                <Link
                    href="/organizations"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke Organisasi
                </Link>
                <div className="mb-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            {STEPS[step].title}
                        </h1>
                        <span className="text-sm text-muted-foreground">
                            Langkah {step + 1} dari {STEPS.length}
                        </span>
                    </div>
                    <Progress value={progressValue} variant="success" />
                    <div className="hidden sm:flex items-center justify-between">
                        {STEPS.map((s, i) => {
                            const StepIcon = s.icon
                            const isActive = i === step
                            const isCompleted = i < step
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 text-sm ${
                                        isActive
                                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                            : isCompleted
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-muted-foreground"
                                    }`}
                                >
                                    <div className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                                        isActive
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : isCompleted
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                : "bg-muted text-muted-foreground"
                                    }`}>
                                        {isCompleted ? <CheckCircle className="size-4" /> : i + 1}
                                    </div>
                                    <span className="hidden md:inline">{s.title}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <Card className="border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
                    <CardHeader className="pb-4 text-center">
                        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Icon className="size-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <CardTitle className="text-lg">{STEPS[step].title}</CardTitle>
                        <CardDescription>{STEPS[step].description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {serverError && (
                            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                <span>{serverError}</span>
                            </div>
                        )}

                        {step === 0 && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Organisasi</Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan nama organisasi"
                                        value={form.name}
                                        onChange={(e) => {
                                            setForm((prev) => ({ ...prev, name: e.target.value }))
                                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                                        }}
                                        aria-invalid={!!errors.name}
                                        className="h-10"
                                    />
                                    {errors.name && (
                                        <p className="flex items-center gap-1.5 text-xs text-red-500">
                                            <AlertCircle className="size-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi Organisasi</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Jelaskan tentang organisasi Anda, misi, dan kegiatan yang dilakukan"
                                        value={form.description}
                                        onChange={(e) => {
                                            setForm((prev) => ({ ...prev, description: e.target.value }))
                                            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
                                        }}
                                        aria-invalid={!!errors.description}
                                        className="h-28"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Deskripsi akan tampil di halaman profil organisasi Anda
                                    </p>
                                    {errors.description && (
                                        <p className="flex items-center gap-1.5 text-xs text-red-500">
                                            <AlertCircle className="size-3" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Logo Organisasi</Label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 transition-all hover:border-muted-foreground/40 hover:bg-muted/30"
                                    >
                                        {logoPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="size-24 rounded-xl object-cover shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setLogoPreview(null)
                                                        setForm((prev) => ({ ...prev, logo: null }))
                                                    }}
                                                    className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs shadow-sm"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                    <Upload className="size-6" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium">Upload Logo</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        JPG atau PNG. Maksimal 2MB
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                    {errors.logo && (
                                        <p className="flex items-center gap-1.5 text-xs text-red-500">
                                            <AlertCircle className="size-3" />
                                            {errors.logo}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl border bg-muted/30 p-4">
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="size-4 text-emerald-600" />
                                        Dokumen Verifikasi
                                    </p>
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        Setelah mendaftar, Anda dapat mengupload dokumen verifikasi di halaman detail organisasi.
                                        Dokumen diperlukan untuk verifikasi status organisasi oleh admin.
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div className="rounded-xl border bg-muted/30 p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Logo"
                                                className="size-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <Building2 className="size-6" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-base">{form.name || "(belum diisi)"}</p>
                                            <p className="text-xs text-muted-foreground">Organisasi Sosial</p>
                                        </div>
                                    </div>

                                    {form.description && (
                                        <div className="border-t pt-4">
                                            <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                                            <p className="text-sm">{form.description}</p>
                                        </div>
                                    )}

                                    <div className="border-t pt-4">
                                        <p className="text-xs text-muted-foreground mb-2">Ringkasan</p>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="size-4 text-emerald-500" />
                                                Organisasi akan terdaftar dengan status <strong>Pending</strong>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="size-4 text-emerald-500" />
                                                Upload dokumen verifikasi setelah pendaftaran
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="size-4 text-emerald-500" />
                                                Admin akan memverifikasi dokumen Anda
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                {step > 0 && (
                                    <Button variant="outline" onClick={handleBack} className="gap-2">
                                        <ChevronLeft className="size-4" />
                                        Kembali
                                    </Button>
                                )}
                            </div>
                            {step < STEPS.length - 1 ? (
                                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                                    Lanjut
                                    <ChevronRight className="size-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={register.isPending}
                                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                                >
                                    {register.isPending ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Mendaftarkan...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-4" />
                                            Daftarkan Organisasi
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default function RegisterOrganizationPage() {
    return <RegisterOrganizationContent />
}
