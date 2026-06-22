import Link from "next/link"
import { Handshake, Heart, Users, Sparkles, Search } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 animate-float-slow rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-96 animate-float-delayed rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 size-64 animate-float rounded-full bg-emerald-300/10 blur-3xl" />
      </div>

      {/* Left Panel - Brand Side */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-12 text-white lg:flex">
        {/* Animated decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 size-80 animate-float-slow rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 size-60 animate-float-delayed rounded-full bg-emerald-300/10 blur-2xl" />

          {/* Floating geometric shapes */}
          <div className="absolute right-1/4 top-1/4 size-4 animate-float rounded-full bg-white/20" />
          <div className="absolute bottom-1/3 right-1/3 size-3 animate-float-delayed rounded-full bg-white/15" />
          <div className="absolute left-1/4 top-1/2 size-5 animate-float-slow rotate-45 rounded-lg bg-white/10" />
          <div className="absolute bottom-1/4 right-1/5 size-3 animate-float rounded-full bg-emerald-300/30" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_50%)]" />
        </div>

        {/* Brand */}
        <div className="relative animate-fade-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
              <Handshake className="size-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              CommUnity
            </span>
          </div>
          <Link
            href="/discover"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/10 transition-all hover:bg-white/15 hover:text-white"
          >
            <Search className="size-4" />
            Jelajahi Kegiatan Sosial
          </Link>
        </div>

        {/* Hero section with animated stats */}
        <div className="relative space-y-8">
          <div className="animate-fade-slide-up animation-delay-200 space-y-4">
            <blockquote className="space-y-3">
              <p className="text-2xl font-medium leading-relaxed text-white/95" style={{ fontFamily: "var(--font-heading)" }}>
                &ldquo;Bersama kita bisa menciptakan perubahan yang berarti bagi masyarakat.&rdquo;
              </p>
              <footer className="text-sm text-white/60">
                — Platform Kegiatan Sosial Komunitas
              </footer>
            </blockquote>
          </div>

          <div className="animate-fade-slide-up animation-delay-400 grid grid-cols-3 gap-4">
            {[
              { icon: Heart, label: "Kegiatan Sosial", value: "100+" },
              { icon: Users, label: "Relawan Aktif", value: "500+" },
              { icon: Sparkles, label: "Dampak Positif", value: "1000+" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/10 transition-all duration-300 hover:bg-white/15"
              >
                <item.icon className="mb-2 size-5 text-emerald-200" />
                <div className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{item.value}</div>
                <div className="text-xs text-white/60">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="relative animate-fade-in animation-delay-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-2 animate-pulse-soft rounded-full bg-white/30"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
            <div className="ml-2 size-2 rounded-full bg-white/90 ring-2 ring-white/30" />
            <span className="ml-3 text-xs text-white/50">Platform v1.0</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/50 px-4 py-12 dark:from-emerald-950/10 dark:via-background dark:to-emerald-950/10">
        {/* Subtle background pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06)_0%,_transparent_60%)]" />

        <div className="flex w-full max-w-md flex-col items-center gap-6">
          {/* Mobile brand */}
          <div className="animate-fade-slide-up flex flex-col items-center gap-2 lg:hidden">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200/50 ring-1 ring-emerald-400/20">
              <Handshake className="size-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              CommUnity
            </span>
            <span className="text-xs text-muted-foreground">
              Platform Kegiatan Sosial Komunitas
            </span>
          </div>

          <div className="w-full animate-fade-slide-up animation-delay-100">
            {children}
          </div>

          {/* Footer */}
          <p className="animate-fade-in animation-delay-500 text-center text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} CommUnity. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
