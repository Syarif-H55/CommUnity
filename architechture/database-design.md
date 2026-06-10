# CommUnity Database Design

## Purpose

Dokumen ini mendefinisikan struktur data utama, relasi antar entitas, serta aturan desain database yang digunakan dalam aplikasi CommUnity.

Database dirancang untuk mendukung seluruh workflow utama sistem, mulai dari verifikasi organisasi, pengelolaan event, registrasi relawan, validasi kehadiran, pelaporan kegiatan, hingga penerbitan sertifikat digital.

---

# Database Overview

Database Management System:

* MySQL

Design Approach:

* Relational Database
* Normalized Structure
* Foreign Key Constraints
* Soft Delete Support (selected entities)

Database digunakan sebagai sumber data utama untuk seluruh fitur CommUnity.

---

# Core Entities

## User

Menyimpan informasi seluruh pengguna sistem.

### Attributes

| Field         | Type      |
| ------------- | --------- |
| id            | BIGINT    |
| username      | VARCHAR   |
| email         | VARCHAR   |
| password      | VARCHAR   |
| full_name     | VARCHAR   |
| phone_number  | VARCHAR   |
| profile_photo | VARCHAR   |
| created_at    | TIMESTAMP |
| updated_at    | TIMESTAMP |

---

## Organization

Menyimpan data organisasi atau komunitas.

### Attributes

| Field                 | Type      |
| --------------------- | --------- |
| id                    | BIGINT    |
| name                  | VARCHAR   |
| description           | TEXT      |
| logo                  | VARCHAR   |
| verification_document | VARCHAR   |
| verification_status   | ENUM      |
| verified_at           | TIMESTAMP |
| created_at            | TIMESTAMP |
| updated_at            | TIMESTAMP |

### Verification Status

* Pending
* Approved
* Rejected

---

## Organization Membership

Menghubungkan User dengan Organization.

### Attributes

| Field           | Type      |
| --------------- | --------- |
| id              | BIGINT    |
| user_id         | FK        |
| organization_id | FK        |
| role            | ENUM      |
| joined_at       | TIMESTAMP |

### Membership Role

* Penyelenggara
* Koordinator Event

### Constraints

* Satu user dapat bergabung ke banyak organisasi.
* Satu organisasi memiliki banyak anggota.
* Satu membership hanya memiliki satu role.

---

## Event Category

Master data kategori kegiatan.

### Attributes

| Field | Type    |
| ----- | ------- |
| id    | BIGINT  |
| name  | VARCHAR |

### Initial Categories

* Lingkungan
* Pendidikan
* Kesehatan
* Sosial
* Kemanusiaan

---

## Event

Menyimpan informasi kegiatan sosial.

### Attributes

| Field           | Type      |
| --------------- | --------- |
| id              | BIGINT    |
| organization_id | FK        |
| coordinator_id  | FK        |
| category_id     | FK        |
| title           | VARCHAR   |
| description     | TEXT      |
| province        | VARCHAR   |
| city            | VARCHAR   |
| location_name   | VARCHAR   |
| quota           | INTEGER   |
| event_date      | DATE      |
| start_time      | TIME      |
| end_time        | TIME      |
| status          | ENUM      |
| created_at      | TIMESTAMP |
| updated_at      | TIMESTAMP |

### Event Status

* Draft
* Published
* Ongoing
* Completed
* Cancelled

---

## Volunteer Registration

Menyimpan pendaftaran relawan pada event.

### Attributes

| Field         | Type      |
| ------------- | --------- |
| id            | BIGINT    |
| event_id      | FK        |
| volunteer_id  | FK        |
| registered_at | TIMESTAMP |

### Constraints

* Relawan hanya dapat mendaftar satu kali pada event yang sama.
* Status pendaftaran otomatis dianggap approved setelah registrasi berhasil.

---

## Attendance

Menyimpan data kehadiran relawan.

### Attributes

| Field             | Type      |
| ----------------- | --------- |
| id                | BIGINT    |
| event_id          | FK        |
| volunteer_id      | FK        |
| attendance_status | ENUM      |
| attendance_time   | TIMESTAMP |
| validated_by      | FK        |
| created_at        | TIMESTAMP |

### Attendance Status

* Present
* Absent
* Late

---

## Event Report

Menyimpan laporan kegiatan.

### Attributes

| Field           | Type      |
| --------------- | --------- |
| id              | BIGINT    |
| event_id        | FK        |
| submitted_by    | FK        |
| summary         | TEXT      |
| total_attendees | INTEGER   |
| report_status   | ENUM      |
| submitted_at    | TIMESTAMP |
| approved_at     | TIMESTAMP |

### Report Status

* Draft
* Submitted
* Approved

---

## Event Documentation

Menyimpan dokumentasi kegiatan.

### Attributes

| Field       | Type      |
| ----------- | --------- |
| id          | BIGINT    |
| report_id   | FK        |
| image_path  | VARCHAR   |
| uploaded_at | TIMESTAMP |

### Constraints

* Minimal 1 foto.
* Maksimal 5 foto.
* Laporan dapat dikirim setelah minimal 1 foto tersedia.

---

## Certificate

Menyimpan data sertifikat digital.

### Attributes

| Field              | Type      |
| ------------------ | --------- |
| id                 | BIGINT    |
| volunteer_id       | FK        |
| event_id           | FK        |
| certificate_number | VARCHAR   |
| pdf_path           | VARCHAR   |
| issued_at          | TIMESTAMP |

### Constraints

* Certificate number harus unik.
* Satu relawan hanya memiliki satu sertifikat untuk satu event.

---

## Notification

Menyimpan notifikasi dalam sistem.

### Attributes

| Field             | Type      |
| ----------------- | --------- |
| id                | BIGINT    |
| user_id           | FK        |
| type              | VARCHAR   |
| title             | VARCHAR   |
| message           | TEXT      |
| related_entity    | VARCHAR   |
| related_entity_id | BIGINT    |
| is_read           | BOOLEAN   |
| created_at        | TIMESTAMP |

### Example Types

* organization_verified
* event_registered
* attendance_recorded
* report_approved
* certificate_generated

---

# Entity Relationships

## User ↔ Organization

Relationship:

```text
User
  ↔
Organization Membership
  ↔
Organization
```

Type:

Many-to-Many

---

## Organization ↔ Event

Relationship:

```text
Organization
    ↓
Many Events
```

Type:

One-to-Many

---

## Event Category ↔ Event

Relationship:

```text
Category
    ↓
Many Events
```

Type:

One-to-Many

---

## User ↔ Event Registration

Relationship:

```text
Volunteer
    ↓
Many Registrations
```

Type:

One-to-Many

---

## Event ↔ Volunteer Registration

Relationship:

```text
Event
   ↓
Many Registrations
```

Type:

One-to-Many

---

## Event ↔ Attendance

Relationship:

```text
Event
   ↓
Many Attendances
```

Type:

One-to-Many

---

## Event ↔ Report

Relationship:

```text
Event
   ↓
One Report
```

Type:

One-to-One

---

## Report ↔ Documentation

Relationship:

```text
Report
   ↓
Many Documentation Files
```

Type:

One-to-Many

---

## Event ↔ Certificate

Relationship:

```text
Event
   ↓
Many Certificates
```

Type:

One-to-Many

---

# Data Lifecycle

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

---

## Report Lifecycle

```text
Draft
 ↓
Submitted
 ↓
Approved
```

---

## Certificate Lifecycle

```text
Attendance Verified
        ↓
Report Approved
        ↓
Certificate Generated
```

---

# Indexing Strategy

Indexes should be created for:

* users.username
* users.email
* organizations.verification_status
* events.category_id
* events.city
* events.event_date
* volunteer_registrations.event_id
* volunteer_registrations.volunteer_id
* attendances.event_id
* certificates.certificate_number
* notifications.user_id

---

# Database Constraints

The database must enforce:

* Unique username.
* Unique email.
* Unique certificate number.
* Unique volunteer registration per event.
* Foreign key integrity.
* Required documentation count for report submission.

---

# Analytics Data Source

Analytics dashboard does not use dedicated analytics tables.

Metrics are calculated directly from operational tables:

* Events
* Volunteer Registrations
* Attendances
* Certificates

This approach reduces complexity and is sufficient for MVP requirements.

---

# Future Expansion Considerations

Potential future entities:

* Donations
* Event Reviews
* Volunteer Achievements
* Public Certificate Verification
* Organization Collaboration

These entities are intentionally excluded from MVP scope and should not be implemented unless project scope changes.