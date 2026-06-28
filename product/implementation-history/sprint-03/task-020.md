# TASK-020: Event Reporting Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Event Reporting Frontend |
| **Owner** | Abdillah |
| **Support Owner** | Hiraldy |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | TASK-019 (Event Reporting Backend) |

---

## Sub Task: TASK-020A

Task ini juga mencakup **TASK-020A: AI Event Report Assistant Frontend** yang menyediakan antarmuka AI Report Assistant pada halaman pelaporan kegiatan.

---

## Objective

Membangun antarmuka pelaporan kegiatan — meliputi halaman pembuatan laporan (create/edit), upload foto dokumentasi, submit laporan, review oleh penyelenggara, dan AI-assisted report generation.

---

## Files Created

| File | Deskripsi |
|---|---|
| `src/app/events/[id]/report/page.tsx` | Halaman utama laporan — create/edit/detail/submit + AI generate modal |
| `src/app/events/[id]/report/review/page.tsx` | Halaman review laporan untuk Penyelenggara — approve/reject workflow |

### Files Reused (sudah ada sebelumnya)

| File | Deskripsi |
|---|---|
| `src/services/report.service.ts` | Layanan API untuk seluruh endpoint report — getReport, createReport, updateReport, uploadPhotos, deletePhoto, submitReport, reviewReport, aiGenerate |
| `src/hooks/useReport.ts` | React Query hooks — useEventReport, useCreateReport, useUpdateReport, useUploadPhotos, useDeletePhoto, useSubmitReport, useReviewReport, useAiGenerateReport |
| `src/components/report/PhotoUpload.tsx` | Komponen upload foto — grid preview, tambah/hapus foto, max 5, validasi |
| `src/components/report/ReportStatusBadge.tsx` | Badge status laporan — draft (kuning), submitted (biru), approved (hijau), revision_requested (merah) |
| `src/types/index.ts` | Type definitions — EventReport, ReportPhoto, ReportStatus, CreateReportRequest, UpdateReportRequest, ReviewReportRequest, AiGenerateReportResponse |

---

## Feature Details

### 1. Report Page (`/events/[id]/report`)

Halaman utama pelaporan yang menangani 5 skenario berbeda:

#### a. Belum ada laporan (Create Mode)
- Form ringkasan kegiatan (textarea)
- Input jumlah peserta hadir
- Upload foto dokumentasi (min 1, max 5)
- Tombol **Simpan Draft** → POST `/events/{event}/report`
- Tombol **Generate AI** → POST `/events/{event}/report/ai-generate`
- Tombol **Kirim Laporan** → POST `/events/{event}/report/submit`
- Hint text: informasi aturan foto (min 1, max 5) dan AI generate

#### b. Draft / Revision Requested (Edit Mode)
- Form terisi dengan data laporan yang ada
- Tombol **Simpan Draft** → PATCH `/events/{event}/report`
- Upload/tambah foto baru → POST `/events/{event}/report/photos`
- Hapus foto → DELETE `/events/{event}/report/photos/{photo}`
- Banner revisi (kuning) menampilkan `rejection_reason` jika status revision_requested
- Tombol **Kirim Laporan** → POST `/events/{event}/report/submit`

#### c. Submitted (Read-Only Mode)
- Banner biru: "Laporan Telah Dikirim — menunggu review"
- Tombol navigasi ke halaman review (untuk Penyelenggara)
- Semua field readonly
- Tampilkan waktu submit

#### d. Approved (Read-Only Mode)
- Banner hijau: "Laporan Disetujui — Event telah selesai"
- Tombol "Detail Event" navigasi ke `/events/[id]`
- Tampilkan waktu approval
- Semua field readonly

### 2. AI Report Assistant (TASK-020A)

Fitur AI terintegrasi dalam halaman laporan:

#### AI Generate Button
- Muncul di header card saat status editable (draft / revision_requested)
- Icon Sparkles + teks "Generate AI"
- Loading spinner selama proses generate
- Memanggil `POST /events/{event}/report/ai-generate`

#### AI Preview Modal
- Modal full dengan textarea editable
- Judul: "Draft AI Report" dengan icon Sparkles
- Deskripsi: "Review dan edit draft yang dihasilkan AI sebelum digunakan"
- Textarea dengan font monospace untuk preview
- Tombol **Batal** — menutup modal tanpa menyimpan
- Tombol **Gunakan Draft Ini** — mengisi ringkasan form dengan hasil AI
- Error state handling jika AI gagal

#### Error Handling
- AI service failure → menampilkan error message di modal
- Tidak menghalangi workflow manual
- User tetap bisa mengisi laporan secara manual

### 3. Review Page (`/events/[id]/report/review`)

Halaman review untuk Penyelenggara:

#### Report Detail Display
- Informasi event (judul, tanggal, waktu, lokasi)
- Ringkasan kegiatan
- Jumlah peserta hadir
- Galeri foto dokumentasi (clickable → open di tab baru)
- Status badge laporan
- Submitter name

#### Review Actions
- **Tombol "Setujui"** — mengubah action menjadi `approved`
- **Tombol "Minta Revisi"** — mengubah action menjadi `revision_requested`
- Jika memilih "Minta Revisi": input textarea untuk alasan revisi (required)
- Tombol **konfirmasi** → POST `/events/{event}/report/review`
- Tombol **Batal** — reset pilihan action
- Setelah submit: redirect ke halaman detail event

#### Already Reviewed State
- Jika laporan sudah di-review: tampilkan card status (hijau untuk approved, kuning untuk revision_requested)
- Sembunyikan action buttons

---

## UI States

### Loading State
- Fullscreen centered spinner + teks "Memuat laporan..."
- Muncul saat fetching event atau report data

### Error State
- Event tidak ditemukan: card error dengan tombol "Kembali"
- Server error: banner merah di atas form
- AI error: pesan error di dalam modal AI (tidak mengganggu workflow)
- Validation error dari backend: ditampilkan di banner merah

### Empty State
- Belum ada laporan: form kosong dengan hint text
- Belum ada foto: upload area kosong (dashed border)

### Success State
- Draft tersimpan: data otomatis ter-refresh (TanStack Query cache invalidation)
- Laporan terkirim: banner biru + status berubah
- Laporan disetujui: banner hijau + event completed

---

## API Integration

| Method | Endpoint | Hook | Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/events/{event}/report` | `useEventReport(eventId)` | Ambil data laporan |
| `POST` | `/api/v1/events/{event}/report` | `useCreateReport(eventId)` | Buat draft laporan |
| `PATCH` | `/api/v1/events/{event}/report` | `useUpdateReport(eventId)` | Update draft/revisi |
| `POST` | `/api/v1/events/{event}/report/photos` | `useUploadPhotos(eventId)` | Upload foto dokumentasi |
| `DELETE` | `/api/v1/events/{event}/report/photos/{photo}` | `useDeletePhoto(eventId)` | Hapus foto |
| `POST` | `/api/v1/events/{event}/report/submit` | `useSubmitReport(eventId)` | Kirim laporan |
| `POST` | `/api/v1/events/{event}/report/review` | `useReviewReport(eventId)` | Approve/reject laporan |
| `POST` | `/api/v1/events/{event}/report/ai-generate` | `useAiGenerateReport(eventId)` | Generate draft AI |

Semua mutation menggunakan TanStack Query dengan cache invalidation otomatis:
- `useCreateReport` → invalidate `['event-report', eventId]`
- `useUpdateReport` → invalidate `['event-report', eventId]`
- `useUploadPhotos` → invalidate `['event-report', eventId]`
- `useDeletePhoto` → invalidate `['event-report', eventId]`
- `useSubmitReport` → invalidate `['event-report', eventId]`
- `useReviewReport` → invalidate `['event-report', eventId]` + `['events', eventId]`

---

## Navigation Flow

```
/events/[id] (Event Detail)
  │
  ├── Link "Laporan Kegiatan" → /events/[id]/report
  │       │
  │       ├── Belum ada laporan → Form create
  │       ├── Draft/Revisi → Form edit + submit
  │       ├── Submitted → Read-only + link review
  │       │       │
  │       │       └── /events/[id]/report/review (Penyelenggara)
  │       │               ├── Approve → redirect ke /events/[id]
  │       │               └── Revisi → redirect ke /events/[id]
  │       └── Approved → Read-only + link detail event
  │
  └── Back button → /events
```

---

## Implementation Tasks Coverage

### TASK-020

| Task | Status |
|---|---|
| Report submission page | ✅ `/events/[id]/report` — form create + edit + submit |
| Photo upload component | ✅ `PhotoUpload.tsx` — grid, preview, tambah, hapus, max 5 |
| Report detail page | ✅ Terintegrasi dalam halaman yang sama — read-only mode untuk submitted/approved |
| Report review page | ✅ `/events/[id]/report/review` — approve & rejection workflow |
| Report status page | ✅ Status badge + state banners (submitted, approved, revision_requested) |

### TASK-020A

| Task | Status |
|---|---|
| Generate AI Report button | ✅ Tombol "Generate AI" di header form laporan (hanya saat editable) |
| AI Report Preview Modal | ✅ Modal dengan textarea editable + draft AI |
| Edit Generated Report | ✅ Textarea bisa diedit langsung di modal |
| Insert Generated Content | ✅ Tombol "Gunakan Draft Ini" → mengisi ringkasan form |
| Loading State | ✅ Spinner pada tombol Generate + disabled state |
| Error State Handling | ✅ Error message di dalam modal, tidak mengganggu workflow manual |

---

## Build & Verification

| Check | Status |
|---|---|
| TypeScript Compilation | ✅ Clean — 0 errors |
| Next.js Build | ✅ Compiled successfully (Turbopack) |
| Route Registration | ✅ `/events/[id]/report` (dynamic) |
| Route Registration | ✅ `/events/[id]/report/review` (dynamic) |
| Lint | ✅ No lint errors |

### Route Tree (terverifikasi dari build output)

```
ƒ /events/[id]/report            → Report main page (create/edit/detail/AI)
ƒ /events/[id]/report/review     → Review page (approve/reject)
```

---

## Catatan Penting

- Halaman report menggunakan dynamic route (`[id]`) dan di-protect oleh `events/layout.tsx` (AuthGuard + RoleGuard untuk organizer/coordinator)
- Halaman review hanya bisa diakses oleh Penyelenggara (authorization di-backend via `authorizeOrganizer`)
- AI Report Assistant menggunakan provider yang dikonfigurasi di `config/ai.php` (mock/openai)
- Semua state management menggunakan TanStack Query — data otomatis sinkron setelah mutation
- Photo preview menggunakan `URL.createObjectURL` untuk file baru, dan `image_url` dari backend untuk foto existing
- Saat `deletePhoto`, file dihapus dari storage Laravel (backend handle)
- Tombol submit disable jika: loading mutation, ringkasan < 20 karakter, atau belum ada foto
- AI failure tidak menghalangi workflow manual — user tetap bisa mengisi dan submit laporan manual

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, laporan dapat dibuat dengan foto dokumentasi (min 1, max 5), status laporan tampil sesuai workflow (draft → submitted → approved / revision_requested), Penyelenggara dapat review laporan, AI Report Assistant dapat menghasilkan draft yang bisa diedit sebelum digunakan, workflow manual tetap berjalan tanpa AI, build sukses 0 error.
