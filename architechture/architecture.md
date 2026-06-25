# CommUnity Architecture

## Purpose

Dokumen ini mendefinisikan arsitektur sistem CommUnity dan menjadi referensi utama untuk pengembangan, pengujian, serta pemeliharaan aplikasi.

Seluruh implementasi harus mengikuti arsitektur yang dijelaskan dalam dokumen ini kecuali terdapat keputusan arsitektural baru yang telah disetujui dan didokumentasikan.

---

# Architecture Overview

CommUnity menggunakan arsitektur web application berbasis REST API dengan pemisahan frontend dan backend.

Frontend bertanggung jawab terhadap user interface dan user experience, sedangkan backend bertanggung jawab terhadap business logic, authentication, data processing, dan persistence.

Architecture Style:

* Monolithic Application
* Client-Server Architecture
* REST API Communication

---

# High-Level Architecture

```text
+-------------------+
|      Browser      |
+-------------------+
          |
          v
+-------------------+
|     Next.js UI    |
|   (Frontend SPA)  |
+-------------------+
          |
          | REST API
          v
+-------------------+
|     Laravel API   |
|   Business Logic  |
+-------------------+
          |
          +------------------+
          |                  |
          |                  |
          v                  v
+----------------+   +----------------+
|     MySQL      |   | Local Storage  |
|   Database     |   | Files & PDFs   |
+----------------+   +----------------+
          |
          v
+----------------+
| AI Service API |
| (LLM Provider) |
+----------------+
```

---

# System Components

## Frontend Layer

Technology:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

Responsibilities:

* Authentication UI
* Event Discovery
* Event Management Interface
* Volunteer Registration
* Attendance Interface
* Reporting Interface
* Certificate Download
* Analytics Dashboard

Frontend tidak diperbolehkan mengakses database secara langsung.

Semua komunikasi harus melalui REST API.

---

## Backend Layer

Technology:

* Laravel
* Laravel Sanctum
* Eloquent ORM

Responsibilities:

* Authentication
* Authorization
* Event Management
* Attendance Validation
* Reporting Workflow
* Certificate Generation
* Notification Management
* Analytics Calculation
* AI Report Generation Integration

Backend menjadi satu-satunya sumber business logic sistem.

---

## Database Layer

Technology:

* MySQL

Responsibilities:

* Menyimpan data aplikasi
* Menjaga integritas relasi data
* Mendukung transaksi bisnis

Database hanya dapat diakses melalui backend.

---

## Storage Layer

Technology:

* Laravel Local Storage

Stored Assets:

* Organization Verification Documents
* Event Documentation Images
* Generated Certificate PDFs

Storage digunakan untuk file non-relasional dan tidak digunakan untuk menyimpan data bisnis utama.

AI Integration Layer

Technology:

* OpenAI API / Gemini API / LLM Provider
* Laravel HTTP Client

Responsibilities:

* Generate draft laporan kegiatan
* Membantu penyusunan laporan berdasarkan data event
* Menghasilkan teks yang dapat ditinjau dan diedit pengguna

Constraints:

* AI tidak boleh menyimpan data langsung ke database
* AI tidak boleh mengubah status event secara otomatis
* Seluruh output AI harus melalui review pengguna

---

# Authentication Architecture

## Authentication Method

Users authenticate using:

* Username
* Password

Registration requires:

* Username
* Email
* Password

---

## Session Management

Authentication menggunakan Laravel Sanctum.

Flow:

```text
User Login
    ↓
Credential Validation
    ↓
Token Creation
    ↓
Authenticated Session
```

---

## Authorization Model

Role-Based Access Control (RBAC)

Supported Roles:

* Admin Sistem
* Penyelenggara
* Koordinator Event
* Relawan

Setiap role hanya dapat mengakses fitur yang telah ditentukan dalam Functional Requirements.

---

# Organization Architecture

## Organization Membership

Satu pengguna dapat menjadi anggota lebih dari satu organisasi.

Relationship:

```text
User
  ↔
Organization Membership
  ↔
Organization
```

Membership menyimpan hubungan antara pengguna dan organisasi beserta perannya di dalam organisasi.

Possible Roles:

* Penyelenggara
* Koordinator Event

---

## Organization Verification Workflow

```text
Organization Registration
          ↓
Pending Verification
          ↓
Admin Review
          ↓
Approved / Rejected
```

Hanya organisasi dengan status Approved yang dapat membuat event.

---

# Event Architecture

## Event Lifecycle

```text
Draft
  ↓
Published
  ↓
Ongoing
  ↓
Completed
```

Alternative State:

```text
Cancelled
```

Event yang telah berstatus Completed tidak dapat dimodifikasi.

---

## Event Publication

Workflow:

```text
Organization Creates Event
          ↓
Publish Event
          ↓
Visible to Volunteers
```

Tidak terdapat approval tambahan setelah organisasi terverifikasi.

---

# Volunteer Participation Architecture

## Registration Flow

```text
Volunteer
      ↓
Browse Event
      ↓
Register Event
      ↓
Registration Created
```

Relawan hanya dapat mendaftar satu kali pada event yang sama.

---

## Attendance Validation Flow

```text
Volunteer QR
        ↓
Coordinator Scan
        ↓
Attendance Validation
        ↓
Attendance Recorded
```

Attendance hanya dapat dilakukan oleh relawan yang telah terdaftar pada event.

---

# Reporting Architecture

## Reporting Workflow

```text
Event Completed
        ↓
Coordinator Creates Report
        ↓
Generate AI Draft (Optional)
        ↓
Review & Edit Draft
        ↓
Submit Report
        ↓
Organizer Approval
        ↓
Event Finalized
```

Laporan menjadi dasar proses penyelesaian event.

---

# Certificate Architecture

## Certificate Generation Workflow

```text
Attendance Verified
        ↓
Report Approved
        ↓
Certificate Generated
        ↓
Certificate Available
```

Sertifikat hanya dapat dihasilkan setelah laporan kegiatan disetujui.


### AI Report Generation Flow
```text
Coordinator Requests AI Draft
              ↓
Backend Collects Event Data
              ↓
Backend Collects Attendance Data
              ↓
Prompt Construction
              ↓
AI Service Request
              ↓
Draft Report Generated
              ↓
Coordinator Reviews Draft
              ↓
Save / Edit / Submit
```text

---

## Certificate Storage

Generated certificates:

```text
storage/app/public/certificates
```

Format:

```text
PDF
```

---

# Notification Architecture

## Notification Method

Database Notification

Flow:

```text
System Event
      ↓
Notification Created
      ↓
Notification Stored
      ↓
User Views Notification
```

Supported Events:

* Organization Verification
* Event Registration
* Attendance Validation
* Report Approval
* Certificate Generation

Realtime websocket tidak digunakan pada MVP.

---

# Analytics Architecture

Analytics dihitung secara realtime menggunakan data operasional yang tersimpan pada database.

Metrics:

* Total Events
* Total Volunteers
* Attendance Rate
* Completed Events

Analytics tidak menggunakan data warehouse maupun tabel agregasi khusus pada MVP.

---

# API Architecture

## API Standard

Base URL:

```text
/api/v1
```

Response Format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error Format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

## API Principles

* RESTful Endpoint Naming
* JSON Response Only
* Consistent Error Handling
* Proper HTTP Status Codes
* Token-Based Authentication

---

### AI Endpoints

Example:

POST /api/v1/reports/{id}/generate-ai

Purpose:

Generate AI-assisted event report draft.

Response:

{
  "success": true,
  "message": "AI report generated",
  "data": {
    "draft_report": "..."
  }
}

---

# Security Architecture

Security controls:

* Password Hashing
* HTTPS Ready
* Role-Based Authorization
* Session Timeout
* Input Validation
* CSRF Protection
* File Upload Validation
* AI Request Data Filtering
* Sensitive Data Exclusion for AI Requests

---

# Architectural Constraints

The system must:

* Remain monolithic throughout MVP development.
* Use REST API communication.
* Use MySQL as the primary database.
* Use Laravel Local Storage for file assets.
* Avoid unnecessary infrastructure complexity.

The system must not:

* Introduce microservices.
* Introduce GraphQL.
* Introduce external cloud storage.
* Introduce realtime websocket architecture.
* Introduce event-driven architecture.
* AI services must remain optional and non-blocking.
* Core workflows must remain functional when AI services are unavailable.

---

# Architectural Goal

CommUnity prioritizes simplicity, maintainability, and rapid delivery of business value. Architectural decisions should favor clarity and implementation speed over premature optimization or unnecessary technical complexity. AI capabilities should assist administrative workflows without introducing unnecessary architectural complexity or dependency on external services.
