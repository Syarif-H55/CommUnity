# Task-002: Database Foundation

## Status: ✅ Completed

## Owner: Syarif | Support: Irham

---

## Acceptance Criteria

| Kriteria | Status | Keterangan |
|----------|--------|------------|
| Migration berjalan tanpa error | ✅ | `php artisan migrate:fresh` — 4 migrasi sukses |
| Seeder berhasil dijalankan | ✅ | `DatabaseSeeder` dengan `UserFactory` — sukses |
| Relasi database berjalan sesuai desain | ✅ | User model: HasApiTokens (Sanctum), HasUuids, SoftDeletes, HasFactory, Notifiable |

---

## Implementation Tasks

| Task | Status | Detail |
|------|--------|--------|
| Create users migration | ✅ | `2026_06_12_000000_create_users_table.php` — Tabel: `users`, `password_reset_tokens`, `sessions`. Users: UUID primary key, full_name, username (unique), email (unique), password, profile_photo_path, remember_token, softDeletes, timestamps |
| Create roles migration | ⏳ Ditunda | Roles akan disimpan di `organization_memberships` (Sprint 02) — lihat implementation-plan.md section 4 & DEC-015 |
| Create user_roles migration | ⏳ Ditunda | Sama seperti di atas, role via organization_memberships |
| Create seeders | ✅ | `DatabaseSeeder.php` — User factory dengan test user (full_name: Test User, username: testuser, email: test@example.com) |
| Create model relationships | ✅ | `User.php` — Traits: HasApiTokens, HasFactory, HasUuids, Notifiable, SoftDeletes. Fillable: full_name, username, email, password, profile_photo_path. Hidden: password, remember_token. Casts: email_verified_at (datetime), password (hashed) |

---

## Files Created / Modified

### Created
- `database/migrations/0001_01_01_000000_create_users_table.php` — Users, password_reset_tokens, sessions tables
- `database/migrations/0001_01_01_000001_create_cache_table.php` — Cache table (default Laravel)
- `database/migrations/0001_01_01_000002_create_jobs_table.php` — Jobs table (default Laravel)
- `database/migrations/2026_06_12_082331_create_personal_access_tokens_table.php` — Sanctum tokens table
- `app/Models/User.php` — User model dengan Sanctum, UUID, SoftDeletes
- `database/factories/UserFactory.php` — Factory untuk user testing
- `database/seeders/DatabaseSeeder.php` — Seeder dengan test user

### Modified
- `.env` — DB_CONNECTION=sqlite (development)

---

## Database Schema

### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| full_name | VARCHAR(255) | |
| username | VARCHAR(255) | UNIQUE |
| email | VARCHAR(255) | UNIQUE |
| email_verified_at | TIMESTAMP | nullable |
| password | VARCHAR(255) | hashed |
| profile_photo_path | VARCHAR(255) | nullable |
| remember_token | VARCHAR(100) | nullable |
| deleted_at | TIMESTAMP | nullable (soft delete) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `password_reset_tokens`
| Column | Type | Constraints |
|--------|------|-------------|
| email | VARCHAR(255) | PK |
| token | VARCHAR(255) | |
| created_at | TIMESTAMP | nullable |

### `personal_access_tokens`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK |
| tokenable_type | VARCHAR | |
| tokenable_id | BIGINT | |
| name | TEXT | |
| token | VARCHAR(64) | UNIQUE |
| abilities | TEXT | nullable |
| last_used_at | TIMESTAMP | nullable |
| expires_at | TIMESTAMP | nullable, indexed |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## Catatan Penting

- `roles` dan `user_roles` migration tidak dibuat karena role akan diimplementasikan melalui `organization_memberships` di Sprint 02 (sesuai implementation-plan.md section 4 & 5, DEC-015)
- Jika dibutuhkan role untuk authentication flow (tanpa organisasi), perlu ditambahkan kolom `role` di tabel `users`

---

## Verification Steps Performed

- [x] Run migration fresh: `php artisan migrate:fresh` — OK
- [x] Run seeders: `php artisan db:seed` — OK
- [x] Verify database structure: Cek semua tabel dan kolom — OK
