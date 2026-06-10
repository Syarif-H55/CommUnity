# CommUnity Coding Standards

## Purpose

Dokumen ini mendefinisikan standar penulisan kode yang harus diikuti oleh seluruh developer dan AI agent dalam proyek CommUnity.

Tujuannya adalah menjaga konsistensi kode, meningkatkan maintainability, mempermudah code review, dan mengurangi technical debt.

---

# General Principles

Kode harus:

* Mudah dibaca.
* Mudah dipelihara.
* Mudah diuji.
* Konsisten di seluruh proyek.

Prioritaskan:

* Clarity over cleverness.
* Simplicity over complexity.
* Maintainability over premature optimization.

---

# Backend Architecture Standards

## Layered Structure

Business logic tidak boleh ditempatkan di Controller.

Flow yang wajib digunakan:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
```

---

## Controller Responsibilities

Controller hanya bertanggung jawab untuk:

* menerima request
* memanggil service
* mengembalikan response

Controller tidak boleh:

* menulis business logic
* menjalankan query database
* memproses data kompleks

---

## Service Responsibilities

Service bertanggung jawab untuk:

* business logic
* workflow processing
* validation tambahan di luar request validation
* orchestration antar repository

Contoh:

* EventService
* CertificateService
* AttendanceService

---

## Repository Responsibilities

Repository bertanggung jawab untuk:

* akses database
* query Eloquent
* data retrieval
* data persistence

Repository tidak boleh berisi business logic.

Contoh:

* EventRepository
* UserRepository
* CertificateRepository

---

## Model Responsibilities

Model hanya digunakan untuk:

* relationship
* attribute casting
* scopes sederhana

Model tidak boleh berisi business workflow yang kompleks.

---

# Laravel Standards

## Form Request Validation

Seluruh validasi request wajib menggunakan Form Request.

Examples:

```php
StoreEventRequest
UpdateEventRequest
RegisterVolunteerRequest
```

Validation tidak boleh ditulis langsung di controller.

---

## API Resource

Seluruh response API wajib menggunakan JsonResource.

Examples:

```php
EventResource
OrganizationResource
CertificateResource
```

Tujuan:

* konsistensi response
* memudahkan transformasi data

---

## Route Standards

Gunakan RESTful routing.

Examples:

```php
Route::apiResource('events', EventController::class);
Route::apiResource('organizations', OrganizationController::class);
```

---

# Frontend Standards

## Folder Structure

Feature-based architecture wajib digunakan.

```text
src/
├── app/
├── components/
├── features/
├── services/
├── hooks/
├── types/
├── lib/
└── stores/
```

---

## Feature Structure

Contoh:

```text
features/
└── events/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    └── pages/
```

Setiap feature harus terisolasi dan mudah dipelihara.

---

# State Management

## Zustand

Global state menggunakan Zustand.

Examples:

```text
auth_store
notification_store
organization_store
```

Redux tidak digunakan pada MVP.

---

# Data Fetching

## TanStack Query

Semua komunikasi API harus menggunakan TanStack Query.

Benefits:

* caching
* retry mechanism
* loading state
* error state
* invalidation

Fetch API manual hanya diperbolehkan pada kasus khusus.

---

# Naming Conventions

## Backend Classes

Gunakan PascalCase.

Examples:

```php
EventController
EventService
EventRepository
EventResource
StoreEventRequest
```

---

## React Components

Gunakan PascalCase.

Examples:

```tsx
EventCard.tsx
EventForm.tsx
VolunteerTable.tsx
```

---

## Variables

Gunakan camelCase.

Examples:

```ts
eventTitle
organizationName
attendanceRate
```

---

## Functions

Gunakan camelCase dengan nama yang deskriptif.

Examples:

```ts
createEvent()
registerVolunteer()
generateCertificate()
```

---

## Database

Gunakan snake_case.

Examples:

```sql
organization_id
event_date
created_at
```

---

## API Payload

Gunakan snake_case.

Examples:

```json
{
  "full_name": "John Doe",
  "event_date": "2026-07-15"
}
```

---

# Comment Standards

## PHPDoc / JSDoc

Seluruh public method wajib memiliki dokumentasi singkat.

Example:

```php
/**
 * Register volunteer to an event.
 */
public function registerVolunteer(...)
```

---

## Business Logic Comments

Komentar diperbolehkan untuk menjelaskan:

* business rules
* workflow khusus
* keputusan teknis penting

---

## Avoid Redundant Comments

Jangan menulis komentar yang hanya mengulang isi kode.

Bad Example:

```php
// Get user
$user = User::find($id);
```

---

# Error Handling

## Backend

Gunakan exception handling yang konsisten.

Business exception harus memiliki pesan yang jelas dan dapat ditampilkan ke pengguna jika diperlukan.

---

## Frontend

Error harus:

* ditangani dengan graceful
* menampilkan feedback kepada pengguna
* tidak menyebabkan aplikasi crash

---

# Testing Standards

## Backend Testing

Framework:

```text
PHPUnit
```

Prioritas Feature Test:

* Authentication
* Organization Verification
* Event Management
* Volunteer Registration
* Attendance Validation
* Report Submission
* Certificate Generation

---

## Frontend Testing

Approach:

```text
Manual User Acceptance Testing (UAT)
```

Fokus pengujian:

* workflow pengguna
* responsive design
* form validation
* API integration
* role permissions

---

# Code Quality Rules

Developer dan AI Agent harus:

* menghindari duplicate code
* menggunakan reusable components
* menggunakan reusable services
* menjaga fungsi tetap kecil dan fokus
* menghindari hardcoded values

---

# Security Standards

Seluruh implementasi harus:

* memvalidasi input
* melakukan authorization check
* menggunakan prepared queries melalui Eloquent
* memvalidasi upload file
* tidak menyimpan password dalam bentuk plain text

---

# AI Agent Rules

AI Agent wajib:

* mengikuti architecture.md
* mengikuti database-design.md
* mengikuti api-conventions.md
* mengikuti coding-standards.md

AI Agent tidak boleh:

* menambahkan framework baru tanpa persetujuan
* mengubah arsitektur tanpa persetujuan
* membuat business logic di controller
* membuat query database di frontend

Jika terdapat konflik, architecture.md menjadi sumber kebenaran utama.