# TASK-004: Frontend Authentication Pages

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Frontend Authentication Pages |
| **Owner** | Hiraldy |
| **Support Owner** | Abdillah |
| **Priority** | High |
| **Estimated Effort** | L |
| **Related User Stories** | US-001, US-002, US-003 |
| **Dependencies** | TASK-001 |

---

## Objective

Membangun halaman autentikasi untuk pengguna (Login, Register, Forgot Password) pada frontend menggunakan Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, dan TanStack Query.

---

## Files Created

### Halaman Auth (Route Group: `src/app/(auth)/`)

| File | Path | Deskripsi |
|---|---|---|
| Auth Layout | `src/app/(auth)/layout.tsx` | Layout dua kolom (branded sidebar kiri + form kanan) untuk semua halaman auth |
| Login Page | `src/app/(auth)/login/page.tsx` | Form login dengan field username & password |
| Register Page | `src/app/(auth)/register/page.tsx` | Form registrasi dengan field full_name, username, email, password, confirm password |
| Forgot Password Page | `src/app/(auth)/forgot-password/page.tsx` | Form forgot password dengan field email + success state |
| Reset Password Page | `src/app/(auth)/reset-password/page.tsx` | Form reset password dengan field email, token, password, confirm password |

### Infrastructure Files

| File | Path | Deskripsi |
|---|---|---|
| Auth Hooks | `src/hooks/useAuth.ts` | `useLogin`, `useRegister`, `useLogout`, `useForgotPassword`, `useResetPassword`, `useProfile` — TanStack Query hooks untuk komunikasi API |
| Auth Store | `src/stores/auth.store.ts` | Zustand store untuk state global auth (user, token, isAuthenticated) |
| Auth Service | `src/services/auth.service.ts` | Service layer dengan Axios untuk panggilan API auth endpoints |
| API Client | `src/services/api.ts` | Axios instance dengan base URL, Bearer token interceptor, 401 redirect |
| Types | `src/types/index.ts` | Type definitions untuk ApiResponse, User, dll. |
| Query Provider | `src/providers/QueryProvider.tsx` | TanStack Query provider configuration |

---

## Implementation Details

### Auth Layout (`layout.tsx`)
- Dua kolom: kiri 50% (hidden di mobile) dengan gradient hijau, brand name "CommUnity", quote inspiratif, dan dot indicators
- Kanan: form terpusat dengan max-w-md
- Mobile: brand logo + nama muncul di atas form
- Dark mode support via Tailwind CSS variables

### Login Page (`login/page.tsx`)
- **Fields:** username, password
- **Client Validation:** username required, password required
- **State Management:** TanStack Query `useLogin()` mutation
- **Success:** redirect ke `/`
- **Error Handling:** Server validation errors dari Laravel di-map ke field-level; general error di alert banner
- **Loading:** Button disabled + "Memproses..."
- **Navigation:** Link ke `/register` dan `/forgot-password`
- **UI:** Icons (User, Lock, LogIn, AlertCircle) dari Lucide React

### Register Page (`register/page.tsx`)
- **Fields:** full_name, username, email, password, password_confirmation
- **Client Validation:** full_name required, username required + min 3, email required + regex, password required + min 8, confirm required + match
- **State Management:** TanStack Query `useRegister()` mutation
- **Success:** redirect ke `/`
- **Error Handling:** Sama seperti Login — mapping dari Laravel errors bag
- **Loading:** Button disabled + "Mendaftarkan..."
- **Navigation:** Link ke `/login`
- **UI:** Icons (UserCircle, User, Mail, Lock, AlertCircle, UserPlus)

### Forgot Password Page (`forgot-password/page.tsx`)
- **Fields:** email
- **Client Validation:** email required + regex
- **State Management:** TanStack Query `useForgotPassword()` mutation
- **Success State:** Card "Cek Email Anda" dengan link ke `/reset-password?email=...`
- **Error Handling:** Server errors ditampilkan di alert banner
- **Loading:** Button disabled + "Mengirim..."
- **Navigation:** Link ke `/login`

### Reset Password Page (`reset-password/page.tsx`)
- **Fields:** email, token, password, password_confirmation
- **Client Validation:** email required + regex, token required, password required + min 8, confirm required + match
- **State Management:** TanStack Query `useResetPassword()` mutation
- **Success State:** Card "Password Berhasil Direset" dengan button "Masuk" ke `/login`
- **Error Handling:** Server validation errors di-map ke field-level; general error di alert banner
- **Loading:** Button disabled + "Memproses..."
- **Note:** Wrapped dalam `<Suspense>` karena menggunakan `useSearchParams()`

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Seluruh halaman dapat diakses | ✅ | `/login`, `/register`, `/forgot-password`, `/reset-password` semua routable |
| Validasi form berjalan | ✅ | Client-side validation di semua form dengan feedback per-field |
| Error message tampil dengan benar | ✅ | Client errors (inline red text) + Server errors (mapping dari Laravel validation errors) + General errors (alert banner) |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Login page | ✅ |
| Register page | ✅ |
| Forgot password page | ✅ |
| Form validation | ✅ Inline validate functions di setiap halaman |
| Error handling | ✅ Client + server error mapping |
| Loading state | ✅ `isPending`/`isLoading` + disabled button + loading text |

---

## Refactoring Notes

**Issue:** Inkonsistensi pattern state management antara halaman auth.
- Login & Register menggunakan TanStack Query mutations (`useLogin`, `useRegister`)
- Forgot Password & Reset Password menggunakan direct `authService` call dengan local `useState` (`isLoading`)

**Action:** Diseragamkan dengan TanStack Query.
- Menambah `useForgotPassword()` dan `useResetPassword()` hooks di `src/hooks/useAuth.ts`
- Memigrasi `forgot-password/page.tsx` dan `reset-password/page.tsx` dari pattern try/catch ke `mutation.mutate(data, { onSuccess, onError })`
- Menghapus `isLoading` local state → menggunakan `mutation.isPending`

**Dampak:** Tidak ada perubahan API contract. Aman untuk dilanjutkan ke task berikutnya.

---

## Build & Type Check

- TypeScript compilation: ✅ Pass
- Build production: ✅ Pass (Next.js 16.2.9)
- Routes terdaftar: `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, build berhasil, siap lanjut ke TASK-005 (Authentication Integration).
