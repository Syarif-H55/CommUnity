# Sprint 03 - Attendance, Reporting, Certificate & Analytics

## Sprint Goal

Menyelesaikan seluruh workflow operasional CommUnity mulai dari validasi kehadiran relawan, pelaporan kegiatan, penerbitan sertifikat digital, hingga penyajian analytics dashboard.

Sprint ini menandai penyelesaian seluruh fitur MVP yang akan digunakan pada Expo Release.

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
- planning/decisions.md
- tasks/backlog.md
- tasks/sprint-01.md
- tasks/sprint-02.md

---

## User Stories Covered

Attendance Validation

- US-015 Generate Attendance QR
- US-016 Validate Attendance

Event Reporting

- US-017 Submit Event Report
- US-018 Review Event Report

Certificate Management

- US-019 Generate Digital Certificate
- US-020 Download Certificate

Analytics Dashboard

- US-021 View Community Analytics

---

# Task Breakdown

## TASK-017

Title:
Attendance Management Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-015
- US-016

Objective:

Mengimplementasikan backend attendance validation menggunakan QR Code.

Implementation Tasks:

- Attendance migration
- Attendance status management
- QR generation service
- QR validation endpoint
- Duplicate attendance prevention
- Attendance history API

Acceptance Criteria:

- QR dapat dibuat
- QR dapat divalidasi
- Attendance tersimpan
- Duplicate attendance dicegah

Verification Steps:

- Generate QR testing
- Attendance validation testing
- Duplicate scan testing

Dependencies:

- Sprint 02 completed

---

## TASK-018

Title:
Attendance Management Frontend

Owner:
Hiraldy

Support Owner:
Abdillah

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-015
- US-016

Objective:

Membangun antarmuka attendance validation.

Implementation Tasks:

- Attendance dashboard
- QR display page
- QR scanner page
- Attendance history page
- Attendance status display

Acceptance Criteria:

- QR tampil dengan benar
- QR dapat dipindai
- Attendance status tampil

Verification Steps:

- Manual attendance workflow testing

Dependencies:

TASK-017

---

## TASK-019

Title:
Event Reporting Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-017
- US-018

Objective:

Mengimplementasikan backend event reporting dan report review workflow.

Implementation Tasks:

- Event reports migration
- Event report photos migration
- Report submission API
- Report review API
- Report approval workflow
- Report rejection workflow

Acceptance Criteria:

- Laporan dapat dikirim
- Minimal 1 foto wajib
- Maksimal 5 foto diperbolehkan
- Admin dapat approve/reject

Verification Steps:

- Report submission testing
- Report approval testing
- Photo upload testing

Dependencies:

TASK-017

---

## TASK-020

Title:
Event Reporting Frontend

Owner:
Abdillah

Support Owner:
Hiraldy

Priority:
High

Estimated Effort:
L

Related User Stories:

- US-017
- US-018

Objective:

Membangun antarmuka pelaporan kegiatan.

Implementation Tasks:

- Report submission page
- Photo upload component
- Report detail page
- Report review page
- Report status page

Acceptance Criteria:

- Laporan dapat dibuat
- Foto dapat diunggah
- Status laporan tampil

Verification Steps:

- Manual reporting workflow testing

Dependencies:

TASK-019

---

## TASK-021

Title:
Certificate Generation Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
M

Related User Stories:

- US-019
- US-020

Objective:

Mengimplementasikan pembuatan sertifikat digital otomatis.

Implementation Tasks:

- Certificate migration
- Certificate generation service
- PDF generation service
- Certificate storage
- Certificate download API

Acceptance Criteria:

- Sertifikat dibuat otomatis
- PDF dapat dihasilkan
- Data sertifikat tersimpan

Verification Steps:

- Certificate generation testing
- PDF validation testing

Dependencies:

TASK-019

---

## TASK-022

Title:
Certificate Management Frontend

Owner:
Hiraldy

Support Owner:
Abdillah

Priority:
Medium

Estimated Effort:
M

Related User Stories:

- US-019
- US-020

Objective:

Membangun halaman sertifikat relawan.

Implementation Tasks:

- Certificate page
- Certificate list
- Certificate detail
- Download certificate button

Acceptance Criteria:

- Sertifikat tampil
- PDF dapat diunduh

Verification Steps:

- Download testing
- Certificate display testing

Dependencies:

TASK-021

---

## TASK-023

Title:
Analytics Dashboard Backend

Owner:
Syarif

Support Owner:
Irham

Priority:
High

Estimated Effort:
M

Related User Stories:

- US-021

Objective:

Menyediakan data analytics untuk dashboard organisasi.

Implementation Tasks:

- Analytics service
- Event count query
- Volunteer count query
- Completed event query
- Attendance rate calculation
- Analytics API

Acceptance Criteria:

- Semua metrik tersedia
- Data akurat
- Response cepat

Verification Steps:

- Query validation
- Analytics accuracy testing

Dependencies:

TASK-021

---

## TASK-024

Title:
Analytics Dashboard Frontend

Owner:
Abdillah

Support Owner:
Hiraldy

Priority:
Medium

Estimated Effort:
M

Related User Stories:

- US-021

Objective:

Membangun dashboard analytics organisasi.

Implementation Tasks:

- Analytics dashboard page
- Metric cards
- Summary statistics
- Dashboard integration

Acceptance Criteria:

- Semua metrik tampil
- Data sinkron dengan backend

Verification Steps:

- Dashboard testing
- Data validation testing

Dependencies:

TASK-023

---

## TASK-025

Title:
Sprint 03 QA & End-to-End Testing

Owner:
Irham

Support Owner:
Syarif

Priority:
High

Estimated Effort:
L

Objective:

Melakukan pengujian seluruh workflow CommUnity dari awal hingga akhir.

Implementation Tasks:

- Attendance workflow testing
- Reporting workflow testing
- Certificate workflow testing
- Analytics validation
- End-to-end testing
- Regression testing Sprint 01 & Sprint 02
- Bug documentation

Acceptance Criteria:

- Tidak ada critical bug
- Workflow berjalan end-to-end
- Data konsisten

Verification Steps:

- Execute QA checklist
- Produce QA report
- Verify bug fixes

Dependencies:

TASK-018
TASK-020
TASK-022
TASK-024

---

# AI Execution Notes

- Follow architecture documents strictly.
- Follow database-design.md strictly.
- Follow API conventions strictly.
- Follow coding standards strictly.
- Do not introduce new dependencies without approval.
- Attendance status must support:
  - Present
  - Late
  - Absent
- Report photo upload:
  - Minimum 1 photo
  - Maximum 5 photos
- Certificates are generated only after:
  - Event completed
  - Report approved
- Analytics must be calculated from realtime database queries.
- Implement only Sprint 03 scope.

---

# Sprint Definition of Done

Sprint dianggap selesai apabila:

- Attendance QR berjalan.
- Attendance validation berjalan.
- Event reporting berjalan.
- Report approval berjalan.
- Certificate generation berjalan.
- Certificate download berjalan.
- Analytics dashboard berjalan.
- Seluruh workflow terintegrasi.

---

# Sprint Exit Criteria

Sebelum masuk fase Testing & Expo Preparation:

- Relawan dapat melakukan attendance.
- Koordinator dapat mengirim laporan kegiatan.
- Admin dapat menyetujui laporan.
- Sertifikat dapat dihasilkan otomatis.
- Sertifikat dapat diunduh.
- Analytics dashboard menampilkan data yang valid.
- Seluruh workflow CommUnity berjalan end-to-end.
- Tidak ada critical bug yang menghalangi demonstrasi Expo.