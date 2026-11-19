// Semua fungsi render DOM. Data mentah tidak pernah disuntikkan sebagai HTML.

import L from 'leaflet';
import {
  DEFAULT_UI_STATE,
  IMAGE_PRESETS,
  KABUPATEN_BALI,
  KATEGORI_BAHARI,
  SORT_OPTIONS,
  STATUS_POPULARITAS,
  WILAYAH_PULAU,
  WHATSAPP_CONFIG,
  buildWhatsAppUrl,
  formatRupiah,
} from './products.js';
import { isSafeAttribute } from './dom-safety.js';

export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  const { className, text, attrs = {}, on = {} } = options;

  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);

  Object.entries(attrs).forEach(([key, value]) => {
    if (value === false || value === null || value === undefined) return;
    // Jangan pernah memasang URL dengan skema di luar allowlist (javascript:, data:, ...).
    if (!isSafeAttribute(key, value)) return;
    node.setAttribute(key, value === true ? '' : String(value));
  });
  Object.entries(on).forEach(([event, handler]) => node.addEventListener(event, handler));

  const list = Array.isArray(children) ? children : [children];
  list.filter(Boolean).forEach((child) => node.append(child));
  return node;
}

function storageAlert(message) {
  if (!message) return null;
  return el('div', { className: 'storage-alert', attrs: { role: 'alert' } }, [
    el('strong', { text: 'Pemulihan data' }),
    el('span', { text: message }),
  ]);
}

export function createShell(root, appName) {
  root.replaceChildren();

  const skipLink = el('a', {
    className: 'skip-link',
    text: 'Lewati ke konten',
    attrs: { href: '#main' },
  });

  const brand = el('a', { className: 'brand', attrs: { href: '#/' } }, [
    el('span', { className: 'brand-mark', text: '≈', attrs: { 'aria-hidden': 'true' } }),
    el('span', { text: appName }),
  ]);

  const badge = el('span', {
    className: 'badge',
    text: '0',
    attrs: { 'aria-label': 'Jumlah destinasi di wishlist' },
  });

  const nav = el('nav', { className: 'nav', attrs: { 'aria-label': 'Navigasi utama' } }, [
    el('a', { className: 'nav-link', text: 'Beranda', attrs: { href: '#/' } }),
    el('a', { className: 'nav-link', text: 'Destinasi', attrs: { href: '#/' } }),
    el('a', { className: 'nav-link', text: 'Peta', attrs: { href: '#/' } }),
    el('a', { className: 'nav-link', attrs: { href: '#/wishlist' } }, [
      el('span', { text: 'Wishlist ' }),
      badge,
    ]),
    el('a', { className: 'nav-link', text: 'Tentang', attrs: { href: '#/about' } }),
    el('a', { className: 'nav-link nav-link--admin', text: 'Dashboard', attrs: { href: '#/dashboard' } }),
  ]);

  const navToggle = el('button', {
    className: 'nav-toggle',
    text: '☰',
    attrs: { type: 'button', 'aria-label': 'Buka menu', 'aria-expanded': 'false' },
    on: {
      click: () => {
        const open = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      },
    },
  });

  const header = el('header', { className: 'site-header' }, [
    el('div', { className: 'header-inner' }, [brand, navToggle, nav]),
  ]);

  const main = el('main', { attrs: { id: 'main', tabindex: '-1' } });
  const toastHost = el('div', { className: 'toast-host', attrs: { 'aria-live': 'polite' } });

  const footer = el('footer', { className: 'site-footer' }, [
    el('p', {
      text: `${appName} · Data contoh, koordinat dan info akses wajib diverifikasi lapangan.`,
    }),
    el('p', { text: 'Peta © OpenStreetMap contributors. Tanpa API key, tanpa login.' }),
  ]);

  root.append(skipLink, header, main, toastHost, footer);
  return { main, badge, toastHost };
}

function selectField(label, name, options, value, onChange) {
  const select = el('select', {
    attrs: { id: `filter-${name}`, name },
    on: { change: (event) => onChange({ [name]: event.target.value }) },
  });

  options.forEach((option) => {
    const item = typeof option === 'string' ? { value: option, label: option } : option;
    select.append(
      el('option', {
        text: item.label,
        attrs: { value: item.value, selected: item.value === value },
      }),
    );
  });

  return el('div', { className: 'field' }, [
    el('label', { text: label, attrs: { for: `filter-${name}` } }),
    select,
  ]);
}

const STATUS_PEMESANAN_DINONAKTIFKAN = new Set(['Penuh', 'Tidak Tersedia']);

function accessStatusClass(statusAkses) {
  const daftar = {
    Tersedia: 'tersedia',
    'Kuota Terbatas': 'terbatas',
    Penuh: 'penuh',
    'Tidak Tersedia': 'tidak-tersedia',
  };
  return daftar[statusAkses] || 'netral';
}

function accessStatusBadge(product) {
  return el('span', {
    className: `status-akses status-akses--${accessStatusClass(product.statusAkses)}`,
    text: product.statusAkses || 'Status tidak diketahui',
  });
}

function destinationImage(product, className = 'card-image') {
  if (!product.imageUrl) {
    return el('span', {
      className: 'card-wave',
      text: '≈',
      attrs: { role: 'img', 'aria-label': 'Ilustrasi laut' },
    });
  }

  return el('img', {
    className,
    attrs: {
      src: product.imageUrl,
      alt: `Ilustrasi ${product.nama}`,
      loading: 'lazy',
    },
  });
}

function createWhatsAppButton(product) {
  let disabled = STATUS_PEMESANAN_DINONAKTIFKAN.has(product.statusAkses);
  let reason = '';

  if (disabled) {
    reason = product.statusAkses === 'Penuh'
      ? 'Kuota penuh — pemesanan dinonaktifkan.'
      : 'Tidak tersedia — pemesanan dinonaktifkan.';
  }

  let href = '';
  if (!disabled) {
    try {
      href = buildWhatsAppUrl(WHATSAPP_CONFIG.number, product);
    } catch {
      disabled = true;
      reason = 'Nomor WhatsApp admin belum valid.';
    }
  }

  const attrs = disabled
    ? {
        type: 'button',
        disabled: true,
        'aria-disabled': 'true',
        title: reason,
      }
    : {
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: `Hubungi ${WHATSAPP_CONFIG.label} via WhatsApp`,
      };

  return el(disabled ? 'button' : 'a', {
    className: `button button--whatsapp${disabled ? ' is-disabled' : ''}`,
    text: 'Pesan via WhatsApp',
    attrs: {
      ...attrs,
      'aria-label': disabled
        ? `${product.nama}: ${reason}`
        : `Pesan paket ${product.nama} via WhatsApp`,
    },
    on: { click: (event) => event.stopPropagation() },
  });
}

function destinationCard(product, { saved, onOpen, onWishlist }) {
  let card;

  const wishlistButton = el('button', {
    className: `icon-button${saved ? ' is-saved' : ''}`,
    text: saved ? '♥' : '♡',
    attrs: {
      type: 'button',
      'aria-label': saved
        ? `Hapus ${product.nama} dari wishlist`
        : `Simpan ${product.nama} ke wishlist`,
      'aria-pressed': String(saved),
    },
    on: {
      click: (event) => {
        event.stopPropagation();
        onWishlist(product.id);
      },
    },
  });

  const actions = el(
    'div',
    { className: 'card-actions', on: { click: (event) => event.stopPropagation() } },
    [createWhatsAppButton(product)],
  );

  card = el(
    'article',
    {
      className: 'card',
      attrs: { tabindex: '0', role: 'button', 'aria-label': `Lihat detail ${product.nama}` },
      on: {
        click: () => onOpen(product, card),
        keydown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen(product, card);
          }
        },
      },
    },
    [
      el('div', { className: 'card-media' }, [
        destinationImage(product),
        wishlistButton,
      ]),
      el('div', { className: 'card-body' }, [
        el('div', { className: 'badges' }, [
          el('span', {
            className: `status status--${product.statusPopularitas === 'Hidden Gem' ? 'hidden' : 'popular'}`,
            text: product.statusPopularitas,
          }),
          el('span', { className: 'status status--kategori', text: product.kategori || '-' }),
          product.unggulan ? el('span', { className: 'status status--featured', text: 'Unggulan' }) : null,
          accessStatusBadge(product),
        ]),
        el('h3', { className: 'card-title', text: product.nama }),
        el('p', { className: 'card-meta', text: `${product.wilayahPulau} · ${product.provinsi}` }),
        el('p', { className: 'card-meta', text: `${product.jenisObjek} · ${product.levelKeahlian}` }),
        el('p', {
          className: 'card-meta',
          text: `Sisa kuota: ${Number.isInteger(product.kuota) ? product.kuota : 0} slot`,
        }),
        el('div', { className: 'card-price' }, [
          el('span', { text: 'Estimasi biaya' }),
          el('strong', { text: formatRupiah(product.estimasiBiaya) }),
        ]),
        actions,
      ]),
    ],
  );

  return card;
}

let mapInstance = null;
let markerLayer = null;
let mapElement = null;

function createMarkerIcon(product) {
  const hidden = product.statusPopularitas === 'Hidden Gem';
  return L.divIcon({
    className: `map-pin ${hidden ? 'map-pin--hidden' : 'map-pin--popular'}`,
    html: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function mountMap(element, products, onOpen) {
  // renderHome selalu membuat kontainer baru; instans lama harus dibersihkan
  // agar marker tidak menumpuk saat data CRUD berubah.
  if (mapInstance && mapElement !== element) {
    mapInstance.remove();
    mapInstance = null;
    markerLayer = null;
    mapElement = null;
  }

  if (!mapInstance) {
    mapInstance = L.map(element, { scrollWheelZoom: false }).setView([-2.4, 117], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance);
    markerLayer = L.layerGroup().addTo(mapInstance);
    mapElement = element;
  }

  markerLayer.clearLayers();

  products.forEach((product) => {
    const marker = L.marker([product.latitude, product.longitude], {
      icon: createMarkerIcon(product),
      title: product.nama,
    }).addTo(markerLayer);

    const popup = el('div', {}, [
      product.imageUrl ? destinationImage(product, 'popup-image') : null,
      el('strong', { text: product.nama }),
      el('br'),
      el('span', {
        text: `${product.statusPopularitas} · ${product.kategori} · ${Number.isInteger(product.kuota) ? product.kuota : 0} slot`,
      }),
      el('br'),
      el('a', {
        text: 'Lihat detail',
        className: 'popup-link',
        attrs: { href: '#/' },
        on: {
          click: (event) => {
            event.preventDefault();
            onOpen(product, event.currentTarget);
          },
        },
      }),
    ]);

    marker.bindPopup(popup);
  });

  if (products.length > 0) {
    mapInstance.fitBounds(markerLayer.getBounds(), { padding: [24, 24] });
  } else {
    mapInstance.setView([-2.4, 117], 4);
  }

  // Leaflet perlu menghitung ulang ukuran saat kontainer dibuat ulang.
  requestAnimationFrame(() => mapInstance.invalidateSize());
}

// Tampilan home dipertahankan antar-render. Hanya bagian dinamis (kartu,
// marker, jumlah hasil, dan ringkasan) yang diperbarui agar input pencarian
// tidak diciptakan ulang—fokus dan posisi kursor pengguna tetap aman.
const homeViews = new WeakMap();

function syncInputValue(input, value) {
  const next = String(value ?? '');
  if (input.value !== next) input.value = next;
}

function buildHomeView(container) {
  const refs = { handlers: {} };

  const alertSlot = el('div', { className: 'home-alert-slot' });
  const searchInput = el('input', {
    attrs: {
      id: 'q',
      name: 'q',
      type: 'search',
      placeholder: 'Cari nama, wilayah, atau tips lokal…',
      autocomplete: 'off',
    },
    on: { input: (event) => refs.handlers.onChange?.({ q: event.target.value }) },
  });

  const heroSubtitle = el('p');
  const chipTotal = el('span', { className: 'chip' });
  const chipHidden = el('span', { className: 'chip' });
  const chipPopuler = el('span', { className: 'chip' });
  const hero = el('section', { className: 'hero' }, [
    el('div', { className: 'hero-copy' }, [
      el('h1', { text: 'Temukan hidden gems bahari Bali.' }),
      heroSubtitle,
      el('div', { className: 'hero-search' }, [
        el('label', { className: 'sr-only', text: 'Cari destinasi', attrs: { for: 'q' } }),
        searchInput,
        el('a', { className: 'button button--primary', text: 'Jelajahi', attrs: { href: '#destinasi' } }),
      ]),
      el('div', { className: 'chips', attrs: { 'aria-label': 'Ringkasan katalog' } }, [
        chipTotal,
        chipHidden,
        chipPopuler,
      ]),
    ]),
  ]);

  const mirrorInput = el('input', {
    attrs: {
      id: 'q-filter',
      type: 'search',
      placeholder: 'Nama, kategori, wilayah, atau catatan lokal',
    },
    on: { input: (event) => refs.handlers.onChange?.({ q: event.target.value }) },
  });

  const onChange = (patch) => refs.handlers.onChange?.(patch);
  const controls = el('section', { className: 'controls', attrs: { 'aria-label': 'Filter dan pengurutan' } }, [
    el('div', { className: 'field field--search' }, [
      el('label', { text: 'Cari', attrs: { for: 'q-filter' } }),
      mirrorInput,
    ]),
    selectField('Kategori', 'kategori', [{ value: '', label: 'Semua kategori' }, ...KATEGORI_BAHARI], '', onChange),
    selectField('Wilayah', 'wilayah', [{ value: '', label: 'Semua wilayah' }, ...WILAYAH_PULAU], '', onChange),
    selectField('Status', 'status', [{ value: '', label: 'Semua status' }, ...STATUS_POPULARITAS], '', onChange),
    selectField('Urutkan', 'sort', SORT_OPTIONS, DEFAULT_UI_STATE.sort, onChange),
    el('button', {
      className: 'button button--ghost',
      text: 'Reset',
      attrs: { type: 'button' },
      on: { click: () => refs.handlers.onReset?.() },
    }),
  ]);

  const notice = el('p');
  const mapElementNode = el('div', {
    className: 'map',
    attrs: { id: 'peta', role: 'application', 'aria-label': 'Peta sebaran destinasi' },
  });
  const mapEmpty = el('div', {
    className: 'map-empty',
    text: 'Tidak ada marker untuk filter ini.',
    attrs: { hidden: true },
  });
  const mapCard = el('section', { className: 'map-card' }, [
    el('div', { className: 'section-heading' }, [
      el('h2', { text: 'Peta sebaran destinasi' }),
      el('p', { text: 'Klik marker untuk melihat detail.' }),
    ]),
    el('div', { className: 'legend' }, [
      el('span', { className: 'legend-item', text: '● Populer' }),
      el('span', { className: 'legend-item', text: '◆ Hidden Gem' }),
    ]),
    mapElementNode,
    mapEmpty,
  ]);

  const grid = el('div', { className: 'card-grid' });
  const catalog = el('section', { className: 'catalog', attrs: { id: 'destinasi' } }, [
    el('div', { className: 'section-heading' }, [
      el('h2', { text: 'Destinasi' }),
      el('p', { text: 'Pilih kartu untuk membaca detail dan tips lokal.' }),
    ]),
    notice,
    grid,
  ]);

  container.replaceChildren(alertSlot, hero, controls, mapCard, catalog);

  return {
    ...refs,
    alertSlot,
    searchInput,
    mirrorInput,
    heroSubtitle,
    chipTotal,
    chipHidden,
    chipPopuler,
    categorySelect: controls.querySelector('#filter-kategori'),
    wilayahSelect: controls.querySelector('#filter-wilayah'),
    statusSelect: controls.querySelector('#filter-status'),
    sortSelect: controls.querySelector('#filter-sort'),
    notice,
    mapElementNode,
    mapEmpty,
    grid,
  };
}

export function renderHome(container, options) {
  const { products, result, state, summary, wishlistIds, handlers, storageNotice = '' } = options;

  let refs = homeViews.get(container);
  if (!refs || !container.contains(refs.mapElementNode)) {
    refs = buildHomeView(container);
    homeViews.set(container, refs);
  }
  refs.handlers = handlers;

  syncInputValue(refs.searchInput, state.q);
  syncInputValue(refs.mirrorInput, state.q);
  refs.categorySelect.value = state.kategori;
  refs.wilayahSelect.value = state.wilayah;
  refs.statusSelect.value = state.status;
  refs.sortSelect.value = state.sort;

  refs.heroSubtitle.textContent = `${summary.total} destinasi bahari populer di Bali, empat kategori, estimasi biaya, dan status kuota yang mudah dipindai.`;
  refs.chipTotal.textContent = `${summary.total} destinasi`;
  refs.chipHidden.textContent = `${summary.hidden} hidden gems`;
  refs.chipPopuler.textContent = `${summary.populer} populer`;

  refs.alertSlot.replaceChildren(...(storageNotice ? [storageAlert(storageNotice)] : []));

  if (result.shortQuery) {
    refs.notice.className = 'notice';
    refs.notice.textContent = 'Ketik minimal 2 karakter untuk mencari. Filter kategori, wilayah, dan status tetap diterapkan.';
  } else {
    refs.notice.className = 'result-count';
    refs.notice.textContent = `Menampilkan ${result.items.length} dari ${products.length} destinasi`;
  }

  const cards = result.items.map((product) =>
    destinationCard(product, {
      saved: wishlistIds.has(product.id),
      onOpen: handlers.onOpen,
      onWishlist: handlers.onWishlist,
    }),
  );

  if (result.items.length === 0) {
    cards.push(
      el('div', { className: 'empty-state' }, [
        el('h3', { text: 'Belum ada yang cocok' }),
        el('p', { text: 'Coba ubah kata kunci atau reset filter.' }),
        el('button', {
          className: 'button button--primary',
          text: 'Reset filter',
          attrs: { type: 'button' },
          on: { click: () => handlers.onReset() },
        }),
      ]),
    );
  }
  refs.grid.replaceChildren(...cards);
  refs.mapEmpty.hidden = result.items.length !== 0;

  mountMap(refs.mapElementNode, result.items, handlers.onOpen);
}

export function renderWishlistPage(container, { products, wishlist, handlers }) {
  container.replaceChildren();

  const grid = el('div', { className: 'card-grid' });
  products.forEach((product) => {
    grid.append(
      destinationCard(product, {
        saved: true,
        onOpen: handlers.onOpen,
        onWishlist: handlers.onWishlist,
      }),
    );
  });

  container.append(
    el('section', { className: 'page' }, [
      el('h1', { text: 'Wishlist saya' }),
      el('p', { className: 'page-subtitle', text: 'Disimpan di perangkat ini — tidak memerlukan akun.' }),
      products.length === 0
        ? el('div', { className: 'empty-state' }, [
            el('h2', { text: 'Wishlist masih kosong' }),
            el('p', { text: 'Simpan destinasi favorit dari halaman beranda.' }),
            el('a', { className: 'button button--primary', text: 'Jelajahi destinasi', attrs: { href: '#/' } }),
          ])
        : el('p', { className: 'result-count', text: `${wishlist.length} destinasi tersimpan` }),
      grid,
    ]),
  );
}

export function renderAboutPage(container, { appName }) {
  container.replaceChildren();

  const cards = [
    ['Tujuan', 'Latihan analisis dan rekayasa web statis selama satu hari.'],
    ['Data contoh', '8 destinasi nonpribadi; koordinat dan info akses wajib diverifikasi lapangan.'],
    ['Cara pakai', 'Cari, filter kategori, simpan wishlist, centang checklist, dan pesan paket via WhatsApp.'],
    ['Teknologi', 'Vite, JavaScript vanilla, Leaflet.js, OpenStreetMap, dan localStorage.'],
  ].map(([title, body]) =>
    el('article', { className: 'info-card' }, [el('h2', { text: title }), el('p', { text: body })]),
  );

  container.append(
    el('section', { className: 'page' }, [
      el('h1', { text: `Tentang ${appName}` }),
      el('p', { className: 'page-subtitle', text: 'Direktori wisata laut untuk latihan satu hari.' }),
      el('div', { className: 'info-grid' }, cards),
      el('div', { className: 'disclaimer' }, [
        el('strong', { text: 'Disclaimer' }),
        el('p', {
          text: 'Seluruh koordinat, deskripsi, info akses, dan catatan lokal adalah data contoh. Verifikasi dengan sumber lapangan sebelum digunakan untuk perjalanan nyata.',
        }),
      ]),
    ]),
  );
}

const DASHBOARD_FORM_GROUPS = [
  {
    title: 'Identitas',
    fields: [
      { name: 'nama', label: 'Nama destinasi', type: 'text', placeholder: 'Contoh: Bunaken' },
      { name: 'provinsi', label: 'Provinsi', type: 'text', placeholder: 'Contoh: Sulawesi Utara' },
    ],
  },
  {
    title: 'Klasifikasi & operasional',
    fields: [
      { name: 'wilayahPulau', label: 'Wilayah pulau', type: 'select', options: WILAYAH_PULAU },
      { name: 'jenisObjek', label: 'Jenis objek', type: 'select', options: JENIS_OBJEK },
      { name: 'kategori', label: 'Kategori bahari', type: 'select', options: KATEGORI_BAHARI },
      { name: 'statusAkses', label: 'Status akses', type: 'select', options: STATUS_AKSES },
      { name: 'statusPopularitas', label: 'Status popularitas', type: 'select', options: STATUS_POPULARITAS },
      { name: 'levelKeahlian', label: 'Level keahlian', type: 'select', options: LEVEL_KEAHLIAN },
      { name: 'estimasiBiaya', label: 'Estimasi biaya (Rp)', type: 'number', min: 0, step: 'any' },
      { name: 'kuota', label: 'Kuota / slot', type: 'number', min: 0, step: 1 },
    ],
  },
  {
    title: 'Narasi & checklist',
    fields: [
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', full: true },
      { name: 'infoAkses', label: 'Info akses', type: 'textarea', full: true },
      { name: 'waktuTerbaik', label: 'Waktu terbaik', type: 'text', full: true },
      { name: 'catatanLokal', label: 'Catatan lokal', type: 'textarea', full: true },
      {
        name: 'checklistBawaan',
        label: 'Checklist bawaan',
        type: 'textarea',
        full: true,
        hint: 'Satu item per baris, minimal 1 item.',
      },
    ],
  },
  {
    title: 'Koordinat, gambar & unggulan',
    fields: [
      { name: 'latitude', label: 'Latitude', type: 'number', step: 'any' },
      { name: 'longitude', label: 'Longitude', type: 'number', step: 'any' },
      {
        name: 'imageUrl',
        label: 'Path gambar lokal',
        type: 'text',
        placeholder: 'Kosongkan untuk placeholder',
        hint: 'Path lokal saja; URL eksternal ditolak.',
      },
      { name: 'unggulan', label: 'Tandai sebagai unggulan', type: 'checkbox' },
    ],
  },
];

function dashboardFormControl(field, values, errors, onChange) {
  const id = `form-${field.name}`;
  const value = values[field.name] ?? '';
  const error = errors[field.name] || '';
  const handleChange = (event) => {
    const nextValue = field.type === 'checkbox' ? event.target.checked : event.target.value;
    onChange(field.name, nextValue);
  };

  let control;
  if (field.type === 'select') {
    control = el('select', { attrs: { id, name: field.name }, on: { change: handleChange } }, [
      el('option', { text: 'Pilih…', attrs: { value: '', selected: value === '' } }),
      ...field.options.map((option) =>
        el('option', {
          text: option,
          attrs: { value: option, selected: value === option },
        }),
      ),
    ]);
  } else if (field.type === 'textarea') {
    control = el('textarea', {
      text: value,
      attrs: { id, name: field.name, rows: 3, placeholder: field.placeholder || '' },
      on: { input: handleChange },
    });
  } else if (field.type === 'checkbox') {
    control = el('input', {
      attrs: { id, name: field.name, type: 'checkbox', checked: value === true },
      on: { change: handleChange },
    });
  } else {
    control = el('input', {
      attrs: {
        id,
        name: field.name,
        type: field.type,
        value: String(value),
        placeholder: field.placeholder || '',
        min: field.min,
        step: field.step,
      },
      on: { input: handleChange },
    });
  }

  const label = field.type === 'checkbox'
    ? el('label', { className: 'check-label', attrs: { for: id } }, [control, el('span', { text: field.label })])
    : el('label', { text: field.label, attrs: { for: id } });

  return el('div', {
    className: `field${field.full ? ' field--full' : ''}${error ? ' has-error' : ''}`,
  }, [
    label,
    ...(field.type === 'checkbox' ? [] : [control]),
    field.hint ? el('small', { className: 'field-hint', text: field.hint }) : null,
    el('p', {
      className: 'field-error',
      text: error,
      attrs: { 'data-error-for': field.name, role: error ? 'alert' : null },
    }),
  ]);
}

function dashboardRowActions(product, handlers) {
  return el('div', { className: 'admin-actions' }, [
    el('button', {
      className: 'button button--small button--ghost',
      text: 'Edit',
      attrs: { type: 'button' },
      on: { click: () => handlers.onEditProduct(product.id) },
    }),
    el('button', {
      className: 'button button--small button--ghost button--toggle',
      text: product.unggulan ? 'Unggulan ✓' : 'Jadikan unggulan',
      attrs: { type: 'button', 'aria-pressed': String(Boolean(product.unggulan)) },
      on: { click: () => handlers.onToggleFeatured(product.id) },
    }),
    el('button', {
      className: 'button button--small button--danger',
      text: 'Hapus',
      attrs: { type: 'button' },
      on: { click: () => handlers.onDeleteProduct(product.id) },
    }),
    el('button', {
      className: 'button button--small button--link',
      text: 'Detail',
      attrs: { type: 'button' },
      on: { click: (event) => handlers.onOpen(product, event.currentTarget) },
    }),
  ]);
}

export function renderDashboardPage(container, { products, summary, handlers, form, notice = '' }) {
  container.replaceChildren();

  const activeForm = form || { id: '', values: {}, errors: {} };
  const summaryCards = [
    ['Total destinasi', summary.total],
    ['Total kuota/slot', summary.totalKuota],
    ['Hidden Gem', summary.hidden],
    ['Populer', summary.populer],
  ].map(([label, value]) =>
    el('article', { className: 'summary-card' }, [
      el('span', { text: label }),
      el('strong', { text: String(value) }),
    ]),
  );

  const categorySummary = el(
    'div',
    { className: 'category-summary', attrs: { 'aria-label': 'Jumlah destinasi per kategori bahari' } },
    summary.kategori.map((item) =>
      el('article', { className: 'category-chip' }, [
        el('span', { text: item.nama }),
        el('strong', { text: String(item.jumlah) }),
      ]),
    ),
  );

  const importInput = el('input', {
    className: 'sr-only',
    attrs: {
      type: 'file',
      id: 'import-json',
      accept: 'application/json,.json',
    },
    on: {
      change: (event) => {
        const file = event.target.files?.[0];
        if (file) handlers.onImportProducts(file);
        event.target.value = '';
      },
    },
  });

  const toolbar = el('div', { className: 'dashboard-toolbar' }, [
    el('button', {
      className: 'button button--primary',
      text: 'Tambah destinasi',
      attrs: { type: 'button' },
      on: { click: handlers.onStartAdd },
    }),
    el('button', {
      className: 'button button--ghost',
      text: 'Export JSON',
      attrs: { type: 'button' },
      on: { click: handlers.onExportProducts },
    }),
    el('label', { className: 'button button--ghost', text: 'Import JSON', attrs: { for: 'import-json' } }),
    importInput,
    el('button', {
      className: 'button button--danger',
      text: 'Reset demo',
      attrs: { type: 'button' },
      on: { click: handlers.onResetAll },
    }),
  ]);

  const tableBody = el('tbody');
  const mobileList = el('div', { className: 'admin-mobile-list' });

  products.forEach((product) => {
    tableBody.append(
      el('tr', {}, [
        el('td', {}, [
          el('strong', { text: product.nama }),
          el('small', { className: 'cell-hint', text: formatRupiah(product.estimasiBiaya) }),
        ]),
        el('td', { text: product.kategori || '-' }),
        el('td', { text: `${Number.isInteger(product.kuota) ? product.kuota : 0} slot` }),
        el('td', { text: product.wilayahPulau }),
        el('td', {}, [accessStatusBadge(product)]),
        el('td', { text: product.unggulan ? 'Ya' : 'Tidak' }),
        el('td', {}, [dashboardRowActions(product, handlers)]),
      ]),
    );

    mobileList.append(
      el('article', { className: 'admin-row' }, [
        el('div', {}, [
          el('h3', { text: product.nama }),
          el('p', { className: 'card-meta', text: `${product.kategori} · ${product.wilayahPulau}` }),
          el('p', {
            className: 'card-meta',
            text: `${formatRupiah(product.estimasiBiaya)} · ${Number.isInteger(product.kuota) ? product.kuota : 0} slot`,
          }),
          el('div', { className: 'badges' }, [
            accessStatusBadge(product),
            product.unggulan ? el('span', { className: 'status status--featured', text: 'Unggulan' }) : null,
          ]),
        ]),
        dashboardRowActions(product, handlers),
      ]),
    );
  });

  const tableWrap = el('div', { className: 'admin-table-wrap' }, [
    el('table', { className: 'admin-table' }, [
      el('thead', {}, [
        el('tr', {}, [
          el('th', { text: 'Nama & biaya' }),
          el('th', { text: 'Kategori' }),
          el('th', { text: 'Kuota' }),
          el('th', { text: 'Wilayah' }),
          el('th', { text: 'Status akses' }),
          el('th', { text: 'Unggulan' }),
          el('th', { text: 'Aksi' }),
        ]),
      ]),
      tableBody,
    ]),
  ]);

  const formGroups = DASHBOARD_FORM_GROUPS.map((group) =>
    el('fieldset', { className: 'form-section' }, [
      el('legend', { text: group.title }),
      el(
        'div',
        { className: 'form-grid' },
        group.fields.map((field) =>
          dashboardFormControl(field, activeForm.values, activeForm.errors, handlers.onFormChange),
        ),
      ),
    ]),
  );

  const productForm = el('form', {
    className: 'product-form',
    attrs: { id: 'product-form', novalidate: true },
    on: { submit: handlers.onFormSubmit },
  }, [
    el('div', { className: 'form-heading' }, [
      el('h2', {
        text: activeForm.id ? `Edit destinasi — ${activeForm.id}` : 'Tambah destinasi',
      }),
      activeForm.id
        ? el('button', {
            className: 'button button--small button--ghost',
            text: 'Batal edit',
            attrs: { type: 'button' },
            on: { click: handlers.onCancelEdit },
          })
        : null,
    ]),
    ...formGroups,
    el('div', { className: 'form-actions' }, [
      el('button', {
        className: 'button button--primary',
        text: activeForm.id ? 'Simpan perubahan' : 'Tambah destinasi',
        attrs: { type: 'submit' },
      }),
      el('button', {
        className: 'button button--ghost',
        text: 'Kosongkan form',
        attrs: { type: 'button' },
        on: { click: handlers.onStartAdd },
      }),
    ]),
  ]);

  container.append(
    el('section', { className: 'page dashboard-page' }, [
      storageAlert(notice),
      el('h1', { text: 'Dashboard demo' }),
      el('p', {
        className: 'page-subtitle',
        text: 'Tanpa login. Perubahan langsung tersimpan di localStorage dan tampak di katalog serta peta.',
      }),
      el('p', {
        className: 'storage-key',
        text: 'Key penyimpanan: oasisbahari:products:v1',
      }),
      el('div', { className: 'summary-grid' }, summaryCards),
      categorySummary,
      toolbar,
      el('section', { className: 'dashboard-section' }, [
        el('h2', { text: 'Daftar destinasi wisata' }),
        tableWrap,
        mobileList,
        products.length === 0
          ? el('div', { className: 'empty-state' }, [
              el('h3', { text: 'Belum ada destinasi' }),
              el('p', { text: 'Tambah destinasi baru atau reset ke data contoh.' }),
            ])
          : null,
      ]),
      productForm,
    ]),
  );
}

export function openDetailModal(product, options = {}) {
  const {
    trigger,
    saved = false,
    checklist = { checkedItems: [], customItems: [] },
    onClose,
    onWishlist,
    onChecklistChange,
  } = options;

  const previousFocus = trigger || document.activeElement;
  const state = {
    checkedItems: new Set(checklist.checkedItems),
    customItems: [...checklist.customItems],
  };

  const backdrop = el('div', { className: 'modal-backdrop' });
  const closeButton = el('button', {
    className: 'icon-button modal-close',
    text: '×',
    attrs: { type: 'button', 'aria-label': 'Tutup detail' },
  });

  const dialog = el('div', {
    className: 'modal',
    attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'detail-title' },
  });

  const checklistList = el('ul', { className: 'checklist' });
  const checklistError = el('p', { className: 'field-error', attrs: { role: 'alert' } });

  function items() {
    return [...product.checklistBawaan, ...state.customItems];
  }

  function syncChecklist() {
    checklistList.replaceChildren();
    items().forEach((item, index) => {
      const checkbox = el('input', {
        attrs: {
          type: 'checkbox',
          id: `check-${index}`,
          checked: state.checkedItems.has(item),
        },
        on: {
          change: (event) => {
            if (event.target.checked) state.checkedItems.add(item);
            else state.checkedItems.delete(item);
            onChecklistChange?.({ checkedItems: [...state.checkedItems], customItems: state.customItems });
          },
        },
      });

      checklistList.append(
        el('li', {}, [
          el('label', { className: 'check-label', attrs: { for: `check-${index}` } }, [checkbox, el('span', { text: item })]),
        ]),
      );
    });
  }

  const newItemInput = el('input', {
    attrs: { type: 'text', placeholder: 'Tambah item…', 'aria-label': 'Item checklist baru' },
  });

  const addItem = () => {
    const value = newItemInput.value.trim();
    if (!value) {
      checklistError.textContent = 'Item tidak boleh kosong.';
      return;
    }
    if (items().includes(value)) {
      checklistError.textContent = 'Item sudah ada.';
      return;
    }
    state.customItems.push(value);
    newItemInput.value = '';
    checklistError.textContent = '';
    syncChecklist();
    onChecklistChange?.({ checkedItems: [...state.checkedItems], customItems: state.customItems });
  };

  let isSaved = saved;
  const wishlistButton = el('button', {
    className: 'button button--primary',
    text: isSaved ? 'Hapus dari wishlist' : 'Simpan ke wishlist',
    attrs: { type: 'button' },
    on: {
      click: () => {
        onWishlist?.(product.id);
        isSaved = !isSaved;
        wishlistButton.textContent = isSaved ? 'Hapus dari wishlist' : 'Simpan ke wishlist';
      },
    },
  });

  dialog.append(
    el('div', { className: 'modal-header' }, [
      el('div', { className: 'modal-media', attrs: { role: 'img', 'aria-label': 'Ilustrasi laut' } }, [
        el('span', { text: '≈', attrs: { 'aria-hidden': 'true' } }),
      ]),
      closeButton,
      el('h2', { text: product.nama, attrs: { id: 'detail-title' } }),
      el('div', { className: 'badges' }, [
        el('span', {
          className: `status status--${product.statusPopularitas === 'Hidden Gem' ? 'hidden' : 'popular'}`,
          text: product.statusPopularitas,
        }),
        el('span', { className: 'status status--kategori', text: product.kategori || '-' }),
        el('span', { className: 'status status--level', text: product.levelKeahlian }),
        product.unggulan ? el('span', { className: 'status status--featured', text: 'Unggulan' }) : null,
        accessStatusBadge(product),
      ]),
    ]),
    el('div', { className: 'modal-body' }, [
      el('p', { text: product.deskripsi }),
      el('div', { className: 'detail-grid' }, [
        el('div', {}, [
          el('h3', { text: 'Kategori & estimasi biaya' }),
          el('p', { text: `${product.kategori || '-'} · ${formatRupiah(product.estimasiBiaya)}` }),
        ]),
        el('div', {}, [
          el('h3', { text: 'Status kuota/akses' }),
          el('p', {
            text: `${product.statusAkses || 'Status tidak diketahui'} · ${Number.isInteger(product.kuota) ? product.kuota : 0} slot`,
          }),
        ]),
        el('div', {}, [el('h3', { text: 'Info akses' }), el('p', { text: product.infoAkses })]),
        el('div', {}, [el('h3', { text: 'Waktu terbaik' }), el('p', { text: product.waktuTerbaik })]),
        el('div', {}, [
          el('h3', { text: 'Koordinat' }),
          el('p', { text: `${product.latitude.toFixed(4)}, ${product.longitude.toFixed(4)}` }),
        ]),
        el('div', {}, [
          el('h3', { text: 'Klasifikasi' }),
          el('p', { text: `${product.wilayahPulau} · ${product.provinsi} · ${product.jenisObjek}` }),
        ]),
      ]),
      el('section', { className: 'local-tips' }, [
        el('h3', { text: 'Tips dari warga lokal' }),
        el('p', { text: product.catatanLokal }),
      ]),
      el('section', { className: 'checklist-section' }, [
        el('h3', { text: 'Packing checklist' }),
        checklistList,
        el('div', { className: 'checklist-add' }, [
          newItemInput,
          el('button', { className: 'button button--ghost', text: 'Tambah', attrs: { type: 'button' }, on: { click: addItem } }),
        ]),
        checklistError,
        el('button', {
          className: 'button button--link',
          text: 'Reset checklist',
          attrs: { type: 'button' },
          on: {
            click: () => {
              state.checkedItems.clear();
              state.customItems = [];
              syncChecklist();
              onChecklistChange?.({ checkedItems: [], customItems: [] });
            },
          },
        }),
      ]),
    ]),
    el('div', { className: 'modal-footer' }, [
      createWhatsAppButton(product),
      wishlistButton,
      el('button', { className: 'button button--ghost', text: 'Tutup', attrs: { type: 'button' }, on: { click: () => close() } }),
    ]),
  );

  function close() {
    document.removeEventListener('keydown', onKeyDown);
    backdrop.remove();
    onClose?.();
    previousFocus?.focus?.();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusables = [...dialog.querySelectorAll('button, input, a[href]')].filter(
      (node) => !node.disabled && node.offsetParent !== null,
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  document.addEventListener('keydown', onKeyDown);

  syncChecklist();
  backdrop.append(dialog);
  document.body.append(backdrop);
  closeButton.focus();
}

export function showToast(host, message, type = 'info', duration = 3500) {
  const toast = el('div', { className: `toast toast--${type}`, text: message });
  host.append(toast);
  window.setTimeout(() => toast.remove(), duration);
}
