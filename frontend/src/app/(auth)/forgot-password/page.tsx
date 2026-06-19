"use client";

import { useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { useForgotPassword } from "@/hooks/useAuth";
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
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type { ApiResponse } from "@/types";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPassword = useForgotPassword();

  function validate(): boolean {
    if (!email.trim()) {
      setError("Email wajib diisi");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    forgotPassword.mutate(email, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (err) => {
        const axiosError = err as AxiosError<ApiResponse>;
        const data = axiosError.response?.data;
        if (data?.errors?.email) {
          setError(data.errors.email[0]);
        } else {
          setError(data?.message || "Gagal mengirim email reset password");
        }
      },
    });
  }

  if (isSuccess) {
    return (
      <Card className="animate-scale-in w-full border-emerald-100/80 bg-white/80 shadow-xl shadow-emerald-900/5 backdrop-blur-xl dark:border-emerald-900/20 dark:bg-card/80">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-sm ring-1 ring-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:ring-emerald-700/30">
            <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Cek Email Anda
          </CardTitle>
          <CardDescription className="mt-1.5 text-sm">
            Jika email terdaftar, kami telah mengirimkan token reset password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-slide-up-sm animation-delay-200 rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-emerald-50/50 px-5 py-4 text-sm text-emerald-700 shadow-sm dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-emerald-950/10 dark:text-emerald-400">
            <p className="flex items-start gap-3">
              <KeyRound className="mt-0.5 size-5 shrink-0" />
              <span className="leading-relaxed">
                Gunakan token yang diterima untuk mereset password Anda melalui
                halaman reset password.
              </span>
            </p>
          </div>
          <Link
            href={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
            className="animate-slide-up-sm animation-delay-300 group flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-muted-foreground/25 px-5 py-4 text-sm font-medium text-emerald-600 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-300"
          >
            <ExternalLink className="size-4" />
            Buka halaman reset password
            <ArrowLeft className="size-3 rotate-180 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-muted-foreground/20 text-sm font-medium transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm dark:hover:bg-emerald-950/20 dark:hover:text-emerald-400"
            onClick={() => setIsSuccess(false)}
          >
            <span className="flex items-center gap-2">
              <Send className="size-4" />
              Kirim ulang
            </span>
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-emerald-600 hover:underline"
          >
            <ArrowLeft className="size-3" />
            Kembali ke Login
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
          Lupa Password
        </CardTitle>
        <CardDescription className="mt-1.5 text-sm">
          Masukkan email terdaftar dan kami akan mengirimkan token reset
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {/* Error */}
          <div className="animate-slide-up-sm">
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3.5 text-sm text-red-700 shadow-sm dark:border-red-900/30 dark:from-red-950/30 dark:to-red-950/10 dark:text-red-400">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Email Field */}
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
                placeholder="Masukkan email terdaftar"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                aria-invalid={!!error}
                className="h-11 rounded-xl border-muted-foreground/20 pl-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 dark:focus-visible:ring-emerald-900/30"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-base font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-300/50 hover:shadow-xl active:scale-[0.98] disabled:from-emerald-400 disabled:to-emerald-400 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/30"
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Mengirim...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="size-4" />
                Kirim Token Reset
              </span>
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
