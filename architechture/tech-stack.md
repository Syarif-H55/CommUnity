# CommUnity Technology Stack

## Purpose

Dokumen ini mendefinisikan teknologi yang digunakan dalam pengembangan CommUnity. Seluruh implementasi harus mengikuti stack yang telah disepakati untuk menjaga konsistensi arsitektur, mempercepat pengembangan, dan mengurangi kompleksitas proyek.

Perubahan terhadap technology stack harus didokumentasikan dan disetujui oleh tim sebelum diimplementasikan.

---

# Architecture Style

## Monolithic Architecture

CommUnity menggunakan pendekatan Monolithic Architecture dengan pemisahan frontend dan backend pada tahap pengembangan.

### Rationale

* Lebih sederhana untuk proyek akademik.
* Mempercepat proses development.
* Mudah dipelajari dan dipelihara oleh tim.
* Tidak memerlukan kompleksitas microservices.
* Sesuai dengan kebutuhan MVP dan target Expo Release.

---

# Frontend Stack

## Next.js

### Version

Latest Stable Version

### Purpose

Framework utama untuk membangun antarmuka pengguna (UI) CommUnity.

### Why Chosen

* Mendukung TypeScript secara native.
* Struktur proyek terorganisir.
* Routing modern dan scalable.
* Ekosistem besar dan dokumentasi lengkap.

---

## TypeScript

### Purpose

Bahasa utama pengembangan frontend.

### Why Chosen

* Type safety yang lebih baik.
* Mengurangi bug saat development.
* Mempermudah maintenance kode.

---

## Tailwind CSS

### Purpose

Framework styling utama.

### Why Chosen

* Pengembangan UI lebih cepat.
* Konsisten dalam penggunaan design system.
* Mudah dikombinasikan dengan shadcn/ui.

---

## shadcn/ui

### Purpose

Komponen UI reusable untuk mempercepat pengembangan antarmuka.

### Why Chosen

* Integrasi sempurna dengan Tailwind CSS.
* Mudah dikustomisasi.
* Mengurangi kebutuhan membuat komponen dari nol.

### Examples

* Button
* Dialog
* Table
* Form
* Card
* Sheet
* Dropdown Menu

---

# Backend Stack

## Laravel

### Version

Latest Stable Version

### Purpose

Framework backend utama untuk menangani business logic, API, autentikasi, dan akses database.

### Why Chosen

* Familiar bagi tim.
* Dokumentasi lengkap.
* Cocok untuk pengembangan REST API.
* Mendukung pengembangan cepat untuk MVP.

### Laravel HTTP Client
#### Purpose

Mengirim request ke layanan AI eksternal.

#### Why Chosen
Sudah tersedia secara native pada Laravel.
Tidak membutuhkan dependency tambahan.
Mudah digunakan untuk integrasi REST API.

---

## Laravel Sanctum

### Purpose

Authentication dan authorization.

### Why Chosen

* Ringan dan mudah diimplementasikan.
* Terintegrasi dengan Laravel.
* Cocok untuk SPA architecture.

---

## Eloquent ORM

### Purpose

Object Relational Mapping untuk interaksi database.

### Why Chosen

* Terintegrasi penuh dengan Laravel.
* Mengurangi kompleksitas query.
* Mempermudah maintenance model dan relationship.

---

# Database

## MySQL

### Purpose

Database utama aplikasi.

### Why Chosen

* Familiar bagi tim.
* Stabil dan banyak digunakan.
* Cocok untuk kebutuhan aplikasi berbasis relasional.

### Main Data Domains

* Users
* Organizations
* Events
* Registrations
* Attendances
* Reports
* Certificates
* Notifications

---

# API Communication

## REST API

### Purpose

Media komunikasi antara frontend dan backend.

### Why Chosen

* Sederhana dan mudah dipahami.
* Cocok untuk kebutuhan MVP.
* Didukung penuh oleh Laravel.

### API Principles

* Resource-oriented endpoint naming.
* JSON response format.
* Consistent error handling.
* Proper HTTP status code usage.

---
# AI Integration

## AI Service

### Purpose

Membantu penyelenggara dan koordinator event menghasilkan draft konten administratif secara otomatis menggunakan Large Language Model (LLM).

### Planned Features

#### High Priority

AI Event Report Assistant

#### Optional

AI Event Description Assistant

#### Why Chosen
Mengurangi waktu penyusunan laporan kegiatan.
Membantu pengguna menghasilkan draft awal yang lebih terstruktur.
Memberikan nilai inovasi tambahan untuk kebutuhan Expo.

### Usage Principle

AI digunakan sebagai alat bantu penulisan (assistant), bukan pengambil keputusan.

Seluruh hasil yang dihasilkan AI harus dapat ditinjau, diubah, dan disetujui oleh pengguna sebelum disimpan ke sistem.

## AI Provider

### Initial Option

- OpenAI API

### Alternative Option

- Google Gemini API

### Selection Criteria

- Kemudahan integrasi dengan Laravel
- Kualitas output Bahasa Indonesia
- Biaya penggunaan
- Ketersediaan API

---

# Storage

## Laravel Local Storage

### Purpose

Penyimpanan file aplikasi.

### Stored Files

* Organization verification documents
* Event documentation images
* Generated certificate PDFs

### Why Chosen

* Sederhana untuk implementasi MVP.
* Tidak membutuhkan layanan cloud tambahan.
* Cukup untuk kebutuhan demonstrasi Expo.

---

# Development Environment

## Local Development

Frontend:

* Node.js
* npm

Backend:

* PHP
* Composer

Database:

* MySQL

### Deployment Target

* Localhost demonstration environment

### Rationale

Fokus utama proyek adalah penyelesaian fitur dan demonstrasi Expo, bukan deployment production.

---

# Testing Strategy

## Backend Testing

### Tools

* PHPUnit

### Coverage Target

* Authentication
* Event Management
* Volunteer Registration
* Attendance Validation
* Certificate Generation
* AI Report Generation

---

## Frontend Testing

### Approach

* Manual Functional Testing
* User Acceptance Testing (UAT)

### Coverage Target

* Responsive Layout
* User Workflow
* Form Validation
* API Integration
* AI Draft Generation Workflow

---

# Technology Constraints

Seluruh implementasi harus menggunakan stack yang telah disepakati.

AI Agent dan developer tidak diperbolehkan:

* Mengganti framework frontend tanpa persetujuan tim.
* Mengganti framework backend tanpa persetujuan tim.
* Mengganti database tanpa persetujuan tim.
* Menambahkan service cloud yang tidak direncanakan.
* Menambahkan dependency besar tanpa alasan yang jelas.
* Mengintegrasikan lebih dari satu AI provider pada MVP.
* Menjadikan fitur AI sebagai dependency wajib untuk workflow utama.

---

# Explicitly Not Used

Teknologi berikut tidak termasuk dalam scope proyek:

## Frontend

* Angular
* Vue.js
* Svelte

---

## Backend

* NestJS
* Express.js
* Spring Boot
* ASP.NET

---

## AI Infrastructure

* Self-hosted LLM
* Fine-tuned custom model
* Vector Database
* RAG Architecture
* AI Agent Framework

---

## Database

* MongoDB
* Firebase Firestore

---

## Architecture

* Microservices
* Event-Driven Architecture

---

## Infrastructure

* Kubernetes
* Docker Swarm
* Service Mesh

---

# Guiding Principle

CommUnity memprioritaskan kesederhanaan implementasi, kemudahan pemeliharaan, dan kecepatan pengembangan dibanding kompleksitas teknis yang tidak memberikan nilai langsung terhadap tujuan MVP dan Expo Release. Integrasi AI harus tetap ringan, mudah dipelihara, dan tidak menambah kompleksitas arsitektur yang tidak diperlukan untuk kebutuhan MVP.
