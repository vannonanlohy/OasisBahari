import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  STORAGE_KEYS,
  buildWhatsAppUrl,
  getSeedProducts,
  validateProducts,
} from '../src/products.js';
import { isSafeAttribute } from '../src/dom-safety.js';

const KEY = STORAGE_KEYS.destinations;
const seed = getSeedProducts();

class MemoryStorage {
  constructor() {
    this.data = new Map();
  }

  getItem(key) {
    return this.data.has(key) ? this.data.get(key) : null;
  }

  setItem(key, value) {
    this.data.set(String(key), String(value));
  }
}

describe('whitelist field hasil validasi', () => {
  it('membuang field asing dan own __proto__ (mereproduksi celah sebelum patch)', () => {
    const payload = seed.slice(0, 1).map((product) => ({ ...product }));
    payload[0].evil = '<img src=x onerror=alert(1)>';
    Object.defineProperty(payload[0], '__proto__', {
      value: { polluted: true },
      enumerable: true,
      writable: true,
      configurable: true,
    });

    const result = validateProducts(payload);

    expect(result.valid).toBe(true);
    expect(Object.hasOwn(result.products[0], 'evil')).toBe(false);
    expect(Object.hasOwn(result.products[0], '__proto__')).toBe(false);
    expect(({}).polluted).toBeUndefined();
  });

  it('tetap mempertahankan semua field model yang sah', () => {
    const result = validateProducts(seed);

    expect(result.valid).toBe(true);
    expect(Object.keys(result.products[0]).sort()).toEqual(Object.keys(seed[0]).sort());
    expect(result.products[0].checklistBawaan).not.toBe(seed[0].checklistBawaan);
  });
});

describe('parser localStorage dengan key oasisbahari:products:v1', () => {
  let storage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('localStorage', storage);
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('memulihkan seed dari payload rusak tanpa prototype pollution', async () => {
    storage.setItem(KEY, '{"__proto__":{"polluted":true},"destinations":[]}');

    const store = await import('../src/store.js');
    const products = store.getProducts();

    expect(products).toHaveLength(8);
    expect(store.consumeLoadNotice()).toContain('tidak valid');
    expect(({}).polluted).toBeUndefined();
    expect(JSON.parse(storage.getItem('oasisbahari:products:v1'))).toHaveLength(8);
  });

  it('membersihkan field asing dari data localStorage yang valid di memori', async () => {
    const custom = seed.map((product) => ({ ...product }));
    custom[0].evil = '<script>alert(1)</script>';
    storage.setItem(KEY, JSON.stringify(custom));

    const store = await import('../src/store.js');

    expect(Object.hasOwn(store.getProducts()[0], 'evil')).toBe(false);
  });
});

describe('kebijakan URL', () => {
  it('buildWhatsAppUrl menolak nomor mengandung skema atau markup', () => {
    expect(() => buildWhatsAppUrl('javascript:alert(1)', seed[0])).toThrow(/format internasional/);
    expect(() => buildWhatsAppUrl('+6281234567890<script>', seed[0])).toThrow(/format internasional/);
  });

  it('isSafeAttribute menolak skema berbahaya untuk href/src', () => {
    expect(isSafeAttribute('href', 'javascript:alert(1)')).toBe(false);
    expect(isSafeAttribute('href', 'data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeAttribute('href', 'vbscript:msgbox(1)')).toBe(false);
    expect(isSafeAttribute('src', '//evil.example/x.js')).toBe(false);
    expect(isSafeAttribute('src', '')).toBe(false);
  });

  it('isSafeAttribute mengizinkan skema yang dipakai aplikasi', () => {
    expect(isSafeAttribute('href', '#/dashboard')).toBe(true);
    expect(isSafeAttribute('href', '#destinasi')).toBe(true);
    expect(isSafeAttribute('href', 'https://wa.me/6281234567890?text=halo')).toBe(true);
    expect(isSafeAttribute('src', './placeholder.png')).toBe(true);
    expect(isSafeAttribute('src', '/assets/marker.png')).toBe(true);
    expect(isSafeAttribute('title', '<b>bukan URL</b>')).toBe(true);
  });
});
