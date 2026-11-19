// Data dan aturan murni untuk katalog OasisBahari.
// Tidak ada DOM, tidak ada penyimpanan, tidak ada request jaringan.

export const APP_NAME = 'OasisBahari';

export const STORAGE_KEYS = {
  destinations: 'oasisbahari.destinations.v1',
  wishlist: 'oasisbahari.wishlist.v1',
  checklist: 'oasisbahari.checklist.v1',
  ui: 'oasisbahari.ui.v1',
};

export const WILAYAH_PULAU = ['Sulawesi', 'Papua', 'Sumatera', 'Jawa', 'Nusa Tenggara'];
export const JENIS_OBJEK = ['Taman Laut', 'Pulau', 'Spot Diving', 'Spot Snorkeling', 'Pantai', 'Teluk'];
export const STATUS_POPULARITAS = ['Populer', 'Hidden Gem'];
export const LEVEL_KEAHLIAN = ['Pemula', 'Menengah', 'Mahir'];

export const SORT_OPTIONS = [
  { value: 'relevansi', label: 'Relevansi' },
  { value: 'nama_asc', label: 'Nama A–Z' },
  { value: 'nama_desc', label: 'Nama Z–A' },
  { value: 'populer', label: 'Populer dulu' },
];

export const DEFAULT_UI_STATE = {
  q: '',
  wilayah: '',
  status: '',
  sort: 'relevansi',
};

const SEED_PRODUCTS = [
  {
    id: 'dst-001',
    nama: 'Bunaken',
    wilayahPulau: 'Sulawesi',
    provinsi: 'Sulawesi Utara',
    jenisObjek: 'Taman Laut',
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

function compareByName(a, b) {
  return a.nama.localeCompare(b.nama, 'id');
}

export function selectProducts(products, state = DEFAULT_UI_STATE) {
  const q = String(state.q || '').trim().toLowerCase();
  const tokens = q ? q.split(/\s+/) : [];
  const shortQuery = q.length > 0 && q.length < 2;

  const items = products.filter((product) => {
    if (shortQuery) return true;
    if (state.wilayah && product.wilayahPulau !== state.wilayah) return false;
    if (state.status && product.statusPopularitas !== state.status) return false;

    const haystack = [
      product.nama,
      product.deskripsi,
      product.wilayahPulau,
      product.provinsi,
      product.jenisObjek,
      product.catatanLokal,
    ]
      .join(' ')
      .toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });

  const sorted = [...items];
  switch (state.sort) {
    case 'nama_asc':
      sorted.sort(compareByName);
      break;
    case 'nama_desc':
      sorted.sort((a, b) => compareByName(b, a));
      break;
    case 'populer':
      sorted.sort((a, b) => {
        const aPopular = a.statusPopularitas === 'Populer' ? 0 : 1;
        const bPopular = b.statusPopularitas === 'Populer' ? 0 : 1;
        return aPopular - bPopular || compareByName(a, b);
      });
      break;
    default:
      sorted.sort((a, b) => Number(b.unggulan) - Number(a.unggulan) || compareByName(a, b));
  }

  return { items: sorted, shortQuery };
}

export function getSummary(products) {
  return {
    total: products.length,
    hidden: products.filter((p) => p.statusPopularitas === 'Hidden Gem').length,
    populer: products.filter((p) => p.statusPopularitas === 'Populer').length,
    unggulan: products.filter((p) => p.unggulan).length,
  };
}
