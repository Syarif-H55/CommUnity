# TASK-010: Organization Member Management

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Organization Member Management |
| **Owner** | Syarif |
| **Support Owner** | Abdillah |
| **Priority** | Medium |
| **Estimated Effort** | M |
| **Dependencies** | TASK-008 |

---

## Objective

Mengelola anggota organisasi dan role organisasi.

---

## Files Created

| File | Deskripsi |
|---|---|
| `app/Services/MembershipService.php` | Service layer: listMembers(), addMember(), removeMember(), assignRole() — validasi duplikasi & role |
| `app/Http/Requests/Organization/StoreMemberRequest.php` | Validasi: user_id required & exists, role required & in (Penyelenggara/Koordinator Event) |
| `app/Http/Requests/Organization/UpdateMemberRoleRequest.php` | Validasi: role required & in (Penyelenggara/Koordinator Event) |
| `app/Http/Resources/MemberResource.php` | Transformasi response dengan nested user object (full_name, username, profile_photo_url) |
| `app/Http/Controllers/Api/V1/OrganizationMemberController.php` | Controller: index (list), store (add), update (role), destroy (remove) |
| `tests/Feature/Organization/MembershipTest.php` | 12 feature tests mencakup seluruh workflow membership |

## Files Modified

| File | Perubahan |
|---|---|
| `app/Services/OrganizationService.php` | Fix UUID `id` pada `attach()` untuk mencegah NOT NULL constraint violation |
| `routes/api.php` | Menambah 4 routes member + import OrganizationMemberController |
| `frontend/src/types/index.ts` | Update `OrganizationRole` ke format backend (`Penyelenggara` / `Koordinator Event`) |
| `frontend/src/services/organization.service.ts` | Menambah metode: addMember(), updateMemberRole(), removeMember() |
| `frontend/src/hooks/useOrganization.ts` | Menambah hooks: useAddMember(), useUpdateMemberRole(), useRemoveMember() |
| `frontend/src/app/organizations/[id]/page.tsx` | Menambah tab "Anggota" dengan UI manajemen anggota lengkap |

---

## API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/organizations/{organization}/members` | Sanctum | List anggota organisasi |
| POST | `/api/v1/organizations/{organization}/members` | Sanctum | Tambah anggota baru |
| PATCH | `/api/v1/organizations/{organization}/members/{member}` | Sanctum | Update role anggota |
| DELETE | `/api/v1/organizations/{organization}/members/{member}` | Sanctum | Hapus anggota dari organisasi |

---

## Arsitektur & Alur Data

### Alur Tambah Anggota

```
User → POST /api/v1/organizations/{id}/members
        → StoreMemberRequest (validasi user_id, role)
        → OrganizationMemberController@store
        → MembershipService::addMember()
            → Cek duplikasi membership
            → Cek validitas role
            → Organization::members()->attach({ id: UUID, user, role, joined_at })
        → MemberResource (response)
```

### Alur Update Role

```
User → PATCH /api/v1/organizations/{id}/members/{user_id}
        → UpdateMemberRoleRequest (validasi role)
        → OrganizationMemberController@update
        → MembershipService::assignRole()
            → Cek membership exists
            → Organization::members()->updateExistingPivot({ role })
        → MemberResource (response)
```

### Alur Hapus Anggota

```
User → DELETE /api/v1/organizations/{id}/members/{user_id}
        → OrganizationMemberController@destroy
        → MembershipService::removeMember()
            → Cek membership exists
            → Organization::members()->detach(user)
        → Success response
```

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Anggota dapat ditambahkan | ✅ | `POST .../members` — validasi duplikasi, role valid, 201 created |
| Role dapat ditetapkan | ✅ | `PATCH .../members/{user}` — update role, validasi in (Penyelenggara/Koordinator Event) |
| Daftar anggota tampil dengan benar | ✅ | `GET .../members` — list dengan nested user data, member count di overview |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Membership API | ✅ CRUD endpoints: list, add, update role, remove |
| Add member workflow | ✅ Validasi duplikasi, validasi role, auto-generate UUID |
| Remove member workflow | ✅ Validasi membership exists, soft detach |
| Assign role workflow | ✅ Validasi role, update existing pivot |
| Membership listing | ✅ Paginated list dengan nested user info & pivot data |

---

## Database Schema (Organization Memberships)

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key, auto-generated via Str::uuid() |
| user_id | UUID | FK → users.id |
| organization_id | UUID | FK → organizations.id |
| role | VARCHAR(255) | 'Penyelenggara' atau 'Koordinator Event' |
| joined_at | TIMESTAMP | Set saat member ditambahkan |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Unique constraint: (user_id, organization_id)

---

## Verification

| Check | Status |
|---|---|
| Backend tests (12) pass | ✅ 12 passed (47 assertions) |
| Existing tests (24) pass | ✅ No regression |
| Total tests | ✅ 36 passed (124 assertions) |
| Routes registered | ✅ 20 routes total (4 baru) |
| PHP syntax | ✅ All files compile |
| TypeScript compilation | ✅ No errors |

```
  PASS  Tests\Feature\Organization\MembershipTest
  ✓ authenticated user can list members
  ✓ unauthenticated user cannot list members
  ✓ owner can add member
  ✓ cannot add duplicate member
  ✓ cannot add member with invalid role
  ✓ cannot add nonexistent user as member
  ✓ owner can update member role
  ✓ cannot update role with invalid value
  ✓ owner can remove member
  ✓ cannot remove non member
  ✓ owner can see own role in list
  ✓ member list shows all added users
  Tests:    12 passed (47 assertions)

  Total:    36 passed (124 assertions)
```

---

## Catatan Penting

- Pivot `organization_memberships` menggunakan UUID primary key — `attach()` harus menyertakan `id` secara eksplisit via `Str::uuid()`
- Bug yang sama ditemukan dan diperbaiki di `OrganizationService::register()` (TASK-008) yang sebelumnya tidak menyertakan UUID pada `attach()`
- Role yang tersedia: `Penyelenggara` (full akses) dan `Koordinator Event` (terbatas)
- Setiap user hanya dapat memiliki satu membership per organisasi (unique constraint)
- Frontend: tab "Anggota" di halaman detail organisasi dengan fitur tambah (input user_id + select role), ubah role (inline dropdown), dan hapus (confirmation dialog)

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, semua file terimplementasi, 36 tests passed tanpa regresi, dan frontend terintegrasi dengan backend.
