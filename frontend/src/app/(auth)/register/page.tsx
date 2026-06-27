"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Eye,
  EyeOff,
  Loader2,
  Check,
  X,
  Search,
  Building2,
} from "lucide-react";
import type { ApiResponse } from "@/types";

interface FormErrors {
  full_name?: string;
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

const REGISTER_TYPES = {
  volunteer: {
    title: "Daftar sebagai Relawan",
    description: "Temukan dan ikuti kegiatan sosial yang sesuai dengan minat Anda",
    icon: UserPlus,
    redirect: "/discover",
    badgeLabel: "Relawan",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    successText: "Langsung jelajahi kegiatan sosial",
  },
  organizer: {
    title: "Daftar sebagai Penyelenggara",
    description: "Buat dan kelola organisasi serta kegiatan sosial komunitas Anda",
    icon: Building2,
    redirect: "/organizations/register",
    badgeLabel: "Penyelenggara",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    successText: "Lanjutkan daftarkan organisasi Anda",
  },
} as const;

type RegisterType = keyof typeof REGISTER_TYPES;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type");
  const [registerType, setRegisterType] = useState<RegisterType>(
    rawType === "organizer" ? "organizer" : "volunteer"
  );

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const config = REGISTER_TYPES[registerType];

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
          router.push(config.redirect);
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

  const passwordChecks = form.password
    ? [
        { label: "Minimal 8 karakter", met: form.password.length >= 8 },
        { label: "Mengandung huruf besar", met: /[A-Z]/.test(form.password) },
        { label: "Mengandung huruf kecil", met: /[a-z]/.test(form.password) },
        { label: "Mengandung angka", met: /\d/.test(form.password) },
      ]
    : [];

  return (
    <Card className="animate-scale-in w-full border-emerald-100/80 bg-white/80 shadow-xl shadow-emerald-900/5 backdrop-blur-xl dark:border-emerald-900/20 dark:bg-card/80">
      <CardHeader className="pb-6 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-sm ring-1 ring-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:ring-emerald-700/30">
          <config.icon className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Type badge */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.badgeClass}`}
          >
            <config.icon className="size-3.5" />
            {config.badgeLabel}
          </span>
          <Link
            href={
              registerType === "volunteer"
                ? "/register?type=organizer"
                : "/register?type=volunteer"
            }
            className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Ganti
          </Link>
        </div>

        <CardTitle
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {config.title}
        </CardTitle>
        <CardDescription className="mt-1.5 text-sm">
          {config.description}
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

          {/* Full Name */}
          <div className="animate-slide-up-sm animation-delay-100 space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium">
              Nama Lengkap
            </Label>
            <div className="group relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                <UserCircle className="size-[18px]" />
              </span>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Masukkan nama lengkap"
                value={form.full_name}
                onChange={handleChange}
                aria-invalid={!!errors.full_name}
                className="h-11 rounded-xl border-muted-foreground/20 pl-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 dark:focus-visible:ring-emerald-900/30"
              />
            </div>
            {errors.full_name && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="size-3.5" />
                {errors.full_name}
              </p>
            )}
          </div>

          {/* Username & Email */}
          <div className="animate-slide-up-sm animation-delay-200 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                  <User className="size-[18px]" />
                </span>
                <Input
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  aria-invalid={!!errors.username}
                  className="h-11 rounded-xl border-muted-foreground/20 pl-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 dark:focus-visible:ring-emerald-900/30"
                />
              </div>
              {errors.username && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <AlertCircle className="size-3.5" />
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
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
                  placeholder="Email"
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
          </div>

          {/* Password & Confirm */}
          <div className="animate-slide-up-sm animation-delay-300 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
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
                  placeholder="Ulangi password"
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

          {/* Password strength indicator */}
          {form.password.length > 0 && (
            <div className="animate-slide-up-sm space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => {
                  const metCount = passwordChecks.filter((c) => c.met).length;
                  return (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        level <= metCount
                          ? metCount <= 2
                            ? "bg-red-400"
                            : metCount === 3
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          : "bg-muted"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {passwordChecks.map((check) => (
                  <div
                    key={check.label}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    {check.met ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <X className="size-3 text-muted-foreground/50" />
                    )}
                    <span
                      className={
                        check.met
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground/60"
                      }
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-base font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-300/50 hover:shadow-xl active:scale-[0.98] disabled:from-emerald-400 disabled:to-emerald-400 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/30"
            disabled={register.isPending}
          >
            {register.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Mendaftarkan...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <config.icon className="size-4" />
                Daftar
              </span>
            )}
          </Button>

          <div className="rounded-xl bg-emerald-50/50 px-4 py-2.5 text-center text-xs text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
            {registerType === "volunteer"
              ? "Setelah mendaftar, Anda bisa langsung menjelajahi dan mendaftar kegiatan sosial."
              : "Setelah mendaftar, Anda akan diarahkan untuk membuat organisasi dan mengelola kegiatan."}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Masuk
            </Link>
          </p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground/60">
                atau
              </span>
            </div>
          </div>
          <Link
            href="/discover"
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-emerald-200"
          >
            <Search className="size-4 text-emerald-600" />
            Jelajahi Kegiatan Sosial
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <Card className="animate-scale-in w-full border-emerald-100/80 bg-white/80 shadow-xl shadow-emerald-900/5 backdrop-blur-xl dark:border-emerald-900/20 dark:bg-card/80">
          <CardHeader className="pb-6 text-center">
            <CardTitle
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Memuat...
            </CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
