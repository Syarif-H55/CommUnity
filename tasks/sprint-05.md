# Sprint 05 - Email Notifications, Export & Advanced Features

## Sprint Goal

Mengimplementasikan fitur lanjutan yang mencakup email notification, export data, enhanced documentation galleries, public organization profile, dan penyempurnaan sistem yang sudah ada.

Sprint ini merupakan fase Version 1.5 yang berfokus pada fitur pendukung operasional.

---

## Sprint Duration

1 Week

---

## Context Documents

Required Reading:

- product/product-vision.md
- architecture/architecture.md
- architecture/database-design.md
- architecture/api-conventions.md
- architecture/coding-standards.md
- planning/roadmap.md
- tasks/backlog.md
- tasks/sprint-04.md

---

## User Stories Covered

Notification Enhancement

- Email Notification (lanjutan US-024)

Data Management

- Export Attendance Report
- Export Event Report
- Multiple Documentation Galleries

Organization

- Public Organization Profile

Dashboard

- Enhanced Analytics Dashboard (lanjutan)

---

## Database Changes Required

- email_notifications table (baru)
- email_templates table (baru)
- organization_public_profiles migration (update)

---

## Task Breakdown

### TASK-S05-001

Title:
Email Notification System Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
L

Related User Stories:
- Email Notification

Objective:

Mengimplementasikan backend untuk mengirim notifikasi melalui email.

Implementation Tasks:
- Email notifications migration
- Email templates migration
- Mail configuration setup
- Email sending service
- Template rendering service
- Email queue setup
- Email history tracking

Acceptance Criteria:
- Email terkirim untuk event penting
- Template email dapat dikustomisasi
- Riwayat email tersimpan
- Email tidak memblokir response API

Verification Steps:
- Email sending testing
- Template rendering testing
- Email history testing

Dependencies:
- TASK-S04-001

---

### TASK-S05-002

Title:
Email Notification System Frontend

Owner:
Hiraldy

Support Owner:
Abdillah

Priority:
High

Estimated Effort:
M

Related User Stories:
- Email Notification

Objective:

Menyediakan antarmuka pengaturan notifikasi email untuk user.

Implementation Tasks:
- Email notification preferences page
- Subscribe/unsubscribe email toggle
- Email notification history page
- Preference save integration

Acceptance Criteria:
- User dapat mengatur preferensi email
- Perubahan preferensi tersimpan
- Riwayat email dapat dilihat

Verification Steps:
- Preference update testing
- Email history display testing

Dependencies:
- TASK-S05-001

---

### TASK-S05-003

Title:
Export Data Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
M

Related User Stories:
- Export Attendance Report
- Export Event Report

Objective:

Mengimplementasikan export data untuk attendance report dan event report dalam format CSV/Excel.

Implementation Tasks:
- Export service
- Attendance report export
- Event report export
- CSV generation
- Excel generation (optional)
- Export history tracking

Acceptance Criteria:
- Attendance report dapat diexport
- Event report dapat diexport
- Data export akurat
- Format file sesuai standar

Verification Steps:
- Export format testing
- Data accuracy testing
- Large dataset testing

Dependencies:
- Sprint 03 completed

---

### TASK-S05-004

Title:
Export Data Frontend

Owner:
Abdillah

Support Owner:
Hiraldy

Priority:
High

Estimated Effort:
M

Related User Stories:
- Export Attendance Report
- Export Event Report

Objective:

Menyediakan tombol dan antarmuka export data pada halaman attendance dan report.

Implementation Tasks:
- Export button on attendance page
- Export button on report page
- Export format selector
- Download progress indicator
- Export history page

Acceptance Criteria:
- User dapat mengexport data attendance
- User dapat mengexport data report
- Format export dapat dipilih
- Progress export ditampilkan

Verification Steps:
- Manual export testing
- Download validation testing

Dependencies:
- TASK-S05-003

---

### TASK-S05-005

Title:
Public Organization Profile Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
Medium

Estimated Effort:
M

Related User Stories:
- Public Organization Profile

Objective:

Menyediakan halaman profil publik untuk organisasi yang dapat dilihat oleh pengguna tanpa login.

Implementation Tasks:
- Public profile endpoint
- Organization social links
- Organization activity history public API
- Organization statistics public API

Acceptance Criteria:
- Profil organisasi dapat diakses publik
- Menampilkan informasi dasar organisasi
- Menampilkan kegiatan yang sudah selesai
- Tidak memerlukan login

Verification Steps:
- Public access testing
- Data accuracy testing

Dependencies:
- Sprint 03 completed

---

### TASK-S05-006

Title:
Public Organization Profile Frontend

Owner:
Hiraldy

Support Owner:
Abdillah

Priority:
Medium

Estimated Effort:
M

Related User Stories:
- Public Organization Profile

Objective:

Membangun halaman profil publik organisasi.

Implementation Tasks:
- Public organization page
- Organization info section
- Completed events list (public)
- Organization stats display
- Share organization profile

Acceptance Criteria:
- Halaman profil publik tampil
- Informasi organisasi ditampilkan
- Event selesai ditampilkan
- Dapat diakses tanpa login

Verification Steps:
- Manual public page testing
- Unauthenticated access testing

Dependencies:
- TASK-S05-005

---

### TASK-S05-007

Title:
Multiple Documentation Galleries Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
Medium

Estimated Effort:
S

Related User Stories:
- Multiple Documentation Galleries

Objective:

Meningkatkan sistem upload dokumentasi untuk mendukung multiple galleries per event report.

Implementation Tasks:
- Gallery grouping migration
- Gallery CRUD API
- Gallery reordering API
- Gallery cover image selection

Acceptance Criteria:
- Report dapat memiliki multiple galleries
- Gallery dapat diurutkan
- Gallery memiliki cover image

Verification Steps:
- Gallery creation testing
- Gallery ordering testing

Dependencies:
- TASK-S05-003

---

### TASK-S05-008

Title:
Multiple Documentation Galleries Frontend

Owner:
Abdillah

Support Owner:
Hiraldy

Priority:
Medium

Estimated Effort:
M

Related User Stories:
- Multiple Documentation Galleries

Objective:

Menyediakan antarmuka untuk mengelola multiple documentation galleries pada event report.

Implementation Tasks:
- Gallery management UI
- Gallery create/edit modal
- Gallery reorder (drag and drop)
- Gallery cover selector
- Gallery view on report detail

Acceptance Criteria:
- User dapat membuat multiple galleries
- User dapat mengatur urutan gallery
- Gallery cover dapat dipilih
- Gallery tampil pada halaman report

Verification Steps:
- Gallery management testing
- Gallery display testing

Dependencies:
- TASK-S05-007

---

### TASK-S05-009

Title:
Sprint 05 QA & Integration Testing

Owner:
Irham

Support Owner:
Syarif

Priority:
High

Estimated Effort:
L

Objective:

Melakukan pengujian seluruh fitur Sprint 05 dan memastikan tidak ada regresi.

Implementation Tasks:
- Email notification testing
- Export data testing
- Public profile testing
- Documentation galleries testing
- Regression testing Sprint 01-04
- Bug documentation
- Email delivery testing

Acceptance Criteria:
- Tidak ada critical bug
- Email notifikasi terkirim
- Export data akurat
- Profil publik berfungsi
- Galleries berfungsi

Verification Steps:
- Execute QA checklist
- Produce QA report
- Verify bug fixes

Dependencies:
- All Sprint 05 tasks

---

## Sprint Definition of Done

Sprint dianggap selesai apabila:
- Email notification berfungsi
- Export attendance & report berfungsi
- Public organization profile dapat diakses
- Multiple documentation galleries berfungsi
- Seluruh fitur terintegrasi tanpa regresi

---

## AI Execution Notes

- Email dikirim menggunakan Laravel Mail
- Export menggunakan format CSV sebagai default
- Public profile tidak memerlukan autentikasi
- Follow architecture documents strictly
- Follow database-design.md strictly
- Follow API conventions strictly
