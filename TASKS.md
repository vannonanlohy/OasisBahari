# TASKS — OasisBahari / JejakBahari

| Field | Nilai |
|---|---|
| Dokumen | Rencana implementasi |
| Versi | 1.0 |
| Berdasarkan | `SPEC.md` v1.0 dan `UI-SPEC.md` v1.0 |
| Status | Draft, belum ada kode aplikasi |
| Pengujian | Manual sesuai `AC-01`–`AC-26` dan `UI-01`–`UI-15` |
| Timebox | 1 hari kerja + buffer QA |

> **Catatan penamaan:** `SPEC.md` memakai **OasisBahari**, `UI-SPEC.md` memakai **JejakBahari**. Tugas **T0.1** harus menyelesaikan nama final sebelum tugas antarmuka dimulai. Perilaku dan acceptance criteria tetap mengikuti `SPEC.md`.

## Cara Pakai

- Centang `[ ]` menjadi `[x]` setelah acceptance criteria terpenuhi dan diverifikasi manual.
- Setiap tugas menuliskan **berkas yang mungkin berubah**, bukan berkas yang wajib ada persis. Sesuaikan dengan struktur akhir proyek.
- Jika satu tugas gagal, catat di `QA.md` sebelum melanjutkan ke milestone berikutnya.
- Perubahan ruang lingkup harus diperbarui di `SPEC.md` lebih dulu.

**Urutan eksekusi disarankan:** M0 → M1 → M2 → M3 → M5 → M4 → M6 → M7 → M8 → M9.  
Alasan: wishlist/checklist dan CRUD bergantung pada modul penyimpanan, sehingga M5 dikerjakan sebelum M4 agar tidak menulis ulang logika.

---

## M0 — Scaffold

**Tujuan:** proyek siap, kontrak data dan desain dasar disepakati.

### T0.1 — Putuskan nama brand final
- [ ] Nama final ditulis eksplisit di `SPEC.md` dan `UI-SPEC.md`.
- [ ] Wordmark, judul halaman, dan teks footer memakai satu nama yang sama.
- [ ] Key `localStorage` mengikuti nama final secara konsisten.
- [ ] Tidak ada label ganda “OasisBahari” dan “JejakBahari” di antarmuka.

**Berkas yang mungkin berubah:** `SPEC.md`, `UI-SPEC.md`, `TASKS.md`.

### T0.2 — Inisialisasi proyek Vite + JavaScript vanilla
- [ ] Server dev Vite berjalan tanpa error di Console.
- [ ] Struktur folder minimal: `src/data`, `src/components`, `src/pages`, `src/storage`, `src/utils`, `src/styles`, `public/images`.
- [ ] `index.html` memuat judul aplikasi dan meta viewport.
- [ ] Tidak ada framework UI dan tidak ada backend.

**Berkas yang mungkin berubah:** `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `.gitignore`, `README.md`.

### T0.3 — Siapkan 8 data contoh dan aset lokal
- [ ] Tepat 8 destinasi sesuai tabel `SPEC.md` 4.3 dan 4.4.
- [ ] Komposisi 5 Populer dan 3 Hidden Gem.
- [ ] `latitude`/`longitude` bertipe number dan berada dalam rentang wajar.
- [ ] `imageUrl` hanya path lokal; `/images/placeholder.svg` tersedia.
- [ ] Tidak ada data pribadi dan tidak ada URL eksternal.

**Berkas yang mungkin berubah:** `src/data/destinations.js`, `src/data/seed.js`, `public/images/*.svg`, `public/images/placeholder.svg`.

### T0.4 — Terapkan design token dan stylesheet dasar
- [ ] Warna, font sans-serif, spasi, radius, dan shadow sesuai `UI-SPEC.md` 3.1–3.3.
- [ ] Outline fokus 2 px tosca dengan offset 2 px terlihat pada elemen interaktif.
- [ ] Grid dasar 1 kolom dengan breakpoint 600 px dan 900 px.
- [ ] `prefers-reduced-motion` dinonaktifkan di CSS.

**Berkas yang mungkin berubah:** `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`, `src/styles/layout.css`.

### T0.5 — Shell aplikasi, navbar, dan routing dasar
- [ ] Navbar desktop menampilkan semua menu; mobile menampilkan burger + badge wishlist.
- [ ] Tautan `Lewati ke konten` tersedia.
- [ ] Beranda, Destinasi, Peta, Wishlist, Tentang, dan Dashboard dapat dibuka.
- [ ] Tidak ada halaman/login/registrasi (AC-25).

**Berkas yang mungkin berubah:** `src/components/navbar.js`, `src/main.js`, `src/pages/home.js`, `src/pages/wishlist.js`, `src/pages/about.js`, `src/pages/dashboard.js`.

---

## M1 — Katalog Destinasi & Peta OpenStreetMap

**Tujuan:** pengunjung melihat 8 destinasi dan sebarannya di peta.

### T1.1 — Grid kartu destinasi
- [ ] Tampil tepat 8 kartu pada kondisi awal (AC-01).
- [ ] Kartu memuat gambar/placeholder, status, nama, wilayah, provinsi, jenis objek, level, dan tombol wishlist.
- [ ] Grid berubah 3 → 2 → 1 kolom pada 1280 → 800 → 375 px (UI-08).
- [ ] Klik kartu (di luar tombol wishlist) membuka detail (AC-03).

**Berkas yang mungkin berubah:** `src/components/destinationCard.js`, `src/pages/home.js`, `src/styles/components.css`.

### T1.2 — Hero dan ringkasan beranda
- [ ] Hero menampilkan headline, subhead, input pencarian, CTA, dan tiga chip ringkasan (UI-06).
- [ ] Chip menampilkan `8 destinasi`, `3 hidden gems`, `5 populer` (AC-01, AC-02).
- [ ] Mobile: headline 28 px dan input penuh lebar.

**Berkas yang mungkin berubah:** `src/components/hero.js`, `src/pages/home.js`, `src/styles/layout.css`.

### T1.3 — Inisialisasi Leaflet dan marker
- [ ] Peta memakai tile OpenStreetMap tanpa API key.
- [ ] 8 marker tampil sesuai koordinat data contoh (AC-12).
- [ ] Klik marker memunculkan popup nama, status, wilayah, dan tautan detail.
- [ ] Legenda membedakan lingkaran Populer dan berlian Hidden Gem (UI-07).
- [ ] Atribusi OpenStreetMap terlihat dan tidak tertutupi (AC-13).

**Berkas yang mungkin berubah:** `src/components/map.js`, `src/pages/home.js`, `src/main.js`, `package.json`, `src/styles/components.css`.

### T1.4 — Sinkronisasi marker dan fallback peta
- [ ] Marker mengikuti hasil filter pencarian (AC-13).
- [ ] Jika hasil kosong, tampil pesan `Tidak ada marker untuk filter ini` dan tombol reset.
- [ ] Jika tile gagal, daftar tetap berfungsi dan peta menampilkan pesan fallback (NFR-5).
- [ ] Tidak ada permintaan ke layanan eksternal selain tile OSM (AC-24).

**Berkas yang mungkin berubah:** `src/components/map.js`, `src/components/emptyState.js`, `src/utils/filter.js`.

---

## M2 — Interaksi Pencarian, Filter, Sorting

**Tujuan:** pengunjung menyempitkan dan mengurutkan hasil tanpa reload halaman.

### T2.1 — Utilitas pencarian
- [ ] Query di-trim dan case-insensitive (AC-04).
- [ ] Minimum 2 karakter; di bawah itu tampil semua data + petunjuk, bukan error (AC-06).
- [ ] Beberapa kata digabung AND; cocok ke nama, deskripsi, wilayah, provinsi, catatan lokal (AC-05).
- [ ] Query kosong menampilkan seluruh data.

**Berkas yang mungkin berubah:** `src/utils/search.js`, `src/components/filterBar.js`, `src/pages/home.js`.

### T2.2 — Filter wilayah dan status
- [ ] Filter wilayah: Sulawesi, Papua, Sumatera, Jawa, Nusa Tenggara (AC-07).
- [ ] Filter status: Semua, Populer, Hidden Gem (AC-08).
- [ ] Kombinasi Sulawesi + Hidden Gem menghasilkan empty state (AC-09).
- [ ] Chip filter aktif dapat dihapus dan tersedia tombol Reset (UI-09).

**Berkas yang mungkin berubah:** `src/utils/filter.js`, `src/components/filterBar.js`, `src/components/chip.js`, `src/components/emptyState.js`, `src/pages/home.js`.

### T2.3 — Sorting hasil
- [ ] Opsi: Relevansi, Nama A–Z, Nama Z–A, Populer dulu.
- [ ] Relevansi: unggulan lebih dulu lalu alfabetis.
- [ ] Nama A–Z menghasilkan urutan persis seperti AC-10.
- [ ] Populer dulu menaruh 5 Populer sebelum 3 Hidden Gem (AC-11).
- [ ] Toggle unggulan dari dashboard memengaruhi urutan Relevansi (AC-19).

**Berkas yang mungkin berubah:** `src/utils/sort.js`, `src/components/filterBar.js`, `src/pages/home.js`.

### T2.4 — Sinkronisasi state ke URL
- [ ] Parameter `q`, `wilayah`, `status`, `sort`, dan `halaman` tercermin di URL (AC-21).
- [ ] Membuka URL di tab baru menghasilkan daftar yang sama.
- [ ] Tombol browser Back/Forward mengembalikan filter sebelumnya.
- [ ] Preferensi terakhir tersimpan di `oasisbahari.ui.v1` (atau nama final sesuai T0.1).

**Berkas yang mungkin berubah:** `src/utils/url.js`, `src/main.js`, `src/components/filterBar.js`, `src/storage/localStorage.js`.

---

## M3 — Detail Modal & Wishlist / About Us

**Tujuan:** pengunjung membaca detail lengkap, menyimpan destinasi, dan memahami konteks data.

### T3.1 — Modal detail destinasi
- [ ] Modal menampilkan seluruh field model destinasi termasuk koordinat dan status unggulan (AC-03).
- [ ] Blok `Tips dari warga lokal` memakai background biru muda dan border tosca (UI-10).
- [ ] Desktop: dialog centered maks 720 px; mobile: bottom sheet dengan tombol Tutup.
- [ ] Escape menutup modal dan fokus kembali ke kartu pemicu.
- [ ] Tab tidak keluar dari modal saat modal terbuka.

**Berkas yang mungkin berubah:** `src/components/modal.js`, `src/pages/detail.js`, `src/pages/home.js`, `src/styles/components.css`.

### T3.2 — Interactive packing checklist di modal
- [ ] Checklist bawaan tampil sebagai checkbox.
- [ ] Pengunjung dapat menambah item kustom dan menghapusnya.
- [ ] Input kosong menampilkan error inline.
- [ ] Tombol `Reset checklist` mengembalikan ke `checklistBawaan`.
- [ ] Centang dan item kustom bertahan setelah refresh (AC-15, diselesaikan penuh di M5).

**Berkas yang mungkin berubah:** `src/components/checklist.js`, `src/components/modal.js`, `src/utils/validate.js`.

### T3.3 — Wishlist dan badge
- [ ] Tombol Simpan/Hapus tersedia di kartu dan modal (AC-14).
- [ ] Badge navbar mengikuti jumlah wishlist.
- [ ] Halaman wishlist menampilkan grid kartu dan pesan `Disimpan di perangkat ini — tidak memerlukan akun.` (UI-11).
- [ ] Wishlist kosong menampilkan empty state + CTA `Jelajahi destinasi`.
- [ ] Entri wishlist untuk destinasi yang dihapus tidak ditampilkan.

**Berkas yang mungkin berubah:** `src/components/wishlistButton.js`, `src/components/navbar.js`, `src/pages/wishlist.js`, `src/storage/localStorage.js`.

### T3.4 — Halaman About Us
- [ ] Menampilkan empat kartu: Tujuan, Data contoh, Cara pakai, Teknologi (UI-12).
- [ ] Disclaimer verifikasi lapangan berada dalam blok `#E4F3F6`, bukan footer kecil (AC-22).
- [ ] Tidak memuat data pribadi pengembang.

**Berkas yang mungkin berubah:** `src/pages/about.js`, `src/styles/components.css`.

---

## M4 — CRUD Dashboard

**Tujuan:** pengelola demo mengelola data dan melihat ringkasan tanpa login.

### T4.1 — Layout dashboard dan ringkasan
- [ ] Dashboard langsung dibuka tanpa login (AC-25).
- [ ] Desktop: sidebar 240 px + konten; mobile: tab horizontal, bukan tabel melebar (UI-13).
- [ ] Tiga kartu ringkasan: Total, Hidden Gem, Populer (AC-02).
- [ ] Angka ringkasan dihitung ulang setelah CRUD.

**Berkas yang mungkin berubah:** `src/pages/dashboard.js`, `src/styles/layout.css`, `src/styles/components.css`.

### T4.2 — Daftar destinasi dan toggle unggulan
- [ ] Desktop memakai tabel: Nama, Wilayah, Status, Level, Unggulan, Aksi.
- [ ] Mobile memakai kartu satu kolom dengan tombol Edit, Hapus, dan toggle Unggulan.
- [ ] Toggle unggulan langsung memengaruhi sorting Relevansi (AC-19).

**Berkas yang mungkin berubah:** `src/pages/dashboard.js`, `src/components/destinationRow.js`, `src/components/destinationCard.js`.

### T4.3 — Form tambah dan edit
- [ ] Form mencakup ke-16 field model destinasi, dikelompokkan sesuai UI-SPEC 5.9.
- [ ] `id` dibuat otomatis dan unik saat tambah; tidak berubah saat edit.
- [ ] Validasi: panjang teks, enum, rentang koordinat, minimal 1 checklist item, `imageUrl` lokal (AC-16).
- [ ] Error tampil inline di bawah field dan tidak menyimpan data jika gagal.
- [ ] Teks dengan tag HTML pada `nama` dirender sebagai teks biasa (AC-26).

**Berkas yang mungkin berubah:** `src/components/destinationForm.js`, `src/utils/validate.js`, `src/utils/render.js`, `src/pages/dashboard.js`.

### T4.4 — Konfirmasi hapus dan reset
- [ ] Hapus memunculkan dialog konfirmasi dengan Batal dan Hapus (AC-18).
- [ ] Batal membiarkan Total tetap 8; konfirmasi menurunkan menjadi 7.
- [ ] Reset ke data contoh memunculkan konfirmasi dan mengembalikan Total 8, wishlist kosong, checklist kosong (AC-20).
- [ ] Ringkasan tidak berubah saat konfirmasi dibatalkan.

**Berkas yang mungkin berubah:** `src/components/confirmDialog.js`, `src/pages/dashboard.js`, `src/storage/localStorage.js`.

---

## M5 — localStorage

**Tujuan:** seluruh data demo dan preferensi persisten di satu perangkat.

### T5.1 — Modul penyimpanan versi
- [ ] Empat key tersedia: destinations, wishlist, checklist, ui (dengan suffix versi).
- [ ] Helper baca/tulis menangani error saat `localStorage` penuh atau diblokir (NFR-6).
- [ ] Tidak ada data yang dikirim ke server.
- [ ] Format data sesuai `SPEC.md` 4.2.

**Berkas yang mungkin berubah:** `src/storage/localStorage.js`.

### T5.2 — Seed dan recovery
- [ ] Saat key destinations tidak ada, aplikasi mengisi 8 data contoh otomatis.
- [ ] Menghapus salah satu key secara manual lalu refresh tidak membuat aplikasi crash.
- [ ] Tombol Reset memulihkan keadaan awal seluruh key.
- [ ] Versi key memungkinkan migrasi tanpa menimpa data lama diam-diam.

**Berkas yang mungkin berubah:** `src/storage/localStorage.js`, `src/data/seed.js`, `src/pages/dashboard.js`.

### T5.3 — Persist wishlist, checklist, dan preferensi UI
- [ ] Wishlist bertahan setelah refresh (AC-14).
- [ ] Checklist per destinasi bertahan setelah refresh (AC-15).
- [ ] Preferensi pencarian/filter/sorting bertahan dan sinkron dengan URL (AC-21).
- [ ] Badge navbar membaca dari storage saat aplikasi dimuat.

**Berkas yang mungkin berubah:** `src/storage/localStorage.js`, `src/components/navbar.js`, `src/components/checklist.js`, `src/pages/wishlist.js`, `src/utils/url.js`.

### T5.4 — Persist hasil CRUD
- [ ] Tambah, edit, hapus, dan toggle unggulan tersimpan di storage.
- [ ] Perubahan muncul di katalog, peta, filter, dan ringkasan setelah refresh/navigasi.
- [ ] Wishlist yang merujuk ke destinasi terhapus dibersihkan atau diabaikan.
- [ ] Tidak ada duplikat `id`.

**Berkas yang mungkin berubah:** `src/storage/localStorage.js`, `src/pages/dashboard.js`, `src/main.js`, `src/utils/filter.js`.

---

## M6 — Testing

**Tujuan:** seluruh kriteria dapat dibuktikan secara manual.

### T6.1 — Uji AC fungsional
- [ ] AC-01 sampai AC-26 dicentang beserta bukti/catatan singkat.
- [ ] Kasus gagal dicatat dengan langkah reproduksi.
- [ ] Tidak ada AC yang ditandai lolos tanpa pemeriksaan manual.

**Berkas yang mungkin berubah:** `QA.md`, `TASKS.md`.

### T6.2 — Uji checklist UI
- [ ] UI-01 sampai UI-15 diperiksa pada desktop dan mobile.
- [ ] Kontras diverifikasi dengan pasangan warna di `UI-SPEC.md` 3.1.
- [ ] Grid 3/2/1 kolom dan modal desktop/mobile sesuai wireframe.

**Berkas yang mungkin berubah:** `QA.md`, `UI-SPEC.md` (jika ditemukan ketidaksesuaian desain).

### T6.3 — Uji lintas browser, responsif, dan keyboard
- [ ] Berjalan di dua browser terbaru pada 1280 px dan 375 px.
- [ ] Tidak ada scroll horizontal di 375 px (AC-23, UI-04).
- [ ] Tab mencapai pencarian, filter, tombol Simpan, dan tautan detail; fokus terlihat.
- [ ] Console tidak menampilkan error merah (AC-24).

**Berkas yang mungkin berubah:** `QA.md`.

### T6.4 — Triage bug dan regresi
- [ ] Setiap bug memiliki ID, prioritas, status, dan langkah reproduksi.
- [ ] Perbaikan diuji ulang terhadap AC terkait.
- [ ] Alur beranda → detail → wishlist → dashboard → CRUD dijalankan ulang tanpa regresi.

**Berkas yang mungkin berubah:** `QA.md`, `TASKS.md`, berkas sumber terkait perbaikan.

---

## M7 — Security

**Tujuan:** tidak ada kebocoran kredensial, render tidak aman, atau ketergantungan berbahaya.

### T7.1 — Tidak ada rahasia dan panggilan eksternal
- [ ] Tidak ada string `apikey`, `token`, `secret`, atau kredensial lain di sumber.
- [ ] Tidak ada file `.env` yang diperlukan aplikasi.
- [ ] Network hanya menampilkan request ke tile OpenStreetMap (AC-24).
- [ ] Tidak ada API berbayar atau layanan pihak ketiga.

**Berkas yang mungkin berubah:** seluruh berkas sumber, `README.md`, `.gitignore`.

### T7.2 — Render aman
- [ ] Semua nilai dari form dan storage dirender sebagai teks, bukan HTML.
- [ ] AC-26 lolos dengan teks mengandung tag HTML di field `nama`.
- [ ] Tidak ada penggunaan `innerHTML` untuk konten yang berasal dari input pengguna.

**Berkas yang mungkin berubah:** `src/utils/render.js`, `src/components/destinationCard.js`, `src/components/modal.js`, `src/pages/dashboard.js`.

### T7.3 — Validasi input dan batas data
- [ ] Enum wilayah, jenis objek, status, dan level divalidasi.
- [ ] Koordinat dibatasi -90…90 / -180…180 dan rentang data contoh -11…6 / 95…141.
- [ ] `imageUrl` hanya path lokal; URL eksternal ditolak.
- [ ] Tidak ada field yang meminta data pribadi.

**Berkas yang mungkin berubah:** `src/utils/validate.js`, `src/components/destinationForm.js`, `src/data/destinations.js`.

### T7.4 — Atribusi dan disclaimer
- [ ] Atribusi OpenStreetMap tetap terlihat di peta dan hasil build.
- [ ] About Us memuat disclaimer bahwa data contoh wajib diverifikasi lapangan.
- [ ] Tidak ada klaim “paling”, “terbaik”, atau jadwal pasti yang menyesatkan.

**Berkas yang mungkin berubah:** `src/components/map.js`, `src/pages/about.js`, `src/data/destinations.js`.

---

## M8 — Build

**Tujuan:** aplikasi siap dikompilasi sebagai aset statis.

### T8.1 — Build produksi berhasil
- [ ] Perintah build Vite selesai tanpa error.
- [ ] Console saat build tidak menampilkan warning krusial.
- [ ] Dependensi produksi hanya Vite, Leaflet, dan aset lokal.

**Berkas yang mungkin berubah:** `package.json`, `vite.config.js`, `dist/`.

### T8.2 — Aset dan path pada build
- [ ] Seluruh SVG tersalin ke folder aset build.
- [ ] `/images/placeholder.svg` tetap tersedia di build.
- [ ] Path gambar relatif tetap benar saat dibuka dari hasil build.
- [ ] Tidak ada URL absolut yang mengarah ke mesin lokal.

**Berkas yang mungkin berubah:** `vite.config.js`, `public/images/*.svg`, `dist/`.

### T8.3 — Smoke test hasil build
- [ ] Hasil build dibuka melalui static server lokal.
- [ ] AC-01, AC-12, AC-14, dan AC-22 lolos di hasil build.
- [ ] Console bersih dan Network hanya berisi tile OSM.

**Berkas yang mungkin berubah:** `dist/`, `QA.md`.

### T8.4 — Dokumentasi build
- [ ] README memuat cara menjalankan dev server dan build.
- [ ] README menyebut bahwa tidak ada API key yang diperlukan.
- [ ] README menjelaskan cara mereset data lokal.

**Berkas yang mungkin berubah:** `README.md`.

---

## M9 — Deployment

**Tujuan:** versi statis dapat diakses dan diverifikasi di target akhir.

### T9.1 — Tentukan target deploy
- [ ] Target berupa hosting statis atau folder statis lokal; tidak ada backend.
- [ ] Konfigurasi fallback routing disiapkan agar refresh halaman tidak 404.
- [ ] Nama domain/path mengikuti keputusan T0.1.

**Berkas yang mungkin berubah:** `vite.config.js`, `public/_redirects`, konfigurasi host, `README.md`.

### T9.2 — Publikasi dan uji akhir
- [ ] URL hasil deploy dapat dibuka di browser.
- [ ] Refresh pada rute wishlist/about/dashboard tidak menampilkan 404.
- [ ] Peta menampilkan atribusi OSM di produksi.
- [ ] Wishlist dan checklist masih persisten di browser produksi.
- [ ] Console produksi tidak menampilkan error.

**Berkas yang mungkin berubah:** `dist/`, `QA.md`, konfigurasi host.

### T9.3 — Rollback dan pemulihan data
- [ ] Versi sebelumnya dapat dipulihkan dengan mengganti isi folder deploy.
- [ ] Prosedur reset ke 8 data contoh didokumentasikan.
- [ ] Pengguna diberi tahu bahwa reset menghapus wishlist dan checklist lokal.

**Berkas yang mungkin berubah:** `README.md`, `QA.md`, `TASKS.md`.

### T9.4 — Monitoring ringan pasca-deploy
- [ ] Satu putaran smoke test produksi dilakukan setelah publish.
- [ ] Tidak ada request ke API eksternal selain tile OSM.
- [ ] Temuan pasca-deploy dicatat dan ditutup atau dijadikan backlog.

**Berkas yang mungkin berubah:** `QA.md`, `TASKS.md`.

---

## Definition of Done Global

Sebuah milestone selesai jika:

- [ ] Semua acceptance criteria di dalamnya dicentang.
- [ ] AC dan UI-ID terkait tercantum di `QA.md` dengan hasil manual.
- [ ] Tidak ada error merah di Console.
- [ ] Tidak ada API key, token, atau data pribadi.
- [ ] Perubahan tidak merusak milestone sebelumnya.
- [ ] `TASKS.md` diperbarui dengan status terakhir.

---

## Backlog Sementara (di luar MVP)

- PWA/service worker untuk offline penuh.
- Unit test otomatis dan CI.
- Upload gambar sungguhan.
- Sinkron wishlist lintas perangkat.
- Integrasi cuaca/pasang surut.
- Login dan role admin.
- Internasionalisasi Bahasa Inggris.

Semua item di atas **tidak dikerjakan** dalam latihan 1 hari tanpa persetujuan perubahan ruang lingkup di `SPEC.md`.
