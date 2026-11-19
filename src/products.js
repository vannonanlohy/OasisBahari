// Data dan fungsi murni untuk katalog OasisBahari.
// Tidak ada DOM, tidak ada penyimpanan, tidak ada request jaringan.

export const APP_NAME = 'OasisBahari';

// Key produk mengikuti kontrak migrasi yang diminta: array destinasi disimpan
// di bawah satu key ini. Key pendukung tetap memakai suffix versi sendiri.
export const STORAGE_KEYS = {
  destinations: 'oasisbahari:products:v1',
  wishlist: 'oasisbahari.wishlist.v2',
  checklist: 'oasisbahari.checklist.v2',
  ui: 'oasisbahari.ui.v2',
};

// Konfigurasi nonrahasia. Nomor ini hanya dipakai untuk membuat tautan wa.me,
// bukan untuk payment gateway atau autentikasi.
export const WHATSAPP_CONFIG = {
  number: '+6281234567890',
  label: 'Admin OasisBahari',
};

export const WILAYAH_PULAU = ['Sulawesi', 'Papua', 'Sumatera', 'Jawa', 'Nusa Tenggara'];
export const JENIS_OBJEK = ['Taman Laut', 'Pulau', 'Spot Diving', 'Spot Snorkeling', 'Pantai', 'Teluk'];
export const STATUS_POPULARITAS = ['Populer', 'Hidden Gem'];
export const LEVEL_KEAHLIAN = ['Pemula', 'Menengah', 'Mahir'];

// Empat kategori bahari yang dipakai sebagai filter utama katalog.
export const KATEGORI_BAHARI = ['Diving', 'Snorkeling', 'Pantai', 'Pulau'];
export const STATUS_AKSES = ['Tersedia', 'Kuota Terbatas', 'Penuh', 'Tidak Tersedia'];

export const SORT_OPTIONS = [
  { value: 'relevansi', label: 'Relevansi' },
  { value: 'biaya_asc', label: 'Biaya termurah' },
  { value: 'biaya_desc', label: 'Biaya termahal' },
  { value: 'nama_asc', label: 'Nama A–Z' },
];

export const DEFAULT_UI_STATE = {
  q: '',
  wilayah: '',
  status: '',
  kategori: '',
  sort: 'relevansi',
};

// Delapan destinasi fiktif/kurasi. Tidak ada gambar dari internet;
// imageUrl sengaja kosong dan UI merender placeholder lokal berbasis CSS.
const SEED_PRODUCTS = [
  {
    id: 'dst-001',
    nama: 'Bunaken',
    wilayahPulau: 'Sulawesi',
    provinsi: 'Sulawesi Utara',
    jenisObjek: 'Taman Laut',
    kategori: 'Diving',
    estimasiBiaya: 1250000,
    kuota: 18,
    statusAkses: 'Tersedia',
    statusPopularitas: 'Populer',
    levelKeahlian: 'Menengah',
    deskripsi: 'Taman laut dengan dinding karang dan keanekaragaman ikan; cocok untuk diving dan snorkeling.',
    infoAkses: 'Perahu dari Manado ±20 menit; gunakan kapal wisata resmi.',
    waktuTerbaik: 'Maret–Mei dan September–November',
    catatanLokal: 'Tanya kapten titik arus sebelum turun; hindari menyentuh karang.',
    checklistBawaan: ['Masker snorkel', 'Life jacket', 'Sunscreen ramah laut', 'Kamera anti air', 'Air minum'],
    latitude: 1.624,
    longitude: 124.759,
    imageUrl: '',
    unggulan: true,
  },
  {
    id: 'dst-002',
    nama: 'Raja Ampat – Wayag',
    wilayahPulau: 'Papua',
    provinsi: 'Papua Barat Daya',
    jenisObjek: 'Pulau',
    kategori: 'Pulau',
    estimasiBiaya: 4850000,
    kuota: 6,
    statusAkses: 'Kuota Terbatas',
    statusPopularitas: 'Populer',
    levelKeahlian: 'Mahir',
    deskripsi: 'Deretan karang dan laguna biru di ujung utara Raja Ampat dengan arus lebih kuat.',
    infoAkses: 'Pesawat ke Sorong, lalu kapal liveaboard/perahu ke Wayag; cuaca menentukan jadwal.',
    waktuTerbaik: 'April–Juni dan September–November',
    catatanLokal: 'Wajib life jacket dan panduan lokal; patuhi batas konservasi.',
    checklistBawaan: ['Life jacket', 'Snorkel', 'Topi', 'Air minum 2 L', 'Kamera dengan tali', 'Sunscreen ramah laut'],
    latitude: -0.5667,
    longitude: 130.7333,
    imageUrl: '',
    unggulan: true,
  },
  {
    id: 'dst-003',
    nama: 'Wakatobi',
    wilayahPulau: 'Sulawesi',
    provinsi: 'Sulawesi Tenggara',
    jenisObjek: 'Spot Diving',
    kategori: 'Diving',
    estimasiBiaya: 2750000,
    kuota: 12,
    statusAkses: 'Tersedia',
    statusPopularitas: 'Populer',
    levelKeahlian: 'Menengah',
    deskripsi: 'Gugus pulau dengan terumbu karang luas dan spot diving yang relatif tenang.',
    infoAkses: 'Penerbangan ke Bau-Bau/Wangi-Wangi, lalu perahu.',
    waktuTerbaik: 'April–Juni',
    catatanLokal: 'Beberapa titik hanya bisa saat air pasang; konfirmasi ke operator.',
    checklistBawaan: ['Masker', 'BCD', 'Regulator', 'Dry bag', 'Air minum'],
    latitude: -5.7333,
    longitude: 123.95,
    imageUrl: '',
    unggulan: false,
  },
  {
    id: 'dst-004',
    nama: 'Pulau Bira',
    wilayahPulau: 'Sulawesi',
    provinsi: 'Sulawesi Selatan',
    jenisObjek: 'Pantai',
    kategori: 'Pantai',
    estimasiBiaya: 450000,
    kuota: 20,
    statusAkses: 'Tersedia',
    statusPopularitas: 'Populer',
    levelKeahlian: 'Pemula',
    deskripsi: 'Pantai pasir putih di ujung selatan Sulawesi dengan snorkeling dekat pantai.',
    infoAkses: 'Dari Makassar ±3,5 jam lewat jalan darat.',
    waktuTerbaik: 'April–Oktober',
    catatanLokal: 'Air dangkal di dekat dermaga; sewa perahu hanya dari nelayan setempat.',
    checklistBawaan: ['Masker', 'Handuk', 'Sunscreen', 'Air minum', 'Sandal'],
    latitude: -5.6333,
    longitude: 120.4667,
    imageUrl: '',
    unggulan: false,
  },
  {
    id: 'dst-005',
    nama: 'Pulau Tidung',
    wilayahPulau: 'Jawa',
    provinsi: 'DKI Jakarta',
    jenisObjek: 'Pulau',
    kategori: 'Pulau',
    estimasiBiaya: 350000,
    kuota: 0,
    statusAkses: 'Penuh',
    statusPopularitas: 'Populer',
    levelKeahlian: 'Pemula',
    deskripsi: 'Pulau kecil dengan jembatan panjang, cocok untuk snorkeling pemula dan sunset.',
    infoAkses: 'Kapal cepat dari Marina Ancol atau Pelabuhan Kaliadem.',
    waktuTerbaik: 'April–September',
    catatanLokal: 'Jadwal kapal bisa berubah saat cuaca buruk; cek sebelum berangkat.',
    checklistBawaan: ['Masker', 'Life jacket', 'Topi', 'Air minum', 'Power bank'],
    latitude: -6.4058,
    longitude: 106.5525,
    imageUrl: '',
    unggulan: false,
  },
  {
    id: 'dst-006',
    nama: 'Iboih, Pulau Weh',
    wilayahPulau: 'Sumatera',
    provinsi: 'Aceh',
    jenisObjek: 'Spot Snorkeling',
    kategori: 'Snorkeling',
    estimasiBiaya: 650000,
    kuota: 15,
    statusAkses: 'Tersedia',
    statusPopularitas: 'Hidden Gem',
    levelKeahlian: 'Pemula',
    deskripsi: 'Teluk dengan air jernih dan karang dangkal di Pulau Weh, lebih tenang daripada spot utama Sabang.',
    infoAkses: 'Pesawat ke Sabang, lalu mobil/ojek ke Iboih ±30 menit.',
    waktuTerbaik: 'November–Maret',
    catatanLokal: 'Arus bisa berubah siang hari; tanya penjaga homestay untuk titik aman.',
    checklistBawaan: ['Masker', 'Snorkel', 'Sunscreen ramah laut', 'Handuk', 'Air minum'],
    latitude: 5.894,
    longitude: 95.318,
    imageUrl: '',
    unggulan: false,
  },
  {
    id: 'dst-007',
    nama: 'Moyo, Sumbawa',
    wilayahPulau: 'Nusa Tenggara',
    provinsi: 'Nusa Tenggara Barat',
    jenisObjek: 'Pulau',
    kategori: 'Pulau',
    estimasiBiaya: 1950000,
    kuota: 0,
    statusAkses: 'Tidak Tersedia',
    statusPopularitas: 'Hidden Gem',
    levelKeahlian: 'Menengah',
    deskripsi: 'Pulau dengan pantai bersih dan snorkeling di sekitar teluk; masih jarang dikunjungi.',
    infoAkses: 'Feri ke Sumbawa Besar, lalu perjalanan darat dan perahu ke Moyo.',
    waktuTerbaik: 'Mei–September',
    catatanLokal: 'Belum banyak fasilitas; bawa air minum dan kantong sampah sendiri.',
    checklistBawaan: ['Air minum', 'Masker', 'Kantong sampah', 'Topi', 'Obat nyamuk'],
    latitude: -8.6,
    longitude: 116.9,
    imageUrl: '',
    unggulan: false,
  },
  {
    id: 'dst-008',
    nama: 'Teluk Penyu, Cilacap',
    wilayahPulau: 'Jawa',
    provinsi: 'Jawa Tengah',
    jenisObjek: 'Teluk',
    kategori: 'Pantai',
    estimasiBiaya: 275000,
    kuota: 4,
    statusAkses: 'Kuota Terbatas',
    statusPopularitas: 'Hidden Gem',
    levelKeahlian: 'Pemula',
    deskripsi: 'Pantai teluk di pesisir selatan Jawa dengan pasir hitam dan spot nelayan lokal.',
    infoAkses: 'Dari Cilacap kota ±15 menit dengan mobil.',
    waktuTerbaik: 'April–September',
    catatanLokal: 'Arus pantai selatan kuat; jangan berenang jauh tanpa izin nelayan.',
    checklistBawaan: ['Sepatu pantai', 'Topi', 'Air minum', 'Sunscreen', 'Kantong sampah'],
    latitude: -7.7,
    longitude: 109.05,
    imageUrl: '',
    unggulan: false,
  },
];

export function getSeedProducts() {
  return SEED_PRODUCTS.map((product) => ({
    ...product,
    checklistBawaan: [...product.checklistBawaan],
  }));
}

// ---------- Validasi & normalisasi data destinasi ----------
// Validator ini dipakai tiga tempat: load localStorage, form CRUD, dan import JSON.
// Fungsi di bagian ini murni: tidak membaca DOM/network/storage.

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isText(value, min, max) {
  return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
}

function isEnum(value, options) {
  return typeof value === 'string' && options.includes(value);
}

function isLocalImagePath(value) {
  if (typeof value !== 'string') return false;
  if (value === '') return true;
  return /^(?:\.\/|\/)?[\w./-]+$/.test(value) && !value.includes('..') && !value.includes('://');
}

/**
 * Mengembalikan daftar error `{ field, message }`.
 * Array kosong berarti valid. Tidak ada mutasi pada input.
 */
export function validateProduct(product) {
  const errors = [];
  const add = (field, message) => errors.push({ field, message });

  if (!isPlainObject(product)) {
    return [{ field: '', message: 'Data destinasi harus berupa objek.' }];
  }

  if (typeof product.id !== 'string' || !/^dst-\d{3,}$/.test(product.id)) {
    add('id', 'Id harus berformat dst-###.');
  }
  if (!isText(product.nama, 3, 80)) add('nama', 'Nama wajib diisi 3–80 karakter.');
  if (!isEnum(product.wilayahPulau, WILAYAH_PULAU)) add('wilayahPulau', 'Wilayah pulau tidak valid.');
  if (!isText(product.provinsi, 2, 60)) add('provinsi', 'Provinsi wajib diisi 2–60 karakter.');
  if (!isEnum(product.jenisObjek, JENIS_OBJEK)) add('jenisObjek', 'Jenis objek tidak valid.');
  if (!isEnum(product.kategori, KATEGORI_BAHARI)) add('kategori', 'Kategori bahari harus salah satu dari: Diving, Snorkeling, Pantai, Pulau.');

  if (typeof product.estimasiBiaya !== 'number' || !Number.isFinite(product.estimasiBiaya) || product.estimasiBiaya < 0) {
    add('estimasiBiaya', 'Estimasi biaya harus angka >= 0.');
  }
  if (!Number.isInteger(product.kuota) || product.kuota < 0) {
    add('kuota', 'Kuota/slot harus bilangan bulat >= 0.');
  }
  if (!isEnum(product.statusAkses, STATUS_AKSES)) add('statusAkses', 'Status akses tidak valid.');
  if (!isEnum(product.statusPopularitas, STATUS_POPULARITAS)) add('statusPopularitas', 'Status popularitas tidak valid.');
  if (!isEnum(product.levelKeahlian, LEVEL_KEAHLIAN)) add('levelKeahlian', 'Level keahlian tidak valid.');

  if (!isText(product.deskripsi, 20, 300)) add('deskripsi', 'Deskripsi wajib diisi 20–300 karakter.');
  if (!isText(product.infoAkses, 10, 200)) add('infoAkses', 'Info akses wajib diisi 10–200 karakter.');
  if (!isText(product.waktuTerbaik, 3, 120)) add('waktuTerbaik', 'Waktu terbaik wajib diisi 3–120 karakter.');
  if (!isText(product.catatanLokal, 10, 200)) add('catatanLokal', 'Catatan lokal wajib diisi 10–200 karakter.');

  if (!Array.isArray(product.checklistBawaan) || product.checklistBawaan.length === 0) {
    add('checklistBawaan', 'Checklist bawaan minimal 1 item.');
  } else {
    const itemsValid = product.checklistBawaan.every((item) => isText(item, 3, 60));
    if (!itemsValid) add('checklistBawaan', 'Setiap checklist item harus 3–60 karakter.');
    const normalizedItems = product.checklistBawaan.map((item) => String(item).trim().toLowerCase());
    if (new Set(normalizedItems).size !== normalizedItems.length) {
      add('checklistBawaan', 'Checklist item tidak boleh duplikat.');
    }
  }

  if (typeof product.latitude !== 'number' || !Number.isFinite(product.latitude) || product.latitude < -90 || product.latitude > 90) {
    add('latitude', 'Latitude harus angka antara -90 dan 90.');
  }
  if (typeof product.longitude !== 'number' || !Number.isFinite(product.longitude) || product.longitude < -180 || product.longitude > 180) {
    add('longitude', 'Longitude harus angka antara -180 dan 180.');
  }
  if (!isLocalImagePath(product.imageUrl)) {
    add('imageUrl', 'imageUrl harus path lokal, bukan URL eksternal.');
  }
  if (typeof product.unggulan !== 'boolean') add('unggulan', 'Status unggulan harus boolean.');

  return errors;
}

/** Validasi seluruh array, termasuk keunikan id. Dipakai saat load dan import. */
export function validateProducts(value) {
  if (!Array.isArray(value)) {
    return {
      valid: false,
      products: [],
      errors: [{ field: '', message: 'Data harus berupa array destinasi.' }],
    };
  }

  const errors = [];
  const seenIds = new Set();

  value.forEach((item, index) => {
    const path = `data[${index}]`;
    validateProduct(item).forEach((error) => {
      errors.push({
        field: `${path}${error.field ? `.${error.field}` : ''}`,
        message: error.message,
      });
    });

    if (isPlainObject(item) && typeof item.id === 'string') {
      if (seenIds.has(item.id)) {
        errors.push({ field: `${path}.id`, message: `Id duplikat: ${item.id}.` });
      }
      seenIds.add(item.id);
    }
  });

  return {
    valid: errors.length === 0,
    products: errors.length === 0 ? value : [],
    errors,
  };
}

/** Mengubah nilai form (string) menjadi tipe data model sebelum divalidasi. */
export function normalizeProductInput(raw) {
  const toNumber = (value) => (value === '' || value === null || value === undefined ? NaN : Number(value));
  const rawChecklist = Array.isArray(raw.checklistBawaan)
    ? raw.checklistBawaan
    : String(raw.checklistBawaan ?? '').split(/\r?\n/);

  return {
    id: String(raw.id ?? '').trim(),
    nama: String(raw.nama ?? '').trim(),
    wilayahPulau: String(raw.wilayahPulau ?? '').trim(),
    provinsi: String(raw.provinsi ?? '').trim(),
    jenisObjek: String(raw.jenisObjek ?? '').trim(),
    kategori: String(raw.kategori ?? '').trim(),
    estimasiBiaya: toNumber(raw.estimasiBiaya),
    kuota: toNumber(raw.kuota),
    statusAkses: String(raw.statusAkses ?? '').trim(),
    statusPopularitas: String(raw.statusPopularitas ?? '').trim(),
    levelKeahlian: String(raw.levelKeahlian ?? '').trim(),
    deskripsi: String(raw.deskripsi ?? '').trim(),
    infoAkses: String(raw.infoAkses ?? '').trim(),
    waktuTerbaik: String(raw.waktuTerbaik ?? '').trim(),
    catatanLokal: String(raw.catatanLokal ?? '').trim(),
    checklistBawaan: rawChecklist.map((item) => String(item).trim()).filter(Boolean),
    latitude: toNumber(raw.latitude),
    longitude: toNumber(raw.longitude),
    imageUrl: String(raw.imageUrl ?? '').trim(),
    unggulan: raw.unggulan === true || raw.unggulan === 'true' || raw.unggulan === 'on',
  };
}

export function createProductId(products) {
  const used = new Set(products.map((product) => product.id));
  for (let index = 1; index <= 9999; index += 1) {
    const candidate = `dst-${String(index).padStart(3, '0')}`;
    if (!used.has(candidate)) return candidate;
  }
  return `dst-${Date.now()}`;
}

export function formatRupiah(value) {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppUrl(nomor, destination) {
  const phone = String(nomor ?? '').trim();
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error('Nomor WhatsApp harus memakai format internasional, misalnya +6281234567890.');
  }
  if (!destination || typeof destination.nama !== 'string' || !destination.nama.trim()) {
    throw new Error('Destinasi tidak valid untuk pemesanan.');
  }

  const biaya = Number.isFinite(Number(destination.estimasiBiaya))
    ? formatRupiah(destination.estimasiBiaya)
    : 'belum diumumkan';

  const pesan = [
    'Halo OasisBahari,',
    `saya tertarik memesan paket wisata ${destination.nama.trim()}.`,
    `Kategori: ${destination.kategori || '-'}; wilayah: ${destination.wilayahPulau || '-'}.`,
    `Estimasi biaya: ${biaya}.`,
    `Sisa kuota: ${Number.isInteger(destination.kuota) ? destination.kuota : '-'} slot.`,
    'Mohon informasi jadwal dan langkah pemesanan. Terima kasih.',
  ].join(' ');

  return `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(pesan)}`;
}

function compareByName(a, b) {
  return String(a.nama).localeCompare(String(b.nama), 'id');
}

export function sortProducts(items, sort = 'relevansi') {
  const sorted = [...items];

  switch (sort) {
    case 'biaya_asc':
      sorted.sort((a, b) => (Number(a.estimasiBiaya) || 0) - (Number(b.estimasiBiaya) || 0) || compareByName(a, b));
      break;
    case 'biaya_desc':
      sorted.sort((a, b) => (Number(b.estimasiBiaya) || 0) - (Number(a.estimasiBiaya) || 0) || compareByName(a, b));
      break;
    case 'nama_asc':
      sorted.sort(compareByName);
      break;
    default:
      sorted.sort((a, b) => Number(b.unggulan) - Number(a.unggulan) || compareByName(a, b));
  }

  return sorted;
}

/**
 * Fungsi murni: pencarian case-insensitive, filter kategori/wilayah/status,
 * lalu sorting. Tidak mengubah array input dan tidak menyentuh DOM/storage.
 */
export function filterProducts(products, criteria = {}) {
  const q = String(criteria.q ?? '').trim().toLowerCase();
  const tokens = q ? q.split(/\s+/) : [];
  const shortQuery = q.length > 0 && q.length < 2;
  const kategori = criteria.kategori || '';
  const wilayah = criteria.wilayah || '';
  const status = criteria.status || '';

  const matched = products.filter((product) => {
    // Filter kategori/wilayah/status tetap berlaku walau query belum mencapai 2 karakter.
    if (kategori && product.kategori !== kategori) return false;
    if (wilayah && product.wilayahPulau !== wilayah) return false;
    if (status && product.statusPopularitas !== status) return false;
    if (shortQuery) return true;

    const haystack = [
      product.nama,
      product.deskripsi,
      product.wilayahPulau,
      product.provinsi,
      product.jenisObjek,
      product.kategori,
      product.statusPopularitas,
      product.statusAkses,
      product.catatanLokal,
    ]
      .join(' ')
      .toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });

  return { items: sortProducts(matched, criteria.sort), shortQuery };
}

// Kompatibel dengan pemanggil lama; perilaku identik dengan filterProducts.
export function selectProducts(products, state = DEFAULT_UI_STATE) {
  return filterProducts(products, state);
}

export function getSummary(products) {
  return {
    total: products.length,
    hidden: products.filter((p) => p.statusPopularitas === 'Hidden Gem').length,
    populer: products.filter((p) => p.statusPopularitas === 'Populer').length,
    unggulan: products.filter((p) => p.unggulan).length,
    totalKuota: products.reduce(
      (sum, product) => sum + (Number.isInteger(product.kuota) && product.kuota > 0 ? product.kuota : 0),
      0,
    ),
    kategori: KATEGORI_BAHARI.map((nama) => ({
      nama,
      jumlah: products.filter((product) => product.kategori === nama).length,
    })),
  };
}
