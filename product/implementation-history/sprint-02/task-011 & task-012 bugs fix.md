# TASK-011 & TASK-012: Bug Fix — Field Name Mismatch Integration

## Tanggal
2026-06-22

## Penulis
AI Debugging Assistant

---

## Bug Description

Event tidak dapat dibuat (`POST /api/v1/events`) karena **mismatch field name** antara frontend (TASK-012) dan backend (TASK-011). Frontend mengirim nama field yang berbeda dari yang diekspektasikan backend, menyebabkan **semua validasi backend gagal**.

---

## Root Cause

Frontend `event.service.ts` dan `EventForm.tsx` menggunakan field names yang tidak sesuai dengan backend API contract:

| Frontend Kirim | Backend Harapkan | Akibat |
|---|---|---|
| `category` | `category_id` | ❌ Validasi `exists:event_categories` gagal |
| `date` | `event_date` | ❌ Validasi `after_or_equal:today` gagal |
| `time` | `start_time` + `end_time` | ❌ Backend butuh 2 field, frontend kirim 1 |
| `location` | `location_name` | ❌ Field tidak dikenal |
| `max_participants` | `quota` | ❌ Field tidak dikenal |
| `banner` | Tidak ada kolom di DB | ❌ Tidak bisa disimpan |

### Akar Masalah
- TASK-011 (backend) dan TASK-012 (frontend) dikerjakan secara paralel tanpa koordinasi API contract
- Tipe `Event`, `CreateEventRequest`, `UpdateEventRequest` di `types/index.ts` tidak mencerminkan response dari `EventResource` backend
- Field `banner` tidak ada di tabel `events` (tidak termasuk dalam migration TASK-011)

---

## Files Modified

### Backend (6 files)

| File | Perubahan |
|---|---|
| `database/migrations/2026_06_22_000001_add_banner_to_events_table.php` | **New** — Menambah kolom `banner` (nullable string) ke tabel `events` |
| `app/Models/Event.php` | Menambah `banner` ke `$fillable` |
| `app/Services/EventService.php` | Handle upload banner di `create()` (store ke `events/banners`), handle update & hapus banner lama |
| `app/Http/Resources/EventResource.php` | Menambah field `banner_url` (generate URL dari stored path) dan `current_participants` (default 0) |
| `app/Http/Requests/Event/StoreEventRequest.php` | Menambah validasi `banner: nullable, image, mimes:jpg/jpeg/png/webp, max:5120` |
| `app/Http/Requests/Event/UpdateEventRequest.php` | Menambah validasi `banner` dengan aturan yang sama |

### Frontend (7 files)

| File | Perubahan |
|---|---|
| `src/types/index.ts` | `Event`, `CreateEventRequest`, `UpdateEventRequest` — seluruh field names diselaraskan dengan backend API (`category_id`, `event_date`, `start_time`, `end_time`, `location_name`, `quota`, `banner`) |
| `src/services/event.service.ts` | `create()` dan `update()` kini mengirim field names yang benar sesuai backend |
| `src/components/event/EventForm.tsx` | Form menggunakan field names backend: `category_id` (pilih dari 5 kategori by ID), `event_date`, `start_time` + `end_time` (terpisah), `location_name`, `quota`; validasi client-side disesuaikan; initialData untuk edit mode diperbaiki |
| `src/app/events/page.tsx` | References properti diubah: `event.date`→`event.event_date`, `event.time`→`event.start_time`, `event.location`→`event.location_name`, `event.category`→`event.category_name` |
| `src/app/events/[id]/page.tsx` | References properti diubah: `event.date`→`event.event_date`, `event.time`→`event.start_time - end_time`, `event.location`→`event.location_name`, `event.category`→`event.category_name`, `event.max_participants`→`event.quota`; hapus `published_at` (belum ada di backend) |
| `src/app/events/[id]/edit/page.tsx` | `initialData` menggunakan field names backend; handle null coalescing untuk nullable fields |
| `src/components/event/EventCard.tsx` | References properti diubah: `event.date`→`event.event_date`, `event.time`→`event.start_time`, `event.location`→`event.location_name`, `event.category`→`event.category_name`, `event.max_participants`→`event.quota`; kategory icons diselaraskan dengan 5 kategori database (Lingkungan, Pendidikan, Kesehatan, Sosial, Kemanusiaan) |

---

## Alur Data yang Sudah Diperbaiki

### Create Event (sekarang benar)

```
User → EventForm (category_id, title, description, event_date, start_time, end_time, location_name, quota, banner)
    → eventService.create (FormData with correct field names)
        → POST /api/v1/events
            → StoreEventRequest validasi sukses
            → EventService::create (banner stored, status='draft')
            → EventResource response
    → onSuccess: redirect /events/{id}
```

### Response EventResource (backend → frontend)

```json
{
    "id": "uuid",
    "title": "string",
    "description": "string|null",
    "category_id": 1,
    "category_name": "Lingkungan",
    "event_date": "2026-07-15",
    "start_time": "08:00",
    "end_time": "12:00",
    "location_name": "Jl. Merdeka No. 10",
    "quota": 100,
    "banner_url": "http://localhost:8000/storage/events/banners/xxx.jpg",
    "status": "draft",
    "current_participants": 0,
    ...
}
```

---

## Verification

| Check | Status |
|---|---|
| Backend migration | ✅ `add_banner_to_events_table` sukses |
| Backend Event tests (20) | ✅ All passed (no regression) |
| Frontend TypeScript | ✅ `tsc --noEmit` — 0 errors |
| Frontend build | ✅ `next build` — compiled successfully, 14 routes |
| Frontend routes | ✅ `/events`, `/events/create`, `/events/[id]`, `/events/[id]/edit` |

---

## Lessons Learned

1. **API Contract harus disepakati sebelum frontend & backend dikerjakan paralel** — idealnya backend selesai dulu, baru frontend mengacu pada response aktual
2. **Gunakan type sharing** — pertimbangkan openapi/swagger spec atau shared types antara frontend & backend
3. **Field `banner` harus di-include di migration awal** — jangan sampai frontend mengirim data yang tidak bisa disimpan
4. **Verifikasi integrasi lebih awal** — setelah TASK-011 selesai, frontend harus langsung di-test dengan backend aktual, bukan dengan mock/static data
