# CommUnity API Conventions

## Purpose

Dokumen ini mendefinisikan standar dan konvensi API yang digunakan dalam pengembangan CommUnity.

Seluruh endpoint, request, response, dan dokumentasi API harus mengikuti aturan yang dijelaskan dalam dokumen ini untuk menjaga konsistensi sistem.

---

# API Design Principles

CommUnity menggunakan pendekatan:

* RESTful API
* Resource-Oriented Design
* JSON-Based Communication
* Consistent Response Structure
* Versioned API

Setiap endpoint harus merepresentasikan resource bisnis yang jelas dan mudah dipahami.

---

# Base URL Structure

## API Version

```http
/api/v1
```

### Examples

```http
/api/v1/auth/login
/api/v1/events
/api/v1/organizations
/api/v1/certificates
```

---

# Endpoint Naming Convention

## Rules

* Menggunakan kata benda (noun).
* Menggunakan huruf kecil.
* Menggunakan plural resource names.
* Menggunakan kebab-case untuk resource multi kata.

### Good Examples

```http
/api/v1/events
/api/v1/event-categories
/api/v1/organizations
/api/v1/certificates
```

### Avoid

```http
/api/v1/getEvents
/api/v1/createEvent
/api/v1/eventList
```

---

# HTTP Method Standards

| Method | Purpose              |
| ------ | -------------------- |
| GET    | Retrieve data        |
| POST   | Create data          |
| PUT    | Replace data         |
| PATCH  | Partial update       |
| DELETE | Soft delete resource |

### Example

```http
GET    /api/v1/events
POST   /api/v1/events
GET    /api/v1/events/{id}
PATCH  /api/v1/events/{id}
DELETE /api/v1/events/{id}
```

---

# Authentication

## Authentication Type

Bearer Token Authentication

### Header Format

```http
Authorization: Bearer {token}
```

Authentication menggunakan Laravel Sanctum.

---

# Request Format

## Content Types

### JSON Request

```http
Content-Type: application/json
```

### File Upload Request

```http
Content-Type: multipart/form-data
```

Digunakan untuk:

* Organization Logo
* Verification Documents
* Event Documentation Photos

---

# Response Structure

## Success Response

Seluruh response berhasil harus menggunakan format berikut:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Success Response Example

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 1,
    "title": "Clean Beach Campaign"
  }
}
```

---

# Error Response Structure

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "Email already exists"
    ]
  }
}
```

---

## General Error

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

# HTTP Status Code Standards

| Status Code | Usage                 |
| ----------- | --------------------- |
| 200         | Successful request    |
| 201         | Resource created      |
| 204         | Resource deleted      |
| 400         | Bad request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Resource not found    |
| 409         | Conflict              |
| 422         | Validation error      |
| 500         | Internal server error |

---

# Pagination Convention

Semua endpoint list harus mendukung pagination.

## Request Example

```http
GET /api/v1/events?page=1&per_page=10
```

---

## Response Example

```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "last_page": 10
  }
}
```

---

# Filtering Convention

Filtering digunakan untuk mempersempit hasil pencarian.

## Event Discovery Example

```http
GET /api/v1/events?category=1
```

```http
GET /api/v1/events?city=Bandung
```

```http
GET /api/v1/events?date=2026-07-15
```

---

## Multiple Filters

```http
GET /api/v1/events?category=1&city=Bandung&date=2026-07-15
```

---

# Search Convention

Keyword search menggunakan parameter:

```http
search
```

### Example

```http
GET /api/v1/events?search=clean
```

Search digunakan pada:

* Events
* Organizations
* Volunteers

---

# Sorting Convention

Sorting menggunakan parameter:

```http
sort
```

### Example

```http
GET /api/v1/events?sort=event_date
```

Descending:

```http
GET /api/v1/events?sort=-event_date
```

---

# Soft Delete Convention

Resource berikut wajib menggunakan soft delete:

* Users
* Organizations
* Events

### Database Field

```sql
deleted_at
```

Data yang telah dihapus tidak boleh ditampilkan pada query normal.

---

# File Upload Convention

## Organization Documents

Allowed Formats:

* PDF
* JPG
* JPEG
* PNG

---

## Event Documentation

Allowed Formats:

* JPG
* JPEG
* PNG

Maximum Files:

```text
5 Files
```

Minimum Files:

```text
1 File
```

---

## Certificate Files

Format:

```text
PDF
```

Storage Location:

```text
storage/app/public/certificates
```

---

# Date & Time Format

## Date

```text
YYYY-MM-DD
```

Example:

```text
2026-07-15
```

---

## Timestamp

ISO 8601 Format

Example:

```text
2026-07-15T08:30:00Z
```

---

# Naming Convention

## JSON Fields

Menggunakan snake_case.

### Examples

```json
{
  "full_name": "John Doe",
  "event_date": "2026-07-15",
  "created_at": "2026-07-01T08:00:00Z"
}
```

---

## Database Fields

Menggunakan snake_case.

### Examples

```text
full_name
event_date
organization_id
created_at
updated_at
```

---

# API Documentation Standard

Dokumentasi API disimpan dalam format Markdown.

Minimal setiap endpoint harus memiliki:

* Endpoint URL
* HTTP Method
* Required Permission
* Request Example
* Response Example
* Error Response Example

---

# Security Guidelines

API harus:

* Memvalidasi seluruh input pengguna.
* Menggunakan authentication pada endpoint yang memerlukan akses.
* Menggunakan authorization berdasarkan role.
* Tidak mengembalikan informasi sensitif.
* Menggunakan rate limiting pada endpoint authentication.

---

# API Consistency Rules

Seluruh endpoint wajib:

* Menggunakan format response yang konsisten.
* Menggunakan HTTP status code yang sesuai.
* Menggunakan snake_case.
* Mendukung pagination pada endpoint list.
* Menggunakan soft delete pada resource yang ditentukan.
* Menggunakan validasi request sebelum business logic dijalankan.

Endpoint yang tidak mengikuti aturan ini dianggap tidak memenuhi standar API CommUnity.