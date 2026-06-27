"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  Heart,
  Users,
  Sparkles,
  ChevronRight,
  ArrowRight,
  UserPlus,
  Building2,
  Target,
  CalendarCheck,
  Award,
  Search,
  LogIn,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 animate-float-slow rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-96 animate-float-delayed rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 size-64 animate-float rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute right-1/4 top-2/3 size-48 animate-float-slow rounded-full bg-emerald-200/15 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-emerald-100/20 bg-white/70 backdrop-blur-xl dark:bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm">
              <Handshake className="size-5 text-white" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              CommUnity
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition-all hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <LogIn className="size-4" />
              Masuk
            </Link>
            <Link href="/register?type=volunteer">
              <Button className="h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 text-sm font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-300/50 hover:shadow-xl active:scale-[0.98] dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/30">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left: Text */}
            <div className="animate-fade-slide-up text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <Sparkles className="size-4" />
                Platform Kegiatan Sosial Komunitas
              </div>
              <h1
                className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Bersama{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Wujudkan
                </span>{" "}
                Perubahan Sosial
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Temukan, ikuti, dan kelola kegiatan sosial komunitas.
                Bersama relawan dan organisasi, kita ciptakan dampak
                nyata bagi masyarakat.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Link href="/register?type=volunteer">
                  <Button className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 text-base font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-300/50 hover:shadow-xl active:scale-[0.98] sm:w-auto dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/30">
                    <UserPlus className="mr-2 size-5" />
                    Gabung sebagai Relawan
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>
                <Link href="/register?type=organizer">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-xl border-emerald-200 px-8 text-base font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 active:scale-[0.98] sm:w-auto dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                  >
                    <Building2 className="mr-2 size-5" />
                    Daftarkan Organisasi Anda
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-emerald-100/50 pt-8 dark:border-emerald-900/20">
                {[
                  { icon: Heart, value: "100+", label: "Kegiatan Sosial" },
                  { icon: Users, value: "500+", label: "Relawan Aktif" },
                  { icon: Award, value: "50+", label: "Organisasi" },
                ].map((item) => (
                  <div key={item.label} className="text-center lg:text-left">
                    <item.icon className="mx-auto mb-2 size-5 text-emerald-500 lg:mx-0" />
                    <div
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="mt-12 animate-fade-slide-up animation-delay-200 hidden lg:mt-0 lg:block">
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 p-8 dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-teal-950/20">
                  {/* Floating cards */}
                  <div className="animate-float-slow absolute -right-4 -top-4 rounded-2xl bg-white p-4 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-100/50 dark:bg-card dark:ring-emerald-900/30">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                        <Heart className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Bakti Sosial</div>
                        <div className="text-xs text-muted-foreground">
                          Lingkungan
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="animate-float absolute -bottom-2 -left-4 rounded-2xl bg-white p-4 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-100/50 dark:bg-card dark:ring-emerald-900/30">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                        <Users className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">50 Relawan</div>
                        <div className="text-xs text-muted-foreground">
                          Terdaftar
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200/50">
                        <Handshake className="size-10 text-white" />
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Bersama Berdampak
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Setiap langkah kecil memberi perubahan besar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative border-t border-emerald-100/20 bg-white/50 px-4 py-20 backdrop-blur-xl dark:bg-background/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-fade-slide-up text-center">
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Cara Kerja
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Mulai berkontribusi dalam 3 langkah mudah
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: UserPlus,
                step: "01",
                title: "Daftar Akun",
                description:
                  "Buat akun sebagai Relawan atau daftarkan organisasi Anda. Proses cepat dan mudah.",
              },
              {
                icon: CalendarCheck,
                step: "02",
                title: "Ikuti atau Buat Kegiatan",
                description:
                  "Relawan dapat mendaftar kegiatan sosial. Penyelenggara dapat membuat dan mengelola kegiatan.",
              },
              {
                icon: Award,
                step: "03",
                title: "Dapatkan Dampak",
                description:
                  "Ikuti kegiatan, absensi kehadiran, dapatkan sertifikat, dan lihat dampak nyata Anda.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="animate-fade-slide-up group relative rounded-2xl border border-emerald-100/50 bg-white/80 p-8 shadow-sm shadow-emerald-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/20 hover:-translate-y-1 dark:border-emerald-900/20 dark:bg-card/80"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40">
                  <item.icon className="size-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="absolute right-6 top-6 text-4xl font-bold text-emerald-100/50 dark:text-emerald-900/30">
                  {item.step}
                </div>
                <h3
                  className="relative text-xl font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-t border-emerald-100/20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 size-80 animate-float-slow rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 size-60 animate-float-delayed rounded-full bg-emerald-300/10 blur-2xl" />
          <div className="absolute left-1/4 top-1/3 size-4 animate-float rounded-full bg-white/20" />
          <div className="absolute right-1/3 top-2/3 size-3 animate-float-delayed rounded-full bg-white/15" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="animate-fade-slide-up text-center">
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Dampak yang Telah Dicapai
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Bersama kita telah menciptakan perubahan positif
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Heart, value: "100+", label: "Kegiatan Sosial" },
              { icon: Users, value: "500+", label: "Relawan Aktif" },
              { icon: Building2, value: "50+", label: "Organisasi" },
              { icon: Target, value: "1000+", label: "Dampak Positif" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="animate-fade-slide-up rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm ring-1 ring-white/10 transition-all duration-300 hover:bg-white/15"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <item.icon className="mx-auto mb-3 size-8 text-emerald-200" />
                <div
                  className="text-3xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.value}
                </div>
                <div className="mt-1 text-sm text-white/60">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="animate-fade-slide-up mx-auto max-w-2xl">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Siap untuk Memulai?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Bergabunglah dengan ribuan relawan dan organisasi yang telah
            menciptakan perubahan sosial di Indonesia.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register?type=volunteer">
              <Button className="h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 text-base font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-emerald-300/50 hover:shadow-xl active:scale-[0.98] dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/30">
                <UserPlus className="mr-2 size-5" />
                Gabung sebagai Relawan
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/register?type=organizer">
              <Button
                variant="outline"
                className="h-12 rounded-xl border-emerald-200 px-8 text-base font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 active:scale-[0.98] dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              >
                <Building2 className="mr-2 size-5" />
                Daftarkan Organisasi Anda
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-100/20 bg-white/50 px-4 py-12 backdrop-blur-xl dark:bg-background/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700">
                <Handshake className="size-4 text-white" />
              </div>
              <span
                className="text-base font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                CommUnity
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/discover"
                className="flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Search className="size-4" />
                Jelajahi Kegiatan
              </Link>
              <Link
                href="/login"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Masuk
              </Link>
              <Link
                href="/register?type=volunteer"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Daftar
              </Link>
            </div>
            <p className="text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} CommUnity. Platform Kegiatan
              Sosial Komunitas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
