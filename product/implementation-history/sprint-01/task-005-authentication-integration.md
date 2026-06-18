# TASK-005: Authentication Integration

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Authentication Integration |
| **Owner** | Hiraldy |
| **Support Owner** | Syarif |
| **Priority** | High |
| **Estimated Effort** | M |
| **Dependencies** | TASK-003, TASK-004 |

---

## Objective

Menghubungkan frontend dengan backend authentication API, memastikan session management, protected routes, dan logout handling berjalan dengan benar.

---

## Files Modified

| File | Path | Perubahan |
|---|---|---|
| Auth Store | `src/stores/auth.store.ts` | Menambah persistensi user data ke localStorage + restore session saat initial load |

## Files Created

| File | Path | Deskripsi |
|---|---|---|
| AuthGuard | `src/components/auth/AuthGuard.tsx` | Client-side route protection wrapper |
| Dashboard Page | `src/app/dashboard/page.tsx` | Protected dashboard dengan user info & logout button |

---

## Implementation Details

### 1. Session Persistence (`auth.store.ts`)

**Masalah sebelumnya:** Zustand store di-reset ke default (`user: null, token: null, isAuthenticated: false`) setiap page reload, meskipun token masih tersimpan di localStorage.

**Perbaikan:**
- `getStoredAuth()` function membaca `auth_token` dan `auth_user` dari localStorage saat store initialization
- `setAuth()` sekarang juga menyimpan `user` sebagai JSON ke localStorage (`auth_user`)
- `setUser()` sekarang juga update localStorage agar konsisten
- `logout()` membersihkan keduanya (`auth_token` + `auth_user`)

Dengan ini, session bertahan meskipun user melakukan refresh halaman.

### 2. Route Protection (`AuthGuard.tsx`)

- Client component wrapper yang mengecek `isAuthenticated` dari Zustand store
- Jika tidak terautentikasi → redirect ke `/login`
- Jika terautentikasi → render `children`
- Menampilkan loading state ("Memuat...") selama proses redirect

### 3. Dashboard Page (`dashboard/page.tsx`)

- Dibungkus `AuthGuard` sehingga hanya bisa diakses user terautentikasi
- **Header:** Brand logo + tombol logout
- **Main Card:**
  - Avatar (profile photo atau fallback icon) — siap untuk TASK-006
  - Nama lengkap + username
  - Info email
  - Info role (admin/organizer/coordinator/volunteer)
  - Welcome message
- **Logout button:** Menggunakan `useLogout()` mutation, loading state dengan spinner, redirect ke `/login` setelah berhasil

### 4. Alur End-to-End

```
User → / → redirect ke /login (unauthenticated) atau /dashboard (authenticated)
Login → useLogin() → setAuth(user, token) → redirect /
        → isAuthenticated=true → redirect /dashboard
Dashboard → AuthGuard → render dashboard dengan user info + logout
Logout → useLogout() → POST /auth/logout → clear store + localStorage → redirect /login
Refresh → auth.store restore dari localStorage → isAuthenticated=true → tetap di dashboard
```

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Login berhasil | ✅ | `useLogin` mutation → `setAuth(user, token)` → redirect ke dashboard |
| Session tersimpan | ✅ | Zustand store restore dari localStorage + persist user data |
| Protected page dapat diakses | ✅ | `AuthGuard` wrapper → cek `isAuthenticated` → render atau redirect |
| Logout berhasil | ✅ | Tombol logout di dashboard → `useLogout` → clear store + redirect `/login` |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| API integration | ✅ Existing (`api.ts` + `auth.service.ts` + `useAuth` hooks) |
| Token storage | ✅ Enhanced — menyimpan token + user data di localStorage, restore saat load |
| Login session management | ✅ Session bertahan di page reload, profile fetch via `useProfile` hook |
| Protected routes | ✅ `AuthGuard` component + dashboard page sebagai contoh protected route |
| Logout handling | ✅ Tombol logout di dashboard header + `useLogout` hook + Axios 401 interceptor |

---

## Build & Type Check

| Check | Status |
|---|---|
| TypeScript compilation | ✅ |
| Build production | ✅ |
| Routes terdaftar | `/`, `/dashboard`, `/login`, `/register`, `/forgot-password`, `/reset-password` |

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, build berhasil. Siap lanjut ke TASK-006 (Profile Management).
