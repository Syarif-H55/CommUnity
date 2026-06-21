# TASK-012: Event Management Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Event Management Frontend |
| **Owner** | Hiraldy |
| **Support Owner** | Abdillah |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | TASK-011 (Event Module Backend) |

---

## Objective

Membangun antarmuka event management — meliputi halaman daftar event dengan slideshow fitur utama, pembuatan event baru, detail event, edit event, dan workflow publikasi event.

---

## Files Created

| File | Deskripsi |
|---|---|
| `src/app/events/page.tsx` | Halaman daftar event — featured slideshow, search bar, category filter chips, grid/list view toggle, sort options, draft vs published sections, empty state |
| `src/app/events/create/page.tsx` | Halaman create event — hero guidance section, form lengkap, redirect ke detail setelah sukses |
| `src/app/events/[id]/page.tsx` | Halaman detail event — hero banner, deskripsi, info cards (waktu/lokasi/partisipasi), publish workflow, delete confirmation, sidebar quick actions |
| `src/app/events/[id]/edit/page.tsx` | Halaman edit event — form pre-filled dengan data existing, redirect ke detail setelah sukses |
| `src/components/event/EventSlideshow.tsx` | Hero slideshow — auto-play 6 detik, pause on hover, keyboard navigation, dot indicators, category tags, live status badge, time/location metadata, gradient overlays, CTA button |
| `src/components/event/EventCard.tsx` | Kartu event — banner image, status badge, category icon, date/time/location/participants info, 3D tilt effect, "Bisa Diikuti" live indicator |
| `src/components/event/EventForm.tsx` | Form create/edit — banner upload (preview, validasi format/ukuran), date/time picker dengan validasi, category grid selector dengan emoji, participant counter, real-time field validation on blur, character counter |
| `src/components/event/EventStatusBadge.tsx` | Status badge — color-coded (draft/published/cancelled/completed) dengan ikon yang sesuai |
| `src/components/event/index.ts` | Barrel export seluruh komponen event |
| `src/services/event.service.ts` | Service layer: list, getById, create (FormData), update (FormData + _method PATCH), publish, delete |
| `src/hooks/useEvent.ts` | TanStack Query hooks: useEvents, useEvent, useCreateEvent, useUpdateEvent, usePublishEvent, useDeleteEvent |

---

## Files Modified

| File | Perubahan |
|---|---|
| `src/types/index.ts` | Menambah tipe: `Event`, `EventStatus`, `CreateEventRequest`, `UpdateEventRequest` |
| `src/app/dashboard/page.tsx` | Menambah link card "Kelola Event" yang mengarah ke `/events` |
| `tasks/task-hiraldy.md` | Update status TASK-012 → ✅ COMPLETED dengan detail UI features yang diimplementasikan |

---

## Halaman Frontend

### 1. Daftar Event (`/events`)

- **Hero Slideshow:** 4 slide featured event dengan gambar Unsplash — auto-play 6 detik, pause on hover
- **Search Bar:** Full-text search berdasarkan judul, deskripsi, dan lokasi dengan tombol clear
- **Category Filter:** 7 kategori (Sosial, Pendidikan, Lingkungan, Kesehatan, Budaya, Bencana, Lainnya) dalam bentuk chip button dengan emoji icon
- **View Toggle:** Grid/List view — localStorage-independent state toggle
- **Sort Options:** Tanggal Terdekat, A-Z, Peserta Terbanyak
- **Sections:** Draft events (dengan badge amber) dan all events terpisah
- **List View:** Compact horizontal layout dengan date block gradient, status badge, arrow hover
- **Empty State:** Card dengan icon kalender, pesan sesuai filter aktif, CTA buat event
- **Header:** Tombol "Buat Event" dan logout
- **Auth:** Dibungkus `AuthGuard`

### 2. Create Event (`/events/create`)

- **Hero Guidance:** Gradient hijau dengan 4 step guide (Isi Detail → Tentukan Waktu → Upload Banner → Publikasikan)
- **Form Lengkap:**
  - **Banner Upload:** Area drop zone dengan preview, validasi format (JPG/PNG/WebP), maks 5MB, tombol remove
  - **Informasi Event:** Judul (min 5 karakter, required), Deskripsi (min 20 karakter, required, character counter)
  - **Waktu & Lokasi:** Date picker (tidak boleh sebelum hari ini), Time picker, Lokasi (required)
  - **Kategori & Kapasitas:** Grid 7 kategori dengan icon emoji, selected state green border, max participants (min 1, maks 10.000)
- **Validation:** Real-time field validation on blur, form-level validation on submit, server error banner
- **Loading:** Submit button spinner "Menyimpan..."
- **Success:** Redirect ke `/events/{id}`
- **Auth:** Dibungkus `AuthGuard`

### 3. Detail Event (`/events/[id]`)

- **Hero Banner:** Full-width gradient dengan background image (optional), category badge, status badge, live "Akan Datang" badge dengan animasi ping, title, date/time/location/organization
- **Action Buttons:**
  - **Draft:** "Publikasikan Event" (gradient hijau), "Edit", "Hapus" (destructive)
  - **Published:** "Edit Event"
- **Delete Confirmation:** Alert card merah dengan konfirmasi Ya/Batal
- **Deskripsi:** Card dengan whitespace preservation
- **Info Cards (2 columns):**
  - **Waktu Pelaksanaan:** Tanggal (format Indonesia), Waktu, Lokasi
  - **Partisipasi:** Peserta (progress bar dengan color-coding), Status badge, Tanggal publikasi
- **Published Success:** Alert hijau dengan PartyPopper icon + pesan sukses
- **Sidebar:**
  - **Aksi Cepat:** Edit Event, Salin Tautan (clipboard API), Semua Event
  - **Ringkasan:** Kategori, Kapasitas, Pendaftar (dengan warning jika penuh), Status, Tanggal dibuat
- **Loading/Error State:** Spinner + error card "Event Tidak Ditemukan"
- **Auth:** Dibungkus `AuthGuard`

### 4. Edit Event (`/events/[id]/edit`)

- **Hero Banner:** Gradient amber dengan icon Edit, judul event yang diedit
- **Form Pre-filled:** Seluruh field terisi dengan data event existing
- **Partial Update:** Hanya field yang berubah dikirim ke API
- **Validation:** Sama dengan create form + server error handling
- **Success:** Redirect ke `/events/{id}`
- **Auth:** Dibungkus `AuthGuard`

---

## API Endpoints (Consumed)

| Method | Endpoint | Hook | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/events` | `useEvents()` | List events |
| GET | `/api/v1/events/{id}` | `useEvent(id)` | Detail event |
| POST | `/api/v1/events` | `useCreateEvent()` | Create event (FormData) |
| PATCH | `/api/v1/events/{id}` | `useUpdateEvent(id)` | Update event (FormData + _method PATCH) |
| PATCH | `/api/v1/events/{id}/publish` | `usePublishEvent()` | Publish event (draft → published) |
| DELETE | `/api/v1/events/{id}` | `useDeleteEvent()` | Soft delete event |

---

## Arsitektur & Alur Data

### Alur Create Event

```
User → /events/create (AuthGuard)
        → EventForm mode="create"
            → Validasi client-side (title, description, date, time, location, category, max_participants)
            → useCreateEvent.mutate(data)
                → eventService.create(data FormData)
                    → POST /api/v1/events (multipart)
                → onSuccess: redirect /events/{id}
                → onError: serverError banner
```

### Alur Publish Event

```
User → /events/{id} (AuthGuard)
        → Tombol "Publikasikan Event"
            → usePublishEvent.mutate(id)
                → eventService.publish(id)
                    → PATCH /api/v1/events/{id}/publish
                → onSuccess: invalidateQueries(['events', id]) + success banner (PartyPopper)
                → UI update: tombol publish diganti "Edit Event"
```

### Alur Edit Event

```
User → /events/{id}/edit (AuthGuard)
        → useEvent(id) → pre-fill form
        → EventForm mode="edit"
            → Field berubah? Kirim partial update
            → useUpdateEvent(id).mutate(data)
                → eventService.update(id, data FormData)
                    → POST /api/v1/events/{id} (multipart + _method PATCH)
                → onSuccess: invalidateQueries(['events', id], ['events']) + redirect /events/{id}
                → onError: serverError banner
```

---

## Komponen Slideshow (EventSlideshow)

Fitur utama slideshow:

| Fitur | Detail |
|---|---|
| **Auto-play** | Interval 6 detik, otomatis berganti slide |
| **Pause on Hover** | Slideshow berhenti saat mouse di atas area |
| **Keyboard Navigation** | Panah kiri/kanan untuk navigasi |
| **Dot Indicators** | Dot di底部 dengan ukuran berbeda untuk aktif/non-aktif |
| **Counter Badge** | "1/4" di pojok kiri atas |
| **Play/Pause Button** | Tombol glassmorphism di pojok kanan atas (muncul saat hover) |
| **Prev/Next Buttons** | Tombol kiri/kanan dengan glassmorphism (muncul saat hover) |
| **Category Tag** | Color-coding per kategori (sosial→rose, pendidikan→blue, lingkungan→emerald, dll) |
| **Live Status** | "Akan Datang" badge dengan animasi ping + "Sedang Berlangsung" |
| **Time & Location** | Metadata di overlay bawah |
| **CTA Button** | "Lihat Detail" dengan hover scale effect, glassmorphism style |
| **Gradient Overlay** | Multi-layer gradient untuk text readability |
| **Smooth Transition** | Fade + scale 1s durasi |
| **Responsive** | Padding, font size adaptif per breakpoint |
| **Accessibility** | ARIA role="region" roledescription="carousel", aria-current pada dot, keyboard support |

Struktur slide:

```typescript
interface EventSlide {
    id: string
    image: string
    title: string
    description: string
    date: string
    time: string
    location: string
    category: string
}
```

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Event dapat dibuat dari UI | ✅ | Create page dengan EventForm lengkap, validasi client + server, banner upload, redirect ke detail |
| Event dapat diperbarui | ✅ | Edit page dengan form pre-filled, partial update, validasi, server error handling |
| Event dapat dipublikasikan | ✅ | Publish button di detail page (draft), success banner dengan animasi PartyPopper, UI update otomatis |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Create event page | ✅ `/events/create` — form lengkap dengan validasi, banner upload, category grid, participant counter |
| Edit event page | ✅ `/events/[id]/edit` — form pre-filled, partial update, validasi |
| Event detail page | ✅ `/events/[id]` — hero banner, info cards, deskripsi, sidebar, delete confirmation |
| Event publishing workflow | ✅ Publish button → konfirmasi → API call → success banner → auto-refresh |
| Axios service integration | ✅ eventService.ts — 6 endpoint terdefinisi (CRUD + publish + delete) |
| TanStack Query hooks | ✅ 6 hooks untuk query & mutations + cache invalidation |
| Type definitions | ✅ Event, EventStatus, CreateEventRequest, UpdateEventRequest |
| Route protection | ✅ Semua halaman dibungkus AuthGuard |

---

## UI Components

### EventSlideshow
- Hero carousel dengan auto-play (6 detik) dan pause on hover
- Navigasi dot, prev/next button, keyboard support
- Live status indicator dengan animasi ping
- Category tag color-coded, gradient overlay untuk readability
- CTA button dengan glassmorphism dan hover scale effect

### EventCard
- TiltCard wrapper (3D perspective effect)
- Banner image (atau gradient fallback) dengan hover zoom
- Status badge (draft/published/cancelled/completed) di overlay
- Category icon emoji badge
- Date (format Indonesia), time, location, participant count
- Live "Bisa Diikuti" indicator dengan animasi ping

### EventForm
- Banner upload dengan drag & drop area, preview, validasi format/ukuran, remove button
- Date picker dengan validasi (tidak boleh sebelum hari ini)
- Time picker dengan icon clock
- Category grid selector — 7 opsi dengan emoji icon dan active state
- Participants counter (min 1, max 10.000)
- Real-time validation on blur — error message per field
- Character counter pada textarea deskripsi
- Server error banner

### EventStatusBadge
- 4 variant: draft (amber), published (emerald), cancelled (red), completed (slate)
- Ikon sesuai status: Clock, CheckCircle2, XCircle, Archive
- Backdrop blur support

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        AuthGuard                                │
│                    (redirect if not auth)                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌──────────┐   ┌────────────┐   ┌──────────┐
   │ /events  │   │/events/    │   │/events/  │
   │          │   │create      │   │[id]      │
   ├──────────┤   ├────────────┤   ├──────────┤
   │ Slideshow│   │EventForm   │   │ Hero     │
   │ Search   │   │(create)    │   │ Actions  │
   │ Filter   │   │            │   │ Detail   │
   │ Grid/List│   │            │   │ Sidebar  │
   └──────────┘   └────────────┘   └────┬─────┘
                                        │
                                  ┌─────▼─────┐
                                  │/events/   │
                                  │[id]/edit  │
                                  ├───────────┤
                                  │EventForm  │
                                  │(pre-filled)│
                                  └───────────┘
```

---

## Build & Type Check

| Check | Status |
|---|---|
| TypeScript compilation | ✅ — npx tsc --noEmit (0 errors) |
| Build production | ✅ — next build (compiled successfully) |
| Routes terdaftar | `/events`, `/events/create`, `/events/[id]`, `/events/[id]/edit` |

Semua route berhasil dikompilasi:
- `○ /events` — static page
- `○ /events/create` — static page
- `ƒ /events/[id]` — dynamic (server-rendered)
- `ƒ /events/[id]/edit` — dynamic (server-rendered)

---

## Catatan Penting

- Semua halaman menggunakan `AuthGuard` — hanya bisa diakses user terautentikasi
- Create dan update event menggunakan `FormData` untuk mendukung upload banner
- Update event menggunakan `_method: PATCH` dalam FormData (Laravel convention untuk multipart PATCH)
- Validasi client-side mencakup: required fields, min-length, date tidak boleh sebelum hari ini, max participants range
- Cache invalidation otomatis setelah create (invalidate `['events']`), update (invalidate `['events', id]` + `['events']`), publish (invalidate `['events']`), delete (invalidate `['events']`)
- Dashboard halaman utama sudah memiliki navigasi ke halaman event
- Featured slideshow menggunakan static placeholder data — dapat diganti dengan API data ketika event discovery sudah tersedia
- Event Form mendukung dua mode: `create` (semua field required) dan `edit` (partial update — hanya field berubah yang dikirim)

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, build berhasil (0 error), semua halaman frontend event management telah terimplementasi dengan fitur slideshow interaktif, form CRUD lengkap, workflow publikasi, dan state handling (loading, empty, error, success).
