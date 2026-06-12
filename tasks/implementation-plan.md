# CommUnity Implementation Plan

> Dokumen ini berisi rencana implementasi CommUnity MVP berdasarkan dokumen produk, arsitektur, planning, dan task yang telah disepakati.
>
> **Status:** Planning Phase — Belum masuk fase coding.
>
> **Target Expo:** Mid-Juli 2026

---

## 1. Product Understanding

### Ringkasan Produk

CommUnity adalah platform manajemen kegiatan sosial komunitas berbasis digital yang menghubungkan organisasi penyelenggara dengan relawan dalam satu ekosistem terintegrasi.

### Aktor Sistem

| Aktor | Deskripsi |
|-------|-----------|
| Admin Sistem | Mengelola platform, verifikasi organisasi, pengawasan sistem |
| Penyelenggara | Membuat dan mengelola event, menyetujui laporan |
| Koordinator Event | Validasi kehadiran, mengirim laporan kegiatan |
| Relawan | Mendaftar event, check-in QR, download sertifikat |

### Workflow Utama (End-to-End)

```
Organization Registration
  ↓ (Admin verifikasi)
Event Creation & Publication
  ↓
Volunteer Registration
  ↓
QR Attendance Validation
  ↓
Event Report Submission
  ↓ (Penyelenggara approve)
Certificate Generation
  ↓
Analytics Dashboard Updated
```

### MVP Scope

21 User Stories (Must Have), 3 sprint, 25 task.

Fitur ditunda (v1.1): In-App Notifications, Multi-Organization Membership.

---

## 2. Architecture Understanding

### High-Level Architecture

```
+-------------------+
|     Browser       |
+-------------------+
        | REST API
        v
+-------------------+
|   Laravel API     |
| (Business Logic)  |
+-------------------+
        |
        +------------------+
        |                  |
        v                  v
+----------------+   +----------------+
|     MySQL      |   | Local Storage  |
|   Database     |   | Files & PDFs   |
+----------------+   +----------------+
```

### Technology Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| State Mgmt | Zustand |
| API Client | TanStack Query |
| Backend | Laravel 12, Laravel Sanctum |
| Database | MySQL |
| Storage | Laravel Local Storage |
| Testing | PHPUnit (backend), Manual UAT (frontend) |

### Backend Design Pattern

```
Controller
    ↓ (menerima request, memanggil service)
Service
    ↓ (business logic, workflow orchestration)
Repository
    ↓ (database access, query)
Model
    ↓ (relationship, casting, scopes)
Database
```

### Authentication

- Laravel Sanctum — Bearer Token
- Login menggunakan username + password
- RBAC: Admin, Penyelenggara, Koordinator Event, Relawan
- Role disimpan di `organization_memberships`

### API Conventions

- Base URL: `/api/v1`
- Response format: `{ success, message, data }`
- Error format: `{ success, message, errors }`
- snake_case untuk JSON fields dan database
- Pagination: `?page=1&per_page=10`
- Filter: `?category=1&city=Bandung&date=2026-07-15`
- Search: `?search=keyword`
- Sort: `?sort=event_date` atau `?sort=-event_date`
- Soft delete: `deleted_at` pada users, organizations, events

---

## 3. Implementation Sequence

### Fase 1: Foundation (Sprint 01)

**Urutan implementasi:**

1. **Project scaffolding** — Laravel 12 + Next.js repo setup, environment, folder structure
2. **Database foundation** — migrations: `users`, `personal_access_tokens`, `password_reset_tokens`
3. **Auth API** — Register, Login, Logout, Forgot Password, Reset Password via Sanctum
4. **Auth Frontend** — Login page, Register page, Forgot Password page
5. **Auth Integration** — TanStack Query hooks, Zustand auth store, protected routes, token management
6. **Profile Management** — Profile read/update API, profile photo upload, profile page UI

**Mengapa pertama:** Authentication adalah prerequisite mutlak. Semua fitur berikutnya membutuhkan user session dan RBAC.

---

### Fase 2: Core Business (Sprint 02)

**Urutan implementasi:**

1. **Organization Backend** — migrations (`organizations`, `organization_memberships`), CRUD API, verification workflow (pending → approved/rejected)
2. **Organization Frontend** — Registration form, admin verification page, status display
3. **Organization Member Management** — Add/remove member, assign role API dan UI
4. **Event Backend** — migrations (`events`, `event_categories`), CRUD API, publish workflow
5. **Event Frontend** — Create/edit/publish event pages
6. **Event Discovery** — Browse events list, search, filter (category/location/date), pagination, detail page
7. **Volunteer Registration Backend** — `volunteer_registrations` migration, register API, duplicate prevention, history API
8. **Volunteer Frontend** — Join event button, registration confirmation, participation history page

**Mengapa kedua:** Event adalah core domain CommUnity. Event membutuhkan organization yang sudah terverifikasi. Volunteer registration membutuhkan event yang sudah dipublikasikan.

---

### Fase 3: Workflow Completion (Sprint 03)

**Urutan implementasi:**

1. **Attendance Backend** — `attendances` migration, QR generation service (unique per event), scan validation API, duplicate prevention, coordinator validation
2. **Attendance Frontend** — QR display page (coordinator), QR scanner page (volunteer), attendance history, status display
3. **Event Report Backend** — `event_reports` + `event_documentations` migration, submission API, photo upload (min 1, max 5), approval/rejection workflow
4. **Event Report Frontend** — Report form, photo upload component, review page (penyelenggara), status display
5. **Certificate Backend** — `certificates` migration, PDF generation service, unique certificate number, download API
6. **Certificate Frontend** — Certificate list page, download button, status display
7. **Analytics Backend** — Realtime aggregation queries: total events, total volunteers, completed events, attendance rate
8. **Analytics Frontend** — Dashboard cards, summary statistics, admin dashboard

**Mengapa ketiga:** Attendance membutuhkan volunteer registration; reporting membutuhkan attendance data; certificate membutuhkan event completed + report approved; analytics membutuhkan seluruh data operasional.

---

## 4. Dependency Graph

```
Sprint 01 — Foundation
=======================
TASK-001 Project Setup
  └── TASK-002 Database Foundation
        └── TASK-003 Auth API
              └── TASK-004 Auth Frontend
                    └── TASK-005 Auth Integration
                          └── TASK-006 Profile Management
                                └── TASK-007 QA Testing
                                      ↓
Sprint 02 — Core Business
==========================
TASK-008 Organization Backend
  ├── TASK-009 Organization Frontend
  └── TASK-010 Member Management
TASK-011 Event Backend
  ├── TASK-012 Event Frontend
  └── TASK-013 Event Discovery
TASK-014 Volunteer Registration Backend
  └── TASK-015 Volunteer Frontend
        └── TASK-016 QA Testing
              ↓
Sprint 03 — Workflow Completion
================================
TASK-017 Attendance Backend
  └── TASK-018 Attendance Frontend
TASK-019 Report Backend
  └── TASK-020 Report Frontend
TASK-021 Certificate Backend
  └── TASK-022 Certificate Frontend
TASK-023 Analytics Backend
  └── TASK-024 Analytics Frontend
        └── TASK-025 End-to-End QA
```

### Hard Blocking Dependencies

| Fitur | Blocked By | Alasan |
|-------|-----------|--------|
| Event Management | Organization Verification | Hanya org terverifikasi bisa buat event |
| Volunteer Registration | Event Management | Relawan daftar ke event yang sudah ada |
| Attendance Validation | Volunteer Registration | Harus terdaftar dulu untuk check-in |
| Event Reporting | Attendance | Laporan butuh data kehadiran |
| Certificate Generation | Report Approved | Sertifikat setelah laporan disetujui |
| Analytics | Seluruh data | Butuh data event, attendance, certificate |

---

## 5. Database Migration Sequence

| No | Migration | Tabel | Sprint |
|----|-----------|-------|--------|
| 1 | `create_users_table` | `users` | S01 |
| 2 | `create_personal_access_tokens_table` | `personal_access_tokens` | S01 |
| 3 | `create_password_reset_tokens_table` | `password_reset_tokens` | S01 |
| 4 | `create_organizations_table` | `organizations` | S02 |
| 5 | `create_organization_memberships_table` | `organization_memberships` | S02 |
| 6 | `create_event_categories_table` | `event_categories` | S02 |
| 7 | `create_events_table` | `events` | S02 |
| 8 | `create_volunteer_registrations_table` | `volunteer_registrations` | S02 |
| 9 | `create_attendances_table` | `attendances` | S03 |
| 10 | `create_event_reports_table` | `event_reports` | S03 |
| 11 | `create_event_documentations_table` | `event_documentations` | S03 |
| 12 | `create_certificates_table` | `certificates` | S03 |
| 13 | `create_notifications_table` | `notifications` | Ditunda v1.1 |

### Entity Relationships

```
User ──< OrganizationMembership >── Organization
Organization ──< Event
Event Category ──< Event
Event ──< VolunteerRegistration >── User (Volunteer)
Event ──< Attendance >── User (Volunteer)
Event ──< EventReport ──< EventDocumentation
Event ──< Certificate >── User (Volunteer)
User ──< Notification
```

### Key Database Constraints

- `users.username` — unique
- `users.email` — unique
- `volunteer_registrations` — unique (event_id, volunteer_id)
- `certificates.certificate_number` — unique
- `events.status` — draft, published, ongoing, completed, cancelled
- `organizations.verification_status` — pending, approved, rejected
- Soft delete: `users`, `organizations`, `events`

---

## 6. API Endpoint Plan

### Sprint 01 — Authentication & Profile

| Method | Endpoint | Auth | Role | Deskripsi |
|--------|----------|------|------|-----------|
| POST | `/api/v1/auth/register` | No | - | Registrasi akun baru |
| POST | `/api/v1/auth/login` | No | - | Login pengguna |
| POST | `/api/v1/auth/logout` | Yes | All | Logout dan revoke token |
| POST | `/api/v1/auth/forgot-password` | No | - | Request reset password |
| POST | `/api/v1/auth/reset-password` | No | - | Reset password dengan token |
| GET | `/api/v1/profile` | Yes | All | Lihat profil sendiri |
| PATCH | `/api/v1/profile` | Yes | All | Update profil |
| POST | `/api/v1/profile/photo` | Yes | All | Upload foto profil |

### Sprint 02 — Organization & Event

| Method | Endpoint | Auth | Role | Deskripsi |
|--------|----------|------|------|-----------|
| POST | `/api/v1/organizations` | Yes | Penyelenggara | Daftarkan organisasi |
| GET | `/api/v1/organizations` | Yes | All | List organisasi |
| GET | `/api/v1/organizations/{id}` | Yes | All | Detail organisasi |
| PATCH | `/api/v1/organizations/{id}` | Yes | Penyelenggara | Update organisasi |
| POST | `/api/v1/organizations/{id}/logo` | Yes | Penyelenggara | Upload logo |
| GET | `/api/v1/organizations/{id}/members` | Yes | Penyelenggara | Daftar anggota |
| POST | `/api/v1/organizations/{id}/members` | Yes | Penyelenggara | Tambah anggota |
| DELETE | `/api/v1/organizations/{id}/members/{userId}` | Yes | Penyelenggara | Hapus anggota |
| PATCH | `/api/v1/organizations/{id}/members/{userId}` | Yes | Penyelenggara | Ubah role anggota |
| GET | `/api/v1/admin/organizations` | Yes | Admin | List semua organisasi |
| PATCH | `/api/v1/admin/organizations/{id}/verify` | Yes | Admin | Verify/reject organisasi |
| GET | `/api/v1/event-categories` | No | Public | List kategori event |
| GET | `/api/v1/events` | No | Public | List event (published) |
| POST | `/api/v1/events` | Yes | Penyelenggara | Buat event |
| GET | `/api/v1/events/{id}` | No | Public | Detail event |
| PATCH | `/api/v1/events/{id}` | Yes | Penyelenggara | Update event |
| DELETE | `/api/v1/events/{id}` | Yes | Penyelenggara | Hapus event (soft) |
| PATCH | `/api/v1/events/{id}/publish` | Yes | Penyelenggara | Publikasi event |
| PATCH | `/api/v1/events/{id}/cancel` | Yes | Penyelenggara | Batalkan event |
| POST | `/api/v1/events/{id}/register` | Yes | Relawan | Daftar ke event |
| GET | `/api/v1/volunteer/registrations` | Yes | Relawan | Riwayat pendaftaran |

### Sprint 03 — Attendance, Report, Certificate, Analytics

| Method | Endpoint | Auth | Role | Deskripsi |
|--------|----------|------|------|-----------|
| GET | `/api/v1/events/{id}/attendance/qr` | Yes | Koordinator | Generate QR event |
| POST | `/api/v1/events/{id}/attendance/scan` | Yes | Relawan | Scan QR check-in |
| POST | `/api/v1/events/{id}/attendance/manual` | Yes | Koordinator | Validasi manual |
| GET | `/api/v1/events/{id}/attendances` | Yes | Koordinator | Daftar kehadiran |
| GET | `/api/v1/volunteer/attendances` | Yes | Relawan | Riwayat kehadiran |
| POST | `/api/v1/events/{id}/reports` | Yes | Koordinator | Submit laporan |
| GET | `/api/v1/events/{id}/reports` | Yes | Penyelenggara | Lihat laporan |
| PATCH | `/api/v1/reports/{id}/approve` | Yes | Penyelenggara | Setujui laporan |
| PATCH | `/api/v1/reports/{id}/reject` | Yes | Penyelenggara | Tolak laporan |
| POST | `/api/v1/events/{id}/certificates/generate` | Yes | Penyelenggara | Generate sertifikat |
| GET | `/api/v1/certificates` | Yes | Relawan | Daftar sertifikat |
| GET | `/api/v1/certificates/{id}/download` | Yes | Relawan | Download PDF |
| GET | `/api/v1/analytics/organization` | Yes | Penyelenggara | Dashboard organisasi |
| GET | `/api/v1/analytics/admin` | Yes | Admin | Dashboard admin |

---

## 7. Task Breakdown

### Sprint 01 — Foundation & Authentication (7 tasks)

| ID | Task | Owner | Support | Effort | Dependencies |
|----|------|-------|---------|--------|--------------|
| TASK-001 | Project Repository Setup | Syarif | Hiraldy | S | None |
| TASK-002 | Database Foundation | Syarif | Irham | M | TASK-001 |
| TASK-003 | Authentication API Development | Syarif | Irham | L | TASK-002 |
| TASK-004 | Frontend Authentication Pages | Hiraldy | Abdillah | L | TASK-001 |
| TASK-005 | Authentication Integration | Hiraldy | Syarif | M | TASK-003, TASK-004 |
| TASK-006 | Profile Management | Abdillah | Syarif | M | TASK-005 |
| TASK-007 | Authentication Testing & QA | Irham | Syarif | M | TASK-003, TASK-005, TASK-006 |

### Sprint 02 — Organization, Event & Volunteer (9 tasks)

| ID | Task | Owner | Support | Effort | Dependencies |
|----|------|-------|---------|--------|--------------|
| TASK-008 | Organization Module Backend | Syarif | Irham | L | S01 Complete |
| TASK-009 | Organization Management Frontend | Hiraldy | Abdillah | L | TASK-008 |
| TASK-010 | Organization Member Management | Syarif | Abdillah | M | TASK-008 |
| TASK-011 | Event Module Backend | Syarif | Irham | L | TASK-008 |
| TASK-012 | Event Management Frontend | Hiraldy | Abdillah | L | TASK-011 |
| TASK-013 | Event Discovery Module | Abdillah | Syarif | L | TASK-011 |
| TASK-014 | Volunteer Registration Backend | Syarif | Irham | M | TASK-011 |
| TASK-015 | Volunteer Participation Frontend | Abdillah | Hiraldy | M | TASK-014, TASK-013 |
| TASK-016 | Sprint 02 QA | Irham | Syarif | L | TASK-009, TASK-012, TASK-015 |

### Sprint 03 — Attendance, Report, Certificate, Analytics (9 tasks)

| ID | Task | Owner | Support | Effort | Dependencies |
|----|------|-------|---------|--------|--------------|
| TASK-017 | Attendance Management Backend | Syarif | Irham | L | S02 Complete |
| TASK-018 | Attendance Management Frontend | Hiraldy | Abdillah | L | TASK-017 |
| TASK-019 | Event Reporting Backend | Syarif | Irham | L | TASK-017 |
| TASK-020 | Event Reporting Frontend | Abdillah | Hiraldy | L | TASK-019 |
| TASK-021 | Certificate Generation Backend | Syarif | Irham | M | TASK-019 |
| TASK-022 | Certificate Management Frontend | Hiraldy | Abdillah | M | TASK-021 |
| TASK-023 | Analytics Dashboard Backend | Syarif | Irham | M | TASK-021 |
| TASK-024 | Analytics Dashboard Frontend | Abdillah | Hiraldy | M | TASK-023 |
| TASK-025 | Sprint 03 & End-to-End QA | Irham | Syarif | L | TASK-018, TASK-020, TASK-022, TASK-024 |

### Task Size Reference

| Size | Durasi Estimasi |
|------|----------------|
| S (Small) | < 1 hari |
| M (Medium) | 1-2 hari |
| L (Large) | 2-3 hari |

---

## 8. Testing Strategy

### Backend Testing (PHPUnit Feature Tests)

| Modul | Test Scenarios |
|-------|---------------|
| Authentication | Register sukses, email/username duplicate, login valid/invalid, logout, forgot password flow, reset password |
| Profile | Get profile, update profile, upload photo, validation errors |
| Organization | Register org, upload document, verify (approve/reject), list, member management |
| Event | CRUD, publish, cancel, validation (quota, dates), authorization (non-verified org cannot create) |
| Volunteer Registration | Register event, duplicate prevention, quota full, history list |
| Attendance | QR generate, QR scan valid/invalid, duplicate scan, manual validation, outside event time |
| Report | Submit report (min 1 photo), submit without photo (rejected), approve, reject, draft save |
| Certificate | Auto-generate after report approved, unique number, download, duplicate prevention |
| Analytics | Event count, volunteer count, attendance rate, completed events |

### Frontend Testing (Manual UAT)

| Area | Test Scenarios |
|------|---------------|
| Auth Flow | Register → Login → Protected route → Logout → Forgot password |
| Org Flow | Register org → Upload doc → Admin verify → Status reflects |
| Event Flow | Create → Edit → Publish → Cancel |
| Discovery | Browse → Search → Filter (category, location, date) → Pagination |
| Volunteer | Join event → Duplicate prevention → History page |
| Attendance | QR display → Scan → Status update → History |
| Report | Submit → Upload photos → Submit → Approve/reject → Status |
| Certificate | Generate → List → Download PDF |
| Dashboard | Metrics display → Data accuracy |
| Responsive | All pages on 360px viewport (no horizontal scroll, all CTAs accessible) |

### Regression Testing

- Setiap akhir sprint, lakukan regression test pada sprint sebelumnya
- Fokus: workflow utama tidak rusak setelah penambahan fitur baru

---

## 9. Risks & Mitigation

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| RISK-001 | Scope creep | High | High | Kunci scope sesuai PRD, fitur baru harus diskusi tim |
| RISK-002 | Integrasi FE-BE terlambat | High | High | Kontrak API disepakati sebelum coding, integrasi bertahap |
| RISK-003 | QR Attendance kompleks | Medium | High | PoC QR lebih awal, sederhanakan jika perlu |
| RISK-004 | PDF certificate format | Medium | Medium | Template dari awal, uji lebih awal |
| RISK-005 | Data testing tidak memadai | Medium | Medium | Siapkan seeder untuk semua role dan data demo |
| RISK-006 | Bug menjelang Expo | High | High | Buffer testing 1 minggu, regression test, freeze fitur |
| RISK-007 | Ketergantungan anggota | Medium | High | Dokumentasi kode, code review, sharing knowledge |
| RISK-008 | Waktu terbatas | High | High | Fokus Must Have, tunda Notifications & Multi-Org |
| RISK-009 | Responsive design issues | Medium | Medium | Uji responsive dari awal, pakai shadcn/ui |
| RISK-010 | Kehilangan data | Low | High | Migration versioning, backup berkala |
| RISK-011 | Performa query | Medium | Medium | Eager loading, hindari N+1, review query dashboard |
| RISK-012 | Demo gagal saat Expo | Medium | High | Siapkan akun demo, data lengkap, simulasi presentasi, video backup |

### Top Priority Risks

1. **Scope Creep** (RISK-001) — Jangan tambah fitur di luar sprint scope
2. **Integrasi Terlambat** (RISK-002) — Sync API contract sebelum coding
3. **Bug Menjelang Expo** (RISK-006) — Buffer testing, regression
4. **Waktu Terbatas** (RISK-008) — Prioritaskan Must Have
5. **Demo Gagal** (RISK-012) — Persiapan matang, backup plan

---

## 10. Definition of Done (Global)

Setiap task dinyatakan selesai jika:

- [ ] Kode diimplementasikan sesuai acceptance criteria
- [ ] Validasi input berjalan (Form Request di backend, form validation di frontend)
- [ ] API response konsisten mengikuti api-conventions.md
- [ ] Data tersimpan sesuai database-design.md
- [ ] Feature test (backend) lulus untuk modul terkait
- [ ] Manual UAT (frontend) workflow berjalan tanpa error
- [ ] Tidak ada critical bug
- [ ] Tidak ada perubahan arsitektur tanpa persetujuan

---

## 11. Sprint Exit Criteria

### Sprint 01 Exit

- [ ] User dapat register, login, logout
- [ ] User dapat reset password
- [ ] User dapat mengelola profil (update, upload foto)
- [ ] Authentication API memiliki feature test
- [ ] Seluruh halaman auth responsif
- [ ] Tidak ada critical bug

### Sprint 02 Exit

- [ ] Organisasi dapat didaftarkan dan diverifikasi
- [ ] Anggota organisasi dapat dikelola
- [ ] Event dapat dibuat, diedit, dipublikasikan
- [ ] Event discovery (browse, search, filter) berfungsi
- [ ] Relawan dapat mendaftar event
- [ ] Riwayat partisipasi tersedia
- [ ] Tidak ada critical bug
- [ ] Regression Sprint 01 passed

### Sprint 03 Exit

- [ ] QR attendance dapat di-generate dan di-scan
- [ ] Kehadiran relawan tercatat
- [ ] Laporan dapat dikirim dan disetujui/ditolak
- [ ] Sertifikat dapat di-generate otomatis
- [ ] Sertifikat dapat di-download PDF
- [ ] Analytics dashboard menampilkan metrik valid
- [ ] Seluruh workflow end-to-end berjalan
- [ ] Tidak ada critical bug
- [ ] Regression Sprint 01 & 02 passed

---

## 12. File Structure Plan

### Backend (Laravel)

```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── AuthController.php
│   │   ├── ProfileController.php
│   │   ├── OrganizationController.php
│   │   ├── OrganizationMemberController.php
│   │   ├── AdminOrganizationController.php
│   │   ├── EventController.php
│   │   ├── EventCategoryController.php
│   │   ├── VolunteerRegistrationController.php
│   │   ├── AttendanceController.php
│   │   ├── ReportController.php
│   │   ├── CertificateController.php
│   │   └── AnalyticsController.php
│   ├── Requests/
│   │   ├── Auth/
│   │   ├── Organization/
│   │   ├── Event/
│   │   └── Report/
│   └── Resources/
│       ├── UserResource.php
│       ├── OrganizationResource.php
│       ├── EventResource.php
│       └── ...
├── Services/
│   ├── AuthService.php
│   ├── OrganizationService.php
│   ├── EventService.php
│   ├── AttendanceService.php
│   ├── ReportService.php
│   ├── CertificateService.php
│   └── AnalyticsService.php
├── Repositories/
│   ├── UserRepository.php
│   ├── OrganizationRepository.php
│   ├── EventRepository.php
│   └── ...
└── Models/
    ├── User.php
    ├── Organization.php
    ├── OrganizationMembership.php
    ├── Event.php
    ├── EventCategory.php
    ├── VolunteerRegistration.php
    ├── Attendance.php
    ├── EventReport.php
    ├── EventDocumentation.php
    ├── Certificate.php
    └── Notification.php
```

### Frontend (Next.js)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── profile/
│   │   ├── organizations/
│   │   ├── events/
│   │   ├── volunteer/
│   │   ├── certificates/
│   │   └── analytics/
│   └── events/
│       └── [id]/
├── components/
│   └── ui/ (shadcn components)
├── features/
│   ├── auth/
│   ├── organization/
│   ├── event/
│   ├── volunteer/
│   ├── attendance/
│   ├── report/
│   ├── certificate/
│   └── analytics/
├── services/
│   ├── auth.service.ts
│   ├── organization.service.ts
│   ├── event.service.ts
│   └── ...
├── hooks/
│   ├── useAuth.ts
│   ├── useOrganization.ts
│   └── ...
├── stores/
│   ├── auth.store.ts
│   └── organization.store.ts
├── types/
│   └── index.ts
└── lib/
    └── utils.ts
```

---

## 13. Timeline Estimasi

```
Minggu 1 (Sprint 01)    ████████░░░░░░░░░░░░  Foundation & Auth
Minggu 2 (Sprint 02)    ░░░░░░░░████████░░░░  Organization, Event, Volunteer
Minggu 3 (Sprint 03)    ░░░░░░░░░░░░░░██████  Attendance, Report, Certificate, Analytics
Minggu 4 (Testing)      ░░░░░░░░░░░░░░░░░░██  End-to-End QA, Bug Fixing
Minggu 5 (Expo Prep)    ░░░░░░░░░░░░░░░░░░░░  Demo Prep, RC, Presentasi
                        |                      |
                    12 Jun                   Mid Jul
```

---

## 14. Keputusan Arsitektur yang Sudah Ditetapkan

| Keputusan | Detail |
|-----------|--------|
| DEC-001 | Platform terbuka untuk semua komunitas, bukan hanya kampus |
| DEC-005 | Monolithic architecture |
| DEC-006 | Laravel 12 backend |
| DEC-007 | Next.js frontend |
| DEC-008 | Tailwind + shadcn/ui |
| DEC-009 | Laravel Sanctum Bearer Token |
| DEC-010 | REST API `/api/v1` |
| DEC-011 | Service Layer + Repository Pattern |
| DEC-012 | Zustand untuk state management |
| DEC-013 | TanStack Query untuk data fetching |
| DEC-014 | Feature Test backend + Manual UAT frontend |
| DEC-015 | Pendaftaran relawan langsung approved |
| DEC-016 | QR Code attendance |
| DEC-017 | Minimal 1 foto, maksimal 5 foto per laporan |
| DEC-018 | Sertifikat otomatis setelah event completed & report approved |
| DEC-019 | Analytics realtime dari database (tanpa warehouse) |
| DEC-020 | Notifications & Multi-Org kandidat pertama ditunda jika waktu terbatas |

---

> **Dokumen ini siap digunakan sebagai acuan implementasi.**
>
> Langkah selanjutnya: Tentukan sprint aktif dan mulai implementasi sesuai urutan task.
