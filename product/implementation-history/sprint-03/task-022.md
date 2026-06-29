# TASK-022: Certificate Management Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Certificate Management Frontend |
| **Owner** | Hiraldy |
| **Support Owner** | Abdillah |
| **Priority** | Medium |
| **Estimated Effort** | M |
| **Dependencies** | TASK-021 (Certificate Generation Backend) |

---

## Objective

Membangun antarmuka sertifikat digital untuk relawan — meliputi daftar sertifikat, detail sertifikat, unduh PDF, serta halaman sertifikat per event untuk penyelenggara.

---

## Files Created

| File | Deskripsi |
|---|---|
| `frontend/src/services/certificate.service.ts` | Service layer API calls — `getMyCertificates`, `getCertificate`, `downloadCertificate`, `getEventCertificates` |
| `frontend/src/hooks/useCertificate.ts` | TanStack Query hooks — `useMyCertificates`, `useCertificate`, `useDownloadCertificate`, `useEventCertificates` |
| `frontend/src/components/certificate/CertificateCard.tsx` | Kartu sertifikat dengan 3D tilt effect, glassmorphism, decorative corner accents, premium certificate visual, info grid, download button |
| `frontend/src/components/certificate/CertificateDetailModal.tsx` | Modal detail sertifikat — full certificate preview, decorative gold elements, info cards, download action |
| `frontend/src/components/certificate/index.ts` | Barrel export |
| `frontend/src/app/my-certificates/page.tsx` | Halaman sertifikat volunteer — search, responsive grid, empty state, loading skeleton, hero banner dengan stats |
| `frontend/src/app/events/[id]/certificates/page.tsx` | Halaman sertifikat per event — untuk penyelenggara/koordinator melihat semua sertifikat event |

---

## Files Modified

| File | Perubahan |
|---|---|
| `frontend/src/types/index.ts` | Menambah interface `Certificate` — 11 fields sesuai CertificateResource backend |
| `frontend/src/components/layout/Navbar.tsx` | Menambah navigasi "Sertifikat" (icon Award) untuk semua authenticated users |
| `frontend/src/app/events/[id]/page.tsx` | Menambah link "Sertifikat" di sidebar Aksi Cepat dengan icon Award |

---

## Feature Details

### 1. API Integration

#### Endpoints Used

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/v1/certificates` | Daftar sertifikat volunteer yang login |
| `GET` | `/api/v1/certificates/{certificate}` | Detail sertifikat |
| `GET` | `/api/v1/certificates/{certificate}/download` | Download PDF sertifikat |
| `GET` | `/api/v1/events/{event}/certificates` | Daftar sertifikat per event |

#### Certificate Interface

```typescript
export interface Certificate {
    id: string;
    volunteer_id: string;
    volunteer_name?: string;
    event_id: string;
    event_title?: string;
    event_date?: string;
    organization_name?: string;
    certificate_number: string;
    pdf_url: string | null;
    issued_at: string | null;
    created_at: string;
}
```

### 2. My Certificates (`/my-certificates`)

**Lokasi:** `frontend/src/app/my-certificates/page.tsx`

**Hero Banner:**
- Gradient emerald-to-teal dengan pattern overlay
- Dekoratif icon Award besar di background
- 3 mini stats: Total Sertifikat, Telah Diunduh, Status (Terverifikasi dengan ping animation)

**Search & Filter:**
- Search input dengan ikon search — mencari berdasarkan event title, organisasi, atau nomor sertifikat
- Tombol "Hapus Filter" muncul saat ada pencarian aktif

**Certificate Grid:**
- Responsive grid: 1 kolom (mobile) → 2 kolom (tablet) → 3 kolom (desktop)
- Staggered entrance animation (`slide-in-from-bottom-4` dengan delay progresif)
- Setiap card bisa diklik untuk membuka modal detail

**Empty State:**
- Ilustrasi Award + "Belum Ada Sertifikat"
- Pesan informatif: "Sertifikat akan diterbitkan setelah event selesai"
- CTA "Temukan Event" link ke `/discover`

**Loading State:**
- Full-screen spinner dengan teks "Memuat sertifikat..."

### 3. Event Certificates (`/events/[id]/certificates`)

**Lokasi:** `frontend/src/app/events/[id]/certificates/page.tsx`

**Flow:**
```
Penyelenggara/Koordinator buka event detail
        ↓
Klik "Sertifikat" di sidebar Aksi Cepat
        ↓
Halaman menampilkan semua sertifikat untuk event tersebut
        ↓
Filter/search/klik card → modal detail → download PDF
```

**Hero Banner:**
- Gradient emerald-to-teal
- Stats: Total Sertifikat, Status Event (Selesai), Total Relawan

**Certificate List:**
- Grid sama dengan my-certificates — responsive, staggered animation
- Setiap card bisa diklik untuk detail/download

**Error/Not Found:**
- Jika event tidak ditemukan → card error dengan tombol kembali
- Jika belum ada sertifikat → empty state dengan pesan dan CTA

### 4. CertificateCard Component

**Lokasi:** `frontend/src/components/certificate/CertificateCard.tsx`

**3D Tilt Effect:**
- Mouse tracking dengan `perspective(1000px)` rotation
- Glare effect dengan radial gradient mengikuti kursor
- Smooth reset animation saat mouse leave

**Visual Design:**
- Glassmorphism card dengan backdrop blur
- 4 decorative corner accents (border emerald di tiap sudut)
- Decorative ribbon line di top
- Premium certificate visual area:
  - Gradient emerald gelap dengan pattern dekoratif
  - Gold seal decoration (blur circles)
  - Icon Award + nama volunteer (large, white)
  - Divider line + "Telah berpartisipasi dalam kegiatan" + event title + organisasi
- Info Grid (2 kolom):
  - Tanggal Event (Calendar icon)
  - Organisasi (Building2 icon)
  - Tanggal Terbit (ExternalLink icon)
  - No. Sertifikat (Hash icon) — monospace font
- **Verified Badge** — pill "Terverifikasi" dengan icon CheckCircle2
- **Download Button:**
  - Gradient emerald dengan shadow glow
  - Loading state (Loader2 spinner + "Mengunduh...")
  - Disabled state jika `pdf_url` null

### 5. CertificateDetailModal Component

**Lokasi:** `frontend/src/components/certificate/CertificateDetailModal.tsx`

**Features:**
- Modal full-screen overlay dengan backdrop blur
- Close on: tombol X, Escape key, klik backdrop
- Body scroll lock saat modal terbuka
- Animasi masuk: `fade-in zoom-in-95`

**Layout:**
- Decorative top bar gradient emerald-to-teal
- Header: icon Award + "Detail Sertifikat" + nomor sertifikat + verified badge
- Large Certificate Visual:
  - Full-size certificate preview dengan decorative pattern
  - Gold ring decorations (circles)
  - Corner decorations (4 sudut)
  - Large title "Sertifikat Partisipasi"
  - Volunteer name (xx-large)
  - Event title + organization
- Info Cards (2 kolom):
  - Informasi Event: Tanggal Event, Organisasi
  - Detail Sertifikat: No. Sertifikat (monospace), Tanggal Terbit
- Action Buttons:
  - "Unduh Sertifikat (PDF)" — gradient button utama
  - "Tutup" — outline button

### 6. Download Certificate Flow

```
User klik "Unduh Sertifikat" (card atau modal)
        ↓
useDownloadCertificate mutation triggered
        ↓
GET /certificates/{id}/download → responseType: 'blob'
        ↓
Buat Blob URL dari response
        ↓
Buat elemen <a> temporary → click → download
        ↓
Revoke Blob URL + cleanup DOM
```

**Filename Format:** `sertifikat-CERT-YYYYMMDD-RANDOM6.pdf`

---

## State Management

### Data Flow

```
Certificate Backend (TASK-021)
        ↓
certificate.service.ts (axios calls)
        ↓
useCertificate.ts (TanStack Query hooks)
        ↓
CertificateCard / CertificateDetailModal / Pages
```

### Query Keys

- `['my-certificates']` — daftar sertifikat volunteer
- `['certificate', id]` — detail satu sertifikat
- `['event-certificates', eventId]` — daftar sertifikat per event

---

## UI/UX Highlights

- **3D Tilt Cards** — setiap kartu sertifikat memiliki efek tilt interaktif dengan glare mengikuti mouse
- **Premium Certificate Visual** — area sertifikat dengan gradient gelap, pattern dekoratif, gold accents, dan typography yang elegan
- **Glassmorphism** — backdrop blur + semi-transparent cards konsisten dengan branding CommUnity
- **Decorative Elements** — corner accents, ribbon line, gold seals, rings
- **Staggered Animations** — grid cards masuk satu per satu dengan `slide-in-from-bottom`
- **Responsive Grid** — 1/2/3 kolom menyesuaikan viewport
- **Modal Detail** — full certificate detail dengan animasi zoom-in
- **Verified Badge** — pill dengan ping animation menunjukkan status terverifikasi
- **Loading States** — spinner untuk initial load, button spinner untuk download
- **Empty States** — ilustrasi + pesan informatif + CTA button
- **Error States** — card error untuk event not found
- **Search** — real-time filter berdasarkan event title, organisasi, nomor sertifikat

---

## Acceptance Criteria Verification

| AC | Status | Keterangan |
|---|---|---|
| Sertifikat tampil | ✅ | `CertificateCard` menampilkan semua data sertifikat — volunteer name, event title, tanggal, organisasi, nomor sertifikat, status terverifikasi |
| PDF dapat diunduh | ✅ | `useDownloadCertificate` — download via Blob URL dengan filename `sertifikat-{nomor}.pdf` |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Certificate page | ✅ Halaman `/my-certificates` — hero banner, search, responsive grid, empty/loading/error states |
| Certificate list | ✅ Grid tampilan kartu dengan staggered animation, bisa diklik untuk detail |
| Certificate detail | ✅ `CertificateDetailModal` — premium certificate visual, info cards, download button |
| Download certificate button | ✅ Ada di card dan modal — loading state, disabled when no pdf_url, proper filename |

---

## Build & Verification

| Check | Status |
|---|---|
| TypeScript Compilation (`next build`) | ✅ Clean — 0 errors |

*Workspace root warning (multiple lockfiles) tidak mempengaruhi kompilasi.*

---

## Catatan Penting

- Certificate hanya tampil jika sudah ada data dari backend (TASK-021)
- Download menggunakan Blob URL approach — compatible dengan semua browser modern
- Setiap card dapat diklik untuk membuka modal detail (click handler on card)
- Modal detail mendukung keyboard navigation (Escape to close)
- Search filter bersifat client-side (data sudah terload semua dari API)
- Navigasi "Sertifikat" muncul di Navbar untuk semua authenticated users
- Link "Sertifikat" di event detail page hanya muncul untuk penyelenggara/koordinator yang memiliki akses ke event
- `CertificateDetailModal` menggunakan `animate-in` + `fade-in` + `zoom-in-95` via Tailwind untuk entrance animation
- Dekorasi corner accents menggunakan pseudo-elements dengan border emerald transparan

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi: sertifikat tampil dalam kartu premium dengan 3D tilt effect, detail sertifikat tersedia dalam modal interaktif, unduh PDF berfungsi dengan loading state, halaman terintegrasi dengan Navbar dan event detail page.
