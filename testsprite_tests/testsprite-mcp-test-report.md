# TestSprite AI Testing Report (MCP) — CommUnity Sprint 01

---

## 1️⃣ Document Metadata

- **Project Name:** CommUnity
- **Date:** 2026-06-19
- **Prepared by:** TestSprite AI Team
- **Test Scope:** Sprint 01 — Foundation & Authentication
- **Reference Documents:**
  - `product/PSI - PRD Kelompok ATM.docx.md` (FR-019, MVP registration/login)
  - `tasks/sprint-01.md` (US-001 through US-004, TASK-003 through TASK-007)
- **Test Runs:**
  - **Backend API** — `http://localhost:8000/api/v1` (10 tests)
  - **Frontend E2E** — `http://localhost:3000` (15 high-priority tests, dev mode cap)
- **Full report files:**
  - Backend: `testsprite_tests/testsprite-mcp-test-report-backend.md`
  - Frontend: this document (combined summary below)

---

## 2️⃣ Requirement Validation Summary

### Requirement: US-001 — User Registration (FR-019)

- **Description:** Relawan dapat membuat akun baru melalui UI dan API dengan validasi field lengkap.

#### Backend TC002 — post_user_registration_with_valid_data ✅

- **Status:** ✅ Passed
- **Analysis:** POST `/api/v1/auth/register` mengembalikan 201, user data, dan Sanctum token.

#### Backend TC003 — post_user_registration_with_invalid_data ✅

- **Status:** ✅ Passed
- **Analysis:** Payload invalid ditolak dengan HTTP 422 dan pesan validasi field-level.

#### Frontend TC005 — Register a new volunteer account ✅

- **Status:** ✅ Passed
- **Visualization:** https://www.testsprite.com/dashboard/mcp/tests/58bab53f-5e0d-426e-8b6a-61fe72de3929/fc5de3b9-3178-40e3-848a-ea7631bab6cf
- **Analysis:** Form registrasi di `/register` berhasil, user diarahkan ke dashboard dengan session aktif.

#### Frontend TC002 / TC007 — Register and access profile ✅

- **Status:** ✅ Passed
- **Analysis:** User baru dapat register dan langsung mengakses area terproteksi (dashboard/profile).

---

### Requirement: US-002 — User Login & Logout

- **Description:** Pengguna dapat login, logout, dan protected routes berfungsi.

#### Backend TC004 — Login valid ✅ | TC005 — Login invalid ✅

- **Status:** ✅ Passed
- **Analysis:** Login valid → 200 + token; kredensial salah → 422 tanpa token.

#### Backend TC006 — Logout with valid token ❌ | TC007 — Logout without token ❌

- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis:** Logout endpoint sendiri berhasil, tetapi request tanpa/invalid token ke endpoint terproteksi mengembalikan **HTTP 500** (bukan 401 JSON). Root cause: `Route [login] not defined` — middleware `auth:sanctum` mencoba redirect ke web route `login` saat request tidak menyertakan `Accept: application/json`.

#### Frontend TC001, TC003 — Logout blocks profile access ✅

- **Status:** ✅ Passed
- **Analysis:** Logout via UI ("Keluar") berhasil; akses `/profile` setelah logout redirect ke `/login`. Frontend AuthGuard menangani unauthenticated state dengan benar meskipun API raw error handling bermasalah.

#### Frontend TC010, TC004, TC013 — Login and view profile ✅

- **Status:** ✅ Passed
- **Analysis:** Login dengan `testuser`/`password` berhasil; halaman profil menampilkan data user.

#### Frontend TC006 — Block profile when not signed in ✅

- **Status:** ✅ Passed
- **Analysis:** Guest yang mengakses `/profile` diarahkan ke halaman login.

---

### Requirement: US-003 — Forgot Password & Reset Password

- **Description:** Pengguna dapat meminta dan menggunakan token reset password.

#### Backend TC008 — Forgot password (registered email) ✅

- **Status:** ✅ Passed
- **Analysis:** Email terdaftar menerima HTTP 200 dengan `reset_token`.

#### Backend TC009 — Forgot password (unregistered email) ❌

- **Status:** ❌ Failed (expected behavior mismatch)
- **Severity:** MEDIUM
- **Analysis:** API sengaja mengembalikan 200 untuk email tidak terdaftar (security-by-obscurity). Konsisten dengan Laravel test `forgot_password_returns_success_for_unregistered_email`.

#### Backend TC010 — Reset password with valid token ❌

- **Status:** ❌ Failed (assertion mismatch only)
- **Severity:** LOW
- **Analysis:** Reset password fungsional; test gagal karena mencari teks Inggris `"password reset"` sedangkan API mengembalikan `"Password berhasil direset."`.

#### Frontend TC012 — Reset password and login ✅

- **Status:** ✅ Passed
- **Analysis:** Alur forgot-password → reset-password → login dengan password baru berhasil di UI (token ditampilkan di response API MVP).

#### Frontend TC011 — Reset password via MailHog ⚠️ BLOCKED

- **Status:** ⚠️ Blocked
- **Analysis:** Test mencoba mengambil token dari MailHog di `localhost:8025` yang tidak berjalan. MVP CommUnity menampilkan token langsung di UI/API, bukan via email — test environment issue, bukan bug aplikasi.

---

### Requirement: US-004 — Manage Profile

- **Description:** User dapat melihat, mengubah profil, dan upload foto.

#### Backend — Profile endpoints

- **Status:** ⚠️ Not tested by TestSprite backend plan
- **Note:** Laravel `ProfileTest.php` (8 tests) tersedia dan lulus saat dijalankan lokal.

#### Frontend TC014, TC015 — Update profile details ✅

- **Status:** ✅ Passed
- **Analysis:** User login dapat mengubah full_name, username, email dan melihat perubahan tersimpan.

#### Frontend TC004, TC010, TC013 — View profile after login ✅

- **Status:** ✅ Passed
- **Analysis:** Halaman `/profile` menampilkan data profil user yang login.

---

### Requirement: API Infrastructure

#### Backend TC001 — Health check ✅ | Frontend TC008, TC009 — API health ✅

- **Status:** ✅ Passed
- **Analysis:** `GET /api/v1/health` mengembalikan `{ success: true, message: "CommUnity API is running" }`.

---

## 3️⃣ Coverage & Matching Metrics

### Combined Sprint 01 Results

| Test Layer | Total | ✅ Passed | ❌ Failed | ⚠️ Blocked |
|------------|-------|-----------|-----------|------------|
| Backend API | 10 | 6 (60%) | 4 | 0 |
| Frontend E2E | 15 | 14 (93%) | 0 | 1 |
| Laravel Feature Tests (local) | 21 | 21 (100%) | 0 | 0 |

### By User Story

| User Story | Backend | Frontend | Overall |
|------------|---------|----------|---------|
| US-001 Registration | ✅ | ✅ | ✅ Pass |
| US-002 Login | ✅ | ✅ | ✅ Pass |
| US-002 Logout | ⚠️ API 500 on raw unauth | ✅ | ⚠️ Partial |
| US-003 Forgot Password | ✅ (registered) | ✅ | ✅ Pass |
| US-003 Reset Password | ✅ (functional) | ✅ | ✅ Pass |
| US-004 Profile View | Not tested | ✅ | ✅ Pass (UI) |
| US-004 Profile Update | Not tested | ✅ | ✅ Pass (UI) |
| US-004 Photo Upload | Not tested | Not in 15-test cap | ⚠️ Not tested |

### Sprint 01 Exit Criteria

| Criteria | Result |
|----------|--------|
| User dapat register | ✅ Verified (API + UI) |
| User dapat login | ✅ Verified (API + UI) |
| User dapat logout | ✅ UI verified; ⚠️ API raw 401 handling broken |
| User dapat reset password | ✅ Verified (API functional + UI E2E) |
| User dapat mengelola profil | ✅ UI verified (view + update) |
| Authentication workflow end-to-end | ✅ UI E2E pass; ⚠️ API consumers need 401 fix |

---

## 4️⃣ Key Gaps / Risks

### Critical — Fix Before Production API Consumers

1. **Unauthenticated API requests return HTTP 500 instead of 401 JSON**
   - Affects: logout validation, profile access without token, any external API client
   - Fix: Add `AuthenticationException` handler in `bootstrap/app.php` returning JSON 401 for `/api/*` routes
   - Laravel PHPUnit tests pass because `postJson`/`getJson` auto-send `Accept: application/json`

### Medium

2. **Backend test plan missing profile endpoint coverage (US-004)**
   - Recommend adding TC for `GET/PATCH /profile` and `POST /profile/photo`

3. **Frontend dev mode capped at 15 tests**
   - Photo upload (TC018/TC019), validation edge cases (TC020–TC025) not executed
   - Re-run in production mode (`npm run build && npm run start`) for full 25-test coverage

4. **TC011 blocked by missing MailHog**
   - Not applicable to MVP (token shown in API response); can ignore or update test plan

### Low

5. **TC009/TC010 backend failures are test expectation mismatches**, not functional bugs
6. **Forgot-password for unknown email returns 200** — intentional security design

---

## Artifacts Generated

| File | Description |
|------|-------------|
| `testsprite_tests/testsprite_backend_test_plan.json` | 10 backend API test cases |
| `testsprite_tests/testsprite_frontend_test_plan.json` | 25 frontend E2E test cases |
| `testsprite_tests/testsprite-mcp-test-report.md` | This combined report |
| `testsprite_tests/TC*.py` | Generated Playwright/Python test scripts |
| `testsprite_tests/tmp/raw_report.md` | Latest TestSprite raw output |
| `testsprite_tests/tmp/test_results.json` | Detailed JSON results |

**TestSprite Dashboard:** Results viewable at links in each test case above.

---

*Report generated 2026-06-19 for CommUnity Sprint 01 QA (TASK-007).*
