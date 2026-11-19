import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS, getSeedProducts } from '../src/products.js';

const KEY = STORAGE_KEYS.destinations;

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

  removeItem(key) {
    this.data.delete(String(key));
  }

  clear() {
    this.data.clear();
  }

  key(index) {
    return [...this.data.keys()][index] ?? null;
  }

  get length() {
    return this.data.size;
  }
}

describe('parser localStorage (store.js)', () => {
  let storage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('localStorage', storage);
    // store.js menyimpan loadNotice di level modul; reset agar tiap test isolat.
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const loadStore = () => import('../src/store.js');

  it('mengisi seed saat key belum ada tanpa notifikasi', async () => {
    const store = await loadStore();

    expect(store.getProducts()).toHaveLength(8);
    expect(store.consumeLoadNotice()).toBe('');
    expect(JSON.parse(storage.getItem(KEY))).toHaveLength(8);
  });

  it('memulihkan seed saat JSON rusak dan menampilkan notifikasi', async () => {
    storage.setItem(KEY, '{ini:bukan-json');

    const store = await loadStore();

    expect(store.getProducts()).toHaveLength(8);
    expect(store.consumeLoadNotice()).toContain('JSON tidak valid');
    expect(() => JSON.parse(storage.getItem(KEY))).not.toThrow();
  });

  it('memulihkan seed saat field bertipe salah dan menghitung jumlah masalah', async () => {
    const broken = getSeedProducts();
    broken[0].kuota = '3';
    broken[1].kategori = 'Kuliner';
    storage.setItem(KEY, JSON.stringify(broken));

    const store = await loadStore();

    expect(store.getProducts()).toHaveLength(8);
    expect(store.consumeLoadNotice()).toContain('2 masalah');
    expect(store.getProducts()[0].kuota).toBe(18);
  });

  it('memulihkan seed saat payload bukan array destinasi', async () => {
    storage.setItem(KEY, JSON.stringify({ destinations: [] }));

    const store = await loadStore();

    expect(store.getProducts()).toHaveLength(8);
    expect(store.consumeLoadNotice()).toContain('tidak valid');
  });

  it('memulihkan seed saat ada id duplikat', async () => {
    const broken = getSeedProducts();
    broken[1].id = broken[0].id;
    storage.setItem(KEY, JSON.stringify(broken));

    const store = await loadStore();

    expect(store.getProducts()).toHaveLength(8);
    expect(store.consumeLoadNotice()).toContain('tidak valid');
  });

  it('memuat array yang valid apa adanya tanpa notifikasi', async () => {
    const custom = getSeedProducts();
    custom[0].nama = 'Destinasi Uji Valid';
    storage.setItem(KEY, JSON.stringify(custom));

    const store = await loadStore();

    expect(store.getProducts()[0].nama).toBe('Destinasi Uji Valid');
    expect(store.consumeLoadNotice()).toBe('');
  });

  it('menulis hasil CRUD langsung ke key oasisbahari:products:v1', async () => {
    const store = await loadStore();
    const updated = { ...store.getProducts()[0], nama: 'Pulau Menjangan Edit' };

    const afterUpsert = store.upsertProduct(updated);
    expect(afterUpsert).toHaveLength(8);
    expect(JSON.parse(storage.getItem(KEY))[0].nama).toBe('Pulau Menjangan Edit');

    const afterDelete = store.deleteProduct(updated.id);
    expect(afterDelete).toHaveLength(7);
    expect(JSON.parse(storage.getItem(KEY))).toHaveLength(7);
  });
});
