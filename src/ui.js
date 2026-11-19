// Semua fungsi render DOM. Data mentah tidak pernah disuntikkan sebagai HTML.

import L from 'leaflet';
import {
  KATEGORI_BAHARI,
  SORT_OPTIONS,
  STATUS_POPULARITAS,
  WILAYAH_PULAU,
  WHATSAPP_CONFIG,
  buildWhatsAppUrl,
  formatRupiah,
} from './products.js';

export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  const { className, text, attrs = {}, on = {} } = options;

  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);

  Object.entries(attrs).forEach(([key, value]) => {
    if (value === false || value === null || value === undefined) return;
    node.setAttribute(key, value === true ? '' : String(value));
  });
  Object.entries(on).forEach(([event, handler]) => node.addEventListener(event, handler));

  const list = Array.isArray(children) ? children : [children];
  list.filter(Boolean).forEach((child) => node.append(child));
  return node;
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
        el('span', {
          className: 'card-wave',
          text: '≈',
          attrs: { role: 'img', 'aria-label': 'Ilustrasi laut' },
        }),
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
  if (mapInstance && mapElement && mapElement.isConnected && mapElement !== element) {
    mapInstance.remove();
    mapInstance = null;
    markerLayer = null;
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
      el('strong', { text: product.nama }),
      el('br'),
      el('span', { text: `${product.statusPopularitas} · ${product.wilayahPulau}` }),
      el('br'),
      el('a', {
        text: 'Lihat detail',
        attrs: { href: '#/', className: 'popup-link' },
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

export function renderHome(container, { products, result, state, summary, wishlistIds, handlers }) {
  container.replaceChildren();

  const searchInput = el('input', {
    attrs: {
      id: 'q',
      name: 'q',
      type: 'search',
      value: state.q,
      placeholder: 'Cari nama, wilayah, atau tips lokal…',
      autocomplete: 'off',
    },
    on: { input: (event) => handlers.onChange({ q: event.target.value }) },
  });

  const hero = el('section', { className: 'hero' }, [
    el('div', { className: 'hero-copy' }, [
      el('h1', { text: 'Temukan hidden gems laut Nusantara.' }),
      el('p', {
        text: 'Delapan destinasi laut, empat kategori bahari, estimasi biaya, dan status kuota yang mudah dipindai.',
      }),
      el('div', { className: 'hero-search' }, [
        el('label', { className: 'sr-only', text: 'Cari destinasi', attrs: { for: 'q' } }),
        searchInput,
        el('a', { className: 'button button--primary', text: 'Jelajahi', attrs: { href: '#destinasi' } }),
      ]),
      el('div', { className: 'chips', attrs: { 'aria-label': 'Ringkasan katalog' } }, [
        el('span', { className: 'chip', text: `${summary.total} destinasi` }),
        el('span', { className: 'chip', text: `${summary.hidden} hidden gems` }),
        el('span', { className: 'chip', text: `${summary.populer} populer` }),
      ]),
    ]),
  ]);

  const controls = el('section', { className: 'controls', attrs: { 'aria-label': 'Filter dan pengurutan' } }, [
    el('div', { className: 'field field--search' }, [
      el('label', { text: 'Cari', attrs: { for: 'q-filter' } }),
      (() => {
        const mirror = el('input', {
          attrs: {
            id: 'q-filter',
            type: 'search',
            value: state.q,
            placeholder: 'Nama, kategori, wilayah, atau catatan lokal',
          },
          on: { input: (event) => handlers.onChange({ q: event.target.value }) },
        });
        return mirror;
      })(),
    ]),
    selectField('Kategori', 'kategori', [{ value: '', label: 'Semua kategori' }, ...KATEGORI_BAHARI], state.kategori, handlers.onChange),
    selectField('Wilayah', 'wilayah', [{ value: '', label: 'Semua wilayah' }, ...WILAYAH_PULAU], state.wilayah, handlers.onChange),
    selectField('Status', 'status', [{ value: '', label: 'Semua status' }, ...STATUS_POPULARITAS], state.status, handlers.onChange),
    selectField('Urutkan', 'sort', SORT_OPTIONS, state.sort, handlers.onChange),
    el('button', {
      className: 'button button--ghost',
      text: 'Reset',
      attrs: { type: 'button' },
      on: { click: handlers.onReset },
    }),
  ]);

  const notice = result.shortQuery
    ? el('p', { className: 'notice', text: 'Ketik minimal 2 karakter untuk mencari. Filter kategori, wilayah, dan status tetap diterapkan.' })
    : el('p', { className: 'result-count', text: `Menampilkan ${result.items.length} dari ${products.length} destinasi` });

  const mapElementNode = el('div', { className: 'map', attrs: { id: 'peta', role: 'application', 'aria-label': 'Peta sebaran destinasi' } });
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
    result.items.length === 0
      ? el('div', { className: 'map-empty', text: 'Tidak ada marker untuk filter ini.' })
      : null,
  ]);

  const grid = el('div', { className: 'card-grid' });
  result.items.forEach((product) => {
    grid.append(
      destinationCard(product, {
        saved: wishlistIds.has(product.id),
        onOpen: handlers.onOpen,
        onWishlist: handlers.onWishlist,
      }),
    );
  });

  if (result.items.length === 0) {
    grid.append(
      el('div', { className: 'empty-state' }, [
        el('h3', { text: 'Belum ada yang cocok' }),
        el('p', { text: 'Coba ubah kata kunci atau reset filter.' }),
        el('button', {
          className: 'button button--primary',
          text: 'Reset filter',
          attrs: { type: 'button' },
          on: { click: handlers.onReset },
        }),
      ]),
    );
  }

  const catalog = el('section', { className: 'catalog', attrs: { id: 'destinasi' } }, [
    el('div', { className: 'section-heading' }, [
      el('h2', { text: 'Destinasi' }),
      el('p', { text: 'Pilih kartu untuk membaca detail dan tips lokal.' }),
    ]),
    notice,
    grid,
  ]);

  container.append(hero, controls, mapCard, catalog);
  mountMap(mapElementNode, result.items, handlers.onOpen);
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

export function renderDashboardPage(container, { products, summary, handlers }) {
  container.replaceChildren();

  const list = el('div', { className: 'admin-list' });
  products.forEach((product) => {
    list.append(
      el('article', { className: 'admin-row' }, [
        el('div', {}, [
          el('h3', { text: product.nama }),
          el('p', { className: 'card-meta', text: `${product.wilayahPulau} · ${product.provinsi}` }),
          el('p', { className: 'card-meta', text: `${product.statusPopularitas} · ${product.levelKeahlian}` }),
          el('p', {
            className: 'card-meta',
            text: `${product.kategori || '-'} · ${formatRupiah(product.estimasiBiaya)} · ${product.statusAkses || '-'}`,
          }),
        ]),
        el('div', { className: 'admin-actions' }, [
          el('button', {
            className: 'button button--ghost',
            text: 'Lihat detail',
            attrs: { type: 'button' },
            on: { click: (event) => handlers.onOpen(product, event.currentTarget) },
          }),
        ]),
      ]),
    );
  });

  container.append(
    el('section', { className: 'page' }, [
      el('h1', { text: 'Dashboard demo' }),
      el('p', { className: 'page-subtitle', text: 'Tanpa login. Perubahan hanya disimpan di perangkat ini.' }),
      el('div', { className: 'summary-grid' }, [
        el('article', { className: 'summary-card' }, [el('span', { text: 'Total destinasi' }), el('strong', { text: String(summary.total) })]),
        el('article', { className: 'summary-card' }, [el('span', { text: 'Hidden Gem' }), el('strong', { text: String(summary.hidden) })]),
        el('article', { className: 'summary-card' }, [el('span', { text: 'Populer' }), el('strong', { text: String(summary.populer) })]),
      ]),
      el('button', {
        className: 'button button--primary',
        text: 'Reset ke data contoh',
        attrs: { type: 'button' },
        on: {
          click: () => {
            if (window.confirm('Reset seluruh data lokal ke 8 destinasi contoh?')) handlers.onResetAll();
          },
        },
      }),
      list,
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
          el('p', { text: product.statusAkses || 'Status tidak diketahui' }),
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

export function showToast(host, message, type = 'info') {
  const toast = el('div', { className: `toast toast--${type}`, text: message });
  host.append(toast);
  window.setTimeout(() => toast.remove(), 3500);
}
