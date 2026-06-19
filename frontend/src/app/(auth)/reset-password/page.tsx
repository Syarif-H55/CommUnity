"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { AxiosError } from "axios";
import { useResetPassword } from "@/hooks/useAuth";
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
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import type { ApiResponse } from "@/types";

interface FormErrors {
  email?: string;
  token?: string;
  password?: string;
  password_confirmation?: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();
  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    resetPassword.mutate(
      {
        email: form.email,
        token: form.token,
        password: form.password,
        password_confirmation: form.password_confirmation,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (err) => {
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

  if (isSuccess) {
    return (
      <Card className="animate-scale-in w-full border-emerald-100/80 bg-white/80 shadow-xl shadow-emerald-900/5 backdrop-blur-xl dark:border-emerald-900/20 dark:bg-card/80">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-sm ring-1 ring-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:ring-emerald-700/30">
            <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Password Berhasil Direset
          </CardTitle>
          <CardDescription className="mt-1.5 text-sm">
            Password Anda telah berhasil diperbarui. Silakan masuk dengan
            password baru.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-base font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg active:scale-[0.98] dark:shadow-emerald-900/30">
              Masuk
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in w-full border-emerald-100/80 bg-white/80 shadow-xl shadow-emerald-900/5 backdrop-blur-xl dark:border-emerald-900/20 dark:bg-card/80">
      <CardHeader className="pb-6 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-sm ring-1 ring-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:ring-emerald-700/30">
          <KeyRound className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Reset Password
        </CardTitle>
        <CardDescription className="mt-1.5 text-sm">
          Masukkan email, token reset, dan password baru Anda
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {/* Server Error */}
          <div className="animate-slide-up-sm">
            {serverError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3.5 text-sm text-red-700 shadow-sm dark:border-red-900/30 dark:from-red-950/30 dark:to-red-950/10 dark:text-red-400">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="animate-slide-up-sm animation-delay-100 space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="group relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                <Mail className="size-[18px]" />
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                className="h-11 rounded-xl border-muted-foreground/20 pl-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 dark:focus-visible:ring-emerald-900/30"
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="size-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Token */}
          <div className="animate-slide-up-sm animation-delay-200 space-y-2">
            <Label htmlFor="token" className="text-sm font-medium">
              Token Reset
            </Label>
            <div className="group relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                <KeyRound className="size-[18px]" />
              </span>
              <Input
                id="token"
                name="token"
                placeholder="Masukkan token reset"
                value={form.token}
                onChange={handleChange}
                aria-invalid={!!errors.token}
                className="h-11 rounded-xl border-muted-foreground/20 pl-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 dark:focus-visible:ring-emerald-900/30"
              />
            </div>
            {errors.token && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="size-3.5" />
                {errors.token}
              </p>
            )}
          </div>

          {/* Password & Confirm */}
          <div className="animate-slide-up-sm animation-delay-300 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password Baru
              </Label>
              <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                  <Lock className="size-[18px]" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  className="h-11 rounded-xl border-muted-foreground/20 pl-11 pr-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 dark:focus-visible:ring-emerald-900/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" />
                  ) : (
                    <Eye className="size-[18px]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <AlertCircle className="size-3.5" />
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
              <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                  <Lock className="size-[18px]" />
                </span>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  aria-invalid={!!errors.password_confirmation}
                  className="h-11 rounded-xl border-muted-foreground/20 pl-11 pr-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 dark:focus-visible:ring-emerald-900/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-[18px]" />
                  ) : (
                    <Eye className="size-[18px]" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <AlertCircle className="size-3.5" />
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-base font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-300/50 hover:shadow-xl active:scale-[0.98] disabled:from-emerald-400 disabled:to-emerald-400 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/30"
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Memproses...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-emerald-600 hover:underline"
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
        <Card className="w-full max-w-md border-emerald-100/80 bg-white/80 shadow-xl shadow-emerald-900/5 backdrop-blur-xl dark:border-emerald-900/20 dark:bg-card/80">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40">
              <Loader2 className="size-6 animate-spin text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Memuat...
            </CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
