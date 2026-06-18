"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useAuth";
import type { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  User,
  Lock,
  Mail,
  UserCircle,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import type { ApiResponse } from "@/types";

interface FormErrors {
  full_name?: string;
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = "Nama lengkap wajib diisi";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (form.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.password) {
      newErrors.password = "Password wajib diisi";
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (!form.password_confirmation) {
      newErrors.password_confirmation = "Konfirmasi password wajib diisi";
    } else if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    register.mutate(
      {
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      },
      {
        onSuccess: () => {
          router.push("/");
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
            setServerError(
              data?.message || "Registrasi gagal. Silakan coba lagi."
            );
          }
        },
      }
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  return (
    <Card className="w-full border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
      <CardHeader className="pb-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
          <UserPlus className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-xl">Buat Akun Baru</CardTitle>
        <CardDescription>
          Daftar untuk bergabung dengan komunitas dan mulai berkontribusi
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium">
              Nama Lengkap
            </Label>
            <div className="relative">
              <UserCircle className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="full_name"
                name="full_name"
                placeholder="Masukkan nama lengkap"
                value={form.full_name}
                onChange={handleChange}
                aria-invalid={!!errors.full_name}
                className="h-10 pl-10"
              />
            </div>
            {errors.full_name && (
              <p className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="size-3" />
                {errors.full_name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  aria-invalid={!!errors.username}
                  className="h-10 pl-10"
                />
              </div>
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
                  placeholder="Email"
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 karakter"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  className="h-10 pl-10"
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="size-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-medium"
              >
                Konfirmasi
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  placeholder="Ulangi password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  aria-invalid={!!errors.password_confirmation}
                  className="h-10 pl-10"
                />
              </div>
              {errors.password_confirmation && (
                <p className="flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="size-3" />
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-base shadow-sm"
            disabled={register.isPending}
          >
            {register.isPending ? "Mendaftarkan..." : "Daftar"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Masuk
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
