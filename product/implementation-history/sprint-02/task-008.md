# TASK-008: Organization Module Backend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Organization Module Backend |
| **Owner** | Syarif |
| **Support Owner** | Irham |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | Sprint 01 completed |

---

## Objective

Mengimplementasikan backend untuk pendaftaran dan verifikasi organisasi.

---

## Files Created

| File | Deskripsi |
|---|---|
| `database/migrations/2026_06_19_000001_add_is_admin_to_users_table.php` | Menambah kolom `is_admin` boolean ke tabel users |
| `database/migrations/2026_06_19_000002_create_organizations_table.php` | Tabel organisasi: name, organization_email, description, logo, verification_document, verification_status, rejection_reason, verified_at, soft deletes |
| `database/migrations/2026_06_19_000003_create_organization_memberships_table.php` | Tabel pivot user ↔ organization dengan role (Penyelenggara/Koordinator Event) |
| `app/Models/Organization.php` | Model Organization dengan fillable, casts, relasi members() dan penyelenggara() |
| `app/Services/OrganizationService.php` | Service layer: register(), update(), uploadDocument(), verify() |
| `app/Http/Requests/Organization/StoreOrganizationRequest.php` | Validasi: name required, organization_email unique |
| `app/Http/Requests/Organization/UpdateOrganizationRequest.php` | Validasi update dengan Rule::unique ignore current |
| `app/Http/Requests/Organization/UploadDocumentRequest.php` | Validasi file: PDF/JPG/JPEG/PNG, max 5MB |
| `app/Http/Requests/Admin/VerifyOrganizationRequest.php` | Validasi: status in:approved,rejected, authorize by is_admin |
| `app/Http/Resources/OrganizationResource.php` | Transformasi response dengan snake_case, asset URL untuk logo, whenCounted members |
| `app/Http/Controllers/Api/V1/OrganizationController.php` | CRUD + uploadDocument: index, store, show, update, destroy |
| `app/Http/Controllers/Api/V1/Admin/OrganizationVerificationController.php` | verify endpoint untuk admin approve/reject |

## Files Modified

| File | Perubahan |
|---|---|
| `app/Models/User.php` | Menambah `is_admin` ke fillable & casts, relasi `organizations()` many-to-many |
| `routes/api.php` | Menambah routes organization + admin verify |

---

## API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/organizations` | Sanctum | List organisasi (paginated) |
| POST | `/api/v1/organizations` | Sanctum | Register organisasi baru |
| GET | `/api/v1/organizations/{organization}` | Sanctum | Detail organisasi |
| PATCH | `/api/v1/organizations/{organization}` | Sanctum | Update organisasi |
| DELETE | `/api/v1/organizations/{organization}` | Sanctum | Soft delete organisasi |
| POST | `/api/v1/organizations/{organization}/upload-document` | Sanctum | Upload dokumen verifikasi |
| PATCH | `/api/v1/admin/organizations/{organization}/verify` | Sanctum + is_admin | Approve/reject organisasi |

---

## Arsitektur & Alur Data

### Alur Registrasi Organisasi

```
User → POST /api/v1/organizations
        → StoreOrganizationRequest (validasi)
        → OrganizationController@store
        → OrganizationService::register()
            → Organization::create({ verification_status: 'pending' })
            → OrganizationMembership::create({ user, role: 'Penyelenggara' })
        → OrganizationResource (response)
```

### Alur Verifikasi Admin

```
Admin → PATCH /api/v1/admin/organizations/{id}/verify
        → VerifyOrganizationRequest (authorize: is_admin, validasi status)
        → OrganizationVerificationController@verify
        → OrganizationService::verify()
            → update verification_status, verified_at, rejection_reason
        → OrganizationResource (response)
```

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Organisasi dapat didaftarkan | ✅ | `POST /api/v1/organizations` — auto-set status `pending`, creator jadi Penyelenggara |
| Dokumen verifikasi dapat diunggah | ✅ | `POST .../upload-document` — validasi format (PDF/JPG/JPEG/PNG) max 5MB, simpan ke storage |
| Status organisasi tersimpan | ✅ | `verification_status` di tabel organizations: pending → approved/rejected |
| Admin dapat approve atau reject | ✅ | `PATCH .../admin/organizations/{id}/verify` — hanya user is_admin, dengan rejection_reason opsional |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Create organizations migration | ✅ `create_organizations_table` + `add_is_admin_to_users_table` |
| Create organization documents migration | ✅ Included in `create_organizations_table` (verification_document column) |
| Create organization models | ✅ Organization model with relationships |
| Create organization API endpoints | ✅ Full CRUD + upload document |
| Create verification workflow | ✅ OrganizationService::verify() + Admin controller + request authorization |
| Implement organization status management | ✅ Status lifecycle: pending → approved/rejected |

---

## Database Schema

### Organizations Table

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR(255) | Required |
| organization_email | VARCHAR(255) | Nullable, unique |
| description | TEXT | Nullable |
| logo | VARCHAR(255) | Nullable, path to file |
| verification_document | VARCHAR(255) | Nullable, path to file |
| verification_status | VARCHAR(255) | Default: 'pending' |
| rejection_reason | TEXT | Nullable |
| verified_at | TIMESTAMP | Nullable, set when approved |
| deleted_at | TIMESTAMP | Soft delete |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Organization Memberships Table

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| organization_id | UUID | FK → organizations.id |
| role | VARCHAR(255) | Default: 'Penyelenggara' |
| joined_at | TIMESTAMP | Required |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Unique constraint: (user_id, organization_id)

---

## Verification

| Check | Status |
|---|---|
| Migrations run | ✅ 3 migrations sukses |
| Existing tests (24) pass | ✅ No regression |
| Routes registered | ✅ 16 routes total |
| PHP syntax | ✅ All files compile |

```
  PASS  Tests\Unit\ExampleTest
  PASS  Tests\Feature\Auth\AuthTest (13 tests)
  PASS  Tests\Feature\ExampleTest
  PASS  Tests\Feature\Profile\ProfileTest (8 tests)
  Tests:    24 passed (77 assertions)
```

---

## Catatan Penting

- Registrasi organisasi otomatis menambahkan user pendaftar sebagai anggota dengan role `Penyelenggara`
- Hanya user dengan `is_admin = true` yang dapat mengakses endpoint verifikasi
- Dokumen verifikasi disimpan di `storage/app/public/verification-documents/`
- Organisasi yang di-`rejected` tetap ada di database (soft delete tidak aktif untuk rejected)
- Status verifikasi menggunakan string, bukan ENUM, untuk fleksibilitas

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, semua file terimplementasi, migrasi berjalan, dan tidak ada regresi pada test yang ada.
