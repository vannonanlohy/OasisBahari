# UI-SPEC — JejakBahari

| Field | Nilai |
|---|---|
| Dokumen | Spesifikasi antarmuka pengguna |
| Versi | 1.0 |
| Status | Draft desain, belum implementasi |
| Berdasarkan | `SPEC.md` versi 1.0 |
| Nama brand UI | **JejakBahari** |
| Platform | Web, mobile-first |
| Tech stack | Vite + JavaScript vanilla + Leaflet.js + OpenStreetMap |
| Pengujian | Manual, mengikuti AC-01–AC-26 di `SPEC.md` |

> **Catatan penamaan:** `SPEC.md` masih menggunakan nama **OasisBahari**, sedangkan dokumen ini menggunakan **JejakBahari** sesuai permintaan. Perlakukan JejakBahari sebagai **usulan rebrand** yang perlu disetujui. Sebelum implementasi, sinkronkan nama di `SPEC.md`, salinan UI, dan key `localStorage`. Perilaku dan kriteria penerimaan tetap mengikuti `SPEC.md`; perubahan nama tidak mengubah AC-01–AC-26.

---

## 1. Tujuan UI

1. Menerjemahkan fitur di `SPEC.md` menjadi panduan visual dan interaksi yang bisa diverifikasi manual.
2. Menghasilkan tampilan yang bersih, laut, dan ramah wisatawan: putih pasir, biru muda, biru laut dalam, dan tosca bahari.
3. Memastikan katalog, peta, detail, wishlist, About Us, dan dashboard tetap nyaman dipakai di layar 375 px hingga 1280 px.
4. Menjaga aksesibilitas: kontras memadai, fokus terlihat, target sentuh minimal 44 px, dan tidak ada scroll horizontal di mobile.

Dokumen ini hanya berisi desain dan wireframe. **Belum ada kode aplikasi.**

---

## 2. Prinsip Desain

| Prinsip | Penerapan |
|---|---|
| Mobile-first | Layout dasar disusun untuk satu kolom; kolom tambahan muncul saat ruang tersedia. |
| Hierarki jelas | Satu headline per halaman, satu aksi utama per layar, aksi sekunder lebih tenang. |
| Laut, bukan dekorasi berlebih | Warna dan bentuk gelombang dipakai sebagai peneduh, bukan mengganggu konten. |
| Teks lebih dulu | Status destinasi tidak hanya dibedakan warna, tetapi juga label teks. |
| Feedback instan | Empty state, validasi, badge, dan toast memberi tahu hasil tindakan pengguna. |
| Konsisten | Satu gaya kartu, satu gaya tombol, satu pola modal untuk seluruh aplikasi. |

---

## 3. Design Tokens

### 3.1 Warna

| Token | Hex | Peran | Pasangan aman |
|---|---|---|---|
| `pasir` | `#FFFCF5` | Background halaman, area hangat | Teks `#0B3D5A` — kontras ≈ **11.2:1** |
| `permukaan` | `#FFFFFF` | Kartu, modal, panel, input | Teks `#0B3D5A` — kontras ≈ **11.5:1** |
| `biru-muda` | `#E4F3F6` | Hero, band filter, chip, banner | Teks `#0B3D5A` — kontras ≈ **10.1:1** |
| `biru-laut` | `#0B3D5A` | Teks utama, header, tombol primer | Teks putih di atasnya ≈ **11.5:1** |
| `tosca` | `#0A737C` | Aksen, status Hidden Gem, link, fokus | Putih ≈ **5.6:1**; biru-muda ≈ **4.9:1** |
| `tosca-gelap` | `#085C64` | Hover/active tosca | Putih ≈ **7+:1** |
| `teks-sekunder` | `#52666E` | Meta, caption, label pendukung | Putih ≈ **6.0:1** |
| `garis` | `#D8E7EA` | Border kartu/input | Bukan untuk teks |
| `sukses` | `#1B6E4A` | Pesan berhasil | Teks di atas permukaan terang |
| `bahaya` | `#B3261E` | Error, hapus, validasi | Teks di atas permukaan terang |
| `fokus` | `#0A737C` | Outline fokus | Dipasang dengan offset 2 px |

**Aturan kontras:**

- Teks normal minimal **4.5:1**.
- Teks besar/heading dan elemen UI minimal **3:1**.
- StatusPopuler memakai label teks `Populer` + biru-laut; Hidden Gem memakai label teks `Hidden Gem` + tosca. Warna bukan satu-satunya pembeda.
- Marker peta memakai bentuk berbeda (lingkaran untuk Populer, berlian untuk Hidden Gem) ditambah legenda.

### 3.2 Tipografi

| Peran | Font | Ukuran desktop | Ukuran mobile | Line height |
|---|---|---:|---:|---:|
| Display/Hero | Sans-serif | 40 px, bold | 28 px, bold | 1.15 |
| H1 halaman | Sans-serif | 32 px, bold | 26 px, bold | 1.2 |
| H2 bagian | Sans-serif | 24 px, semibold | 20 px, semibold | 1.25 |
| Body | Sans-serif | 16 px, regular | 16 px, regular | 1.5 |
| Meta/caption | Sans-serif | 14 px, regular | 14 px, regular | 1.45 |
| Label form | Sans-serif | 14 px, semibold | 14 px, semibold | 1.4 |

Font stack: `Inter`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `sans-serif`. Tidak memuat webfont eksternal agar tetap ringan dan tanpa ketergantungan jaringan tambahan.

### 3.3 Spasi, Radius, Elevasi

| Token | Nilai | Penggunaan |
|---|---:|---|
| Spasi | 4, 8, 12, 16, 24, 32, 48, 64 px | Padding dan jarak antarblok |
| Max content width | 1200 px | Desktop, di tengah dengan margin otomatis |
| Radius kartu | 16 px | Kartu destinasi, panel ringkasan |
| Radius input/tombol | 10 px | Input, select, tombol |
| Radius chip | 999 px | Badge status, filter aktif |
| Shadow kartu | `0 2px 8px rgba(11,61,90,0.08)` | Default; hover `0 8px 20px rgba(11,61,90,0.14)` |
| Outline fokus | 2 px solid `#0A737C`, offset 2 px | Semua elemen interaktif |
| Target sentuh | Min 44 × 44 px | Tombol, link, checkbox, marker kontrol |

### 3.4 Breakpoint

| Nama | Rentang | Perilaku |
|---|---|---|
| Mobile | 0–599 px | Satu kolom, navbar ringkas, grid 1 kartu, modal full-screen sheet |
| Tablet | 600–899 px | Dua kolom kartu, filter masih satu baris wrap |
| Desktop | ≥ 900 px | Tiga kolom kartu, navbar penuh, dashboard sidebar + konten, modal centered |

---

## 4. Komponen Umum

| Komponen | State yang harus dirancang |
|---|---|
| Tombol primer | Default, hover, focus, active, disabled |
| Tombol sekunder | Default, hover, focus, active |
| Tombol ikon | Default, focus, active, `aria-label` wajib |
| Input/select | Default, focus, error, disabled, helper text |
| Kartu destinasi | Default, hover, focus, selected, wishlist aktif |
| Badge status | Populer, Hidden Gem, Unggulan |
| Chip filter | Aktif, bisa dihapus, reset semua |
| Empty state | Ilustrasi/ikon sederhana, judul, deskripsi, CTA |
| Toast | Sukses, error, info; muncul 3–4 detik lalu hilang |
| Modal | Default, scroll internal, focus trap, Escape close |
| Checkbox | Unchecked, checked, focus, disabled |
| Peta | Default, filter aktif, marker kosong, tile gagal |

**Aturan interaksi umum:**

- Semua elemen interaktif bisa dicapai dengan Tab dan memiliki outline fokus.
- Escape menutup modal dan mengembalikan fokus ke elemen pemicu.
- Klik di luar modal desktop menutup modal; di mobile tetap sediakan tombol Tutup yang jelas.
- Teks error muncul dekat field, bukan hanya toast.
- `prefers-reduced-motion`: matikan animasi geser/fade.

---

## 5. Struktur Halaman

### 5.1 Navbar

| Elemen | Desktop | Mobile |
|---|---|---|
| Wordmark | Ikon ombak + `JejakBahari` | Ikon ombak + `Jejak` |
| Menu | Beranda, Destinasi, Peta, Wishlist `(badge)`, Tentang, Dashboard | Tombol burger; sheet berisi menu yang sama |
| Aksi kanan | Badge wishlist + tombol Dashboard | Badge wishlist + burger |
| Posisi | Sticky di atas, tinggi 72 px | Sticky, tinggi 60 px |
| Style | Background `#FFFFFF`, border bawah `#D8E7EA` | Sama |

Menu aktif ditandai underline tosca 3 px dan warna teks `#0A737C`.

### 5.2 Hero — Beranda

- Background gradasi `#FFFCF5` ke `#E4F3F6`, dengan garis gelombang dekoratif di bawah.
- Headline: **“Temukan hidden gems laut Nusantara.”**
- Subhead: “Delapan destinasi laut, dari spot populer hingga sudut yang masih tenang.”
- Input pencarian besar dengan placeholder `Cari nama, wilayah, atau tips lokal…`.
- CTA primer: **Jelajahi destinasi**.
- Ringkasan chip: `8 destinasi`, `3 hidden gems`, `5 populer`.
- Mobile: headline 28 px, input penuh lebar, chip wrap ke dua baris.

### 5.3 Filter & Sorting

- Berada langsung di bawah hero dan melekat di bawah navbar saat scroll pada desktop.
- Field: `Cari`, `Wilayah`, `Status`, `Urutkan`, tombol `Reset`.
- Filter aktif tampil sebagai chip di bawah field, misalnya `Wilayah: Sulawesi ×`.
- Hasil ditampilkan sebagai teks: `Menampilkan 3 dari 8 destinasi`.
- Empty state memakai judul `Belum ada yang cocok` dan tombol `Reset filter`.

### 5.4 Peta Interaktif OpenStreetMap

- Kartu peta dengan judul `Peta sebaran destinasi` dan subjudul `Klik marker untuk melihat detail`.
- Tinggi: 420 px desktop, 320 px tablet, 300 px mobile.
- Kontrol zoom tetap terlihat; atribusi OpenStreetMap tidak ditutupi elemen lain.
- Legenda:
  - Lingkaran biru-laut = `Populer`.
  - Berlian tosca = `Hidden Gem`.
  - Ring putih di sekitar marker = marker sedang dipilih.
- Popup marker: nama destinasi, badge status, wilayah, dan tautan `Lihat detail`.
- Marker mengikuti hasil pencarian/filter/sorting.
- Jika hasil kosong: overlay tipis dengan pesan `Tidak ada marker untuk filter ini` dan tombol `Reset filter`.
- Jika tile gagal: peta tetap menampilkan frame + pesan `Peta tidak dapat dimuat. Gunakan daftar destinasi di bawah.`

### 5.5 Grid Destinasi

- Desktop 3 kolom, tablet 2 kolom, mobile 1 kolom.
- Kartu berisi: gambar 16:9, badge status di pojok, badge `Unggulan` jika `unggulan = true`, nama, wilayah + provinsi, jenis objek, level keahlian, dan tombol ikon wishlist.
- Area kartu seluruhnya bisa diklik untuk membuka detail; tombol wishlist menghentikan klik kartu.
- Foto tidak tersedia → placeholder lokal `#E4F3F6` dengan ikon ombak dan alt `Foto destinasi belum tersedia`.
- Urutan kartu mengikuti sorting; kartu pertama diberi label kecil `Hasil teratas` hanya pada sorting Relevansi.

### 5.6 Modal Detail Destinasi

**Desktop:** dialog centered, lebar maks 720 px, tinggi maks 85vh, scroll internal.  
**Mobile:** bottom sheet full-height dengan pegangan di atas dan tombol Tutup tetap terlihat.

Struktur:

1. Header: gambar, nama, badge status, badge level, badge unggulan.
2. Ringkasan: deskripsi + wilayah/provinsi/jenis objek.
3. Info praktis: `Info akses`, `Waktu terbaik`, `Koordinat` dalam satu grid dua kolom di desktop, satu kolom di mobile.
4. **Tips lokal**: blok ber-background `#E4F3F6`, border kiri tosca 4 px, judul `Tips dari warga lokal`, isi `catatanLokal`.
5. **Checklist bawaan**: judul `Packing checklist`, daftar checkbox, input `Tambah item…`, tombol `Tambah`, tombol teks `Reset checklist`.
6. Footer: tombol `Simpan ke wishlist` / `Hapus dari wishlist` dan tombol `Tutup`.

Perilaku:

- Checklist per destinasi; centang dan item kustom bertahan setelah refresh.
- Error validasi item kosong muncul di bawah input.
- Saat modal terbuka, fokus pindah ke judul modal; Tab tidak keluar modal; Escape menutup.

### 5.7 Halaman Wishlist

- H1: `Wishlist saya`.
- Subjudul: `Disimpan di perangkat ini — tidak memerlukan akun.` (mendukung AC-25).
- Badge jumlah item di navbar mengikuti jumlah wishlist.
- Jika kosong: empty state dengan ilustrasi kotak kosong, judul `Wishlist masih kosong`, CTA `Jelajahi destinasi`.
- Jika ada isi: grid kartu sama seperti katalog, dengan tombol `Hapus dari wishlist` lebih menonjol.

### 5.8 Halaman About Us

- Hero kecil: `Tentang JejakBahari` + tagline `Direktori wisata laut untuk latihan satu hari`.
- Empat kartu:
  1. **Tujuan** — latihan analisis dan rekayasa web statis.
  2. **Data contoh** — 8 destinasi nonpribadi; koordinat dan info akses wajib diverifikasi lapangan.
  3. **Cara pakai** — cari, filter, simpan, centang checklist, kelola data via dashboard.
  4. **Teknologi** — Vite, JavaScript vanilla, Leaflet.js, OpenStreetMap, `localStorage`.
- Disclaimer ditempatkan dalam blok `#E4F3F6` dengan ikon informasi, bukan teks kecil di footer saja.

### 5.9 Dashboard Demo CRUD

**Desktop:** sidebar kiri 240 px (Ringkasan, Daftar destinasi, Tambah destinasi, Reset data) + konten kanan.  
**Mobile:** sidebar berubah menjadi tab horizontal di atas konten; tidak ada tabel melebar.

Konten:

1. H1 `Dashboard demo` + subjudul `Tanpa login. Perubahan hanya disimpan di perangkat ini.`
2. Tiga kartu ringkasan: `Total destinasi`, `Hidden Gem`, `Populer`. Angka besar, label kecil, aksen garis atas biru-laut/tosca.
3. Toolbar: `Tambah destinasi`, `Reset ke data contoh`.
4. Daftar destinasi:
   - Desktop: tabel dengan kolom Nama, Wilayah, Status, Level, Unggulan, Aksi.
   - Mobile: kartu satu kolom per destinasi; setiap kartu menampilkan field yang sama + tombol `Edit`, `Hapus`, dan toggle `Unggulan`.
5. Form tambah/edit sebagai panel/modal dengan field berurutan: identitas → klasifikasi → narasi → checklist → koordinat & gambar → unggulan.
6. Konfirmasi hapus dan konfirmasi reset memakai modal kecil dengan tombol `Batal` dan aksi berwarna `#B3261E`.
7. Error validasi muncul inline di bawah field; ringkasan tidak berubah jika validasi gagal.

---

## 6. Wireframe Teks — Desktop (1280 px)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ≈ JejakBahari   Beranda  Destinasi  Peta  Wishlist (1)  Tentang  Dashboard  │
├──────────────────────────────────────────────────────────────────────────────┤
│  HERO (pasir → biru-muda, gelombang)                                       │
│  Temukan hidden gems laut Nusantara                                        │
│  Delapan destinasi laut, dari spot populer hingga sudut yang masih tenang. │
│  [ Cari nama, wilayah, atau tips lokal…            ] [ Jelajahi ]          │
│  (8 destinasi)  (3 hidden gems)  (5 populer)                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  FILTER STICKY                                                             │
│  [Cari] [Wilayah ▾] [Status ▾] [Urutkan ▾] [Reset]   Menampilkan 8 dari 8   │
│  chip: Wilayah: Sulawesi ×                                                  │
├────────────────────────────────────┬─────────────────────────────────────────┤
│  PETA SEBARAN (420px)              │  Ringkasan cepat                      │
│  ○ Populer  ◇ Hidden Gem           │  Total 8 | Hidden 3 | Populer 5       │
│  [ peta OSM + marker + atribusi ]  │  Lihat dashboard →                    │
├────────────────────────────────────┴─────────────────────────────────────────┤
│  DESTINASI                                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                              │
│  │ gambar     │ │ gambar     │ │ gambar     │                              │
│  │ [Populer]  │ │ [Hidden]   │ │ [Populer]  │                              │
│  │ Bunaken    │ │ Iboih      │ │ Wakatobi   │                              │
│  │ Sulawesi   │ │ Sumatera   │ │ Sulawesi   │                              │
│  │ Menengah ♡ │ │ Pemula ♡   │ │ Menengah ♡ │                              │
│  └────────────┘ └────────────┘ └────────────┘                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                              │
│  │ ...        │ │ ...        │ │ ...        │                              │
│  └────────────┘ └────────────┘ └────────────┘                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  Footer: JejakBahari · Data contoh · Verifikasi lapangan · OSM             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.1 Modal detail — desktop

```text
┌─────────────────────────────────────────────────────────────┐
│ [ gambar destinasi ]                                 [×]   │
│ Bunaken  [Populer] [Menengah] [Unggulan]                    │
├─────────────────────────────────────────────────────────────┤
│ Deskripsi singkat destinasi...                              │
│ Wilayah: Sulawesi · Provinsi: Sulawesi Utara                │
│ Jenis objek: Taman Laut                                     │
├──────────────────────────┬──────────────────────────────────┤
│ Info akses               │ Waktu terbaik                    │
│ Perahu dari Manado…      │ Maret–Mei, Sep–Nov               │
│ Koordinat                │ 1.6240, 124.7590                 │
├─────────────────────────────────────────────────────────────┤
│ Tips dari warga lokal                                       │
│ Tanya kapten titik arus sebelum turun; hindari karang.      │
├─────────────────────────────────────────────────────────────┤
│ Packing checklist                                           │
│ ☑ Masker snorkel   ☐ Life jacket   ☐ Sunscreen              │
│ [ Tambah item… ] [Tambah]                    [Reset]         │
├─────────────────────────────────────────────────────────────┤
│ [ Simpan ke wishlist ]                         [ Tutup ]    │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Dashboard — desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ≈ JejakBahari                                    Wishlist (1)   Dashboard   │
├────────────────┬─────────────────────────────────────────────────────────────┤
│ SIDEBAR        │  Dashboard demo                                            │
│ • Ringkasan    │  Tanpa login. Tersimpan di perangkat ini.                  │
│ • Daftar       │  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│ • Tambah       │  │ Total 8  │ │ Hidden 3 │ │ Populer 5│                    │
│ • Reset data   │  └──────────┘ └──────────┘ └──────────┘                    │
│                │  [+ Tambah destinasi]        [Reset ke data contoh]        │
│                │  Nama      Wilayah  Status     Level   Unggulan  Aksi       │
│                │  Bunaken   Sulawesi Populer    Menengah ★        Edit Hapus │
│                │  Iboih     Sumatera Hidden Gem Pemula   —         Edit Hapus│
│                │  ...                                                       │
└────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 7. Wireframe Teks — Mobile (375 px)

### 7.1 Beranda

```text
┌─────────────────────────────┐
│ ≈ Jejak     Wishlist(1)  ☰  │
├─────────────────────────────┤
│ Temukan hidden gems laut    │
│ Nusantara                   │
│ Delapan destinasi laut...   │
│ ┌─────────────────────────┐ │
│ │ Cari nama, wilayah...   │ │
│ └─────────────────────────┘ │
│ [ Jelajahi destinasi ]      │
│ (8 destinasi) (3 hidden)    │
│ (5 populer)                 │
├─────────────────────────────┤
│ [Cari______] [Wilayah ▾]    │
│ [Status ▾]   [Urutkan ▾]    │
│ [Reset]   8 dari 8 destinasi│
├─────────────────────────────┤
│ PETA SEBARAN (300px)        │
│ ○ Populer ◇ Hidden Gem      │
│ [ peta OSM + atribusi ]     │
├─────────────────────────────┤
│ DESTINASI                   │
│ ┌─────────────────────────┐ │
│ │ [ gambar 16:9 ]         │ │
│ │ [Populer]  [Unggulan]   │ │
│ │ Bunaken                 │ │
│ │ Sulawesi · Menengah   ♡ │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ ...                     │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Footer ringkas              │
└─────────────────────────────┘
```

### 7.2 Modal detail — mobile sheet

```text
┌─────────────────────────────┐
│ ───────                 ×   │
│ [ gambar ]                  │
│ Bunaken                     │
│ [Populer] [Menengah]        │
├─────────────────────────────┤
│ Deskripsi singkat...        │
│ Wilayah · Provinsi          │
│ Jenis objek                 │
├─────────────────────────────┤
│ Info akses                  │
│ Waktu terbaik               │
│ Koordinat                   │
├─────────────────────────────┤
│ Tips dari warga lokal       │
│ Tanya kapten titik arus...  │
├─────────────────────────────┤
│ Packing checklist           │
│ ☑ Masker snorkel            │
│ ☐ Life jacket               │
│ [ Tambah item… ] [Tambah]   │
│ [ Reset checklist ]         │
├─────────────────────────────┤
│ [ Simpan ke wishlist ]      │
│ [ Tutup ]                   │
└─────────────────────────────┘
```

### 7.3 Menu burger terbuka

```text
┌─────────────────────────────┐
│ ≈ Jejak      Wishlist(1) ✕  │
├─────────────────────────────┤
│ • Beranda                   │
│ • Destinasi                 │
│ • Peta                      │
│ • Wishlist (1)              │
│ • Tentang                   │
│ • Dashboard                 │
└─────────────────────────────┘
```

### 7.4 Wishlist kosong & About Us

```text
┌─────────────────────────────┐   ┌─────────────────────────────┐
│ ≈ Jejak     Wishlist(0)  ☰  │   │ ≈ Jejak     Wishlist(1)  ☰  │
├─────────────────────────────┤   ├─────────────────────────────┤
│ Wishlist saya               │   │ Tentang JejakBahari         │
│ Tersimpan di perangkat ini  │   │ Direktori wisata laut...    │
│ ┌─────────────────────────┐ │   │ ┌─────────────────────────┐ │
│ │        ▢               │ │   │ │ Tujuan                  │ │
│ │ Wishlist masih kosong  │ │   │ │ Data contoh + disclaimer│ │
│ │ [ Jelajahi destinasi ] │ │   │ │ Cara pakai              │ │
│ └─────────────────────────┘ │   │ │ Teknologi               │ │
└─────────────────────────────┘   │ └─────────────────────────┘ │
                                  └─────────────────────────────┘
```

### 7.5 Dashboard — mobile

```text
┌─────────────────────────────┐
│ ≈ Jejak     Wishlist(1)  ☰  │
├─────────────────────────────┤
│ Dashboard demo              │
│ Tanpa login...              │
│ [Ringkasan][Daftar][Tambah] │
├─────────────────────────────┤
│ ┌──────┐┌──────┐┌──────┐    │
│ │Total ││Hidden││Populer│   │
│ │  8   ││  3   ││  5   │    │
│ └──────┘└──────┘└──────┘    │
│ [+ Tambah destinasi]        │
│ [Reset ke data contoh]      │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Bunaken                 │ │
│ │ Sulawesi · Populer      │ │
│ │ Menengah · Unggulan ★   │ │
│ │ [Edit] [Hapus]          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Iboih ...               │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 8. Pemetaan ke Acceptance Criteria `SPEC.md`

| Elemen UI | Mendukung AC |
|---|---|
| Grid 8 kartu + placeholder | AC-01, AC-03 |
| Kartu ringkasan dashboard | AC-02 |
| Input pencarian + petunjuk min. 2 karakter | AC-04, AC-05, AC-06 |
| Filter wilayah/status + empty state | AC-07, AC-08, AC-09 |
| Sort select + urutan kartu | AC-10, AC-11, AC-19 |
| Peta, marker, popup, legenda, atribusi | AC-12, AC-13 |
| Tombol wishlist + badge + halaman wishlist | AC-14, AC-25 |
| Modal checklist + item kustom + reset | AC-15 |
| Form CRUD + validasi + konfirmasi | AC-16, AC-17, AC-18, AC-26 |
| Reset data + pesan konfirmasi | AC-20 |
| Filter tersinkron ke URL | AC-21 |
| Halaman About Us + disclaimer | AC-22 |
| Layout 375 px + keyboard focus | AC-23 |
| Console bersih + tanpa API eksternal selain OSM | AC-24 |

---

## 9. UI Acceptance Checklist

| ID | Checklist | Cara cek manual |
|---|---|---|
| UI-01 | Warna dominan putih pasir, biru muda, biru laut dalam, dan tosca sesuai token. | Bandingkan hasil render dengan tabel warna di 3.1. |
| UI-02 | Teks utama di atas background terang memiliki kontras minimal 4.5:1. | Gunakan contrast checker pada pasangan `#0B3D5A`/`#FFFCF5` dan `#0A737C`/`#E4F3F6`. |
| UI-03 | Font seluruh halaman sans-serif dan hierarki ukuran sesuai 3.2. | Periksa headline, body, dan caption di desktop serta mobile. |
| UI-04 | Pada 375 px tidak ada scroll horizontal. | Buka DevTools, set width 375 px, geser ke samping. |
| UI-05 | Navbar desktop menampilkan semua menu; mobile menampilkan burger + badge. | Ubah lebar jendela dari 1280 ke 375 px. |
| UI-06 | Hero menampilkan headline, subhead, pencarian, CTA, dan tiga chip ringkasan. | Lihat beranda pada kedua breakpoint. |
| UI-07 | Peta menampilkan marker, legenda, kontrol zoom, dan atribusi OSM. | Buka beranda dan periksa sudut kanan bawah peta. |
| UI-08 | Grid destinasi berubah 3 kolom → 2 kolom → 1 kolom sesuai breakpoint. | Resize 1280 → 800 → 375 px. |
| UI-09 | Filter, sorting, chip aktif, dan empty state tampil sesuai 5.3. | Terapkan filter Sulawesi + Hidden Gem. |
| UI-10 | Modal detail menampilkan Tips dari warga lokal dan checklist, dapat ditutup dengan Escape, fokus kembali ke kartu. | Buka detail dari kartu, tekan Escape, amati fokus. |
| UI-11 | Halaman wishlist menampilkan pesan “Disimpan di perangkat ini” dan empty state yang benar. | Buka wishlist sebelum dan sesudah menyimpan satu destinasi. |
| UI-12 | About Us memuat disclaimer verifikasi lapangan dalam blok biru muda. | Buka halaman Tentang. |
| UI-13 | Dashboard mobile memakai kartu, bukan tabel melebar. | Set width 375 px lalu buka dashboard. |
| UI-14 | Tombol dan input memiliki target sentuh minimal 44 px dan outline fokus terlihat. | Tab melalui elemen dan ukur area klik di DevTools. |
| UI-15 | Tidak ada animasi saat `prefers-reduced-motion` aktif. | Aktifkan preferensi di DevTools Rendering lalu buka modal. |

---

## 10. Catatan Handoff

1. Nama brand harus diputuskan sebelum implementasi: **JejakBahari** atau **OasisBahari**.
2. Jika JejakBahari disetujui, perbarui `SPEC.md`, wordmark, judul halaman, dan key `localStorage` secara konsisten.
3. Semua aset visual harus lokal: SVG/placeholder di folder `public/images/`, tanpa URL eksternal.
4. Wireframe di atas adalah panduan layout, bukan spesifikasi piksel final; toleransi perataan disesuaikan dengan grid 8 px.
5. Implementasi baru dimulai setelah `SPEC.md` dan dokumen ini saling konsisten.
