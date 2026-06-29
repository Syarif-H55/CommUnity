# TASK-023: Analytics Dashboard Backend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Analytics Dashboard Backend |
| **Owner** | Syarif |
| **Support Owner** | Irham |
| **Priority** | High |
| **Estimated Effort** | M |
| **Dependencies** | TASK-021 (Certificate Generation Backend) |

---

## Objective

Menyediakan data analytics untuk dashboard organisasi — meliputi total events, total volunteers, completed events, dan attendance rate. Analytics dihitung secara realtime dari data operasional tanpa menggunakan data warehouse atau tabel agregasi khusus.

---

## Files Created

| File | Deskripsi |
|---|---|
| `app/Services/AnalyticsService.php` | Service layer — `getOrganizationAnalytics`, `getTotalEvents`, `getTotalVolunteers`, `getCompletedEvents`, `getAttendanceRate` |
| `app/Http/Controllers/Api/V1/OrganizationAnalyticsController.php` | Controller — single `__invoke(Organization)` method dengan authorization |

---

## Files Modified

| File | Perubahan |
|---|---|
| `routes/api.php` | Menambah import `OrganizationAnalyticsController` dan route `GET /api/v1/organizations/{organization}/analytics` |
| `frontend/src/services/organization.service.ts` | Menambah method `getAnalytics(organizationId)` — import `AnalyticsData` type |

---

## Feature Details

### 1. Architecture & Design

Analytics dihitung secara **realtime** menggunakan query langsung ke database operasional (sesuai arsitektur yang ditentukan di `architecture.md`). Tidak ada tabel agregasi, caching, atau data warehouse pada MVP.

**Data Sources:**

| Metric | Source Table | Approach |
|---|---|---|
| Total Events | `events` | `COUNT` where `organization_id` = given org |
| Total Volunteers | `volunteer_registrations` + `events` | `DISTINCT COUNT` of `volunteer_id` joined via `events` |
| Completed Events | `events` | `COUNT` where `organization_id` = given org AND `status` = 'completed' |
| Attendance Rate | `attendances` + `events` | `(present + late) / total * 100` joined via `events` |

### 2. API Endpoint

| Method | Endpoint | Fungsi | Auth |
|---|---|---|---|
| `GET` | `/api/v1/organizations/{organization}/analytics` | Mendapatkan data analytics organisasi | Penyelenggara/Koordinator/Admin |

### 3. Authorization

Menggunakan `AuthorizesOrganizationAccess` trait — method `authorizeOrganizerOrCoordinatorOf($organization)`:
- **Penyelenggara** organisasi → diizinkan
- **Koordinator Event** organisasi → diizinkan
- **Admin Sistem** → diizinkan (bypass via `$user->is_admin`)
- **Relawan** atau user tanpa akses → 403 Forbidden

### 4. Response Format

```json
{
  "success": true,
  "message": "Data analytics berhasil diambil.",
  "data": {
    "total_events": 12,
    "total_volunteers": 45,
    "completed_events": 5,
    "attendance_rate": 87.5
  }
}
```

### 5. Metrics Detail

#### Total Events
- Menghitung seluruh event milik organisasi (termasuk draft, published, ongoing, cancelled, completed)
- Query: `Event::where('organization_id', $org->id)->count()`
- Tidak memfilter status — semua event dihitung

#### Total Volunteers
- Menghitung jumlah **unique volunteer** yang pernah mendaftar ke event apapun milik organisasi
- Query menggunakan `distinct('volunteer_id')` pada join `volunteer_registrations` → `events`
- Satu volunteer yang mendaftar ke beberapa event tetap dihitung satu kali

#### Completed Events
- Menghitung event dengan status `completed`
- Query: `Event::where('organization_id', $org->id)->where('status', 'completed')->count()`

#### Attendance Rate
- Menghitung persentase kehadiran dari seluruh record attendance event milik organisasi
- Formula: `(present_count + late_count) / total_attendance_count * 100`
- `present` + `late` dianggap hadir; `absent` dianggap tidak hadir
- Jika belum ada attendance record, mengembalikan `0.0`
- Hasil dibulatkan ke 2 desimal

### 6. AnalyticsService Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `getOrganizationAnalytics` | Organization | array | Mengembalikan seluruh 4 metric dalam satu array |
| `getTotalEvents` | Organization | int | Jumlah total event organisasi |
| `getTotalVolunteers` | Organization | int | Jumlah unique volunteer yang mendaftar ke event organisasi |
| `getCompletedEvents` | Organization | int | Jumlah event berstatus completed |
| `getAttendanceRate` | Organization | float | Persentase kehadiran (0.00 - 100.00) |

### 7. Frontend Integration

**Type** (sudah ada di `types/index.ts`):
```typescript
export interface AnalyticsData {
    total_events: number;
    total_volunteers: number;
    completed_events: number;
    attendance_rate: number;
}
```

**Service** (ditambah di `organization.service.ts`):
```typescript
getAnalytics: (organizationId: string) =>
    api.get<ApiResponse<AnalyticsData>>(`/organizations/${organizationId}/analytics`),
```

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Analytics service | ✅ `AnalyticsService` — 5 method untuk menghitung 4 metrics secara realtime |
| Event count query | ✅ `getTotalEvents()` — COUNT dengan filter organization_id |
| Volunteer count query | ✅ `getTotalVolunteers()` — DISTINCT COUNT join volunteer_registrations + events |
| Completed event query | ✅ `getCompletedEvents()` — COUNT dengan filter status = 'completed' |
| Attendance rate calculation | ✅ `getAttendanceRate()` — persentase (present+late) / total attendance |
| Analytics API | ✅ `GET /api/v1/organizations/{organization}/analytics` — response standar `{success, message, data}` |

---

## Build & Verification

| Check | Status |
|---|---|
| PHP Syntax (AnalyticsService) | ✅ Clean — 0 errors |
| PHP Syntax (OrganizationAnalyticsController) | ✅ Clean — 0 errors |
| Route Registration | ✅ `GET|HEAD api/v1/organizations/{organization}/analytics` terdaftar |
| Existing Tests | ✅ 94 passed — 0 regressions (3 pre-existing profile photo failures unrelated) |

---

## Catatan Penting

- Analytics dihitung **realtime** — setiap request akan menjalankan query ke database, sesuai dengan arsitektur MVP yang tidak menggunakan data warehouse atau tabel agregasi
- Endpoint berada di dalam grup `auth:sanctum` — memerlukan token autentikasi
- Authorization menggunakan `authorizeOrganizerOrCoordinatorOf` — hanya Penyelenggara, Koordinator Event, dan Admin yang dapat mengakses
- Organisasi diakses melalui route model binding Laravel — otomatis 404 jika tidak ditemukan
- Attendance rate mengembalikan `0.0` jika belum ada attendance record (mencegah division by zero)
- TASK-023 merupakan backend untuk US-021 (View Community Analytics); frontend dashboard akan diimplementasikan di TASK-024

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi: semua metrik tersedia (total_events, total_volunteers, completed_events, attendance_rate), data dihitung akurat dari database operasional via query realtime, response cepat dengan format API yang konsisten.
