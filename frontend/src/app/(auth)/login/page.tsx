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
import { User, Lock, LogIn, AlertCircle } from "lucide-react";
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
    <Card className="w-full border-emerald-100 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/20">
      <CardHeader className="pb-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
          <LogIn className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-xl">Selamat Datang Kembali</CardTitle>
        <CardDescription>
          Masuk ke akun CommUnity Anda untuk melanjutkan
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-5">
          {serverError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                placeholder="Masukkan username"
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
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
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-base shadow-sm"
            disabled={login.isPending}
          >
            {login.isPending ? "Memproses..." : "Masuk"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Daftar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
