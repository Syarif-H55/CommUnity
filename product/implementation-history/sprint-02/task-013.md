# TASK-013: Event Discovery Module

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Event Discovery Module |
| **Owner** | Abdillah |
| **Support Owner** | Syarif |
| **Priority** | High |
| **Estimated Effort** | L |
| **Dependencies** | TASK-011 (Event Module Backend) |

---

## Objective

Membangun halaman pencarian dan eksplorasi event publik — meliputi daftar event dengan search, filter kategori, filter lokasi, filter tanggal, pagination, dan halaman detail event untuk pengguna yang belum login (public).

---

## Files Created

| File | Deskripsi |
|---|---|
| `src/app/discover/page.tsx` | Halaman discovery publik — hero search, category filter chips, city filter, date filter, pagination, grid event cards, empty/loading states, footer dengan navigasi auth |
| `src/app/discover/[id]/page.tsx` | Halaman detail event publik — hero banner, deskripsi, info cards (waktu/lokasi/partisipasi), sidebar informasi event, tombol "Ikuti Kegiatan" (placeholder), share button |

## Files Modified

| File | Perubahan |
|---|---|
| `src/types/index.ts` | Menambah tipe: `EventFilters`, `DiscoverResponse` |
| `src/services/event.service.ts` | `list()` kini menerima `EventFilters` params opsional; return type diubah ke `DiscoverResponse` untuk mendukung pagination |
| `src/hooks/useEvent.ts` | Menambah `useDiscoverEvents(filters)` — TanStack Query hook dengan queryKey `['discover', 'events', filters]`, `placeholderData` untuk smooth transitions, return full `DiscoverResponse` (events + pagination info) |
| `src/app/(auth)/layout.tsx` | Menambah link "Jelajahi Kegiatan Sosial" di brand panel kiri |
| `src/app/(auth)/login/page.tsx` | Menambah divider dan link "Jelajahi Kegiatan Sosial" di footer card |
| `src/app/(auth)/register/page.tsx` | Menambah divider dan link "Jelajahi Kegiatan Sosial" di footer card |

---

## Halaman Frontend

### 1. Event Discovery (`/discover`)

**Hero Section:**
- Full-width gradient hero (emerald-900 to teal-900) dengan decorative radial overlay
- Headline "Temukan Kegiatan Sosial" dengan sub-headline
- Search bar dengan icon, placeholder, backdrop blur effect, dan clear button
- Debounce 400ms untuk mengurangi API calls saat mengetik

**Filter Panel:**
- **Category Filter Chips:** 6 kategori (Semua ✨, Lingkungan 🌿, Pendidikan 📚, Kesehatan 💊, Sosial 🤝, Kemanusiaan 🆘) dalam bentuk rounded button dengan active state (emerald bg, shadow)
- **Location Filter (collapsible):** Input text dengan icon MapPin untuk filter kota, dan tombol clear
- **Date Filter (collapsible):** Input date dengan min value hari ini, dan tombol clear
- **Filter Toggle:** Expand/collapse advanced filters dengan badge counter active filters
- **Reset Button:** Muncul saat ada filter aktif atau page > 1

**Event Grid:**
- Grid responsif: 1 kolom (mobile) → 2 (sm) → 3 (lg) → 4 (xl)
- Menggunakan komponen `EventCard` yang sudah ada (banner, status, category, title, description, date, time, location, participants)
- Loading state dengan spinner + "Mencari kegiatan sosial..."
- Empty state dengan icon search + pesan sesuai kondisi (filter aktif vs no events)
- Fetching overlay (spinner tipis di atas grid saat refetch)

**Pagination:**
- Page numbers dengan ellipsis (smart pagination: 1 ... 2 3 4 ... 10)
- Prev/Next buttons dengan disabled state
- Scroll-to-top otomatis saat ganti halaman
- Active page dengan emerald bg

**Header:**
- Sticky header dengan logo CommUnity
- Conditional buttons: jika login → "Dashboard", jika tidak → "Masuk" + "Daftar"

**Footer:**
- Copyright dengan tahun dinamis
- Navigasi link: Masuk, Daftar (jika belum login), Jelajahi

### 2. Event Detail (`/discover/[id]`)

**Hero Banner:**
- Gradient fallback atau banner image dengan overlay opacity 50%
- Category badge (white/transparent) + "Akan Datang" live badge dengan ping animation
- Event title, date (format Indonesia lengkap), time, location, organization name

**Main Content (2 columns, 3 grid):**
- **Deskripsi:** Card dengan whitespace preservation, fallback text jika kosong
- **Waktu & Lokasi:** Card dengan 3 info blocks (tanggal, waktu, lokasi) masing-masing dengan icon di emerald circle
- **Partisipasi:** Card dengan participant count, progress bar (color-coded: emerald/normal, red/full), organization info

**Sidebar:**
- **Ikuti Kegiatan Card:**
  - Jika login: button disabled "Fitur Pendaftaran (Segera Hadir)" — placeholder untuk TASK-015
  - Jika tidak login: "Masuk untuk Mendaftar" (link ke /login) + link daftar
- **Informasi Event Card:** Kategori (badge), Kapasitas, Pendaftar (color-coded full warning), Share button (clipboard API)

**Navigation:**
- Back button ke /discover
- "Jelajahi Kegiatan Lainnya" button di bottom

**Error State:**
- Event tidak ditemukan → card dengan icon XCircle + "Kegiatan Tidak Ditemukan"

---

## API Integration

### Service Layer (`event.service.ts`)

```typescript
// Sebelum:
list: () => api.get<ApiResponse<Event[]>>('/events')

// Sesudah:
list: (params?: EventFilters) => api.get<DiscoverResponse>('/events', { params })
```

### TanStack Query Hook (`useEvent.ts`)

```typescript
export function useDiscoverEvents(filters: EventFilters = {}) {
    return useQuery({
        queryKey: ['discover', 'events', filters],
        queryFn: async () => {
            const response = await eventService.list(filters);
            return response.data;
        },
        placeholderData: (prev) => prev,
    });
}
```

### Query Parameters Supported

| Parameter | Type | Contoh | Deskripsi |
|---|---|---|---|
| `search` | string | `"bakti sosial"` | Full-text search (title, description, location) |
| `category_id` | number | `1` | Filter by kategori (Lingkungan=1, Pendidikan=2, dll) |
| `city` | string | `"Jakarta"` | Filter by kota |
| `province` | string | `"DKI Jakarta"` | Filter by provinsi |
| `date` | string | `"2026-07-15"` | Filter by tanggal event |
| `sort` | string | `"date"` | Sort order (default dari backend) |
| `per_page` | number | `12` | Items per page (default: 12) |
| `page` | number | `1` | Halaman ke-n |

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Event tampil dengan benar | ✅ | Grid 4 kolom responsif menggunakan EventCard, hanya published events dari API |
| Search berfungsi | ✅ | Search bar di hero section, debounce 400ms, full-text ke backend API |
| Filter berfungsi | ✅ | Category chips, city filter, date filter — semua terintegrasi dengan query params ke backend |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Event listing page | ✅ `/discover` — hero section, search bar, filter panel, grid, pagination, empty/loading states, footer |
| Event detail page | ✅ `/discover/[id]` — hero banner, description, time/location card, participation card, sidebar info, share button, error state |
| Search functionality | ✅ Debounced search (400ms) yang mengirim `search` param ke `GET /api/v1/events` |
| Category filter | ✅ 6 chip buttons (Semua + 5 kategori database) dengan active state, mengirim `category_id` |
| Location filter | ✅ Input text dengan clear button, mengirim `city` param |
| Date filter | ✅ Input date dengan min=today, clear button, mengirim `date` param |
| Pagination | ✅ Smart pagination dengan ellipsis, prev/next, page numbers, scroll-to-top, disabled states |

---

## Navigation Updates

### Discover Links Added:
1. **Auth Layout Left Panel** (`(auth)/layout.tsx`): Button "Jelajahi Kegiatan Sosial" di bawah brand
2. **Login Page** (`login/page.tsx`): Divider + link "Jelajahi Kegiatan Sosial" di footer card
3. **Register Page** (`register/page.tsx`): Divider + link "Jelajahi Kegiatan Sosial" di footer card

### Public Pages:
- `/discover` — **PUBLIC** (no AuthGuard) — siapa pun bisa browsing events
- `/discover/[id]` — **PUBLIC** (no AuthGuard) — detail event untuk umum

### Conditional Header:
- Menampilkan "Masuk" / "Daftar" untuk user yang belum login
- Menampilkan "Dashboard" untuk user yang sudah login

---

## Build & Type Check

| Check | Status |
|---|---|
| TypeScript compilation | ✅ — `npx tsc --noEmit` (0 errors) |
| Build production | ✅ — `next build` (compiled successfully, 16 routes) |
| New routes registered | `/discover` (static), `/discover/[id]` (dynamic) |

```
Route (app)
┌ ○ /discover
├ ƒ /discover/[id]
...
```

---

## Data Flow Diagram

```
User (unauthenticated)                     User (authenticated)
        |                                         |
        ▼                                         ▼
┌─────────────────┐                    ┌─────────────────┐
│  /login          │                    │  /dashboard      │
│  /register       │                    │  (AuthGuard)     │
└────────┬─────────┘                    └────────┬─────────┘
         │                                       │
         ▼                                       ▼
┌──────────────────────────────────────────────────┐
│               /discover (PUBLIC)                  │
│  ┌──────────────────────────────────────────-┐   │
│  │  Hero Search Bar (debounce 400ms)         │   │
│  │  Category Filter (chips)                  │   │
│  │  City Filter (text)                       │   │
│  │  Date Filter (date input)                 │   │
│  │  Event Grid (EventCard)                   │   │
│  │  Pagination (page numbers + prev/next)    │   │
│  └──────────────────────────────────────────-┘   │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│          /discover/[id] (PUBLIC)                  │
│  ┌──────────────────────────────────────────-┐   │
│  │  Hero Banner (image/gradient)             │   │
│  │  Description Card                         │   │
│  │  Time & Location Card                     │   │
│  │  Participation Card (progress bar)        │   │
│  │  Sidebar: Join Button / Info / Share      │   │
│  └──────────────────────────────────────────-┘   │
└──────────────────────────────────────────────────┘
                       │
                       ▼
           ┌─────────────────────┐
           │  GET /api/v1/events  │
           │  ?search=...        │
           │  &category_id=...   │
           │  &city=...          │
           │  &date=...          │
           │  &page=...          │
           │  &per_page=12       │
           └──────────┬──────────┘
                      │
           ┌──────────▼──────────┐
           │  DiscoverResponse   │
           │  {                  │
           │    data: Event[],   │
           │    current_page,    │
           │    last_page,       │
           │    total            │
           │  }                  │
           └─────────────────────┘
```

---

## Catatan Penting

- Halaman discovery **tidak menggunakan AuthGuard** — dapat diakses publik tanpa login
- Hanya **published events** yang tampil (backend sudah handle filtering status=published)
- Search menggunakan debounce 400ms untuk mengurangi jumlah API request
- Pagination menggunakan smart ellipsis algorithm yang menampilkan halaman pertama, terakhir, dan 2 halaman di sekitar halaman aktif
- Filter state di-reset ke page 1 setiap kali filter berubah
- `placeholderData` digunakan pada `useDiscoverEvents` agar UI tetap smooth saat ganti halaman (tidak flicker)
- Tombol "Ikuti Kegiatan" masih placeholder — akan diintegrasikan dengan TASK-015 (Volunteer Participation Frontend)
- Komponen `EventCard` dan `EventStatusBadge` di-reuse dari modul Event Management (TASK-012)
- Link discover ditambahkan di halaman login, register, dan auth layout untuk memudahkan navigasi pengguna baru

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, build berhasil (0 error), semua halaman event discovery publik telah terimplementasi dengan search debounce, filter kategori/lokasi/tanggal, pagination smart, detail event publik, dan navigasi terintegrasi ke halaman auth.
