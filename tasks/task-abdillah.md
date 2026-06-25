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

## Sprint 04

### TASK-S04-004 — Multi-Organization Membership Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Organization switcher dropdown (navbar/sidebar)
  - Organization list page
  - Active organization indicator
  - Dashboard context per organization
  - Switch organization confirmation

### TASK-S04-006 — AI Event Description Assistant Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Generate AI Description button (on create/edit event)
  - AI Description Preview Modal
  - Edit Generated Description
  - Insert Generated Content
  - Loading State
  - Error State Handling

---

## Sprint 05

### TASK-S05-004 — Export Data Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Export button on attendance page
  - Export button on report page
  - Export format selector
  - Download progress indicator
  - Export history page

### TASK-S05-008 — Multiple Documentation Galleries Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Gallery management UI
  - Gallery create/edit modal
  - Gallery reorder (drag and drop)
  - Gallery cover selector
  - Gallery view on report detail

---

## Sprint 06

### TASK-S06-004 — Community Collaboration Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Collaboration invitation page
  - Collaboration management page
  - Shared event dashboard
  - Collaboration partner list
  - Invitation accept/reject UI

### TASK-S06-008 — Donation Module Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Campaign list page
  - Campaign detail page
  - Donation form
  - Donation confirmation
  - Campaign management dashboard
  - Donation history page

### TASK-S06-012 — AI Volunteer Recommendation Frontend
- **Owner:** Abdillah
- **Support Owner:** Hiraldy
- **Implementation Tasks:**
  - Recommended events section on dashboard
  - Recommendation card component
  - "Why recommended?" tooltip
  - Feedback button (relevant/not relevant)
  - Dismiss recommendation

---

## Support Tasks
- TASK-004 — Frontend Authentication Pages (Support untuk Hiraldy)
- TASK-009 — Organization Management Frontend (Support untuk Hiraldy)
- TASK-010 — Organization Member Management (Support untuk Syarif)
- TASK-012 — Event Management Frontend (Support untuk Hiraldy)
- TASK-018 — Attendance Management Frontend (Support untuk Hiraldy)
- TASK-022 — Certificate Management Frontend (Support untuk Hiraldy)
- TASK-S04-002 — Notification System Frontend (Support untuk Hiraldy)
- TASK-S04-008 — Dashboard & Search Enhancement Frontend (Support untuk Hiraldy)
- TASK-S05-002 — Email Notification System Frontend (Support untuk Hiraldy)
- TASK-S05-006 — Public Organization Profile Frontend (Support untuk Hiraldy)
- TASK-S06-002 — Volunteer Achievement System Frontend (Support untuk Hiraldy)
- TASK-S06-006 — Event Review & Feedback Frontend (Support untuk Hiraldy)
- TASK-S06-010 — Public Certificate Verification Frontend (Support untuk Hiraldy)
