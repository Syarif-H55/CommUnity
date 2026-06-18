# Task-006: Profile Management

## Status: ✅ Completed

## Owner: Abdillah | Support: Syarif

---

## Acceptance Criteria

| Kriteria | Status | Keterangan |
|----------|--------|------------|
| User dapat melihat profil | ✅ | GET `/api/v1/profile` — 200, data user lengkap (auth:sanctum) |
| User dapat mengubah data profil | ✅ | PATCH `/api/v1/profile` — validasi unique username/email (kecuali user sendiri) |
| User dapat mengunggah foto profil | ✅ | POST `/api/v1/profile/photo` — upload, validasi file image, hapus foto lama, simpan di storage |

---

## Implementation Tasks

| Task | Status | Detail |
|------|--------|--------|
| Profile page | ✅ | Halaman `/profile` — menampilkan avatar, nama, username, email. Form edit dengan input fields. Tombol upload foto dengan preview |
| Edit profile form | ✅ | Form untuk full_name, username, email. Validasi client-side (required, format email). Validasi server-side (unique username/email) |
| Profile image upload | ✅ | Tombol kamera di avatar. File picker (jpg/jpeg/png). Preview otomatis setelah upload. Hapus foto lama saat upload baru |
| Update profile API integration | ✅ | TanStack Query mutation: `useUpdateProfile()` dan `useUploadProfilePhoto()`. Update Zustand store & invalidate cache setelah sukses |

---

## Files Created

### Backend — Controllers
- `app/Http/Controllers/Api/V1/ProfileController.php` — 3 method: show, update, uploadPhoto

### Backend — Services
- `app/Services/ProfileService.php` — Business logic: update(), uploadPhoto(). Hapus file foto lama dari storage saat upload baru

### Backend — Form Requests
- `app/Http/Requests/Profile/UpdateProfileRequest.php` — Validasi: full_name (required, max:255), username (required, unique kecuali user sendiri), email (required, email, unique kecuali user sendiri)
- `app/Http/Requests/Profile/UploadPhotoRequest.php` — Validasi: photo (required, image, mimes:jpg/jpeg/png, max:2048KB)

### Backend — Tests
- `tests/Feature/Profile/ProfileTest.php` — 8 test cases (lihat tabel Test Coverage)

### Frontend — Pages
- `src/app/profile/page.tsx` — Halaman profile lengkap: form edit, upload foto, validasi client/server, loading state, error handling, success message

---

## Files Modified

### Backend — Routes
- `routes/api.php` — Tambah 3 endpoint profile dalam grup auth:sanctum

### Frontend — Hooks
- `src/hooks/useAuth.ts` — Tambah `useUpdateProfile()` dan `useUploadProfilePhoto()` mutations. Import type `User`

### Frontend — Services
- `src/services/auth.service.ts` — Ubah tipe response `uploadPhoto` dari `ApiResponse<{ profile_photo_url }>` menjadi `ApiResponse<User>`

### Frontend — Dashboard
- `src/app/dashboard/page.tsx` — Tambah tombol navigasi "Profil" di header

---

## Registered Endpoints

| Method | Endpoint | Auth | Controller Method |
|--------|----------|------|-------------------|
| GET | `/api/v1/profile` | Yes (auth:sanctum) | ProfileController@show |
| PATCH | `/api/v1/profile` | Yes (auth:sanctum) | ProfileController@update |
| POST | `/api/v1/profile/photo` | Yes (auth:sanctum) | ProfileController@uploadPhoto |

---

## API Response Examples

### View Profile (Success — 200)
```json
{
  "success": true,
  "message": "Profil berhasil dimuat.",
  "data": {
    "id": "uuid-xxx",
    "full_name": "Budi Santoso",
    "username": "budisantoso",
    "email": "budi@example.com",
    "profile_photo_url": "http://localhost:8000/storage/profile-photos/xxx.jpg",
    "created_at": "2026-06-15T12:00:00Z"
  }
}
```

### Update Profile (Success — 200)
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui.",
  "data": {
    "id": "uuid-xxx",
    "full_name": "Budi Santoso Updated",
    "username": "budisantoso",
    "email": "budi@example.com",
    "profile_photo_url": null,
    "created_at": "2026-06-15T12:00:00Z"
  }
}
```

### Update Profile (Validation Error — 422)
```json
{
  "success": false,
  "message": "Username sudah digunakan.",
  "errors": {
    "username": ["Username sudah digunakan."]
  }
}
```

### Upload Photo (Success — 200)
```json
{
  "success": true,
  "message": "Foto profil berhasil diunggah.",
  "data": {
    "id": "uuid-xxx",
    "full_name": "Budi Santoso",
    "username": "budisantoso",
    "email": "budi@example.com",
    "profile_photo_url": "http://localhost:8000/storage/profile-photos/xxx.jpg",
    "created_at": "2026-06-15T12:00:00Z"
  }
}
```

---

## Test Coverage

| Test | Status | Assertions |
|------|--------|------------|
| authenticated_user_can_view_profile | ✅ | 7 |
| unauthenticated_user_cannot_view_profile | ✅ | 2 |
| user_can_update_profile | ✅ | 6 |
| user_cannot_update_to_duplicate_username | ✅ | 3 |
| user_cannot_update_to_duplicate_email | ✅ | 3 |
| user_can_upload_profile_photo | ✅ | 4 |
| user_cannot_upload_non_image_file | ✅ | 3 |
| user_cannot_upload_photo_exceeding_max_size | ✅ | 3 |
| upload_replaces_old_profile_photo | ✅ | 4 |

**Total: 9 tests, 35 assertions — ✅ All Passed**

---

## Catatan Penting

- **Photo Storage**: File foto disimpan di `storage/app/public/profile-photos/`. Menggunakan Laravel Local Storage (public disk). Storage link (`php artisan storage:link`) harus sudah dibuat
- **Replace Photo**: Saat user upload foto baru, file foto lama otomatis dihapus dari storage (`Storage::disk('public')->delete()`)
- **Profile Photo URL**: `UserResource` mengembalikan `profile_photo_url` sebagai full URL via `asset('storage/' . $path)`. Nilai `null` jika belum ada foto
- **Unique Validation**: Update profile menggunakan `Rule::unique()->ignore($this->user()->id)` sehingga user bisa mempertahankan username/email yang sama
- **TypeScript**: Type check (`tsc --noEmit`) — 0 errors. Lint (`eslint`) — 0 errors, 2 warnings (pre-existing `<img>` warnings di dashboard & profile page)
- **Auth Integration**: Setelah update profile sukses, Zustand store diperbarui via `setUser()` dan TanStack Query cache di-invalidate agar data tetap sinkron

---

## Verification Steps Performed

- [x] TypeScript type check: `npx tsc --noEmit` — 0 errors
- [x] ESLint: `npm run lint` — 0 errors, 2 warnings (pre-existing)
- [x] Backend feature test: `php artisan test --filter=ProfileTest` — 9/9 passed (35 assertions)
- [x] Profile page dapat diakses setelah login
- [x] Form edit pre-filled dengan data user saat ini
- [x] Validasi client-side: required fields, format email
- [x] Validasi server-side: unique username & email
- [x] Upload foto dengan preview dan loading state
- [x] Navigasi "Profil" di dashboard header
- [x] Logout tetap berfungsi dari halaman profile
