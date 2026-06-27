# Backend & Frontend Role Management Fixing

## Analysis Report & Implementation Plan

---

## ⚠️ Important: Baca Dokumen Berikut Sebelum Implementasi

Agar implementasi tetap sesuai dengan standar dan konsistensi proyek CommUnity, **wajib membaca** dokumen-dokumen berikut sebelum memulai coding:

### Wajib Dibaca (Sesuai Urutan)

| # | Dokumen | Lokasi | Alasan |
|---|---|---|---|
| 1 | **Architecture** | `architechture/architecture.md` | Memahami arsitektur sistem, alur authorisasi, dan batasan role |
| 2 | **Database Design** | `architechture/database-design.md` | Memastikan tidak ada perubahan database di luar skema yang sudah ditentukan |
| 3 | **API Conventions** | `architechture/api-conventions.md` | Konsistensi endpoint, response format, error handling |
| 4 | **Coding Standards** | `architechture/coding-standards.md` | Pattern Controller → Service, Form Request, API Resource |
| 5 | **PRD** | `product/PSI - PRD Kelompok ATM.docx.md` | Memastikan fitur sesuai dengan Functional Requirements dan Role definitions |
| 6 | **Scope** | `product/scope.md` | Memastikan perubahan tidak keluar dari scope MVP |
| 7 | **Decision Log** | `planning/decision.md` | Memahami keputusan arsitektural yang sudah diambil |

### Referensi Code (Pahami Pattern)

| File | Pattern yang Ditunjukkan |
|---|---|
| `backend/app/Http/Controllers/Api/V1/AttendanceController.php` | Contoh controller dengan authorize method |
| `backend/app/Http/Controllers/Api/V1/EventReportController.php` | Contoh multi-level authorization pattern |
| `backend/app/Http/Resources/UserResource.php` | Contoh format resource |
| `frontend/src/components/auth/AuthGuard.tsx` | Contoh guard component |
| `frontend/src/stores/auth.store.ts` | Contoh zustand store pattern |

### Aturan yang Harus Diikuti

1. **Tidak ada perubahan database** — Struktur saat ini sudah mendukung role management
2. **Tidak ada library baru** tanpa persetujuan tim
3. **Pattern Controller → Service** — Business logic jangan di Controller
4. **Form Request untuk validasi** — Jangan validasi langsung di Controller
5. **API Resource untuk response** — Jangan return model langsung
6. **Consistent error handling** — Gunakan `BaseController::success()` dan `error()`
7. **snake_case** untuk API response, **camelCase** untuk frontend TypeScript
8. **Bahasa Indonesia** untuk user-facing messages
9. **Frontend gak boleh akses database langsung** — Semua via API
10. **Role string wajib dari constant/enum** — Jangan hardcoded

---

## 1. Executive Summary

Saat ini sistem CommUnity tidak memiliki pemisahan UI berdasarkan role pengguna. Seluruh pengguna (Relawan, Penyelenggara, Koordinator Event, Admin Sistem) melihat halaman dan menu yang **identik** setelah login. Backend sudah memiliki otorisasi berbasis role di beberapa controller, namun frontend tidak mengkonsumsi data role tersebut dan tidak menerapkan role-based rendering sama sekali.

**Dampak langsung:**
- Relawan bisa mengakses halaman `events/create`, `events/{id}/edit`, `events/{id}/attendance`
- Relawan melihat menu "Kelola Organisasi" dan "Kelola Event" yang tidak relevan
- Admin Sistem tidak memiliki dashboard khusus untuk verifikasi organisasi
- Penyelenggara tidak melihat analytics dashboard yang relevan
- Tidak ada konteks organisasi aktif untuk pengguna yang tergabung di banyak organisasi

---

## 2. Root Cause Analysis

### 2.1 Backend: UserResource Tidak Mengirim Data Role

**File:** `backend/app/Http/Resources/UserResource.php`

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'full_name' => $this->full_name,
        'username' => $this->username,
        'email' => $this->email,
        'profile_photo_url' => $this->profile_photo_path
            ? asset('storage/' . $this->profile_photo_path)
            : null,
        'created_at' => $this->created_at,
        // ❌ is_admin TIDAK dikirim
        // ❌ Organizations/roles TIDAK dikirim
    ];
}
```

Backend hanya mengembalikan data dasar. Field `is_admin` (satu-satunya penanda role sistemik di tabel `users`) tidak dikirim. Data role dari `organization_memberships` juga tidak disertakan.

### 2.2 Backend: Role Ditentukan oleh Tiga Mekanisme Berbeda

| Sumber Role | Method | Scope |
|---|---|---|
| `users.is_admin` (boolean) | `$user->is_admin` | System-wide — Admin Sistem |
| `organization_memberships.role` (ENUM) | `$user->organizations()->wherePivot('role', ...)` | Per-organization — Penyelenggara / Koordinator Event |
| Default (no membership) | Implied | System-wide — Relawan |

Karena role bisa berbeda per organisasi, frontend perlu mengetahui role dalam konteks tertentu (misal: untuk event X, user adalah Koordinator; untuk event Y, user tidak punya akses).

### 2.3 Backend: Role Check Hanya di Backend, Tidak Diekspos ke Frontend

Di controller seperti `AttendanceController` dan `EventReportController`, role dicek inline:

```php
private function authorizeEventAccess(Event $event): void
{
    $isOrganizer = $user->organizations()
        ->wherePivot('role', 'Penyelenggara')
        ->where('organization_id', $event->organization_id)
        ->exists();
    // ...
}
```

Logika ini **tidak direplikasi** di frontend dan **tidak ada endpoint** yang memberitahu frontend role apa yang dimiliki user dalam suatu konteks.

### 2.4 Frontend: Tipe `User.role` Tidak Terpakai

**File:** `frontend/src/types/index.ts`

```typescript
export interface User {
    id: string;
    full_name: string;
    email: string;
    username: string;
    role: 'admin' | 'organizer' | 'coordinator' | 'volunteer';  // Ghost field
    profile_photo_url: string | null;
    created_at: string;
}
```

Field `role` didefinisikan tetapi **tidak pernah diisi** karena backend tidak mengirimnya. Seluruh frontend hanya melakukan **0 pengecekan role** — tidak ada satupun conditional seperti `user.role === 'admin'` atau `isAdmin`.

### 2.5 Frontend: AuthGuard Tidak Memeriksa Role

**File:** `frontend/src/components/auth/AuthGuard.tsx`

```typescript
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // ✅ Cek autentikasi — ADA
    // ❌ Cek role — TIDAK ADA
    // ❌ Cek akses ke halaman spesifik — TIDAK ADA
}
```

Hanya mengecek `isAuthenticated`, tidak ada:
- `isAdmin` check
- `isOrganizer` check
- `isEventCoordinator` check
- Route-based role protection

### 2.6 Frontend: Dashboard & Navigasi Seragam

**File:** `frontend/src/app/dashboard/page.tsx`

```tsx
{/* Link ini muncul untuk SEMUA user */}
<Link href="/organizations">Kelola Organisasi</Link>
<Link href="/events">Kelola Event</Link>
<Link href="/registrations">Riwayat Partisipasi</Link>
<Link href="/my-attendances">Riwayat Kehadiran</Link>
```

Tidak ada branching berdasarkan role.

### 2.7 Ringkasan Chain of Failure

```
Backend users.is_admin     Backend organization_memberships.role
       │                             │
       │  ❌ Tidak dikirim           │  ❌ Tidak diekspos via API
       ▼                             ▼
  UserResource (tanpa role)    Frontend tidak tahu role user
       │
       │  ❌ Tidak ada endpoint role context
       ▼
  Frontend User.role = undefined (ghost field)
       │
       │  ❌ AuthGuard tidak cek role
       ▼
  Semua halaman bisa diakses semua user
       │
       │  ❌ Dashboard & Navbar tidak bedakan role
       ▼
  UX kacau: Relawan lihat menu manajemen, Admin tidak punya dashboard khusus
```

---

## 3. Dampak & Risiko

### 3.1 Security Risks

| Risiko | Deskripsi | Severity |
|---|---|---|
| **Unauthorized page access** | Relawan bisa akses `events/create` via direct URL | 🔴 Critical |
| **Data exposure** | Relawan bisa lihat halaman attendance management yang berisi data volunteer lain | 🔴 High |
| **Form submission** | Relawan bisa submit form create/edit event (backend tolak, tapi UX buruk) | 🟡 Medium |

> Catatan: Backend tetap memvalidasi akses di sisi server, sehingga data tidak bisa dimodifikasi secara ilegal. Risiko utama adalah di sisi UX dan informasi yang terekspos.

### 3.2 UX Burdens

| Role | Masalah |
|---|---|
| **Relawan** | Melihat menu "Kelola Organisasi" dan "Kelola Event" yang tidak relevan, membingungkan |
| **Penyelenggara** | Tidak ada dashboard khusus dengan analytics organisasi |
| **Koordinator Event** | Tidak ada tampilan ringkasan event yang dikoordinir |
| **Admin Sistem** | Tidak ada halaman verifikasi organisasi, harus akses via URL langsung |

### 3.3 Business Impact

- **Demonstrasi Expo:** Tidak bisa menunjukkan role-specific workflow dengan jelas
- **User Testing:** Relawan akan bingung dengan menu yang tidak relevan
- **Onboarding:** Pengguna baru tidak mengerti apa yang bisa mereka lakukan di sistem

---

## 4. Comprehensive Security Audit Findings

### 4.1 Critical: 9 Route Tanpa Otorisasi Sama Sekali

Hanya bermodalkan `auth:sanctum`, route berikut bisa diakses **oleh user manapun**:

| Route | Method | Controller | Masalah |
|---|---|---|---|
| `organizations/{org}` | **PATCH** | `OrganizationController@update` | User mana pun bisa mengedit organisasi mana pun |
| `organizations/{org}` | **DELETE** | `OrganizationController@destroy` | User mana pun bisa menghapus organisasi mana pun |
| `organizations/{org}/upload-document` | **POST** | `OrganizationController@uploadDocument` | User mana pun bisa upload dokumen verifikasi untuk org mana pun |
| `organizations/{org}/members` | **POST** | `OrganizationMemberController@store` | User mana pun bisa menambah anggota ke org mana pun |
| `organizations/{org}/members/{member}` | **PATCH** | `OrganizationMemberController@update` | User mana pun bisa mengubah role anggota mana pun |
| `organizations/{org}/members/{member}` | **DELETE** | `OrganizationMemberController@destroy` | User mana pun bisa menghapus anggota dari org mana pun |
| `events/{event}` | **PATCH** | `EventController@update` | User mana pun bisa mengedit event mana pun |
| `events/{event}` | **DELETE** | `EventController@destroy` | User mana pun bisa menghapus event mana pun (kecuali completed) |
| `events/{event}/publish` | **PATCH** | `EventController@publish` | User mana pun bisa mempublikasikan event mana pun |

### 4.2 High: Inconsistensi Otorisasi

| Masalah | Detail |
|---|---|
| **`EventController@store` cek org pertama** | `->first()` mengambil org pertama yang ditemukan, bukan org spesifik yang dituju |
| **`myEvents` hanya ambil org pertama** | User multi-org hanya melihat event dari 1 org — harusnya dari semua org atau berdasarkan konteks |
| **`authorizeCoordinatorOrOrganizer` exclude admin** | Admin tidak bisa membuat/edit/submit report — kemungkinan bug |
| **`is_admin` di `$fillable`** | Mass-assignment risk jika tidak dijaga |
| **`UserResource` tidak kirim `is_admin`** | Frontend tidak bisa bedakan admin dari user biasa |

### 4.3 Medium: Arsitektur Authorization

| Temuan | Detail |
|---|---|
| **Tidak ada `AuthServiceProvider`** | Zero Policies, Zero Gates — tidak ada `$gate->before()` untuk admin bypass |
| **Tidak ada Middleware** | Tidak ada `AdminMiddleware`, `RoleMiddleware`, atau custom middleware apapun |
| **21 FormRequest — hanya 1 punya cek otorisasi** | Hanya `VerifyOrganizationRequest` yang benar-benar cek `is_admin` |
| **Role string hardcoded** | `'Penyelenggara'`, `'Koordinator Event'` ditulis langsung, tidak pakai constant/enum |
| **Service layer zero authorization** | Semua cek di controller — service hanya urus business logic |

### 4.4 Pola Otorisasi yang Ada Saat Ini

| Pattern | File | Digunakan di Method | Check |
|---|---|---|---|
| `authorizeEventAccess()` | `EventReportController` | `show()` | Penyelenggara/Koordinator/is_admin |
| `authorizeEventAccess()` | `AttendanceController` | `generateQr()`, `manual()`, `updateAttendanceStatus()`, `eventAttendances()`, `summary()` | Penyelenggara/Koordinator/is_admin |
| `authorizeCoordinatorOrOrganizer()` | `EventReportController` | `store()`, `update()`, `uploadPhotos()`, `deletePhoto()`, `submit()` | Penyelenggara/Koordinator (NO admin) |
| `authorizeOrganizer()` | `EventReportController` | `review()` | Penyelenggara/is_admin |
| `VerifyOrganizationRequest.authorize()` | FormRequest | `verify()` | is_admin only |

---

## 5. Implementation Plan

### Fase 0: Database — Tidak Ada Perubahan

Struktur database saat ini sudah mendukung role management dengan baik:
- `users.is_admin` (boolean) untuk Admin Sistem
- `organization_memberships.role` (ENUM: Penyelenggara, Koordinator Event) untuk role per organisasi
- Relawan ditentukan secara implisit (user yang tidak punya membership admin/organizer/coordinator)

**Tidak ada perubahan database yang diperlukan.**

---

### Fase 1: Backend — Critical Security Fixes (P0)

#### 1.1 Buat Role Constant / Enum

**File baru:** `backend/app/Enums/OrganizationRole.php`

```php
<?php

namespace App\Enums;

class OrganizationRole
{
    public const PENYELENGGARA = 'Penyelenggara';
    public const KOORDINATOR_EVENT = 'Koordinator Event';

    public static function all(): array
    {
        return [self::PENYELENGGARA, self::KOORDINATOR_EVENT];
    }
}
```

**Tujuan:** Menghilangkan hardcoded string, memudahkan maintenance.

---

#### 1.2 Buat Authorization Helper Trait

**File baru:** `backend/app/Traits/AuthorizesOrganizationAccess.php`

Trait yang berisi method-method reusable untuk cek akses berdasarkan role:

```php
trait AuthorizesOrganizationAccess {
    protected function isOrganizerOf(User $user, Organization $organization): bool { ... }
    protected function isCoordinatorOf(User $user, Organization $organization): bool { ... }
    protected function isOrganizerOrCoordinatorOf(User $user, Organization $organization): bool { ... }
    protected function authorizeOrganizerOf(Organization $organization): void { ... }
    protected function authorizeOrganizerOrCoordinatorOf(Organization $organization): void { ... }
}
```

**Tujuan:** DRY — menghilangkan duplikasi `wherePivot('role', ...)` di 4 controller berbeda.

---

#### 1.3 Fix OrganizationController — Tambah Authorization

**File:** `backend/app/Http/Controllers/Api/V1/OrganizationController.php`

| Method | Authorization yang Ditambahkan |
|---|---|
| `index()` | (Opsional) Hanya tampilkan org yang terverifikasi untuk non-admin. Tidak critical. |
| `show()` | Tidak perlu diubah — info org bersifat publik. |
| **`update()`** | Hanya Penyelenggara dari organisasi tersebut yang bisa update. |
| **`destroy()`** | Hanya Penyelenggara dari organisasi tersebut yang bisa delete. |
| **`uploadDocument()`** | Hanya Penyelenggara dari organisasi tersebut yang bisa upload dokumen. |

---

#### 1.4 Fix OrganizationMemberController — Tambah Authorization

**File:** `backend/app/Http/Controllers/Api/V1/OrganizationMemberController.php`

| Method | Authorization yang Ditambahkan |
|---|---|
| `index()` | (Opsional) Hanya anggota organisasi yang bisa lihat daftar anggota. |
| **`store()`** | Hanya Penyelenggara yang bisa menambah anggota. |
| **`update()`** | Hanya Penyelenggara yang bisa mengubah role anggota. |
| **`destroy()`** | Hanya Penyelenggara yang bisa menghapus anggota. |

---

#### 1.5 Fix EventController — Tambah Authorization

**File:** `backend/app/Http/Controllers/Api/V1/EventController.php`

| Method | Authorization yang Ditambahkan |
|---|---|
| **`store()`** | Terima `organization_id` dari request, validasi user adalah Penyelenggara di org tersebut (bukan first org). |
| `show()` | (Opsional) Tidak perlu diubah — event info bersifat publik untuk published events. |
| **`update()`** | Hanya Penyelenggara atau Koordinator Event dari organisasi pemilik event yang bisa update. |
| **`destroy()`** | Hanya Penyelenggara dari organisasi pemilik event yang bisa delete. |
| **`publish()`** | Hanya Penyelenggara dari organisasi pemilik event yang bisa publish. |
| **`myEvents()`** | Ubah: return events untuk SEMUA organisasi tempat user menjadi anggota (bukan hanya first org). |

---

#### 1.6 Fix EventReportController — Konsistensi is_admin

**File:** `backend/app/Http/Controllers/Api/V1/EventReportController.php`

| Method | Perubahan |
|---|---|
| `authorizeCoordinatorOrOrganizer()` | Tambah `is_admin` sebagai bypass (sama seperti authorizeEventAccess). |

---

### Fase 2: Backend — Expose Role Data ke Frontend (P1)

#### 2.1 Tambah `is_admin` ke UserResource

**File:** `backend/app/Http/Resources/UserResource.php`

```php
'is_admin' => $this->is_admin ?? false,
```

---

#### 2.2 Buat Endpoint `GET /api/v1/my-context`

**File baru:** `backend/app/Http/Controllers/Api/V1/UserContextController.php`

```php
class UserContextController extends BaseController
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $organizations = $user->organizations()
            ->select('organizations.id', 'organizations.name')
            ->withPivot('role')
            ->get()
            ->map(fn($org) => [
                'id' => $org->id,
                'name' => $org->name,
                'role' => $org->pivot->role,
            ]);
        
        return $this->success([
            'is_admin' => $user->is_admin ?? false,
            'organizations' => $organizations,
            'is_organizer' => $organizations->contains('pivot.role', 'Penyelenggara'),
            'is_coordinator' => $organizations->contains('pivot.role', 'Koordinator Event'),
        ], 'Role context berhasil diambil.');
    }
}
```

**Route:** `GET /api/v1/my-context` (protected by `auth:sanctum`)

---

#### 2.3 (Opsional) Buat Event Permission Check Endpoint

**File baru:** `backend/app/Http/Controllers/Api/V1/EventPermissionController.php`

Endpoint: `GET /api/v1/events/{event}/permissions`

Return:
```json
{
  "can_view": true,
  "can_edit": false,
  "can_delete": false,
  "can_publish": false,
  "can_manage_attendance": false,
  "can_submit_report": false,
  "can_review_report": false
}
```

**Tujuan:** Frontend bisa ngecek permission spesifik untuk suatu event tanpa harus mereplikasi logika backend.

---

### Fase 3: Frontend — Role Context & Auth Infrastructure (P0)

#### 3.1 Update Tipe User & Tambah Tipe Role Context

**File:** `frontend/src/types/index.ts`

```typescript
// HAPUS field 'role' dari User, TAMBAH 'is_admin'
export interface User {
    id: string;
    full_name: string;
    email: string;
    username: string;
    is_admin: boolean;
    profile_photo_url: string | null;
    created_at: string;
}

// Tipe baru
export interface UserRoleContext {
    is_admin: boolean;
    organizations: OrganizationMembership[];
    is_organizer: boolean;
    is_coordinator: boolean;
}

export interface OrganizationMembership {
    id: string;
    name: string;
    role: 'Penyelenggara' | 'Koordinator Event';
}
```

---

#### 3.2 Update Auth Store

**File:** `frontend/src/stores/auth.store.ts`

Tambah field `is_admin` ke state. Update `setAuth()` untuk menerima dan menyimpan `is_admin`.

---

#### 3.3 Buat Role Context Store

**File baru:** `frontend/src/stores/role.store.ts`

```typescript
interface RoleState {
    context: UserRoleContext | null;
    isLoading: boolean;
    setContext: (context: UserRoleContext) => void;
    clearContext: () => void;
    // Helper getters
    isAdmin: () => boolean;
    isOrganizer: () => boolean;
    isCoordinator: () => boolean;
    isVolunteer: () => boolean;
    getOrganizations: () => OrganizationMembership[];
    hasRoleInOrganization: (orgId: string, role: string) => boolean;
}
```

Menggunakan Zustand, persist ke localStorage.

---

#### 3.4 Buat Role Context Hook

**File baru:** `frontend/src/hooks/useRoleContext.ts`

```typescript
export function useRoleContext() {
    const query = useQuery({
        queryKey: ['user-context'],
        queryFn: () => api.get('/my-context').then(res => res.data.data),
        staleTime: 5 * 60 * 1000, // 5 menit
        retry: false,
    });
    
    // Update zustand store saat data berubah
    useEffect(() => {
        if (query.data) {
            useRoleStore.getState().setContext(query.data);
        }
    }, [query.data]);
    
    return query;
}
```

---

#### 3.5 Update AuthGuard atau Buat RoleGuard

**File baru:** `frontend/src/components/auth/RoleGuard.tsx`

```tsx
interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Array<'admin' | 'organizer' | 'coordinator'>;
    /** Jika true, user harus memiliki role di organisasi tertentu */
    requireOrganization?: boolean;
    /** Fallback jika tidak punya akses */
    fallback?: React.ReactNode;
}
```

Logika:
1. Jika `admin` di allowedRoles dan user is_admin → allow
2. Jika `organizer` di allowedRoles dan user is_organizer → allow
3. Jika `coordinator` di allowedRoles dan user is_coordinator → allow
4. Jika `requireOrganization` dan user tidak punya org → block
5. Jika tidak ada yang match → redirect ke dashboard atau tampilkan fallback

---

#### 3.6 Proteksi Halaman dengan RoleGuard

| Halaman | Role yang Diizinkan | Metode Proteksi |
|---|---|---|
| `/events` | organizer, coordinator | Layout wrapper |
| `/events/create` | organizer | Layout wrapper atau per-page |
| `/events/[id]/edit` | organizer, coordinator | Layout wrapper |
| `/events/[id]/attendance` | organizer, coordinator | Layout wrapper |
| `/organizations` | organizer | Layout wrapper |
| `/organizations/register` | volunteer, coordinator (who has no org) | Per-page |
| `/organizations/[id]` | organizer, coordinator (of that org) | Per-page (cek membership) |
| `/organizations/[id]/members` | organizer (of that org) | Per-page |
| `/admin/*` | admin | Layout wrapper |
| `/profile` | all authenticated | AuthGuard (existing) |
| `/my-attendances` | volunteer, coordinator | AuthGuard (existing) |
| `/registrations` | volunteer | AuthGuard (existing) |

**Cara proteksi:** Gunakan `RoleGuard` di layout masing-masing halaman.

Contoh:
```typescript
// events/layout.tsx
export default function EventsLayout({ children }) {
    return (
        <RoleGuard allowedRoles={['organizer', 'coordinator']}>
            {children}
        </RoleGuard>
    );
}
```

---

### Fase 4: Frontend — UX Enhancement (P1)

#### 4.1 Role-Based Dashboard Routing

**File:** `frontend/src/app/dashboard/page.tsx`

Logika routing setelah login:
1. Fetch `/my-context`
2. Redirect berdasarkan role:
   - `is_admin = true` → `/admin/dashboard`
   - `is_organizer = true` → `/organizations/{firstOrg}/dashboard` atau `/dashboard/organizer`
   - `is_coordinator = true` → `/events` (filter by coordinated events)
   - `else (volunteer)` → `/discover`

**Alternatif:** Dashboard page yang sama tapi konten berubah berdasarkan role.

---

#### 4.2 Dynamic Navigation / Sidebar

**File:** `frontend/src/components/layout/Navbar.tsx` (atau file navigasi yang ada)

Berdasarkan role context, tampilkan menu yang sesuai:

| Role | Menu Items |
|---|---|
| **Relawan** | Beranda (`/discover`), Partisipasi Saya (`/registrations`), Kehadiran Saya (`/my-attendances`), Profil |
| **Penyelenggara** | Dashboard Organisasi, Event Saya (`/events`), Organisasi Saya (`/organizations`), Laporan, Analytics, Profil |
| **Koordinator Event** | Event Saya (`/events`), Absensi, Laporan, Profil |
| **Admin Sistem** | Dashboard Admin (`/admin/dashboard`), Verifikasi Organisasi, Seluruh Event, Pengguna, Profil |

---

#### 4.3 AuthGuard Update — Fetch Context Setelah Login

**File:** `frontend/src/components/auth/AuthGuard.tsx`

Tambah logic untuk fetch role context setelah user terautentikasi. Panggil `useRoleContext()` untuk memastikan data role selalu tersedia.

---

### Fase 5: Frontend — Role-Specific Pages (P2)

#### 5.1 Admin Dashboard

**File baru:** `frontend/src/app/admin/dashboard/page.tsx`

Halaman khusus admin dengan:
- Statistik: total organisasi, total event, total user
- Organisasi pending verifikasi (list + quick action approve/reject)
- Event terbaru
- User aktif

**Route guard:** Admin only — `RoleGuard allowedRoles={['admin']}`

---

#### 5.2 Admin Verification Page

**File baru:** `frontend/src/app/admin/organizations/page.tsx` (jika belum ada)

Halaman untuk admin melihat dan memverifikasi organisasi.

**Route guard:** Admin only

---

### Fase 6: Testing (P1)

#### 6.1 Backend Tests

| Test | Endpoint | Skenario |
|---|---|---|
| Volunteer cannot update org | `PATCH /organizations/{id}` | 403 |
| Volunteer cannot delete org | `DELETE /organizations/{id}` | 403 |
| Volunteer cannot manage members | `POST/PATCH/DELETE /organizations/{id}/members` | 403 |
| Non-owner cannot update event | `PATCH /events/{id}` | 403 |
| Non-owner cannot delete event | `DELETE /events/{id}` | 403 |
| Non-owner cannot publish event | `PATCH /events/{id}/publish` | 403 |
| Admin can bypass org checks | All above with is_admin | 200 |
| Event create with specific org | `POST /events` with organization_id | Validasi org benar |

#### 6.2 Frontend Tests

| Test | Skenario |
|---|---|
| RoleGuard blocks volunteer | Akses `/events/create` sebagai volunteer → redirect/fallback |
| RoleGuard allows organizer | Akses `/events/create` sebagai organizer → render children |
| Navigation shows correct menus | Login sebagai tiap role, verifikasi navbar |
| Dashboard redirects correctly | Login sebagai tiap role, verifikasi redirect |

---

## 6. Implementation Order (Recommended Sequence)

| Step | Item | Phase | Dependencies | Estimated Effort |
|---|---|---|---|---|
| 1 | Buat `OrganizationRole` enum | Backend P0 | None | 🟢 10 menit |
| 2 | Buat `AuthorizesOrganizationAccess` trait | Backend P0 | Step 1 | 🟢 20 menit |
| 3 | Fix `OrganizationController` — 3 methods | Backend P0 | Step 2 | 🟢 15 menit |
| 4 | Fix `OrganizationMemberController` — 3 methods | Backend P0 | Step 2 | 🟢 15 menit |
| 5 | Fix `EventController` — 5 methods | Backend P0 | Step 2 | 🟡 30 menit |
| 6 | Fix `EventReportController` — is_admin | Backend P0 | Step 2 | 🟢 10 menit |
| 7 | Run backend tests | Backend P0 | Steps 3-6 | 🟡 30 menit |
| 8 | Tambah `is_admin` ke `UserResource` | Backend P1 | None | 🟢 5 menit |
| 9 | Buat endpoint `/my-context` | Backend P1 | None | 🟢 20 menit |
| 10 | Buat endpoint `/events/{id}/permissions` | Backend P1 | None | 🟡 20 menit |
| 11 | Update `User` type + `is_admin` | Frontend P0 | Step 8 | 🟢 10 menit |
| 12 | Update auth store | Frontend P0 | Step 11 | 🟢 10 menit |
| 13 | Buat role context store (Zustand) | Frontend P0 | Step 11 | 🟢 15 menit |
| 14 | Buat `useRoleContext` hook | Frontend P0 | Step 9, 13 | 🟢 15 menit |
| 15 | Buat `RoleGuard` component | Frontend P0 | Step 14 | 🟡 30 menit |
| 16 | Proteksi halaman dengan RoleGuard | Frontend P0 | Step 15 | 🟡 45 menit |
| 17 | Role-based dashboard routing | Frontend P1 | Step 14 | 🟡 30 menit |
| 18 | Dynamic navigation | Frontend P1 | Step 14 | 🟡 45 menit |
| 19 | Admin dashboard page | Frontend P2 | Step 14, 17 | 🟡 60 menit |
| 20 | Update AuthGuard | Frontend P1 | Step 14 | 🟢 10 menit |

---

## 7. Files Created (Complete List)

### Backend

| File | Purpose |
|---|---|
| `backend/app/Enums/OrganizationRole.php` | Constants for role strings |
| `backend/app/Traits/AuthorizesOrganizationAccess.php` | Reusable authorization methods |
| `backend/app/Http/Controllers/Api/V1/UserContextController.php` | Endpoint `/my-context` |
| `backend/app/Http/Controllers/Api/V1/EventPermissionController.php` | Endpoint `/events/{id}/permissions` |

### Frontend

| File | Purpose |
|---|---|
| `frontend/src/stores/role.store.ts` | Zustand store for role context |
| `frontend/src/hooks/useRoleContext.ts` | TanStack Query hook for `/my-context` |
| `frontend/src/components/auth/RoleGuard.tsx` | Role-based route protection |
| `frontend/src/app/admin/dashboard/page.tsx` | Admin dashboard |
| `frontend/src/app/admin/layout.tsx` | Admin layout with RoleGuard |

## 8. Files Modified (Complete List)

### Backend

| File | Changes |
|---|---|
| `backend/app/Http/Resources/UserResource.php` | Tambah `is_admin` |
| `backend/app/Http/Controllers/Api/V1/OrganizationController.php` | Tambah authorize checks di update, destroy, uploadDocument |
| `backend/app/Http/Controllers/Api/V1/OrganizationMemberController.php` | Tambah authorize checks di store, update, destroy |
| `backend/app/Http/Controllers/Api/V1/EventController.php` | Tambah authorize checks di store, update, destroy, publish; fix myEvents |
| `backend/app/Http/Controllers/Api/V1/EventReportController.php` | Tambah `is_admin` bypass di authorizeCoordinatorOrOrganizer |
| `backend/routes/api.php` | Tambah route `/my-context`, `/events/{id}/permissions` |
| `backend/app/Http/Requests/Event/StoreEventRequest.php` | Tambah `organization_id` validation |

### Frontend

| File | Changes |
|---|---|
| `frontend/src/types/index.ts` | Hapus `role`, tambah `is_admin`, `UserRoleContext`, `OrganizationMembership` |
| `frontend/src/stores/auth.store.ts` | Tambah `is_admin` ke state |
| `frontend/src/components/auth/AuthGuard.tsx` | Panggil `useRoleContext()` untuk fetch context |
| `frontend/src/app/dashboard/page.tsx` | Role-based routing/konten |
| `frontend/src/app/layout.tsx` (atau navbar component) | Dynamic navigation berdasarkan role |

---

## 9. Acceptance Criteria

### Backend

| AC | Keterangan |
|---|---|
| ✅ Hanya Penyelenggara dari suatu organisasi yang bisa edit/hapus organisasi tersebut |
| ✅ Hanya Penyelenggara dari suatu organisasi yang bisa manage anggota |
| ✅ Hanya Penyelenggara/Koordinator dari organisasi pemilik event yang bisa edit/hapus/publish event |
| ✅ Event create menerima `organization_id` dan memvalidasi user adalah Penyelenggara di org tersebut |
| ✅ `myEvents` menampilkan event dari semua organisasi tempat user menjadi anggota |
| ✅ `is_admin` dikirim di response UserResource |
| ✅ Endpoint `/my-context` mengembalikan data role user |
| ✅ Admin dapat bypass semua pengecekan organisasi |
| ✅ Event permission endpoint mengembalikan permission yang akurat |

### Frontend

| AC | Keterangan |
|---|---|
| ✅ RoleGuard memblokir akses volunteer ke halaman manajemen |
| ✅ RoleGuard mengizinkan akses Penyelenggara/Koordinator ke halaman yang sesuai |
| ✅ Dashboard menampilkan konten yang relevan berdasarkan role |
| ✅ Navigasi berubah secara dinamis berdasarkan role |
| ✅ Admin memiliki dashboard khusus |
| ✅ Halaman events/organizations terlindungi dari akses volunteer |

---

## 10. Architecture Diagram (After Fix)

### 10.1 Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             COMMUNTITY SYSTEM                               │
│                          (Role Management After Fix)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴──────────────────────────┐
          ▼                                                    ▼
┌───────────────────────┐                          ┌───────────────────────┐
│   LARAVEL BACKEND     │     REST API (JSON)       │   NEXT.JS FRONTEND   │
│   (API /api/v1)       │ ◄──────────────────────► │   (React + TS)       │
│                       │   Sanctum Auth Token      │                       │
│   Port: 8000          │                          │   Port: 3000          │
└───────────────────────┘                          └───────────────────────┘
```

### 10.2 Backend Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND — LAYERED STRUCTURE                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        ROUTES (routes/api.php)                       │  │
│  │                                                                      │  │
│  │  PUBLIC:                                                             │  │
│  │    POST   /login ──────────► AuthController@login                   │  │
│  │    POST   /register ───────► AuthController@register                │  │
│  │                                                                      │  │
│  │  PROTECTED (Sanctum):                                                │  │
│  │    ┌── AUTH ──┐                                                      │  │
│  │    │ GET  /user              ──► UserController@index               │  │
│  │    │ GET  /my-context        ──► UserContextController@index  ★NEW  │  │
│  │    └─────────────────────────────────────────────────────────────────│  │
│  │    ┌── EVENTS ──┐                                                   │  │
│  │    │ GET  /events             ──► EventController@index             │  │
│  │    │ POST /events             ──► EventController@store      ★FIXED│  │
│  │    │ GET  /events/{id}        ──► EventController@show              │  │
│  │    │ PUT  /events/{id}        ──► EventController@update     ★FIXED│  │
│  │    │ DELETE /events/{id}      ──► EventController@destroy    ★FIXED│  │
│  │    │ GET  /my-events          ──► EventController@myEvents   ★FIXED│  │
│  │    │ POST /events/{id}/publish─► EventController@publish    ★FIXED│  │
│  │    │ GET  /events/{id}/permissions ─► EventPermissionController    │  │
│  │    │                              @index                     ★NEW  │  │
│  │    └─────────────────────────────────────────────────────────────────│  │
│  │    ┌── ORGANIZATIONS ──┐                                             │  │
│  │    │ GET    /organizations         ──► OrganizationController@index │  │
│  │    │ POST   /organizations         ──► OrganizationController@store │  │
│  │    │ GET    /organizations/{id}    ──► OrganizationController@show  │  │
│  │    │ PUT    /organizations/{id}    ──► OrganizationController@update│  │
│  │    │ DELETE /organizations/{id}    ──► OrganizationController@destroy│  │
│  │    │ POST   /organizations/{id}/documents ──► uploadDocument        │  │
│  │    │                                         ★FIXED                  │  │
│  │    └─────────────────────────────────────────────────────────────────│  │
│  │    ┌── ORGANIZATION MEMBERS ──┐                                     │  │
│  │    │ GET    /organizations/{org}/members ──► index                  │  │
│  │    │ POST   /organizations/{org}/members ──► store         ★FIXED  │  │
│  │    │ PUT    /organizations/{org}/members/{id} ──► update   ★FIXED  │  │
│  │    │ DELETE /organizations/{org}/members/{id} ──► destroy  ★FIXED  │  │
│  │    └─────────────────────────────────────────────────────────────────│  │
│  │    ┌── ADMIN ──┐                                                    │  │
│  │    │ GET  /admin/stats          ──► AdminStatsController@index  ★NEW│  │
│  │    │ GET  /admin/organizations  ──► AdminOrganizationController     │  │
│  │    │                              @index                      ★NEW  │  │
│  │    │ PATCH /admin/organizations/{id}/verify ──►              ★NEW  │  │
│  │    │       AdminOrganizationController@verify                       │  │
│  │    │ GET  /admin/users          ──► AdminUserController@index  ★NEW│  │
│  │    └─────────────────────────────────────────────────────────────────│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  SERVICE / TRAIT LAYER                                │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────┐                    │  │
│  │  │  AuthorizesOrganizationAccess Trait  ★NEW     │                    │  │
│  │  │                                              │                    │  │
│  │  │  Methods:                                    │                    │  │
│  │  │  ┌────────────────────────────────────────┐  │                    │  │
│  │  │  │ authorizeOrganizerOf(org, user)        │  │  ── Cek pivot      │  │
│  │  │  │   → wherePivot('role',                 │  │  │  role ==       │  │
│  │  │  │     OrganizationRole::Organizer)       │  │  │  Penyelenggara  │  │
│  │  │  │   → atau is_admin bypass               │  │  │                │  │
│  │  │  │   → throw HttpResponseException(403)   │  │  │                │  │
│  │  │  ├────────────────────────────────────────┤  │  │                │  │
│  │  │  │ authorizeOrganizerOrCoordinatorOf(     │  │  │── Cek pivot     │  │
│  │  │  │   org, user)                           │  │  │  role in       │  │
│  │  │  │   → role in [Organizer, Coordinator]   │  │  │  [Org, Coord]  │  │
│  │  │  │   → atau is_admin bypass               │  │  │                │  │
│  │  │  │   → throw HttpResponseException(403)   │  │  │                │  │
│  │  │  ├────────────────────────────────────────┤  │  │                │  │
│  │  │  │ authorizeOrganizationMembership(       │  │  │── Cek pivot     │  │
│  │  │  │   org, user)                           │  │  │  any role      │  │
│  │  │  │   → exists di pivot                    │  │  │                │  │
│  │  │  │   → atau is_admin bypass               │  │  │                │  │
│  │  │  │   → throw HttpResponseException(403)   │  │  │                │  │
│  │  │  └────────────────────────────────────────┘  │                    │  │
│  │  └──────────────────────────────────────────────┘                    │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────┐                    │  │
│  │  │  OrganizationRole Enum  ★NEW                  │                    │  │
│  │  │                                              │                    │  │
│  │  │  case Organizer    = 'Penyelenggara'         │                    │  │
│  │  │  case Coordinator  = 'Koordinator Event'     │                    │  │
│  │  └──────────────────────────────────────────────┘                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                   FORM REQUEST LAYER                                  │  │
│  │                                                                      │  │
│  │  StoreEventRequest ★FIXED                                            │  │
│  │    │                                                                  │  │
│  │    │  Tambah: organization_id (required, exists:organizations,id)     │  │
│  │    │  Validasi: user harus Penyelenggara di org tsb                   │  │
│  │    └────────────────────────────────────────────────────────────────  │  │
│  │                                                                      │  │
│  │  OrganizationRequest (existing)                                       │  │
│  │  OrganizationMemberRequest (existing)                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    RESOURCE / RESPONSE LAYER                          │  │
│  │                                                                      │  │
│  │  UserResource ★FIXED                                                 │  │
│  │    │  ┌──────────────────────┐                                       │  │
│  │    │  │ id                    │                                       │  │
│  │    │  │ name                  │                                       │  │
│  │    │  │ email                 │                                       │  │
│  │    │  │ phone                 │                                       │  │
│  │    │  │ avatar_url            │                                       │  │
│  │    │  │ is_admin  ★NEW        │  ← boolean                           │  │
│  │    │  └──────────────────────┘                                       │  │
│  │                                                                      │  │
│  │  UserContextResource (inline di controller) ★NEW                     │  │
│  │    │  ┌─────────────────────────────┐                                │  │
│  │    │  │ is_admin: boolean           │                                │  │
│  │    │  │ is_organizer: boolean       │                                │  │
│  │    │  │ is_coordinator: boolean     │                                │  │
│  │    │  │ organizations: []           │                                │  │
│  │    │  │   └─ id, name, role         │                                │  │
│  │    │  └─────────────────────────────┘                                │  │
│  │                                                                      │  │
│  │  EventPermissionResource (inline) ★NEW                               │  │
│  │    │  ┌─────────────────────────────────┐                            │  │
│  │    │  │ can_view: boolean               │                            │  │
│  │    │  │ can_edit: boolean               │                            │  │
│  │    │  │ can_delete: boolean             │                            │  │
│  │    │  │ can_publish: boolean            │                            │  │
│  │    │  │ can_manage_attendance: boolean  │                            │  │
│  │    │  │ can_manage_members: boolean     │                            │  │
│  │    │  └─────────────────────────────────┘                            │  │
│  │                                                                      │  │
│  │  BaseController (existing)                                           │  │
│  │    │  ┌──────────────────────┐                                       │  │
│  │    │  │ successResponse()    │  → { status, message, data }          │  │
│  │    │  │ errorResponse()      │  → { status, message, errors }        │  │
│  │    │  └──────────────────────┘                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    DATABASE MODELS                                    │  │
│  │                                                                      │  │
│  │  ┌──────────┐   ┌──────────────────────┐   ┌──────────────┐        │  │
│  │  │   User   │   │organization_membership│   │Organization  │        │  │
│  │  │──────────│   │ (pivot)              │   │──────────────│        │  │
│  │  │ id       │──┐│──────────────────────│   │ id           │        │  │
│  │  │ name     │  ││ user_id              │──┘│ name         │        │  │
│  │  │ email    │  ││ organization_id      │──┐│ email        │        │  │
│  │  │ password │  ││ role (enum)          │  ││ status       │        │  │
│  │  │ is_admin │  ││                     │  ││ status       │        │  │
│  │  │ avatar   │  ││ Values:             │  ││ (pending/    │        │  │
│  │  └──────────┘  ││  - Penyelenggara    │  ││  verified/   │        │  │
│  │                ││  - Koordinator Event│  ││  rejected)   │        │  │
│  │                │└──────────────────────┘  └──────────────┘        │  │
│  │                │                                                  │  │
│  │  ┌──────────┐  │   ┌──────────┐        ┌──────────────────┐      │  │
│  │  │  Event   │  │   │Attendance│        │  EventReport     │      │  │
│  │  │──────────│  │   │──────────│        │──────────────────│      │  │
│  │  │ id       │  │   │ id       │        │ id               │      │  │
│  │  │ title    │  │   │ user_id  │────────│ event_id         │      │  │
│  │  │ organization_id──┘         │        │ status (draft/  │      │  │
│  │  │ status   │      │ status   │        │   submitted/    │      │  │
│  │  │ (draft/  │      │ (hadir/  │        │   approved/     │      │  │
│  │  │  ongoing/│      │  tidak)  │        │   revision)     │      │  │
│  │  │  completed│     └──────────┘        │ images (json)   │      │  │
│  │  │  cancelled)│                        └──────────────────┘      │  │
│  │  └──────────┘                                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Frontend Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND — COMPONENT STRUCTURE                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     STORES (Zustand + Persist)                       │  │
│  │                                                                      │  │
│  │  ┌────────────────────────────┐  ┌──────────────────────────────┐   │  │
│  │  │     auth.store.ts          │  │      role.store.ts  ★NEW      │   │  │
│  │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━│  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│   │  │
│  │  │ user: User | null         │  │ context: UserRoleContext     │   │  │
│  │  │ token: string | null      │  │ isAdmin: boolean             │   │  │
│  │  │ isAdmin: boolean ★NEW     │  │ isOrganizer: boolean         │   │  │
│  │  │                          │  │ isCoordinator: boolean       │   │  │
│  │  │ login()                  │  │ organizations: []             │   │  │
│  │  │ logout()                 │  │                              │   │  │
│  │  │ setAuth() ★FIXED         │  │ setContext()                 │   │  │
│  │  └────────────────────────────┘  └──────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     HOOKS (TanStack Query)                            │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────┐                            │  │
│  │  │  useRoleContext() ★NEW               │                            │  │
│  │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│                            │  │
│  │  │  Query: GET /api/v1/my-context       │                            │  │
│  │  │  On success → sync ke role.store     │                            │  │
│  │  │  Auto-refresh on mount               │                            │  │
│  │  └──────────────────────────────────────┘                            │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────┐                            │  │
│  │  │  useAdmin() ★NEW                     │                            │  │
│  │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│                            │  │
│  │  │  useAdminStats()                     │  GET /admin/stats          │  │
│  │  │  useAdminOrganizations(params)       │  GET /admin/organizations  │  │
│  │  │  useVerifyOrganization()             │  PATCH /admin/orgs/{id}/  │  │
│  │  │  useAdminUsers(params)               │       verify              │  │
│  │  │                                      │  GET /admin/users          │  │
│  │  └──────────────────────────────────────┘                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                 COMPONENTS — AUTH & LAYOUT                            │  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  │  AuthGuard ★FIXED                                               │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │  │
│  │  │  │  Cek: token di auth store?                                 │  │  │
│  │  │  │  Jika tidak → redirect /login                              │  │  │
│  │  │  │  Jika ya → panggil useRoleContext() ★NEW                   │  │  │
│  │  │  │         → render children                                  │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  RoleGuard ★NEW                                                 │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │  │
│  │  │  │  Props:                                                    │  │  │
│  │  │  │    allowedRoles: ('admin' | 'organizer' |                  │  │  │
│  │  │  │                  'coordinator')[]                          │  │  │
│  │  │  │    requireOrganization?: boolean                           │  │  │
│  │  │  │    organizationId?: string (optional)                      │  │  │
│  │  │  │    fallback?: ReactNode                                    │  │  │
│  │  │  │                                                            │  │  │
│  │  │  │  Logic:                                                    │  │  │
│  │  │  │  1. Cek role store → ambil context                         │  │  │
│  │  │  │  2. Cek isAdmin → jika ya, bypass                          │  │  │
│  │  │  │  3. Cek allowedRoles → apakah role user match?             │  │  │
│  │  │  │  4. Jika organizationId → cek membership di org tsb        │  │  │
│  │  │  │  5. Jika tidak lolos → render fallback (default: 403)     │  │  │
│  │  │  │  6. Jika lolos → render children                           │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Navbar ★NEW                                                    │  │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │  │
│  │  │  │  Unauthenticated:   Beranda | Login | Daftar               │  │  │
│  │  │  │                                                            │  │  │
│  │  │  │  Admin:            Dashboard Admin | Verifikasi | Logout   │  │  │
│  │  │  │                                                            │  │  │
│  │  │  │  Penyelenggara:    Organisasi | Event | Dashboard | Logout │  │  │
│  │  │  │                                                            │  │  │
│  │  │  │  Koordinator:      Event | Dashboard | Logout              │  │  │
│  │  │  │                                                            │  │  │
│  │  │  │  Relawan:          Beranda | Partisipasi Saya | Logout     │  │  │
│  │  │  │                                                            │  │  │
│  │  │  │  Mobile: Hamburger menu (responsive)                       │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     PAGE LAYOUTS & ROUTING                            │  │
│  │                                                                      │  │
│  │  ┌───────────────────────────────────────────────────────────────┐   │  │
│  │  │  /dashboard ★FIXED                                            │   │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │   │  │
│  │  │  │  Redirect hub berdasarkan role:                          │ │   │  │
│  │  │  │  ┌──────────────┬────────────────────────────────────┐  │ │   │  │
│  │  │  │  │ admin        │ → /admin/dashboard                 │  │ │   │  │
│  │  │  │  ├──────────────┼────────────────────────────────────┤  │ │   │  │
│  │  │  │  │ organizer    │ → /organizations                   │  │ │   │  │
│  │  │  │  ├──────────────┼────────────────────────────────────┤  │ │   │  │
│  │  │  │  │ coordinator  │ → /events                          │  │ │   │  │
│  │  │  │  ├──────────────┼────────────────────────────────────┤  │ │   │  │
│  │  │  │  │ volunteer    │ → /discover                        │  │ │   │  │
│  │  │  │  └──────────────┴────────────────────────────────────┘  │ │   │  │
│  │  │  └─────────────────────────────────────────────────────────┘ │   │  │
│  │  └───────────────────────────────────────────────────────────────┘   │  │
│  │                                                                      │  │
│  │  ┌───────────────────────────────────────────────────────────────┐   │  │
│  │  │  /admin/* ★NEW                                               │   │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │   │  │
│  │  │  │  layout.tsx → RoleGuard allowedRoles={['admin']}        │ │   │  │
│  │  │  │                                                         │ │   │  │
│  │  │  │  /admin/dashboard                                       │ │   │  │
│  │  │  │    → 4 stat cards (users, orgs, events, reports)        │ │   │  │
│  │  │  │    → Alert: Pending organizations                       │ │   │  │
│  │  │  │    → Recent events list                                 │ │   │  │
│  │  │  │    → Recent users list                                  │ │   │  │
│  │  │  │                                                         │ │   │  │
│  │  │  │  /admin/organizations                                   │ │   │  │
│  │  │  │    → Filter: all | pending | verified | rejected        │ │   │  │
│  │  │  │    → Tabel organisasi                                   │ │   │  │
│  │  │  │    → Tombol Approve / Reject (dengan modal alasan)      │ │   │  │
│  │  │  └─────────────────────────────────────────────────────────┘ │   │  │
│  │  └───────────────────────────────────────────────────────────────┘   │  │
│  │                                                                      │  │
│  │  ┌───────────────────────────────────────────────────────────────┐   │  │
│  │  │  /events/* ★FIXED                                            │   │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │   │  │
│  │  │  │  layout.tsx → RoleGuard allowedRoles={['organizer',     │ │   │  │
│  │  │  │                              'coordinator']}            │ │   │  │
│  │  │  │                                                         │ │   │  │
│  │  │  │  /events              → List event (myEvents)           │ │   │  │
│  │  │  │  /events/create       → Form create event               │ │   │  │
│  │  │  │  /events/{id}         → Detail event                    │ │   │  │
│  │  │  │  /events/{id}/edit    → Form edit event                 │ │   │  │
│  │  │  │  /events/{id}/attendance      → Manajemen absensi       │ │   │  │
│  │  │  │  /events/{id}/attendance/scan → Scan QR                 │ │   │  │
│  │  │  └─────────────────────────────────────────────────────────┘ │   │  │
│  │  └───────────────────────────────────────────────────────────────┘   │  │
│  │                                                                      │  │
│  │  ┌───────────────────────────────────────────────────────────────┐   │  │
│  │  │  /organizations/* ★FIXED                                      │   │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │   │  │
│  │  │  │  /organizations                                         │ │   │  │
│  │  │  │    → RoleGuard allowedRoles={['organizer']}             │ │   │  │
│  │  │  │    → Daftar organisasi milik user                       │ │   │  │
│  │  │  │                                                         │ │   │  │
│  │  │  │  /organizations/{id}                                    │ │   │  │
│  │  │  │    → RoleGuard allowedRoles={['organizer','coordinator']│ │   │  │
│  │  │  │            organizationId={id}                          │ │   │  │
│  │  │  │    → Detail + anggota organisasi                        │ │   │  │
│  │  │  └─────────────────────────────────────────────────────────┘ │   │  │
│  │  └───────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                   SERVICES (API Client)                               │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────┐                            │  │
│  │  │  admin.service.ts ★NEW               │                            │  │
│  │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│                            │  │
│  │  │  getStats()         → GET /admin/     │                            │  │
│  │  │                       stats          │                            │  │
│  │  │  getOrganizations() → GET /admin/     │                            │  │
│  │  │                       organizations  │                            │  │
│  │  │  verifyOrganization→ PATCH /admin/    │                            │  │
│  │  │    (id, data)         orgs/{id}/verify│                            │  │
│  │  │  getUsers(params)   → GET /admin/users │                            │  │
│  │  └──────────────────────────────────────┘                            │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────┐                            │  │
│  │  │  role.service.ts (via hook) ★NEW     │                            │  │
│  │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│                            │  │
│  │  │  getRoleContext() → GET /my-context  │                            │  │
│  │  └──────────────────────────────────────┘                            │  │
│  │                                                                      │  │
│  │  (EventService, OrganizationService, AuthService — existing)         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      TYPES (TypeScript) ★FIXED                        │  │
│  │                                                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────  │  │
│  │  │  User ★FIXED:                                                   │  │
│  │  │    ┌──────────────────────────────────────────┐                 │  │
│  │  │    │  id: string                              │                 │  │
│  │  │    │  name: string                            │                 │  │
│  │  │    │  email: string                           │                 │  │
│  │  │    │  phone: string                           │                 │  │
│  │  │    │  avatar_url: string                      │                 │  │
│  │  │    │  is_admin: boolean          ★NEW         │  ← ganti role   │  │
│  │  │    └──────────────────────────────────────────┘                 │  │
│  │  │                                                                 │  │
│  │  │  UserRoleContext ★NEW:                                          │  │
│  │  │    ┌──────────────────────────────────────────┐                 │  │
│  │  │    │  is_admin: boolean                        │                 │  │
│  │  │    │  is_organizer: boolean                    │                 │  │
│  │  │    │  is_coordinator: boolean                  │                 │  │
│  │  │    │  organizations: OrganizationMembership[]  │                 │  │
│  │  │    └──────────────────────────────────────────┘                 │  │
│  │  │                                                                 │  │
│  │  │  OrganizationMembership ★NEW:                                   │  │
│  │  │    ┌──────────────────────────────────────────┐                 │  │
│  │  │    │  id: number                              │                 │  │
│  │  │    │  name: string                            │                 │  │
│  │  │    │  role: string                            │                 │  │
│  │  │    └──────────────────────────────────────────┘                 │  │
│  │  │                                                                 │  │
│  │  │  DashboardStats ★NEW:                                           │  │
│  │  │    ┌──────────────────────────────────────────┐                 │  │
│  │  │    │  total_users: number                     │                 │  │
│  │  │    │  total_organizations: number             │                 │  │
│  │  │    │  total_events: number                    │                 │  │
│  │  │    │  total_reports: number                   │                 │  │
│  │  │    │  pending_organizations: number            │                 │  │
│  │  │    └──────────────────────────────────────────┘                 │  │
│  │  │                                                                 │  │
│  │  │  Organization ★FIXED:                                           │  │
│  │  │    ┌──────────────────────────────────────────┐                 │  │
│  │  │    │  ...existing fields                       │                 │  │
│  │  │    │  organization_email: string  ★NEW        │                 │  │
│  │  │    │  rejection_reason: string    ★NEW        │                 │  │
│  │  │    │  members_count: number       ★NEW        │                 │  │
│  │  │    └──────────────────────────────────────────┘                 │  │
│  │  └────────────────────────────────────────────────────────────────  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### 10.4 Authentication & Authorization Flow

```
                         AUTH FLOW (Login → Protected Page)
                         ═════════════════════════════════

  User                  Frontend                              Backend
  ────                  ────────                              ───────
    │                      │                                     │
    │   Login Form         │                                     │
    │────────────────────►│  POST /api/v1/login                  │
    │                      │──────────────────────────────────►│
    │                      │                                     │
    │                      │         { token, user }             │
    │                      │◄──────────────────────────────────│
    │                      │                                     │
    │                      │  Auth Store ← token + user          │
    │                      │  (is_admin tersimpan)               │
    │                      │                                     │
    │  Redirect ke         │                                     │
    │  /dashboard          │                                     │
    │◄────────────────────│                                     │
    │                      │                                     │
    │                      │  Dashboard Page:                    │
    │                      │  ├─ Cek role store (Zustand)        │
    │                      │  ├─ useRoleContext() → fetch        │
    │                      │  │  GET /my-context                 │
    │                      │  │───────────────────────────────►│
    │                      │  │                                 │
    │                      │  │  { is_admin, is_organizer,      │
    │                      │  │    is_coordinator, orgs[] }      │
    │                      │  │◄───────────────────────────────│
    │                      │  │                                 │
    │                      │  │  Role Store ← update context    │
    │                      │  │                                 │
    │                      │  └─ Redirect berdasarkan role:     │
    │                      │      admin      → /admin/dashboard │
    │                      │      organizer  → /organizations   │
    │                      │      coordinator→ /events          │
    │                      │      volunteer  → /discover        │
    │                      │                                     │
    │   Akses halaman      │                                     │
    │   terproteksi        │  Layout Page (e.g. /admin/*)        │
    │────────────────────►│  RoleGuard:                          │
    │                      │  ├─ allowedRoles={['admin']}        │
    │                      │  ├─ Cek role store                  │
    │                      │  ├─ Apakah admin?                   │
    │                      │  │   Ya  → render children          │
    │                      │  │   Tidak→ fallback (403)          │
    │                      │                                     │
    │                      │  Event Permission Check             │
    │                      │  (halaman detail event)             │
    │                      │  GET /events/{id}/permissions       │
    │                      │───────────────────────────────────►│
    │                      │                                     │
    │                      │  { can_view, can_edit,              │
    │                      │    can_delete, can_publish,         │
    │                      │    can_manage_attendance }           │
    │                      │◄───────────────────────────────────│
    │                      │                                     │
    │                      │  → Tampilkan/sembunyikan tombol     │
    │                      │    aksi berdasarkan permission      │
    │                      │                                     │


                  AUTHORIZATION LOGIC (Backend — Trait)
                  ══════════════════════════════════════

  ┌─────────────────────────────────────────────────────────────────────────┐
  │  AuthorizesOrganizationAccess Trait                                     │
  │                                                                         │
  │  authorizeOrganizerOf(Organization $org, User $user): void              │
  │  ───────────────────────────────────────────────────────────────────    │
  │  1. if ($user->is_admin) → return (bypass)                             │
  │  2. $membership = $org->members()->where('user_id', $user->id)->first() │
  │  3. if (!$membership || $membership->role !== 'Penyelenggara')          │
  │       → throw HttpResponseException(403, 'Anda bukan Penyelenggara...') │
  │  4. return                                                              │
  │                                                                         │
  │  authorizeOrganizerOrCoordinatorOf(Organization $org, User $user): void │
  │  ───────────────────────────────────────────────────────────────────    │
  │  1. if ($user->is_admin) → return (bypass)                             │
  │  2. $membership = $org->members()->where('user_id', $user->id)->first() │
  │  3. if (!$membership || !in_array($membership->role,                    │
  │       ['Penyelenggara', 'Koordinator Event']))                          │
  │       → throw HttpResponseException(403, 'Akses ditolak...')           │
  │  4. return                                                              │
  │                                                                         │
  │  authorizeOrganizationMembership(Organization $org, User $user): void   │
  │  ───────────────────────────────────────────────────────────────────    │
  │  1. if ($user->is_admin) → return (bypass)                             │
  │  2. if (!$org->members()->where('user_id', $user->id)->exists())        │
  │       → throw HttpResponseException(403, 'Anda bukan anggota...')      │
  │  3. return                                                              │
  └─────────────────────────────────────────────────────────────────────────┘


                  ROLE RESOLUTION (Frontend)
                  ════════════════════════════

  ┌─────────────────────────────────────────────────────────────────────────┐
  │  Role determination logic (dari response /my-context)                    │
  │                                                                         │
  │  ┌──────────────────┬──────────────────┬──────────────────────────────┐ │
  │  │ Role             │ is_admin         │ organizations[]               │ │
  │  ├──────────────────┼──────────────────┼──────────────────────────────┤ │
  │  │ Admin            │ true             │ any (diabaikan)               │ │
  │  │ Penyelenggara    │ false            │ contains 'Penyelenggara'      │ │
  │  │ Koordinator      │ false            │ contains 'Koordinator Event'  │ │
  │  │                  │                  │ (tidak ada 'Penyelenggara')   │ │
  │  │ Relawan          │ false            │ [] (tidak ada membership)     │ │
  │  └──────────────────┴──────────────────┴──────────────────────────────┘ │
  │                                                                         │
  │  Frontend logic:                                                         │
  │  const isVolunteer = !context.is_admin                                  │
  │    && !context.is_organizer                                              │
  │    && !context.is_coordinator;                                           │
  └─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Notes & Caveats

### 11.1 EventController@store — Organization ID

Perubahan penting: `StoreEventRequest` perlu field `organization_id` baru agar user bisa memilih organisasi mana yang akan membuat event. Saat ini backend otomatis memilih org pertama user yang ber-role Penyelenggara.

Validasi yang diperlukan:
1. `organization_id` required, exists di tabel organizations
2. User harus memiliki role 'Penyelenggara' di organisasi tersebut
3. Organisasi harus terverifikasi

### 11.2 myEvents untuk Multi-Organization

Saat ini:
```php
$organization = $request->user()->organizations()->first();
```

Setelah fix:
```php
$organizationIds = $request->user()->organizations()->pluck('organizations.id');
$events = Event::whereIn('organization_id', $organizationIds)->get();
```

### 11.3 Role untuk Relawan

Relawan tidak memiliki record di `organization_memberships`. Role ini ditentukan secara implisit:
- User yang terdaftar di sistem
- Tidak memiliki `is_admin = true`
- Tidak memiliki membership dengan role Penyelenggara atau Koordinator Event

Frontend dapat menentukan role Relawan dengan:
```typescript
const isVolunteer = !context.is_admin && !context.is_organizer && !context.is_coordinator;
```

### 11.4 Organisasi Non-Aktif / Pending

Organisasi dengan status `pending` atau `rejected` harus di-handle:
- Penyelenggara tetap bisa melihat organisasi yang pending
- Organisasi yang rejected tidak bisa membuat event
- Hanya admin yang bisa verifikasi

---

## 12. Kesimpulan

Perbaikan role management membutuhkan **3 fase** dengan total **20 langkah**:

| Fase | Fokus | Steps | Estimated Effort |
|---|---|---|---|
| 🔴 Backend P0 | Security fixes — 9 critical routes | 1-7 | 🟡 2-3 jam |
| 🟡 Backend P1 | Expose role data to frontend | 8-10 | 🟢 1 jam |
| 🔴 Frontend P0 | Role context, RoleGuard, route protection | 11-16 | 🟡 3-4 jam |
| 🟡 Frontend P1 | Dashboard routing, dynamic navigation | 17-18, 20 | 🟡 2 jam |
| 🟢 Frontend P2 | Admin dashboard | 19 | 🟡 1-2 jam |

Prioritas tertinggi adalah **keamanan backend** (Fase 1) karena ada 9 route tanpa otorisasi sama sekali, diikuti **RoleGuard frontend** (Fase 3) untuk mencegah akses halaman yang tidak sah. Perbaikan UI/UX (dashboard routing, navigasi dinamis) menyusul setelah fondasi keamanan terbangun.

---

*Dokumen ini disusun berdasarkan audit menyeluruh terhadap codebase backend dan frontend CommUnity.*
