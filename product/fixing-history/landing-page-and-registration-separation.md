# Landing Page & Registration Separation

## Perencanaan & Implementasi

---

## ⚠️ Penting: Baca Dokumen Berikut Sebelum Implementasi

| # | Dokumen | Lokasi | Alasan |
|---|---|---|---|
| 1 | **Architecture** | `architecture/architecture.md` | Memahami arsitektur sistem dan alur autentikasi |
| 2 | **Database Design** | `architecture/database-design.md` | Memastikan tidak ada perubahan database |
| 3 | **API Conventions** | `architecture/api-conventions.md` | Konsistensi endpoint dan response format |
| 4 | **Coding Standards** | `architecture/coding-standards.md` | Pattern Component, Hook, Service |
| 5 | **Scope** | `product/scope.md` | Memastikan tidak keluar dari scope MVP |
| 6 | **Product Vision** | `product/product-vision.md` | Visi produk CommUnity |
| 7 | **Role Management Fixing** | `product/fixing-history/backend & frontend role management fixing.md` | Konteks implementasi role management sebelumnya |

---

## 1. Executive Summary

Saat ini registrasi CommUnity bersifat **role-agnostic** — semua pengguna (Relawan, Penyelenggara, Koordinator) mendaftar melalui form yang sama tanpa pemisahan alur. Setelah registrasi, semua user masuk ke `/dashboard` yang kemudian me-redirect berdasarkan role context.

Tidak ada **landing page** yang memperkenalkan platform. Halaman root (`/`) hanya berfungsi sebagai redirector ke `/login` atau `/dashboard`.

Perbaikan ini bertujuan untuk:
1. Membuat **landing page** yang menarik sebagai pintu masuk utama platform
2. Memisahkan **alur registrasi** berdasarkan intent pengguna: **Relawan** vs **Penyelenggara**
3. Tetap menggunakan **satu form registrasi** yang sama — perbedaan hanya di **CTA button** dan **post-registration redirect**

---

## 2. Problem Statement

### 2.1 Landing Page

| Masalah | Detail |
|---|---|
| Tidak ada landing page | Halaman `/` hanya redirect ke `/login` |
| Tidak ada value proposition | User baru tidak bisa memahami apa itu CommUnity sebelum daftar |
| Conversion opportunity hilang | Tidak ada cara untuk menarik user dengan informasi platform |
| Tidak mobile-optimized | Landing page bisa dijadikan first impression yang baik |

### 2.2 Registration Flow

| Masalah | Detail |
|---|---|
| Satu form untuk semua | Relawan dan calon Penyelenggara daftar dengan cara yang sama |
| Tidak jelas setelah daftar | User bingung harus ke mana setelah registrasi |
| Tidak ada guidance | Relawan yang baru daftar tidak langsung diarahkan ke kegiatan |
| Calon Penyelenggara tidak langsung diarahkan buat organisasi | Mereka harus mencari sendiri menu organisasi |

---

## 3. Root Cause Analysis

### 3.1 Kenapa Landing Page Tidak Ada?

Halaman root (`frontend/src/app/page.tsx`) sengaja dibuat sebagai redirector sederhana karena fokus awal adalah pengembangan fitur internal, bukan user-facing marketing. Tim belum mengalokasikan waktu untuk landing page.

### 3.2 Kenapa Registrasi Tidak Dipisah?

Keputusan awal: **satu role (user) → role ditentukan kemudian via organization membership**. Ini masih benar secara teknis. Yang kurang adalah guidance UX — user tidak tahu bahwa mereka bisa memilih "jalur" karir di platform.

---

## 4. Proposed Solution

### 4.1 Landing Page (Hero Section)

Halaman root diubah menjadi landing page profesional dengan:

| Section | Deskripsi |
|---|---|
| **Hero** | Headline "Bersama Wujudkan Perubahan Sosial" + sub-headline + 2 CTA buttons |
| **Tentang** | Penjelasan singkat platform + misi |
| **Statistik** | Angka dampak (100+ Kegiatan, 500+ Relawan, 50+ Organisasi, 1000+ Dampak) |
| **Cara Kerja** | 3 langkah: Daftar → Ikuti/Buat Kegiatan → Dapatkan Dampak |
| **Testimoni** | (Optional MVP) Kutipan dari pengguna |
| **Footer** | Link ke login, discover, kontak |

### 4.2 CTA Buttons (Pemisahan Registrasi)

Dua tombol utama di Hero section:

| Tombol | Warna | Link | Post-Registration Redirect |
|---|---|---|---|
| **"Gabung sebagai Relawan"** | Primer (biru/sesuai tema) | `/register?type=volunteer` | `/discover` |
| **"Daftarkan Organisasi Anda"** | Sekunder (outline) | `/register?type=organizer` | `/organizations/register` |

### 4.3 Registration Form (Tetap Satu)

Form registrasi tetap satu (`/register`) dengan query param `?type=volunteer` atau `?type=organizer`.

Perubahan pada halaman register:

| Perubahan | Detail |
|---|---|
| Judul halaman | Berubah sesuai type: "Daftar sebagai Relawan" / "Daftar sebagai Penyelenggara" |
| Badge/tag | Menampilkan role yang dipilih dengan opsi ganti |
| Text setelah daftar | Berubah sesuai type: "Langsung jelajahi kegiatan" / "Lanjutkan daftarkan organisasi" |
| Redirect setelah sukses | Volunteer → `/discover` | Organizer → `/organizations/register` |

### 4.4 Flow Diagram

```
                        LANDING PAGE (/)
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
    [Gabung sebagai Relawan]         [Daftarkan Organisasi Anda]
            │                                   │
            ▼                                   ▼
    /register?type=volunteer          /register?type=organizer
            │                                   │
            ▼                                   ▼
    Form Register (sama)              Form Register (sama)
            │                                   │
            ▼                                   ▼
    Success → redirect                  Success → redirect
    /discover                           /organizations/register
            │                                   │
            ▼                                   ▼
    Lihat kegiatan sosial            Isi data organisasi
    dan daftar kegiatan              untuk verifikasi

            ┌──────────────────────────────────────┐
            │                                      │
    ┌───────┴───────┐                     ┌────────┴────────┐
    │  Login Page   │                     │   /login        │
    │  (dari footer)│                     │                 │
    └───────────────┘                     └─────────────────┘
```

---

## 5. Affected Components

### 5.1 Backend (Tidak Ada Perubahan)

Backend **tidak perlu diubah** — semua endpoint sudah ada:

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/auth/register` | ✅ Existing | Tidak perlu perubahan |
| `POST /api/v1/auth/login` | ✅ Existing | Tidak perlu perubahan |
| `POST /api/v1/organizations` | ✅ Existing | Untuk post-registration redirect |
| `GET /api/v1/my-context` | ✅ Existing | Untuk role-based dashboard |

### 5.2 Frontend (File yang Berubah)

| File | Perubahan |
|---|---|
| `frontend/src/app/page.tsx` | **Rewrite** — dari redirector jadi landing page hero section |
| `frontend/src/app/(auth)/register/page.tsx` | **Modifikasi** — tambah query param type, judul dinamis, redirect berbeda |
| `frontend/src/app/(auth)/layout.tsx` | **Minor** — optional: landing page tidak perlu auth layout |
| `frontend/src/app/dashboard/page.tsx` | **Minor** — tetap sebagai fallback redirect hub |

### 5.3 File Baru

| File | Deskripsi |
|---|---|
| (opsional) `frontend/src/components/landing/HeroSection.tsx` | Hero section component |
| (opsional) `frontend/src/components/landing/StatsSection.tsx` | Statistik section |
| (opsional) `frontend/src/components/landing/HowItWorks.tsx` | Cara kerja section |
| (opsional) `frontend/src/components/landing/Footer.tsx` | Landing page footer |

> **Catatan:** Jika konten landing page tidak terlalu kompleks, cukup ditulis langsung di `page.tsx` tanpa komponen terpisah.

---

## 6. Implementation Plan

### Fase 1: Landing Page

| Step | Task | File |
|---|---|---|
| 1 | Buat landing page dengan hero section dan value proposition | `page.tsx` |
| 2 | Stat section (dummy angka, bisa diganti nanti dari API) | `page.tsx` |
| 3 | How it works section (3 langkah) | `page.tsx` |
| 4 | Footer landing page | `page.tsx` |

### Fase 2: Registration Separation

| Step | Task | File |
|---|---|---|
| 5 | Baca query param `?type=` di register page | `register/page.tsx` |
| 6 | Judul dinamis berdasarkan type | `register/page.tsx` |
| 7 | Text guidance berbeda per type | `register/page.tsx` |
| 8 | Redirect berbeda setelah sukses: volunteer → `/discover`, organizer → `/organizations/register` | `register/page.tsx` & `hooks/useAuth.ts` |
| 9 | Tambah opsi ganti type di form register | `register/page.tsx` |

### Fase 3: Landing Page Styling

| Step | Task | File |
|---|---|---|
| 10 | Gradient/background landing page | `page.tsx` |
| 11 | Responsive mobile | `page.tsx` |
| 12 | Animasi ringan (tailwind) | `page.tsx` |

---

## 7. Testing Strategy

### 7.1 Manual Testing

| Test Case | Langkah | Expected Result |
|---|---|---|
| Landing page muncul | Buka `/` tanpa login | Landing page hero, stats, CTA |
| CTA volunteer | Klik "Gabung sebagai Relawan" | Redirect ke `/register?type=volunteer` |
| CTA organizer | Klik "Daftarkan Organisasi Anda" | Redirect ke `/register?type=organizer` |
| Register volunteer | Isi form, submit | Redirect ke `/discover` |
| Register organizer | Isi form, submit | Redirect ke `/organizations/register` |
| Type di URL langsung | Buka `/register?type=volunteer` | Judul "Daftar sebagai Relawan" |
| Type tidak valid | Buka `/register?type=xxx` | Default ke volunteer |

### 7.2 Automated Testing

| Test | File |
|---|---|
| Landing page renders correctly | (manual test) |
| Registration flow with volunteer type | (frontend test) |
| Registration flow with organizer type | (frontend test) |

> **Catatan:** Automated testing frontend membutuhkan setup testing library tambahan. Untuk MVP, manual testing cukup.

---

## 8. Files Changed (Complete List)

| File | Perubahan | Fase |
|---|---|---|
| `frontend/src/app/page.tsx` | Landing page rewrite | 1 |
| `frontend/src/app/(auth)/register/page.tsx` | Query param type | 2 |
| `frontend/src/hooks/useAuth.ts` | Redirect logic (minor) | 2 |

### Tidak Diubah

| File | Alasan |
|---|---|
| Backend apapun | Tidak diperlukan perubahan |
| `Dashboard` | Tetap sebagai fallback |
| `AuthGuard` / `RoleGuard` | Tidak terkait |
| `database` | Tidak ada perubahan |

---

## 9. Acceptance Criteria

### Landing Page

| AC | Keterangan |
|---|---|
| ✅ Landing page muncul saat user belum login | |
| ✅ Hero section value proposition jelas | |
| ✅ 2 CTA buttons: "Gabung sebagai Relawan" & "Daftarkan Organisasi Anda" | |
| ✅ Statistik ditampilkan | |
| ✅ Responsive di mobile | |
| ✅ Footer dengan link login | |

### Registration Separation

| AC | Keterangan |
|---|---|
| ✅ CTA "Gabung sebagai Relawan" → `/register?type=volunteer` | |
| ✅ CTA "Daftarkan Organisasi Anda" → `/register?type=organizer` | |
| ✅ Judul register berubah sesuai type | |
| ✅ Volunteer register sukses → redirect `/discover` | |
| ✅ Organizer register sukses → redirect `/organizations/register` | |
| ✅ Backend tidak diubah | |

---

## 10. Architecture Diagram (After Fix)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LANDING PAGE FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                                                       │
│  │  / (Landing Page) │── Tidak login? ──► Tampilkan Hero + CTA             │
│  │                   │── Sudah login?  ──► Redirect /dashboard             │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           │                 ┌─────────────────────────┐                     │
│           ├──[Gabung sebagai Relawan]────────────────►│ /register           │
│           │                 │    ?type=volunteer       │                     │
│           │                 │    Judul: "Daftar        │                     │
│           │                 │    sebagai Relawan"      │                     │
│           │                 │    Redirect → /discover  │                     │
│           │                 └─────────────────────────┘                     │
│           │                                                                 │
│           │                 ┌─────────────────────────┐                     │
│           └──[Daftarkan Organisasi Anda]─────────────►│ /register           │
│                           │    ?type=organizer        │                     │
│                           │    Judul: "Daftar         │                     │
│                           │    sebagai                │                     │
│                           │    Penyelenggara"         │                     │
│                           │    Redirect →             │                     │
│                           │    /organizations/register │                     │
│                           └───────────────────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Notes & Caveats

### 11.1 Tidak Ada Perubahan Backend

Semua perubahan **hanya di frontend**. Backend tetap sama karena:
- Role tetap ditentukan dari organization membership (`/my-context`)
- Tidak ada field `role` di tabel users
- Tidak perlu endpoint baru

### 11.2 Query Param `type`

Parameter `?type=` digunakan untuk menentukan alur setelah register:
- `type=volunteer` (default) → redirect ke `/discover`
- `type=organizer` → redirect ke `/organizations/register`

Tidak ada validasi backend — ini murni UX frontend.

### 11.3 Konsistensi dengan Dashboard Redirect

Dashboard (`/dashboard`) tetap ada sebagai fallback. Jika user sudah login dan membuka `/dashboard`, sistem tetap me-redirect berdasarkan role context (admin → admin dashboard, organizer → organizations, coordinator → events, volunteer → discover).

Ini berguna jika user login langsung tanpa melalui landing page.

### 11.4 Statistik Dummy

Statistik di landing page bersifat **static/dummy** untuk MVP. Angka bisa diganti nanti dengan data real dari API `/admin/stats`.

### 11.5 Akses ke Landing Page

- User **belum login** → landing page
- User **sudah login** → redirect ke `/dashboard`
- Ini memastikan user yang sudah login tidak melihat landing page lagi

---

## 12. Kesimpulan

Perbaikan landing page dan pemisahan registrasi membutuhkan **2 fase** dengan total **10 langkah**:

| Fase | Fokus | Steps | Estimated Effort |
|---|---|---|---|
| 🟢 Landing Page | Hero section, stats, how it works, footer | 1-4 | 🟢 1-2 jam |
| 🟢 Registration Separation | Query param, judul dinamis, redirect | 5-9 | 🟢 1 jam |
| 🟢 Styling | Gradient, responsive, animasi ringan | 10-12 | 🟢 1 jam |

**Total estimasi: 3-4 jam** — semua perubahan frontend, tidak ada perubahan backend.

---

## 13. Dummy Data

### 13.1 Akun Dummy

Untuk keperluan testing dan demo, berikut akun yang bisa digunakan:

#### Admin Sistem

| Field | Value |
|---|---|
| Nama Lengkap | Admin CommUnity |
| Username | admin |
| Email | admin@community.com |
| Password | password |
| Role | Admin Sistem |
| Catatan | Bisa akses semua fitur, bypass semua pengecekan organisasi |

#### Penyelenggara (Organizer)

| Field | Value |
|---|---|
| Nama Lengkap | Budi Santoso |
| Username | budi_santoso |
| Email | budi@example.com |
| Password | password |
| Role | Penyelenggara |

**Organisasi yang dimiliki:**

| Field | Value |
|---|---|
| Nama Organisasi | Yayasan Sejahtera |
| Deskripsi | Yayasan sosial yang bergerak di bidang pendidikan dan kesejahteraan masyarakat |
| Email Organisasi | yayasan@sejahtera.com |
| Status Verifikasi | verified |

**Event yang dibuat:**

| Judul | Tanggal | Lokasi | Status |
|---|---|---|---|
| Bakti Sosial Bersih Lingkungan | 2026-07-15 | Jakarta | published |
| Kelas Belajar Gratis untuk Anak | 2026-07-20 | Bandung | published |
| Donasi Buku untuk Perpustakaan Desa | 2026-08-01 | Bogor | draft |

#### Koordinator Event (Coordinator)

| Field | Value |
|---|---|
| Nama Lengkap | Siti Rahayu |
| Username | siti_rahayu |
| Email | siti@example.com |
| Password | password |
| Role | Koordinator Event |

**Organisasi tempat bergabung:**

| Field | Value |
|---|---|
| Nama Organisasi | Yayasan Sejahtera |
| Role | Koordinator Event |

**Event yang dikoordinatori:**

| Judul | Tanggal | Lokasi | Status |
|---|---|---|---|
| Bakti Sosial Bersih Lingkungan | 2026-07-15 | Jakarta | published |

#### Relawan (Volunteer)

| Field | Value |
|---|---|
| Nama Lengkap | Ahmad Fauzi |
| Username | ahmad_fauzi |
| Email | ahmad@example.com |
| Password | password |
| Role | Relawan |

**Pendaftaran Event:**

| Event | Status Pendaftaran |
|---|---|
| Bakti Sosial Bersih Lingkungan | Terdaftar (registered) |
| Kelas Belajar Gratis untuk Anak | Terdaftar (registered) |

### 13.2 Dataset Lengkap untuk Testing

#### Users

| # | Nama | Username | Email | Password | Role |
|---|---|---|---|---|---|
| 1 | Admin CommUnity | admin | admin@community.com | password | Admin |
| 2 | Budi Santoso | budi_santoso | budi@example.com | password | Penyelenggara |
| 3 | Siti Rahayu | siti_rahayu | siti@example.com | password | Koordinator |
| 4 | Ahmad Fauzi | ahmad_fauzi | ahmad@example.com | password | Relawan |
| 5 | Dewi Lestari | dewi_lestari | dewi@example.com | password | Relawan |
| 6 | Rudi Hermawan | rudi_hermawan | rudi@example.com | password | Relawan |
| 7 | Maya Anggraini | maya_anggraini | maya@example.com | password | Relawan |

#### Organizations

| # | Nama | Pemilik | Status |
|---|---|---|---|
| 1 | Yayasan Sejahtera | Budi Santoso (Penyelenggara) | verified |
| 2 | Komunitas Peduli Lingkungan | Budi Santoso (Penyelenggara) | pending |
| 3 | Forum Relawan Jakarta | Budi Santoso (Penyelenggara) | rejected |

#### Events

| # | Judul | Tanggal | Lokasi | Kategori | Status | Kuota | Penyelenggara | Koordinator |
|---|---|---|---|---|---|---|---|---|
| 1 | Bakti Sosial Bersih Lingkungan | 2026-07-15 | Jakarta | Lingkungan | published | 50 | Yayasan Sejahtera | Siti Rahayu |
| 2 | Kelas Belajar Gratis untuk Anak | 2026-07-20 | Bandung | Pendidikan | published | 30 | Yayasan Sejahtera | Budi Santoso |
| 3 | Donasi Buku untuk Perpustakaan Desa | 2026-08-01 | Bogor | Pendidikan | draft | 100 | Yayasan Sejahtera | Budi Santoso |
| 4 | Senam Sehat Bersama | 2026-07-25 | Jakarta | Kesehatan | published | 40 | Yayasan Sejahtera | Siti Rahayu |
| 5 | Bakti Sosial Panti Asuhan | 2026-08-10 | Depok | Sosial | draft | 25 | Yayasan Sejahtera | Budi Santoso |

#### Volunteer Registrations

| # | Volunteer | Event | Tanggal Daftar |
|---|---|---|---|
| 1 | Ahmad Fauzi | Bakti Sosial Bersih Lingkungan | 2026-06-20 |
| 2 | Ahmad Fauzi | Kelas Belajar Gratis untuk Anak | 2026-06-22 |
| 3 | Dewi Lestari | Bakti Sosial Bersih Lingkungan | 2026-06-21 |
| 4 | Rudi Hermawan | Senam Sehat Bersama | 2026-06-23 |
| 5 | Maya Anggraini | Kelas Belajar Gratis untuk Anak | 2026-06-24 |
| 6 | Maya Anggraini | Bakti Sosial Bersih Lingkungan | 2026-06-25 |
| 7 | Dewi Lestari | Senam Sehat Bersama | 2026-06-26 |

#### Attendance (untuk event yang sudah berlangsung atau ongoing)

*(Belum ada — attendance hanya dibuat setelah event berlangsung via fitur absensi)*

---

*Dokumen ini disusun berdasarkan analisis landing page dan registration flow CommUnity.*
