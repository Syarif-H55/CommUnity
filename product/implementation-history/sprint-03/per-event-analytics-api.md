# Per-Event Data API (Backend Enhancement)

## Informasi Task

| Atribut | Detail |
|---|---|
| **Task** | TASK-024A |
| **Title** | Analytics Dashboard — Per-Event Data API (Backend Enhancement) |
| **Owner** | Syarif |
| **Support Owner** | Irham |
| **Priority** | Medium |
| **Estimated Effort** | S |
| **Dependencies** | TASK-023 |

---

## Objective

Menyediakan endpoint API untuk data per-event yang sudah selesai beserta attendance breakdown, sehingga frontend dapat menampilkan visualisasi detail untuk setiap event.

---

## Files Created

### Backend

| File | Deskripsi |
|---|---|
| `app/Http/Controllers/Api/V1/OrganizationPerEventAnalyticsController.php` | Invokable controller — `GET /organizations/{organization}/analytics/events` dengan authorisasi organizer/coordinator |
| `tests/Feature/Analytics/PerEventAnalyticsTest.php` | 7 test cases (52 assertions) — akses, akurasi data, filtering, ordering, autentikasi |

---

## Files Modified

### Backend (2)

| File | Perubahan |
|---|---|
| `app/Services/AnalyticsService.php` | Tambah `getPerEventAnalytics()` method; tambah `average_volunteers_per_event` ke `getOrganizationAnalytics()` response |
| `routes/api.php` | Tambah import `OrganizationPerEventAnalyticsController`; tambah route `GET /organizations/{organization}/analytics/events` |

---

## Implementation Details

### 1. New Controller — `OrganizationPerEventAnalyticsController`

```php
class OrganizationPerEventAnalyticsController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly AnalyticsService $analyticsService
    ) {}

    public function __invoke(Organization $organization): JsonResponse
    {
        $this->authorizeOrganizerOrCoordinatorOf($organization);
        $events = $this->analyticsService->getPerEventAnalytics($organization);
        return $this->success($events, 'Data per-event analytics berhasil diambil.');
    }
}
```

### 2. New Service Method — `getPerEventAnalytics()`

Mengambil semua event completed milik organisasi dengan eager load `report`, `registrations`, `attendances`, lalu memetakan per-event:

| Field | Sumber |
|---|---|
| `id` | `event.id` |
| `title` | `event.title` |
| `event_date` | `event.event_date` (format Y-m-d) |
| `total_registrations` | `registrations->count()` |
| `total_present` | `attendances->where('status','present')->count()` |
| `total_late` | `attendances->where('status','late')->count()` |
| `total_absent` | `attendances->where('status','absent')->count()` |
| `attendance_rate` | `(present+late) / total_attendance * 100` |
| `report_status` | `event->report->report_status` (nullable) |

### 3. Aggregate Metrics Refresh

`getOrganizationAnalytics()` return ditambah field baru:

```php
'average_volunteers_per_event' => $totalEvents > 0
    ? round($totalVolunteers / $totalEvents, 2)
    : 0
```

### 4. New Route

```
GET /api/v1/organizations/{organization}/analytics/events
```

Ditempatkan setelah route analytics eksisting, di dalam grup middleware `auth:sanctum`.

---

## Acceptance Criteria

| AC | Implementasi |
|---|---|
| ✅ Endpoint mengembalikan daftar event selesai milik organisasi dengan attendance breakdown | `getPerEventAnalytics()` — filter `status = 'completed'`, eager load relations |
| ✅ Attendance breakdown akurat per status (present, late, absent) | Hitung via koleksi `attendances->where('status', ...)` |
| ✅ Response cepat — query realtime tanpa agregasi terpisah | Single query with eager load (`with()`) |
| ✅ `average_volunteers_per_event` tersedia di endpoint analytics eksisting | Ditambahkan ke response `getOrganizationAnalytics()` |

---

## Test Results

**7 test cases, 52 assertions — semua PASS:**

| Test | Assertions |
|---|---|
| `organizer_can_view_per_event_analytics` | Response 200 + struktur JSON valid |
| `coordinator_can_view_per_event_analytics` | Response 200 |
| `volunteer_cannot_view_per_event_analytics` | Response 403 |
| `only_completed_events_are_returned` | Hanya 2 event completed, draft event tidak muncul |
| `per_event_attendance_breakdown_is_accurate` | Event 1: 3 reg, 2 present, 1 late, 0 absent, rate 100%; Event 2: 2 reg, 1 present, 0 late, 1 absent, rate 50% |
| `events_are_ordered_by_date_descending` | Tanam Pohon (lebih baru) sebelum Bersih Pantai |
| `unauthenticated_user_cannot_access_per_event_analytics` | Response 401 |

### Full Test Suite

```
Tests:    105 passed (413 assertions)
Duration: 7.67s
```

Tidak ada regresi. Seluruh 105 test pass (termasuk 7 test baru + 98 test eksisting).

---

## Response Format

### Request

```
GET /api/v1/organizations/{organization}/analytics/events
Authorization: Bearer {token}
```

### Response (200)

```json
{
  "success": true,
  "message": "Data per-event analytics berhasil diambil.",
  "data": [
    {
      "id": "uuid-event-2",
      "title": "Tanam Pohon",
      "event_date": "2026-06-26",
      "total_registrations": 2,
      "total_present": 1,
      "total_late": 0,
      "total_absent": 1,
      "attendance_rate": 50.0,
      "report_status": null
    },
    {
      "id": "uuid-event-1",
      "title": "Bersih Pantai",
      "event_date": "2026-06-21",
      "total_registrations": 3,
      "total_present": 2,
      "total_late": 1,
      "total_absent": 0,
      "attendance_rate": 100.0,
      "report_status": "approved"
    }
  ]
}
```

### Updated Analytics Response — `GET /organizations/{organization}/analytics`

```json
{
  "success": true,
  "message": "Data analytics berhasil diambil.",
  "data": {
    "total_events": 3,
    "total_volunteers": 5,
    "completed_events": 2,
    "attendance_rate": 80.0,
    "average_volunteers_per_event": 1.67
  }
}
```

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi:

| Lingkup | Total AC | Status |
|---|---|---|
| Per-Event API Endpoint | 2 | ✅ |
| Aggregate Metrics Refresh | 1 | ✅ |
| Feature Tests | 7 tests / 52 assertions | ✅ |
| **Total** | **10** | **✅ 10/10** |

Build: **Backend 105 tests ✅ | Zero regressions ✅**
