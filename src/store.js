// Lapisan penyimpanan lokal. Semua data tinggal di browser, tanpa server.

import { DEFAULT_UI_STATE, STORAGE_KEYS, getSeedProducts } from './products.js';

const memoryFallback = new Map();

function readRaw(key) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? (memoryFallback.has(key) ? memoryFallback.get(key) : null) : value;
  } catch {
    return memoryFallback.has(key) ? memoryFallback.get(key) : null;
  }
}

function writeRaw(key, value) {
  memoryFallback.set(key, value);
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function readJSON(key, fallback) {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  return writeRaw(key, JSON.stringify(value));
}

function ensureSeed() {
  const raw = readRaw(STORAGE_KEYS.destinations);
  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // Fall through ke data contoh.
    }
  }

  const seed = getSeedProducts();
  writeJSON(STORAGE_KEYS.destinations, seed);
  return seed;
}

export function getProducts() {
  return ensureSeed();
}

export function saveProducts(products) {
  return writeJSON(STORAGE_KEYS.destinations, products);
}

export function getProductById(id) {
  return getProducts().find((product) => product.id === id) || null;
}

export function getWishlist() {
  const value = readJSON(STORAGE_KEYS.wishlist, []);
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => entry && typeof entry.destinationId === 'string');
}

export function isWishlisted(id) {
  return getWishlist().some((entry) => entry.destinationId === id);
}

export function toggleWishlist(id) {
  const current = getWishlist();
  const exists = current.some((entry) => entry.destinationId === id);
  const next = exists
    ? current.filter((entry) => entry.destinationId !== id)
    : [...current, { destinationId: id, addedAt: new Date().toISOString() }];
  writeJSON(STORAGE_KEYS.wishlist, next);
  return !exists;
}

export function removeMissingWishlistItems(products) {
  const ids = new Set(products.map((product) => product.id));
  const next = getWishlist().filter((entry) => ids.has(entry.destinationId));
  writeJSON(STORAGE_KEYS.wishlist, next);
  return next;
}

export function getChecklist(id) {
  const all = readJSON(STORAGE_KEYS.checklist, {});
  const entry = all && typeof all === 'object' ? all[id] : null;
  return {
    checkedItems: Array.isArray(entry?.checkedItems) ? entry.checkedItems : [],
    customItems: Array.isArray(entry?.customItems) ? entry.customItems : [],
  };
}

export function saveChecklist(id, state) {
  const all = readJSON(STORAGE_KEYS.checklist, {});
  const base = all && typeof all === 'object' ? all : {};
  base[id] = {
    checkedItems: Array.isArray(state.checkedItems) ? state.checkedItems : [],
    customItems: Array.isArray(state.customItems) ? state.customItems : [],
  };
  return writeJSON(STORAGE_KEYS.checklist, base);
}

export function resetChecklist(id) {
  return saveChecklist(id, { checkedItems: [], customItems: [] });
}

export function getUIState() {
  const stored = readJSON(STORAGE_KEYS.ui, {});
  return { ...DEFAULT_UI_STATE, ...(stored && typeof stored === 'object' ? stored : {}) };
}

export function setUIState(patch) {
  const next = { ...getUIState(), ...patch };
  writeJSON(STORAGE_KEYS.ui, next);
  return next;
}

export function resetAll() {
  writeJSON(STORAGE_KEYS.destinations, getSeedProducts());
  writeJSON(STORAGE_KEYS.wishlist, []);
  writeJSON(STORAGE_KEYS.checklist, {});
  writeJSON(STORAGE_KEYS.ui, DEFAULT_UI_STATE);
}
