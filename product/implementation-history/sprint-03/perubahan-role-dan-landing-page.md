# Perubahan Role Management & Landing Page

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Perubahan Role Management & Landing Page |
| **Owner** | Syarif |
| **Support Owner** | - |
| **Priority** | High |
| **Estimated Effort** | XL |
| **Dependencies** | Seluruh sprint 1-2 (auth, organization, event) |

---

## Objective

1. **Role Management Fixing** — Memperbaiki keamanan backend (9 route tanpa otorisasi), mengekspos data role ke frontend, membangun RoleGuard, dashboard routing, dynamic navbar, admin dashboard, dan testing.
2. **Landing Page & Registration Separation** — Membangun landing page profesional sebagai pintu masuk utama platform, memisahkan alur registrasi Relawan vs Penyelenggara melalui query param `?type=`.
3. **Dummy Data** — Membuat data demo lengkap (7 akun, 3 organisasi, 5 event, 7 registrasi) untuk testing dan demo.

---

## Files Created

### Backend

| File | Deskripsi |
|---|---|
| `app/Enums/OrganizationRole.php` | Enum class — `Penyelenggara`, `Koordinator Event` sebagai constant, menggantikan hardcoded string |
| `app/Traits/AuthorizesOrganizationAccess.php` | Trait reusable — `authorizeOrganizerOf()`, `authorizeOrganizerOrCoordinatorOf()`, `authorizeOrganizationMembership()` dengan `is_admin` bypass |
| `app/Http/Controllers/Api/V1/UserContextController.php` | Endpoint `GET /my-context` — return `is_admin`, `is_organizer`, `is_coordinator`, `organizations[]` |
| `app/Http/Controllers/Api/V1/EventPermissionController.php` | Endpoint `GET /events/{id}/permissions` — return granular boolean per event |
| `app/Http/Controllers/Api/V1/Admin/AdminStatsController.php` | Admin stats — total users, orgs, events, reports, pending_organizations |
| `app/Http/Controllers/Api/V1/Admin/AdminOrganizationController.php` | Admin manage organizations — list all, verify (approve/reject) |
| `app/Http/Controllers/Api/V1/Admin/AdminUserController.php` | Admin list all users |
| `database/seeders/DummyDataSeeder.php` | Seeder komprehensif — 7 users, 3 orgs, 5 events, 7 volunteer registrations |

### Frontend

| File | Deskripsi |
|---|---|
| `src/stores/role.store.ts` | Zustand store + persist — `context`, `isAdmin`, `isOrganizer`, `isCoordinator`, `organizations` |
| `src/hooks/useRoleContext.ts` | TanStack Query hook — fetch `GET /my-context`, sync ke role.store |
| `src/hooks/useAdmin.ts` | TanStack Query hooks admin — `useAdminStats`, `useAdminOrganizations`, `useVerifyOrganization`, `useAdminUsers` |
| `src/components/auth/RoleGuard.tsx` | Guard component — `allowedRoles`, `requireOrganization`, `organizationId`, `fallback` (default 403) |
| `src/components/layout/Navbar.tsx` | Responsive navbar — role-based dynamic menu, mobile hamburger, unauthenticated state |
| `src/services/admin.service.ts` | Service layer admin API — `getStats`, `getOrganizations`, `verifyOrganization`, `getUsers` |
| `src/app/admin/dashboard/page.tsx` | Admin dashboard — 4 stat cards, pending org alert, recent events & users |
| `src/app/admin/organizations/page.tsx` | Admin verification page — filter status, approve/reject dengan rejection reason modal |

---

## Files Modified

### Backend (7)

| File | Perubahan |
|---|---|
| `app/Http/Resources/UserResource.php` | Tambah `is_admin` field ke response |
| `app/Http/Controllers/Api/V1/OrganizationController.php` | Authorize via trait di update/destroy/uploadDocument |
| `app/Http/Controllers/Api/V1/OrganizationMemberController.php` | Authorize via trait di store/update/destroy/index |
| `app/Http/Controllers/Api/V1/EventController.php` | Authorize via trait di store/update/destroy/publish; fix myEvents (all orgs, not just first) |
| `app/Http/Controllers/Api/V1/EventReportController.php` | `is_admin` bypass di authorizeCoordinatorOrOrganizer |
| `app/Http/Requests/Event/StoreEventRequest.php` | Tambah `organization_id` required + exists validation |
| `routes/api.php` | Tambah route: `/my-context`, `/events/{id}/permissions`, `/admin/stats`, `/admin/orgs`, `/admin/users` |

### Frontend (18)

| File | Perubahan |
|---|---|
| `src/types/index.ts` | Hapus `role` dari User, tambah `is_admin`, `UserRoleContext`, `OrganizationMembership`, `DashboardStats`; tambah field ke Organization |
| `src/stores/auth.store.ts` | Tambah `isAdmin` state |
| `src/components/auth/AuthGuard.tsx` | Panggil `useRoleContext()` untuk trigger fetch `/my-context` |
| `src/app/page.tsx` | **Rewrite** — landing page hero, stats, how-it-works, CTA, footer (dari redirector `/login`) |
| `src/app/dashboard/page.tsx` | Role-based redirect hub — admin→/admin/dashboard, organizer→/organizations, coordinator→/events, volunteer→/discover |
| `src/app/(auth)/register/page.tsx` | Tambah `?type=volunteer\|organizer` query param, judul dinamis, redirect berbeda, badge role, bungkus Suspense |
| `src/app/events/page.tsx` | Hapus AuthGuard wrapper (layout menangani) |
| `src/app/events/create/page.tsx` | Hapus AuthGuard wrapper |
| `src/app/events/[id]/page.tsx` | Hapus AuthGuard wrapper |
| `src/app/events/[id]/edit/page.tsx` | Hapus AuthGuard wrapper |
| `src/app/events/[id]/attendance/page.tsx` | Hapus AuthGuard wrapper |
| `src/app/events/[id]/attendance/scan/page.tsx` | Hapus AuthGuard wrapper |
| `src/app/organizations/page.tsx` | Tambah RoleGuard `allowedRoles={['organizer']}` |
| `src/app/organizations/[id]/page.tsx` | Tambah RoleGuard `allowedRoles={['organizer','coordinator']} organizationId={id}` |
| `src/app/events/layout.tsx` | Tambah RoleGuard `allowedRoles={['organizer','coordinator']}` |
| `src/app/admin/layout.tsx` | Tambah RoleGuard `allowedRoles={['admin']}` |
| `src/app/discover/page.tsx` | Hapus inline header (digantikan Navbar dari discover/layout) |

### Test Files (1)

| File | Perubahan |
|---|---|
| `tests/Feature/Event/EventTest.php` | Tambah 3 tests: non_owner_cannot_update/delete/publish_event |

### Database Seeder (1)

| File | Perubahan |
|---|---|
| `database/seeders/DatabaseSeeder.php` | Panggil `DummyDataSeeder::class` ganti user test manual |

### Dokumentasi (2)

| File | Perubahan |
|---|---|
| `product/fixing-history/backend & frontend role management fixing.md` | Dokumen perencanaan & laporan role management (12 section) |
| `product/fixing-history/landing-page-and-registration-separation.md` | Dokumen perencanaan landing page & registrasi (13 section) |
| `README.md` | Data dummy lengkap — 7 akun demo, 3 organisasi, 5 event, 7 registrasi |

---

## Implementation Details

### Fase 1: Backend Authorization (9 route diperbaiki)

**Pattern:** Trait → dipakai di 5 controller.

```php
// AuthorizesOrganizationAccess trait — 3 method reusable
authorizeOrganizerOf(Organization $org, User $user): void
  → if ($user->is_admin) return; // bypass admin
  → cek pivot role === 'Penyelenggara'
  → throw HttpResponseException(403)

authorizeOrganizerOrCoordinatorOf(Organization $org, User $user): void
  → if ($user->is_admin) return;
  → cek pivot role in ['Penyelenggara', 'Koordinator Event']
  → throw HttpResponseException(403)

authorizeOrganizationMembership(Organization $org, User $user): void
  → if ($user->is_admin) return;
  → cek pivot exists
  → throw HttpResponseException(403)
```

**Controller yang diperbaiki:**

| Controller | Route | Fix |
|---|---|---|
| OrganizationController | PUT/DELETE /organizations/{id} | `$this->authorizeOrganizerOf($org, $request->user())` |
| OrganizationController | POST /organizations/{id}/documents | `$this->authorizeOrganizerOf($org, $request->user())` |
| OrganizationMemberController | POST/.../members | `$this->authorizeOrganizerOf($org, $request->user())` |
| OrganizationMemberController | PUT/DELETE .../members/{id} | `$this->authorizeOrganizerOf($org, $request->user())` |
| OrganizationMemberController | GET/.../members | `$this->authorizeOrganizerOrCoordinatorOf($org, $request->user())` |
| EventController | POST /events | Validasi `organization_id` + `$this->authorizeOrganizerOf($org, $request->user())` |
| EventController | PUT /events/{id} | `$this->authorizeOrganizerOrCoordinatorOf($event->organization, $request->user())` |
| EventController | DELETE /events/{id} | `$this->authorizeOrganizerOf($event->organization, $request->user())` |
| EventController | POST /events/{id}/publish | `$this->authorizeOrganizerOf($event->organization, $request->user())` |
| EventReportController | Semua authorize | `is_admin` bypass added |

**myEvents fix — dari hanya org pertama ke semua org:**

```php
// Before (bug)
$organization = $request->user()->organizations()->first();
$events = Event::where('organization_id', $organization->id)->get();

// After (fix)
$organizationIds = $request->user()->organizations()->pluck('organizations.id');
$events = Event::whereIn('organization_id', $organizationIds)->get();
```

### Fase 2: Expose Role Data ke Frontend

- `UserResource`: tambah `is_admin` boolean field
- `UserContextController` (`GET /my-context`): return `is_admin`, `is_organizer`, `is_coordinator`, `organizations[]` dengan role dari pivot
- `EventPermissionController` (`GET /events/{id}/permissions`): return granular — `can_view`, `can_edit`, `can_delete`, `can_publish`, `can_manage_attendance`, `can_manage_members`

### Fase 3: Frontend Role Infrastructure

**Type system:**
```typescript
// User — hapus role, tambah is_admin
interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  is_admin: boolean;           // ← bukan role string
  profile_photo_url: string | null;
  created_at: string;
}

// Context baru dari /my-context
interface UserRoleContext {
  is_admin: boolean;
  organizations: OrganizationMembership[];
  is_organizer: boolean;
  is_coordinator: boolean;
}

// Role dari pivot
interface OrganizationMembership {
  id: string;
  name: string;
  role: 'Penyelenggara' | 'Koordinator Event';
}
```

**Role determination logic:**
```typescript
// Dari response /my-context — cukup 3 boolean
const isVolunteer = !context.is_admin
  && !context.is_organizer
  && !context.is_coordinator;
```

**RoleGuard component:**
```typescript
<RoleGuard
  allowedRoles={['admin']}
  // atau
  allowedRoles={['organizer', 'coordinator']}
  organizationId={id}    // optional — cek membership spesifik
  fallback={<div>Akses ditolak</div>}  // optional — default 403
/>
```

### Fase 4: Dashboard Redirect & Dynamic Navbar

**Dashboard redirect hub:**
```typescript
// /dashboard page — redirect berdasarkan role
admin       → /admin/dashboard
organizer   → /organizations
coordinator → /events
volunteer   → /discover
```

**Navbar — 4 role states:**
| State | Links |
|---|---|
| Unauthenticated | Beranda, Login, Daftar |
| Admin | Dashboard Admin, Verifikasi, Logout |
| Penyelenggara | Organisasi, Event, Dashboard, Logout |
| Koordinator | Event, Dashboard, Logout |
| Relawan | Beranda, Partisipasi Saya, Logout |

### Fase 5: Admin Dashboard & Verification

- **Admin dashboard** (`/admin/dashboard`): 4 stat cards (Users, Organizations, Events, Reports), pending organizations alert, recent events list, recent users list
- **Admin organizations** (`/admin/organizations`): filter by status (all/pending/verified/rejected), approve/reject with modal for rejection reason

### Fase 6: Testing

- `OrganizationAuthTest.php` — 10 tests (volunteer 403 + admin bypass)
- `AdminBypassTest.php` — 3 tests (admin bypass event CRUD)
- `EventTest.php` — 3 new tests (non-owner update/delete/publish)
- Total: **97 backend Feature tests pass**

### Landing Page & Registration Separation

**Landing Page** (`/`) — menggantikan redirector:
```
Navbar → Hero (2 CTA + stats) → Cara Kerja (3 langkah)
  → Stats Section (gradient) → Final CTA → Footer
```

**Register separation via `?type=volunteer|organizer`:**
| Aspek | `?type=volunteer` | `?type=organizer` |
|---|---|---|
| Judul | "Daftar sebagai Relawan" | "Daftar sebagai Penyelenggara" |
| Icon header | UserPlus | Building2 |
| Badge role | Relawan (biru) | Penyelenggara (hijau) |
| Redirect sukses | `/discover` | `/organizations/register` |
| Info text | "langsung jelajahi kegiatan" | "buat organisasi dan kelola kegiatan" |

### Dummy Data

Seeder `DummyDataSeeder` — data demo komprehensif:

| Tipe | Jumlah | Detail |
|---|---|---|
| Users | 7 | 1 admin, 1 organizer, 1 coordinator, 4 volunteer |
| Organizations | 3 | Yayasan Sejahtera (verified), Komunitas Peduli Lingkungan (pending), Forum Relawan Jakarta (rejected) |
| Events | 5 | 3 published, 2 draft — berbagai kategori dan lokasi |
| Volunteer Registrations | 7 | 4 volunteer terdaftar di berbagai event |

---

## Acceptance Criteria

### Role Management Backend (9/9 ✅)

| AC | Implementasi |
|---|---|
| ✅ Hanya Penyelenggara bisa edit/hapus organisasi | `OrganizationController` via trait |
| ✅ Hanya Penyelenggara bisa manage anggota | `OrganizationMemberController` via trait |
| ✅ Hanya Penyelenggara/Koordinator bisa edit/hapus/publish event | `EventController` via trait |
| ✅ Event create validasi `organization_id` + membership | `StoreEventRequest` + trait |
| ✅ `myEvents` dari semua organisasi user | `pluck('organizations.id')` fix |
| ✅ `is_admin` di response UserResource | Field ditambahkan |
| ✅ Endpoint `/my-context` ada | `UserContextController` |
| ✅ Admin bypass pengecekan organisasi | `AuthorizesOrganizationAccess` trait |
| ✅ Event permission endpoint | `EventPermissionController` |

### Role Management Frontend (6/6 ✅)

| AC | Implementasi |
|---|---|
| ✅ RoleGuard blokir volunteer | `events/layout.tsx`, `admin/layout.tsx` |
| ✅ RoleGuard izinkan Penyelenggara/Koordinator | `allowedRoles={['organizer','coordinator']}` |
| ✅ Dashboard konten relevan per role | Redirect hub |
| ✅ Navigasi dinamis per role | `Navbar.tsx` — 5 state |
| ✅ Admin dashboard khusus | `/admin/dashboard` — stats, pending, recent |
| ✅ Events/organizations terlindungi | RoleGuard di layouts |

### Landing Page & Registration (12/12 ✅)

| AC | Implementasi |
|---|---|
| ✅ Landing page saat user belum login | `page.tsx` — hero + CTA |
| ✅ Hero section value proposition jelas | Headline + sub-headline |
| ✅ 2 CTA buttons | "Gabung sebagai Relawan" & "Daftarkan Organisasi Anda" |
| ✅ Statistik ditampilkan | 3 card di hero, 4 card di stats section |
| ✅ Responsive mobile | Tailwind responsive classes |
| ✅ Footer dengan link login | Footer + navbar |
| ✅ CTA "Relawan" → `/register?type=volunteer` | Link query param |
| ✅ CTA "Organizer" → `/register?type=organizer` | Link query param |
| ✅ Judul register berubah sesuai type | `REGISTER_TYPES` config |
| ✅ Volunteer sukses → redirect `/discover` | `config.redirect` |
| ✅ Organizer sukses → redirect `/organizations/register` | `config.redirect` |
| ✅ Backend tidak diubah | Hanya frontend changes |

---

## Build & Type Check

| Layer | Status |
|---|---|
| TypeScript compilation | ✅ Pass |
| Frontend build (Turbopack 16.2.9) | ✅ Pass |
| Backend Feature tests (97 tests, 360 assertions) | ✅ Pass |
| Route terdaftar (`/` landing page) | ✅ `○ /` Static |

---

## Architecture Diagram (Final)

```
USER (unauthenticated)
  │
  ▼
┌──────────────────────────────────────────────────────┐
│              LANDING PAGE (/)                         │
│  Hero → 2 CTA → Stats → Cara Kerja → Footer          │
└──────────────────┬───────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
/register?type=volunteer   /register?type=organizer
      │                         │
      ▼                         ▼
  Redirect /discover      Redirect /organizations/register
      │                         │
      ▼                         ▼
  RoleContext Hook ──── GET /my-context ────► Backend
      │                         │
      ▼                         ▼
  Role Store (Zustand)    AuthorizesOrganizationAccess
      │                         │
      ▼                         ▼
  RoleGuard + Navbar      5 Controllers (10 route fixes)
      │                         │
      ▼                         ▼
  Role-Specific Pages     97 Tests (360 assertions)
  (admin, organizer,       (OrganizationAuth, AdminBypass,
   coordinator, volunteer)  Event, Membership, dll)
```

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi:

| Lingkup | Total AC | Status |
|---|---|---|
| Role Management Backend | 9 | ✅ |
| Role Management Frontend | 6 | ✅ |
| Landing Page | 6 | ✅ |
| Registration Separation | 6 | ✅ |
| **Total** | **27** | **✅ 27/27** |

Build: **Frontend ✅ | Backend 97 tests ✅ | Zero TypeScript errors ✅**
