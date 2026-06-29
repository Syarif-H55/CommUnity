"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useUpdateProfile, useUploadProfilePhoto } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { User, Mail, Loader2, Camera, Save, AlertCircle } from "lucide-react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types";

interface FormErrors {
    full_name?: string;
    username?: string;
    email?: string;
}

function ProfileContent() {
    const user = useAuthStore((state) => state.user);
    const updateProfile = useUpdateProfile();
    const uploadPhoto = useUploadProfilePhoto();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        full_name: user?.full_name || "",
        username: user?.username || "",
        email: user?.email || "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    function validate(): boolean {
        const newErrors: FormErrors = {};

        if (!form.full_name.trim()) {
            newErrors.full_name = "Nama lengkap wajib diisi";
        }

        if (!form.username.trim()) {
            newErrors.username = "Username wajib diisi";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Format email tidak valid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        setServerError("");
        setSuccessMessage("");
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setServerError("");
        setSuccessMessage("");

        if (!validate()) return;

        updateProfile.mutate(form, {
            onSuccess: () => {
                setSuccessMessage("Profil berhasil diperbarui.");
            },
            onError: (error) => {
                const axiosError = error as AxiosError<ApiResponse>;
                const data = axiosError.response?.data;
                if (data?.errors) {
                    const mapped: FormErrors = {};
                    for (const [key, messages] of Object.entries(data.errors)) {
                        mapped[key as keyof FormErrors] = messages[0];
                    }
                    setErrors(mapped);
                } else {
                    setServerError(data?.message || "Gagal memperbarui profil.");
                }
            },
        });
    }

    function handlePhotoClick() {
        fileInputRef.current?.click();
    }

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setServerError("");
        setSuccessMessage("");

        const formData = new FormData();
        formData.append("photo", file);

        uploadPhoto.mutate(formData, {
            onSuccess: () => {
                setSuccessMessage("Foto profil berhasil diperbarui.");
            },
            onError: (error) => {
                const axiosError = error as AxiosError<ApiResponse>;
                const data = axiosError.response?.data;
                setServerError(data?.message || "Gagal mengunggah foto.");
            },
        });
    }

    const hasChanges =
        form.full_name !== user?.full_name ||
        form.username !== user?.username ||
        form.email !== user?.email;

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <main className="flex flex-1 items-center justify-center p-6">
                <Card className="w-full max-w-lg border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
                    <CardHeader className="pb-6 text-center">
                        <div className="relative mx-auto mb-3">
                            <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                {user?.profile_photo_url ? (
                                    <img
                                        src={user.profile_photo_url}
                                        alt={user.full_name}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <User className="size-10 text-emerald-600 dark:text-emerald-400" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handlePhotoClick}
                                disabled={uploadPhoto.isPending}
                                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {uploadPhoto.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Camera className="size-4" />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <CardTitle className="text-xl">{user?.full_name}</CardTitle>
                        <CardDescription>@{user?.username}</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSave} noValidate>
                        <CardContent className="space-y-5">
                            {serverError && (
                                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                    <span>{serverError}</span>
                                </div>
                            )}

                            {successMessage && (
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400">
                                    {successMessage}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-sm font-medium">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    placeholder="Masukkan nama lengkap"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.full_name}
                                    className="h-10"
                                />
                                {errors.full_name && (
                                    <p className="flex items-center gap-1.5 text-xs text-red-500">
                                        <AlertCircle className="size-3" />
                                        {errors.full_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Masukkan username"
                                    value={form.username}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.username}
                                    className="h-10"
                                />
                                {errors.username && (
                                    <p className="flex items-center gap-1.5 text-xs text-red-500">
                                        <AlertCircle className="size-3" />
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Masukkan email"
                                        value={form.email}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.email}
                                        className="h-10 pl-10"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="flex items-center gap-1.5 text-xs text-red-500">
                                        <AlertCircle className="size-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex-col gap-3 pt-2">
                            <Button
                                type="submit"
                                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-base shadow-sm gap-2"
                                disabled={updateProfile.isPending || !hasChanges}
                            >
                                {updateProfile.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                {updateProfile.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return <ProfileContent />;
}
