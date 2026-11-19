import { describe, expect, it } from 'vitest';
import {
  KATEGORI_BAHARI,
  buildWhatsAppUrl,
  filterProducts,
  getSeedProducts,
  validateProduct,
} from '../src/products.js';

const seed = getSeedProducts();
const names = (items) => items.map((item) => item.nama);

describe('filterProducts', () => {
  it('mencari nama secara case-insensitive', () => {
    const lower = filterProducts(seed, { q: 'menjangan' }).items;
    const mixed = filterProducts(seed, { q: 'MeNjAnGaN' }).items;

    expect(names(lower)).toEqual(['Pulau Menjangan']);
    expect(names(mixed)).toEqual(names(lower));
  });

  it('menggabungkan kategori, wilayah, dan sort biaya secara bersamaan', () => {
    const { items } = filterProducts(seed, {
      kategori: 'Diving',
      wilayah: 'Bali',
      sort: 'biaya_desc',
    });

    expect(names(items)).toEqual(['Tulamben', 'Pulau Menjangan']);
  });

  it('mengembalikan empty state untuk kombinasi wilayah + status yang mustahil', () => {
    const result = filterProducts(seed, { wilayah: 'Sulawesi', status: 'Hidden Gem' });

    expect(result.items).toEqual([]);
  });

  it('mengurutkan nama A–Z dan biaya termurah lebih dulu', () => {
    expect(filterProducts(seed, { sort: 'nama_asc' }).items[0].nama).toBe('Amed');
    expect(filterProducts(seed, { sort: 'biaya_asc' }).items[0].nama).toBe('Padang Padang');
  });

  it('menandai query satu karakter sebagai shortQuery tetapi tetap memakai filter kategori', () => {
    const result = filterProducts(seed, { q: 'b', kategori: 'Pulau' });

    expect(result.shortQuery).toBe(true);
    expect(names(result.items).sort()).toEqual(['Nusa Lembongan', 'Nusa Penida'].sort());
  });
});

describe('validateProduct', () => {
  it('menerima seluruh data contoh tanpa error', () => {
    seed.forEach((product) => expect(validateProduct(product)).toEqual([]));
  });

  it('menolak nama yang kosong atau hanya berisi spasi', () => {
    const errors = validateProduct({ ...seed[0], nama: '   ' });

    expect(errors.map((error) => error.field)).toContain('nama');
  });

  it('menerima estimasiBiaya 0 tetapi menolak nilai negatif dan NaN', () => {
    expect(validateProduct({ ...seed[0], estimasiBiaya: 0 })).toEqual([]);
    expect(validateProduct({ ...seed[0], estimasiBiaya: -1 }).map((e) => e.field)).toContain('estimasiBiaya');
    expect(validateProduct({ ...seed[0], estimasiBiaya: Number.NaN }).map((e) => e.field)).toContain('estimasiBiaya');
  });

  it('menerima kuota 0 tetapi menolak bilangan desimal dan negatif', () => {
    expect(validateProduct({ ...seed[0], kuota: 0 })).toEqual([]);
    expect(validateProduct({ ...seed[0], kuota: 1.5 }).map((e) => e.field)).toContain('kuota');
    expect(validateProduct({ ...seed[0], kuota: -1 }).map((e) => e.field)).toContain('kuota');
  });

  it('hanya menerima empat kategori bahari yang ditentukan', () => {
    KATEGORI_BAHARI.forEach((kategori) => {
      expect(validateProduct({ ...seed[0], kategori })).toEqual([]);
    });

    expect(validateProduct({ ...seed[0], kategori: 'Kuliner' }).map((e) => e.field)).toContain('kategori');
  });

  it('memvalidasi batas koordinat latitude dan longitude', () => {
    expect(validateProduct({ ...seed[0], latitude: -90, longitude: 180 })).toEqual([]);

    const fields = validateProduct({ ...seed[0], latitude: 91, longitude: -181 }).map((e) => e.field);
    expect(fields).toContain('latitude');
    expect(fields).toContain('longitude');
  });
});

describe('buildWhatsAppUrl', () => {
  it('membuat tautan wa.me dengan nomor internasional dan pesan ter-encode', () => {
    const url = buildWhatsAppUrl('+6281234567890', seed[0]);
    const pesan = decodeURIComponent(url.split('?text=')[1]);

    expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
    expect(pesan).toContain('Pulau Menjangan');
    expect(pesan).toContain('18 slot');
    expect(url).not.toContain(' ');
  });

  it.each([
    '6281234567890',
    '+62812',
    '+6281234567890123456',
    'abc',
    '+06281234567890',
  ])('menolak nomor tidak valid: %s', (nomor) => {
    expect(() => buildWhatsAppUrl(nomor, seed[0])).toThrow(/format internasional/);
  });

  it('menolak destinasi tanpa nama', () => {
    expect(() => buildWhatsAppUrl('+6281234567890', { ...seed[0], nama: '  ' }))
      .toThrow(/Destinasi tidak valid/);
  });
});
