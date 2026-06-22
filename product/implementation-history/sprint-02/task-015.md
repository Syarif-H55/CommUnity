# TASK-015: Volunteer Participation Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Volunteer Participation Frontend |
| **Owner** | Abdillah |
| **Support Owner** | Hiraldy |
| **Priority** | High |
| **Estimated Effort** | M |
| **Dependencies** | TASK-014 (Volunteer Registration Backend), TASK-013 (Event Discovery Module) |

---

## Objective

Membangun antarmuka pendaftaran dan riwayat partisipasi relawan — meliputi join event button, registration confirmation, participation history page, dan event participation status.

---

## Files Created

| File | Deskripsi |
|---|---|
| `frontend/src/services/volunteer.service.ts` | Service layer API calls — `register(eventId)` via POST dan `myRegistrations(filters)` via GET |
| `frontend/src/hooks/useVolunteer.ts` | TanStack Query hooks — `useRegisterEvent()` mutation dengan invalidasi cache registrations & events, `useMyRegistrations()` query dengan placeholderData |
| `frontend/src/app/registrations/page.tsx` | Halaman riwayat partisipasi — daftar registrasi dengan search, filter status (Semua/Akan Datang/Berlangsung/Selesai/Dibatalkan), pagination, dan RegistrationCard component |

---

## Files Modified

| File | Perubahan |
|---|---|
| `frontend/src/types/index.ts` | Menambah interface `VolunteerRegistration`, `RegistrationFilters`, `RegistrationPaginatedResponse` |
| `frontend/src/app/discover/[id]/page.tsx` | **Join Event button aktif** — integrasi `useRegisterEvent` & `useMyRegistrations`, deteksi status sudah mendaftar, kuota penuh, success/error confirmation, state untuk unauthenticated user |
| `frontend/src/app/dashboard/page.tsx` | Menambah shortcut link ke halaman `/registrations` — "Riwayat Partisipasi" |

---

## Feature Details

### 1. Join Event Button (Halaman Detail Event Publik)

**Lokasi:** `frontend/src/app/discover/[id]/page.tsx`

**Flow:**

```
Volunteer membuka halaman detail event
        ↓
Cek status autentikasi
   ├── Tidak login → Tombol "Masuk untuk Mendaftar" + link Daftar
   └── Login → Cek status:
        ├── Sudah mendaftar → Badge "Sudah Mendaftar" (disabled)
        ├── Kuota penuh → Badge "Kuota Penuh" (disabled)
        ├── Event bukan published → Badge "Belum Tersedia" (disabled)
        └── Tersedia → Tombol "Ikuti Kegiatan Ini"
                ↓
        Click → POST /events/{id}/register
                ↓
        Success → ✅ "Pendaftaran Berhasil!" (auto-hide 5 detik)
        Error   → ❌ Pesan error (duplicate / quota penuh / dll)
```

**States yang ditangani:**
- Authenticated + sudah mendaftar → ikon centang hijau + "Sudah Mendaftar"
- Authenticated + kuota penuh → ikon X merah + "Kuota Penuh"
- Authenticated + event bukan published → "Belum Tersedia"
- Authenticated + tersedia → Tombol "Ikuti Kegiatan Ini" + sisa kursi
- Unauthenticated → Tombol "Masuk untuk Mendaftar" + link register
- Loading mutation → spinner "Mendaftarkan..."
- Success → notifikasi hijau dengan PartyPopper
- Error → notifikasi merah dengan AlertCircle

### 2. Registration Confirmation

- **Success:** Muncul card hijau dengan ikon `PartyPopper`, teks "Pendaftaran Berhasil! Anda telah terdaftar sebagai relawan pada kegiatan ini." — auto-hide setelah 5 detik
- **Error:** Muncul card merah dengan ikon `AlertCircle`, menampilkan pesan error spesifik dari API (duplikasi, kuota penuh, dll)

### 3. Participation History Page

**Lokasi:** `frontend/src/app/registrations/page.tsx`

**Fitur:**
- **Search** — Cari berdasarkan judul event, lokasi, atau penyelenggara
- **Filter Status** — Semua / Akan Datang / Berlangsung / Selesai / Dibatalkan (via query parameter `status`)
- **Pagination** — 10 items per halaman, dengan navigasi halaman dan ellipsis
- **RegistrationCard** — Tiap card menampilkan:
  - Ikon status "Terdaftar" (hijau)
  - Judul event + nama organisasi
  - Tanggal, waktu, lokasi, jumlah peserta
  - EventStatusBadge + badge tambahan (Akan Datang / Selesai / Dibatalkan)
  - Link ke halaman detail event (`/discover/{event.id}`)
- **Empty State:**
  - Belum ada partisipasi → link "Jelajahi Kegiatan"
  - Filter tidak cocok → tombol "Hapus Semua Filter"

### 4. Event Participation Status

Ditampilkan di:
- **Halaman detail event** — status "Sudah Mendaftar" dengan ikon centang hijau setelah user berhasil register
- **Halaman riwayat** — badge "Terdaftar" pada setiap registrasi
- Deteksi otomatis via `useMyRegistrations` — semua event yang sudah didaftar akan terdeteksi dan tombol Join berubah menjadi status badge

---

## API Integration

### Endpoints Used

| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/v1/events/{event}/register` | Mendaftar sebagai relawan |
| `GET` | `/api/v1/my-registrations?status=&per_page=&page=` | Riwayat partisipasi |

### Response Format (dari Backend TASK-014)

```json
{
  "success": true,
  "message": "Riwayat partisipasi berhasil diambil.",
  "data": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "volunteer_id": "uuid",
      "event": {
        "id": "uuid",
        "title": "...",
        "organization_name": "...",
        "event_date": "...",
        "start_time": "...",
        "end_time": "...",
        "location_name": "...",
        "quota": 50,
        "current_participants": 10,
        "status": "published",
        "category_name": "...",
        "banner_url": "..."
      },
      "registered_at": "2026-06-22T18:00:00Z",
      "created_at": "2026-06-22T18:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 5,
    "last_page": 1
  }
}
```

### Error Handling

| Status Code | Skenario | Tampilan Frontend |
|---|---|---|
| `409` | Sudah mendaftar | Toast merah: "Anda sudah mendaftar pada event ini." |
| `409` | Event belum published | Toast merah: "Hanya event yang sudah dipublikasikan..." |
| `409` | Kuota penuh | Toast merah: "Kuota peserta event sudah penuh." |
| `401` | Token expired | Redirect ke halaman login |

---

## State Management

### Data Flow

```
VolunteerRegistration Backend (TASK-014)
        ↓
volunteer.service.ts (axios calls)
        ↓
useVolunteer.ts (TanStack Query hooks)
        ↓
discover/[id]/page.tsx  &  registrations/page.tsx
```

### Cache Invalidation

- `useRegisterEvent` — on success: invalidate `['registrations']` dan `['events']`
- `useMyRegistrations` — query key `['registrations', filters]` dengan `placeholderData` untuk smooth pagination

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Relawan dapat mendaftar event | ✅ | Tombol "Ikuti Kegiatan Ini" di halaman detail event → POST /events/{id}/register → success confirmation |
| Status partisipasi tampil | ✅ | "Sudah Mendaftar" (hijau) setelah register, "Kuota Penuh" (merah), "Belum Tersedia" (kuning) |
| Riwayat partisipasi tampil | ✅ | Halaman `/registrations` — daftar lengkap dengan search, filter status, pagination |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Join event button | ✅ Tombol "Ikuti Kegiatan Ini" di halaman detail event publik (`/discover/[id]`) — autentikasi required |
| Registration confirmation | ✅ Success card hijau (`PartyPopper`) auto-hide 5 detik + error card merah (`AlertCircle`) |
| Participation history page | ✅ Halaman `/registrations` — daftar registrasi dengan search, filter status, pagination, RegistrationCard component |
| Event participation status | ✅ Deteksi otomatis via `useMyRegistrations`, badge "Sudah Mendaftar" / "Kuota Penuh" / "Belum Tersedia" |

---

## Build & Verification

| Check | Status |
|---|---|
| TypeScript Compilation (`tsc --noEmit`) | ✅ Clean — 0 errors on modified files |

*Pre-existing errors di `src/components/explore/` dan `.next/types/` tidak terkait dengan TASK-015.*

---

## Catatan Penting

- Halaman `/registrations` dilindungi oleh `AuthGuard` — hanya user login yang bisa mengakses
- Registrasi event hanya bisa dilakukan oleh user yang **sudah login**
- Event **wajib berstatus published** untuk bisa diikuti (validasi di backend)
- Setelah registrasi berhasil, button berubah menjadi badge "Sudah Mendaftar" tanpa perlu refresh halaman
- Pendaftaran bersifat **auto-approved** — sesuai AI Execution Notes
- Tombol Join Event berada di **halaman detail event publik** (`/discover/[id]`), bukan di halaman management event (`/events/[id]`)

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, Join Event button berfungsi dengan registration confirmation, participation history page selesai dengan search/filter/pagination, event participation status tampil sesuai kondisi (registered/penuh/tersedia).
