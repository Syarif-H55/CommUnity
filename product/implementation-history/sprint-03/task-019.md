# TASK-019: Event Reporting Backend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Event Reporting Backend |
| **Owner** | Syarif |
| **Support Owner** | Irham |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | TASK-017 (Attendance Management Backend) |

---

## Objective

Mengimplementasikan backend event reporting dan report review workflow — meliputi pembuatan laporan kegiatan, upload dokumentasi foto, submit laporan, review oleh penyelenggara, approval workflow, dan rejection workflow.

---

## Files Created

| File | Deskripsi |
|---|---|
| `database/migrations/2026_06_26_000001_create_event_reports_table.php` | Membuat tabel `event_reports` — id (uuid), event_id, submitted_by, summary, total_attendees, report_status, submitted_at, approved_at |
| `database/migrations/2026_06_26_000002_create_event_documentations_table.php` | Membuat tabel `event_documentations` — id (uuid), report_id, image_path |
| `database/migrations/2026_06_26_000003_add_rejection_reason_to_event_reports_table.php` | Menambah kolom `rejection_reason` ke tabel `event_reports` |
| `app/Models/EventReport.php` | Model EventReport — relasi `event()`, `submitter()`, `documentations()` |
| `app/Models/EventDocumentation.php` | Model EventDocumentation — relasi `report()` |
| `app/Services/EventReportService.php` | Service layer — createReport, updateReport, uploadPhotos, deletePhoto, submitReport, reviewReport, storePhotos |
| `app/Http/Controllers/Api/V1/EventReportController.php` | Controller — 7 endpoints dengan 3 level authorization |
| `app/Http/Requests/Report/StoreEventReportRequest.php` | Form Request validasi create/update report — summary, total_attendees, photos (max 5, min 1, jpg/jpeg/png) |
| `app/Http/Requests/Report/ReviewEventReportRequest.php` | Form Request validasi review — action (approved/revision_requested), rejection_reason (required_if) |
| `app/Http/Requests/Report/UploadReportPhotosRequest.php` | Form Request validasi upload foto — photos (array, min 1, max 5, image) |
| `app/Http/Resources/EventReportResource.php` | API Resource — format response laporan dengan photos, submitter, event |
| `app/Http/Resources/EventDocumentationResource.php` | API Resource — format response foto dengan image_url |

---

## Files Modified

| File | Perubahan |
|---|---|
| `app/Models/Event.php` | Menambah method `report()` — hasOne(EventReport::class) |
| `app/Models/User.php` | Menambah method `submittedReports()` — hasMany(EventReport::class, 'submitted_by') |
| `routes/api.php` | Menambah import `EventReportController` dan 7 route report endpoints |

---

## Feature Details

### 1. Report Lifecycle

```
Draft
  ↓ (submit — validasi min 1 foto)
Submitted
  ↓ (review by penyelenggara)
Approved / Revision Requested
  ↓                    ↓
Event Completed    Kembali ke Draft/Revisi
```

**Status Transitions:**
- `draft` → `submitted` (via submit endpoint, validasi min 1 foto)
- `submitted` → `approved` (via review endpoint, action=approved)
- `submitted` → `revision_requested` (via review endpoint, action=revision_requested)
- `revision_requested` → `submitted` (via submit endpoint setelah edit)

**Event Status:**
- Saat report di-`approved`, event status otomatis berubah menjadi `completed`

### 2. Report Submission Flow

```
Coordinator membuka halaman laporan
        ↓
POST /events/{event}/report → Buat draft report
        ↓
Upload foto via POST /events/{event}/report/photos (max 5)
        ↓
Isi summary & total_attendees via PATCH /events/{event}/report
        ↓
POST /events/{event}/report/submit → Validasi min 1 foto
        ↓
Report status → submitted
```

### 3. Report Review Flow

```
Penyelenggara membuka laporan
        ↓
Lihat detail report + foto dokumentasi
        ↓
POST /events/{event}/report/review
    ├── action: "approved"
    │       ↓
    │   Report status → approved
    │   Event status → completed
    │
    └── action: "revision_requested" + rejection_reason
            ↓
        Report status → revision_requested
        Koordinator edit & submit ulang
```

### 4. Photo Validation

- **Minimum:** 1 foto wajib sebelum submit
- **Maximum:** 5 foto total per laporan
- **Format:** jpg, jpeg, png
- **Ukuran:** Maksimal 5MB per foto
- **Storage:** `storage/app/public/event-documentations/{report_id}/`
- **Delete:** Foto dapat dihapus saat status draft atau revision_requested
- **Validation Location:**
  - Upload: `UploadReportPhotosRequest` + service `uploadPhotos()` check total
  - Submit: service `submitReport()` check count ≥ 1

### 5. Authorization Levels

| Level | Metode | Role yang Diizinkan | Endpoints |
|---|---|---|---|
| Event Access | `authorizeEventAccess` | Penyelenggara, Koordinator Event, Admin | `show` |
| Manage Report | `authorizeCoordinatorOrOrganizer` | Penyelenggara, Koordinator Event | `store`, `update`, `uploadPhotos`, `deletePhoto`, `submit` |
| Review Report | `authorizeOrganizer` | Penyelenggara, Admin | `review` |

---

## API Endpoints

| Method | Endpoint | Fungsi | Auth |
|---|---|---|---|
| `GET` | `/api/v1/events/{event}/report` | Lihat laporan event | Penyelenggara/Koordinator/Admin |
| `POST` | `/api/v1/events/{event}/report` | Buat draft laporan | Penyelenggara/Koordinator |
| `PATCH` | `/api/v1/events/{event}/report` | Update draft/revisi | Penyelenggara/Koordinator |
| `POST` | `/api/v1/events/{event}/report/photos` | Upload foto dokumentasi | Penyelenggara/Koordinator |
| `DELETE` | `/api/v1/events/{event}/report/photos/{photo}` | Hapus foto | Penyelenggara/Koordinator |
| `POST` | `/api/v1/events/{event}/report/submit` | Kirim laporan | Penyelenggara/Koordinator |
| `POST` | `/api/v1/events/{event}/report/review` | Approve/reject laporan | Penyelenggara/Admin |

### Response Format

```json
{
  "success": true,
  "message": "Laporan berhasil diambil.",
  "data": {
    "id": "uuid",
    "event_id": "uuid",
    "event_title": "Clean Beach Campaign",
    "submitted_by": "uuid",
    "submitter_name": "John Doe",
    "summary": "Kegiatan berjalan lancar...",
    "total_attendees": 25,
    "report_status": "draft",
    "rejection_reason": null,
    "photos": [
      {
        "id": "uuid",
        "report_id": "uuid",
        "image_url": "http://localhost/storage/event-documentations/.../photo.jpg",
        "created_at": "2026-06-26T10:00:00Z"
      }
    ],
    "submitted_at": null,
    "approved_at": null,
    "created_at": "2026-06-26T09:00:00Z",
    "updated_at": "2026-06-26T09:00:00Z"
  }
}
```

### Error Response (Validation)

```json
{
  "success": false,
  "message": "Minimal 1 foto dokumentasi wajib diunggah sebelum mengirim laporan."
}
```

### Error Handling

| Status Code | Skenario | Pesan |
|---|---|---|
| `400` | Submit tanpa foto | Minimal 1 foto dokumentasi wajib diunggah sebelum mengirim laporan. |
| `400` | Laporan sudah ada | Laporan untuk event ini sudah ada. |
| `400` | Event draft/cancelled | Event tidak dalam status yang memperbolehkan pembuatan laporan. |
| `400` | Duplicate submit | Laporan sudah pernah dikirim. |
| `400` | Review non-submitted | Laporan tidak dalam status yang dapat direview. |
| `400` | Foto > 5 | Maksimal 5 foto dokumentasi diperbolehkan. |
| `400` | Hapus foto di status submitted | Foto hanya dapat dihapus pada laporan draft atau revisi. |
| `404` | Report tidak ditemukan | Laporan tidak ditemukan. |
| `403` | Not authorized | Hanya penyelenggara/koordinator yang dapat mengelola laporan. |

---

## Database Design

### Table: `event_reports`

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| id | UUID (PK) | No | — | Primary key |
| event_id | UUID (FK) | No | — | Relasi ke events |
| submitted_by | UUID (FK) | No | — | Relasi ke users |
| summary | TEXT | Yes | null | Ringkasan kegiatan |
| total_attendees | INTEGER | Yes | null | Jumlah peserta |
| report_status | VARCHAR | No | 'draft' | draft/submitted/approved/revision_requested |
| rejection_reason | TEXT | Yes | null | Alasan revisi |
| submitted_at | TIMESTAMP | Yes | null | Waktu submit |
| approved_at | TIMESTAMP | Yes | null | Waktu approval |
| created_at | TIMESTAMP | No | — | Waktu dibuat |
| updated_at | TIMESTAMP | No | — | Waktu diupdate |

### Table: `event_documentations`

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| id | UUID (PK) | No | — | Primary key |
| report_id | UUID (FK) | No | — | Relasi ke event_reports (cascade) |
| image_path | VARCHAR | No | — | Path file foto |
| created_at | TIMESTAMP | No | — | Waktu upload |
| updated_at | TIMESTAMP | No | — | Waktu diupdate |

### Constraints

- `event_reports.event_id` → unique (one-to-one dengan events)
- `event_documentations.report_id` → FK cascade delete
- Report minimum 1 documentation photo
- Report maximum 5 documentation photos

---

## Service Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `createReport` | Event, User, array data | EventReport | Buat draft report, optional upload photos |
| `updateReport` | EventReport, array data | EventReport | Update summary/total_attendees, optional upload photos |
| `uploadPhotos` | EventReport, array photos | EventReport | Upload foto ke report draft/revisi, validasi max 5 |
| `deletePhoto` | EventReport, EventDocumentation | void | Hapus foto + file dari storage |
| `submitReport` | EventReport | EventReport | Validasi min 1 foto, ubah status ke submitted |
| `reviewReport` | EventReport, User, action, rejection_reason | EventReport | Approve (event→completed) atau request revision |
| `getEventReport` | Event | EventReport/null | Ambil report untuk event tertentu |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Event reports migration | ✅ Tabel `event_reports` — UUID PK, FK ke events/users, report_status, rejection_reason, timestamps |
| Event report photos migration | ✅ Tabel `event_documentations` — UUID PK, FK ke event_reports (cascade), image_path |
| Report submission API | ✅ POST `/events/{event}/report/submit` — validasi min 1 foto, ubah status ke submitted |
| Report review API | ✅ POST `/events/{event}/report/review` — action: approved / revision_requested |
| Report approval workflow | ✅ Approved → report status 'approved', event status 'completed' |
| Report rejection workflow | ✅ Revision Requested → report status 'revision_requested', rejection_reason disimpan |

---

## Build & Verification

| Check | Status |
|---|---|
| PHP Syntax (all 9 files) | ✅ Clean — 0 errors |
| Migration (pretend) | ✅ SQL generate sesuai desain |
| Migration (run) | ✅ 3 migrations berhasil — 2 tables + 1 alter |
| Route Registration | ✅ 7 report endpoints terdaftar |
| Database Tables | ✅ `event_reports` + `event_documentations` terbuat |

---

## Catatan Penting

- Report bersifat one-to-one dengan event — hanya satu report per event
- Report hanya dapat dibuat saat event berstatus `ongoing` atau `completed` (tidak draft/cancelled)
- Saat report di-approve, event status otomatis menjadi `completed`
- Foto disimpan di `storage/app/public/event-documentations/{report_id}/`
- Foto dihapus dari storage saat `deletePhoto` dipanggil
- `rejection_reason` hanya diisi saat action `revision_requested`
- Event tetap bisa diubah menjadi `completed` meskipun total_attendees belum diisi
- Authorization menggunakan 3 level: view (Penyelenggara/Koordinator/Admin), manage (Penyelenggara/Koordinator), review (Penyelenggara/Admin)

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, report dapat dibuat dan dikirim dengan validasi foto (min 1, max 5), penyelenggara dapat approve/reject laporan, approval workflow mengubah event status menjadi completed, rejection workflow menyimpan rejection_reason.
