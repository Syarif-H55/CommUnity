"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
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
import { User, Lock, LogIn, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import type { ApiResponse } from "@/types";

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username wajib diisi";
    }

    if (!form.password) {
      newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    login.mutate(
      { username: form.username, password: form.password },
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
              data?.message || "Login gagal. Periksa username dan password."
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
    <Card className="animate-scale-in w-full border-emerald-100/80 bg-white/80 shadow-xl shadow-emerald-900/5 backdrop-blur-xl dark:border-emerald-900/20 dark:bg-card/80">
      <CardHeader className="pb-6 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-sm ring-1 ring-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:ring-emerald-700/30">
          <LogIn className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Selamat Datang Kembali
        </CardTitle>
        <CardDescription className="mt-1.5 text-sm">
          Masuk ke akun CommUnity Anda untuk melanjutkan
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-5">
          {/* Server Error */}
          <div className="animate-slide-up-sm">
            {serverError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3.5 text-sm text-red-700 shadow-sm dark:border-red-900/30 dark:from-red-950/30 dark:to-red-950/10 dark:text-red-400">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}
          </div>

          {/* Username Field */}
          <div className="animate-slide-up-sm animation-delay-100 space-y-2">
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
                placeholder="Masukkan username"
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

          {/* Password Field */}
          <div className="animate-slide-up-sm animation-delay-200 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Lupa password?
              </Link>
            </div>
            <div className="group relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                <Lock className="size-[18px]" />
              </span>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
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
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-base font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-300/50 hover:shadow-xl active:scale-[0.98] disabled:from-emerald-400 disabled:to-emerald-400 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/30"
            disabled={login.isPending}
          >
            {login.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Memproses...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="size-4" />
                Masuk
              </span>
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Daftar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
