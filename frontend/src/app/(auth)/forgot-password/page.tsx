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
      <Card className="w-full border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-xl">Cek Email Anda</CardTitle>
          <CardDescription>
            Jika email terdaftar, kami telah mengirimkan token reset password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400">
            <p className="flex items-start gap-2">
              <KeyRound className="mt-0.5 size-4 shrink-0" />
              <span>
                Gunakan token yang diterima untuk mereset password Anda melalui
                halaman reset password.
              </span>
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 px-4 py-3">
            <Link
              href={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Buka halaman reset password
            </Link>
            <ArrowLeft className="size-3 rotate-180 text-muted-foreground" />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSuccess(false)}
          >
            Kirim ulang
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 hover:underline"
          >
            <ArrowLeft className="size-3" />
            Kembali ke Login
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
        <CardTitle className="text-xl">Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email terdaftar dan kami akan mengirimkan token reset
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
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
                placeholder="Masukkan email terdaftar"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                aria-invalid={!!error}
                className="h-10 pl-10"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-base shadow-sm"
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending ? (
              "Mengirim..."
            ) : (
              <span className="flex items-center gap-2">
                <Send className="size-4" />
                Kirim Token Reset
              </span>
            )}
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
