# Sprint 01 - Foundation & Authentication

## Sprint Goal

Membangun fondasi teknis CommUnity serta menyelesaikan seluruh fitur Authentication & Account Management yang diperlukan sebelum pengembangan fitur bisnis utama.

---

## Sprint Duration

1 Week

---

## Context Documents

Required Reading:

- product/product-vision.md
- product/project-brief.md
- architecture/tech-stack.md
- architecture/architecture.md
- architecture/database-design.md
- architecture/api-conventions.md
- architecture/coding-standards.md
- planning/decisions.md
- tasks/backlog.md

---

## User Stories Covered

- US-001 User Registration
- US-002 User Login
- US-003 Forgot Password
- US-004 Manage Profile

---

# Task Breakdown

## TASK-001

Title:
Project Repository Setup

Owner:
Syarif

Support Owner:
Hiraldy

Priority:
High

Estimated Effort:
S

Objective:

Membangun struktur dasar backend dan frontend sesuai tech stack yang telah disepakati.

Implementation Tasks:

- Setup Laravel 12 backend
- Setup Next.js frontend
- Setup Git repository
- Setup folder structure
- Setup environment configuration

Acceptance Criteria:

- Backend dapat dijalankan
- Frontend dapat dijalankan
- Repository dapat digunakan seluruh anggota tim

Verification Steps:

- Run backend server
- Run frontend server
- Verify repository structure

Dependencies:

None

---

## TASK-002

Title:
Database Foundation

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
M

Objective:

Membangun database awal untuk kebutuhan authentication dan user management.

Implementation Tasks:

- Create users migration
- Create roles migration
- Create user_roles migration
- Create seeders
- Create model relationships

Acceptance Criteria:

- Migration berjalan tanpa error
- Seeder berhasil dijalankan
- Relasi database berjalan sesuai desain

Verification Steps:

- Run migration fresh
- Run seeders
- Verify database structure

Dependencies:

TASK-001

---

## TASK-003

Title:
Authentication API Development

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-001
- US-002
- US-003

Objective:

Mengimplementasikan REST API Authentication menggunakan Laravel Sanctum.

Implementation Tasks:

- Register endpoint
- Login endpoint
- Logout endpoint
- Forgot password endpoint
- Request validation
- API resource response
- Sanctum integration

Acceptance Criteria:

- User dapat register
- User dapat login
- User dapat logout
- User dapat reset password
- API mengikuti api-conventions.md

Verification Steps:

- Feature test register
- Feature test login
- Feature test logout
- Feature test forgot password

Dependencies:

TASK-002

---

## TASK-004

Title:
Frontend Authentication Pages

Owner:
Hiraldy

Support Owner:
Abdillah

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-001
- US-002
- US-003

Objective:

Membangun halaman autentikasi untuk pengguna.

Implementation Tasks:

- Login page
- Register page
- Forgot password page
- Form validation
- Error handling
- Loading state

Acceptance Criteria:

- Seluruh halaman dapat diakses
- Validasi form berjalan
- Error message tampil dengan benar

Verification Steps:

- Manual authentication testing
- Validation testing

Dependencies:

TASK-001

---

## TASK-005

Title:
Authentication Integration

Owner:
Hiraldy

Support Owner:
Syarif

Priority:
High

Estimated Effort:
M

Objective:

Menghubungkan frontend dengan backend authentication API.

Implementation Tasks:

- API integration
- Token storage
- Login session management
- Protected routes
- Logout handling

Acceptance Criteria:

- Login berhasil
- Session tersimpan
- Protected page dapat diakses
- Logout berhasil

Verification Steps:

- End-to-end login test
- End-to-end logout test

Dependencies:

TASK-003
TASK-004

---

## TASK-006

Title:
Profile Management

Owner:
Abdillah

Support Owner:
Syarif

Priority:
Medium

Estimated Effort:
M

Related User Stories:

- US-004

Objective:

Membangun fitur profile management dasar.

Implementation Tasks:

- Profile page
- Edit profile form
- Profile image upload
- Update profile API integration

Acceptance Criteria:

- User dapat melihat profil
- User dapat mengubah data profil
- User dapat mengunggah foto profil

Verification Steps:

- Manual profile update test
- Image upload test

Dependencies:

TASK-005

---

## TASK-007

Title:
Authentication Testing & QA

Owner:
Irham

Support Owner:
Syarif

Priority:
High

Estimated Effort:
M

Objective:

Memastikan seluruh workflow authentication berjalan dengan benar.

Implementation Tasks:

- Registration testing
- Login testing
- Logout testing
- Forgot password testing
- Profile testing
- Bug documentation

Acceptance Criteria:

- Tidak ada critical bug
- Workflow berjalan sesuai PRD

Verification Steps:

- Execute test checklist
- Create QA report

Dependencies:

TASK-003
TASK-005
TASK-006

---

# AI Execution Notes

- Follow architecture/architecture.md
- Follow architecture/database-design.md
- Follow architecture/api-conventions.md
- Follow architecture/coding-standards.md
- Do not introduce additional libraries without approval
- Use Laravel Sanctum for authentication
- Use Zustand for state management
- Use TanStack Query for API communication
- Use shadcn/ui components
- Implement only Sprint 01 scope

---

# Sprint Definition of Done

Sprint dianggap selesai apabila:

- Authentication API selesai.
- Authentication UI selesai.
- Profile Management selesai.
- Backend dan frontend terintegrasi.
- Testing berhasil dilakukan.
- Tidak terdapat critical bug.

---

# Sprint Exit Criteria

Sebelum Sprint 02 dimulai:

- User dapat register.
- User dapat login.
- User dapat logout.
- User dapat reset password.
- User dapat mengelola profil.
- Seluruh authentication workflow berjalan end-to-end.