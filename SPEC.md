# SPEC — OasisBahari

| Field | Nilai |
|---|---|
| Nama aplikasi | OasisBahari |
| Versi dokumen | 1.0 |
| Status | Draft untuk latihan 1 hari |
| Peran penulis | System Analyst + Software Engineer |
| Tech stack | Vite + JavaScript vanilla + Leaflet.js + OpenStreetMap |
| Backend | Tidak ada |
| Autentikasi | Tidak ada, termasuk tidak ada login palsu |
| Penyimpanan | `localStorage` pada satu perangkat |
| Bahasa antarmuka | Bahasa Indonesia |

Dokumen ini hanya berisi spesifikasi. Kode aplikasi belum ditulis dan baru dibuat setelah spesifikasi ini disetujui.

---

## 1. Tujuan

1. Menyediakan katalog web **direktori wisata laut dan hidden gems Nusantara** yang bisa dipelajari dan dimodifikasi dalam latihan 1 hari.
2. Mendemonstrasikan alur lengkap aplikasi statis: katalog, pencarian, filter, sorting, peta interaktif, detail destinasi, wishlist, checklist, About Us, dan CRUD demo.
3. Melatih keputusan analisis dan rekayasa: membatasi ruang lingkup, mendefinisikan model data, kriteria penerimaan manual, serta mitigasi risiko tanpa server.
4. Menjaga informasi tetap aman untuk latihan: data contoh nonpribadi, koordinat wajar, tanpa API key, dan tanpa ketergantungan pada layanan berbayar.

**Hasil akhir yang diharapkan:** aplikasi statis yang berjalan di browser, dapat diverifikasi manual dalam satu hari, dan memberikan pengalaman yang sama untuk pengunjung maupun pengelola konten demo pada perangkat yang sama.

---

## 2. Pengguna

| Pengguna | Kebutuhan utama | Tindakan di aplikasi | Batasan |
|---|---|---|---|
| Calon wisatawan / pengunjung | Menemukan destinasi laut yang sesuai dengan wilayah, status, dan tingkat keahliannya | Melihat katalog, mencari, memfilter, mengurutkan, membuka detail, melihat peta, menyimpan wishlist, mencentang packing checklist, membaca About Us | Wishlist dan checklist hanya tersimpan di perangkat yang dipakai |
| Pengelola konten demo | Mengelola data destinasi contoh dan melihat ringkasan | Membuka dashboard, melihat ringkasan, menambah/edit/hapus destinasi, mengatur status unggulan, mereset data contoh | Tidak ada login, tidak ada role, tidak ada audit trail |

**Asumsi penggunaan:** satu perangkat, satu browser, satu sesi latihan. Tidak ada sinkronisasi antarperangkat.

---

## 3. Daftar Fitur MVP

### F1. Katalog 8 destinasi contoh
- Menampilkan tepat 8 destinasi saat aplikasi dibuka pertama kali.
- Perkiraan komposisi: 5 berstatus **Populer** dan 3 berstatus **Hidden Gem**.
- Setiap kartu menampilkan foto atau placeholder lokal, nama, wilayah pulau, provinsi, jenis objek laut, status popularitas, level keahlian, dan tombol simpan wishlist.
- Kartu dapat diklik untuk membuka halaman detail.

### F2. Halaman detail destinasi
- Menampilkan seluruh field model destinasi.
- Menampilkan koordinat dalam format teks yang mudah dibaca.
- Menyediakan tombol simpan/hapus wishlist dan interactive packing checklist.
- Menyediakan tautan kembali ke katalog.

### F3. Pencarian
- Input teks bebas untuk nama, deskripsi, wilayah, provinsi, dan catatan lokal.
- Spasi di awal/akhir diabaikan dan pencarian tidak membedakan huruf besar/kecil.
- Minimum 2 karakter; di bawah itu tampilkan seluruh data disertai petunjuk, bukan error.
- Beberapa kata digabung dengan logika **AND**.
- Query kosong menampilkan seluruh data.

### F4. Filter wilayah dan status
- Filter wilayah memakai nilai `wilayahPulau`: Sulawesi, Papua, Sumatera, Jawa, Nusa Tenggara.
- Filter status memakai nilai `statusPopularitas`: Semua, Populer, Hidden Gem.
- Keduanya dapat dikombinasikan dengan pencarian dan sorting.
- Filter tanpa hasil menampilkan empty state dan tombol reset filter, bukan halaman kosong.

### F5. Sorting
- Opsi: **Relevansi** (default), **Nama A–Z**, **Nama Z–A**, **Populer dulu**.
- Relevansi diartikan: destinasi `unggulan` lebih dulu, kemudian urutan alfabetis nama.
- Sort "Populer dulu" menempatkan status Populer sebelum Hidden Gem, lalu alfabetis di dalam grupnya.

### F6. Peta sebaran interaktif
- Menggunakan Leaflet.js dengan tile OpenStreetMap.
- Satu marker per destinasi yang sedang lolos pencarian/filter.
- Popup marker berisi nama, status, wilayah, dan tautan ke detail.
- Atribusi OpenStreetMap tetap terlihat.
- Jika tidak ada hasil, peta tetap tampil dengan pesan "Tidak ada marker untuk filter ini".
- Jika tile gagal dimuat, daftar dan fitur lain tetap berfungsi.

### F7. Wishlist pribadi
- Tombol **Simpan**/**Hapus dari wishlist** tersedia di kartu dan halaman detail.
- Badge jumlah item wishlist terlihat di navigasi.
- Halaman wishlist menampilkan destinasi yang disimpan.
- Data disimpan di `localStorage` dan bertahan setelah refresh.
- Jika destinasi dihapus dari katalog, entri wishlist yang rusak tidak ditampilkan.

### F8. Interactive packing checklist
- Checklist bawaan berasal dari `checklistBawaan` destinasi.
- Pengunjung dapat mencentang/menghapus centang tiap item.
- Pengunjung dapat menambah item kustom dan menghapusnya.
- State checklist per destinasi disimpan di `localStorage`.
- Tersedia tombol **Reset checklist** untuk destinasi yang sedang dibuka.

### F9. About Us
- Menjelaskan tujuan latihan, cakupan data contoh, dan teknologi yang dipakai.
- Memuat disclaimer bahwa koordinat, info akses, dan catatan lokal adalah contoh dan wajib diverifikasi lapangan sebelum dipakai nyata.
- Tidak memuat data pribadi pengembang.

### F10. Dashboard demo CRUD
- Tabel seluruh destinasi dengan kolom nama, wilayah, status, level, unggulan, dan aksi.
- Ringkasan: **Total destinasi**, **Hidden Gem**, **Populer**.
- Form tambah dan edit untuk seluruh field model destinasi.
- Hapus dengan dialog konfirmasi; tombol Batal membatalkan penghapusan.
- Toggle status `unggulan`.
- Tombol **Reset ke data contoh** dengan konfirmasi.
- Setiap perubahan langsung memengaruhi katalog, peta, filter, dan ringkasan setelah refresh/navigasi.

### F11. Empty state dan feedback
- Empty state untuk pencarian/filter, wishlist kosong, dan marker kosong.
- Pesan validasi yang jelas untuk field wajib dan koordinat di form CRUD.
- Pesan jika penyimpanan `localStorage` gagal, aplikasi tetap bisa dipakai dalam sesi tersebut.

### F12. Penyimpanan lokal dan URL state
- Seluruh data demo dan preferensi pengguna disimpan di `localStorage`.
- Parameter pencarian, filter, sorting, dan halaman tercermin di URL agar hasil dapat dibagikan dibuka ulang di tab baru.

---

## 4. Data Model

### 4.1 Entitas `Destinasi`

| Field | Tipe | Wajib | Aturan | Contoh |
|---|---|---:|---|---|
| `id` | string | Ya | Unik, stabil, tidak berubah saat edit. Format `dst-###`. Dibuat otomatis saat tambah. | `dst-001` |
| `nama` | string | Ya | 3–80 karakter, tidak kosong setelah trim. | `Bunaken` |
| `wilayahPulau` | enum | Ya | Salah satu: `Sulawesi`, `Papua`, `Sumatera`, `Jawa`, `Nusa Tenggara`. | `Sulawesi` |
| `provinsi` | string | Ya | 2–60 karakter. | `Sulawesi Utara` |
| `jenisObjek` | enum | Ya | Salah satu: `Taman Laut`, `Pulau`, `Spot Diving`, `Spot Snorkeling`, `Pantai`, `Teluk`. | `Taman Laut` |
| `statusPopularitas` | enum | Ya | `Populer` atau `Hidden Gem`. | `Populer` |
| `levelKeahlian` | enum | Ya | `Pemula`, `Menengah`, atau `Mahir`. | `Menengah` |
| `deskripsi` | string | Ya | 20–300 karakter. | `Taman laut dengan dinding karang...` |
| `infoAkses` | string | Ya | 10–200 karakter, ringkas dan tidak menjanjikan jadwal pasti. | `Perahu dari Manado ±20 menit...` |
| `waktuTerbaik` | string | Ya | 3–120 karakter, boleh berupa rentang bulan. | `Maret–Mei dan September–November` |
| `catatanLokal` | string | Ya | 10–200 karakter, berupa saran kehati-hatian, bukan data pribadi. | `Tanya kapten titik arus sebelum turun.` |
| `checklistBawaan` | array of string | Ya | Minimal 1 item; tiap item 3–60 karakter; unik per destinasi. | `["Masker snorkel", "Life jacket"]` |
| `latitude` | number | Ya | -90 sampai 90; untuk data contoh dibatasi -11 sampai 6. | `1.6240` |
| `longitude` | number | Ya | -180 sampai 180; untuk data contoh dibatasi 95 sampai 141. | `124.7590` |
| `imageUrl` | string | Ya | Path lokal, contoh `/images/bunaken.svg`. Dilarang URL eksternal. Jika berkas tidak ada, pakai `/images/placeholder.svg`. | `/images/bunaken.svg` |
| `unggulan` | boolean | Ya | Menentukan prioritas pada sorting Relevansi. | `true` |

### 4.2 Entitas pendukung di `localStorage`

| Key | Bentuk | Tujuan |
|---|---|---|
| `oasisbahari.destinations.v1` | Array of `Destinasi` | Menyimpan hasil CRUD demo. Saat pertama kali diisi dari 8 data contoh. |
| `oasisbahari.wishlist.v1` | Array of `{ destinationId, addedAt }` | Daftar destinasi yang disimpan pengguna. |
| `oasisbahari.checklist.v1` | Array of `{ destinationId, checkedItems, customItems }` | State centang dan item kustom per destinasi. |
| `oasisbahari.ui.v1` | Object `{ q, wilayah, status, sort }` | Preferensi tampilan terakhir; tetap sinkron dengan URL. |

Semua key diberi suffix versi agar migrasi masa depan tidak menimpa data lama secara diam-diam.

### 4.3 Data contoh — field identitas dan peta

| id | nama | wilayahPulau | provinsi | jenisObjek | status | level | unggulan | latitude | longitude | imageUrl |
|---|---|---|---|---|---|---|---:|---:|---:|---|
| `dst-001` | Bunaken | Sulawesi | Sulawesi Utara | Taman Laut | Populer | Menengah | Ya | 1.6240 | 124.7590 | `/images/bunaken.svg` |
| `dst-002` | Raja Ampat – Wayag | Papua | Papua Barat Daya | Pulau | Populer | Mahir | Ya | -0.5667 | 130.7333 | `/images/wayag.svg` |
| `dst-003` | Wakatobi | Sulawesi | Sulawesi Tenggara | Spot Diving | Populer | Menengah | Tidak | -5.7333 | 123.9500 | `/images/wakatobi.svg` |
| `dst-004` | Pulau Bira | Sulawesi | Sulawesi Selatan | Pantai | Populer | Pemula | Tidak | -5.6333 | 120.4667 | `/images/bira.svg` |
| `dst-005` | Pulau Tidung | Jawa | DKI Jakarta | Pulau | Populer | Pemula | Tidak | -6.4058 | 106.5525 | `/images/tidung.svg` |
| `dst-006` | Iboih, Pulau Weh | Sumatera | Aceh | Spot Snorkeling | Hidden Gem | Pemula | Tidak | 5.8940 | 95.3180 | `/images/iboih.svg` |
| `dst-007` | Moyo, Sumbawa | Nusa Tenggara | Nusa Tenggara Barat | Pulau | Hidden Gem | Menengah | Tidak | -8.6000 | 116.9000 | `/images/moyo.svg` |
| `dst-008` | Teluk Penyu, Cilacap | Jawa | Jawa Tengah | Teluk | Hidden Gem | Pemula | Tidak | -7.7000 | 109.0500 | `/images/teluk-penyu.svg` |

Berkas fisik gambar disimpan di folder `public/images/`. Nilai `imageUrl` adalah path runtime yang dipakai aplikasi.

### 4.4 Data contoh — field naratif dan checklist

| id | deskripsi | infoAkses | waktuTerbaik | catatanLokal | checklistBawaan |
|---|---|---|---|---|---|
| `dst-001` | Taman laut dengan dinding karang dan keanekaragaman ikan; cocok untuk diving dan snorkeling. | Perahu dari Manado ±20 menit; gunakan kapal wisata resmi. | Maret–Mei dan September–November | Tanya kapten titik arus sebelum turun; hindari menyentuh karang. | Masker snorkel; Life jacket; Sunscreen ramah laut; Kamera anti air; Air minum |
| `dst-002` | Deretan karang dan laguna biru di ujung utara Raja Ampat dengan arus lebih kuat. | Pesawat ke Sorong, lalu kapal liveaboard/perahu ke Wayag; cuaca menentukan jadwal. | April–Juni dan September–November | Wajib life jacket dan panduan lokal; patuhi batas konservasi. | Life jacket; Snorkel; Topi; Air minum 2 L; Kamera dengan tali; Sunscreen ramah laut |
| `dst-003` | Gugus pulau dengan terumbu karang luas dan spot diving yang relatif tenang. | Penerbangan ke Bau-Bau/Wangi-Wangi, lalu perahu. | April–Juni | Beberapa titik hanya bisa saat air pasang; konfirmasi ke operator. | Masker; BCD; Regulator; Dry bag; Air minum |
| `dst-004` | Pantai pasir putih di ujung selatan Sulawesi dengan snorkeling dekat pantai. | Dari Makassar ±3,5 jam lewat jalan darat. | April–Oktober | Air dangkal di dekat dermaga; sewa perahu hanya dari nelayan setempat. | Masker; Handuk; Sunscreen; Air minum; Sandal |
| `dst-005` | Pulau kecil dengan jembatan panjang, cocok untuk snorkeling pemula dan sunset. | Kapal cepat dari Marina Ancol atau Pelabuhan Kaliadem. | April–September | Jadwal kapal bisa berubah saat cuaca buruk; cek sebelum berangkat. | Masker; Life jacket; Topi; Air minum; Power bank |
| `dst-006` | Teluk dengan air jernih dan karang dangkal di Pulau Weh, lebih tenang daripada spot utama Sabang. | Pesawat ke Sabang, lalu mobil/ojek ke Iboih ±30 menit. | November–Maret | Arus bisa berubah siang hari; tanya penjaga homestay untuk titik aman. | Masker; Snorkel; Sunscreen ramah laut; Handuk; Air minum |
| `dst-007` | Pulau dengan pantai bersih dan snorkeling di sekitar teluk; masih jarang dikunjungi. | Feri ke Sumbawa Besar, lalu perjalanan darat dan perahu ke Moyo. | Mei–September | Belum banyak fasilitas; bawa air minum dan kantong sampah sendiri. | Air minum; Masker; Kantong sampah; Topi; Obat nyamuk |
| `dst-008` | Pantai teluk di pesisir selatan Jawa dengan pasir hitam dan spot nelayan lokal. | Dari Cilacap kota ±15 menit dengan mobil. | April–September | Arus pantai selatan kuat; jangan berenang jauh tanpa izin nelayan. | Sepatu pantai; Topi; Air minum; Sunscreen; Kantong sampah |

Semua nama, catatan, dan koordinat di atas adalah **data contoh nonpribadi** dan bukan sumber otoritatif untuk perjalanan nyata.

---

## 5. Nonfunctional Requirements — Persyaratan Nonfungsional

| ID | Kategori | Requirement | Cara verifikasi manual |
|---|---|---|---|
| NFR-1 | Performa | Dengan 8 destinasi, katalog dan peta tampil dalam waktu wajar di browser lokal; pencarian/filter/sorting tidak memuat ulang halaman. | Hentikan waktu dengan stopwatch saat membuka beranda dan saat mengetik query; perubahan terasa langsung. |
| NFR-2 | Kompatibilitas | Berjalan di versi terbaru Chrome/Edge/Firefox, desktop 1280 px dan mobile 375 px. | Buka di dua browser dan dua lebar layar; tidak ada tata letak rusak. |
| NFR-3 | Keamanan data | Tidak ada API key, token, atau kredensial di kode/sumber. Tidak ada data pribadi. | Periksa Source tab DevTools dan hasil pencarian teks untuk kata `apikey`, `token`, `secret`. |
| NFR-4 | Keamanan render | Input pengguna dari form CRUD dirender sebagai teks, bukan HTML yang dieksekusi. | Masukkan teks yang mengandung tag HTML pada field nama; tag tampil apa adanya. |
| NFR-5 | Ketergantungan jaringan | Halaman, katalog, wishlist, dan checklist tetap bisa dipakai tanpa internet. Peta hanya memerlukan internet untuk tile OSM. | Putus koneksi setelah halaman dimuat; fitur non-peta masih berfungsi dan peta menampilkan pesan fallback. |
| NFR-6 | Penyimpanan | `localStorage` dipakai dengan key versi dan ditangani dengan aman saat penuh atau diblokir. | Hapus satu key secara manual lalu refresh; aplikasi kembali ke data contoh tanpa crash. |
| NFR-7 | Aksesibilitas | Tombol, input, dan marker dapat dicapai dengan keyboard; fokus terlihat; gambar memiliki `alt`. | Tekan Tab berurutan dari header hingga kartu; perhatikan outline fokus dan alt saat gambar gagal dimuat. |
| NFR-8 | Kualitatif | Tidak ada error merah di Console selama alur utama: beranda → detail → wishlist → dashboard → CRUD. | Buka DevTools Console dan jalankan alur tersebut. |
| NFR-9 | Maintainability | Kode dipisah per tanggung jawab: data contoh, komponen UI, halaman, storage, utilitas. | Tinjau struktur folder sebelum implementasi; tidak ada satu file besar yang mencampur semua logika. |
| NFR-10 | Timebox | Selesai dalam satu hari kerja dengan buffer minimal 45 menit untuk QA manual. | Cocokkan progres terhadap rencana iterasi di bagian 9. |

---

## 6. Risiko

| Risiko | Dampak | Mitigasi | Indikator berhasil dimitigasi |
|---|---|---|---|
| Koordinat contoh tidak persis di lapangan | Marker salah arah dan menyesatkan | Pakai koordinat wajar, tampilkan disclaimer, sertakan info akses sebagai teks, bukan janji navigasi | AC-03 dan AC-22 lolos; label disclaimer terlihat |
| Deskripsi/akses hasil AI tidak akurat | Pengguna mengira data terverifikasi | Tandai sebagai data contoh; hindari klaim "paling", "terbaik", atau jadwal pasti | AC-22 lolos |
| Tile OpenStreetMap gagal dimuat | Peta terlihat kosong | Fallback pesan; daftar tetap dipakai; atribusi tetap ditampilkan | NFR-5 lolos |
| `localStorage` dihapus/penuh | Wishlist dan checklist hilang | Try/catch, pesan ramah, reset ke data contoh saat key tidak ada | NFR-6 lolos |
| Input CRUD memasukkan tag HTML | Render tidak aman | Selalu render sebagai teks; validasi panjang dan tipe | NFR-4 dan AC-26 lolos |
| Filter + sorting + pencarian bertabrakan | Hasil membingungkan | Aturan prioritas ditetapkan di F3–F5 dan diuji kombinasinya | AC-04–AC-11 lolos |
| Scope melebar melebihi 1 hari | MVP tidak selesai | Ikut iterasi dan out-of-scope; fitur baru masuk backlog | NFR-10 lolos |
| Anggapan wishlist sinkron antarperangkat | Salah ekspektasi | Teks UI menyebut "disimpan di perangkat ini"; tidak ada indikator akun | AC-09 dan AC-25 lolos |
| Duplikat `id` saat tambah data | Marker dan wishlist bertabrakan | Id dibuat otomatis dan divalidasi unik sebelum simpan | AC-11 lolos |

---

## 7. Out of Scope

1. Backend, REST API, database server, dan hosting produksi.
2. Login, registrasi, reset password, atau login palsu untuk dashboard.
3. Sinkronisasi wishlist/checklist antarperangkat atau akun.
4. Sistem booking, pembayaran, ulasan pengguna, atau pemesanan kapal.
5. Upload foto sungguhan; hanya path lokal dan placeholder lokal.
6. Navigasi turn-by-turn, GPX, cuaca real-time, pasang-surut real-time, atau API pihak ketiga berbayar.
7. Penyimpanan API key atau konfigurasi rahasia apa pun.
8. Internasionalisasi/multi-bahasa; Bahasa Indonesia saja.
9. Service worker/PWA offline penuh; offline hanya berlaku untuk aset lokal yang sudah dimuat.
10. Role-based access control, audit log, dan notifikasi email.
11. Unit test otomatis dan CI/CD; pengujian latihan ini dilakukan manual sesuai bagian 8.
12. Data pribadi pengembang, pengunjung, atau warga lokal.

---

## 8. Acceptance Criteria — Pemeriksaan Manual

Setiap kriteria dapat dicek tanpa menulis kode tambahan.

| ID | Kriteria | Cara cek manual |
|---|---|---|
| AC-01 | Saat beranda dibuka pertama kali, tampil tepat 8 kartu destinasi. | Hitung kartu; cocokkan nama dengan tabel di 4.3. |
| AC-02 | Dashboard menampilkan ringkasan: Total 8, Hidden Gem 3, Populer 5. | Buka dashboard dan baca tiga angka tersebut. |
| AC-03 | Klik kartu Bunaken membuka detail yang memuat nama, wilayah, provinsi, jenis objek, status, level, deskripsi, akses, waktu terbaik, catatan lokal, checklist, koordinat, gambar, dan status unggulan. | Buka detail dan centang field satu per satu. |
| AC-04 | Query `bunaken`, `  BUNAKEN  `, dan `bunaken ` menghasilkan 1 kartu yang sama. | Ketik ketiga variasi di kolom pencarian. |
| AC-05 | Query `raja ampat` menampilkan `Raja Ampat – Wayag`; query `xyz` menampilkan empty state + tombol reset. | Coba kedua query. |
| AC-06 | Query satu karakter, misalnya `b`, menampilkan seluruh 8 destinasi dan petunjuk minimum 2 karakter, tanpa error. | Ketik satu huruf lalu amati pesan. |
| AC-07 | Filter `Sulawesi` menampilkan 3 destinasi: Bunaken, Wakatobi, Pulau Bira. | Pilih filter wilayah Sulawesi dan hitung hasil. |
| AC-08 | Filter status `Hidden Gem` menampilkan 3 destinasi: Iboih, Moyo, Teluk Penyu. | Pilih filter status Hidden Gem dan hitung hasil. |
| AC-09 | Kombinasi `Sulawesi` + `Hidden Gem` menghasilkan empty state, bukan halaman putih. | Terapkan kedua filter sekaligus. |
| AC-10 | Sorting `Nama A–Z` menghasilkan urutan: Bunaken, Iboih, Moyo, Pulau Bira, Pulau Tidung, Raja Ampat – Wayag, Teluk Penyu, Wakatobi. | Pilih sorting tersebut dan baca urutan kartu. |
| AC-11 | Sorting `Populer dulu` menampilkan 5 Populer lebih dulu, baru 3 Hidden Gem. | Pilih sorting tersebut dan periksa status kartu. |
| AC-12 | Peta menampilkan 8 marker pada kondisi awal; klik satu marker memunculkan popup berisi nama dan tautan detail. | Buka peta, hitung marker, klik marker. |
| AC-13 | Filter `Jawa` menyisakan 2 marker: Pulau Tidung dan Teluk Penyu; atribusi OpenStreetMap tetap terlihat. | Terapkan filter Jawa lalu amati peta dan footer peta. |
| AC-14 | Klik Simpan pada Bunaken menaikkan badge wishlist menjadi 1; setelah refresh, Bunaken tetap ada di halaman wishlist; klik Hapus mengembalikan badge ke 0. | Jalankan urutan tersebut dan refresh di tengah proses. |
| AC-15 | Di detail Bunaken, centang `Masker snorkel`, tambah item `Handuk`, refresh; centang dan item tambahan tetap ada. Klik Reset checklist mengembalikan ke kondisi awal. | Jalankan urutan pada halaman detail Bunaken. |
| AC-16 | Tambah destinasi baru melalui dashboard dengan data valid menaikkan Total menjadi 9; kartu dan marker baru muncul. Mengosongkan field `nama` menampilkan pesan validasi dan tidak menyimpan data. | Isi form valid, lalu coba form dengan nama kosong. |
| AC-17 | Edit Bunaken menjadi `Hidden Gem` mengubah ringkasan menjadi Populer 4 dan Hidden Gem 4; perubahan bertahan setelah refresh. | Edit, simpan, refresh, lalu baca ringkasan. |
| AC-18 | Klik Hapus Wakatobi memunculkan konfirmasi; konfirmasi mengubah Total menjadi 7, tombol Batal membiarkan Total tetap 8. | Uji dua kali: sekali konfirmasi, sekali batal. |
| AC-19 | Toggle unggulan pada Moyo membuatnya muncul sebelum destinasi non-unggulan saat sorting Relevansi. | Ubah unggulan, kembali ke katalog, pilih Relevansi. |
| AC-20 | Tombol Reset ke data contoh mengembalikan Total 8, wishlist kosong, dan checklist kosong setelah konfirmasi. | Klik reset, konfirmasi, lalu cek dashboard, wishlist, dan satu checklist. |
| AC-21 | Setelah mencari/filter, URL memuat parameter seperti `q`, `wilayah`, `status`, dan `sort`; membuka URL tersebut di tab baru menghasilkan daftar yang sama. | Salin URL, buka tab baru, bandingkan hasil. |
| AC-22 | Halaman About Us menampilkan tujuan latihan, teknologi, sumber data contoh, dan disclaimer verifikasi lapangan. | Buka halaman About Us dan baca seluruh bagian. |
| AC-23 | Pada lebar 375 px tidak ada scroll horizontal; Tab dapat mencapai input pencarian, filter, tombol Simpan, dan tautan detail; fokus terlihat. | Kecilkan jendela browser dan jalankan navigasi keyboard. |
| AC-24 | Selama alur beranda → detail → wishlist → dashboard → CRUD, Console tidak menampilkan error merah; tidak ada permintaan ke API eksternal selain tile OpenStreetMap. | Buka DevTools Console dan Network, lalu jalankan alur. |
| AC-25 | Tidak ada halaman atau form login/registrasi; dashboard langsung dapat dibuka sebagai mode demo. | Coba semua menu dan perhatikan tidak ada entri "Login". |
| AC-26 | Teks yang mengandung tag HTML yang dimasukkan pada field `nama` di form CRUD tampil sebagai teks biasa, bukan dieksekusi. | Tambah destinasi dengan nama tersebut, lalu lihat kartu dan tabel dashboard. |

---

## 9. Implementation Plan per Iterasi

Total timebox: sekitar 6 jam kerja + buffer 45–60 menit QA manual.

| Iterasi | Alokasi | Fokus | Deliverable | Exit criteria |
|---|---:|---|---|---|
| 0. Setup & kontrak data | 30 menit | Inisialisasi proyek Vite vanilla, struktur folder, modul data contoh, placeholder lokal | Folder proyek siap, 8 data contoh tersedia sebagai modul, placeholder gambar ada | Server dev Vite berjalan; data contoh bisa dibaca tanpa error |
| 1. Shell & katalog | 60 menit | Header/navigasi, grid kartu, halaman detail, routing sederhana | Beranda dan halaman detail berfungsi | AC-01, AC-03, AC-22 |
| 2. Pencarian, filter, sorting, URL | 60 menit | Logika F3–F5, empty state, sinkronisasi URL | Katalog dapat dicari/filter/diurutkan | AC-04–AC-11, AC-21 |
| 3. Peta Leaflet | 60 menit | Inisialisasi peta, marker, popup, sinkronisasi dengan filter, atribusi, fallback | Peta sebaran interaktif | AC-12, AC-13, NFR-5 |
| 4. Wishlist & checklist | 45 menit | Storage keys, badge, halaman wishlist, interaksi checklist per destinasi | Preferensi pengguna persisten | AC-14, AC-15, NFR-6 |
| 5. Dashboard CRUD & ringkasan | 60 menit | Tabel, kartu ringkasan, form tambah/edit, hapus, toggle unggulan, reset | Dashboard demo lengkap | AC-02, AC-16–AC-20 |
| 6. QA manual & perapian | 45 menit | About Us final, responsivitas, aksesibilitas, Console check | Aplikasi siap didemokan | AC-23–AC-26, NFR-1–NFR-10 |
| Buffer | 45–60 menit | Perbaikan temuan QA dan dokumentasi singkat | Catatan hasil uji manual | Semua AC lolos atau ditandai sebagai known issue |

**Definition of Done tiap iterasi:** fitur pada iterasi tersebut bisa diperagakan manual, tidak ada error di Console, tidak ada API key yang tersimpan, dan perubahan tidak merusak iterasi sebelumnya.

---

## 10. Catatan Implementasi Awal

- Spesifikasi ini menjadi acuan sebelum kode ditulis.
- Jika ada konflik antara kemudahan implementasi dan kriteria penerimaan di atas, kriteria penerimaan yang menang.
- Perubahan ruang lingkup harus dicatat di dokumen ini terlebih dahulu, baru dikerjakan.
- `TASKS.md` dan `UI-SPEC.md` dapat dibuat turunan dari dokumen ini setelah spesifikasi disetujui.
