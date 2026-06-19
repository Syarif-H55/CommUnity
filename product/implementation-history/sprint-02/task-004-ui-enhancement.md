# TASK-004: Frontend Authentication Pages — UI Enhancement

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Frontend Authentication Pages — UI Enhancement |
| **Owner** | Hiraldy |
| **Support Owner** | Abdillah |
| **Priority** | Medium |
| **Estimated Effort** | M |
| **Related Task** | TASK-004 (Sprint 01 — Frontend Authentication Pages) |

---

## Objective

Melakukan peningkatan UI/UX pada halaman autentikasi (Login, Register, Forgot Password, Reset Password) dan auth layout dengan animasi, glassmorphism, tipografi yang lebih baik, dan interaktivitas yang halus.

---

## Files Modified

| File | Perubahan |
|---|---|
| `src/app/layout.tsx` | Menambah font `Plus_Jakarta_Sans` sebagai `--font-heading` untuk heading |
| `src/app/globals.css` | Menambah utility classes animasi: `fade-slide-up`, `fade-in`, `float`, `pulse-soft`, `scale-in`, `slide-up-sm`, `shimmer`, `draw-check` + keyframes |
| `src/app/(auth)/layout.tsx` | Animated background (floating gradient orbs, geometric shapes), glassmorphism card, staggered animations, decorative stats panel, mobile brand section |
| `src/app/(auth)/login/page.tsx` | Password visibility toggle (eye icon), gradient button, focus glow, staggered entrance animations, error/success transitions, glassmorphism card |
| `src/app/(auth)/register/page.tsx` | Password strength indicator (4-level bar + checklist), password visibility toggle (both fields), staggered animations, gradient button, glassmorphism card |
| `src/app/(auth)/forgot-password/page.tsx` | Staggered animations, success state card, gradient button, glassmorphism card, consistent styling |
| `src/app/(auth)/reset-password/page.tsx` | Staggered animations, password visibility toggle (both fields), success state card, Suspense fallback, gradient button, glassmorphism card |

---

## Implementation Details

### 1. Typography Enhancement

- Menambah `Plus Jakarta Sans` font dari `next/font/google` di `layout.tsx`
- Diterapkan sebagai `--font-heading` CSS variable
- Digunakan pada semua judul/heading di halaman auth via `style={{ fontFamily: 'var(--font-heading)' }}`
- Weight: 400–800 untuk fleksibilitas tipografi

### 2. Auth Layout Enhancement

**Animated Background:**
- 3 floating gradient orbs (2 large + 1 medium) dengan `animate-float` variants
- Warna emerald/teal dengan `blur-3xl` untuk efek glow
- Geometric shapes (circles, squares) melayang di background

**Left Panel (Brand):**
- Gradient `from-emerald-600 via-emerald-700 to-emerald-900`
- Multiple radial gradient overlays
- Floating decorative elements (circles, rounded squares)
- Staggered entrance: brand → quote + stats → dot indicators
- Stat cards: 3 kolom (Kegiatan Sosial, Relawan Aktif, Dampak Positif) dengan glassmorphism
- Quote block dengan font heading

**Right Panel (Form):**
- Subtle radial gradient pattern background
- Mobile: brand logo + nama muncul di atas form
- Staggered: children card muncul dengan `animation-delay-100`

### 3. Login Page Enhancement

- **Card:** Glassmorphism (`bg-white/80 backdrop-blur-xl`), border emerald, shadow-xl
- **Input Fields:** Icon prefix (User, Lock), focus glow (`ring-4 ring-emerald-100`), rounded-xl
- **Password Toggle:** Eye/EyeOff icon button, toggle `showPassword` state
- **Gradient Button:** `from-emerald-600 to-emerald-500`, shadow-lg, hover scale effect (`active:scale-[0.98]`), disabled state
- **Entrance:** `animate-scale-in` card, `animate-slide-up-sm` dengan delay 100/200ms per field
- **Error Banner:** Gradient red background, icon + message
- **Validation:** Inline red text per field

### 4. Register Page Enhancement

- **Card:** Glassmorphism + shadow + border emerald
- **Input Fields:** Icon prefix + focus glow + rounded-xl
- **Password Toggle:** Both password and confirm password fields
- **Password Strength Indicator:**
  - 4-level bar (red/amber/emerald based on criteria met)
  - Checklist: "Minimal 8 karakter", "Mengandung huruf besar", "Mengandung huruf kecil", "Mengandung angka"
  - Muncul hanya saat field password terisi
- **Layout:** 2-column grid untuk Username/Email dan Password/Konfirmasi
- **Gradient Button:** Same pattern as login
- **Entrance:** Staggered delays (100/200/300ms)

### 5. Forgot Password Enhancement

- **Success State:** Card "Cek Email Anda" dengan ikon `CheckCircle2`, link ke reset password
- **Dashed Link:** Border dashed ke `/reset-password?email=...`
- **Resend Button:** Outline button untuk kirim ulang
- **Entrance:** Staggered delays

### 6. Reset Password Enhancement

- **Password Toggle:** Eye/EyeOff pada password dan confirm
- **Token Field:** Icon `KeyRound` prefix
- **Success State:** "Password Berhasil Direset" dengan button "Masuk"
- **Suspense Fallback:** Loading card dengan spinner (karena `useSearchParams()`)
- **Entrance:** Staggered delays (100/200/300ms)

### 7. Custom Animations (globals.css)

| Utility | Keyframe | Durasi |
|---|---|---|
| `animate-fade-slide-up` | `fade-slide-up` (translateY 16px) | 0.6s |
| `animate-fade-in` | `fade-in` | 0.5s |
| `animate-float` | `float` (translateY -20px) | 6s |
| `animate-float-delayed` | `float` dengan delay 2s | 6s |
| `animate-float-slow` | `float` | 8s |
| `animate-pulse-soft` | `pulse-soft` (opacity 0.4→0.8) | 3s |
| `animate-shimmer` | `shimmer` (background position) | 2s |
| `animate-draw-check` | `draw-check` (stroke-dashoffset) | 0.6s |
| `animate-scale-in` | `scale-in` (scale 0.95→1) | 0.4s |
| `animate-slide-up-sm` | `slide-up-sm` (translateY 8px) | 0.5s |
| `animation-delay-*` | CSS `animation-delay` | 100–700ms |

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Plus Jakarta Sans font untuk headings | ✅ | `next/font/google` — Plus_Jakarta_Sans dengan weight 400–800 |
| Animated background floating orbs | ✅ | 3 gradient orbs + geometric shapes dengan blur-3xl di auth layout |
| Glassmorphism card design | ✅ | `bg-white/80 backdrop-blur-xl` + shadow + emerald border |
| Staggered entrance animations | ✅ | `animation-delay-*` pada semua form elements (100/200/300ms) |
| Password visibility toggle | ✅ | Eye/EyeOff icon di login, register (2 field), reset password (2 field) |
| Password strength indicator | ✅ | 4-level bar + checklist (length, uppercase, lowercase, number) |
| Loading spinner animation | ✅ | `Loader2` dengan `animate-spin` di semua submit buttons |
| Gradient buttons | ✅ | `from-emerald-600 to-emerald-500` dengan hover & active scale effects |
| Focus glow effects | ✅ | `focus-visible:ring-4 focus-visible:ring-emerald-100` di input fields |
| Decorative stats panel | ✅ | 3 kolom stat (Kegiatan Sosial/Relawan/Dampak) di left sidebar |
| Smooth error/success transitions | ✅ | Fade-in error banners, success state cards dengan animasi |

---

## Build & Type Check

| Check | Status |
|---|---|
| TypeScript compilation | ✅ |
| Build production | ✅ |
| Font loading | ✅ Plus Jakarta Sans via next/font/google |

---

## Catatan Penting

- Tidak ada perubahan struktur HTML atau logic — murni enhancement CSS/UI
- Semua halaman tetap kompatibel dengan dark mode via Tailwind CSS variables
- Animasi menggunakan CSS keyframes — zero JavaScript runtime overhead untuk animasi
- Password strength indicator hanya client-side visual — validasi server tetap di backend
- Staggered delays menggunakan utility classes (`animation-delay-100`, dll) bukan inline style

---

## Status

**DONE** — Seluruh UI enhancement terimplementasi, build berhasil, semua halaman auth memiliki tampilan yang lebih modern dan interaktif.
