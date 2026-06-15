# Task-003: Authentication API Development

## Status: ✅ Completed

## Owner: Syarif | Support: Irham

---

## Acceptance Criteria

| Kriteria | Status | Keterangan |
|----------|--------|------------|
| User dapat register | ✅ | POST `/api/v1/auth/register` — 201, user + token |
| User dapat login | ✅ | POST `/api/v1/auth/login` — 200, user + token |
| User dapat logout | ✅ | POST `/api/v1/auth/logout` — 200 (auth:sanctum) |
| User dapat reset password | ✅ | POST `/api/v1/auth/forgot-password` + `/reset-password` — flow lengkap |
| API mengikuti api-conventions.md | ✅ | Response: `{ success, message, data }`, snake_case, HTTP status codes sesuai standar |

---

## Implementation Tasks

| Task | Status | Detail |
|------|--------|--------|
| Register endpoint | ✅ | POST `/api/v1/auth/register` — validasi: full_name, username (unique), email (unique), password (min:8, confirmed). Response: user + Sanctum token |
| Login endpoint | ✅ | POST `/api/v1/auth/login` — validasi: username, password. Authentikasi via username. Response: user + Sanctum token |
| Logout endpoint | ✅ | POST `/api/v1/auth/logout` — protected (auth:sanctum). Revoke token saat ini |
| Forgot password endpoint | ✅ | POST `/api/v1/auth/forgot-password` — generate token, simpan di password_reset_tokens, return token untuk MVP |
| Reset password endpoint | ✅ | POST `/api/v1/auth/reset-password` — validasi token + email, update password, hapus token. Token expired: 60 menit |
| Request validation | ✅ | 4 Form Request classes: RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest. Semua pesan error Bahasa Indonesia |
| API resource response | ✅ | UserResource: id, full_name, username, email, profile_photo_url, created_at |
| Sanctum integration | ✅ | Laravel Sanctum Bearer Token. User model menggunakan HasApiTokens trait |

---

## Files Created

### Backend — Services
- `app/Services/AuthService.php` — Business logic auth: register(), login(), logout(), forgotPassword(), resetPassword()

### Backend — Controllers
- `app/Http/Controllers/Api/V1/AuthController.php` — 5 method: register, login, logout, forgotPassword, resetPassword

### Backend — Form Requests
- `app/Http/Requests/Auth/RegisterRequest.php` — Validasi registrasi
- `app/Http/Requests/Auth/LoginRequest.php` — Validasi login
- `app/Http/Requests/Auth/ForgotPasswordRequest.php` — Validasi forgot-password
- `app/Http/Requests/Auth/ResetPasswordRequest.php` — Validasi reset-password

### Backend — Resources
- `app/Http/Resources/UserResource.php` — Transform User ke JSON response

### Backend — Tests
- `tests/Feature/Auth/AuthTest.php` — 13 test cases

## Files Modified

### Backend — Routes
- `routes/api.php` — Register 6 routes: health, register, login, logout, forgot-password, reset-password

### Backend — Bootstrap
- `bootstrap/app.php` — Custom exception handler untuk validation error format konsisten (`success: false`)

### Root
- `README.md` — Tambah dokumentasi API auth, akun default, testing commands

---

## Registered Endpoints

| Method | Endpoint | Auth | Controller Method |
|--------|----------|------|-------------------|
| POST | `/api/v1/auth/register` | No | AuthController@register |
| POST | `/api/v1/auth/login` | No | AuthController@login |
| POST | `/api/v1/auth/logout` | Yes (auth:sanctum) | AuthController@logout |
| POST | `/api/v1/auth/forgot-password` | No | AuthController@forgotPassword |
| POST | `/api/v1/auth/reset-password` | No | AuthController@resetPassword |
| GET | `/api/v1/health` | No | Closure |

---

## Test Coverage

| Test | Status | Assertions |
|------|--------|------------|
| user_can_register_with_valid_data | ✅ | 6 |
| user_cannot_register_with_duplicate_email | ✅ | 3 |
| user_cannot_register_with_duplicate_username | ✅ | 3 |
| user_cannot_register_without_password_confirmation | ✅ | 3 |
| user_can_login_with_valid_credentials | ✅ | 6 |
| user_cannot_login_with_invalid_password | ✅ | 3 |
| user_cannot_login_with_nonexistent_username | ✅ | 3 |
| authenticated_user_can_logout | ✅ | 4 |
| unauthenticated_user_cannot_logout | ✅ | 2 |
| user_can_request_password_reset_token | ✅ | 5 |
| forgot_password_returns_success_for_unregistered_email | ✅ | 3 |
| user_can_reset_password_with_valid_token | ✅ | 6 |
| user_cannot_reset_password_with_invalid_token | ✅ | 3 |

**Total: 13 tests, 53 assertions — ✅ All Passed**

---

## API Response Examples

### Register (Success — 201)
```json
{
  "success": true,
  "message": "Registrasi berhasil.",
  "data": {
    "user": {
      "id": "uuid-xxx",
      "full_name": "Budi Santoso",
      "username": "budisantoso",
      "email": "budi@example.com",
      "profile_photo_url": null,
      "created_at": "2026-06-15T12:00:00Z"
    },
    "token": "sanctum-token-xxx"
  }
}
```

### Register (Validation Error — 422)
```json
{
  "success": false,
  "message": "Username sudah digunakan. (and 1 more error)",
  "errors": {
    "username": ["Username sudah digunakan."],
    "email": ["Email sudah digunakan."]
  }
}
```

### Login (Invalid Credentials — 422)
```json
{
  "success": false,
  "message": "Kredensial yang diberikan tidak valid.",
  "errors": {
    "username": ["Kredensial yang diberikan tidak valid."]
  }
}
```

### Logout (Unauthenticated — 401)
```json
{
  "success": false,
  "message": "Unauthenticated."
}
```

---

## Catatan Penting

- **Forgot Password MVP**: Karena mail server belum dikonfigurasi (MAIL_MAILER=log), token reset password dikembalikan langsung dalam response `data.reset_token` untuk keperluan demo/testing
- **Token Expiry**: Reset password token memiliki masa berlaku 60 menit
- **Password Hashing**: Menggunakan `Hash::make()` dan `Hash::check()` — tidak ada plain text
- **Architecture**: Service Layer pattern — AuthService berisi business logic, Controller hanya routing
- **Sanctum**: Setiap login menghasilkan token baru via `createToken('auth-token')`, logout via `currentAccessToken()->delete()`
- **Future**: Roles & permissions belum diimplementasikan. Untuk RBAC penuh menunggu organization_memberships di Sprint 02

---

## Verification Steps Performed

- [x] Feature test register — 4 test cases passed
- [x] Feature test login — 3 test cases passed
- [x] Feature test logout — 2 test cases passed
- [x] Feature test forgot password — 2 test cases passed
- [x] Feature test reset password — 2 test cases passed
- [x] API response format sesuai api-conventions.md — Verified
- [x] Full test suite: `php artisan test` — 15/15 passed (53 assertions)
