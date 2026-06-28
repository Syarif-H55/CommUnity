# TASK-020A: AI Event Report Assistant Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | AI Event Report Assistant Frontend |
| **Owner** | Abdillah |
| **Support Owner** | Hiraldy |
| **Priority** | Medium |
| **Estimated Effort** | M |
| **Dependencies** | TASK-019A (AI Event Report Assistant Backend) |

---

## Objective

Menyediakan antarmuka AI Report Assistant pada halaman pelaporan kegiatan — meliputi tombol generate, preview modal, edit draft, insert konten, serta loading dan error state handling.

---

## Files Created

| File | Deskripsi |
|---|---|
| *(Tidak ada file baru — semua fitur terintegrasi dalam halaman report yang sudah ada)* |

### Files Modified

| File | Perubahan |
|---|---|
| `src/app/events/[id]/report/page.tsx` | Menambahkan Generate AI button, Catatan input, AI Preview Modal, error banner, loading state |

### Files Reused (sudah ada sebelumnya)

| File | Deskripsi |
|---|---|
| `src/services/report.service.ts` | Method `aiGenerate(eventId, additionalNotes?)` — POST `/events/{event}/report/ai-generate` |
| `src/hooks/useReport.ts` | Hook `useAiGenerateReport(eventId)` — mutation dengan TanStack Query |
| `src/types/index.ts` | Type `AiGenerateReportResponse` — `{ summary, sections, provider }` |

---

## Feature Details

### 1. Generate AI Report Button

Tombol "Generate AI" ditampilkan di pojok kanan header card laporan:

- **Muncul hanya saat** status laporan editable (`draft` atau `revision_requested`)
- Icon `Sparkles` + teks "Generate AI"
- Style: `variant="outline"` dengan border hijau (`border-emerald-200`)
- **Disabled** saat: AI sedang loading, atau mutation lain sedang berjalan
- Loading state: icon berubah menjadi `Loader2` + animasi spin
- Memanggil `POST /events/{event}/report/ai-generate` dengan data event + attendance sebagai konteks

### 2. Catatan untuk AI (Additional Notes)

Tombol "Catatan" di sebelah kiri tombol Generate AI:

- Toggle show/hide untuk textarea additional notes
- Icon `MessageSquare`
- Textarea dengan placeholder: "Tambahkan catatan khusus untuk membantu AI..."
- Catatan dikirim sebagai parameter `additional_notes` ke endpoint AI
- Berguna untuk memberikan instruksi spesifik ke AI (misal: fokus pada certain kegiatan)

### 3. AI Preview Modal

Modal yang muncul setelah AI berhasil menghasilkan draft:

| Elemen | Detail |
|---|---|
| **Background** | Fixed overlay `bg-black/50`, z-50, centered |
| **Card** | `max-w-2xl`, border emerald, shadow-xl |
| **Title** | "Draft AI Report" dengan icon `Sparkles` hijau |
| **Description** | "Review dan edit draft yang dihasilkan AI sebelum digunakan" |
| **Close button** | Icon `XCircle` di pojok kanan |
| **Textarea** | 12 rows, font-mono, resize-y, min-h-[200px] |
| **Footer buttons** | "Batal" (outline) + "Gunakan Draft Ini" (gradient emerald) |

### 4. Edit Generated Report

- Textarea di dalam modal bersifat **editable** (`onChange` handler)
- User dapat mengubah draft langsung di modal sebelum digunakan
- Perubahan disimpan di state `aiDraft`

### 5. Insert Generated Content

- Tombol **"Gunakan Draft Ini"** → menjalankan `handleUseAiDraft()`
- Mengisi state `summary` dengan nilai `aiDraft`
- Menutup modal (`setShowAiModal(false)`)
- User dapat melanjutkan mengedit summary di form utama sebelum submit

### 6. Loading State

- Tombol Generate AI: icon `Loader2` + animasi spin + disabled
- Tombol "Catatan": tetap aktif (tidak terpengaruh)
- Form input lain: tetap editable (user bisa mengisi manual sambil menunggu AI)

### 7. Error State Handling

- **Error banner** ditampilkan di dalam card laporan (bukan modal) setelah form AI
- Style: border merah, background `red-50`, icon `AlertCircle`
- Pesan error dari backend ditampilkan (fallback: "Gagal menghasilkan draft AI.")
- Modal **tidak terbuka** saat error — user tetap di form utama
- Workflow manual **tidak terblokir** — user bisa terus mengisi form secara manual

---

## UI States

### Loading State (AI Generating)

```
┌──────────────────────────────────────┐
│ [Catatan]  [⟳ Generate AI]  ← button disabled + spinner
└──────────────────────────────────────┘
```

### Success State (AI Draft Generated)

```
┌─────────────────────────────────────────────┐
│  ✨ Draft AI Report                          │
│  Review dan edit draft yang dihasilkan AI    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ (editable draft text...)            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│           [Batal]  [✓ Gunakan Draft Ini]    │
└─────────────────────────────────────────────┘
```

### Error State (AI Failed)

```
┌──────────────────────────────────────┐
│ ⚠ Gagal menghasilkan draft AI.      │
│   Silakan coba lagi atau isi manual. │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│ [Catatan]  [✨ Generate AI]  ← button active lagi
└──────────────────────────────────────┘
```

---

## API Integration

| Method | Endpoint | Hook | Trigger |
|---|---|---|---|
| `POST` | `/api/v1/events/{event}/report/ai-generate` | `useAiGenerateReport(eventId)` | Klik tombol "Generate AI" |

### Request

```json
{
  "additional_notes": "Fokus pada partisipasi masyarakat sekitar"
}
```

### Response (Success)

```json
{
  "success": true,
  "message": "Draft laporan berhasil dihasilkan.",
  "data": {
    "summary": "RINGKASAN KEGIATAN:\nKegiatan ...",
    "sections": {
      "summary": "...",
      "attendance": "...",
      "impact": "..."
    },
    "provider": "mock"
  }
}
```

### Response (Fallback — AI gagal)

```json
{
  "success": true,
  "message": "Gagal menghasilkan draft AI. Menggunakan template bawaan.",
  "data": {
    "summary": "Laporan kegiatan ... (template fallback)",
    "sections": [],
    "provider": "fallback"
  }
}
```

---

## Data Flow

```
User klik "Generate AI"
        ↓
setAiLoading(true), setAiError(null)
        ↓
POST /events/{event}/report/ai-generate
  body: { additional_notes }
        ↓
  ┌──── SUCCESS ────┐      ┌──── ERROR ────┐
  │                  │      │               │
  ↓                  │      ↓               │
setAiDraft           │  setAiError          │
  ↓                  │      ↓               │
Show Modal           │  Show error banner   │
  ↓                  │      ↓               │
User review & edit   │  User can retry      │
  ↓                  │  or fill manually    │
"Gunakan Draft Ini"  │                      │
  ↓                  │                      │
setSummary(aiDraft)  │                      │
  ↓                  │                      │
Close Modal          │                      │
  ↓                  │                      │
User can edit again  │                      │
  ↓                  │                      │
Submit laporan       │                      │
```

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Generate AI Report button | ✅ Tombol "Generate AI" dengan Sparkles icon, hanya muncul saat editable |
| AI Report Preview Modal | ✅ Modal dengan textarea editable, title, description, action buttons |
| Edit Generated Report | ✅ Textarea editable di dalam modal |
| Insert Generated Content | ✅ Tombol "Gunakan Draft Ini" mengisi summary form |
| Loading State | ✅ Spinner pada tombol + disabled state |
| Error State Handling | ✅ Error banner di form, tidak mengganggu workflow manual |

---

## Acceptance Criteria

| Kriteria | Status |
|---|---|
| User dapat menghasilkan draft AI | ✅ Klik Generate AI → modal dengan draft |
| Draft dapat direview | ✅ Modal menampilkan draft untuk direview |
| Draft dapat diedit | ✅ Textarea editable di modal |
| Draft dapat digunakan sebagai laporan final | ✅ Tombol "Gunakan Draft Ini" → isi summary form |

---

## Build & Verification

| Check | Status |
|---|---|
| TypeScript Compilation | ✅ Clean — 0 errors |
| Next.js Build | ✅ Compiled successfully (Turbopack) |
| Route Registration | ✅ Terintegrasi dalam `/events/[id]/report` |
| AI generate flow | ✅ Button → API call → Modal → Edit → Insert → Submit |
| Error handling | ✅ Error banner, tidak blocking workflow manual |

---

## Catatan Penting

- Fitur AI menggunakan provider yang dikonfigurasi di backend (`config/ai.php`): `mock` (default) atau `openai`
- Saat menggunakan `mock` provider, AI menghasilkan template-based response tanpa API key
- AI **tidak otomatis submit** laporan — user harus review dan klik "Kirim Laporan" secara manual
- AI **tidak menyimpan** draft sampai user mengkonfirmasi dengan klik "Gunakan Draft Ini"
- **Kegagalan AI tidak menghalangi** workflow manual — user tetap bisa mengisi summary secara manual
- Additional notes bersifat opsional dan hanya dikirim jika user mengisinya
- Tombol "Catatan" adalah toggle — klik sekali untuk show, klik lagi untuk hide

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi, user dapat menghasilkan draft AI dari halaman laporan, draft dapat direview dan diedit di modal, draft dapat digunakan sebagai konten laporan final, error handling tidak mengganggu workflow manual.
