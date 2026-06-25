# CommUnity

Platform manajemen kegiatan sosial komunitas berbasis digital.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| State Mgmt | Zustand |
| API Client | TanStack Query |
| Backend | Laravel 12, Laravel Sanctum |
| Database | MySQL (development: SQLite) |
| Storage | Laravel Local Storage |

## Struktur Folder

```
CommUnity/
├── backend/          # Laravel API
├── frontend/         # Next.js App
└── CommUnity/        # Dokumentasi proyek
```

## Catatan Penting — .gitignore

Beberapa file tidak masuk Git karena diatur di `.gitignore`. Setelah `git pull`, lakukan ini:

### Backend
```bash
cd backend
composer install                    # Install vendor/
cp .env.example .env                # Buat file .env (tidak ikut Git)
php artisan key:generate            # Generate APP_KEY
php artisan storage:link            # Symlink storage
```

### Frontend
```bash
cd frontend
npm install                         # Install node_modules/
cp .env.example .env.local          # Buat file .env.local (tidak ikut Git)
```

> File `.env`, `.env.local`, `vendor/`, `node_modules/`, dan folder `storage/` tidak ikut di-track Git. Wajib di-generate ulang setiap clone/pull.

## Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 22+
- npm 10+

## Cara Menjalankan

### 1. Backend (Laravel API)

```bash
cd backend

# Install dependencies
composer install

# Copy environment
cp .env.example .env

# Generate app key
php artisan key:generate

# Jalankan migration (gunakan SQLite default)
php artisan migrate

# (Opsional) Isi data dummy
php artisan db:seed

# Jalankan server
php artisan serve --port=8000
```

Backend berjalan di `http://localhost:8000`

### 2. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend berjalan di `http://localhost:3000`

### 3. Verifikasi

Cek API dengan `curl`:

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","username":"testuser","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## API Base URL

Frontend membaca `NEXT_PUBLIC_API_URL` dari `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## API Authentication Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/v1/auth/register` | No | Registrasi akun baru |
| POST | `/api/v1/auth/login` | No | Login pengguna |
| POST | `/api/v1/auth/logout` | Yes | Logout (Bearer token) |
| POST | `/api/v1/auth/forgot-password` | No | Request token reset password |
| POST | `/api/v1/auth/reset-password` | No | Reset password dengan token |

## Akun Default (setelah seeder)

| Role | Username | Password |
|------|----------|----------|
| User | `testuser` | `password` |

> Jalankan `php artisan db:seed` untuk membuat akun default.

## Command Penting

### Backend

| Command | Deskripsi |
|---------|-----------|
| `php artisan serve` | Jalankan server |
| `php artisan migrate:fresh` | Reset database |
| `php artisan db:seed` | Isi data dummy |
| `php artisan make:migration` | Buat migration baru |
| `php artisan make:model` | Buat model baru |
| `php artisan tinker` | Interactive shell |
| `php artisan test` | Jalankan semua test |
| `php artisan test --filter AuthTest` | Jalankan test auth |

### Frontend

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | Linting |
| `npx shadcn add button` | Tambah komponen shadcn |

## Sprint

| Sprint | Scope | Status |
|--------|-------|--------|
| Sprint 01 | Foundation & Authentication | Selesai |
| Sprint 02 | Organization, Event & Volunteer | Selesai |
| Sprint 03 | Attendance, Report, Certificate & Analytics | Aktif |
| Sprint 04 | Attendance, Report, Certificate & Analytics | - |
| Sprint 05 | Attendance, Report, Certificate & Analytics | - |
| Sprint 06 | Attendance, Report, Certificate & Analytics | - |

Tim: **Kelompok ATM** — Syarif, Hiraldy, Abdillah, Irham
