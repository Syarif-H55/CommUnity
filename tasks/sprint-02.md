# Sprint 02 - Organization, Event & Volunteer Management

## Sprint Goal

Mengimplementasikan fitur utama CommUnity yang memungkinkan organisasi membuat kegiatan sosial dan relawan menemukan serta mengikuti kegiatan tersebut.

---

## Sprint Duration

1 Week

---

## Context Documents

Required Reading:

- product/product-vision.md
- product/scope.md
- architecture/architecture.md
- architecture/database-design.md
- architecture/api-conventions.md
- architecture/coding-standards.md
- planning/decisions.md
- tasks/backlog.md
- tasks/sprint-01.md

---

## User Stories Covered

Organization Management

- US-005 Register Organization
- US-006 Verify Organization
- US-007 Manage Organization Members

Event Management

- US-008 Create Event
- US-009 Edit Event
- US-010 Publish Event

Volunteer Participation

- US-011 Browse Events
- US-012 Search & Filter Events
- US-013 Register for Event
- US-014 View Participation History

---

# Task Breakdown

## TASK-008 - ✅ COMPLETED

Title:
Organization Module Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-005
- US-006

Objective:

Mengimplementasikan backend untuk pendaftaran dan verifikasi organisasi.

Implementation Tasks:

- ✅ Create organizations migration
- ✅ Create organization documents migration
- ✅ Create organization models
- ✅ Create organization API endpoints
- ✅ Create verification workflow
- ✅ Implement organization status management

Acceptance Criteria:

- ✅ Organisasi dapat didaftarkan
- ✅ Dokumen verifikasi dapat diunggah
- ✅ Status organisasi tersimpan
- ✅ Admin dapat approve atau reject

Verification Steps:

- ✅ Test organization registration
- ✅ Test verification workflow
- ✅ Verify status updates

Dependencies:

- Sprint 01 completed

---

## TASK-009 - ✅ COMPLETED

Title:
Organization Management Frontend

Owner:
Hiraldy

Support Owner:
Abdillah

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-005
- US-006

Objective:

Membangun UI untuk pendaftaran dan manajemen organisasi.

Implementation Tasks:

- ✅ Organization registration page
- ✅ Organization detail page
- ✅ Verification status page
- ✅ Upload document form
- ✅ Organization dashboard

Acceptance Criteria:

- ✅ Form dapat digunakan
- ✅ Dokumen dapat diunggah
- ✅ Status organisasi tampil dengan benar

Verification Steps:

- ✅ Manual registration testing
- ✅ Upload testing

Dependencies:

TASK-008

---

## TASK-010 - ✅ COMPLETED

Title:
Organization Member Management

Owner:
Syarif

Support Owner:
Abdillah

Priority:
Medium

Estimated Effort:
M

Related User Stories:

- US-007

Objective:

Mengelola anggota organisasi dan role organisasi.

Implementation Tasks:

- ✅ Membership API
- ✅ Add member workflow
- ✅ Remove member workflow
- ✅ Assign role workflow
- ✅ Membership listing

Acceptance Criteria:

- ✅ Anggota dapat ditambahkan
- ✅ Role dapat ditetapkan
- ✅ Daftar anggota tampil dengan benar

Verification Steps:

- ✅ Membership testing
- ✅ Role assignment testing

Dependencies:

TASK-008

---

## TASK-011 - ✅ COMPLETED

Title:
Event Module Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-008
- US-009
- US-010

Objective:

Mengimplementasikan backend event management.

Implementation Tasks:

- ✅ Events migration
- ✅ Event categories migration
- ✅ Event API endpoints
- ✅ Create event workflow
- ✅ Edit event workflow
- ✅ Publish event workflow

Acceptance Criteria:

- ✅ Event dapat dibuat
- ✅ Event dapat diubah
- ✅ Event dapat dipublikasikan

Verification Steps:

- ✅ Create event testing
- ✅ Edit event testing
- ✅ Publish event testing

Dependencies:

TASK-008

---

## TASK-012 - ✅ COMPLETED

Title:
Event Management Frontend

Owner:
Hiraldy

Support Owner:
Abdillah

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-008
- US-009
- US-010

Objective:

Membangun antarmuka event management.

Implementation Tasks:

- Create event page
- Edit event page
- Event detail page
- Event publishing workflow

Acceptance Criteria:

- ✅ Event dapat dibuat dari UI
- ✅ Event dapat diperbarui
- ✅ Event dapat dipublikasikan

Verification Steps:

- ✅ TC-S2-B016: create_event_with_valid_data — PASS
- ✅ TC-S2-B021: update_event — PASS
- ✅ TC-S2-B023: publish_event — PASS

Dependencies:

TASK-011

---

## TASK-013 - ✅ COMPLETED

Title:
Event Discovery Module

Owner:
Abdillah

Support Owner:
Syarif

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-011
- US-012

Objective:

Membangun halaman pencarian dan eksplorasi event.

Implementation Tasks:

- Event listing page
- Event detail page
- Search functionality
- Category filter
- Location filter
- Date filter
- Pagination

Acceptance Criteria:

- ✅ Event tampil dengan benar
- ✅ Search berfungsi
- ✅ Filter berfungsi

Verification Steps:

- ✅ TC-S2-B027: list_events_with_pagination — PASS
- ✅ TC-S2-B028: search_events — PASS
- ✅ TC-S2-B029: filter_events_by_category — PASS

Dependencies:

TASK-011

---

## TASK-014 - ✅ COMPLETED

Title:
Volunteer Registration Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
M

Related User Stories:

- US-013
- US-014

Objective:

Mengimplementasikan fitur pendaftaran relawan.

Implementation Tasks:

- Volunteer registration API
- Participation records
- Duplicate registration prevention
- Participation history API

Acceptance Criteria:

- ✅ Relawan dapat mendaftar
- ✅ Duplikasi dicegah
- ✅ Riwayat partisipasi tersedia

Verification Steps:

- ✅ TC-S2-B030: volunteer_register_for_published_event — PASS
- ✅ TC-S2-B031: volunteer_cannot_register_twice — PASS
- ✅ TC-S2-B034: view_registration_history — PASS
- ✅ TC-S2-B035: filter_history_by_status — PASS

Dependencies:

TASK-011

---

## TASK-015 - ✅ COMPLETED

Title:
Volunteer Participation Frontend

Owner:
Abdillah

Support Owner:
Hiraldy

Priority:
High

Estimated Effort:
M

Related User Stories:

- US-013
- US-014

Objective:

Membangun antarmuka pendaftaran dan riwayat partisipasi relawan.

Implementation Tasks:

- Join event button
- Registration confirmation
- Participation history page
- Event participation status

Acceptance Criteria:

- ✅ Relawan dapat mendaftar event
- ✅ Status partisipasi tampil
- ✅ Riwayat partisipasi tampil

Verification Steps:

- ✅ TC-S2-F007: public event detail + register flow (manual / Playwright)

Dependencies:

TASK-014
TASK-013

---

## TASK-016 - ✅ COMPLETED

Title:
Organization, Event & Volunteer QA

Owner:
Irham

Support Owner:
Syarif

Priority:
High

Estimated Effort:
L

Objective:

Melakukan pengujian seluruh workflow Sprint 02.

Implementation Tasks:

- Organization workflow testing
- Event workflow testing
- Volunteer workflow testing
- Bug documentation
- Regression testing Sprint 01

Acceptance Criteria:

- ✅ Tidak ada critical bug
- ✅ Workflow utama berjalan

Verification Steps:

- ✅ PHPUnit: 64/64 feature tests — PASS
- ✅ TestSprite: 30/30 backend API tests — PASS
- ✅ QA report generated: testsprite_tests/testsprite_sprint02_qa_report.md
- ✅ 8/8 Definition of Done criteria — MET
- ✅ 5/5 Sprint Exit Criteria — MET

Dependencies:

TASK-009
TASK-012
TASK-015

---

# AI Execution Notes

- Follow all architecture documents.
- Follow API conventions strictly.
- Follow coding standards strictly.
- Do not introduce new packages without approval.
- Use existing authentication and authorization system from Sprint 01.
- Only verified organizations may create events.
- Event Discovery only displays published events.
- Volunteer registration is automatically approved.
- Implement only Sprint 02 scope.

---

# Sprint Definition of Done

Sprint dianggap selesai apabila:

- Organisasi dapat didaftarkan.
- Organisasi dapat diverifikasi.
- Event dapat dibuat, diubah, dan dipublikasikan.
- Event dapat ditemukan melalui Discovery Page.
- Search dan Filter berfungsi.
- Relawan dapat mendaftar event.
- Riwayat partisipasi tersedia.
- Seluruh modul terintegrasi dengan Sprint 01.

---

# Sprint Exit Criteria

Sebelum Sprint 03 dimulai:

- Organization workflow berjalan end-to-end.
- Event workflow berjalan end-to-end.
- Volunteer workflow berjalan end-to-end.
- Tidak ada critical bug pada fitur Sprint 02.
- Data tersimpan sesuai database design.