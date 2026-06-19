# TASK-009: Organization Management Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Organization Management Frontend |
| **Owner** | Hiraldy |
| **Support Owner** | Abdillah |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | TASK-008 (Organization Module Backend) |

---

## Objective

Membangun halaman frontend untuk manajemen organisasi — meliputi registrasi organisasi multi-step, daftar organisasi pengguna, halaman detail organisasi dengan status verifikasi, upload dokumen, dan timeline verifikasi.

---

## Files Created

| File | Deskripsi |
|---|---|
| `src/app/organizations/page.tsx` | Halaman daftar organisasi milik user — slideshow hero, grid OrganizationCard, empty state, loading state |
| `src/app/organizations/register/page.tsx` | Multi-step form registrasi (3 langkah): Informasi Dasar → Dokumen & Logo → Konfirmasi |
| `src/app/organizations/[id]/page.tsx` | Halaman detail organisasi — hero banner, 3 tab (Ringkasan, Verifikasi, Dokumen), upload dokumen |
| `src/components/organization/OrganizationCard.tsx` | Kartu organisasi dengan badge status, logo, member/event count, tilt effect, hover arrow |
| `src/components/organization/OrganizationSlideshow.tsx` | Hero slideshow dengan auto-play, pause on hover, dot navigasi, fade transition |
| `src/components/organization/DocumentUpload.tsx` | Komponen upload drag-and-drop dengan validasi format/ukuran, loading state, preview |
| `src/components/organization/VerificationTimeline.tsx` | Timeline 3-step (Terdaftar → Menunggu → Terverifikasi/Ditolak) dengan indikator status |
| `src/components/organization/TiltCard.tsx` | 3D tilt card wrapper dengan mouse-follow rotation dan efek glare |
| `src/components/organization/index.ts` | Barrel export seluruh komponen organization |
| `src/services/organization.service.ts` | Service layer: list, getById, register (FormData), update, uploadDocument, getMembers, getDashboardStats |
| `src/hooks/useOrganization.ts` | TanStack Query hooks: useOrganizations, useOrganization, useRegisterOrganization, useUpdateOrganization, useUploadDocument, useOrganizationMembers, useDashboardStats |

---

## Files Modified

| File | Perubahan |
|---|---|
| `src/types/index.ts` | Menambah tipe: `Organization`, `OrganizationMember`, `OrganizationRegistrationRequest`, `OrganizationUpdateRequest`, `OrganizationDocumentUpload`, `DashboardStats`, `VerificationStatus`, `OrganizationRole` |
| `src/app/dashboard/page.tsx` | Menambah link card "Kelola Organisasi" yang mengarah ke `/organizations` |

---

## Halaman Frontend

### 1. Daftar Organisasi (`/organizations`)

- **Hero Slideshow:** 4 slide dengan gambar Unsplash, judul, deskripsi — auto-play 5 detik, pause on hover
- **Header:** Brand logo, tombol "Daftar Organisasi", tombol logout
- **Grid Organisasi:** Kartu dalam grid responsive (1/2/3 kolom) dengan loading spinner, empty state (Belum Ada Organisasi) + CTA daftar
- **Auth:** Dibungkus `AuthGuard` — hanya user terautentikasi

### 2. Registrasi Organisasi (`/organizations/register`)

- **3 Langkah:**
  - **Langkah 1:** Nama organisasi (required), deskripsi (textarea)
  - **Langkah 2:** Upload logo (drag-click, preview, remove), info dokumen verifikasi
  - **Langkah 3:** Review data — ringkasan + checklist informasi
- **Progress Bar:** Visual progress `Langkah 1/3` + progress bar
- **Step Indicator:** Desktop — 3 step dengan ikon, highlight active/completed
- **Form Validation:** Client-side per-step validation
- **Error Handling:** Server validation errors dari Laravel di-map ke field-level; general error di alert banner
- **Loading:** Submit button spinner + "Mendaftarkan..."
- **Success:** Redirect ke `/organizations`

### 3. Detail Organisasi (`/organizations/[id]`)

- **Hero Banner:** Gradient hijau, logo, nama, bergabung sejak, badge status, deskripsi, verified_at
- **3 Tab:**
  - **Ringkasan:** Stat cards (Anggota, Event, Peran Anda) + informasi organisasi
  - **Verifikasi:** Timeline status (kiri) + upload dokumen (kanan — tersembunyi jika sudah approved)
  - **Dokumen:** Daftar dokumen yang sudah diupload dengan status
- **Upload Dokumen:** Drag-and-drop, validasi format (PDF/JPG/JPEG/PNG max 5MB), loading, success/error feedback
- **Status Badge:** `pending` → warning (Menunggu), `approved` → success (Terverifikasi), `rejected` → destructive (Ditolak)
- **Auth:** Dibungkus `AuthGuard`
- **Loading/Error State:** Spinner + error card "Organisasi Tidak Ditemukan"

---

## API Endpoints (Consumed)

| Method | Endpoint | Hook | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/organizations` | `useOrganizations()` | List organisasi user |
| POST | `/api/v1/organizations` | `useRegisterOrganization()` | Register organisasi baru (FormData) |
| GET | `/api/v1/organizations/{id}` | `useOrganization(id)` | Detail organisasi |
| PATCH | `/api/v1/organizations/{id}` | `useUpdateOrganization(id)` | Update organisasi |
| POST | `/api/v1/organizations/{id}/documents` | `useUploadDocument(id)` | Upload dokumen verifikasi |
| GET | `/api/v1/organizations/{id}/members` | `useOrganizationMembers(id)` | Daftar anggota |
| GET | `/api/v1/organizations/stats` | `useDashboardStats()` | Statistik dashboard organisasi |

---

## Arsitektur & Alur Data

### Alur Registrasi Organisasi

```
User → /organizations/register (AuthGuard)
        → Multi-step form (3 langkah)
        → useRegisterOrganization.mutate(data)
            → organizationService.register(data FormData)
                → POST /api/v1/organizations (multipart)
            → onSuccess: invalidateQueries(['organizations']) + redirect /organizations
            → onError: map server errors ke field-level / alert banner
```

### Alur Upload Dokumen

```
User → /organizations/{id} (tab Verifikasi)
        → DocumentUpload component
            → validasi client: format (PDF/JPG/PNG), maks 5MB
            → useUploadDocument(id).mutate(file)
                → organizationService.uploadDocument(id, file FormData)
                    → POST /api/v1/organizations/{id}/documents
                → onSuccess: invalidateQueries(['organizations', id]) + sukses banner
                → onError: error banner
```

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Organization registration page | ✅ | Multi-step form dengan validasi, progress bar, step indicator, logo upload |
| Organization detail page | ✅ | Hero banner, 3 tab (Ringkasan/Verifikasi/Dokumen), status badge, loading/error state |
| Verification status page | ✅ | Timeline 3-step (Terdaftar→Menunggu→Terverifikasi/Ditolak), warna sesuai status |
| Upload document form | ✅ | Drag-and-drop, validasi format PDF/JPG/JPEG/PNG max 5MB, loading/success/error |
| Organization dashboard | ✅ | List organisasi dengan slideshow hero, grid cards, empty state, loading state |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Organization registration page | ✅ Multi-step form dengan 3 langkah + progress bar |
| Organization detail page | ✅ Hero banner + 3 tab + informasi detail + stat cards |
| Verification status page | ✅ VerificationTimeline component (Terdaftar → Menunggu → Terverifikasi/Ditolak) |
| Upload document form | ✅ DocumentUpload component (drag-drop, validasi format/ukuran, loading) |
| Organization dashboard | ✅ List page dengan slideshow + grid cards + empty state |
| Axios service integration | ✅ organizationService.ts — semua endpoint terdefinisi |
| TanStack Query hooks | ✅ 7 hooks untuk query & mutations + cache invalidation |
| Type definitions | ✅ Organization, OrganizationMember, OrganizationRole, VerificationStatus, dll |
| Route protection | ✅ Semua halaman dibungkus AuthGuard |

---

## UI Components

### TiltCard
- 3D perspective tilt effect mengikuti gerakan mouse
- Glare effect dengan radial gradient dinamis
- Smooth return animation saat mouse leave
- Configurable tilt degree

### OrganizationCard
- TiltCard wrapper dengan layout informasi organisasi
- Logo (image/fallback icon), nama, bergabung sejak
- Badge status verifikasi (warning/success/destructive)
- Deskripsi (line-clamp-2), member/event count
- Hover: chevron arrow slide-in

### OrganizationSlideshow
- Full-width hero slideshow dengan auto-play (5 detik)
- Pause on hover, navigasi dot + prev/next button
- Fade + scale transition antar slide
- Gradient overlay untuk text readability
- Keyboard/accessibility support

### DocumentUpload
- Drag-and-drop zone + click to upload
- Validasi: format file + ukuran maksimal
- File preview dengan nama + remove button
- Loading spinner selama upload
- Error state dengan pesan spesifik

### VerificationTimeline
- 3-step vertical timeline
- Status: completed (emerald) / active (ring) / upcoming (muted)
- Connecting line antara steps
- Rejected state: alert card merah dengan pesan upload ulang

---

## Build & Type Check

| Check | Status |
|---|---|
| TypeScript compilation | ✅ |
| Build production | ✅ |
| Routes terdaftar | `/organizations`, `/organizations/register`, `/organizations/[id]` |

---

## Catatan Penting

- Semua halaman menggunakan `AuthGuard` — hanya bisa diakses user terautentikasi
- Registrasi menggunakan `FormData` untuk mendukung upload file (logo)
- Upload dokumen verifikasi dipisahkan dari registrasi — dilakukan setelah organisasi terdaftar
- Status verifikasi `pending` → `approved`/`rejected` — handling untuk masing-masing status sudah diimplementasikan di semua komponen
- Cache invalidation otomatis setelah registrasi (invalidate `['organizations']`) dan upload dokumen (invalidate `['organizations', id]`)
- Dashboard halaman utama sudah memiliki navigasi ke halaman organisasi

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, build berhasil, semua halaman frontend organization telah terimplementasi.
