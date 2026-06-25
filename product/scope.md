# CommUnity Scope Definition

## Purpose

Dokumen ini mendefinisikan batasan ruang lingkup (scope) pengembangan CommUnity untuk versi MVP (v1.0). Seluruh aktivitas perencanaan, pengembangan, pengujian, dan review harus mengacu pada dokumen ini.

Fitur yang berada di luar ruang lingkup tidak boleh diimplementasikan tanpa persetujuan tim dan pembaruan dokumen proyek.

---

# Product Scope

## In Scope (v1.0)

### User Authentication & Access Management

* Registrasi akun relawan
* Login pengguna
* Logout pengguna
* Forgot password
* Role-based access control
* Manajemen profil pengguna

---

### Organization Management

* Registrasi organisasi
* Upload dokumen verifikasi organisasi
* Verifikasi organisasi oleh Admin Sistem
* Aktivasi dan deaktivasi akun organisasi

---

### Event Management

* Membuat event sosial
* Mengubah informasi event
* Menentukan kuota relawan
* Menunjuk koordinator event
* Publikasi event
* Menutup pendaftaran event

---

### Event Discovery

* Menampilkan daftar kegiatan sosial
* Melihat detail kegiatan
* Pencarian kegiatan berdasarkan kata kunci
* Filter berdasarkan kategori kegiatan
* Filter berdasarkan lokasi kegiatan
* Filter berdasarkan tanggal kegiatan

---

### Volunteer Management

* Registrasi relawan ke event
* Melihat status pendaftaran
* Melihat riwayat partisipasi
* Melihat daftar event yang diikuti

---

### Attendance Validation

* QR attendance generation
* QR attendance scanning
* Validasi kehadiran relawan
* Validasi kehadiran manual oleh koordinator
* Pencatatan waktu kehadiran

---

### Event Reporting

* Pengisian laporan kegiatan
* Upload dokumentasi kegiatan
* Penyimpanan draft laporan
* AI-assisted report generation
* Edit dan review hasil draft AI sebelum penyimpanan
* Pengiriman laporan kegiatan
* Persetujuan laporan oleh penyelenggara
* Penyelesaian event

---

### Digital Certificate

* Generate sertifikat digital otomatis
* Nomor sertifikat unik
* Penyimpanan sertifikat digital
* Download sertifikat PDF

---

### Analytics Dashboard

Dashboard untuk penyelenggara yang menampilkan:

* Jumlah event
* Jumlah relawan
* Attendance rate
* Jumlah kegiatan yang diselesaikan

---

### Notifications

* Notifikasi dalam aplikasi (in-app notification)
* Status registrasi event
* Status verifikasi organisasi
* Status laporan kegiatan
* Status sertifikat digital

---

### Platform Support

* Web application
* Responsive design untuk desktop dan mobile browser

---

# Out of Scope (v1.0)

Fitur berikut secara eksplisit tidak termasuk dalam ruang lingkup versi pertama.

## Mobile Application

* Android application
* iOS application
* Progressive Web App khusus mobile

---

## Advanced Communication

* Real-time chat
* Direct messaging
* Group discussion
* Community forum

---

## Financial Features

* Payment gateway
* Donasi online
* Crowdfunding
* Subscription system

---

## Advanced Analytics

* AI-generated impact insights
* Predictive analytics
* AI volunteer recommendation engine
* Impact scoring system

---

## Social Features

* Follow organization
* Like dan reaction
* Social feed
* Comment system

---

## Public Certificate Verification

* QR verification certificate
* Public certificate validation page

---

## Multi-Organization Collaboration

* Shared event management
* Cross-organization coordination
* Multi-organization event ownership

---

## Gamification

* Volunteer leaderboard
* Achievement badges
* Reward system
* Points and ranking

---

# Future Scope (Post-MVP)

Fitur berikut dapat dipertimbangkan setelah MVP berhasil diselesaikan dan divalidasi.

## Version 1.5

* Email notification
* Export attendance report
* Enhanced analytics dashboard
* Advanced search experience
* Multiple documentation galleries
* AI-assisted event description generation

---

## Version 2.0

* AI volunteer recommendation
* Public organization profile
* Volunteer achievement system
* Multi-organization collaboration

---

# Scope Control Rules

Sebelum fitur baru ditambahkan ke proyek, pertanyaan berikut harus dijawab:

1. Apakah fitur tersebut mendukung tujuan utama CommUnity?
2. Apakah fitur tersebut dibutuhkan untuk Expo Release?
3. Apakah fitur tersebut sudah tercantum dalam PRD?
4. Apakah fitur tersebut termasuk In Scope v1.0?

Jika salah satu jawaban adalah "Tidak", maka fitur harus ditunda atau dimasukkan ke Future Scope.

---

# Success Boundary

Versi MVP CommUnity dianggap berhasil apabila pengguna dapat:

1. Membuat dan mengelola kegiatan sosial.
2. Menemukan kegiatan sosial melalui fitur discovery.
3. Mendaftar sebagai relawan.
4. Melakukan validasi kehadiran menggunakan QR.
5. Membuat laporan kegiatan.
6. Menghasilkan draft laporan kegiatan menggunakan AI dan melakukan revisi sebelum penyimpanan.
7. Menghasilkan sertifikat digital.
8. Melihat statistik dasar kegiatan sosial.

Fitur di luar kemampuan tersebut tidak menjadi syarat keberhasilan MVP.
