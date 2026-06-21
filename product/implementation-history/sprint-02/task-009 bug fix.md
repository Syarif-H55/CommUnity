# TASK-009: Bug Fix — React Hooks Rule Violation

## Tanggal
2026-06-22

## Penulis
AI Debugging Assistant

---

## Bug Description

Halaman detail organisasi (`/organizations/[id]`) mengalami error:

```
React has detected a change in the order of Hooks called by OrganizationDetailContent.
Rendered more hooks than during the previous render.
    at OrganizationDetailContent (src/app/organizations/[id]/page.tsx:67:55)
```

---

## Root Cause

Enam hook `useState` ditempatkan **setelah** dua blok early return:

1. **Loading state** — `if (isLoading) { return ... }` (line 34-43)
2. **Error/not-found state** — `if (error || !organization) { return ... }` (line 45-65)
3. **useState declarations** — (line 67-72) — hanya dieksekusi jika loading & error terlewati

### Mengapa ini melanggar Rules of Hooks

React mewajibkan semua hooks dipanggil dalam **urutan yang sama** di setiap render:

| Render Condition | Hooks Called | Jumlah |
|---|---|---|
| Loading | `useParams`, `useAuthStore`, `useLogout`, `useOrganization`, `useUploadDocument`, `useOrganizationMembers`, `useAddMember`, `useUpdateMemberRole`, `useRemoveMember` | 9 hooks |
| Error | Sama seperti di atas | 9 hooks |
| Success | Sama + 6 `useState` tambahan | **15 hooks** ❌ |

Ketika transisi dari loading → success, React melihat jumlah hooks berubah dari 9 → 15, menyebabkan error.

---

## Fix

Memindahkan 6 hook `useState` ke **sebelum** early return blocks:

```tsx
// BEFORE (bug):
const removeMember = useRemoveMember(id)

if (isLoading) { return ... }
if (error || !organization) { return ... }

const [showAddMember, setShowAddMember] = useState(false) // ❌ terlambat
const [newUserId, setNewUserId] = useState("")
const [newUserRole, setNewUserRole] = useState("Koordinator Event")
const [searchUser, setSearchUser] = useState("")
const [editingRole, setEditingRole] = useState<string | null>(null)
const [editRoleValue, setEditRoleValue] = useState("Koordinator Event")

// AFTER (fix):
const removeMember = useRemoveMember(id)

const [showAddMember, setShowAddMember] = useState(false) // ✅ sebelum early return
const [newUserId, setNewUserId] = useState("")
const [newUserRole, setNewUserRole] = useState("Koordinator Event")
const [searchUser, setSearchUser] = useState("")
const [editingRole, setEditingRole] = useState<string | null>(null)
const [editRoleValue, setEditRoleValue] = useState("Koordinator Event")

if (isLoading) { return ... }
if (error || !organization) { return ... }
```

## File Modified

| File | Perubahan |
|---|---|
| `src/app/organizations/[id]/page.tsx` | Memindahkan 6 `useState` declarations ke atas sebelum early return blocks |

---

## Verification

| Check | Status |
|---|---|
| TypeScript compilation | ✅ `tsc --noEmit` — 0 errors |
| Production build | ✅ `next build` — compiled successfully, 14 routes |
| Hooks order | ✅ Semua hooks kini dipanggil sebelum early return — urutan konsisten di setiap render |
