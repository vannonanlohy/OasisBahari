// Entry point: menghubungkan data, penyimpanan, dan render tanpa framework.

import 'leaflet/dist/leaflet.css';
import './style.css';

import {
  APP_NAME,
  DEFAULT_UI_STATE,
  JENIS_OBJEK,
  KATEGORI_BAHARI,
  LEVEL_KEAHLIAN,
  SORT_OPTIONS,
  STORAGE_KEYS,
  STATUS_AKSES,
  STATUS_POPULARITAS,
  WILAYAH_PULAU,
  createProductId,
  filterProducts,
  getSummary,
  normalizeProductInput,
  validateProduct,
  validateProducts,
} from './products.js';
import * as store from './store.js';
import {
  createShell,
  openDetailModal,
  renderAboutPage,
  renderDashboardPage,
  renderHome,
  renderWishlistPage,
  showToast,
} from './ui.js';

const root = document.querySelector('#app');
const shell = createShell(root, APP_NAME);

// getProducts() memicu validasi localStorage. Ambil notifikasi pemulihannya sekali.
const bootProducts = store.getProducts();
let storageNotice = store.consumeLoadNotice();
store.removeMissingWishlistItems(bootProducts);

let uiState = readStateFromUrl();
let productForm = emptyProductForm();

function emptyProductForm() {
  return {
    id: '',
    values: {
      nama: '',
      provinsi: '',
      wilayahPulau: WILAYAH_PULAU[0],
      jenisObjek: JENIS_OBJEK[0],
      kategori: KATEGORI_BAHARI[0],
      statusAkses: STATUS_AKSES[0],
      statusPopularitas: STATUS_POPULARITAS[0],
      levelKeahlian: LEVEL_KEAHLIAN[0],
      estimasiBiaya: '',
      kuota: '',
      deskripsi: '',
      infoAkses: '',
      waktuTerbaik: '',
      catatanLokal: '',
      checklistBawaan: '',
      latitude: '',
      longitude: '',
      imageUrl: '',
      unggulan: false,
    },
    errors: {},
  };
}

function productToFormValues(product) {
  return {
    ...emptyProductForm().values,
    ...product,
    estimasiBiaya: String(product.estimasiBiaya),
    kuota: String(product.kuota),
    latitude: String(product.latitude),
    longitude: String(product.longitude),
    checklistBawaan: (product.checklistBawaan || []).join('\n'),
    unggulan: Boolean(product.unggulan),
  };
}

function readStateFromUrl() {
  const params = new URLSearchParams(location.search);
  const sort = params.get('sort');
  const kategori = params.get('kategori');
  return {
    q: params.get('q') || DEFAULT_UI_STATE.q,
    wilayah: params.get('wilayah') || DEFAULT_UI_STATE.wilayah,
    status: params.get('status') || DEFAULT_UI_STATE.status,
    kategori: KATEGORI_BAHARI.includes(kategori) ? kategori : DEFAULT_UI_STATE.kategori,
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : DEFAULT_UI_STATE.sort,
  };
}

function syncUrl() {
  const params = new URLSearchParams();
  Object.entries(uiState).forEach(([key, value]) => {
    if (value && !(key === 'sort' && value === DEFAULT_UI_STATE.sort)) params.set(key, value);
  });
  const query = params.toString();
  const url = `${location.pathname}${query ? `?${query}` : ''}${location.hash}`;
  history.replaceState(null, '', url);
}

function currentRoute() {
  return location.hash.replace(/^\#\/?/, '') || 'home';
}

function updateBadge() {
  shell.badge.textContent = String(store.getWishlist().length);
}

function focusProductForm() {
  document.getElementById('product-form')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  document.getElementById('form-nama')?.focus?.();
}

function openProduct(product, trigger) {
  openDetailModal(product, {
    trigger,
    saved: store.isWishlisted(product.id),
    checklist: store.getChecklist(product.id),
    onWishlist: (id) => handlers.onWishlist(id),
    onChecklistChange: (next) => store.saveChecklist(product.id, next),
  });
}

const handlers = {
  onChange(patch) {
    uiState = { ...uiState, ...patch };
    store.setUIState(uiState);
    syncUrl();
    render();
  },

  onReset() {
    uiState = { ...DEFAULT_UI_STATE };
    store.setUIState(uiState);
    syncUrl();
    render();
    showToast(shell.toastHost, 'Filter dikembalikan ke kondisi awal.', 'info');
  },

  onOpen: openProduct,

  onWishlist(id) {
    const saved = store.toggleWishlist(id);
    updateBadge();
    if (currentRoute() === 'wishlist') render();
    showToast(shell.toastHost, saved ? 'Destinasi disimpan ke wishlist.' : 'Destinasi dihapus dari wishlist.', saved ? 'success' : 'info');
  },

  onStartAdd() {
    productForm = emptyProductForm();
    render();
    focusProductForm();
  },

  onEditProduct(id) {
    const product = store.getProductById(id);
    if (!product) return;
    productForm = { id: product.id, values: productToFormValues(product), errors: {} };
    render();
    focusProductForm();
  },

  onCancelEdit() {
    productForm = emptyProductForm();
    render();
  },

  onFormChange(name, value) {
    productForm.values[name] = value;
    if (!productForm.errors[name]) return;

    delete productForm.errors[name];
    const errorNode = document.querySelector(`[data-error-for="${name}"]`);
    if (errorNode) errorNode.textContent = '';
    errorNode?.closest('.field')?.classList.remove('has-error');
  },

  onFormSubmit(event) {
    event.preventDefault();

    const products = store.getProducts();
    const wasEdit = Boolean(productForm.id);
    const id = productForm.id || createProductId(products);
    const normalized = normalizeProductInput({ ...productForm.values, id });
    const errors = validateProduct(normalized);

    if (errors.length > 0) {
      productForm.errors = errors.reduce((acc, error) => {
        if (error.field) acc[error.field] = error.message;
        return acc;
      }, {});
      render();
      showToast(shell.toastHost, `Validasi gagal: ${errors[0].message}`, 'error', 6000);
      return;
    }

    const nextProducts = store.upsertProduct(normalized);
    if (!nextProducts) {
      showToast(shell.toastHost, 'Gagal menyimpan ke localStorage. Perubahan belum diterapkan.', 'error', 6000);
      return;
    }

    productForm = emptyProductForm();
    store.removeMissingWishlistItems(nextProducts);
    render();
    showToast(shell.toastHost, wasEdit ? 'Perubahan destinasi tersimpan.' : 'Destinasi baru tersimpan.', 'success');
  },

  onDeleteProduct(id) {
    const product = store.getProductById(id);
    if (!product) return;
    if (!window.confirm(`Hapus destinasi "${product.nama}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    const nextProducts = store.deleteProduct(id);
    if (!nextProducts) {
      showToast(shell.toastHost, 'Gagal menyimpan ke localStorage. Destinasi belum dihapus.', 'error', 6000);
      return;
    }

    if (productForm.id === id) productForm = emptyProductForm();
    store.removeMissingWishlistItems(nextProducts);
    render();
    showToast(shell.toastHost, `Destinasi "${product.nama}" dihapus.`, 'info');
  },

  onToggleFeatured(id) {
    const product = store.getProductById(id);
    if (!product) return;

    const updated = { ...product, unggulan: !product.unggulan };
    const nextProducts = store.upsertProduct(updated);
    if (!nextProducts) {
      showToast(shell.toastHost, 'Gagal menyimpan ke localStorage.', 'error', 6000);
      return;
    }

    if (productForm.id === id) productForm.values.unggulan = updated.unggulan;
    render();
    showToast(shell.toastHost, `${updated.nama} ${updated.unggulan ? 'ditandai unggulan.' : 'dihapus dari unggulan.'}`, 'info');
  },

  onExportProducts() {
    const payload = JSON.stringify(store.getProducts(), null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'oasisbahari-products-v1.json';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast(shell.toastHost, 'Export JSON siap diunduh.', 'success');
  },

  async onImportProducts(file) {
    try {
      const text = await file.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        showToast(shell.toastHost, 'Import ditolak: berkas bukan JSON valid.', 'error', 6000);
        return;
      }

      const checked = validateProducts(parsed);
      if (!checked.valid) {
        const first = checked.errors[0];
        showToast(
          shell.toastHost,
          `Import ditolak (${checked.errors.length} masalah): ${first.field} — ${first.message}`,
          'error',
          8000,
        );
        return;
      }

      const saved = store.saveProducts(checked.products);
      if (!saved) {
        showToast(shell.toastHost, 'Gagal menyimpan hasil import ke localStorage.', 'error', 6000);
        return;
      }

      store.removeMissingWishlistItems(checked.products);
      productForm = emptyProductForm();
      render();
      showToast(shell.toastHost, `Import berhasil: ${checked.products.length} destinasi.`, 'success');
    } catch {
      showToast(shell.toastHost, 'Gagal membaca berkas JSON.', 'error', 6000);
    }
  },

  onResetAll() {
    if (!window.confirm('Reset seluruh data demo ke 8 destinasi contoh? Wishlist dan checklist juga dikosongkan.')) return;

    store.resetAll();
    uiState = { ...DEFAULT_UI_STATE };
    productForm = emptyProductForm();
    storageNotice = '';
    syncUrl();
    render();
    showToast(shell.toastHost, 'Data lokal dikembalikan ke 8 destinasi contoh.', 'success');
  },
};

function renderHomePage() {
  const products = store.getProducts();
  const result = filterProducts(products, uiState);
  const wishlistIds = new Set(store.getWishlist().map((entry) => entry.destinationId));
  renderHome(shell.main, {
    products,
    result,
    state: uiState,
    summary: getSummary(products),
    wishlistIds,
    handlers,
    storageNotice,
  });
}

function renderWishlistRoute() {
  const products = store.getProducts();
  const wishlist = store.getWishlist();
  const saved = new Map(products.map((product) => [product.id, product]));
  const visible = wishlist
    .map((entry) => saved.get(entry.destinationId))
    .filter(Boolean);
  renderWishlistPage(shell.main, { products: visible, wishlist, handlers });
}

function render() {
  const activeId = document.activeElement?.id;
  const route = currentRoute();

  updateBadge();

  if (route === 'wishlist') renderWishlistRoute();
  else if (route === 'about') renderAboutPage(shell.main, { appName: APP_NAME });
  else if (route === 'dashboard') {
    const products = store.getProducts();
    renderDashboardPage(shell.main, {
      products,
      summary: getSummary(products),
      handlers,
      form: productForm,
      notice: storageNotice,
    });
  } else renderHomePage();

  if (activeId) {
    const restored = document.getElementById(activeId);
    if (restored) {
      restored.focus();
      if (restored.setSelectionRange && typeof restored.value === 'string') {
        restored.setSelectionRange(restored.value.length, restored.value.length);
      }
    }
  }
}

window.addEventListener('hashchange', render);
window.addEventListener('popstate', () => {
  uiState = readStateFromUrl();
  render();
});

// Sinkron lintas tab: perubahan produk di dashboard langsung memperbarui
// katalog dan marker peta di tab lain yang sedang terbuka.
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEYS.destinations) return;
  const nextProducts = store.getProducts();
  store.removeMissingWishlistItems(nextProducts);
  productForm = emptyProductForm();
  render();
  showToast(shell.toastHost, 'Katalog dan peta disinkronkan dengan perubahan data di tab lain.', 'info');
});

syncUrl();
render();
if (storageNotice) showToast(shell.toastHost, storageNotice, 'warning', 9000);
