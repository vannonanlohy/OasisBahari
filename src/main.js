// Entry point: menghubungkan data, penyimpanan, dan render tanpa framework.

import 'leaflet/dist/leaflet.css';
import './style.css';

import {
  APP_NAME,
  DEFAULT_UI_STATE,
  KATEGORI_BAHARI,
  SORT_OPTIONS,
  filterProducts,
  getSummary,
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

let uiState = readStateFromUrl();

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
  return location.hash.replace(/^#\/?/, '') || 'home';
}

function updateBadge() {
  shell.badge.textContent = String(store.getWishlist().length);
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

  onResetAll() {
    store.resetAll();
    uiState = { ...DEFAULT_UI_STATE };
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
    renderDashboardPage(shell.main, { products, summary: getSummary(products), handlers });
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

store.removeMissingWishlistItems(store.getProducts());
syncUrl();
render();
