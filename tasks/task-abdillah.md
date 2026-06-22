# Task List — Abdillah (Frontend Development)

## Sprint 01

### TASK-006 — Profile Management
- **Owner:** Abdillah
- **Support Owner:** Syarif
- **Implementation Tasks:**
  - Profile page
  - Edit profile form
  - Profile image upload
  - Update profile API integration

---

## Sprint 02

### TASK-013 — ✅ COMPLETED
- **Owner:** Abdillah
- **Support Owner:** Syarif
- **Implementation Tasks:**
  - ✅ `/discover` — Public event listing page with hero search, category chips, city filter, date filter, pagination, grid
  - ✅ `/discover/[id]` — Public event detail page with banner, description, time/location/participation cards, sidebar info
  - ✅ Search with debounce 400ms, integrated with `GET /api/v1/events?search=...`
  - ✅ Category filter — 5 chip buttons (Lingkungan, Pendidikan, Kesehatan, Sosial, Kemanusiaan) + Semua
  - ✅ Location filter — text input with clear button, sends `city` param
  - ✅ Date filter — date input with min=today, sends `date` param
  - ✅ Smart pagination with ellipsis, prev/next, scroll-to-top
- **Files Created:** `src/app/discover/page.tsx`, `src/app/discover/[id]/page.tsx`
- **Files Modified:** `src/types/index.ts` (+EventFilters, +DiscoverResponse), `src/services/event.service.ts` (+params support), `src/hooks/useEvent.ts` (+useDiscoverEvents), `src/app/(auth)/layout.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- **Build:** ✅ `next build` — compiled successfully, 16 routes, 0 errors
- **Detail:** Lihat `product/implementation-history/sprint-02/task-013.md`

### TASK-015 — Volunteer Participation Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Join event button
  - Registration confirmation
  - Participation history page
  - Event participation status

---

## Sprint 03

### TASK-020 — Event Reporting Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Report submission page
  - Photo upload component
  - Report detail page
  - Report review page
  - Report status page

### TASK-024 — Analytics Dashboard Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Analytics dashboard page
  - Metric cards
  - Summary statistics
  - Dashboard integration

---

## Support Tasks
- TASK-004 — Frontend Authentication Pages (Support untuk Hiraldy)
- TASK-009 — Organization Management Frontend (Support untuk Hiraldy)
- TASK-010 — Organization Member Management (Support untuk Syarif)
- TASK-012 — Event Management Frontend (Support untuk Hiraldy)
- TASK-018 — Attendance Management Frontend (Support untuk Hiraldy)
- TASK-022 — Certificate Management Frontend (Support untuk Hiraldy)
