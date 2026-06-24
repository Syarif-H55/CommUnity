

**PRODUCT REQUIREMENTS DOCUMENT**

# **CommUnity**

Platform manajemen kegiatan sosial komunitas berbasis digital

| Version | v2.5 \- In Review |
| :---- | :---- |
| **Date** | 26 May 2026 |
| **Team** | Kelompok ATM: Syarif Hidayatullah, Hiraldy Ibrahim, M. Abdillah Mu’tashim, Irham Malik |
| **Product Owner** | Hari Setiaji |
| **Client / Stakeholder** | Hari Setiaji |
| **Status** | In Review |

**PART 1: PROBLEM, OBJECTIVES & SCOPE**

# **1\.  Problem Statement**

### **1.1  Background & Context**

Kegiatan sosial komunitas seperti program edukasi, aksi lingkungan, pelatihan masyarakat, dan kegiatan kerelawanan masih banyak dikelola menggunakan alat yang terpisah seperti formulir pendaftaran, grup pesan, spreadsheet, dan dokumen manual. Kondisi ini menyebabkan informasi kegiatan tersebar, proses koordinasi menjadi lambat, serta sulit dilakukan pelacakan terhadap partisipasi dan hasil kegiatan. Selain itu, organisasi penyelenggara sering mengalami kesulitan dalam melakukan dokumentasi, evaluasi, dan pelaporan dampak kegiatan secara terstruktur. 

### **1.2  Problem Statement**

Organisasi komunitas dan penyelenggara kegiatan sosial tidak dapat mengelola pelaksanaan program sosial secara terintegrasi karena proses pendaftaran, koordinasi, pelaporan, dan evaluasi masih dilakukan secara terpisah, yang mengakibatkan inefisiensi operasional, rendahnya visibilitas kontribusi relawan, dan sulitnya mengukur dampak kegiatan. 

### **1.3  Who is Affected**

1. \[Primary User Group\] Organisasi/Komunitas Penyelenggara: Mengalami kesulitan dalam mengelola siklus kegiatan sosial mulai dari perencanaan, rekrutmen relawan, pelaksanaan, hingga evaluasi karena data tersebar dan tidak terdokumentasi secara konsisten.   
2. \[Secondary User Group\] Relawan: Sulit menemukan kegiatan yang relevan, melakukan registrasi, memantau riwayat kontribusi, dan memperoleh bukti partisipasi.  
3. \[Indirect Stakeholder\] Pihak kampus / pembina / sponsor komunitas: Sulit mengevaluasi efektivitas kegiatan dan melihat dampak program yang telah dijalankan.

# **2\.  Objectives**

### **2.1  Business Objectives**

| \# | Objective | Why it matters | Success indicator |
| :---: | ----- | ----- | ----- |
| **1** | Mengurangi proses administrasi kegiatan sosial secara manual sebesar 50%  | Meningkatkan efisiensi operasional  | Waktu administrasi sebelum dan sesudah implementasi  |
| **2** | Memusatkan data dan laporan kegiatan komunitas ke dalam satu platform  | Informasi yang tersebar menyebabkan kesulitan dalam pemantauan kegiatan  | 100% data kegiatan komunitas tercatat dalam sistem  |
| **3** | Menyediakan pelaporan kegiatan terpusat untuk seluruh program  | Mempermudah monitoring dan evaluasi  | 100% kegiatan memiliki laporan digital  |
| **4** | Menyediakan data dampak kegiatan berbasis metrik  | Membantu pengambilan keputusan  | Dashboard dapat menghasilkan statistik kegiatan  |

### **2.2  User Objectives**

| Actor | What they need to accomplish | What stops them today |
| ----- | ----- | ----- |
| **Relawan**  | Menemukan dan mendaftar kegiatan sosial dengan cepat dan mudah  | Informasi kegiatan tersebar di media sosial dan aplikasi pesan sehingga sulit ditemukan   |
| **Organisasi**  | Mengelola relawan dan kegiatan dalam satu sistem  | Data relawan, pendaftaran, dan absensi masih dilakukan secara manual  |
| **Administrator**  | Memantau performa kegiatan dan tingkat partisipasi pengguna  | Belum tersedia dashboard terpusat untuk monitoring data  |

# **3\.  Success Metrics**

Each metric needs a baseline (current state), a target, and a way to measure it. If you cannot write down the measurement method, pick a different metric.

| Metric | Baseline (now) | Target (3 months) | How it is measured |
| ----- | ----- | :---: | ----- |
| Waktu administrasi kegiatan | ±5 jam/event | ≤2 jam/event  | Survey operasional  |
| Persentase laporan digital  | 20% | 90% | Database laporan  |
| Rata-rata waktu pencarian kegiatan sosial  | Belum ada sistem  | \< 3 menit  | Tracking aktivitas pengguna melalui log sistem  |
| Persentase sertifikat otomatis  | 0%  | 100%  | log sistem  |

# **4\.  Scope**

### **4.1  In Scope & Out of Scope (MVP)**

| ✅  IN Scope (MVP) | ❌  OUT of Scope (v1) |
| ----- | ----- |
| Sistem registrasi dan login pengguna  | Sistem rekomendasi kegiatan berbasis AI  |
| Manajemen event sosial  | Fitur chat real-time antara relawan dan organisasi  |
| Pendaftaran relawan untuk kegiatan  | Integrasi dengan platform media sosial  |
| Absensi menggunakan QR Code | Sistem poin penghargaan dan gamifikasi  |
| Pelaporan kegiatan  | Integrasi pembayaran  |
| AI-assisted Event Report Generation  |  |
| Dashboard impact analytics  |  |
| Sertifikat digital otomatis  |  |

### **4.2  Assumptions & Constraints**

| Type | Description |
| ----- | ----- |
| **Assumption** | Pengguna memiliki akses internet dan perangkat digital seperti smartphone atau komputer untuk mengakses sistem  |
| **Assumption** | Organisasi dan relawan bersedia menggunakan platform digital untuk pengelolaan kegiatan   |
| **Constraint** | Waktu pengembangan terbatas pada satu semester akademik  |
| **Constraint** | Sistem harus memastikan keamanan autentikasi pengguna dan privasi data  |

**PART 2: FUNCTIONAL REQUIREMENTS & WORKFLOWS**

# **5\.  Functional Requirements**

### **5.1  FR Table \- Admin Sistem** 

| FR ID | Actor | The system shall… | Condition / Trigger | Priority | MoSCoW |
| :---: | :---: | ----- | ----- | ----- | :---: |
| **FR-001** | Admin Sistem  | mengizinkan admin membuat akun penyelenggara  | ketika data organisasi disubmit  |         Critical | M  |
| **FR-002** | Admin Sistem  | mengubah status akun penyelenggara menjadi aktif/nonaktif  | ketika admin melakukan validasi  | Critical | M |
| **FR-003** | Admin Sistem  | menampilkan dashboard statistik penggunaan sistem | ketika admin membuka dashboard   | Medium | S |
| **FR-004** | Admin Sistem  | mengelola data kategori kegiatan sosial  | ketika admin menambah atau mengubah kategori  | High | M  |
| **FR-005** | Admin Sistem  | melihat log aktivitas pengguna  | ketika admin memilih menu audit  | Low | C |

### **5.2  FR Table : Penyelenggara**

| FR ID | Actor | The system shall… | Condition / Trigger | Priority | MoSCoW |
| ----- | :---: | :---: | :---: | :---: | :---: |
| **FR-006** | Penyelenggara  | membuat event kegiatan sosial  | ketika formulir event dikirim  | Critical | M  |
| **FR-007** | Penyelenggara  | mengubah informasi event sebelum pelaksanaan  | ketika event belum dimulai  | Medium | M  |
| **FR-008** | Penyelenggara  | menentukan kuota relawan  | ketika event dibuat  | High | M  |
| **FR-009** | Penyelenggara  | menunjuk koordinator event  | ketika event telah dibuat  | High | M  |
| **FR-010** | Penyelenggara  | menutup pendaftaran relawan  | ketika kuota penuh atau waktu habis  | Critical | M  |
| **FR-011** | Penyelenggara  | melihat dashboard impact analytics  | ketika memilih menu analytics  | Medium | S |
| **FR-012** | Penyelenggara  | menghasilkan draft deskripsi kegiatan menggunakan AI berdasarkan informasi dasar event  | ketika penyelenggara memilih **Generate AI Description** saat membuat atau mengubah event  | Low  | C |
| **FR-013** | Penyelenggara  | menghasilkan sertifikat digital  | ketika event selesai dan laporan disetujui  | Medium | S |

### **5.3  FR Table : Koordinator Event**

| FR ID | Actor | The system shall… | Condition / Trigger | Priority | MoSCoW |
| ----- | :---: | :---: | :---: | :---: | :---: |
| **FR-014** | Koordinator Event  | melihat daftar relawan terdaftar  | ketika membuka halaman event  | High  | M |
| **FR-015** | Koordinator Event   | memvalidasi kehadiran relawan melalui QR  | ketika relawan check-in  | Critical | M |
| **FR-016** | Koordinator Event   | mencatat pelaksanaan kegiatan  | ketika event berlangsung  | Critical | M |
| **FR-017** | Koordinator Event   | mengunggah dokumentasi kegiatan  | ketika laporan dibuat  | Medium | S |
| **FR-019** | Koordinator Event  | menghasilkan draft laporan kegiatan menggunakan AI berdasarkan data event, data kehadiran relawan, dan input pengguna  | ketika koordinator memilih **Generate AI Report** sebelum mengirim laporan  | High  | S |
| **FR-020** | Koordinator Event   | mengirim laporan kegiatan  | ketika event selesai  | High | M |
| **FR-021** | Koordinator Event   | mengubah status event menjadi selesai  | ketika laporan telah lengkap  | High | M |

### **5.4  FR Table : Relawan** 

| FR ID | Actor | The system shall… | Condition / Trigger | Priority | MoSCoW |
| ----- | :---: | :---: | :---: | :---: | :---: |
| **FR-022** | Relawan  | membuat akun  | ketika registrasi berhasil  | Critical | M |
| **FR-023** | Relawan  | melihat daftar kegiatan  | ketika membuka halaman event  | Critical | M |
| **FR-024** | Relawan  | mendaftar ke kegiatan  | ketika kuota masih tersedia  | Critical | M |
| **FR-025** | Relawan  | melihat status pendaftaran  | setelah melakukan registrasi event  | Medium | S |
| **FR-026** | Relawan  | melakukan check-in menggunakan QR  | ketika hadir di lokasi  | High | M |
| **FR-027** | Relawan  | melihat riwayat kontribusi  | ketika membuka profil  | Medium | S |
| **FR-028** | Relawan  | mengunduh sertifikat digital  | ketika sertifikat tersedia  | Medium | S |

### 

# **6\.  User Workflows**

## **6.1  Workflow: Pembuatan Event & Pendaftaran Relawan**

| Actor | Penyelenggara dan Relawan  |
| :---- | :---- |
| **Goal** | Penyelenggara dapat membuat kegiatan sosial dan relawan dapat mendaftar ke kegiatan tersebut  |
| **FRs covered** | FR-006, FR-007, FR-008, FR-009, FR-010, FR-020, FR-021, FR-022  |

**Ideal Path**

| \# | Step description |
| :---: | ----- |
| **1** | Penyelenggara mengisi informasi kegiatan sosial seperti nama kegiatan, deskripsi, lokasi, tanggal pelaksanaan, dan kuota relawan, lalu sistem menyimpan data event.  |
| **2** | Penyelenggara menunjuk koordinator event dan sistem menghubungkan koordinator dengan event terkait.   |
| **3** | Sistem mempublikasikan event sehingga dapat dilihat oleh relawan pada daftar kegiatan tersedia.  |
| **4** | Relawan memilih kegiatan yang ingin diikuti dan melakukan pendaftaran ke event tersebut.  |
| **5** | Sistem memverifikasi ketersediaan kuota dan status pendaftaran relawan, kemudian sistem mengirimkan konfirmasi bahwa relawan berhasil terdaftar pada kegiatan.  |
| **6** | Sistem memvalidasi data, menyimpan pengajuan ke *database*, dan menampilkan notifikasi "Pendaftaran Berhasil Dikirim, Menunggu Verifikasi Admin"  |

**Decision Points**

| Decision Point | YES / Success path | NO / Error path |
| ----- | ----- | ----- |
| Apakah data event lengkap dan valid?  | Sistem menyimpan event dan mempublikasikannya   | Sistem menampilkan pesan kesalahan dan meminta penyelenggara melengkapi data  |
| Apakah kuota relawan masih tersedia?  | Sistem menerima pendaftaran relawan  | Sistem menolak pendaftaran dan menampilkan status event penuh  |

**Edge Cases**

| Edge Case | What the system must do |
| ----- | ----- |
| Relawan mencoba mendaftar dua kali pada event yang sama  | Sistem menolak pendaftaran kedua dan menampilkan notifikasi bahwa relawan sudah terdaftar  |
| Penyelenggara mengubah detail event setelah relawan terdaftar  | Sistem memperbarui informasi event dan mengirimkan notifikasi perubahan kepada seluruh relawan terdaftar   |
| Kuota event habis saat proses pendaftaran berlangsung  | Sistem membatalkan proses registrasi terakhir dan menampilkan informasi bahwa kuota sudah penuh  |

## **6.2  Workflow: Validasi Kehadiran Relawan**

| Actor | Koordinator Event dan Relawan  |
| :---- | :---- |
| **Goal** | Koordinator Event dapat memvalidasi kehadiran relawan pada kegiatan sosial dan sistem dapat mencatat data kehadiran secara digital  |
| **FRs covered** | FR-013, FR-014, FR-023  |

**Ideal Path**

| \# | Step description |
| :---: | ----- |
| **1** | Koordinator Event membuka daftar relawan terdaftar untuk kegiatan yang sedang berlangsung dan sistem menampilkan seluruh data relawan yang telah melakukan registrasi.  |
| **2** | Sistem menghasilkan QR attendance untuk event yang aktif dan menampilkan QR kepada relawan di lokasi kegiatan.  |
| **3** | Relawan melakukan check-in dengan memindai QR attendance menggunakan akun CommUnity mereka.  |
| **4** | Sistem memverifikasi identitas relawan, status pendaftaran, dan validitas QR attendance terhadap event terkait.   |
| **5** | Jika valid, sistem mencatat waktu kehadiran relawan dan memperbarui status attendance menjadi hadir.   |
| **6** | Koordinator Event melihat daftar kehadiran relawan yang telah diperbarui secara real-time selama kegiatan berlangsung.  |

**Decision Points**

| Decision Point | YES / Success path | NO / Error path |
| ----- | ----- | ----- |
| Apakah relawan terdaftar pada event terkait?  | Sistem melanjutkan proses validasi attendance  | Sistem menolak check-in dan menampilkan pesan bahwa relawan belum terdaftar  |
| Apakah QR attendance masih valid dan sesuai dengan event aktif?  | Sistem mencatat kehadiran relawan  | Sistem menolak attendance dan menampilkan pesan QR tidak valid atau kadaluarsa  |
| Apakah relawan sudah melakukan check-in sebelumnya?  | Sistem mempertahankan satu data attendance aktif  | Sistem menolak check-in kedua dan menampilkan notifikasi duplicate attendance  |

**Edge Cases**

| Edge Case | What the system must do |
| ----- | ----- |
| Relawan mencoba melakukan check-in di luar waktu pelaksanaan event  | Sistem menolak attendance dan menampilkan informasi bahwa sesi check-in belum dibuka atau sudah ditutup  |
| Relawan memindai QR dari event yang berbeda  | Sistem memverifikasi event ID dan menolak proses attendance yang tidak sesuai  |
| Koneksi internet terputus saat proses check-in   | Sistem menyimpan request sementara dan meminta relawan mencoba kembali setelah koneksi tersedia  |
| Koordinator Event menemukan relawan hadir tetapi gagal scan QR  | Sistem menyediakan opsi validasi manual oleh Koordinator Event dengan pencatatan alasan override attendance  |

## **6.3  Workflow: Laporan Event & Penyelesaian**

| Actor | Koordinator Event dan Penyelenggara  |
| :---- | :---- |
| **Goal** | Koordinator Event dapat mengirim laporan pelaksanaan kegiatan dan Penyelenggara dapat menyelesaikan event berdasarkan laporan yang telah diverifikasi  |
| **FRs covered** | FR-015, FR-016, FR-017, FR-018, FR-019, FR-020  |

**Ideal Path**

| \# | Step description |
| :---: | ----- |
| **1** | Setelah kegiatan selesai dilaksanakan, Koordinator Event membuka fitur pelaporan kegiatan pada event terkait dan sistem menampilkan form laporan event.  |
| **2** | Koordinator Event mengisi informasi pelaksanaan kegiatan seperti jumlah peserta hadir, ringkasan kegiatan, kendala pelaksanaan, dan hasil kegiatan, lalu sistem menyimpan data laporan sementara.  |
| **3** | Koordinator Event mengunggah dokumentasi kegiatan berupa foto atau file pendukung dan sistem menghubungkan dokumentasi dengan laporan event terkait.   |
| **4** | Koordinator Event dapat memilih fitur Generate AI Report dan sistem menghasilkan draft narasi laporan berdasarkan data event, data kehadiran relawan, serta input yang telah diisi.  |
| **5** | Koordinator Event meninjau dan dapat mengubah hasil draft laporan AI sebelum melanjutkan proses pengiriman laporan.  |
| **6** | Koordinator Event mengirim laporan kegiatan dan sistem mengubah status laporan menjadi submitted untuk ditinjau oleh Penyelenggara  |
| **7** | Penyelenggara meninjau isi laporan kegiatan beserta dokumentasi yang telah dikirimkan oleh Koordinator Event.   |
| **8** | Jika laporan dinyatakan lengkap dan valid, sistem mengubah status event menjadi completed dan menyimpan data kegiatan ke dalam riwayat organisasi.  |
| **9** | Sistem memperbarui data impact analytics berdasarkan hasil kegiatan yang telah diselesaikan.  |

**Decision Points**

| Decision Point | YES / Success path | NO / Error path |
| ----- | ----- | ----- |
| Apakah seluruh data laporan kegiatan telah lengkap?  | Sistem mengizinkan laporan dikirim  | Sistem menolak check-in dan menampilkan pesan bahwa relawan belum terdaftar  |
| Apakah dokumentasi kegiatan berhasil diunggah?  | Sistem menyimpan dokumentasi ke laporan event  | Sistem menampilkan pesan gagal upload dan meminta pengguna mencoba kembali  |
| Apakah Penyelenggara menyetujui laporan kegiatan?  | Sistem mengubah status event menjadi completed  | Sistem mengembalikan laporan ke Koordinator Event untuk revisi  |
| Apakah AI berhasil menghasilkan draft laporan?  | Sistem menampilkan draft laporan untuk ditinjau dan diedit oleh Koordinator Event.  | Sistem menampilkan pesan gagal menghasilkan draft AI dan pengguna tetap dapat mengisi laporan secara manual.  |

**Edge Cases**

| Edge Case | What the system must do |
| ----- | ----- |
| Koordinator Event mencoba mengirim laporan sebelum event selesai  | Sistem menolak pengiriman laporan dan menampilkan informasi bahwa event masih berlangsung  |
| File dokumentasi melebihi batas ukuran upload  | Sistem menolak file dan menampilkan batas maksimum ukuran file yang diperbolehkan  |
| Koordinator Event keluar dari sistem saat mengisi laporan  | Sistem menyimpan draft laporan secara otomatis agar data tidak hilang  |
| Penyelenggara menemukan data laporan tidak sesuai  | Sistem memberikan status revisi pada laporan dan mengirim notifikasi kepada Koordinator Event untuk memperbaiki laporan  |
| Layanan AI tidak tersedia atau gagal merespons  | Sistem menampilkan pesan bahwa fitur AI sementara tidak tersedia dan pengguna tetap dapat membuat laporan secara manual.  |

## **6.4  Workflow: Pembuatan Sertifikat Digital & Tracking Kontribusi**

| Actor | Penyelenggara dan Relawan  |
| :---- | :---- |
| **Goal** | Penyelenggara dapat menghasilkan sertifikat digital secara otomatis dan Relawan dapat melihat riwayat kontribusi serta mengunduh sertifikat kegiatan  |
| **FRs covered** | FR-012, FR-024, FR-025  |

**Ideal Path**

| \# | Step description |
| :---: | ----- |
| **1** | Setelah event berstatus completed, Penyelenggara membuka fitur sertifikat digital pada event terkait dan sistem menampilkan daftar relawan yang memenuhi syarat sertifikasi.   |
| **2** | Sistem memverifikasi data kehadiran relawan berdasarkan attendance record dan status partisipasi event.  |
| **3** | Penyelenggara menjalankan proses generate sertifikat dan sistem membuat sertifikat digital untuk setiap relawan yang memenuhi syarat.    |
| **4** | Sistem menyimpan sertifikat digital beserta nomor sertifikat unik dan menghubungkannya dengan akun relawan terkait.   |
| **5** | Relawan membuka halaman riwayat kontribusi dan sistem menampilkan daftar kegiatan yang pernah diikuti beserta status sertifikat masing-masing event.   |
| **6** | Relawan memilih sertifikat kegiatan tertentu dan sistem menyediakan file sertifikat digital untuk diunduh.   |
| **7** | Sistem mencatat aktivitas unduhan sertifikat sebagai bagian dari riwayat kontribusi relawan. .  |

**Decision Points**

| Decision Point | YES / Success path | NO / Error path |
| ----- | ----- | ----- |
| Apakah relawan memenuhi syarat kehadiran minimum?  | Sistem memasukkan relawan ke daftar penerima sertifikat   | Sistem tidak menghasilkan sertifikat untuk relawan tersebut  |
| Apakah proses generate sertifikat berhasil?  | Sistem menyimpan dan mendistribusikan sertifikat digital  | Sistem menampilkan pesan kegagalan generate sertifikat  |
| Apakah sertifikat tersedia untuk relawan?   | Relawan dapat mengunduh sertifikat  | Sistem menampilkan status sertifikat belum tersedia  |

**Edge Cases**

| Edge Case | What the system must do |
| ----- | ----- |
| Relawan tidak memenuhi persyaratan attendance minimum  | Sistem menolak generate sertifikat dan menampilkan status tidak memenuhi syarat  |
| Generate sertifikat gagal karena data relawan tidak lengkap  | Sistem menandai relawan sebagai pending verification dan meminta Penyelenggara melengkapi data  |
| Relawan mencoba mengunduh sertifikat sebelum event selesai  | Sistem menampilkan informasi bahwa sertifikat belum tersedia  |
| Terjadi duplikasi generate sertifikat pada event yang sama  | Sistem mempertahankan satu nomor sertifikat unik dan mencegah pembuatan sertifikat ganda  |

## **6.5  Workflow: Verifikasi Akun Organisasi**

| Actor | Admin Sistem dan Penyelenggara |
| :---- | :---- |
| **Goal** | Admin sistem dapat memverifikasi akun organisasi penyelenggara agar dapat menggunakan fitur pengelolaan kegiatan sosial pada platform CommUnity |
| **FRs covered** | FR-001, FR-002, FR-004, FR-005 |

**Ideal Path**

| \# | Step description |
| :---: | ----- |
| **1** | Penyelenggara melakukan registrasi organisasi dengan mengisi informasi organisasi seperti nama komunitas, email, deskripsi organisasi dan dokumen pendukung, lalu sistem menyimpan data registrasi organisasi. |
| **2** | Sistem memberikan status pending verification pada akun organisasi dan mengirim notifikasi registrasi kepada Admin Sistem. |
| **3** | Admin Sistem membuka daftar registrasi organisasi dan sistem menampilkan data organisasi beserta dokumen pendukung yang telah diunggah. |
| **4** | Admin Sistem memverifikasi kelengkapan dan validitas data organisasi sebelum memberikan akses ke fitur manajemen event.  |
| **5** | Jika data organisasi valid, Admin Sistem mengaktifkan akun organisasi dan sistem mengubah status akun menjadi active.    |
| **6** | Sistem mengirim notifikasi kepada Penyelenggara bahwa akun organisasi telah berhasil diverifikasi dan dapat digunakan untuk membuat kegiatan sosial.    |
| **7** | Sistem mencatat aktivitas verifikasi akun ke dalam audit log sistem.   |

**Decision Points**

| Decision Point | YES / Success path | NO / Error path |
| ----- | ----- | ----- |
| Apakah data organisasi lengkap dan valid?  | Sistem melanjutkan proses verifikasi akun  | Sistem menandai registrasi sebagai incomplete dan meminta perbaikan data  |
| Apakah dokumen pendukung berhasil diunggah?   | Sistem menyimpan dokumen untuk proses verifikasi  | Sistem menampilkan pesan gagal upload dokumen  |
| Apakah organisasi disetujui oleh Admin Sistem?   | Sistem mengaktifkan akun organisasi  | Sistem menolak registrasi dan mengirim alasan penolakan  |

**Edge Cases**

| Edge Case | What the system must do |
| ----- | ----- |
| Penyelenggara menggunakan email organisasi yang sudah terdaftar  | Sistem menolak registrasi dan menampilkan informasi bahwa email sudah digunakan  |
| Dokumen organisasi tidak sesuai format yang diperbolehkan   | Sistem menolak upload dokumen dan menampilkan format file yang didukung  |
| Admin Sistem menolak organisasi karena data tidak valid  | Sistem mengubah status akun menjadi rejected dan mengirim notifikasi revisi kepada Penyelenggara   |
| Penyelenggara tidak melengkapi data registrasi dalam batas waktu tertentu   | Sistem membatalkan registrasi pending secara otomatis dan mengarsipkan data sementara  |

# **7\.  Design Consideration**

## **7.1  Batasan Aksesibilitas Responsif**

| Constraint  | Seluruh workflow utama CommUnity, termasuk registrasi event, validasi attendance QR, pelaporan kegiatan, dan pengunduhan sertifikat, harus dapat digunakan secara penuh pada perangkat dengan lebar layar minimum 360px tanpa kehilangan fungsi utama.  |
| :---: | :---- |
| Rationale  | Sebagian besar relawan dan koordinator event akan mengakses sistem menggunakan perangkat mobile selama kegiatan berlangsung, sehingga seluruh fitur inti harus tetap dapat digunakan pada tampilan mobile responsive.  |
| Validation Method  | Pengujian responsive pada browser mobile dan desktop Seluruh workflow utama dapat diselesaikan tanpa horizontal scrolling Semua tombol aksi utama tetap terlihat dan dapat diakses pada viewport 360px |

## **7.2  Kendala Kegunaan Validasi Kehadiran**

| Constraint  | Proses validasi kehadiran relawan menggunakan QR attendance harus dapat diselesaikan maksimal dalam 10 detik per relawan pada koneksi internet standar 4G.  |
| :---: | :---- |
| Rationale  | Attendance validation dilakukan saat kegiatan berlangsung dan melibatkan banyak relawan dalam waktu singkat. Proses yang lambat dapat menyebabkan antrean dan menghambat operasional event.  |
| Validation Method  | Pengujian QR attendance pada staging environment Pengukuran waktu sejak QR dipindai hingga status attendance berhasil tercatat Pengujian dilakukan pada minimal 20 simulasi attendance berturut-turut |

## **7.3  Batasan Konsistensi Notifikasi**

| Constraint  | Sistem harus memberikan notifikasi status untuk seluruh aktivitas kritikal, termasuk registrasi event, validasi attendance, persetujuan laporan kegiatan, dan generate sertifikat digital.  |
| :---: | :---- |
| Rationale  | Pengguna membutuhkan kejelasan status proses agar tidak terjadi kebingungan terkait partisipasi event maupun validasi kegiatan.  |
| Validation Method  | Pengujian seluruh workflow utama Setiap aktivitas kritikal menghasilkan feedback status berhasil, gagal, atau pending Tidak ada proses utama yang berjalan tanpa status system feedback |

## **7.4  Kendala Konsistensi Bahasa & Antarmuka**

| Constraint  | Seluruh antarmuka utama CommUnity harus menggunakan Bahasa Indonesia yang konsisten dan menggunakan terminologi yang sama pada seluruh workflow sistem.  |
| :---: | :---- |
| Rationale  | Target pengguna utama adalah organisasi kampus dan komunitas lokal di Indonesia, sehingga konsistensi bahasa diperlukan untuk mengurangi kebingungan pengguna.  |
| Validation Method  | Review UI copywriting pada seluruh halaman utama Tidak terdapat campuran istilah berbeda untuk fungsi yang sama Seluruh menu dan notifikasi menggunakan Bahasa Indonesia |

## **7.5  Kendala Bantuan AI** 

| Constraint  | Fitur AI pada CommUnity hanya berfungsi sebagai asisten untuk menghasilkan draft deskripsi event dan draft laporan kegiatan. Seluruh hasil yang dihasilkan AI harus dapat ditinjau dan diubah oleh pengguna sebelum disimpan ke dalam sistem.  |
| :---: | :---- |
| Rationale  | CommUnity merupakan Management Information System yang mendukung proses administrasi kegiatan sosial. AI digunakan untuk membantu pengguna menyusun konten secara lebih efisien, bukan untuk mengambil keputusan atau menghasilkan data secara otomatis tanpa verifikasi pengguna.  |
| Validation Method  | Pengujian fitur Generate AI Description dan Generate AI Report. Hasil AI dapat diedit sebelum disimpan. Pengguna dapat melanjutkan proses secara manual tanpa menggunakan AI. Tidak ada data yang tersimpan otomatis tanpa tindakan pengguna.  |

## **7.6  Kendala Ketersediaan Layanan AI** 

| Constraint  | Sistem harus tetap dapat digunakan untuk pembuatan event dan pelaporan kegiatan meskipun layanan AI gagal merespons atau tidak tersedia.  |
| :---: | :---- |
| Rationale  | Fitur AI merupakan fitur pendukung dan bukan fungsi inti CommUnity. Kegagalan layanan AI tidak boleh menghambat penyelenggaraan event maupun proses pelaporan kegiatan.  |
| Validation Method  | Simulasi kegagalan layanan AI pada environment pengujian. Pengguna tetap dapat mengisi deskripsi event dan laporan kegiatan secara manual. Sistem menampilkan pesan kesalahan yang informatif tanpa menyebabkan kegagalan workflow utama.  |

## 

# **8\.  Data Requirements**

## **8.1  Entity: Pengguna**

Menyimpan data seluruh pengguna CommUnity, termasuk Admin Sistem, Penyelenggara, Koordinator Event, dan Relawan. 

| Attribute | Type | Description |
| ----- | ----- | ----- |
| user\_id (PK)  | UUID  | Identitas unik pengguna  |
| organization\_id (FK)  | UUID  | Referensi organisasi pengguna  |
| full\_name  | VARCHAR  | Nama lengkap pengguna  |
| email  | VARCHAR  | Email pengguna  |
| password\_hash  | VARCHAR  | Password terenkripsi  |
| role  | ENUM  | Role pengguna dalam sistem  |
| account\_status  | ENUM  | Status akun pengguna  |
| created\_at  | TIMESTAMP  | Waktu pembuatan akun  |

**Business Constraints**

* Email pengguna harus unik.  
* Role pengguna hanya dapat bernilai: Admin Sistem, Penyelenggara, Koordinator Event, atau Relawan.  
* Password harus disimpan dalam bentuk hash terenkripsi.  
* Akun dengan status inactive tidak dapat mengakses fitur sistem.


## **8.2  Entity: Organisasi**

Menyimpan data organisasi atau komunitas penyelenggara kegiatan sosial. 

| Attribute | Type | Description |
| ----- | ----- | ----- |
| organization\_id (PK)  | UUID  | Identitas unik organisasi  |
| organization\_name  | VARCHAR  | Nama organisasi  |
| description  | TEXT   | Deskripsi organisasi  |
| organization\_email  | VARCHAR  | Email organisasi  |
| verification\_status   | ENUM  | Status verifikasi organisasi  |
| document\_path  | VARCHAR | Lokasi file dokumen verifikasi  |
| created\_at  | ENUM  | Tanggal registrasi organisasi  |

**Business Constraints**

* Organisasi harus diverifikasi oleh Admin Sistem sebelum dapat membuat event.  
* Email organisasi harus unik.  
* Dokumen verifikasi hanya boleh menggunakan format PDF atau gambar.  
* Organization dengan status rejected tidak dapat mengakses fitur event management.


## **8.3  Entity: Event**

Menyimpan data kegiatan sosial yang dibuat oleh organisasi penyelenggara. 

| Attribute | Type | Description |
| ----- | ----- | ----- |
| event\_id (PK)  | UUID  | Identitas unik event  |
| organization\_id (FK)  | UUID  | Referensi organisasi penyelenggara  |
| coordinator\_id (FK)  | UUID  | Koordinator event  |
| event\_name  | VARCHAR  | Nama kegiatan  |
| description  | TEXT  | Deskripsi kegiatan  |
| location  | VARCHAR | Lokasi kegiatan  |
| event\_date  | DATETIME  | Tanggal pelaksanaan  |
| quota  | INT  | Kuota relawan  |
| event\_status  | ENUM  | Status event  |
| created\_at  | TIMESTAMP  | Tanggal pembuatan event  |

**Business Constraints**

* Event hanya dapat dibuat oleh organisasi terverifikasi.  
* Kuota relawan minimal 1 peserta.  
* Event dengan status completed tidak dapat diedit.  
* Koordinator event harus berasal dari organisasi yang sama.


## **8.4  Entity: Registrasi Relawan**

Menyimpan data pendaftaran relawan pada kegiatan sosial tertentu. 

| Attribute | Type | Description |
| ----- | ----- | ----- |
| registration\_id (PK)  | UUID  | Identitas unik registrasi  |
| event\_id (FK)  | UUID  | Referensi event  |
| volunteer\_id (FK)  | UUID   | Referensi relawan  |
| registration\_status  | ENUM  | Status pendaftaran  |
| registered\_at  | TIMESTAMP  | Waktu registrasi  |

**Business Constraints**

* Relawan hanya dapat mendaftar satu kali pada event yang sama.  
* Registrasi ditolak jika kuota event telah penuh.  
* Hanya relawan dengan akun aktif yang dapat melakukan registrasi.  
* Registrasi otomatis ditutup ketika event berstatus completed.

## **8.5  Entity: Kehadiran**

Menyimpan data kehadiran relawan pada kegiatan sosial. 

| Attribute | Type | Description |
| ----- | ----- | ----- |
| attendance\_id (PK)  | UUID  | Identitas unik attendance  |
| event\_id (FK)  | UUID  | Referensi event  |
| volunteer\_id (FK)  | UUID   | Referensi relawan  |
| check\_in\_time  | TIMESTAMP  | Waktu check-in  |
| attendance\_status  | ENUM  | Status kehadiran  |
| validated\_by (FK)  | UUID  | Koordinator yang memvalidasi  |

**Business Constraints**

* Relawan harus terdaftar sebelum dapat melakukan attendance.  
* Attendance hanya dapat dilakukan selama waktu event berlangsung.  
* Relawan hanya dapat melakukan satu attendance aktif per event.  
* Attendance manual harus menyimpan alasan validasi manual.


## **8.6  Entity: Sertifikat**

Menyimpan data sertifikat digital relawan.

| Attribute | Type | Description |
| ----- | ----- | ----- |
| certificate\_id (PK)  | UUID  | Identitas unik sertifikat  |
| event\_id (FK)  | UUID  | Referensi event  |
| volunteer\_id (FK)  | UUID   | Referensi relawan  |
| certificate\_number  | ENUM  | Nomor sertifikat unik  |
| generated\_at  | TIMESTAMP  | Waktu generate sertifikat  |
| certificate\_path  | VARCHAR  | Lokasi file sertifikat  |

**Business Constraints**

* Sertifikat hanya dapat dihasilkan untuk event berstatus completed.  
* Relawan harus memenuhi syarat attendance minimum untuk mendapatkan sertifikat.  
* Nomor sertifikat harus unik.  
* Sertifikat tidak dapat dihapus setelah diterbitkan.


# **9\.  Non-Functional Requirements**

## **9.1 Persyaratan Performa**

| Components | Requirements |
| ----- | ----- |
| Requirement  | Seluruh halaman utama CommUnity harus memiliki waktu loading maksimal 3 detik pada koneksi 4G standar untuk 95% request pengguna. Proses QR attendance validation harus dapat diselesaikan maksimal dalam 10 detik per request, dan dashboard event harus mampu menampilkan data hingga 500 relawan tanpa kegagalan rendering. Fitur AI-assisted Event Report Generation harus mampu menghasilkan draft laporan dalam waktu maksimal 15 detik pada kondisi jaringan normal.  |
| Threshold / Metric  | Page load time ≤ 3 detik pada p95, QR validation ≤ 10 detik, dashboard rendering sukses untuk \<= 500 relawan, AI report generation ≤ 15 detik pada kondisi normal  |
| Testing Method  | Load testing dan browser performance testing menggunakan staging environment pada simulasi koneksi 4G serta concurrent attendance simulation, AI response time testing menggunakan beberapa skenario laporan kegiatan dengan variasi panjang input.  |

## 

## **9.2 Keamanan dan Privasi Data** 

| Components | Requirements |
| ----- | ----- |
| Requirement  | Seluruh data autentikasi dan aktivitas pengguna harus dikirim menggunakan koneksi terenkripsi HTTPS dan password pengguna harus disimpan dalam bentuk hashing algorithm. Sistem harus menerapkan role-based access control pada seluruh fitur utama, menghasilkan nomor sertifikat unik untuk setiap sertifikat digital, dan mengakhiri session pengguna secara otomatis setelah 30 menit tidak aktif. Data yang dikirim ke layanan AI hanya mencakup informasi yang diperlukan untuk menghasilkan draft laporan kegiatan dan tidak boleh mencakup password, token autentikasi, atau informasi sensitif pengguna.   |
| Threshold / Metric  | 100% endpoint menggunakan HTTPS, seluruh password tersimpan dalam bentuk hash, session timeout \= 30 menit  |
| Testing Method  | Security testing pada API endpoint, database verificationterhadap  password storage, dan role access validation testing, Verification bahwa payload AI tidak mengandung password, token autentikasi, maupun informasi sensitif lainnya.   |

## **9.3 Persyaratan Skalabilitas** 

| Components | Requirements |
| ----- | ----- |
| Requirement  | Arsitektur sistem harus mampu menangani peningkatan jumlah pengguna dan event hingga 10 kali lipat tanpa perubahan besar pada struktur sistem. Sistem harus mampu menangani minimal 5.000 pengguna terdaftar, 200 event aktif, serta tetap mempertahankan performa query attendance dan registration pada volume data besar.  |
| Threshold / Metric  | Minimal 5.000 pengguna terdaftar, 200 event aktif, dan response time query ≤ 5 detik pada high-load simulation  |
| Testing Method  | Stress testing, concurrent user simulation, dan database query performance testing pada staging environment  |

## **9.4 Persyaratan Ketersediaan & Reliabilitas**

| Components | Requirements |
| ----- | ----- |
| Requirement  | Sistem harus memiliki prosedur pencadangan data otomatis secara berkala untuk mencegah kehilangan data (*data loss*) akibat kegagalan perangkat keras, serta memiliki rencana pemulihan jika terjadi kegagalan sistem utama, Kegagalan layanan AI tidak boleh menyebabkan kegagalan workflow utama pembuatan event maupun pelaporan kegiatan.    |
| Threshold / Metric  | System uptime ≥ 99%, data loss \= 0 untuk attendance records, backup database dilakukan setiap 24 jam, 100% workflow pelaporan tetap dapat dilakukan secara manual ketika layanan AI tidak tersedia   |
| Testing Method  | Monitoring uptime server, database persistence testing, backup recovery testing, dan simulasi auto-save draft laporan, Simulasi kegagalan layanan AI untuk memastikan pengguna tetap dapat mengisi laporan secara manual.   |

# **10\.  Release & Roadmap Planning**

## **10.1 Version Roadmap** 

### **10.1.1 v1.0 – MVP Release** 

**Target:** Mei – Juni 2026  
**MoSCoW:** Must Have Features   
**Goal:** Menyediakan workflow inti pengelolaan kegiatan sosial secara end-to-end.

**Features Included**

* Registrasi dan login pengguna  
* Verifikasi akun organisasi  
* Manajemen event sosial  
* Registrasi relawan  
* QR attendance validation  
* Event reporting  
* AI-assisted event report generation   
* Digital certificate generation  
* Contribution tracking dashboard


**Dependency & Sequencing Rationale**

Fitur pada v1.0 diprioritaskan karena seluruh fitur tersebut merupakan dependency utama untuk menjalankan lifecycle kegiatan sosial CommUnity secara lengkap. Event management menjadi fondasi utama sebelum volunteer registration dapat dilakukan, sementara attendance validation menjadi dependency bagi reporting dan certificate generation. Seluruh fitur pada versi ini dikategorikan sebagai Must Have karena sistem tidak dapat menjalankan fungsi inti community service management tanpa fitur-fitur tersebut. AI-assisted event report generation ditempatkan pada v1.0 karena mendukung proses pelaporan kegiatan yang merupakan bagian inti workflow CommUnity. Fitur ini tidak menggantikan proses pelaporan manual, tetapi membantu Koordinator Event menyusun draft laporan secara lebih cepat berdasarkan data kegiatan yang telah tercatat dalam sistem. 

### **10.1.2 v1.5 – Enhancement Release** 

**Target:** Juni – Juli 2026  
**MoSCoW:** Should Have Features   
**Goal:** Meningkatkan efisiensi operasional dan pengalaman pengguna setelah workflow inti stabil. 

**Features Included**

* Email notification system  
* Attendance export ke PDF/Excel  
* Multi-image documentation upload  
* Event filtering & search  
* Enhanced analytics dashboard  
* AI-assisted event description generation 

**Dependency & Sequencing Rationale**

Fitur v1.5 bergantung pada stabilitas workflow inti pada v1.0. Notification system membutuhkan event lifecycle yang sudah berjalan stabil, sedangkan analytics enhancement membutuhkan data event dan attendance yang telah terkumpul dari penggunaan sistem sebelumnya. Fitur-fitur ini meningkatkan usability dan operational efficiency, namun sistem masih dapat berjalan tanpa fitur tersebut sehingga dikategorikan sebagai Should Have. AI-assisted event description generation ditempatkan pada v1.5 karena berfungsi sebagai peningkatan produktivitas bagi penyelenggara saat membuat event dan tidak mempengaruhi operasional inti sistem. Oleh karena itu fitur ini dikategorikan sebagai Should Have dan dapat dikembangkan setelah workflow utama stabil. 

### **10.1.3 v2.0 – Scale Release** 

**Target:** 2027+  
**MoSCoW Focus:** Could Have Features  
**Goal:** Memperluas skalabilitas platform dan meningkatkan engagement pengguna. 

**Features Included**

* Native mobile application  
* AI-based volunteer recommendation  
* Gamification & volunteer leaderboard  
* Public organization profile page  
* Multi-organization collaboration system


**Dependency & Sequencing Rationale**

Fitur pada v2.0 memerlukan validasi penggunaan sistem dalam skala lebih besar sebelum dikembangkan. AI recommendation membutuhkan data historis volunteer yang cukup, sedangkan mobile application dan collaboration system membutuhkan arsitektur backend yang lebih matang dan scalable. Karena fitur-fitur ini tidak mempengaruhi operasional inti CommUnity pada MVP release, maka seluruh fitur dikategorikan sebagai Could Have dan ditunda ke fase pengembangan berikutnya.

## **10.2 Milestone Schedule** 

| Milestone | Week | Owner | Deliverables | Acceptance Criteria |
| ----- | ----- | ----- | ----- | ----- |
| PRD Final Approval | Week 2 | Project Manager | Final PRD CommUnity | Seluruh section PRD selesai, direview, dan disetujui seluruh anggota tim |
| UI/UX & Database Design Complete | Week 4 | UI/UX Designer & Database Engineer | Figma design, ERD, database schema | Seluruh workflow memiliki desain UI dan entity relationship tervalidasi |
| Backend API Complete | Week 6 | Backend Developer | Core API event, attendance, reporting, dan AI report integration  | Seluruh Must Have FR endpoint berhasil diuji pada Postman |
| Frontend Integration Complete | Week 8 | Frontend Developer | Responsive web interface dan AI report workflow integration  | Seluruh workflow utama dapat dijalankan end-to-end |
| System Testing & Bug Fixing | Week 9 | QA & Entire Team | Testing report, AI response validation, dan bug fixing | Tidak ada critical bug pada workflow utama dan AI report berhasil menghasilkan draft laporan pada seluruh skenario pengujian utama.  |
| Expo Release Candidate | Week 10 | Entire Team | Deployment staging & demo preparation | Sistem siap digunakan untuk simulasi expo dan seluruh workflow berjalan stabil |

## **10.3 Definition of Done (DoD) & Go-Live Checklist**

### **10.3.1 Definition of Done (DoD)**

Sebuah fitur CommUnity dinyatakan selesai apabila memenuhi seluruh kriteria berikut: 

| ☐.Seluruh Must Have Functional Requirements telah berhasil diimplementasikan. |
| :---- |
| ☐.Seluruh workflow utama dapat dijalankan tanpa critical failure. |
| ☐.Tidak terdapat bug dengan severity high atau critical.  |
| ☐.Seluruh halaman utama responsive pada lebar layar minimum 360px. |
| ☐.Seluruh endpoint utama berhasil diuji menggunakan API testing. |
| ☐.Attendance validation dan certificate generation berhasil dijalankan pada simulasi event. |
| ☐ AI Event Report Assistant berhasil menghasilkan draft laporan berdasarkan data event dan input pengguna  |
| ☐ Hasil draft laporan AI dapat ditinjau dan diedit oleh pengguna sebelum disimpan.  |
| ☐ Workflow pelaporan kegiatan tetap dapat dijalankan secara manual ketika layanan AI tidak tersedia.  |
| ☐.Seluruh data tersimpan secara konsisten di database. |
| ☐.UI dan terminology telah konsisten menggunakan Bahasa Indonesia |
| ☐ Seluruh role pengguna hanya dapat mengakses fitur sesuai hak akses masing-masing.  |
| ☐ Dokumentasi teknis dan deployment dasar telah selesai dibuat.  |

### **10.3.2 Go-Live Checklist**

Sebelum CommUnity dipresentasikan pada expo dan deployment final dilakukan, seluruh checklist berikut harus terpenuhi: 

| Infrastructure & Deployment  |
| :---- |
| ☐ Environment demo expo telah dikonfigurasi dan dapat dijalankan secara stabil.  |
| ☐ Environment variables aplikasi telah dikonfigurasi dengan benar.  |
| ☐Database backup dan recovery berhasil diuji |
| Functional Verification  |
| ☐ Seluruh workflow utama berhasil diuji end-to-end. |
| ☐ Registrasi organisasi dan verifikasi akun berjalan normal. |
| ☐ Volunteer registration berhasil diuji pada event simulasi. |
| ☐ QR attendance validation berhasil diuji pada simulasi multi-user. |
| ☐ Generate sertifikat digital berhasil dilakukan tanpa error. |
| ☐ Contribution tracking menampilkan data yang sesuai. |
| AI Feature Verification  |
| ☐ AI Event Report Assistant berhasil menghasilkan draft laporan pada skenario event simulasi.  |
| ☐ Draft laporan AI sesuai dengan data event dan tidak menghasilkan informasi kosong.  |
| ☐ Pengguna dapat mengedit hasil AI sebelum menyimpan laporan. |
| ☐ Workflow pelaporan manual tetap dapat dijalankan ketika layanan AI dinonaktifkan.  |
| ☐ API Key layanan AI telah dikonfigurasi dengan benar pada environment deployment.  |
| Security & Reliability  |
| ☐ Session timeout berjalan sesuai ketentuan. |
| ☐ Role-based access control berhasil diuji. |
| ☐ Tidak terdapat critical bug pada sistem. |
| ☐ Error handling menampilkan feedback yang jelas kepada pengguna. |
| Expo Readiness  |
| ☐ Akun demo expo telah disiapkan. |
| ☐ Dataset demo telah diisi. |
| ☐ Seluruh halaman responsive pada desktop dan mobile viewport. |
| ☐ Materi presentasi dan demo scenario telah selesai dipersiapkan. |
| ☐ Backup deployment tersedia jika terjadi kegagalan saat expo. |

**10.3 Dependency Mapping** 

| Feature | Depends On | Reason |
| ----- | ----- | ----- |
| Event Management | Organization Verification | Hanya organisasi terverifikasi yang dapat membuat event |
| Volunteer Registration | Event Management | Relawan hanya dapat mendaftar pada event yang telah dipublikasikan |
| Attendance Validation | Volunteer Registration | Attendance memerlukan data registrasi relawan |
| Event Reporting | Attendance Validation | Laporan event membutuhkan data kehadiran relawan |
| Certificate Generation | Event Completion | Sertifikat hanya dapat dihasilkan setelah event selesai dan laporan disetujui |
| Contribution Tracking | Certificate Generation | Riwayat kontribusi menggunakan data attendance dan sertifikat |

# **Revision History**

| Version | Date | Author | Changes |
| :---: | ----- | ----- | ----- |
| v1.0 | 26 May 2026 | Syarif, Hiraldy, Irham | Initial draft |
| v2.0 | 28 May 2026 | Syarif, Abdillah | Functional Requirements,  User Workflow |
| v2.1 | 28 May 2026 | Syarif | Design Consideration |
| v2.2 | 28 May 2026 | Syarif | Data Requirements |
| v2.3 | 28 May 2026 | Abdillah, Syarif | Non-Functional Requirements |
| v2.4 | 28 May 2026 | Syarif, Abdillah | Release & Roadmap Planning |
| v2.5 | 28 May 2026 | All | Re-check all points |
| v2.6 | 21 June 2026 | Syarif, Abdillah | Updated related for AI Implementation |

