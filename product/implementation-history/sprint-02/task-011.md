# TASK-011: Event Module Backend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Event Module Backend |
| **Owner** | Syarif |
| **Support Owner** | Irham |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | TASK-008 |

---

## Objective

Mengimplementasikan backend event management.

---

## Files Created

| File | Deskripsi |
|---|---|
| `database/migrations/2026_06_21_000001_create_event_categories_table.php` | Tabel master kategori event: id, name |
| `database/migrations/2026_06_21_000002_create_events_table.php` | Tabel events: UUID PK, organization_id, coordinator_id, category_id, title, description, lokasi, quota, waktu, status, soft deletes + indexes |
| `app/Models/EventCategory.php` | Model EventCategory dengan fillable name |
| `app/Models/Event.php` | Model Event dengan HasUuids, SoftDeletes, casts (date/time), relasi organization(), coordinator(), category() |
| `app/Services/EventService.php` | Service layer: list (filter/search/sort/paginate), create (dengan validasi org terverifikasi), update (cegah completed), publish, find, getOrganizationEvents |
| `app/Http/Requests/Event/StoreEventRequest.php` | Validasi: category_id exists, title required, quota min 1, event_date >= today, start_time < end_time |
| `app/Http/Requests/Event/UpdateEventRequest.php` | Validasi partial update dengan `sometimes` |
| `app/Http/Requests/Event/PublishEventRequest.php` | Validasi: status must be 'published' |
| `app/Http/Resources/EventResource.php` | Transformasi response dengan whenLoaded untuk relasi organization, coordinator, category |
| `app/Http/Resources/EventCategoryResource.php` | Transformasi response kategori (id, name) |
| `app/Http/Controllers/Api/V1/EventController.php` | REST controller: index, store, show, update, destroy + publish + myEvents |
| `app/Http/Controllers/Api/V1/EventCategoryController.php` | index untuk list kategori |
| `database/seeders/EventCategorySeeder.php` | Seed 5 kategori awal: Lingkungan, Pendidikan, Kesehatan, Sosial, Kemanusiaan |
| `tests/Feature/Event/EventTest.php` | 20 test cases mencakup create, validasi, publish, update, delete, filter, search, pagination |

## Files Modified

| File | Perubahan |
|---|---|
| `routes/api.php` | Menambah routes event + event-categories + my-events + publish |
| `database/seeders/DatabaseSeeder.php` | Menambah `$this->call(EventCategorySeeder::class)` |

---

## API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/events` | Sanctum | List events (search, filter, sort, pagination) |
| POST | `/api/v1/events` | Sanctum | Create event (hanya Penyelenggara org terverifikasi) |
| GET | `/api/v1/events/{event}` | Sanctum | Detail event dengan relasi |
| PATCH | `/api/v1/events/{event}` | Sanctum | Update event (tidak untuk status completed) |
| DELETE | `/api/v1/events/{event}` | Sanctum | Soft delete event |
| PATCH | `/api/v1/events/{event}/publish` | Sanctum | Publish event (draft → published) |
| GET | `/api/v1/my-events` | Sanctum | List events milik organisasi user |
| GET | `/api/v1/event-categories` | Sanctum | List kategori event |

---

## Arsitektur & Alur Data

### Alur Create Event

```
User (Penyelenggara) → POST /api/v1/events
        → StoreEventRequest (validasi input)
        → EventController@store
            → cek user punya role Penyelenggara di suatu organisasi
            → EventService::create()
                → cek verification_status === 'approved'
                → Event::create({ ..., status: 'draft' })
            → EventResource (response)
```

### Alur Publish Event

```
User → PATCH /api/v1/events/{id}/publish
        → EventController@publish
        → EventService::publish()
            → cek status === 'draft'
            → cek organization.verification_status === 'approved'
            → Event::update({ status: 'published' })
        → EventResource (response)
```

### Alur List & Filter Events

```
User → GET /api/v1/events?search=...&category_id=...&city=...&date=...&sort=...&per_page=...
        → EventController@index
        → EventService::list(filters)
            → Query builder: where like search, where category_id, where city, where date, where status
            → orderBy (sort, default -created_at)
            → paginate(per_page, default 10)
        → Paginated response with EventResource collection
```

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Event dapat dibuat | ✅ | `POST /api/v1/events` — auto-set status `draft`, validasi org terverifikasi + role Penyelenggara |
| Event dapat diubah | ✅ | `PATCH /api/v1/events/{id}` — partial update, cegah modifikasi event completed |
| Event dapat dipublikasikan | ✅ | `PATCH /api/v1/events/{id}/publish` — hanya dari status draft, cek verifikasi organisasi |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Events migration | ✅ `create_events_table` — UUID PK, FK ke organizations/users/event_categories, indexes, soft deletes |
| Event categories migration | ✅ `create_event_categories_table` — auto-increment id, name |
| Event API endpoints | ✅ Full CRUD + publish + myEvents + eventCategories |
| Create event workflow | ✅ EventService::create() — validasi org terverifikasi + role Penyelenggara |
| Edit event workflow | ✅ EventService::update() — partial update, cegah completed |
| Publish event workflow | ✅ EventService::publish() — draft → published, validasi org terverifikasi |

---

## Database Schema

### Event Categories Table

| Column | Type | Notes |
|---|---|---|
| id | BIGINT | Auto-increment, primary key |
| name | VARCHAR(255) | Required |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Initial data: Lingkungan, Pendidikan, Kesehatan, Sosial, Kemanusiaan

### Events Table

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations.id |
| coordinator_id | UUID | FK → users.id |
| category_id | BIGINT | FK → event_categories.id |
| title | VARCHAR(255) | Required |
| description | TEXT | Nullable |
| province | VARCHAR(255) | Nullable |
| city | VARCHAR(255) | Nullable |
| location_name | VARCHAR(255) | Nullable |
| quota | INTEGER | Required, min 1 |
| event_date | DATE | Required |
| start_time | TIME | Required, format HH:MM |
| end_time | TIME | Required, format HH:MM, after start_time |
| status | VARCHAR(255) | Default: 'draft' |
| deleted_at | TIMESTAMP | Soft delete |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Indexes: category_id, city, event_date, status

---

## Event Status Lifecycle

```
Draft
  ↓
Published
  ↓
Ongoing
  ↓
Completed
```

Alternative: Cancelled (any state)

---

## Business Rules

- Hanya **Penyelenggara** dari organisasi **terverifikasi** yang dapat membuat event
- Event dibuat dengan status **draft**, harus dipublish agar terlihat publik
- Event **completed** tidak dapat dimodifikasi atau dihapus
- Soft delete: event tetap di database dengan `deleted_at` terisi
- Filter & search: keyword search (title/description), filter kategori/kota/provinsi/tanggal/status, sort by berbagai field

---

## Verification

| Check | Status |
|---|---|
| Migrations run | ✅ 2 migrations sukses (event_categories + events) |
| Seeder berjalan | ✅ 5 kategori awal ter-seed |
| Existing tests (36) pass | ✅ No regression |
| New event tests (20) pass | ✅ Semua test cases lulus |
| Routes registered | ✅ 8 endpoint event baru terdaftar |
| PHP syntax | ✅ All files compile |

```
  PASS  Tests\Feature\Event\EventTest
  ✓ penyelenggara can create event
  ✓ unauthenticated user cannot create event
  ✓ user without organization cannot create event
  ✓ cannot create event with unverified organization
  ✓ cannot create event with invalid category
  ✓ cannot create event with past date
  ✓ cannot create event with end before start
  ✓ user can view event detail
  ✓ viewing nonexistent event returns 404
  ✓ owner can update event
  ✓ cannot update completed event
  ✓ owner can publish event
  ✓ cannot publish non draft event
  ✓ owner can delete draft event
  ✓ cannot delete completed event
  ✓ user can list events with pagination
  ✓ user can filter events by category
  ✓ user can search events
  ✓ user can list event categories
  ✓ coordinator cannot create event

  Tests:    56 passed (209 assertions)
```

---

## Catatan Penting

- Event Category menggunakan auto-increment BIGINT (master data), bukan UUID
- Events menggunakan UUID primary key mengikuti pola tabel lain
- Status event menggunakan string (bukan ENUM) untuk fleksibilitas
- Event yang dibuat otomatis berstatus `draft` dan harus dipublish secara eksplisit
- Filter dan search sudah siap digunakan oleh TASK-013 (Event Discovery)
- Endpoint `GET /api/v1/events` bisa diakses publik (tergantung auth), siap untuk halaman discovery

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, semua file terimplementasi, migrasi berjalan, seeder kategori sukses, 20 test case baru lulus, dan tidak ada regresi pada test yang ada.
