# TASK-024: Analytics Dashboard Frontend

## Informasi Task

| Atribut | Detail |
|---|---|
| **Title** | Analytics Dashboard Frontend |
| **Owner** | Abdillah |
| **Support Owner** | Hiraldy |
| **Priority** | Medium |
| **Estimated Effort** | M |
| **Dependencies** | TASK-023 (Analytics Dashboard Backend) |

---

## Objective

Membangun dashboard analytics organisasi yang menampilkan metrik kegiatan organisasi secara realtime — Total Event, Total Relawan, Event Selesai, dan Tingkat Kehadiran. Dashboard terintegrasi sebagai tab baru di halaman detail organisasi.

---

## Files Created

| File | Deskripsi |
|---|---|
| `frontend/src/hooks/useAnalytics.ts` | TanStack Query hook — `useOrganizationAnalytics(organizationId)` |
| `frontend/src/components/analytics/AnalyticsMetricCard.tsx` | Reusable metric card component — gradient background, icon, hover effect |
| `frontend/src/components/analytics/AttendanceRateIndicator.tsx` | Progress bar indicator untuk attendance rate — color-coded (green/yellow/red) |
| `frontend/src/components/analytics/index.ts` | Barrel export |

---

## Files Modified

| File | Perubahan |
|---|---|
| `frontend/src/app/organizations/[id]/page.tsx` | Menambah tab "Analytics" dengan 4 metric cards, ringkasan kegiatan, dan partisipasi relawan |

---

## Feature Details

### 1. Data Flow

```
Analytics Backend (TASK-023)
        ↓
organizationService.getAnalytics(id)
        ↓
useOrganizationAnalytics(id) — TanStack Query hook
        ↓
Analytics Tab — Organization Detail Page
    ├── 4 Metric Cards (grid)
    ├── Ringkasan Kegiatan Card
    └── Partisipasi Relawan Card
```

### 2. Hook: `useOrganizationAnalytics`

**Lokasi:** `frontend/src/hooks/useAnalytics.ts`

```typescript
export function useOrganizationAnalytics(organizationId: string) {
    return useQuery({
        queryKey: ['organizations', organizationId, 'analytics'],
        queryFn: async () => {
            const response = await organizationService.getAnalytics(organizationId);
            return response.data.data!;
        },
        enabled: !!organizationId,
    });
}
```

- Query key: `['organizations', organizationId, 'analytics']`
- Auto-disabled when `organizationId` is empty
- Returns `AnalyticsData` type: `{ total_events, total_volunteers, completed_events, attendance_rate }`

### 3. AnalyticsMetricCard Component

**Lokasi:** `frontend/src/components/analytics/AnalyticsMetricCard.tsx`

**Features:**
- Gradient background overlay on hover (6 color variants: emerald, blue, purple, amber, teal, rose)
- Icon container with colored background matching the gradient
- Large number display with tracking-tight
- Optional subtitle text
- Optional trend indicator (up/down/neutral badge)
- `children` slot for custom content below the main value
- Hover animation: `shadow-md` + `-translate-y-0.5`
- Glassmorphism-like card with `backdrop-blur-sm` and `border-emerald-100/50`

**Props:**
```typescript
interface AnalyticsMetricCardProps {
    title: string
    value: string | number
    icon: ReactNode
    gradient?: 'emerald' | 'blue' | 'purple' | 'amber' | 'teal' | 'rose'
    iconBg?: string
    iconColor?: string
    subtitle?: string
    trend?: { direction: 'up' | 'down' | 'neutral'; label: string }
    children?: ReactNode
}
```

### 4. AttendanceRateIndicator Component

**Lokasi:** `frontend/src/components/analytics/AttendanceRateIndicator.tsx`

**Features:**
- Color-coded based on rate:
  - ≥ 75% → Green (Baik)
  - ≥ 50% → Amber (Cukup)
  - < 50% → Red (Rendah)
- Progress bar with `transition-all duration-500` animation
- Large percentage display with color coding
- Status label (Baik / Cukup / Rendah)

### 5. Analytics Tab Layout

**Lokasi:** `frontend/src/app/organizations/[id]/page.tsx` (Analytics tab content)

**Layout Structure:**
```
Tabs: Ringkasan | Analytics | Verifikasi | Dokumen | Anggota
       ↓
Analytics Tab:
├── Header: "Analytics Organisasi" + description
├── 4 Metric Cards (2x2 grid on desktop, 1x on mobile):
│   ├── Total Event (blue gradient, Calendar icon)
│   ├── Total Relawan (purple gradient, Users icon)
│   ├── Event Selesai (teal gradient, Target icon)
│   └── Tingkat Kehadiran (amber gradient, UserCheck icon + AttendanceRateIndicator)
├── Ringkasan Kegiatan Card:
│   ├── Total Event
│   ├── Event Selesai
│   └── Tingkat Penyelesaian (% — green highlight)
└── Partisipasi Relawan Card:
    ├── Total Relawan
    ├── Tingkat Kehadiran
    └── Rata-rata per Event (relawan/event — green highlight)
```

### 6. State Handling

| State | Visual |
|---|---|
| **Loading** | Full-width spinner with `Loader2` centered in tab content area |
| **Success** | Metric grid + summary cards with all data populated |
| **Empty/Error** | Centered illustration (`BarChart3` icon) + "Data Analytics Tidak Tersedia" message |
| **Zero values** | All metrics display 0 with proper formatting (attendance_rate = `0%`, completion rate = `0%`) |

---

## Implementation Tasks Coverage

| Task | Status |
|---|---|
| Analytics dashboard page | ✅ Tab "Analytics" di halaman detail organisasi — terintegrasi dengan Tabs |
| Metric cards | ✅ `AnalyticsMetricCard` — reusable dengan 6 gradient variants, icon, hover effect, trend indicator |
| Summary statistics | ✅ Ringkasan Kegiatan + Partisipasi Relawan cards dengan computed metrics |
| Dashboard integration | ✅ Terintegrasi ke halaman `/organizations/[id]` via existing tabs pattern; data dari `useOrganizationAnalytics` hook |

---

## Build & Verification

| Check | Status |
|---|---|
| TypeScript Compilation (`next build`) | ✅ Clean — 0 errors |
| New Files | ✅ 4 files created (1 hook, 2 components, 1 barrel) |
| Modified Files | ✅ 1 file modified (org detail page) |

---

## Catatan Penting

- Analytics tab muncul setelah tab "Ringkasan" dan sebelum "Verifikasi" — mengikuti prioritas informasi
- Data analytics di-refresh setiap kali tab diklik (TanStack Query default `staleTime`)
- Metric cards menggunakan 4 gradien berbeda untuk visual distinction:
  - Blue → Total Event
  - Purple → Total Relawan
  - Teal → Event Selesai
  - Amber → Tingkat Kehadiran
- Attendance rate memiliki 3 status warna: Hijau (≥75%), Kuning (≥50%), Merah (<50%)
- Ringkasan Kegiatan menampilkan **Tingkat Penyelesaian** = `completed_events / total_events * 100`
- Partisipasi Relawan menampilkan **Rata-rata per Event** = `total_volunteers / total_events`
- Kedua computed metric menggunakan guard `total_events > 0` untuk menghindari division by zero
- Tidak menambah dependency baru — hanya menggunakan shadcn/ui Card dan lucide-react icons yang sudah ada

---

## Status

**DONE** — Seluruh acceptance criteria terpenuhi: semua metrik tampil (total_events, total_volunteers, completed_events, attendance_rate) dalam 4 metric cards + 2 summary cards; data sinkron dengan backend via `useOrganizationAnalytics` hook yang memanggil `GET /api/v1/organizations/{id}/analytics`.
