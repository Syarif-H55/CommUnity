import { Handshake } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-600 to-emerald-800 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Handshake className="size-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            CommUnity
          </span>
        </div>

        <div className="space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed text-white/90">
              &ldquo;Bersama kita bisa menciptakan perubahan yang berarti
              bagi masyarakat.&rdquo;
            </p>
            <footer className="text-sm text-white/60">
              — Platform Kegiatan Sosial Komunitas
            </footer>
          </blockquote>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="size-2 rounded-full bg-white/30"
            />
          ))}
          <div className="size-2 rounded-full bg-white/80" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 px-4 py-12 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600">
              <Handshake className="size-6 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              CommUnity
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
