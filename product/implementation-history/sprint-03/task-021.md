# TASK-021: Certificate Generation Backend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Certificate Generation Backend |
| **Owner** | Syarif |
| **Support Owner** | Irham |
| **Priority** | High |
| **Estimated Effort** | M |
| **Dependencies** | TASK-019 (Event Reporting Backend) |

---

## Objective

Mengimplementasikan pembuatan sertifikat digital otomatis untuk relawan yang telah berpartisipasi dalam kegiatan. Sertifikat dihasilkan secara otomatis setelah laporan kegiatan disetujui oleh penyelenggara dan event berstatus `completed`.

---

## Files Created

| File | Deskripsi |
|---|---|
| `database/migrations/2026_06_28_000001_create_certificates_table.php` | Membuat tabel `certificates` — id (uuid), volunteer_id, event_id, certificate_number (unique), pdf_path, issued_at |
| `app/Models/Certificate.php` | Model Certificate — relasi `volunteer()`, `event()`, fillable fields, casts datetime |
| `app/Services/CertificateService.php` | Service layer — generateCertificates, generateCertificate, generatePdf, download, getUserCertificates, getEventCertificates |
| `app/Http/Controllers/Api/V1/CertificateController.php` | Controller — 4 endpoints dengan authorization: index, show, download, eventCertificates |
| `app/Http/Resources/CertificateResource.php` | API Resource — format response sertifikat dengan pdf_url, volunteer_name, event_title, organization_name |
| `resources/views/certificates/template.blade.php` | Blade template PDF sertifikat — layout A4 landscape, border biru, header, nama relawan, judul event, organisasi, nomor sertifikat |

---

## Files Modified

| File | Perubahan |
|---|---|
| `composer.json` | Menambah dependency `barryvdh/laravel-dompdf` (v3.1.2) untuk PDF generation |
| `app/Models/Event.php` | Menambah method `certificates()` — hasMany(Certificate::class) |
| `app/Models/User.php` | Menambah method `certificates()` — hasMany(Certificate::class, 'volunteer_id') |
| `app/Services/EventReportService.php` | Inject `CertificateService` via constructor; panggil `$this->certificateService->generateCertificates()` saat report di-approve |
| `routes/api.php` | Menambah import `CertificateController` dan 4 route certificate endpoints |

---

## Feature Details

### 1. Certificate Lifecycle

```
Attendance Verified (present/late)
        ↓
Report Approved → Event Completed
        ↓
Certificates Generated (otomatis)
        ↓
Volunteer dapat melihat & mendownload PDF
```

**Trigger:**
- Certificate generation terjadi otomatis saat `EventReportService::reviewReport()` dipanggil dengan action `approved`
- Sistem mencari semua attendance dengan status `present` atau `late` pada event tersebut
- Setiap relawan mendapat satu sertifikat unik (dicegah duplikat)

### 2. Certificate Generation Flow

```
Report di-approve oleh Penyelenggara
        ↓
EventReportService::reviewReport()
    ├── Update report status → 'approved'
    ├── Update event status → 'completed'
    └── Panggil CertificateService::generateCertificates($event)
                ↓
Attendance::where('event_id', $event->id)
    ->whereIn('status', ['present', 'late'])
    ->get()
                ↓
Untuk setiap volunteer:
    ├── Cek duplikat (volunteer_id + event_id)
    ├── Generate nomor unik: CERT-YYYYMMDD-RANDOM6
    ├── Simpan record Certificate ke database
    └── Generate PDF & simpan ke storage
```

### 3. PDF Generation

- **Library:** `barryvdh/laravel-dompdf` (wrapper dompdf)
- **Layout:** A4 landscape
- **Template:** `resources/views/certificates/template.blade.php`
- **Storage:** `storage/app/public/certificates/{certificate_number}.pdf`
- **Konten PDF:**
  - Border biru (#1a365d)
  - Header "Sertifikat Partisipasi" / "Sertifikat Penghargaan"
  - Nama lengkap relawan (besar, biru #2b6cb0)
  - Judul event
  - Nama organisasi
  - Tanggal & lokasi event
  - Tanggal terbit
  - Nomor sertifikat unik

### 4. Certificate Number Format

```
CERT-20260628-A1B2C3
  │       │        │
  │       │        └── Random 6 karakter uppercase
  │       └── Tanggal (Ymd)
  └── Prefix tetap
```

- Dijamin unique dengan loop retry jika collision
- Format konsisten, mudah dibaca

### 5. Authorization Levels

| Level | Role yang Diizinkan | Endpoints |
|---|---|---|
| Own Certificate | Volunteer (pemilik) + Admin | `show`, `download` |
| Event Access | Penyelenggara, Koordinator Event, Admin | `eventCertificates` |
| All Certificates | Volunteer (hanya milik sendiri) | `index` |

---

## API Endpoints

| Method | Endpoint | Fungsi | Auth |
|---|---|---|---|
| `GET` | `/api/v1/certificates` | Daftar sertifikat volunteer yang login | Authenticated |
| `GET` | `/api/v1/certificates/{certificate}` | Detail sertifikat | Owner/Admin |
| `GET` | `/api/v1/certificates/{certificate}/download` | Download PDF sertifikat | Owner/Admin |
| `GET` | `/api/v1/events/{event}/certificates` | Daftar sertifikat per event | Penyelenggara/Koordinator/Admin |

### Response Format (List)

```json
{
  "success": true,
  "message": "Daftar sertifikat berhasil diambil.",
  "data": [
    {
      "id": "uuid",
      "volunteer_id": "uuid",
      "volunteer_name": "John Doe",
      "event_id": "uuid",
      "event_title": "Clean Beach Campaign",
      "event_date": "2026-07-15",
      "organization_name": "Komunitas Peduli Lingkungan",
      "certificate_number": "CERT-20260715-A1B2C3",
      "pdf_url": "http://localhost/storage/certificates/CERT-20260715-A1B2C3.pdf",
      "issued_at": "2026-07-16T10:00:00Z",
      "created_at": "2026-07-16T10:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 5,
    "last_page": 1
  }
}
```

### Response Format (Download)

- Content-Type: `application/pdf`
- Content-Disposition: attachment; filename="sertifikat-CERT-20260715-A1B2C3.pdf"

### Error Response

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke sertifikat ini."
}
```

### Error Handling

| Status Code | Skenario | Pesan |
|---|---|---|
| `403` | Akses sertifikat orang lain | Anda tidak memiliki akses ke sertifikat ini. |
| `404` | File PDF tidak ditemukan | File sertifikat tidak ditemukan. |

---

## Database Design

### Table: `certificates`

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| id | UUID (PK) | No | — | Primary key |
| volunteer_id | UUID (FK) | No | — | Relasi ke users (cascade) |
| event_id | UUID (FK) | No | — | Relasi ke events (cascade) |
| certificate_number | VARCHAR (unique) | No | — | Nomor sertifikat unik |
| pdf_path | VARCHAR | Yes | null | Path file PDF di storage |
| issued_at | TIMESTAMP | Yes | null | Waktu penerbitan |
| created_at | TIMESTAMP | No | — | Waktu dibuat |
| updated_at | TIMESTAMP | No | — | Waktu diupdate |

### Constraints

- `certificates.certificate_number` → unique
- `certificates(volunteer_id, event_id)` → unique (one certificate per volunteer per event)
- `volunteer_id` → FK ke users (cascade on delete)
- `event_id` → FK ke events (cascade on delete)

---

## Service Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `generateCertificates` | Event | void | Generate sertifikat untuk seluruh volunteer dengan attendance present/late |
| `generateCertificate` | Event, User | Certificate | Generate satu sertifikat untuk volunteer tertentu |
| `generatePdf` | Certificate | string (path) | Generate file PDF dari Blade template, simpan ke storage |
| `getUserCertificates` | User, array filters | Paginator | Daftar sertifikat milik volunteer (dengan pagination) |
| `getEventCertificates` | Event, array filters | Paginator | Daftar sertifikat untuk event tertentu (dengan pagination) |
| `getCertificate` | string id | Certificate/null | Ambil detail sertifikat dengan relasi |
| `download` | Certificate | string (file path) | Ambil path file PDF untuk response download |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Certificate migration | ✅ Tabel `certificates` — UUID PK, FK ke users/events (cascade), certificate_number (unique), pdf_path, issued_at |
| Certificate generation service | ✅ `CertificateService` — generate otomatis saat report approved, cegah duplikat per volunteer+event |
| PDF generation service | ✅ Dompdf + Blade template A4 landscape — nama volunteer, event, organisasi, nomor unik |
| Certificate storage | ✅ PDF disimpan di `storage/app/public/certificates/{number}.pdf`, diakses via URL |
| Certificate download API | ✅ GET `/certificates/{id}/download` — response PDF file download |

---

## Build & Verification

| Check | Status |
|---|---|
| Dependency Installation | ✅ `barryvdh/laravel-dompdf` v3.1.2 terinstall — 7 packages |
| PHP Syntax (all 6 files) | ✅ Clean — 0 errors |
| Migration (run) | ✅ Tabel `certificates` berhasil dibuat |
| Route Registration | ✅ 4 certificate endpoints terdaftar |
| Database Table | ✅ `certificates` terbuat dengan struktur sesuai desain |
| Existing Tests | ✅ 97 tests passed — 0 regressions |

---

## Catatan Penting

- Certificate generation bersifat **otomatis** — tidak ada endpoint manual generate
- Sertifikat hanya dibuat untuk volunteer dengan attendance status **present** atau **late**
- Satu volunteer hanya mendapat **satu sertifikat** per event (dicegah oleh unique constraint + pengecekan di service)
- PDF disimpan di `storage/app/public/certificates/` dan diakses via `asset('storage/' . $path)`
- Download menggunakan `response()->download()` dengan filename `sertifikat-{nomor}.pdf`
- Nomor sertifikat menggunakan format `CERT-YYYYMMDD-RANDOM6` dengan uniqueness guarantee
- Authorization: volunteer hanya bisa akses sertifikat milik sendiri; organizer/coordinator bisa lihat daftar per event
- Library PDF: menggunakan `barryvdh/laravel-dompdf` yang merupakan wrapper Laravel untuk `dompdf/dompdf`

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi: sertifikat dibuat otomatis setelah report di-approve (event completed), PDF dapat dihasilkan dengan template yang informatif, data sertifikat tersimpan di database, volunteer dapat melihat dan mendownload sertifikat melalui API.
