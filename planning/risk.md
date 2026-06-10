# CommUnity Risk Register

## Purpose

Dokumen ini mengidentifikasi risiko utama yang dapat mempengaruhi keberhasilan pengembangan CommUnity serta strategi mitigasi yang harus dilakukan oleh tim.

Tujuan utama risk register adalah:

* Mengurangi kemungkinan keterlambatan proyek.
* Mengurangi dampak masalah teknis.
* Membantu tim mengambil keputusan lebih cepat ketika risiko terjadi.
* Menjaga kesiapan aplikasi menjelang Expo Release.

---

# Risk Assessment Scale

## Probability

| Level  | Description               |
| ------ | ------------------------- |
| Low    | Kemungkinan kecil terjadi |
| Medium | Mungkin terjadi           |
| High   | Sangat mungkin terjadi    |

---

## Impact

| Level  | Description                   |
| ------ | ----------------------------- |
| Low    | Dampak kecil terhadap proyek  |
| Medium | Mengganggu sebagian milestone |
| High   | Mengancam target Expo Release |

---

# RISK-001

## Risk

Scope creep selama pengembangan.

## Description

Penambahan fitur baru di tengah pengembangan dapat menyebabkan keterlambatan penyelesaian fitur inti.

## Probability

High

## Impact

High

## Mitigation

* Mengunci scope MVP berdasarkan PRD.
* Seluruh perubahan harus melalui diskusi tim.
* Mengikuti prioritas MoSCoW yang telah ditetapkan.

## Contingency Plan

Menunda fitur kategori Should Have dan Could Have ke versi berikutnya.

---

# RISK-002

## Risk

Integrasi frontend dan backend terlambat.

## Description

Frontend dan backend dikembangkan oleh anggota berbeda sehingga berpotensi terjadi perbedaan ekspektasi API.

## Probability

High

## Impact

High

## Mitigation

* Menyelesaikan API Convention sejak awal.
* Menyepakati kontrak API sebelum implementasi.
* Melakukan integrasi bertahap setiap minggu.

## Contingency Plan

Memprioritaskan integrasi fitur inti terlebih dahulu.

---

# RISK-003

## Risk

Keterlambatan implementasi fitur Attendance QR.

## Description

Attendance Validation merupakan fitur yang menghubungkan beberapa modul sekaligus dan memiliki kompleksitas lebih tinggi dibanding fitur CRUD biasa.

## Probability

Medium

## Impact

High

## Mitigation

* Membuat proof of concept QR lebih awal.
* Mengimplementasikan attendance sebelum fase polishing.

## Contingency Plan

Menggunakan QR sederhana tanpa fitur tambahan jika waktu terbatas.

---

# RISK-004

## Risk

Keterlambatan implementasi Certificate Generation.

## Description

Proses pembuatan PDF otomatis dapat menimbulkan masalah format dan kompatibilitas.

## Probability

Medium

## Impact

Medium

## Mitigation

* Menentukan template sertifikat sejak awal.
* Melakukan pengujian PDF lebih awal.

## Contingency Plan

Menggunakan template PDF sederhana untuk Expo Release.

---

# RISK-005

## Risk

Kualitas data testing tidak memadai.

## Description

Kurangnya data dummy dapat menyebabkan workflow tidak teruji secara menyeluruh.

## Probability

Medium

## Impact

Medium

## Mitigation

* Menyiapkan data seed untuk seluruh role.
* Menyiapkan contoh organisasi, event, dan relawan.

## Contingency Plan

Membuat dataset demo khusus sebelum Expo.

---

# RISK-006

## Risk

Bug ditemukan menjelang Expo.

## Description

Masalah kritis yang ditemukan mendekati hari presentasi dapat mengganggu stabilitas aplikasi.

## Probability

High

## Impact

High

## Mitigation

* Menyediakan buffer testing minimal satu minggu.
* Melakukan regression testing sebelum demo.

## Contingency Plan

Membekukan penambahan fitur baru dan fokus pada perbaikan bug.

---

# RISK-007

## Risk

Ketergantungan pada satu anggota tim.

## Description

Beberapa bagian sistem hanya dipahami oleh satu anggota tertentu.

## Probability

Medium

## Impact

High

## Mitigation

* Dokumentasi kode dan arsitektur.
* Code review antar anggota.
* Sharing knowledge secara berkala.

## Contingency Plan

Anggota lain mengambil alih bagian yang terdokumentasi.

---

# RISK-008

## Risk

Keterbatasan waktu menjelang Expo.

## Description

Waktu implementasi tidak cukup untuk menyelesaikan seluruh fitur yang direncanakan.

## Probability

High

## Impact

High

## Mitigation

* Fokus pada fitur Must Have terlebih dahulu.
* Menyelesaikan workflow utama sebelum fitur tambahan.

## Contingency Plan

Menunda:

* Notification System
* Multi-Organization Membership Experience

ke versi berikutnya.

---

# RISK-009

## Risk

Masalah responsive design.

## Description

Tampilan dapat bekerja pada laptop tetapi tidak optimal pada ukuran layar lain.

## Probability

Medium

## Impact

Medium

## Mitigation

* Pengujian responsive dilakukan sejak awal.
* Menggunakan komponen shadcn/ui yang responsif.

## Contingency Plan

Memprioritaskan pengalaman desktop untuk kebutuhan Expo.

---

# RISK-010

## Risk

Kehilangan data akibat kesalahan database.

## Description

Kesalahan migration atau penghapusan data dapat mengganggu proses pengembangan.

## Probability

Low

## Impact

High

## Mitigation

* Menggunakan migration versioning.
* Melakukan backup database secara berkala.

## Contingency Plan

Restore dari backup terbaru.

---

# RISK-011

## Risk

Performa aplikasi menurun akibat query yang tidak efisien.

## Description

Penggunaan relationship dan analytics realtime dapat menghasilkan query berlebih.

## Probability

Medium

## Impact

Medium

## Mitigation

* Menggunakan eager loading.
* Menghindari N+1 query.
* Melakukan review query pada fitur dashboard.

## Contingency Plan

Mengurangi jumlah data yang ditampilkan pada dashboard.

---

# RISK-012

## Risk

Demo gagal saat Expo.

## Description

Kesalahan konfigurasi lokal, data demo, atau workflow presentasi dapat mengganggu demonstrasi.

## Probability

Medium

## Impact

High

## Mitigation

* Menyiapkan akun demo.
* Menyiapkan data demo lengkap.
* Melakukan simulasi presentasi sebelum Expo.

## Contingency Plan

Menyiapkan video rekaman demonstrasi sebagai backup.

---

# Top Priority Risks

Risiko yang harus dipantau secara aktif selama pengembangan:

1. Scope Creep (RISK-001)
2. Frontend-Backend Integration Delay (RISK-002)
3. Last Minute Critical Bugs (RISK-006)
4. Timeline Constraint (RISK-008)
5. Expo Demo Failure (RISK-012)

---

# Risk Review Policy

Risk register harus ditinjau ulang:

* Pada akhir setiap milestone.
* Sebelum memasuki fase testing.
* Sebelum Expo Release.

Risiko baru yang ditemukan selama pengembangan harus ditambahkan ke dokumen ini.

---

# Summary

Keberhasilan CommUnity bergantung pada kemampuan tim untuk menjaga scope tetap terkendali, menyelesaikan integrasi frontend-backend lebih awal, dan mempertahankan stabilitas aplikasi menjelang Expo Release.

Prioritas utama tim adalah memastikan seluruh workflow inti berjalan dengan baik sebelum mengembangkan fitur tambahan.