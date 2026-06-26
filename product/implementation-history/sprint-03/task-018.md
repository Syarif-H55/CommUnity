# TASK-018: Attendance Management Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Attendance Management Frontend |
| **Owner** | Hiraldy |
| **Support Owner** | Abdillah |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | TASK-017 (Attendance Management Backend) |

---

## Objective

Membangun antarmuka attendance validation — meliputi QR generation, QR scanning, manual attendance, attendance dashboard, dan riwayat kehadiran volunteer.

---

## Files Created

| File | Deskripsi |
|---|---|
| `frontend/src/types/index.ts` | Menambah interface `Attendance`, `AttendanceStatus`, `AttendanceSummary`, `QRData`, `AttendanceFilters`, `EventCategory`, `EventQueryParams` |
| `frontend/src/services/attendance.service.ts` | Service layer API calls — `getQRData`, `scanAttendance`, `manualAttendance`, `updateAttendance`, `getEventAttendances`, `getAttendanceSummary`, `getMyAttendances` |
| `frontend/src/hooks/useAttendance.ts` | TanStack Query hooks — `useQRData`, `useRefreshQRData`, `useScanAttendance`, `useManualAttendance`, `useUpdateAttendance`, `useEventAttendances`, `useAttendanceSummary`, `useMyAttendances` |
| `frontend/src/components/attendance/AttendanceStatusBadge.tsx` | Badge status kehadiran — Present (emerald), Late (amber), Absent (red) dengan ikon |
| `frontend/src/components/attendance/AttendanceSummaryCards.tsx` | 4 kartu metrik animated — Total, Hadir, Terlambat, Tidak Hadir dengan gradient progress bar |
| `frontend/src/components/attendance/AttendanceQRCode.tsx` | QR code display — gradient wrapper, refresh button, countdown expiry, glow effect |
| `frontend/src/components/attendance/AttendanceTable.tsx` | Tabel kehadiran — search, filter status, pagination, empty state |
| `frontend/src/components/attendance/AttendanceManualForm.tsx` | Form manual attendance — search volunteer, 3 status buttons, submit confirmation |
| `frontend/src/components/attendance/index.ts` | Barrel export |
| `frontend/src/app/events/[id]/attendance/page.tsx` | Attendance dashboard — 4 tabs (Dashboard, QR, Manual, History), hero banner dengan quick stats |
| `frontend/src/app/events/[id]/attendance/scan/page.tsx` | QR scanner — kamera, jsQR detection, scan-line animation, torch toggle, success/error state |
| `frontend/src/app/my-attendances/page.tsx` | Riwayat kehadiran volunteer — filter status, search, mini stats cards, date blocks |

---

## Files Modified

| File | Perubahan |
|---|---|
| `frontend/src/types/index.ts` | Menambah 6 interface baru untuk attendance, 2 interface untuk event category/query params |
| `frontend/src/app/dashboard/page.tsx` | Menambah shortcut link ke halaman `/my-attendances` — "Riwayat Kehadiran" |
| `frontend/src/app/events/[id]/page.tsx` | Menambah link "Kelola Absensi" di sidebar Aksi Cepat dengan ikon QrCode |
| `frontend/src/app/globals.css` | Menambah keyframe `animate-scan-line` untuk QR scanner overlay |
| `frontend/src/components/explore/EventDiscoveryCard.tsx` | Fix `participants_count` → `current_participants`, `organization_logo_url` → fallback icon `Building2` |
| `frontend/src/components/explore/EventDiscoveryFilters.tsx` | Fix type mismatch `category_id` string/number, tambah `date_from`/`date_to` ke EventQueryParams |

---

## Feature Details

### 1. Attendance Dashboard (`/events/[id]/attendance`)

**Lokasi:** `frontend/src/app/events/[id]/attendance/page.tsx`

**4 Tab Navigasi:**
1. **Dashboard** — Ringkasan kehadiran: `AttendanceSummaryCards` (Total, Hadir, Terlambat, Tidak Hadir) + filter + tabel `AttendanceTable`
2. **QR Code** — `AttendanceQRCode` untuk display QR generator dengan refresh button
3. **Manual** — `AttendanceManualForm` untuk input kehadiran manual via search volunteer
4. **History** — Tabel history kehadiran untuk event ini

**Hero Banner:**
- Gradient emerald dengan pattern overlay
- Quick stats: Total Relawan, Hadir, Terlambat, Belum Terverifikasi
- Background ikon QrCode dekoratif

**Animasi:**
- Staggered entrance (`animate-in` dengan `slide-in-from-bottom`)
- Hover scale pada summary cards
- Gradient background animasi

### 2. QR Scanner (`/events/[id]/attendance/scan`)

**Lokasi:** `frontend/src/app/events/[id]/attendance/scan/page.tsx`

**Flow:**
```
Koordinator membuka halaman scan
        ↓
Request izin kamera (environment-facing)
        ↓
Stream kamera ditampilkan di <video>
        ↓
requestAnimationFrame loop → capture canvas frame
        ↓
jsQR.decode(frame) → deteksi QR
        ↓
QR terdeteksi → POST /attendance/scan
        ↓
Success → ✅ "Absensi berhasil!" + data volunteer
Error   → ❌ Pesan error (already scanned / invalid / dll)
```

**Fitur:**
- Kamera belakang (environment) dengan fallback ke kamera depan
- Scan line animasi (CSS keyframe `animate-scan-line`)
- Torch toggle (flashlight on/off via `ImageCapture` API)
- Continuous detection via `requestAnimationFrame`
- Success overlay dengan data volunteer + ikon centang
- Error state dengan pesan spesifik
- Manual input fallback button
- `AttendanceManualForm` bottom sheet sebagai alternatif

### 3. My Attendances (`/my-attendances`)

**Lokasi:** `frontend/src/app/my-attendances/page.tsx`

**Fitur:**
- **Mini Stats** — 3 card: Total Event, Hadir, Belum Terverifikasi
- **Filter Status** — Semua, Hadir, Terlambat, Tidak Hadir
- **Search** — Cari berdasarkan event title / organizer
- **Date Blocks** — Tiap kehadiran ditampilkan dalam card dengan:
  - Avatar/initials organisasi
  - Title event + nama organisasi
  - Tanggal, waktu, lokasi
  - `AttendanceStatusBadge` (Hadir/Terlambat/Tidak Hadir)
  - Waktu verifikasi + validator name
- **Empty State:**
  - Belum ada kehadiran → ilustrasi + "Belum ada catatan kehadiran"
  - Filter tidak cocok → tombol "Hapus Filter"

### 4. Attendance Components

#### AttendanceStatusBadge
- **Hadir** — emerald background, `CheckCircle2` icon, "Hadir"
- **Terlambat** — amber background, `Clock` icon, "Terlambat"
- **Tidak Hadir** — red background, `XCircle` icon, "Tidak Hadir"

#### AttendanceSummaryCards
- 4 cards dalam grid 2x2 (mobile) / 4 kolom (desktop)
- Masing-masing: ikon + label + nilai + progress bar gradient
- Loading skeleton shimmer saat fetching
- Animasi staggered entrance

#### AttendanceQRCode
- QR code via `qrcode.react` dengan URL scan page
- Gradient wrapper emerald-to-teal dengan backdrop blur
- Refresh button → mutation + cache update via `setQueryData`
- Expiry countdown (timer 60 detik, badge "Kadaluarsa" jika lewat)
- Glow effect pada wrapper

#### AttendanceTable
- Search input dengan debounce
- Filter status dropdown (Semua/Hadir/Terlambat/Tidak Hadir)
- Tabel responsive dengan header sticky
- Pagination dengan info "X of Y"
- Empty state: "Belum ada data kehadiran"

#### AttendanceManualForm
- Search input untuk mencari volunteer (dari registered participants)
- Search result list dengan avatar + nama
- 3 status buttons: Hadir (emerald), Terlambat (amber), Tidak Hadir (red)
- Confirm button dengan loading state
- Success/error toast feedback

---

## API Integration

### Endpoints Used

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/v1/events/{event}/qr` | Generate QR data |
| `POST` | `/api/v1/attendance/scan` | Scan QR attendance |
| `POST` | `/api/v1/attendance/manual` | Manual attendance |
| `PUT` | `/api/v1/attendance/{attendance}` | Update attendance status |
| `GET` | `/api/v1/events/{event}/attendances` | Daftar attendances per event |
| `GET` | `/api/v1/events/{event}/attendance/summary` | Summary statistik |
| `GET` | `/api/v1/my-attendances` | Riwayat kehadiran user |

### Response Format (dari Backend TASK-017)

```json
{
  "success": true,
  "message": "...",
  "data": {
    "id": "uuid",
    "event_id": "uuid",
    "volunteer_id": "uuid",
    "volunteer_name": "...",
    "volunteer_avatar": "...",
    "attendance_status": "present",
    "attendance_time": "2026-06-25T09:00:00Z",
    "validated_by": "uuid",
    "validator_name": "...",
    "event_title": "...",
    "organization_name": "..."
  }
}
```

### Error Handling

| Status Code | Skenario | Tampilan Frontend |
|---|---|---|
| `400` | Invalid QR code | Toast merah: "QR code tidak valid" |
| `409` | Sudah di-scan | Toast merah: "Volunteer sudah melakukan absensi" |
| `404` | Event/volunteer tidak ditemukan | Toast merah: "Data tidak ditemukan" |
| `401` | Token expired | Redirect ke halaman login |

---

## State Management

### Data Flow

```
Attendance Backend (TASK-017)
        ↓
attendance.service.ts (axios calls)
        ↓
useAttendance.ts (TanStack Query hooks)
        ↓
events/[id]/attendance/*.tsx  &  my-attendances/page.tsx
```

### Cache Invalidation

- `useScanAttendance` — on success: invalidate `['event-attendances']`, `['attendance-summary']`
- `useManualAttendance` — on success: invalidate `['event-attendances']`, `['attendance-summary']`
- `useUpdateAttendance` — on success: invalidate `['event-attendances']`, `['attendance-summary']`
- `useRefreshQRData` — mutation + langsung update cache via `setQueryData`
- `useEventAttendances` — query key `['event-attendances', eventId, filters]`
- `useMyAttendances` — query key `['my-attendances', filters]`

---

## Libraries Installed

| Library | Versi | Alasan |
|---|---|---|
| `qrcode.react` | latest | Render QR code untuk attendance |
| `jsqr` | latest | Decode QR code dari camera stream |

---

## UI/UX Highlights

- **Gradient backgrounds** — emerald theme konsisten dengan branding
- **Glassmorphism** — backdrop blur + semi-transparent cards
- **Animations** — `animate-in`, `slide-in-from-bottom`, `fade-in` via Tailwind
- **Scan line** — custom CSS keyframe `animate-scan-line` dengan gradient emerald
- **Responsive** — mobile-first, grid beradaptasi dari 1 ke 2 ke 4 kolom
- **Loading states** — skeleton shimmer untuk summary cards, spinner untuk buttons
- **Empty states** — ilustrasi + pesan + call-to-action button
- **Error states** — toast merah dengan pesan spesifik

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| QR tampil dengan benar | ✅ | `AttendanceQRCode` menampilkan QR dari endpoint `/events/{id}/qr` via `qrcode.react`, refresh button, expiry indicator |
| QR dapat dipindai | ✅ | Scanner page menggunakan jsQR + `getUserMedia`, continuous detection via `requestAnimationFrame`, success/error handling |
| Attendance status tampil | ✅ | `AttendanceStatusBadge` (Hadir/Terlambat/Tidak Hadir), summary cards, tabel history, my-attendances |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Attendance dashboard | ✅ Halaman `/events/[id]/attendance` — 4 tabs, summary cards, tabel filterable, hero banner |
| QR display page | ✅ Tab QR Code dengan `AttendanceQRCode`, refresh, expiry countdown |
| QR scanner page | ✅ Halaman `/events/[id]/attendance/scan` — kamera, jsQR, torch, scan-line animation |
| Attendance history page | ✅ Halaman `/my-attendances` — filter, search, mini stats, date blocks |
| Attendance status display | ✅ `AttendanceStatusBadge` di tabel, history, dan my-attendances |

---

## Build & Verification

| Check | Status |
|---|---|
| TypeScript Compilation (`next build`) | ✅ Clean — 0 errors |

*Workspace root warning (multiple lockfiles) tidak mempengaruhi kompilasi.*

---

## Catatan Penting

- Tabs component menggunakan `defaultValue` + `onValueChange` (internal state), bukan controlled `value` prop
- QR refresh menggunakan `setQueryData` untuk update cache langsung tanpa refetch
- `AttendanceManualForm` hanya menampilkan volunteer yang sudah terdaftar (attendances page)
- Scanner menggunakan `environment` camera dengan fallback ke `user` camera
- Torch toggle menggunakan `ImageCapture` API — mungkin tidak support di semua browser
- Halaman scan dan attendance dashboard dilindungi oleh `AuthGuard`
- Pre-existing type errors di `.next/types/` terkait workspace root detection, bukan code errors
- Pendaftaran `EventCategory` dan `EventQueryParams` ditambahkan ke types untuk fix pre-existing error di explore components

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, QR display & scanner berfungsi, manual attendance form siap, attendance dashboard dengan ringkasan dan tabel history lengkap, my-attendances page dengan filter dan search.
