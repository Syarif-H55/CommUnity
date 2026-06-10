# CommUnity Decision Log

## Purpose

Dokumen ini mencatat keputusan produk, arsitektur, dan teknis yang telah disepakati selama pengembangan CommUnity.

Tujuan dokumen ini adalah:

* Menjadi sumber kebenaran (source of truth) untuk keputusan proyek.
* Menghindari perdebatan yang sudah pernah diselesaikan.
* Memberikan konteks kepada developer baru dan AI agent.
* Mendokumentasikan alasan di balik keputusan penting.

---

# Decision Format

Setiap keputusan dicatat dengan format:

* ID
* Category
* Decision
* Rationale
* Alternatives Considered
* Status

Status yang digunakan:

```text
Accepted
Deprecated
Superseded
```

---

# DEC-001

## Category

Product Scope

## Decision

CommUnity difokuskan sebagai platform manajemen kegiatan sosial komunitas berbasis digital.

## Rationale

Aplikasi tidak hanya membantu organisasi mengelola kegiatan sosial, tetapi juga membantu relawan menemukan kegiatan sosial yang ingin mereka ikuti.

## Alternatives Considered

* Internal event management system
* Campus-only volunteer platform

## Status

Accepted

---

# DEC-002

## Category

Target Users

## Decision

Primary users CommUnity adalah komunitas sosial dan organisasi penyelenggara kegiatan sosial.

## Rationale

Model ini lebih selaras dengan fitur Event Discovery dan Volunteer Participation dibandingkan pendekatan yang hanya berfokus pada organisasi kampus.

## Alternatives Considered

* Campus organizations only

## Status

Accepted

---

# DEC-003

## Category

Platform

## Decision

CommUnity dikembangkan sebagai Responsive Web Application.

## Rationale

Lebih cepat dikembangkan, lebih mudah didemonstrasikan pada Expo, dan sesuai dengan kapasitas tim.

## Alternatives Considered

* Native Android
* Cross-platform mobile application

## Status

Accepted

---

# DEC-004

## Category

Deployment Strategy

## Decision

Versi Expo menggunakan localhost deployment.

## Rationale

Mengurangi kompleksitas deployment dan mempercepat proses demonstrasi.

## Alternatives Considered

* VPS deployment
* Cloud deployment

## Status

Accepted

---

# DEC-005

## Category

Architecture

## Decision

Menggunakan Monolithic Architecture.

## Rationale

Scope proyek masih relatif kecil dan tidak membutuhkan kompleksitas microservices.

## Alternatives Considered

* Microservices

## Status

Accepted

---

# DEC-006

## Category

Backend Framework

## Decision

Menggunakan Laravel 12.

## Rationale

Mendukung pengembangan cepat, memiliki ekosistem lengkap, dan sesuai kemampuan tim.

## Alternatives Considered

* Express.js
* NestJS
* Spring Boot

## Status

Accepted

---

# DEC-007

## Category

Frontend Framework

## Decision

Menggunakan Next.js.

## Rationale

Memberikan struktur aplikasi yang baik, mendukung scalability, dan cocok untuk aplikasi web modern.

## Alternatives Considered

* React Vite
* Vue.js

## Status

Accepted

---

# DEC-008

## Category

UI Framework

## Decision

Menggunakan Tailwind CSS dan shadcn/ui.

## Rationale

Mempercepat pengembangan UI sekaligus menjaga konsistensi desain.

## Alternatives Considered

* Bootstrap
* Material UI

## Status

Accepted

---

# DEC-009

## Category

Authentication

## Decision

Menggunakan Laravel Sanctum dengan Bearer Token Authentication.

## Rationale

Sederhana, aman, dan cocok untuk arsitektur REST API.

## Alternatives Considered

* JWT Authentication

## Status

Accepted

---

# DEC-010

## Category

API Architecture

## Decision

Menggunakan REST API dengan prefix versioning.

## Example

```text
/api/v1
```

## Rationale

Mudah dipahami, sederhana untuk dikembangkan, dan sesuai kebutuhan proyek.

## Alternatives Considered

* GraphQL

## Status

Accepted

---

# DEC-011

## Category

Backend Design Pattern

## Decision

Menggunakan Service Layer dan Repository Pattern.

## Architecture Flow

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
```

## Rationale

Memisahkan business logic dari database access sehingga kode lebih terstruktur dan mudah dipelihara.

## Alternatives Considered

* Controller → Model
* Controller → Service → Model

## Status

Accepted

---

# DEC-012

## Category

Frontend State Management

## Decision

Menggunakan Zustand.

## Rationale

Lebih ringan dan sederhana dibanding Redux untuk kebutuhan MVP.

## Alternatives Considered

* Redux Toolkit
* React Context

## Status

Accepted

---

# DEC-013

## Category

Data Fetching

## Decision

Menggunakan TanStack Query.

## Rationale

Menyediakan caching, retry mechanism, loading state, dan error handling secara built-in.

## Alternatives Considered

* Native Fetch API

## Status

Accepted

---

# DEC-014

## Category

Testing Strategy

## Decision

Backend menggunakan Feature Test dan frontend menggunakan Manual User Acceptance Testing.

## Rationale

Memberikan cakupan pengujian yang cukup dengan effort yang masih realistis untuk timeline proyek.

## Alternatives Considered

* Full automated testing

## Status

Accepted

---

# DEC-015

## Category

Volunteer Registration

## Decision

Pendaftaran relawan langsung berstatus approved.

## Rationale

Mengurangi proses administratif dan mempercepat partisipasi relawan.

## Alternatives Considered

* Manual approval oleh penyelenggara

## Status

Accepted

---

# DEC-016

## Category

Attendance Validation

## Decision

Menggunakan QR Code Attendance.

## Rationale

Mempermudah validasi kehadiran dan mengurangi manipulasi data absensi.

## Alternatives Considered

* Manual attendance
* PIN attendance

## Status

Accepted

---

# DEC-017

## Category

Reporting System

## Decision

Laporan kegiatan wajib memiliki minimal satu dokumentasi foto dan maksimal lima foto.

## Rationale

Menjamin adanya bukti kegiatan tanpa membebani penyimpanan.

## Alternatives Considered

* Single photo only
* Unlimited photos

## Status

Accepted

---

# DEC-018

## Category

Certificate System

## Decision

Sertifikat dihasilkan secara otomatis setelah event selesai dan laporan disetujui.

## Rationale

Memastikan sertifikat hanya diberikan kepada relawan yang berpartisipasi pada kegiatan yang telah tervalidasi.

## Status

Accepted

---

# DEC-019

## Category

Analytics

## Decision

Analytics dihitung secara realtime dari database.

## Metrics

* Total Events
* Total Volunteers
* Completed Events
* Attendance Rate

## Rationale

Volume data MVP masih kecil sehingga tidak memerlukan data warehouse atau scheduled aggregation.

## Alternatives Considered

* Scheduled analytics processing

## Status

Accepted

---

# DEC-020

## Category

Scope Management

## Decision

Notification System dan Multi-Organization Membership menjadi kandidat pertama untuk ditunda apabila terjadi keterbatasan waktu.

## Rationale

Kedua fitur tidak mempengaruhi alur bisnis utama CommUnity.

## Status

Accepted

---

# Decision Review Policy

Keputusan yang berstatus Accepted hanya boleh diubah apabila:

* Terdapat kebutuhan bisnis baru.
* Terdapat kendala teknis yang signifikan.
* Perubahan disetujui seluruh tim.

Setiap perubahan harus dicatat sebagai decision baru dan tidak menghapus keputusan sebelumnya.

---

# Summary

Dokumen ini menjadi referensi utama seluruh keputusan proyek CommUnity. Developer dan AI Agent wajib mengikuti keputusan yang tercatat di dalam dokumen ini sebelum membuat perubahan terhadap sistem.