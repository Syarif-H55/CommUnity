# TASK-014: Volunteer Registration Backend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Volunteer Registration Backend |
| **Owner** | Syarif |
| **Support Owner** | Irham |
| **Priority** | High |
| **Estimated Effort** | M |
| **Dependencies** | TASK-011 (Event Module Backend) |

---

## Objective

Mengimplementasikan fitur pendaftaran relawan — meliputi volunteer registration API, participation records, duplicate registration prevention, dan participation history API.

---

## Files Created

| File | Deskripsi |
|---|---|
| `database/migrations/2026_06_22_000002_create_volunteer_registrations_table.php` | Migrasi tabel `volunteer_registrations` — UUID primary key, FK ke events & users, unique constraint (event_id + volunteer_id), indexed |
| `app/Models/VolunteerRegistration.php` | Model VolunteerRegistration — fillable (event_id, volunteer_id, registered_at), relasi event() & volunteer() |
| `app/Services/VolunteerRegistrationService.php` | Service layer — `register()` validasi published/duplicate/quota, `getUserRegistrations()` dengan filter status |
| `app/Http/Requests/VolunteerRegistration/StoreVolunteerRegistrationRequest.php` | Form Request untuk validasi registrasi |
| `app/Http/Resources/VolunteerRegistrationResource.php` | API Resource — expose id, event_id, volunteer_id, event (loaded), registered_at |
| `app/Http/Controllers/Api/V1/VolunteerRegistrationController.php` | Controller — `register()` (POST) dan `myRegistrations()` (GET) |
| `tests/Feature/VolunteerRegistration/VolunteerRegistrationTest.php` | 9 feature tests mencakup semua acceptance criteria |

## Files Modified

| File | Perubahan |
|---|---|
| `app/Models/Event.php` | Menambah relasi `registrations()` (hasMany) dan `participants()` (belongsToMany via volunteer_registrations) |
| `app/Models/User.php` | Menambah relasi `registrations()` (hasMany) dan `registeredEvents()` (belongsToMany via volunteer_registrations) |
| `app/Http/Resources/EventResource.php` | `current_participants` diubah dari hardcoded 0 menjadi dinamis berdasarkan `registrations_count` atau loaded registrations count |
| `routes/api.php` | Menambah import `VolunteerRegistrationController` dan 2 endpoint baru |

---

## API Endpoints

### 1. Register for Event

```http
POST /api/v1/events/{event}/register
Authorization: Bearer {token}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Pendaftaran event berhasil.",
  "data": {
    "id": "uuid",
    "event_id": "uuid",
    "volunteer_id": "uuid",
    "event": { ... },
    "registered_at": "2026-06-22T18:00:00Z",
    "created_at": "2026-06-22T18:00:00Z"
  }
}
```

**Error Responses:**
- `409` — Event belum dipublikasikan / Sudah mendaftar / Kuota penuh
- `401` — Tidak terautentikasi
- `404` — Event tidak ditemukan

### 2. View Registration History

```http
GET /api/v1/my-registrations?status=published&per_page=10
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Riwayat partisipasi berhasil diambil.",
  "data": [ ... ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 5,
    "last_page": 1
  }
}
```

### Query Parameters Supported

| Parameter | Type | Contoh | Deskripsi |
|---|---|---|---|
| `status` | string | `"completed"` | Filter by event status |
| `per_page` | number | `10` | Items per page (default: 10) |

---

## Business Logic

### Registration Flow

```
Volunteer (authenticated)
       ↓
Event exists & is published?  → 409 "Hanya event yang sudah dipublikasikan..."
       ↓
Already registered?           → 409 "Anda sudah mendaftar pada event ini."
       ↓
Quota available?              → 409 "Kuota peserta event sudah penuh."
       ↓
Registration Created (201)
```

### Rules

- ✅ Hanya event **published** yang bisa diikuti
- ✅ Duplikasi dicegah via **unique constraint** (event_id, volunteer_id) + **explicit check** di service
- ✅ Kuota dicek sebelum registrasi berhasil
- ✅ Pendaftaran langsung **auto-approved** (sesuai AI Execution Notes)
- ✅ Riwayat partisipasi **scoped per user** — hanya milik sendiri

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Relawan dapat mendaftar | ✅ | `POST /events/{event}/register` — validasi published + quota + duplicate |
| Duplikasi dicegah | ✅ | Unique constraint DB + check di service layer |
| Riwayat partisipasi tersedia | ✅ | `GET /my-registrations` — paginated, filterable by event status |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Volunteer registration API | ✅ `POST /api/v1/events/{event}/register` — authenticated, validasi published + duplicate + quota |
| Participation records | ✅ Tersimpan di tabel `volunteer_registrations` dengan registered_at timestamp |
| Duplicate registration prevention | ✅ Migrasi memiliki unique constraint + service melakukan pengecekan eksplisit |
| Participation history API | ✅ `GET /api/v1/my-registrations` — pagination + filter by event status |

---

## Test Coverage

| Test | Status |
|---|---|
| Volunteer can register for published event | ✅ |
| Volunteer cannot register twice for same event | ✅ |
| Volunteer cannot register for draft event | ✅ |
| Unauthenticated user cannot register | ✅ |
| Cannot register for nonexistent event | ✅ |
| Cannot register when quota is full | ✅ |
| Volunteer can view registration history | ✅ |
| Registration history is scoped to own user | ✅ |
| Can filter registration history by event status | ✅ |

---

## Build & Test Results

| Check | Status |
|---|---|
| PHPUnit (all tests) | ✅ — 65 passed (256 assertions) |
| New tests | ✅ — 9 passed (47 assertions) |
| Regression | ✅ — 0 failures on existing tests |

---

## Catatan Penting

- Endpoint registrasi **wajib autentikasi** — hanya volunteer yang sudah login bisa mendaftar
- Event harus berstatus **published** untuk bisa diikuti
- **Auto-approved** — setelah registrasi berhasil, volunteer langsung terdaftar tanpa perlu persetujuan
- Kuota dihitung dari jumlah registrasi yang ada, bukan dari field counter terpisah
- History hanya menampilkan data milik user yang terautentikasi
- Relasi `participants()` dan `registrations()` ditambahkan ke Event & User model untuk memudahkan query lanjutan di TASK-015

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, 9 test cases passed, 0 regresi, semua endpoint registrasi dan history partisipasi telah terimplementasi dengan duplicate prevention, quota checking, dan pagination.

---

## Navigation Updates

### New API Routes:
1. `POST /api/v1/events/{event}/register` — **AUTHENTICATED** — mendaftar sebagai relawan pada event
2. `GET /api/v1/my-registrations` — **AUTHENTICATED** — melihat riwayat partisipasi sendiri
