"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
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
  Mail,
  Lock,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types";

interface FormErrors {
  email?: string;
  token?: string;
  password?: string;
  password_confirmation?: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.token.trim()) {
      newErrors.token = "Token reset password wajib diisi";
    }

    if (!form.password) {
      newErrors.password = "Password baru wajib diisi";
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

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: form.email,
        token: form.token,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setIsSuccess(true);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      const data = axiosError.response?.data;
      if (data?.errors) {
        const mapped: FormErrors = {};
        for (const [key, messages] of Object.entries(data.errors)) {
          mapped[key as keyof FormErrors] = messages[0];
        }
        setErrors(mapped);
      } else {
        setServerError(data?.message || "Gagal mereset password");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-xl">Password Berhasil Direset</CardTitle>
          <CardDescription>
            Password Anda telah berhasil diperbarui. Silakan masuk dengan
            password baru.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-base shadow-sm">
              Masuk
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
      <CardHeader className="pb-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
          <KeyRound className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Masukkan email, token reset, dan password baru Anda
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

          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm font-medium">
              Token Reset
            </Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="token"
                name="token"
                placeholder="Masukkan token reset"
                value={form.token}
                onChange={handleChange}
                aria-invalid={!!errors.token}
                className="h-10 pl-10"
              />
            </div>
            {errors.token && (
              <p className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="size-3" />
                {errors.token}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password Baru
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
                  placeholder="Ulangi"
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
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Reset Password"}
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 hover:underline"
          >
            <ArrowLeft className="size-3" />
            Kembali ke Login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md border-emerald-100 shadow-lg shadow-emerald-900/5">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Memuat...</CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
